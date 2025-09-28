'use client';

import {
  Clock,
  PlayCircle,
  BookOpen,
  ChevronRight,
  BarChart3,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import UserProgressTracker from '@/components/UserProgressTracker';
import PinnedLearningPaths from '@/components/PinnedLearningPaths';
import LearningPathCard from '@/components/LearningPathCard';

// 型定義
interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  color?: string;
}

interface LearningContent {
  id: number;
  title: string;
  description: string;
  content_type: string;
  difficulty: string;
  estimated_time: number;
  tags: string[];
  category_id: number;
}



// Dashboard コンポーネント（Client Component に変更）
export default function Dashboard() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [learningContents, setLearningContents] = useState<LearningContent[]>([]);
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

      <div className="max-w-5xl mx-auto px-4 py-2">
        {/* Welcome Section */}
        <div className="text-center mb-3">
          <h2 className="text-lg font-bold text-black mb-1">
            🏆 学習ダッシュボード
          </h2>
          <p className="text-xs text-[#6F6F6F]">
            高年収エンジニアへの道のり
          </p>
        </div>

        {/* User Progress Tracker */}
        <UserProgressTracker totalContents={learningContents.length} />

        {/* Pinned Learning Paths */}
        <PinnedLearningPaths categories={categories} />

        {/* Learning Path Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-black flex items-center">
              <BarChart3 className="w-4 h-4 mr-2 text-[#8E9C78]" />
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
            {categories.map((category) => (
              <LearningPathCard
                key={category.id}
                category={category}
              />
            ))}
          </div>
        </div>

        {/* Quick Start Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-black flex items-center">
              <PlayCircle className="w-4 h-4 mr-2 text-green-500" />
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
                  className="card-modern p-3 hover:shadow-lg transition-all duration-300 cursor-pointer group block hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-3 h-3 text-[#8E9C78]" />
                      <span className="text-[#8E9C78] text-xs capitalize">
                        {content.content_type}
                      </span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded-full text-xs border bg-green-50 text-green-800 border-green-200">
                      {content.difficulty}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-black mb-1 group-hover:text-[#8E9C78] transition-colors">
                    {content.title}
                  </h4>

                  <p className="text-[#6F6F6F] text-xs mb-2 line-clamp-2">
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
            <div className="card-modern p-6 text-center">
              <p className="text-sm text-[#6F6F6F]">学習コンテンツが見つかりません</p>
            </div>
          )}
        </div>

        {/* Motivation Section */}
        <div className="mt-4 text-center bg-[#8E9C78]/10 rounded-lg p-4 border border-[#8E9C78]/20">
          <h3 className="text-sm font-bold text-black mb-2">
            ✨ 高年収エンジニアへの挑戦
          </h3>
          <p className="text-xs text-[#6F6F6F] mb-3">
            技術力を向上させ、市場価値を高める学習を始めましょう
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/learn"
              className="btn-modern inline-flex items-center px-6 py-2"
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              学習を開始する
            </Link>
            <Link
              href="#"
              className="btn-secondary inline-flex items-center px-6 py-2"
            >
              <Calendar className="w-4 h-4 mr-2" />
              学習計画を立てる
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}