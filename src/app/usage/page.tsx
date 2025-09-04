import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { 
  Database, 
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Server,
  HardDrive
} from 'lucide-react';

// Supabase無料プラン制限
const FREE_PLAN_LIMITS = {
  database_size_mb: 500,      // 500MB
  monthly_requests: 50000,    // 50,000リクエスト/月
  concurrent_connections: 60,  // 60同時接続
  monthly_bandwidth_gb: 5,    // 5GB帯域幅/月
  auth_users: 50000,          // 50,000認証ユーザー
  storage_gb: 1,              // 1GBストレージ
  edge_functions: 500000      // 500,000 Edge Function実行/月
};

// サーバーサイドでのDB使用状況取得
async function getUsageStats() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    // テーブルサイズとレコード数を取得
    const [categoriesResult, contentsResult] = await Promise.all([
      supabaseAdmin.from('categories').select('*', { count: 'exact' }),
      supabaseAdmin.from('learning_contents').select('*', { count: 'exact' })
    ]);

    // データベースサイズの推定（概算）
    const totalRecords = (categoriesResult.count || 0) + (contentsResult.count || 0);
    const estimatedDbSizeMB = Math.max(0.1, totalRecords * 0.001); // 1レコード ≈ 1KB と仮定

    return {
      categories_count: categoriesResult.count || 0,
      learning_contents_count: contentsResult.count || 0,
      total_records: totalRecords,
      estimated_db_size_mb: estimatedDbSizeMB,
      last_updated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Usage stats fetch error:', error);
    return null;
  }
}

// 使用率の計算とステータス判定
function getUsageStatus(current: number, limit: number) {
  const percentage = (current / limit) * 100;
  
  if (percentage >= 90) {
    return { status: 'danger', color: 'red', message: '危険' };
  } else if (percentage >= 70) {
    return { status: 'warning', color: 'yellow', message: '注意' };
  } else {
    return { status: 'safe', color: 'green', message: '正常' };
  }
}

