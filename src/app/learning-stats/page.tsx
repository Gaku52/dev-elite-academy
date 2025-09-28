'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, TrendingUp, RotateCcw, Database, Calculator, Code, Network, Shield, Users, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import DailyProgressChart from '@/components/analytics/DailyProgressChart';
import LearningStreakCard from '@/components/analytics/LearningStreakCard';
import LearningHeatmap from '@/components/analytics/LearningHeatmap';
import ResetConfirmationDialog from '@/components/ResetConfirmationDialog';
import CycleStatistics from '@/components/CycleStatistics';

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
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  href: string;
  description: string;
  category: string;
  topics: string[];
}

const modules: ModuleInfo[] = [
  {
    key: 'computer-systems',
    name: 'コンピュータシステム',
    icon: Calculator,
    color: 'bg-blue-500',
    href: '/modules/it-fundamentals/computer-systems',
    description: 'ハードウェア、ソフトウェア、システム構成の基礎知識',
    category: 'テクノロジ系',
    topics: ['CPU・メモリ・入出力装置', 'オペレーティングシステム', 'システムの構成と方式']
  },
  {
    key: 'algorithms-programming',
    name: 'アルゴリズムとプログラミング',
    icon: Code,
    color: 'bg-blue-500',
    href: '/modules/it-fundamentals/algorithms-programming',
    description: 'プログラミング言語、データ構造、アルゴリズムの基本',
    category: 'テクノロジ系',
    topics: ['基本アルゴリズム', 'データ構造', 'プログラミング言語の基礎']
  },
  {
    key: 'database',
    name: 'データベース',
    icon: Database,
    color: 'bg-blue-500',
    href: '/modules/it-fundamentals/database',
    description: 'データベースの基本概念とSQL',
    category: 'テクノロジ系',
    topics: ['関係データベース', 'SQL基礎', '正規化']
  },
  {
    key: 'network',
    name: 'ネットワーク',
    icon: Network,
    color: 'bg-blue-500',
    href: '/modules/it-fundamentals/network',
    description: 'ネットワーク技術とプロトコルの基礎',
    category: 'テクノロジ系',
    topics: ['OSI参照モデル', 'TCP/IP', 'LAN・WAN', 'インターネット技術']
  },
  {
    key: 'security',
    name: 'セキュリティ',
    icon: Shield,
    color: 'bg-blue-500',
    href: '/modules/it-fundamentals/security',
    description: '情報セキュリティの基本概念と対策',
    category: 'テクノロジ系',
    topics: ['暗号技術', '認証技術', 'セキュリティ対策', 'リスクマネジメント']
  },
  {
    key: 'system-development',
    name: 'システム開発',
    icon: Users,
    color: 'bg-green-500',
    href: '/modules/it-fundamentals/system-development',
    description: 'システム開発手法とプロジェクトマネジメント',
    category: 'マネジメント系',
    topics: ['開発手法', 'テスト技法', 'プロジェクト管理', 'サービスマネジメント']
  },
  {
    key: 'management-legal',
    name: '経営・法務',
    icon: FileText,
    color: 'bg-purple-500',
    href: '/modules/it-fundamentals/management-legal',
    description: '企業活動と法務の基礎知識',
    category: 'ストラテジ系',
    topics: ['経営戦略', '企業会計', '法務・標準化', 'OR・IE']
  },
  {
    key: 'strategy',
    name: 'ストラテジ',
    icon: TrendingUp,
    color: 'bg-purple-500',
    href: '/modules/it-fundamentals/strategy',
    description: 'システム戦略と経営戦略',
    category: 'ストラテジ系',
    topics: ['システム戦略', '経営戦略マネジメント', '技術戦略マネジメント', 'ビジネスインダストリ']
  }
];

