import {
  Clock,
  PlayCircle,
  BookOpen,
  Trophy,
  Star,
  ChevronRight,
  BarChart3,
  Calendar,
  Pin
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import Header from '@/components/Header';
import UserProgressTracker from '@/components/UserProgressTracker';
import CategoryContentCount from '@/components/CategoryContentCount';
import { getLearningPathUrl } from '@/lib/learning-paths';

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

'use client';

import { useState, useEffect } from 'react';

// PinButton コンポーネント
function PinButton({ contentId, initialPinned = false }: { contentId: number; initialPinned?: boolean }) {
  const [isPinned, setIsPinned] = useState(initialPinned);
  const [isLoading, setIsLoading] = useState(false);

  const togglePin = async () => {
    setIsLoading(true);
    try {
      const userEmail = 'user@example.com'; // TODO: 実際のユーザーメール取得
      const method = isPinned ? 'DELETE' : 'POST';

      const response = await fetch('/api/pinned-contents', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail,
          contentId,
        }),
      });

      if (response.ok) {
        setIsPinned(!isPinned);
      }
    } catch (error) {
      console.error('Error toggling pin:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={togglePin}
      disabled={isLoading}
      className={`p-2 rounded-full transition-all duration-200 ${
        isPinned
          ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
          : 'bg-gray-700/20 text-gray-400 hover:bg-gray-600/30 hover:text-gray-300'
      }`}
      title={isPinned ? 'ピン留めを解除' : 'ピン留めする'}
    >
      <Pin className={`w-4 h-4 ${isPinned ? 'fill-current' : ''}`} />
    </button>
  );
}

// Dashboard コンポーネント（Client Component に変更）
export default function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [learningContents, setLearningContents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
          console.error('Supabase credentials not found');
          return;
        }

        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        const [categoriesResult, contentsResult] = await Promise.all([
          supabase.from('categories').select('*').eq('is_active', true).order('sort_order'),
          supabase.from('learning_contents').select('*').eq('is_published', true).order('created_at', { ascending: false })
        ]);

        setCategories(categoriesResult.data || []);
        setLearningContents(contentsResult.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container-modern py-6 sm:py-8 md:py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-[#8E9C78] rounded-2xl shadow-sm">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-4">
            学習ダッシュボード
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-[#6F6F6F] max-w-3xl mx-auto">
            高年収エンジニアへの道のり。あなたの学習進捗を追跡し、スキルアップの成果を可視化します。
          </p>
        </div>

        {/* User Progress Tracker */}
        <UserProgressTracker totalContents={learningContents.length} />

        {/* Learning Path Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-black flex items-center">
              <BarChart3 className="w-6 h-6 mr-3 text-[#8E9C78]" />
              学習パス
            </h3>
            <Link 
              href="/learn"
              className="text-[#8E9C78] hover:text-[#7a8a6a] transition-colors flex items-center text-sm"
            >
              すべて見る <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((category) => {
              const pathUrl = getLearningPathUrl(category.name);
              
              if (pathUrl) {
                return (
                  <Link
                    key={category.id}
                    href={pathUrl}
                    className="card-modern p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1 block"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-3xl">
                        {category.icon}
                      </span>
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color || '#8E9C78' }}
                      ></div>
                    </div>
                    <h4 className="text-lg font-semibold text-black mb-2 group-hover:text-[#8E9C78] transition-colors">
                      {category.name}
                    </h4>
                    <p className="text-[#6F6F6F] text-sm">
                      {category.description}
                    </p>
                    <div className="mt-4">
                      <CategoryContentCount
                        categoryName={category.name}
                        fallbackCount={learningContents.filter(content => content.category_id === category.id).length}
                      />
                    </div>
                  </Link>
                );
              }
              
              return (
                <div
                  key={category.id}
                  className="card-modern p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">
                      {category.icon}
                    </span>
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color || '#8E9C78' }}
                    ></div>
                  </div>
                  <h4 className="text-lg font-semibold text-black mb-2 group-hover:text-[#8E9C78] transition-colors">
                    {category.name}
                  </h4>
                  <p className="text-[#6F6F6F] text-sm">
                    {category.description}
                  </p>
                  <div className="mt-4">
                    <CategoryContentCount
                      categoryName={category.name}
                      fallbackCount={learningContents.filter(content => content.category_id === category.id).length}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Start Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-black flex items-center">
              <PlayCircle className="w-6 h-6 mr-3 text-green-500" />
              今すぐ始める
            </h3>
            <p className="text-[#6F6F6F] text-sm">最新の学習コンテンツから選択</p>
          </div>
          {learningContents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {learningContents.slice(0, 6).map((content) => (
                <Link
                  key={content.id}
                  href={`/learn/${content.id}`}
                  className="card-modern p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group block hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-[#8E9C78]" />
                      <span className="text-[#8E9C78] text-sm capitalize">
                        {content.content_type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <PinButton contentId={content.id} />
                      <span className="px-2 py-1 rounded-full text-xs border bg-green-50 text-green-800 border-green-200">
                        {content.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-black mb-2 group-hover:text-[#8E9C78] transition-colors">
                    {content.title}
                  </h4>
                  
                  <p className="text-[#6F6F6F] text-sm mb-4">
                    {content.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-[#6F6F6F]">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{content.estimated_time}分</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(content.tags || []).slice(0, 2).map((tag: string) => (
                        <span key={tag} className="px-2 py-1 bg-[#8E9C78]/10 text-[#8E9C78] rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="card-modern p-8 text-center">
              <p className="text-[#6F6F6F]">学習コンテンツが見つかりません</p>
            </div>
          )}
        </div>

        {/* Motivation Section */}
        <div className="mt-12 text-center bg-[#8E9C78]/10 rounded-2xl p-8 border border-[#8E9C78]/20">
          <div className="flex items-center justify-center mb-4">
            <Star className="w-8 h-8 text-yellow-500 mr-2" />
            <Trophy className="w-8 h-8 text-yellow-500 mr-2" />
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
          <h3 className="text-2xl font-bold text-black mb-4">
            高年収エンジニアへの挑戦
          </h3>
          <p className="text-[#6F6F6F] mb-6 max-w-2xl mx-auto">
            技術力を向上させ、市場価値を高める学習を今すぐ始めましょう。継続的な成長があなたの未来を変えます。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/learn"
              className="btn-modern inline-flex items-center px-8 py-3"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              学習を開始する
            </Link>
            <Link
              href="#"
              className="btn-secondary inline-flex items-center px-8 py-3"
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