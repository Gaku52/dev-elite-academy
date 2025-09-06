import { 
  Clock, 
  PlayCircle,
  BookOpen,
  Trophy,
  Star,
  ChevronRight,
  BarChart3,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import Header from '@/components/Header';
import UserProgressTracker from '@/components/UserProgressTracker';

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
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            学習ダッシュボード
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            高年収エンジニアへの道のり。あなたの学習進捗を追跡し、スキルアップの成果を可視化します。
          </p>
        </div>

        {/* User Progress Tracker */}
        <UserProgressTracker totalContents={learningContents.length} />

        {/* Learning Path Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center">
              <BarChart3 className="w-6 h-6 mr-3 text-purple-400" />
              学習パス
            </h3>
            <Link 
              href="/learn"
              className="text-purple-400 hover:text-purple-300 transition-colors flex items-center text-sm"
            >
              すべて見る <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
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

        {/* Quick Start Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center">
              <PlayCircle className="w-6 h-6 mr-3 text-green-400" />
              今すぐ始める
            </h3>
            <p className="text-gray-400 text-sm">最新の学習コンテンツから選択</p>
          </div>
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

        {/* Motivation Section */}
        <div className="mt-12 text-center bg-gradient-to-r from-indigo-800/20 to-purple-800/20 rounded-xl p-8 border border-indigo-500/30">
          <div className="flex items-center justify-center mb-4">
            <Star className="w-8 h-8 text-yellow-400 mr-2" />
            <Trophy className="w-8 h-8 text-yellow-400 mr-2" />
            <Star className="w-8 h-8 text-yellow-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            高年収エンジニアへの挑戦
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            技術力を向上させ、市場価値を高める学習を今すぐ始めましょう。継続的な成長があなたの未来を変えます。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/learn"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              学習を開始する
            </Link>
            <Link
              href="#"
              className="inline-flex items-center px-8 py-3 bg-transparent border-2 border-purple-500 text-purple-300 font-semibold rounded-lg hover:bg-purple-500/10 transition-all duration-300"
            >
              <Calendar className="w-5 h-5 mr-2" />
              学習計画を立てる
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}