'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Trophy, 
  Star, 
  Clock, 
  Target,
  Zap,
  BookOpen,
  CheckCircle,
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
    if (user) {
      fetchUserProgress();
    } else {
      // ゲストユーザーの場合はローカルストレージから取得
      loadGuestProgress();
    }
  }, [user, totalContents]);

  const fetchUserProgress = async () => {
    try {
      const response = await fetch(`/api/user/progress?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setProgress({
          completedLessons: data.completed_contents || 0,
          totalLessons: totalContents,
          totalHours: data.total_estimated_hours || 0,
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
      totalLessons: totalContents,
      totalHours: Math.round(totalContents * 1.5), // 推定
      completedHours: Math.round(completedCount * 1.5),
      streak: completedCount > 0 ? 1 : 0, // 簡易計算
      achievements: completedCount > 0 ? ['初回完了'] : []
    });
    setLoading(false);
  };

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
      <div className="bg-gradient-to-r from-purple-800/20 to-pink-800/20 rounded-xl p-8 mb-12 border border-purple-500/30">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3 mx-auto mb-8"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-3"></div>
                <div className="h-6 bg-gray-700 rounded w-8 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-12 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-800/20 to-pink-800/20 rounded-xl p-8 mb-12 border border-purple-500/30">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Trophy className="w-8 h-8 text-yellow-400 mr-2" />
          <h3 className="text-2xl font-bold text-white">あなたの学習進捗</h3>
          <Trophy className="w-8 h-8 text-yellow-400 ml-2" />
        </div>
        <p className="text-gray-300 mb-2">{getMotivationalMessage()}</p>
        {progress.streak > 0 && (
          <p className="text-orange-400 text-sm flex items-center justify-center">
            <Zap className="w-4 h-4 mr-1" />
            学習ストリーク: {progress.streak}日
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <p className="text-2xl font-bold text-white">{progress.completedLessons}</p>
          <p className="text-purple-300 text-sm">完了レッスン</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
            <Target className="w-8 h-8 text-white" />
          </div>
          <p className="text-2xl font-bold text-white">{progress.totalLessons}</p>
          <p className="text-blue-300 text-sm">総レッスン数</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <p className="text-2xl font-bold text-white">{Math.round(progress.completedHours)}</p>
          <p className="text-green-300 text-sm">学習時間</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <p className="text-2xl font-bold text-white">{progressPercentage}%</p>
          <p className="text-yellow-300 text-sm">完了率</p>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300">全体の進捗</span>
          <span className="text-sm text-purple-300">
            {progress.completedLessons} / {progress.totalLessons} 完了
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 ease-out" 
            style={{width: `${progressPercentage}%`}}
          ></div>
        </div>
      </div>

      {/* Achievements */}
      {progress.achievements.length > 0 && (
        <div className="text-center">
          <h4 className="text-sm font-semibold text-gray-300 mb-3">獲得したバッジ</h4>
          <div className="flex justify-center flex-wrap gap-2">
            {progress.achievements.map((achievement, index) => (
              <span
                key={index}
                className="flex items-center px-3 py-1 bg-yellow-600/20 text-yellow-300 rounded-full text-xs border border-yellow-500/30"
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