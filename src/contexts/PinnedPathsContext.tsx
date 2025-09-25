'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface PinnedPath {
  id: number;
  user_email: string;
  learning_path_name: string;
  pinned_at: string;
  created_at: string;
}

interface PinnedPathsContextType {
  pinnedPaths: PinnedPath[];
  loading: boolean;
  error: string | null;
  pinPath: (learningPathName: string) => Promise<PinnedPath>;
  unpinPath: (learningPathName: string) => Promise<void>;
  isPathPinned: (learningPathName: string) => boolean;
  getPinnedPathNames: () => string[];
  refetch: () => Promise<void>;
}

const PinnedPathsContext = createContext<PinnedPathsContextType | undefined>(undefined);

export function PinnedPathsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [pinnedPaths, setPinnedPaths] = useState<PinnedPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ピン固定されたパスを取得
  const fetchPinnedPaths = useCallback(async () => {
    if (!user?.email) {
      setPinnedPaths([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const url = new URL('/api/pins', window.location.origin);
      url.searchParams.set('email', user.email);

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`Failed to fetch pinned paths: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      console.log('📌 Fetched pinned paths:', data);
      setPinnedPaths(data || []);
    } catch (err) {
      console.error('Error fetching pinned paths:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setPinnedPaths([]);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  // 初回ロードとユーザー変更時の再取得
  useEffect(() => {
    fetchPinnedPaths();
  }, [fetchPinnedPaths]);

  // パスをピン固定する
  const pinPath = useCallback(async (learningPathName: string) => {
    if (!user?.email) {
      throw new Error('User not authenticated');
    }

    try {
      console.log('📌 Pinning path:', learningPathName);

      const response = await fetch('/api/pins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: user.email,
          learningPathName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to pin path: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      console.log('✅ Path pinned successfully:', data);

      // ローカルステートを更新
      setPinnedPaths(prev => [...prev, data]);

      return data;
    } catch (err) {
      console.error('Error pinning path:', err);
      throw err;
    }
  }, [user?.email]);

  // パスのピン固定を解除する
  const unpinPath = useCallback(async (learningPathName: string) => {
    if (!user?.email) {
      throw new Error('User not authenticated');
    }

    try {
      console.log('📌 Unpinning path:', learningPathName);

      const url = new URL('/api/pins', window.location.origin);
      url.searchParams.set('email', user.email);
      url.searchParams.set('learningPathName', learningPathName);

      const response = await fetch(url.toString(), {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to unpin path: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      console.log('✅ Path unpinned successfully');

      // ローカルステートを更新
      setPinnedPaths(prev =>
        prev.filter(path => path.learning_path_name !== learningPathName)
      );
    } catch (err) {
      console.error('Error unpinning path:', err);
      throw err;
    }
  }, [user?.email]);

  // パスがピン固定されているかチェック
  const isPathPinned = useCallback((learningPathName: string) => {
    return pinnedPaths.some(path => path.learning_path_name === learningPathName);
  }, [pinnedPaths]);

  // ピン固定されたパスの名前一覧を取得
  const getPinnedPathNames = useCallback(() => {
    return pinnedPaths.map(path => path.learning_path_name);
  }, [pinnedPaths]);

  const value: PinnedPathsContextType = {
    pinnedPaths,
    loading,
    error,
    pinPath,
    unpinPath,
    isPathPinned,
    getPinnedPathNames,
    refetch: fetchPinnedPaths,
  };

  return <PinnedPathsContext.Provider value={value}>{children}</PinnedPathsContext.Provider>;
}

export function usePinnedPaths() {
  const context = useContext(PinnedPathsContext);
  if (context === undefined) {
    throw new Error('usePinnedPaths must be used within a PinnedPathsProvider');
  }
  return context;
}