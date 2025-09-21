import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface LearningProgress {
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

export interface LearningStats {
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

export function useLearningProgress(moduleName?: string) {
  const [progress, setProgress] = useState<LearningProgress[]>([]);
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  const [totalSessionTime, setTotalSessionTime] = useState<number>(0);

  // 現在のユーザーIDを取得
  const getCurrentUserId = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  }, []);

  // 進捗データを取得
  const fetchProgress = useCallback(async (userId: string) => {
    try {
      const url = new URL('/api/learning-progress', window.location.origin);
      url.searchParams.set('userId', userId);
      if (moduleName) {
        url.searchParams.set('moduleName', moduleName);
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Failed to fetch progress: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      console.log('📊 Fetched progress data:', data.progress);
      setProgress(data.progress || []);
    } catch (err) {
      console.error('Error fetching progress:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [moduleName]);

  // 統計情報を取得
  const fetchStats = useCallback(async (userId: string) => {
    try {
      const url = new URL('/api/learning-progress/reset', window.location.origin);
      url.searchParams.set('userId', userId);
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
    }
  }, []);

  // 初回ロード
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      const userId = await getCurrentUserId();
      console.log('🔍 Learning Progress Debug - User ID:', userId);

      if (!userId) {
        console.log('❌ User not authenticated, skipping progress load');
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      console.log('🔄 Loading progress for user:', userId, 'module:', moduleName);

      try {
        await Promise.all([
          fetchProgress(userId),
          fetchStats(userId)
        ]);
        console.log('✅ Progress loaded successfully');
      } catch (err) {
        console.error('❌ Error loading progress:', err);
      }

      setLoading(false);
    };

    loadData();
  }, [fetchProgress, fetchStats, getCurrentUserId, moduleName]);

  // セッション時間をリセット
  const resetSessionTime = useCallback(() => {
    setSessionStartTime(Date.now());
    setTotalSessionTime(0);
  }, []);

  // 現在のセッション時間を取得（分）
  const getCurrentSessionMinutes = useCallback(() => {
    const currentTime = Date.now();
    const sessionTimeMs = currentTime - sessionStartTime + totalSessionTime;
    return Math.max(1, Math.round(sessionTimeMs / 60000)); // 最低1分
  }, [sessionStartTime, totalSessionTime]);

  // 進捗を保存
  const saveProgress = useCallback(async (
    sectionKey: string,
    isCompleted: boolean,
    isCorrect: boolean
  ) => {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    if (!moduleName) {
      throw new Error('Module name is required');
    }

    try {
      console.log('💾 Saving progress:', { userId, moduleName, sectionKey, isCompleted, isCorrect });

      const response = await fetch('/api/learning-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          moduleName,
          sectionKey,
          isCompleted,
          isCorrect
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save progress: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      console.log('✅ Progress saved successfully:', data.progress);

      // ローカルステートを更新
      setProgress(prev => {
        const existingIndex = prev.findIndex(
          p => p.section_key === sectionKey && p.module_name === moduleName
        );

        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = data.progress;
          return updated;
        } else {
          return [...prev, data.progress];
        }
      });

      // 統計情報を更新
      await fetchStats(userId);

      // 日次統計の記録
      try {
        const sessionMinutes = getCurrentSessionMinutes();
        console.log('📊 Recording daily progress...', { sessionMinutes });
        const dailyResponse = await fetch('/api/learning-analytics/daily-progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            moduleName,
            questionsAttempted: 1,
            questionsCorrect: isCorrect ? 1 : 0,
            timeSpentMinutes: sessionMinutes,
            sectionsCompleted: isCompleted ? 1 : 0
          }),
        });

        if (dailyResponse.ok) {
          console.log('✅ Daily progress recorded successfully');
        } else {
          console.warn('⚠️ Failed to record daily progress:', dailyResponse.status);
        }
      } catch (dailyErr) {
        console.warn('⚠️ Daily progress recording failed:', dailyErr);
        // 日次統計の失敗は致命的エラーにしない
      }

      return data.progress;
    } catch (err) {
      console.error('Error saving progress:', err);
      throw err;
    }
  }, [getCurrentUserId, moduleName, fetchStats, getCurrentSessionMinutes]);

  // 進捗をリセット
  const resetProgress = useCallback(async (targetModule?: string) => {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    try {
      const url = new URL('/api/learning-progress/reset', window.location.origin);
      url.searchParams.set('userId', userId);
      if (targetModule) {
        url.searchParams.set('moduleName', targetModule);
      }

      const response = await fetch(url.toString(), {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to reset progress: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // ローカルステートを更新
      if (targetModule) {
        setProgress(prev => prev.filter(p => p.module_name !== targetModule));
      } else {
        setProgress([]);
      }

      // 統計情報を更新
      await fetchStats(userId);

      return data.message;
    } catch (err) {
      console.error('Error resetting progress:', err);
      throw err;
    }
  }, [getCurrentUserId, fetchStats]);

  // 特定のセクションの進捗を取得
  const getSectionProgress = useCallback((sectionKey: string) => {
    return progress.find(p => p.section_key === sectionKey && p.module_name === moduleName);
  }, [progress, moduleName]);

  // セクションが完了済みかチェック
  const isSectionCompleted = useCallback((sectionKey: string) => {
    const sectionProgress = getSectionProgress(sectionKey);
    return sectionProgress?.is_completed || false;
  }, [getSectionProgress]);

  return {
    progress,
    stats,
    loading,
    error,
    saveProgress,
    resetProgress,
    getSectionProgress,
    isSectionCompleted,
    resetSessionTime,
    getCurrentSessionMinutes,
    refetch: () => {
      const refetch = async () => {
        const userId = await getCurrentUserId();
        if (userId) {
          await Promise.all([
            fetchProgress(userId),
            fetchStats(userId)
          ]);
        }
      };
      refetch();
    }
  };
}