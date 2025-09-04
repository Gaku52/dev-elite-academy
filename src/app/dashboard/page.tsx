import { 
  Book, 
  Clock, 
  Target, 
  TrendingUp,
  PlayCircle,
  CheckCircle,
  BookOpen,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// サーバーサイドでのデータ取得
async function getDashboardData() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return { categories: [], learningContents: [] };
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    const [categoriesResult, contentsResult] = await Promise.all([
      supabaseAdmin.from('categories').select('*').eq('is_active', true).order('sort_order'),
      supabaseAdmin.from('learning_contents').select('*').eq('is_published', true).order('created_at', { ascending: false })
    ]);

    return {
      categories: categoriesResult.data || [],
      learningContents: contentsResult.data || []
    };
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    return { categories: [], learningContents: [] };
  }
}

// Server Component（高速表示）
export default async function Dashboard() {
  const { categories, learningContents } = await getDashboardData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-purple-800/30 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-400 mr-3" />
              <h1 className="text-xl font-semibold text-white">学習ダッシュボード</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/usage"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                📊 使用状況監視
              </Link>
              <Link
                href="/db-test"
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                🧪 DB接続テスト
              </Link>
              <Link
                href="/"
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                ← ホームに戻る
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            🚀 学習の旅を始めましょう
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            🚀 Server Component - 高速データベース連携で効率的なスキルアップ
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 rounded-lg p-6 border border-purple-700/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">利用可能コンテンツ</p>
                <p className="text-2xl font-bold text-white">{learningContents.length}</p>
              </div>
              <Book className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-800/30 to-cyan-800/30 rounded-lg p-6 border border-blue-700/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm">学習カテゴリー</p>
                <p className="text-2xl font-bold text-white">{categories.length}</p>
              </div>
              <Target className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-800/30 to-emerald-800/30 rounded-lg p-6 border border-green-700/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm">学習時間（予想）</p>
                <p className="text-2xl font-bold text-white">
                  {Math.round(learningContents.reduce((total, content) => total + (content.estimated_time || 0), 0) / 60)}時間
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-800/30 to-orange-800/30 rounded-lg p-6 border border-yellow-700/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-300 text-sm">完了率</p>
                <p className="text-2xl font-bold text-white">0%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">📚 学習カテゴリー</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 rounded-lg p-6 border border-slate-600/30 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
                    {category.icon}
                  </span>
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color || '#8B5CF6' }}
                  ></div>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {category.name}
                </h4>
                <p className="text-gray-400 text-sm">
                  {category.description}
                </p>
                <div className="mt-4 text-xs text-purple-400">
                  {learningContents.filter(content => content.category_id === category.id).length} コンテンツ
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Content */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">🆕 最新の学習コンテンツ</h3>
          {learningContents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningContents.slice(0, 6).map((content) => (
                <Link
                  key={content.id}
                  href={`/learn/${content.id}`}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 rounded-lg p-6 border border-slate-600/30 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group block"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-400 text-sm capitalize">
                        {content.content_type}
                      </span>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs border bg-green-100 text-green-800 border-green-200">
                      {content.difficulty}
                    </span>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {content.title}
                  </h4>
                  
                  <p className="text-gray-400 text-sm mb-4">
                    {content.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{content.estimated_time}分</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(content.tags || []).slice(0, 2).map((tag: string) => (
                        <span key={tag} className="px-2 py-1 bg-purple-800/30 text-purple-300 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-slate-800/50 rounded-lg p-8 text-center">
              <p className="text-gray-400">学習コンテンツが見つかりません</p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-8 border border-purple-500/30">
          <h3 className="text-2xl font-bold text-white mb-4">
            🎯 今すぐ学習を開始しよう！
          </h3>
          <p className="text-gray-300 mb-6">
            高速データベース連携で効率的な学習体験を提供
          </p>
          <Link
            href="/modules/ai-ml"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <PlayCircle className="w-5 h-5 mr-2" />
            Claude Code学習を始める
          </Link>
        </div>
      </div>
    </div>
  );
}