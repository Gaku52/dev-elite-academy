/**
 * Usage Statistics Library
 *
 * Supabase使用状況統計を取得するための再利用可能なライブラリ
 * 完全並列化、リトライ機構、詳細なエラーログを実装
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ============================================================================
// 型定義
// ============================================================================

/**
 * データベーステーブルのカウント結果
 */
export interface TableCountResult {
  tableName: string;
  count: number;
  success: boolean;
  error?: string;
  retryCount?: number;
}

/**
 * 使用状況統計の詳細データ
 */
export interface UsageStats {
  // 基本テーブル
  categories_count: number;
  learning_contents_count: number;

  // 進捗追跡テーブル
  user_progress_count: number;
  section_progress_count: number;
  learning_sessions_count: number;
  user_learning_progress_count: number;
  daily_progress_count: number;
  daily_learning_progress_count: number;
  learning_streaks_count: number;
  profiles_count: number;

  // 認証
  auth_users_count: number;

  // 集計値
  total_records: number;
  estimated_db_size_mb: number;

  // 推定使用量
  estimated_monthly_requests: number;
  estimated_monthly_bandwidth_gb: number;

  // メタデータ
  last_updated: string;
  detailed_size_breakdown: Record<string, number>;
  active_tables_count: number;
  monitored_tables_count: number;

  // エラー情報
  failed_tables: string[];
  partial_data: boolean;
}

/**
 * リトライ設定
 */
export interface RetryConfig {
  maxRetries: number;
  retryDelayMs: number;
  timeoutMs: number;
}

/**
 * テーブル定義
 */
interface TableDefinition {
  name: string;
  sizePerRecord: number; // KB
  required: boolean; // 必須テーブルかどうか
}

// ============================================================================
// 定数
// ============================================================================

/**
 * デフォルトリトライ設定
 */
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  retryDelayMs: 500,
  timeoutMs: 10000
};

/**
 * 監視対象テーブル定義
 */
const TABLE_DEFINITIONS: TableDefinition[] = [
  { name: 'categories', sizePerRecord: 0.5, required: true },
  { name: 'learning_contents', sizePerRecord: 2.0, required: true },
  { name: 'user_progress', sizePerRecord: 0.3, required: false },
  { name: 'section_progress', sizePerRecord: 0.2, required: false },
  { name: 'learning_sessions', sizePerRecord: 0.2, required: false },
  { name: 'user_learning_progress', sizePerRecord: 0.4, required: false },
  { name: 'daily_progress', sizePerRecord: 0.3, required: false },
  { name: 'daily_learning_progress', sizePerRecord: 0.35, required: false },
  { name: 'learning_streaks', sizePerRecord: 0.25, required: false },
  { name: 'profiles', sizePerRecord: 0.6, required: false }
];

// ============================================================================
// ユーティリティ関数
// ============================================================================

/**
 * スリープ関数（リトライ用）
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * タイムアウト付きPromise実行
 */
async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string = 'Operation timed out'
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    )
  ]);
}

// ============================================================================
// コアデータ取得関数
// ============================================================================

/**
 * リトライ機構付きテーブルカウント取得
 *
 * @param supabase - Supabaseクライアント
 * @param tableName - テーブル名
 * @param retryConfig - リトライ設定
 * @returns カウント結果
 */
async function getTableCountWithRetry(
  supabase: SupabaseClient,
  tableName: string,
  retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<TableCountResult> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      // タイムアウト付きでクエリ実行
      const result = await withTimeout(
        (async () => {
          const response = await supabase.from(tableName).select('*', { count: 'exact', head: true });
          return response;
        })(),
        retryConfig.timeoutMs,
        `Query timeout for table: ${tableName}`
      );

      // 型ガード: resultがオブジェクトかチェック
      if (typeof result !== 'object' || result === null) {
        throw new Error('Invalid response from database');
      }

      // 成功した場合
      const typedResult = result as { error?: { message: string }; count?: number | null };
      if (typedResult.error) {
        throw new Error(typedResult.error.message);
      }

      return {
        tableName,
        count: typedResult.count || 0,
        success: true,
        retryCount: attempt
      };

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // 最後の試行でない場合はリトライ
      if (attempt < retryConfig.maxRetries) {
        console.warn(
          `[usage-stats] Table "${tableName}" query failed (attempt ${attempt + 1}/${retryConfig.maxRetries + 1}):`,
          lastError.message
        );
        await sleep(retryConfig.retryDelayMs * (attempt + 1)); // 指数バックオフ
      }
    }
  }

  // すべてのリトライが失敗
  console.error(
    `[usage-stats] Table "${tableName}" query failed after ${retryConfig.maxRetries + 1} attempts:`,
    lastError?.message
  );

  return {
    tableName,
    count: 0,
    success: false,
    error: lastError?.message,
    retryCount: retryConfig.maxRetries + 1
  };
}

