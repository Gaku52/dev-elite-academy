'use client';

import {
  Clock,
  PlayCircle,
  BookOpen,
  ChevronRight,
  BarChart3,
  Calendar,
  FileText
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
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-5xl mx-auto px-4 py-2">
        {/* Welcome Section */}
        <div className="text-center mb-3">
          <h2 className="text-lg font-bold text-foreground mb-1">
            🏆 学習ダッシュボード
          </h2>
          <p className="text-xs text-muted">
            高年収エンジニアへの道のり
          </p>
        </div>

        {/* User Progress Tracker */}
        <UserProgressTracker totalContents={learningContents.length} />

        {/* Pinned Learning Paths */}
        <PinnedLearningPaths categories={categories} />

        {/* Learning Resources Section */}
        <div className="mb-6">
          <h3 className="text-base font-bold text-foreground flex items-center mb-3">
            <FileText className="w-4 h-4 mr-2 text-[#4A90E2]" />
            学習資料
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/fe-exam"
              className="card-modern p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex items-start gap-3">
                <div className="p-3 bg-[#4A90E2]/10 dark:bg-[#5da3ed]/20 rounded-xl group-hover:bg-[#4A90E2]/20 dark:group-hover:bg-[#5da3ed]/30 transition-colors">
                  <FileText className="w-6 h-6 text-[#4A90E2]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-foreground mb-1 group-hover:text-[#4A90E2] transition-colors">
                    基本情報技術者試験 学習資料
                  </h4>
                  <p className="text-xs text-muted mb-2">
                    GitHubから最新の学習資料をMarkdown形式で閲覧
                  </p>
                  <div className="flex items-center text-xs text-[#4A90E2]">
                    <span>資料を見る</span>
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </div>
            </Link>
            <Link
              href="/modules/it-fundamentals"
              className="card-modern p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex items-start gap-3">
                <div className="p-3 bg-[#8E9C78]/10 dark:bg-[#a8b899]/20 rounded-xl group-hover:bg-[#8E9C78]/20 dark:group-hover:bg-[#a8b899]/30 transition-colors">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    基本情報技術者試験
                  </h4>
                  <p className="text-xs text-muted mb-2">
                    IT基礎知識を体系的に学習 | 科目A・科目B対策
                  </p>
                  <div className="flex items-center text-xs text-primary">
                    <span>学習を始める</span>
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Learning Path Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-foreground flex items-center">
              <BarChart3 className="w-4 h-4 mr-2 text-primary" />
              学習パス
            </h3>
            <Link
              href="/learn"
              className="text-primary hover:text-primary transition-colors flex items-center text-sm"
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
            <h3 className="text-base font-bold text-foreground flex items-center">
              <PlayCircle className="w-4 h-4 mr-2 text-green-500" />
              今すぐ始める
            </h3>
            <p className="text-muted text-sm">最新の学習コンテンツから選択</p>
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
                      <BookOpen className="w-3 h-3 text-primary" />
                      <span className="text-primary text-xs capitalize">
                        {content.content_type}
                      </span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded-full text-xs border bg-green-50 text-green-800 border-green-200">
                      {content.difficulty}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {content.title}
                  </h4>

                  <p className="text-muted text-xs mb-2 line-clamp-2">
                    {content.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{content.estimated_time}分</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(content.tags || []).slice(0, 2).map((tag: string) => (
                        <span key={tag} className="px-2 py-1 bg-[#8E9C78]/10 dark:bg-[#a8b899]/20 text-primary rounded-full">
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
              <p className="text-sm text-muted">学習コンテンツが見つかりません</p>
            </div>
          )}
        </div>

        {/* Motivation Section */}
        <div className="mt-4 text-center bg-[#8E9C78]/10 dark:bg-[#a8b899]/20 rounded-lg p-4 border border-[#8E9C78]/20 dark:border-[#a8b899]/30">
          <h3 className="text-sm font-bold text-foreground mb-2">
            ✨ 高年収エンジニアへの挑戦
          </h3>
          <p className="text-xs text-muted mb-3">
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