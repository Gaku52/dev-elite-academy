'use client';

import { useEffect, useState } from 'react';
import { Calendar, TrendingUp, AlertTriangle, Clock, BarChart3 } from 'lucide-react';

interface DailyStats {
  date: string;
  database_size_mb: number;
  total_records: number;
  growth_rate_mb_per_day: number | null;
  prediction_days_to_limit: number | null;
  prediction_limit_reach_date: string | null;
}

interface PredictionData {
  current_size_mb: number;
  growth_rate_mb_per_day: number | null;
  days_to_limit: number | null;
  limit_reach_date: string | null;
  usage_percentage: string;
}

interface GrowthData {
  daily_stats: DailyStats[];
  latest_prediction: PredictionData | null;
  data_available: number;
}

export default function GrowthPredictionDisplay() {
  const [growthData, setGrowthData] = useState<GrowthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCollecting, setIsCollecting] = useState(false);

  const fetchGrowthData = async () => {
    try {
      const response = await fetch('/api/collect-daily-usage?days=30');
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      const data = await response.json();
      setGrowthData(data);
    } catch (err) {
      console.error('Growth data fetch error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const collectTodaysData = async () => {
    setIsCollecting(true);
    try {
      const response = await fetch('/api/collect-daily-usage', {
        method: 'POST'
      });
      if (!response.ok) {
        throw new Error(`Failed to collect: ${response.status}`);
      }
      const result = await response.json();
      console.log('Today\'s data collected:', result);

      // データを再取得
      await fetchGrowthData();
    } catch (err) {
      console.error('Data collection error:', err);
      setError(err instanceof Error ? err.message : 'Failed to collect data');
    } finally {
      setIsCollecting(false);
    }
  };

  useEffect(() => {
    fetchGrowthData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">成長データを読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 mb-4">エラー: {error}</p>
        <button
          onClick={fetchGrowthData}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          再試行
        </button>
      </div>
    );
  }

  const prediction = growthData?.latest_prediction;
  const hasData = growthData && growthData.data_available > 0;

  // 緊急度の判定
  const getUrgencyLevel = (daysToLimit: number | null) => {
    if (!daysToLimit || daysToLimit <= 0) return null;
    if (daysToLimit <= 30) return 'urgent';
    if (daysToLimit <= 90) return 'warning';
    if (daysToLimit <= 180) return 'caution';
    return 'safe';
  };

  const urgency = getUrgencyLevel(prediction?.days_to_limit || null);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '予測不可';
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUrgencyColor = (level: string | null) => {
    switch (level) {
      case 'urgent': return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'warning': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      case 'caution': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'safe': return 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  const getUrgencyMessage = (level: string | null, days: number | null) => {
    if (!level || !days) return '予測データ不足';
    switch (level) {
      case 'urgent': return `🚨 緊急: ${days}日以内に制限到達`;
      case 'warning': return `⚠️ 警告: ${days}日後に制限到達`;
      case 'caution': return `⚠️ 注意: ${days}日後に制限到達`;
      case 'safe': return `✅ 安全: ${days}日後に制限到達`;
      default: return '予測不可';
    }
  };

  return (
    <div className="space-y-6">
      {/* データ収集コントロール */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          データ蓄積: {growthData?.data_available || 0}日分
        </div>
        <button
          onClick={collectTodaysData}
          disabled={isCollecting}
          className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors text-sm"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          {isCollecting ? '収集中...' : '今日のデータ収集'}
        </button>
      </div>

      {hasData && prediction ? (
        <>
          {/* 予測サマリー */}
          <div className={`p-4 rounded-xl border ${getUrgencyColor(urgency)}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg">
                  {getUrgencyMessage(urgency, prediction.days_to_limit)}
                </h3>
                <p className="text-sm opacity-80">
                  現在の使用量: {prediction.current_size_mb.toFixed(2)} MB ({prediction.usage_percentage}%)
                </p>
              </div>
              <div className="text-right">
                {prediction.growth_rate_mb_per_day && (
                  <p className="text-sm font-mono">
                    +{prediction.growth_rate_mb_per_day.toFixed(3)} MB/日
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <div>
                  <p className="text-sm font-medium">制限到達予測日</p>
                  <p className="text-sm">{formatDate(prediction.limit_reach_date)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <div>
                  <p className="text-sm font-medium">残り日数</p>
                  <p className="text-sm">
                    {prediction.days_to_limit ? `${prediction.days_to_limit}日` : '予測不可'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 推奨アクション */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              推奨アクション
            </h4>
            <div className="text-sm text-blue-800 space-y-2">
              {urgency === 'urgent' && (
                <div>
                  <p className="font-medium">即座に有料プランへ移行が必要です！</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Pro Plan ($25/月) への即座アップグレード</li>
                    <li>データベース容量: 8GB (16倍の容量)</li>
                    <li>データのバックアップを取得</li>
                  </ul>
                </div>
              )}
              {urgency === 'warning' && (
                <div>
                  <p className="font-medium">有料プランへの移行準備を開始してください</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Pro Plan への移行計画を立てる</li>
                    <li>予算確保と承認手続きを開始</li>
                    <li>データ整理とクリーンアップを検討</li>
                  </ul>
                </div>
              )}
              {urgency === 'caution' && (
                <div>
                  <p className="font-medium">使用量の監視を強化しましょう</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>週次でのデータ増加率をチェック</li>
                    <li>不要なデータの定期的なクリーンアップ</li>
                    <li>有料プラン移行のタイムライン検討</li>
                  </ul>
                </div>
              )}
              {urgency === 'safe' && (
                <div>
                  <p className="font-medium">現在は安全な範囲内です</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>月次での使用量レビューを継続</li>
                    <li>データベース最適化の実施</li>
                    <li>成長計画に合わせた予算検討</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* 最近の履歴 */}
          {growthData.daily_stats.length > 1 && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">最近の使用量推移</h4>
              <div className="space-y-2">
                {growthData.daily_stats.slice(0, 7).map((stat, index) => (
                  <div key={stat.date} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {new Date(stat.date).toLocaleDateString('ja-JP')}
                    </span>
                    <div className="flex items-center space-x-4">
                      <span className="font-mono">
                        {stat.database_size_mb.toFixed(2)} MB
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {stat.total_records.toLocaleString()} レコード
                      </span>
                      {index > 0 && stat.growth_rate_mb_per_day && (
                        <span className={`font-mono text-xs px-2 py-1 rounded ${
                          stat.growth_rate_mb_per_day > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                        }`}>
                          {stat.growth_rate_mb_per_day > 0 ? '+' : ''}{stat.growth_rate_mb_per_day.toFixed(3)} MB/日
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">予測データを蓄積中</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            正確な予測には数日間のデータが必要です
          </p>
          <button
            onClick={collectTodaysData}
            disabled={isCollecting}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors"
          >
            {isCollecting ? '収集中...' : '今日のデータを収集'}
          </button>
        </div>
      )}
    </div>
  );
}