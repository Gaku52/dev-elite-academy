'use client';

import Link from 'next/link';
import { BookOpen, ArrowLeft, Code, Database, Network, Shield, Calculator, Users, FileText, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

import { moduleQuizCounts, moduleNameMapping } from '@/lib/moduleQuizCounts';

const fundamentalTopics = [
  {
    id: 1,
    title: 'コンピュータシステム',
    description: 'ハードウェア、ソフトウェア、システム構成の基礎知識',
    category: 'テクノロジ系',
    icon: Calculator,
    topics: ['CPU・メモリ・入出力装置', 'オペレーティングシステム', 'システムの構成と方式'],
    color: 'bg-blue-500',
    progress: 0,
    href: '/modules/it-fundamentals/computer-systems'
  },
  {
    id: 2,
    title: 'アルゴリズムとプログラミング',
    description: 'プログラミング言語、データ構造、アルゴリズムの基本',
    category: 'テクノロジ系',
    icon: Code,
    topics: ['基本アルゴリズム', 'データ構造', 'プログラミング言語の基礎'],
    color: 'bg-blue-500',
    progress: 0,
    href: '/modules/it-fundamentals/algorithms-programming'
  },
  {
    id: 3,
    title: 'データベース',
    description: 'データベースの基本概念とSQL',
    category: 'テクノロジ系',
    icon: Database,
    topics: ['関係データベース', 'SQL基礎', '正規化'],
    color: 'bg-blue-500',
    progress: 0,
    href: '/modules/it-fundamentals/database'
  },
  {
    id: 4,
    title: 'ネットワーク',
    description: 'ネットワーク技術とプロトコルの基礎',
    category: 'テクノロジ系',
    icon: Network,
    topics: ['OSI参照モデル', 'TCP/IP', 'LAN・WAN', 'インターネット技術'],
    color: 'bg-blue-500',
    progress: 0,
    href: '/modules/it-fundamentals/network'
  },
  {
    id: 5,
    title: 'セキュリティ',
    description: '情報セキュリティの基本概念と対策',
    category: 'テクノロジ系',
    icon: Shield,
    topics: ['暗号技術', '認証技術', 'セキュリティ対策', 'リスクマネジメント'],
    color: 'bg-blue-500',
    progress: 0,
    href: '/modules/it-fundamentals/security'
  },
  {
    id: 6,
    title: 'システム開発',
    description: 'システム開発手法とプロジェクトマネジメント',
    category: 'マネジメント系',
    icon: Users,
    topics: ['開発手法', 'テスト技法', 'プロジェクト管理', 'サービスマネジメント'],
    color: 'bg-green-500',
    progress: 0,
    href: '/modules/it-fundamentals/system-development'
  },
  {
    id: 7,
    title: '経営・法務',
    description: '企業活動と法務の基礎知識',
    category: 'ストラテジ系',
    icon: FileText,
    topics: ['経営戦略', '企業会計', '法務・標準化', 'OR・IE'],
    color: 'bg-purple-500',
    progress: 0,
    href: '/modules/it-fundamentals/management-legal'
  },
  {
    id: 8,
    title: 'ストラテジ',
    description: 'システム戦略と経営戦略',
    category: 'ストラテジ系',
    icon: TrendingUp,
    topics: ['システム戦略', '経営戦略マネジメント', '技術戦略マネジメント', 'ビジネスインダストリ'],
    color: 'bg-purple-500',
    progress: 0,
    href: '/modules/it-fundamentals/strategy'
  }
];


interface LearningProgressItem {
  id: string;
  user_id: string;
  module_name: string;
  section_key: string;
  is_completed: boolean;
  is_correct: boolean;
  answer_count: number;
  correct_count: number;
  created_at: string;
  updated_at: string;
}

export default function ITFundamentalsPage() {
  const [progressData, setProgressData] = useState<{[key: number]: number}>({});
  const [allProgress, setAllProgress] = useState<LearningProgressItem[]>([]);

  useEffect(() => {
    // 全モジュールの進捗データを取得
    const fetchAllProgress = async () => {
      try {
        const { data: { user } } = await (await import('@/lib/supabase')).supabase.auth.getUser();
        if (!user) return;

        const url = new URL('/api/learning-progress', window.location.origin);
        url.searchParams.set('userId', user.id);

        const response = await fetch(url.toString());
        if (!response.ok) return;

        const data = await response.json();
        if (data.progress) {
          setAllProgress(data.progress);
        }
      } catch (err) {
        console.error('Error fetching all progress:', err);
      }
    };

    fetchAllProgress();
  }, []);

  useEffect(() => {
    if (allProgress && allProgress.length > 0) {
      const calculatedProgress: {[key: number]: number} = {};

      // 各モジュールの進捗率を計算（個々のページと完全に同じロジックを使用）
      Object.entries(moduleNameMapping).forEach(([topicId, moduleName]) => {
        const totalQuizzes = moduleQuizCounts[moduleName] || 0;

        if (totalQuizzes > 0) {
          // answer_count > 0 のレコードを「完了」として判定
          // ユニークなmodule::section_keyのみをカウント（重複を排除）
          const uniqueSections = new Set(
            allProgress
              .filter(p => p.module_name === moduleName && (p.answer_count || 0) > 0)
              .map(p => `${p.module_name}::${p.section_key}`)
          );
          const completedCount = uniqueSections.size;

          // 個別ページと完全に同じ計算方法を使用
          const progressPercentage = Math.floor((completedCount / totalQuizzes) * 100);

          console.log(`📊 Module ${moduleName}: ${completedCount}/${totalQuizzes} = ${progressPercentage}%`);
          calculatedProgress[parseInt(topicId)] = progressPercentage;
        } else {
          calculatedProgress[parseInt(topicId)] = 0;
        }
      });

      console.log('📊 Calculated module progress:', calculatedProgress);
      setProgressData(calculatedProgress);
    }
  }, [allProgress]);

  return (
    <div className="min-h-screen bg-white">
      <div className="container-modern py-12">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-[#8E9C78] hover:text-[#7a8a6a] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          ダッシュボードに戻る
        </Link>
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-[#4A90E2] rounded-2xl shadow-sm">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">
            基本情報技術者試験
          </h1>
          <p className="text-xl text-[#6F6F6F] max-w-3xl mx-auto mb-4">
            IT基礎知識を体系的に学習｜科目A: 60問（90分）｜科目B: 20問（100分）
          </p>
          <Link
            href="/learning-stats"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            📊 学習統計を見る
          </Link>
        </div>

        <div className="mb-8">
          <div className="card-modern p-6">
            <h2 className="text-xl font-semibold mb-4">学習の概要</h2>
            <p className="text-[#6F6F6F] mb-4">
              基本情報技術者試験は、ITエンジニアとしての基礎的な知識・技能を評価する国家試験です。
              以下の3分野を体系的に学習していきます。
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                🔧 テクノロジ系 (41問/60問)
              </span>
              <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm">
                📊 マネジメント系 (7問/60問)
              </span>
              <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm">
                🎯 ストラテジ系 (12問/60問)
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fundamentalTopics.map((topic) => {
            const Icon = topic.icon;
            const currentProgress = progressData[topic.id] || 0;
            return (
              <div key={topic.id} className="card-modern p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start mb-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${topic.color} rounded-xl mr-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-black mb-1">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-[#6F6F6F] mb-1">
                      {topic.description}
                    </p>
                    <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full inline-block">
                      {topic.category}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {topic.topics.map((item, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-gray-300 rounded-full mr-2"></span>
                      <span className="text-[#6F6F6F]">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6F6F6F]">進捗</span>
                    <span className="text-[#6F6F6F]">{currentProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${topic.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${currentProgress}%` }}
                    ></div>
                  </div>
                </div>

                <Link href={topic.href || '#'} className="mt-4 w-full block">
                  <button className="w-full py-2 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors text-sm font-medium">
                    学習を開始 ({topic.category})
                  </button>
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mt-12 card-modern p-6">
          <h2 className="text-xl font-semibold mb-4">学習のポイント</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <span className="text-2xl mr-3">📚</span>
              <div>
                <h3 className="font-medium mb-1">体系的な学習</h3>
                <p className="text-sm text-[#6F6F6F]">
                  各分野を順序立てて学習し、知識を確実に定着させます
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">🎯</span>
              <div>
                <h3 className="font-medium mb-1">実践的な演習</h3>
                <p className="text-sm text-[#6F6F6F]">
                  過去問題や演習問題で実力を確認しながら進めます
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">📊</span>
              <div>
                <h3 className="font-medium mb-1">進捗管理</h3>
                <p className="text-sm text-[#6F6F6F]">
                  学習の進捗を可視化し、効率的な学習計画を立てられます
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">💡</span>
              <div>
                <h3 className="font-medium mb-1">重要ポイント解説</h3>
                <p className="text-sm text-[#6F6F6F]">
                  試験によく出る重要なポイントを詳しく解説します
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 card-modern p-6">
          <h2 className="text-xl font-semibold mb-4">科目B対策</h2>
          <p className="text-[#6F6F6F] mb-6">
            科目Aの学習と並行して、科目B（アルゴリズムとプログラミング）の過去問題にも挑戦しましょう。
          </p>
          <Link
            href="/subject-b"
            className="flex items-center justify-between p-4 bg-[#8E9C78]/10 hover:bg-[#8E9C78]/20 rounded-lg transition-colors group"
          >
            <div className="flex items-center">
              <BookOpen className="w-5 h-5 text-[#8E9C78] mr-3" />
              <div>
                <span className="text-gray-900 font-semibold block">科目B 過去問題</span>
                <span className="text-sm text-[#6F6F6F]">アルゴリズムとプログラミングの理解を深める</span>
              </div>
            </div>
            <ArrowLeft className="w-4 h-4 text-[#8E9C78] group-hover:text-[#7a8a6a] transition-colors transform rotate-180" />
          </Link>
        </div>

        <div className="mt-8 card-modern p-6">
          <h2 className="text-xl font-semibold mb-4">次のステップ</h2>
          <p className="text-[#6F6F6F] mb-6">
            基本情報技術者試験の学習を終えたら、さらに専門的な分野の学習に進みましょう。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/modules/programming-basics"
              className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <div className="flex items-center">
                <Code className="w-5 h-5 text-blue-500 mr-3" />
                <span className="text-gray-700 font-medium">プログラミング基礎</span>
              </div>
              <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors transform rotate-180" />
            </Link>
            <Link
              href="/modules/aws"
              className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <div className="flex items-center">
                <span className="text-lg mr-3">☁️</span>
                <span className="text-gray-700 font-medium">AWS クラウド</span>
              </div>
              <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors transform rotate-180" />
            </Link>
            <Link
              href="/modules/ai-ml"
              className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <div className="flex items-center">
                <span className="text-lg mr-3">🤖</span>
                <span className="text-gray-700 font-medium">AI・機械学習</span>
              </div>
              <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors transform rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}