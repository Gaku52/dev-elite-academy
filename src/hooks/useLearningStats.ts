import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { authenticatedFetcher } from '@/lib/swr-config';
import { supabase } from '@/lib/supabase';

/**
 * 日次進捗データを取得するカスタムフック
 */
export function useDailyProgress(days: number = 30) {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUserId();
  }, []);

  const url = userId
    ? `/api/learning-analytics/daily-progress?userId=${userId}&days=${days}`
    : null;

  const { data, error, isLoading } = useSWR(
    url,
    authenticatedFetcher,
    {
      revalidateOnFocus: false, // 日次データは頻繁に変わらない
      dedupingInterval: 10000, // 10秒間キャッシュ
    }
  );

  return {
    dailyProgress: data?.dailyProgress || [],
    isLoading: isLoading || !userId,
    isError: error,
  };
}

/**
 * 学習ストリークデータを取得するカスタムフック
 */
export function useLearningStreak() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUserId();
  }, []);

  const url = userId
    ? `/api/learning-analytics/streak?userId=${userId}`
    : null;

  const { data, error, isLoading } = useSWR(
    url,
    authenticatedFetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 5000, // 5秒間キャッシュ
    }
  );

  return {
    streakData: data || null,
    isLoading: isLoading || !userId,
    isError: error,
  };
}

/**
 * 周回データを取得するカスタムフック
 */
export function useCycleData() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUserId();
  }, []);

  const url = userId
    ? `/api/learning-progress/reset?userId=${userId}&action=cycles`
    : null;

  const { data, error, isLoading } = useSWR(
    url,
    authenticatedFetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 5000,
    }
  );

  return {
    cycleData: data || null,
    isLoading: isLoading || !userId,
    isError: error,
  };
}