/**
 * 認証ユーザー数取得（リトライ付き）
 *
 * @param supabase - Supabaseクライアント
 * @param retryConfig - リトライ設定
 * @returns ユーザー数
 */
async function getAuthUsersCountWithRetry(
  supabase: SupabaseClient,
  retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<TableCountResult> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      const result = await withTimeout(
        (async () => {
          const response = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
          return response;
        })(),
        retryConfig.timeoutMs,
        'Auth users query timeout'
      );

      // 型ガード
      if (typeof result !== 'object' || result === null) {
        throw new Error('Invalid auth response');
      }

      const typedResult = result as { error?: { message: string }; data?: { users?: unknown[] } };
      if (typedResult.error) {
        throw new Error(typedResult.error.message);
      }

      const count = typedResult.data?.users?.length || 0;

      return {
        tableName: 'auth.users',
        count,
        success: true,
        retryCount: attempt
      };

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < retryConfig.maxRetries) {
        console.warn(
          `[usage-stats] Auth users query failed (attempt ${attempt + 1}/${retryConfig.maxRetries + 1}):`,
          lastError.message
        );
        await sleep(retryConfig.retryDelayMs * (attempt + 1));
      }
    }
  }

  // フォールバック：最小値として1を返す
  console.error(
    `[usage-stats] Auth users query failed after ${retryConfig.maxRetries + 1} attempts:`,
    lastError?.message,
    '- Using fallback value: 1'
  );

  return {
    tableName: 'auth.users',
    count: 1, // フォールバック値
    success: false,
    error: lastError?.message,
    retryCount: retryConfig.maxRetries + 1
  };
}

// ============================================================================
// メイン集計関数
// ============================================================================

/**
 * 完全並列化されたSupabase使用状況統計取得
 *
 * 特徴：
 * - すべてのクエリを完全並列実行（Promise.allSettled使用）
 * - 自動リトライ機構（最大3回）
 * - タイムアウト保護（デフォルト10秒）
 * - 詳細なエラーログ
 * - 部分的なデータでも処理継続
 *
 * @param retryConfig - リトライ設定（オプション）
 * @returns 使用状況統計データまたはnull
 */
