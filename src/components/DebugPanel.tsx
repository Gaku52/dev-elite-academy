'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function DebugPanel() {
  const [userInfo, setUserInfo] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUserInfo(user);
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-lg text-xs max-w-sm z-50">
      <div className="mb-2 font-bold">Debug Info:</div>
      <div>User ID: {userInfo?.id || 'Not authenticated'}</div>
      <div>Email: {userInfo?.email || 'N/A'}</div>
      <div>Auth: {userInfo ? '✅' : '❌'}</div>
    </div>
  );
}