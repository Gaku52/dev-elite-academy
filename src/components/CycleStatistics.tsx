'use client';

import { useState, useEffect, useCallback } from 'react';
import { BarChart3, TrendingUp, Clock, Award, RotateCcw, Calendar } from 'lucide-react';

interface CycleStats {
  cycle_number: number;
  module_name: string;
  total_questions: number;
  completed_questions: number;
  correct_questions: number;
  completion_rate: number;
  total_attempts: number;
  total_correct_answers: number;
  cycle_start_date: string;
  cycle_last_update: string;
}

interface CycleStatisticsProps {
  userId: string;
  moduleName?: string;
}

export default function CycleStatistics({ userId, moduleName }: CycleStatisticsProps) {
  const [cycleStats, setCycleStats] = useState<CycleStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCycle, setSelectedCycle] = useState<number | null>(null);

  const fetchCycleStats = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        userId,
        action: 'cycles'
      });

      if (moduleName) {
        params.append('moduleName', moduleName);
      }

      const response = await fetch(`/api/learning-progress/reset?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch cycle statistics');
      }

      const data = await response.json();
      setCycleStats(data.cycleStats || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [userId, moduleName]);

  useEffect(() => {
    fetchCycleStats();
  }, [userId, moduleName, fetchCycleStats]);

  const groupedByModule = cycleStats.reduce((acc, stat) => {
    if (!acc[stat.module_name]) {
      acc[stat.module_name] = [];
    }
    acc[stat.module_name].push(stat);
    return acc;
  }, {} as Record<string, CycleStats[]>);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getModuleDisplayName = (moduleName: string) => {
    const moduleNames: Record<string, string> = {
      'computer-systems': 'コンピュータシステム',
      'algorithms-programming': 'アルゴリズム・プログラミング',
      'database': 'データベース',
      'network': 'ネットワーク',
      'security': 'セキュリティ',
      'system-development': 'システム開発',
      'management-legal': '経営・法務',
      'strategy': 'ストラテジ'
    };
    return moduleNames[moduleName] || moduleName;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
        <p className="text-center text-gray-600 mt-4">周回統計を読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-red-600 text-center">エラー: {error}</p>
      </div>
    );
  }

  if (cycleStats.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">周回データがありません</h3>
          <p className="text-gray-600">学習を開始すると、周回別の統計が表示されます。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 全体サマリー */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          <BarChart3 className="w-6 h-6 text-purple-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">周回別学習統計</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <RotateCcw className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-blue-900">総周回数</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {Math.max(...cycleStats.map(s => s.cycle_number))}周目
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Award className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="font-semibold text-green-900">最高正解率</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {Math.max(...cycleStats.map(s => s.completion_rate)).toFixed(1)}%
            </p>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-orange-600 mr-2" />
              <h3 className="font-semibold text-orange-900">総問題数</h3>
            </div>
            <p className="text-2xl font-bold text-orange-600">
              {cycleStats.reduce((sum, s) => sum + s.total_questions, 0).toLocaleString()}問
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-purple-600 mr-2" />
              <h3 className="font-semibold text-purple-900">学習モジュール</h3>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {Object.keys(groupedByModule).length}個
            </p>
          </div>
        </div>
      </div>

      {/* モジュール別周回統計 */}
      {Object.entries(groupedByModule).map(([module, stats]) => (
        <div key={module} className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {getModuleDisplayName(module)}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">周回</th>
                  <th className="text-left py-2 px-4">進捗</th>
                  <th className="text-left py-2 px-4">正解率</th>
                  <th className="text-left py-2 px-4">学習期間</th>
                  <th className="text-left py-2 px-4">所要日数</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((stat) => (
                  <tr
                    key={`${stat.module_name}-${stat.cycle_number}`}
                    className={`border-b hover:bg-gray-50 cursor-pointer ${
                      selectedCycle === stat.cycle_number ? 'bg-purple-50' : ''
                    }`}
                    onClick={() => setSelectedCycle(
                      selectedCycle === stat.cycle_number ? null : stat.cycle_number
                    )}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                          第{stat.cycle_number}周目
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{stat.completed_questions}/{stat.total_questions}問</span>
                            <span className="font-semibold">
                              {((stat.completed_questions / stat.total_questions) * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{
                                width: `${(stat.completed_questions / stat.total_questions) * 100}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${
                        stat.completion_rate >= 90 ? 'text-green-600' :
                        stat.completion_rate >= 70 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {stat.completion_rate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(stat.cycle_start_date)} 〜 {formatDate(stat.cycle_last_update)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {calculateDuration(stat.cycle_start_date, stat.cycle_last_update)}日
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 選択した周回の詳細 */}
          {selectedCycle && stats.find(s => s.cycle_number === selectedCycle) && (
            <div className="mt-4 p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-3">
                第{selectedCycle}周目 詳細情報
              </h4>
              {(() => {
                const selectedStat = stats.find(s => s.cycle_number === selectedCycle)!;
                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-purple-700 mb-1">総回答数</h5>
                      <p className="text-lg font-bold text-purple-900">
                        {selectedStat.total_attempts.toLocaleString()}回
                      </p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-purple-700 mb-1">正解数</h5>
                      <p className="text-lg font-bold text-purple-900">
                        {selectedStat.total_correct_answers.toLocaleString()}回
                      </p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-purple-700 mb-1">全体正解率</h5>
                      <p className="text-lg font-bold text-purple-900">
                        {selectedStat.total_attempts > 0
                          ? ((selectedStat.total_correct_answers / selectedStat.total_attempts) * 100).toFixed(1)
                          : 0}%
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}