export async function getUsageStats(
  retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<UsageStats | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  // 環境変数チェック
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('[usage-stats] Missing Supabase credentials');
    return null;
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    console.time('[usage-stats] Total execution time');

    // ============================================================================
    // フェーズ1: 全テーブルのカウント取得（完全並列化）
    // ============================================================================

    console.time('[usage-stats] Parallel queries');

    // すべてのテーブルクエリを並列実行
    const tableQueryPromises = TABLE_DEFINITIONS.map(tableDef =>
      getTableCountWithRetry(supabaseAdmin, tableDef.name, retryConfig)
    );

    // 認証ユーザー数も並列で取得
    const authUsersPromise = getAuthUsersCountWithRetry(supabaseAdmin, retryConfig);

    // すべてのクエリを並列実行（失敗しても他のクエリは継続）
    const results = await Promise.allSettled([
      ...tableQueryPromises,
      authUsersPromise
    ]);

    console.timeEnd('[usage-stats] Parallel queries');

    // ============================================================================
    // フェーズ2: 結果の集約とエラーハンドリング
    // ============================================================================

    const tableResults: Record<string, TableCountResult> = {};
    const failedTables: string[] = [];
    let authUsersCount = 1; // デフォルト値

    // 結果を処理
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const tableResult = result.value;

        if (tableResult.tableName === 'auth.users') {
          authUsersCount = tableResult.count;
        } else {
          tableResults[tableResult.tableName] = tableResult;
        }

        if (!tableResult.success) {
          failedTables.push(tableResult.tableName);
        }

        // リトライ情報をログ出力
        if (tableResult.retryCount && tableResult.retryCount > 0) {
          console.info(
            `[usage-stats] Table "${tableResult.tableName}" succeeded after ${tableResult.retryCount} retries`
          );
        }
      } else {
        // Promise自体が失敗した場合（通常は発生しない）
        const tableDef = index < TABLE_DEFINITIONS.length
          ? TABLE_DEFINITIONS[index]
          : { name: 'auth.users' };

        console.error(
          `[usage-stats] Promise rejection for table "${tableDef.name}":`,
          result.reason
        );
        failedTables.push(tableDef.name);
      }
    });

    // ============================================================================
    // フェーズ3: 必須テーブルのチェック
    // ============================================================================

    const requiredTables = TABLE_DEFINITIONS.filter(t => t.required);
    const missingRequiredTables = requiredTables.filter(
      t => !tableResults[t.name]?.success
    );

    if (missingRequiredTables.length > 0) {
      console.error(
        '[usage-stats] Missing required tables:',
        missingRequiredTables.map(t => t.name).join(', ')
      );
      // 必須テーブルが取得できない場合でも、部分的なデータは返す
    }

    // ============================================================================
    // フェーズ4: データベースサイズと使用量の計算
    // ============================================================================

    const sizeBreakdown: Record<string, number> = {};
    let totalRecords = authUsersCount;

    // 各テーブルのサイズ計算
    TABLE_DEFINITIONS.forEach(tableDef => {
      const count = tableResults[tableDef.name]?.count || 0;
      sizeBreakdown[tableDef.name] = count * tableDef.sizePerRecord;
      totalRecords += count;
    });

    // 認証ユーザーのサイズ
    sizeBreakdown['auth_users'] = authUsersCount * 0.8;

    // 総データベースサイズ（MB単位）
    const estimatedDbSizeMB = Math.max(
      0.1,
      Object.values(sizeBreakdown).reduce((sum, size) => sum + size, 0) / 1024
    );

    // 月間推定リクエスト数と帯域幅
    const activeTablesCount = Object.values(tableResults).filter(r => r.success).length;
    const averageRequestsPerTable = totalRecords > 0
      ? Math.ceil(totalRecords / Math.max(1, activeTablesCount)) * 50
      : 100;
    const estimatedMonthlyRequests = Math.min(50000, Math.max(100, averageRequestsPerTable));
    const estimatedMonthlyBandwidthGB = Math.min(5, Math.max(0.01, estimatedDbSizeMB * 0.15));

    // ============================================================================
    // フェーズ5: 最終結果の構築
    // ============================================================================

    const usageStats: UsageStats = {
      // 基本テーブル
      categories_count: tableResults.categories?.count || 0,
      learning_contents_count: tableResults.learning_contents?.count || 0,

      // 進捗追跡テーブル
      user_progress_count: tableResults.user_progress?.count || 0,
      section_progress_count: tableResults.section_progress?.count || 0,
      learning_sessions_count: tableResults.learning_sessions?.count || 0,
      user_learning_progress_count: tableResults.user_learning_progress?.count || 0,
      daily_progress_count: tableResults.daily_progress?.count || 0,
      daily_learning_progress_count: tableResults.daily_learning_progress?.count || 0,
      learning_streaks_count: tableResults.learning_streaks?.count || 0,
      profiles_count: tableResults.profiles?.count || 0,

      // 認証
      auth_users_count: authUsersCount,

      // 集計値
      total_records: totalRecords,
      estimated_db_size_mb: estimatedDbSizeMB,

      // 推定使用量
      estimated_monthly_requests: estimatedMonthlyRequests,
      estimated_monthly_bandwidth_gb: estimatedMonthlyBandwidthGB,

      // メタデータ
      last_updated: new Date().toISOString(),
      detailed_size_breakdown: sizeBreakdown,
      active_tables_count: TABLE_DEFINITIONS.length + 1, // +1 for auth.users
      monitored_tables_count: activeTablesCount + 1,

      // エラー情報
      failed_tables: failedTables,
      partial_data: failedTables.length > 0
    };

    console.timeEnd('[usage-stats] Total execution time');

    // サマリーログ
    console.info('[usage-stats] Statistics summary:', {
      totalRecords,
      estimatedDbSizeMB: estimatedDbSizeMB.toFixed(2),
      successfulTables: activeTablesCount,
      failedTables: failedTables.length,
      partialData: failedTables.length > 0
    });

    if (failedTables.length > 0) {
      console.warn('[usage-stats] Failed tables:', failedTables.join(', '));
    }

    return usageStats;

  } catch (error) {
    console.error('[usage-stats] Critical error during stats collection:', error);
    return null;
  }
}

// ============================================================================
// 追加のユーティリティ関数
// ============================================================================

/**
 * 特定のテーブルのカウントのみを取得（単体テスト用）
 *
 * @param tableName - テーブル名
 * @param retryConfig - リトライ設定
 * @returns カウント結果
 */
export async function getSingleTableCount(
  tableName: string,
  retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<TableCountResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return {
      tableName,
      count: 0,
      success: false,
      error: 'Missing Supabase credentials'
    };
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  return getTableCountWithRetry(supabaseAdmin, tableName, retryConfig);
}

/**
 * 使用状況統計のキャッシュキー生成
 * ISRやReact Queryで使用
 */
export function getUsageStatsCacheKey(): string {
  const now = new Date();
  // 1時間ごとにキャッシュキーを変更
  const hourKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;
  return `usage-stats-${hourKey}`;
}