export default function LearningStatsPage() {
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [cycleData, setCycleData] = useState<{
    currentCycle: number;
    nextCycle: number;
    cycleStats: {
      cycle_number: number;
      total_questions: number;
      completed_questions: number;
      correct_questions: number;
      completion_rate: number;
      cycle_start_date: string;
      cycle_last_update: string;
    }[];
    resetPreview: {
      preservedData: string[];
      resetData: string[];
      benefits: string[];
    };
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'cycles'>('overview');
  interface DailyProgressData {
    date: string;
    totalQuestions: number;
    correctQuestions: number;
    correctRate: number;
    timeSpent: number;
    sectionsCompleted: number;
  }

  interface StreakData {
    current_streak: number;
    longest_streak: number;
    last_activity_date: string | null;
    total_days_learned: number;
  }

  const [dailyProgress, setDailyProgress] = useState<DailyProgressData[]>([]);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');
  const [dateRange, setDateRange] = useState(30); // デフォルト30日

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('ログインが必要です');
        return;
      }

      // 既存の統計データ取得
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

      // 日次進捗データの取得
      const dailyUrl = new URL('/api/learning-analytics/daily-progress', window.location.origin);
      dailyUrl.searchParams.set('userId', user.id);
      dailyUrl.searchParams.set('days', dateRange.toString());

      const dailyResponse = await fetch(dailyUrl.toString());
      if (dailyResponse.ok) {
        const dailyData = await dailyResponse.json();
        setDailyProgress(dailyData.dailyProgress || []);
      }

      // ストリークデータの取得
      const streakUrl = new URL('/api/learning-analytics/streak', window.location.origin);
      streakUrl.searchParams.set('userId', user.id);

      const streakResponse = await fetch(streakUrl.toString());
      if (streakResponse.ok) {
        const streakData = await streakResponse.json();
        setStreakData(streakData);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCycleData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const params = new URLSearchParams({
        userId: user.id,
        action: 'cycles'
      });

      const response = await fetch(`/api/learning-progress/reset?${params}`);
      if (response.ok) {
        const data = await response.json();
        setCycleData(data);
      }
    } catch (err) {
      console.error('Error fetching cycle data:', err);
    }
  };

  const handleResetProgress = async (resetType: 'safe' | 'complete') => {
    try {
      setResetLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('ログインが必要です');
        return;
      }

      const response = await fetch('/api/learning-progress/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          resetType
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to reset progress: ${response.status}`);
      }

      const result = await response.json();
      alert(result.message);

      // データを再取得
      await fetchStats();
      await fetchCycleData();
    } catch (error) {
      console.error('Failed to reset progress:', error);
      alert('進捗のリセットに失敗しました');
    } finally {
      setResetLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchCycleData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

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
      <div className="container max-w-6xl mx-auto px-4 py-4 sm:py-6 lg:py-8">
        <Link
          href="/modules/it-fundamentals"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          IT基礎に戻る
        </Link>

        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">詳細学習統計</h1>
                <p className="text-sm sm:text-base text-gray-600">あなたの学習進捗を詳細に分析します</p>
              </div>
            </div>
            <button
              onClick={() => setShowResetDialog(true)}
              className="flex items-center justify-center px-3 sm:px-4 py-2 text-sm sm:text-base text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              進捗リセット
            </button>
          </div>

          {/* タブナビゲーション */}
          <div className="flex space-x-1 mb-4 sm:mb-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg transition-colors ${
                activeTab === 'overview'
                  ? 'bg-blue-500 text-white'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              概要統計
            </button>
            <button
              onClick={() => setActiveTab('cycles')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg transition-colors ${
                activeTab === 'cycles'
                  ? 'bg-blue-500 text-white'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              周回別統計
            </button>
          </div>

          {/* タブコンテンツ */}
          {activeTab === 'overview' && (
            <>
              {/* ストリーク情報 */}
              {streakData && <LearningStreakCard streakData={streakData} />}

          {/* 期間選択とチャートタイプ選択 */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 my-4 sm:my-6">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-gray-600">表示期間:</span>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(Number(e.target.value))}
                className="px-2 sm:px-3 py-1 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={7}>1週間</option>
                <option value={30}>1ヶ月</option>
                <option value={90}>3ヶ月</option>
                <option value={180}>6ヶ月</option>
                <option value={365}>1年</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-gray-600">チャートタイプ:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setChartType('line')}
                  className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg transition-colors ${
                    chartType === 'line'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  折れ線
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg transition-colors ${
                    chartType === 'bar'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  棒グラフ
                </button>
                <button
                  onClick={() => setChartType('area')}
                  className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg transition-colors ${
                    chartType === 'area'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  エリア
                </button>
              </div>
            </div>
          </div>

          {/* 日次進捗チャート */}
          <div className="mb-8">
            <DailyProgressChart data={dailyProgress} chartType={chartType} />
          </div>

          {/* 学習ヒートマップ */}
          <div className="mb-8">
            <LearningHeatmap data={dailyProgress} days={365} />
          </div>

          {/* 全体統計 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">総問題数</span>
                <BookOpen className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                {stats?.totalQuestions || 0}<span className="text-sm text-gray-500 font-normal">問</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">完了済み</span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  {stats ? Math.round((stats.completedQuestions / Math.max(stats.totalQuestions, 1)) * 100) : 0}%
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                {stats?.completedQuestions || 0}<span className="text-sm text-gray-500 font-normal">問</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
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
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                {stats?.correctRate || 0}<span className="text-sm text-gray-500 font-normal">%</span>
              </div>
            </div>
          </div>

          {/* モジュール別統計 */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">モジュール別進捗</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {modules.map((module) => {
                const moduleStats = stats?.moduleStats?.[module.key];
                const total = moduleStats?.total || 0;
                const completed = moduleStats?.completed || 0;

                // total=0の場合は未実装として特別処理
                let progress: number;
                let progressBarWidth: number;

                if (total === 0) {
                  progress = 0;
                  progressBarWidth = 0;
                } else {
                  progress = Math.round((completed / total) * 100);
                  progressBarWidth = Math.min(progress, 100); // 100%を超えないように制限
                }

                const Icon = module.icon;

                return (
                  <div key={module.key} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-start mb-3 sm:mb-4">
                      <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 ${module.color} rounded-xl mr-3 sm:mr-4 flex-shrink-0`}>
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-black mb-1 min-h-[3rem] sm:min-h-[3.5rem] flex items-center">
                          <span className="line-clamp-2 leading-tight">
                            {module.name}
                          </span>
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1 line-clamp-2">
                          {module.description}
                        </p>
                        <div className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 sm:py-1 rounded-full inline-block">
                          {module.category}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                      {module.topics.slice(0, 3).map((topic, index) => (
                        <div key={index} className="flex items-center text-xs sm:text-sm">
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-300 rounded-full mr-2 flex-shrink-0"></span>
                          <span className="text-gray-600 truncate">{topic}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">進捗</span>
                        <span className="text-gray-600">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${module.color} h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${progressBarWidth}%` }}
                        />
                      </div>
                    </div>

                    <Link href={module.href} className="mt-4 w-full block">
                      <button className="w-full py-1.5 sm:py-2 px-3 sm:px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors text-xs sm:text-sm font-medium">
                        学習を開始 ({module.category})
                      </button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 学習のヒント */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">📊 分析から見える改善点</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
              <div>
                <p className="text-gray-700 mb-2"><strong>学習パターン:</strong></p>
                <p className="text-gray-600">
                  {dailyProgress.filter(d => d.totalQuestions > 0).length > 0
                    ? '継続的に学習を進めています'
                    : 'まずは定期的な学習習慣を作りましょう'}
                </p>
              </div>
              <div>
                <p className="text-gray-700 mb-2"><strong>推奨アクション:</strong></p>
                <p className="text-gray-600">
                  {(stats?.correctRate || 0) < 60
                    ? '基礎から復習することをお勧めします'
                    : '難易度の高い問題に挑戦しましょう'}
                </p>
              </div>
              <div>
                <p className="text-gray-700 mb-2"><strong>強化ポイント:</strong></p>
                <p className="text-gray-600">
                  {Object.entries(stats?.moduleStats || {}).reduce((min, [key, value]) => {
                    const progress = value.completed / Math.max(value.total, 1);
                    return progress < min.progress ? { key, progress } : min;
                  }, { key: '', progress: 1 }).key || '全体的にバランスよく学習しています'}
                </p>
              </div>
              <div>
                <p className="text-gray-700 mb-2"><strong>次の目標:</strong></p>
                <p className="text-gray-600">
                  {(streakData?.current_streak || 0) >= 7
                    ? 'この調子で継続しましょう'
                    : '7日連続学習を目指しましょう'}
                </p>
              </div>
            </div>
          </div>
            </>
          )}

          {/* 周回別統計タブ */}
          {activeTab === 'cycles' && (
            <div className="mt-6">
              <CycleStatistics />
            </div>
          )}
        </div>

        {/* リセット確認ダイアログ */}
        {showResetDialog && cycleData && (
          <ResetConfirmationDialog
            isOpen={showResetDialog}
            onClose={() => setShowResetDialog(false)}
            onConfirm={handleResetProgress}
            currentCycle={cycleData.currentCycle || 1}
            nextCycle={cycleData.nextCycle || 2}
            cycleStats={cycleData.cycleStats || []}
            resetPreview={cycleData.resetPreview || {
              preservedData: [],
              resetData: [],
              benefits: []
            }}
            isLoading={resetLoading}
          />
        )}
      </div>
    </div>
  );
}