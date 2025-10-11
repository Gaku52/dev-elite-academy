'use client';

import { Flame, Trophy, Calendar, TrendingUp } from 'lucide-react';

interface StreakData {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  total_days_learned: number;
}

interface LearningStreakCardProps {
  streakData: StreakData;
}

export default function LearningStreakCard({ streakData }: LearningStreakCardProps) {
  const isActiveToday = () => {
    if (!streakData.last_activity_date) return false;
    const today = new Date().toISOString().split('T')[0];
    return streakData.last_activity_date === today;
  };

  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-6 border border-orange-200 dark:border-orange-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-primary">学習ストリーク</h3>
        <Flame className={`w-6 h-6 ${streakData.current_streak > 0 ? 'text-orange-500 dark:text-orange-400 animate-pulse' : 'text-gray-400 dark:text-gray-500'}`} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 現在のストリーク */}
        <div className="bg-white dark:bg-dark-card rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-dark-secondary">現在</span>
            <Flame className="w-4 h-4 text-orange-500 dark:text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {streakData.current_streak}
            <span className="text-sm text-gray-500 dark:text-dark-secondary font-normal ml-1">日</span>
          </div>
          {isActiveToday() && (
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">今日も学習済み✓</span>
          )}
        </div>

        {/* 最長ストリーク */}
        <div className="bg-white dark:bg-dark-card rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-dark-secondary">最長記録</span>
            <Trophy className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {streakData.longest_streak}
            <span className="text-sm text-gray-500 dark:text-dark-secondary font-normal ml-1">日</span>
          </div>
          {streakData.current_streak === streakData.longest_streak && streakData.current_streak > 0 && (
            <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">記録更新中！</span>
          )}
        </div>

        {/* 総学習日数 */}
        <div className="bg-white dark:bg-dark-card rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-dark-secondary">総学習日数</span>
            <Calendar className="w-4 h-4 text-blue-500 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {streakData.total_days_learned}
            <span className="text-sm text-gray-500 dark:text-dark-secondary font-normal ml-1">日</span>
          </div>
        </div>

        {/* ストリーク達成率 */}
        <div className="bg-white dark:bg-dark-card rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-dark-secondary">継続率</span>
            <TrendingUp className="w-4 h-4 text-green-500 dark:text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {streakData.total_days_learned > 0
              ? Math.round((streakData.current_streak / streakData.total_days_learned) * 100)
              : 0}
            <span className="text-sm text-gray-500 dark:text-dark-secondary font-normal ml-1">%</span>
          </div>
        </div>
      </div>

      {/* モチベーションメッセージ */}
      <div className="mt-4 p-3 bg-white/50 dark:bg-dark-card/50 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-dark-secondary">
          {streakData.current_streak === 0 && "🎯 今日から学習を始めましょう！"}
          {streakData.current_streak > 0 && streakData.current_streak < 3 && "🌱 素晴らしいスタートです！この調子で続けましょう！"}
          {streakData.current_streak >= 3 && streakData.current_streak < 7 && "🔥 連続学習中！1週間を目指しましょう！"}
          {streakData.current_streak >= 7 && streakData.current_streak < 30 && "⭐ 素晴らしい継続力！1ヶ月を目標に頑張りましょう！"}
          {streakData.current_streak >= 30 && "🏆 驚異的な継続力です！あなたは学習のエキスパートです！"}
        </p>
      </div>
    </div>
  );
}