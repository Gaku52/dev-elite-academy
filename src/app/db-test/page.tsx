import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// 型定義は実際のSupabaseレスポンスから推論

// サーバーサイドでのデータ取得
async function getServerData() {
  // 本番環境（Vercel）の環境変数を直接参照
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  // デバッグ情報を追加（本番環境での確認用）
  const debugInfo = {
    hasUrl: !!supabaseUrl,
    hasServiceKey: !!supabaseServiceKey,
    nodeEnv: process.env.NODE_ENV,
    platform: process.env.VERCEL ? 'Vercel' : 'Local'
  };

  if (!supabaseUrl || !supabaseServiceKey) {
    return { 
      categories: [], 
      learningContents: [], 
      error: `環境変数が設定されていません。Debug info: ${JSON.stringify(debugInfo)}` 
    };
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    // Categoriesを並行取得
    const categoriesPromise = supabaseAdmin
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    // Learning Contentsを並行取得
    const contentsPromise = supabaseAdmin
      .from('learning_contents')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    // 並行実行で高速化
    const [categoriesResult, contentsResult] = await Promise.all([
      categoriesPromise,
      contentsPromise
    ]);

    const categories = categoriesResult.data || [];
    const learningContents = contentsResult.data || [];

    const categoryError = categoriesResult.error;
    const contentError = contentsResult.error;
    
    let errorMsg = null;
    if (categoryError) errorMsg = `Categories error: ${categoryError.message}`;
    if (contentError) errorMsg = errorMsg ? `${errorMsg} | Contents error: ${contentError.message}` : `Contents error: ${contentError.message}`;
    
    return {
      categories,
      learningContents,
      error: errorMsg
    };
  } catch (err) {
    console.error('Database connection error:', err);
    return { categories: [], learningContents: [], error: `サーバーエラー: ${err instanceof Error ? err.message : String(err)}` };
  }
}

// Server Component（高速表示）
export default async function DbTestPage() {
  const { categories, learningContents, error } = await getServerData();

  const difficultyColors = {
    EASY: 'bg-green-100 text-green-800 border-green-200',
    MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
    HARD: 'bg-red-100 text-red-800 border-red-200'
  };

  const contentTypeIcons = {
    ARTICLE: '📖',
    VIDEO: '📺',
    QUIZ: '❓',
    EXERCISE: '💪',
    FLASHCARD: '🃏'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧪 Database Connection Test
          </h1>
          <p className="text-gray-800">
            🚀 Server Component - 高速なデータベース接続とレンダリング
          </p>
        </div>

        {/* テスト結果サマリー */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className={`p-6 rounded-lg border-2 ${
            categories.length > 0
              ? 'bg-green-800/20 border-green-500' 
              : 'bg-red-800/20 border-red-500'
          }`}>
            <h3 className="text-xl font-semibold text-white mb-2">
              {categories.length > 0 ? '✅' : '❌'} Categories テーブル
            </h3>
            <p className="text-gray-800">
              データ件数: {categories.length}件
            </p>
          </div>

          <div className={`p-6 rounded-lg border-2 ${
            learningContents.length > 0
              ? 'bg-green-800/20 border-green-500' 
              : 'bg-red-800/20 border-red-500'
          }`}>
            <h3 className="text-xl font-semibold text-white mb-2">
              {learningContents.length > 0 ? '✅' : '❌'} Learning Contents テーブル
            </h3>
            <p className="text-gray-800">
              データ件数: {learningContents.length}件
            </p>
          </div>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-800/20 border border-red-500 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-red-400 mb-2">❌ エラーが発生しました</h3>
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Categories データ表示 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">📚 Categories データ</h2>
          {categories.length > 0 ? (
            <div className="bg-slate-800/50 rounded-lg p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="text-purple-400 pb-2">ID</th>
                      <th className="text-purple-400 pb-2">名前</th>
                      <th className="text-purple-400 pb-2">説明</th>
                      <th className="text-purple-400 pb-2">アイコン</th>
                      <th className="text-purple-400 pb-2">色</th>
                      <th className="text-purple-400 pb-2">順序</th>
                      <th className="text-purple-400 pb-2">有効</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category.id} className="border-b border-slate-700">
                        <td className="text-white py-2">{category.id}</td>
                        <td className="text-white py-2">{category.name}</td>
                        <td className="text-gray-800 py-2">{category.description}</td>
                        <td className="text-yellow-400 py-2 text-xl">{category.icon}</td>
                        <td className="text-white py-2">
                          <div 
                            className="w-4 h-4 rounded-full inline-block mr-2" 
                            style={{ backgroundColor: category.color || '#gray' }}
                          ></div>
                          {category.color}
                        </td>
                        <td className="text-white py-2">{category.sort_order}</td>
                        <td className="text-white py-2">
                          {category.is_active ? '✅' : '❌'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-gray-800">データが見つかりません</p>
            </div>
          )}
        </div>

        {/* Learning Contents データ表示 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">📖 Learning Contents データ</h2>
          {learningContents.length > 0 ? (
            <div className="bg-slate-800/50 rounded-lg p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="text-purple-400 pb-2">ID</th>
                      <th className="text-purple-400 pb-2">タイトル</th>
                      <th className="text-purple-400 pb-2">タイプ</th>
                      <th className="text-purple-400 pb-2">難易度</th>
                      <th className="text-purple-400 pb-2">時間(分)</th>
                      <th className="text-purple-400 pb-2">タグ</th>
                      <th className="text-purple-400 pb-2">公開</th>
                    </tr>
                  </thead>
                  <tbody>
                    {learningContents.map((content) => (
                      <tr key={content.id} className="border-b border-slate-700">
                        <td className="text-white py-2">{content.id}</td>
                        <td className="text-white py-2">{content.title}</td>
                        <td className="text-blue-400 py-2">
                          {contentTypeIcons[content.content_type as keyof typeof contentTypeIcons]} {content.content_type}
                        </td>
                        <td className="py-2">
                          <span className={`px-2 py-1 rounded-full text-xs border ${difficultyColors[content.difficulty as keyof typeof difficultyColors]}`}>
                            {content.difficulty}
                          </span>
                        </td>
                        <td className="text-white py-2">{content.estimated_time}</td>
                        <td className="text-gray-800 py-2">
                          {content.tags.slice(0, 3).join(', ')}
                          {content.tags.length > 3 && '...'}
                        </td>
                        <td className="text-white py-2">
                          {content.is_published ? '✅' : '❌'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-gray-800">データが見つかりません</p>
            </div>
          )}
        </div>

        {/* パフォーマンス情報 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">⚡ パフォーマンス改善</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-700">レンダリング:</p>
              <p className="text-gray-900 font-mono">🚀 Server Component</p>
            </div>
            <div>
              <p className="text-gray-700">データ取得:</p>
              <p className="text-gray-900 font-mono">⚡ 並行実行</p>
            </div>
            <div>
              <p className="text-gray-700">初期読み込み:</p>
              <p className="text-gray-900 font-mono">📈 高速化完了</p>
            </div>
          </div>
        </div>

        {/* ナビゲーション */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            ← ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}