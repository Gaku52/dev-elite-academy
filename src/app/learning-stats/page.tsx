'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, TrendingUp, RotateCcw, Database, Calculator, Code } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface LearningStats {
  totalQuestions: number;
  completedQuestions: number;
  correctRate: number;
  moduleStats: {
    [key: string]: {
      total: number;
      completed: number;
    };
  };
}

interface ModuleInfo {
  key: string;
  name: string;
  icon: any;
  color: string;
  href: string;
}

const modules: ModuleInfo[] = [
  {
    key: 'computer-systems',
    name: 'コンピュータシステム',
    icon: Calculator,
    color: 'bg-blue-500',
    href: '/modules/it-fundamentals/computer-systems'
  },
  {
    key: 'algorithms-programming',
    name: 'アルゴリズムとプログラミング',
    icon: Code,
    color: 'bg-purple-500',
    href: '/modules/it-fundamentals/algorithms-programming'
  },
  {
    key: 'database',
    name: 'データベース',
    icon: Database,
    color: 'bg-green-500',
    href: '/modules/it-fundamentals/database'
  }
];

export default function LearningStatsPage() {
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('ログインが必要です');
        return;
      }

      const url = new URL('/api/learning-progress/reset', window.location.origin);
      url.searchParams.set('userId', user.id);
      url.searchParams.set('action', 'stats');

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setStats(data.stats);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const resetAllProgress = async () => {
    if (!window.confirm('すべての学習進捗をリセットしますか？この操作は元に戻せません。')) {
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('ログインが必要です');
        return;
      }

      const url = new URL('/api/learning-progress/reset', window.location.origin);
      url.searchParams.set('userId', user.id);

      const response = await fetch(url.toString(), {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to reset progress: ${response.status}`);
      }

      alert('すべての進捗をリセットしました');
      fetchStats(); // 統計を再取得
    } catch (error) {
      console.error('Failed to reset progress:', error);
      alert('進捗のリセットに失敗しました');
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">統計情報を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">エラー: {error}</p>
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/modules/it-fundamentals"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          IT基礎に戻る
        </Link>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">学習統計</h1>
                <p className="text-gray-600">あなたの学習進捗を確認しましょう</p>
              </div>
            </div>
            <button
              onClick={resetAllProgress}
              className="flex items-center px-4 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              全進捗リセット
            </button>
          </div>

          {/* 全体統計 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">総問題数</span>
                <BookOpen className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stats?.totalQuestions || 0}<span className="text-sm text-gray-500 font-normal">問</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">完了済み</span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  {stats ? Math.round((stats.completedQuestions / Math.max(stats.totalQuestions, 1)) * 100) : 0}%
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stats?.completedQuestions || 0}<span className="text-sm text-gray-500 font-normal">問</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">正答率</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  (stats?.correctRate || 0) >= 80
                    ? 'bg-green-100 text-green-800'
                    : (stats?.correctRate || 0) >= 60
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {(stats?.correctRate || 0) >= 80 ? '優秀' : (stats?.correctRate || 0) >= 60 ? '良好' : '要改善'}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stats?.correctRate || 0}<span className="text-sm text-gray-500 font-normal">%</span>
              </div>
            </div>
          </div>

          {/* モジュール別統計 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">モジュール別進捗</h2>
            <div className="space-y-4">
              {modules.map((module) => {
                const moduleStats = stats?.moduleStats?.[module.key];
                const progress = moduleStats ? Math.round((moduleStats.completed / Math.max(moduleStats.total, 1)) * 100) : 0;
                const Icon = module.icon;

                return (
                  <div key={module.key} className="flex items-center">
                    <div className={`w-10 h-10 ${module.color} rounded-lg flex items-center justify-center mr-4`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{module.name}</span>
                        <span className="text-sm text-gray-600">
                          {moduleStats?.completed || 0} / {moduleStats?.total || 0} ({progress}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${module.color} h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <Link
                      href={module.href}
                      className="ml-4 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                    >
                      学習
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 学習のヒント */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">🎯 学習のポイント</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-700 mb-2"><strong>継続的な学習:</strong></p>
                <p className="text-gray-600">毎日少しずつでも継続することが重要です</p>
              </div>
              <div>
                <p className="text-gray-700 mb-2"><strong>弱点の克服:</strong></p>
                <p className="text-gray-600">正答率の低い分野を重点的に復習しましょう</p>
              </div>
              <div>
                <p className="text-gray-700 mb-2"><strong>理解の定着:</strong></p>
                <p className="text-gray-600">解説をしっかり読んで理解を深めましょう</p>
              </div>
              <div>
                <p className="text-gray-700 mb-2"><strong>目標設定:</strong></p>
                <p className="text-gray-600">全体で80%以上の正答率を目指しましょう</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}