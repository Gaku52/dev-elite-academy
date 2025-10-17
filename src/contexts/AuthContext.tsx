'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, auth } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  signIn: (email: string, password: string) => Promise<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  signOut: () => Promise<void>;
  updatePassword: (password: string) => Promise<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  resetPassword: (email: string) => Promise<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * すべてのSWRキャッシュをクリアする関数
 * ログアウト時にLocalStorageに保存されたユーザー固有のキャッシュを削除
 */
function clearAllCaches() {
  if (typeof window === 'undefined') return;

  try {
    // LocalStorageから swr-cache- で始まるすべてのキーを削除
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('swr-cache-')) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });

    console.log(`🗑️ Cleared ${keysToRemove.length} cache entries from localStorage`);
  } catch (error) {
    console.error('Failed to clear caches:', error);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 初回セッション確認
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // 認証状態変更の監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email);

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // 認証トークンをlocalStorageに保存
      if (session?.access_token) {
        localStorage.setItem('supabase-auth-token', session.access_token);
      } else {
        localStorage.removeItem('supabase-auth-token');
      }

      // 認証状態が変更された場合の処理
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user?.email);
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        // ログアウト時にすべてのSWRキャッシュをクリア
        clearAllCaches();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp: async (email: string, password: string) => {
      setLoading(true);
      try {
        console.log('AuthContext: Attempting signup for:', email);
        const result = await auth.signUp(email, password);
        console.log('AuthContext: Signup result:', {
          user: result.data?.user?.id,
          error: result.error?.message
        });
        setLoading(false);
        return result;
      } catch (error) {
        console.error('AuthContext: Signup exception:', error);
        setLoading(false);
        throw error;
      }
    },
    signIn: async (email: string, password: string) => {
      setLoading(true);
      try {
        console.log('AuthContext: Attempting signin for:', email);
        const result = await auth.signIn(email, password);
        console.log('AuthContext: Signin result:', {
          user: result.data?.user?.id,
          error: result.error?.message
        });
        setLoading(false);
        return result;
      } catch (error) {
        console.error('AuthContext: Signin exception:', error);
        setLoading(false);
        throw error;
      }
    },
    signOut: async () => {
      setLoading(true);
      await auth.signOut();
      // ログアウト時にすべてのSWRキャッシュをクリア
      clearAllCaches();
      setUser(null);
      setSession(null);
      setLoading(false);
    },
    updatePassword: async (password: string) => {
      return await auth.updatePassword(password);
    },
    resetPassword: async (email: string) => {
      return await auth.resetPassword(email);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}