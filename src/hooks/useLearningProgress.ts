import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import useSWR from 'swr';
import { authenticatedFetcher } from '@/lib/swr-config';

export interface LearningProgress {
  id: string;
  user_id: string;
  module_name: string;
  section_key: string;
  is_completed: boolean;
  is_correct: boolean;
  answer_count: number;
  correct_count: number;
  cycle_number: number;
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
  const [userId, setUserId] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  const [totalSessionTime, setTotalSessionTime] = useState<number>(0);

  // 現在のユーザーIDを取得
  const getCurrentUserId = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  }, []);

  // ユーザーIDを取得
  useEffect(() => {
    const loadUserId = async () => {
      const id = await getCurrentUserId();
      setUserId(id);
    };
    loadUserId();
  }, [getCurrentUserId]);

  // SWRで進捗データを取得（キャッシュ＋自動再検証）
  const progressUrl = userId
    ? `/api/learning-progress?userId=${userId}${moduleName ? `&moduleName=${moduleName}` : ''}`
    : null;

  const {
    data: progressData,
    error: progressError,
    isLoading: progressLoading,
    mutate: mutateProgress
  } = useSWR(progressUrl, authenticatedFetcher, {
    revalidateOnFocus: true, // タブに戻った時に自動更新
    dedupingInterval: 2000, // 2秒間は重複リクエスト防止
  });

  // SWRで統計データを取得
  const statsUrl = userId
    ? `/api/learning-progress/reset?userId=${userId}&action=stats`
    : null;

  const {
    data: statsData,
    error: statsError,
    mutate: mutateStats
  } = useSWR(statsUrl, authenticatedFetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 5000, // 統計は5秒間キャッシュ
  });

  const progress = progressData?.progress || [];
  const currentCycle = progressData?.currentCycle || 1;
  const stats = statsData?.stats || null;
  const loading = progressLoading || !userId;
  const error = progressError || statsError;

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

      // SWRキャッシュを再検証して最新データを取得
      await mutateProgress();
      await mutateStats();

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
  }, [userId, moduleName, getCurrentSessionMinutes, mutateProgress, mutateStats]);

  // 進捗をリセット
  const resetProgress = useCallback(async (targetModule?: string) => {
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

      // SWRキャッシュを再検証して最新データを取得
      await mutateProgress();
      await mutateStats();

      return data.message;
    } catch (err) {
      console.error('Error resetting progress:', err);
      throw err;
    }
  }, [userId, mutateProgress, mutateStats]);

  // 特定のセクションの進捗を取得
  const getSectionProgress = useCallback((sectionKey: string) => {
    return progress.find((p: LearningProgress) => p.section_key === sectionKey && p.module_name === moduleName);
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
    currentCycle,
    saveProgress,
    resetProgress,
    getSectionProgress,
    isSectionCompleted,
    resetSessionTime,
    getCurrentSessionMinutes,
    refetch: () => {
      // SWRキャッシュを再検証
      mutateProgress();
      mutateStats();
    }
  };
}