export default async function UsagePage() {
  const usageStats = await getUsageStats();
  
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleDateString('ja-JP', { 
    year: 'numeric', 
    month: 'long' 
  });

  // 使用状況の項目
  const usageItems = [
    {
      name: 'データベース容量',
      icon: <Database className="w-6 h-6" />,
      current: usageStats?.estimated_db_size_mb || 0,
      limit: FREE_PLAN_LIMITS.database_size_mb,
      unit: 'MB',
      description: 'テーブルデータのストレージ使用量'
    },
    {
      name: 'テーブルレコード数',
      icon: <HardDrive className="w-6 h-6" />,
      current: usageStats?.total_records || 0,
      limit: 100000, // 推定値
      unit: '件',
      description: '全テーブルの合計レコード数'
    },
    {
      name: 'カテゴリー',
      icon: <Server className="w-6 h-6" />,
      current: usageStats?.categories_count || 0,
      limit: 1000, // 推定値
      unit: '件',
      description: 'categoriesテーブルのレコード数'
    },
    {
      name: '学習コンテンツ',
      icon: <Activity className="w-6 h-6" />,
      current: usageStats?.learning_contents_count || 0,
      limit: 10000, // 推定値
      unit: '件',
      description: 'learning_contentsテーブルのレコード数'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            📊 Supabase使用状況モニター
          </h1>
          <p className="text-gray-300">
            無料プラン制限の監視と有料プラン移行タイミングの判断
          </p>
          <p className="text-sm text-gray-400 mt-2">
            対象期間: {currentMonth} | 最終更新: {usageStats?.last_updated ? new Date(usageStats.last_updated).toLocaleString('ja-JP') : '取得中'}
          </p>
        </div>

        {/* 無料プラン概要 */}
        <div className="bg-gradient-to-r from-blue-800/30 to-cyan-800/30 rounded-lg p-6 mb-8 border border-blue-700/30">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <CheckCircle className="w-6 h-6 mr-2 text-blue-400" />
            Supabase無料プラン制限
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-blue-300">データベース容量</p>
              <p className="text-white font-mono">{FREE_PLAN_LIMITS.database_size_mb}MB</p>
            </div>
            <div>
              <p className="text-blue-300">月間リクエスト</p>
              <p className="text-white font-mono">{FREE_PLAN_LIMITS.monthly_requests.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-blue-300">同時接続数</p>
              <p className="text-white font-mono">{FREE_PLAN_LIMITS.concurrent_connections}</p>
            </div>
            <div>
              <p className="text-blue-300">月間帯域幅</p>
              <p className="text-white font-mono">{FREE_PLAN_LIMITS.monthly_bandwidth_gb}GB</p>
            </div>
          </div>
        </div>

        {/* 使用状況詳細 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {usageItems.map((item) => {
            const status = getUsageStatus(item.current, item.limit);
            const percentage = Math.min(100, (item.current / item.limit) * 100);
            
            return (
              <div
                key={item.name}
                className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/30"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-${status.color}-800/30 border border-${status.color}-700/30`}>
                      <div className={`text-${status.color}-400`}>
                        {item.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm bg-${status.color}-800/30 text-${status.color}-300 border border-${status.color}-700/50`}>
                    {status.message}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">
                      {item.current.toLocaleString()} / {item.limit.toLocaleString()} {item.unit}
                    </span>
                    <span className={`font-mono text-${status.color}-300`}>
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full bg-gradient-to-r transition-all duration-500 ${
                        status.status === 'danger' 
                          ? 'from-red-500 to-red-600' 
                          : status.status === 'warning'
                          ? 'from-yellow-500 to-orange-500'
                          : 'from-green-500 to-blue-500'
                      }`}
                      style={{ width: `${Math.min(100, percentage)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 有料プラン移行判断 */}
        <div className="bg-gradient-to-r from-purple-800/30 to-pink-800/30 rounded-lg p-6 mb-8 border border-purple-700/30">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-purple-400" />
            有料プラン移行判断
          </h2>
          
          {/* 総合判定 */}
          <div className="mb-6">
            {usageStats && (
              (() => {
                const dbUsage = (usageStats.estimated_db_size_mb / FREE_PLAN_LIMITS.database_size_mb) * 100;
                
                if (dbUsage >= 80) {
                  return (
                    <div className="flex items-center space-x-3 p-4 bg-red-800/30 border border-red-700/50 rounded-lg">
                      <AlertTriangle className="w-8 h-8 text-red-400" />
                      <div>
                        <p className="text-white font-semibold">🚨 有料プラン移行推奨</p>
                        <p className="text-red-300 text-sm">データベース使用率が{dbUsage.toFixed(1)}%に達しています</p>
                      </div>
                    </div>
                  );
                } else if (dbUsage >= 60) {
                  return (
                    <div className="flex items-center space-x-3 p-4 bg-yellow-800/30 border border-yellow-700/50 rounded-lg">
                      <AlertTriangle className="w-8 h-8 text-yellow-400" />
                      <div>
                        <p className="text-white font-semibold">⚠️ 監視強化期間</p>
                        <p className="text-yellow-300 text-sm">使用量増加を注意深く監視してください</p>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className="flex items-center space-x-3 p-4 bg-green-800/30 border border-green-700/50 rounded-lg">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                      <div>
                        <p className="text-white font-semibold">✅ 無料プランで問題なし</p>
                        <p className="text-green-300 text-sm">現在の使用量なら無料プランで継続可能です</p>
                      </div>
                    </div>
                  );
                }
              })()
            )}
          </div>

          {/* 推奨アクション */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/30">
              <h4 className="text-white font-semibold mb-2">📈 Pro Plan (月$25)</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• データベース: 8GB</li>
                <li>• 月間帯域幅: 250GB</li>
                <li>• 同時接続: 200</li>
                <li>• 自動バックアップ</li>
              </ul>
            </div>
            
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/30">
              <h4 className="text-white font-semibold mb-2">🚀 Team Plan (月$599)</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• データベース: 500GB</li>
                <li>• 月間帯域幅: 2.5TB</li>
                <li>• 同時接続: 1,500</li>
                <li>• 高度な監視・サポート</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors mr-4"
          >
            ← ホームに戻る
          </Link>
          <Link
            href="/db-test"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            🧪 DB接続テスト
          </Link>
        </div>
      </div>
    </div>
  );
}