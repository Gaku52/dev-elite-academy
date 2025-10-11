'use client';

import { useEffect, useState } from 'react';

export default function DebugPage() {
  const [envVars, setEnvVars] = useState<{url: string, key: string}>({
    url: '',
    key: ''
  });

  useEffect(() => {
    // クライアントサイドで環境変数を取得
    setEnvVars({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set',
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'Not set'
    });
  }, []);

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">🔍 Environment Debug</h1>
      
      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded mb-4">
        <h2 className="font-bold mb-2">🌍 Environment Variables:</h2>
        <div className="space-y-2">
          <p><strong>SUPABASE_URL:</strong>
            <span className="ml-2 font-mono text-sm bg-white dark:bg-gray-700 p-1 rounded">
              {envVars.url}
            </span>
          </p>
          <p><strong>SUPABASE_ANON_KEY:</strong>
            <span className="ml-2 font-mono text-sm bg-white dark:bg-gray-700 p-1 rounded">
              {envVars.key ? `${envVars.key.substring(0, 20)}...` : 'Not set'}
            </span>
          </p>
        </div>
      </div>

      <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded">
        <h2 className="font-bold mb-2">📊 Status:</h2>
        <div className="space-y-1">
          <p>✅ <strong>URL Status:</strong> {envVars.url !== 'Not set' ? 'SET' : '❌ NOT SET'}</p>
          <p>✅ <strong>Key Status:</strong> {envVars.key !== 'Not set' ? 'SET' : '❌ NOT SET'}</p>
          <p>🌐 <strong>Current Time:</strong> {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
