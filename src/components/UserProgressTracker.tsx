'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Star,
  Clock,
  Target,
  Zap,
  BookOpen,
  BarChart3
} from 'lucide-react';

interface ProgressData {
  completedLessons: number;
  totalLessons: number;
  totalHours: number;
  completedHours: number;
  streak: number;
  achievements: string[];
}

export default function UserProgressTracker({ totalContents }: { totalContents: number }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressData>({
    completedLessons: 0,
    totalLessons: totalContents,
    totalHours: 0,
    completedHours: 0,
    streak: 0,
    achievements: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const response = await fetch(`/api/user/progress?userId=${user?.id || ''}`);
        if (response.ok) {
          const data = await response.json();
          setProgress({
            completedLessons: data.completed_contents || 0,
            totalLessons: data.total_contents || 120,
            totalHours: data.total_estimated_hours || 60,
            completedHours: data.completed_hours || 0,
            streak: data.learning_streak || 0,
            achievements: data.achievements || []
          });
        }
      } catch (error) {
        console.error('Progress fetch error:', error);
        loadGuestProgress();
      } finally {
        setLoading(false);
      }
    };

    const loadGuestProgress = () => {
      // ローカルストレージから進捗を集計
      const completedCount = Object.keys(localStorage)
        .filter(key => key.startsWith('progress_') && key.endsWith(`_${totalContents}`))
        .reduce((count, key) => {
          try {
            const progressData = JSON.parse(localStorage.getItem(key) || '[]');
            return count + (Array.isArray(progressData) && progressData.length > 0 ? 1 : 0);
          } catch {
            return count;
          }
        }, 0);

      setProgress({
        completedLessons: completedCount,
        totalLessons: 120, // 基本情報技術者試験目標
        totalHours: 60, // 目標学習時間
        completedHours: Math.round(completedCount * 0.5), // 1セクション30分
        streak: completedCount > 0 ? 1 : 0,
        achievements: completedCount > 0 ? ['学習スタート'] : []
      });
      setLoading(false);
    };

    if (user) {
      fetchUserProgress();
    } else {
      // ゲストユーザーの場合はローカルストレージから取得
      loadGuestProgress();
    }
  }, [user, totalContents]);

  const progressPercentage = progress.totalLessons > 0 
    ? Math.round((progress.completedLessons / progress.totalLessons) * 100)
    : 0;

  const getMotivationalMessage = () => {
    if (progressPercentage === 0) {
      return "学習の第一歩を踏み出しましょう！";
    } else if (progressPercentage < 25) {
      return "素晴らしいスタート！継続が力になります。";
    } else if (progressPercentage < 50) {
      return "順調に進んでいます！この調子で続けましょう。";
    } else if (progressPercentage < 75) {
      return "もう半分以上完了！ゴールが見えてきました。";
    } else if (progressPercentage < 100) {
      return "ゴール直前！最後まで頑張りましょう。";
    } else {
      return "全コンテンツ完了！次のステップへ進みましょう。";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-3 mb-4 border border-gray-200 shadow-sm">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-2/3 mx-auto mb-3"></div>
          <div className="grid grid-cols-4 gap-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 bg-gray-300 rounded-lg mx-auto mb-1"></div>
                <div className="h-4 bg-gray-300 rounded w-6 mx-auto mb-1"></div>
                <div className="h-3 bg-gray-300 rounded w-10 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-3 mb-4 border border-gray-200 shadow-sm">
      <div className="text-center mb-3">
        <h3 className="text-sm font-semibold text-gray-800 mb-1">あなたの学習進捗</h3>
        <p className="text-xs text-gray-600">{getMotivationalMessage()}</p>
        {progress.streak > 0 && (
          <p className="text-orange-500 text-xs flex items-center justify-center mt-1">
            <Zap className="w-3 h-3 mr-1" />
            ストリーク: {progress.streak}日
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-4 gap-3 mb-3">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-1 bg-purple-100 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-lg font-bold text-black">{progress.completedLessons}</p>
          <p className="text-gray-600 text-xs">完了レッスン</p>
        </div>

        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-1 bg-blue-100 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-lg font-bold text-black">{progress.totalLessons}</p>
          <p className="text-gray-600 text-xs">総レッスン数</p>
        </div>

        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-1 bg-green-100 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-lg font-bold text-black">{Math.round(progress.completedHours)}</p>
          <p className="text-gray-600 text-xs">学習時間</p>
        </div>

        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-1 bg-orange-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-lg font-bold text-black">{progressPercentage}%</p>
          <p className="text-gray-600 text-xs">完了率</p>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-600">全体の進捗</span>
          <span className="text-xs text-gray-700">
            {progress.completedLessons} / {progress.totalLessons} 完了
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{width: `${progressPercentage}%`}}
          ></div>
        </div>
      </div>

      {/* Achievements */}
      {progress.achievements.length > 0 && (
        <div className="text-center">
          <div className="flex justify-center flex-wrap gap-1">
            {progress.achievements.map((achievement, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs"
              >
                <Star className="w-3 h-3 mr-1" />
                {achievement}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}