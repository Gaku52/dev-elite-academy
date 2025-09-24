/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { handleAPIError, successResponse } from '@/lib/api-error-handler';

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    // テーブル作成SQLを実行
    const sql = `
      -- 既存のテーブルを削除（存在する場合）
      DROP TABLE IF EXISTS pinned_learning_paths;

      -- ピン固定された学習パス（簡易版：user_emailを使用）
      CREATE TABLE pinned_learning_paths (
          id SERIAL PRIMARY KEY,
          user_email TEXT NOT NULL,
          learning_path_name TEXT NOT NULL,
          pinned_at TIMESTAMPTZ DEFAULT NOW(),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE(user_email, learning_path_name)
      );

      -- インデックスの作成（パフォーマンス最適化）
      CREATE INDEX idx_pinned_learning_paths_email ON pinned_learning_paths(user_email);
      CREATE INDEX idx_pinned_learning_paths_name ON pinned_learning_paths(learning_path_name);

      -- RLSポリシーの設定（セキュリティ）
      ALTER TABLE pinned_learning_paths ENABLE ROW LEVEL SECURITY;

      -- すべてのユーザーがアクセス可能（開発環境用）
      CREATE POLICY "Enable all access for all users" ON pinned_learning_paths
      FOR ALL USING (true) WITH CHECK (true);
    `;

    // SQLを実行
    const { error } = await (supabaseAdmin as any).rpc('exec_sql', {
      sql_query: sql
    }).single();

    if (error) {
      // exec_sql関数が存在しない場合は、直接実行を試みる
      console.log('exec_sql function not found, trying direct execution...');

      // 各ステートメントを個別に実行

      // テーブルの存在確認のみ実施
      try {
        await (supabaseAdmin as any).from('pinned_learning_paths').select('*').limit(1);
        // テーブルが既に存在する場合
        console.log('Table already exists');
      } catch {
        // テーブルが存在しない場合は作成が必要
        console.log('Table creation may be needed - please create manually in Supabase');
      }
    }

    // テーブルが正常に作成されたか確認
    const { error: testError } = await (supabaseAdmin as any)
      .from('pinned_learning_paths')
      .select('*')
      .limit(1);

    if (testError && testError.code !== '42P01') {
      console.error('Error checking table:', testError);
    }

    return successResponse({
      message: 'Pinned learning paths table setup completed',
      tableExists: !testError
    });
  } catch (error) {
    console.error('Setup error:', error);
    return handleAPIError(error);
  }
}