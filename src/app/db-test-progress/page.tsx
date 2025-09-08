import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

async function testProgressTables() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return { error: 'Environment variables not set' };
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    // 各テーブルの存在確認
    const tables = [
      'user_progress',
      'section_progress',
      'learning_notes',
      'quiz_results',
      'learning_sessions'
    ];

    const results: Record<string, { exists: boolean; error?: string; count: number }> = {};

    for (const table of tables) {
      const { count, error } = await supabaseAdmin
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      results[table] = {
        exists: !error,
        error: error?.message,
        count: count || 0
      };
    }

    return results;
  } catch (error) {
    return { error: String(error) };
  }
}

export default async function DBTestProgressPage() {
  const testResults = await testProgressTables();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          📊 進捗管理テーブル接続テスト
        </h1>

        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">テーブル確認結果</h2>
          
          <div className="space-y-3">
            {Object.entries(testResults).map(([table, result]) => (
              <div
                key={table}
                className={`p-4 rounded-lg border ${
                  result.exists 
                    ? 'bg-green-800/20 border-green-700/50' 
                    : 'bg-red-800/20 border-red-700/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`text-2xl ${result.exists ? '✅' : '❌'}`} />
                    <span className="text-white font-medium">{table}</span>
                  </div>
                  <div>
                    {result.exists ? (
                      <span className="text-green-400 text-sm">
                        テーブル存在（{result.count}件）
                      </span>
                    ) : (
                      <span className="text-red-400 text-sm">
                        {result.error || 'テーブルが存在しません'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-purple-800/30 border border-purple-700/50 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-3">💡 テーブルが存在しない場合</h3>
          <ol className="text-gray-300 space-y-2 text-sm">
            <li>1. Supabaseダッシュボードにログイン</li>
            <li>2. SQL Editorを開く</li>
            <li>3. <code className="bg-black/50 px-2 py-1 rounded">supabase/migrations/002_user_progress.sql</code>の内容をコピー</li>
            <li>4. SQL Editorに貼り付けて実行</li>
            <li>5. このページをリロードして確認</li>
          </ol>
        </div>

        <div className="mt-8 flex space-x-4">
          <Link
            href="/"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            ← ホームに戻る
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            📊 ダッシュボードへ
          </Link>
        </div>
      </div>
    </div>
  );
}