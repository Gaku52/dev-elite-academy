'use client';

import { useEffect, useState } from 'react';

export default function DebugPage() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({});
  
  useEffect(() => {
    // 環境変数の値を確認（セキュリティのため一部のみ表示）
    setEnvVars({
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set',
      SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
        ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) + '...' 
        : 'Not set',
      URL_CHECK: process.env.NEXT_PUBLIC_SUPABASE_URL === 'your-supabase-url' 
        ? '❌ Using placeholder value!' 
        : '✅ Custom value set',
      KEY_CHECK: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'your-supabase-anon-key' 
        ? '❌ Using placeholder value!' 
        : '✅ Custom value set'
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Page - Environment Variables</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Current Environment Variables:</h2>
          
          {Object.entries(envVars).map(([key, value]) => (
            <div key={key} className="border-b border-gray-700 pb-2">
              <span className="font-mono text-green-400">{key}:</span>
              <span className="ml-4 font-mono text-gray-300">{value}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-900 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Setup Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Go to <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Supabase Dashboard</a></li>
            <li>Select your project</li>
            <li>Navigate to Settings → API</li>
            <li>Copy the Project URL and anon public key</li>
            <li>Update your .env.local file with these values</li>
            <li>Restart the development server</li>
          </ol>
        </div>

        <div className="mt-8 bg-yellow-900 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Common Issues:</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Make sure you&apos;re using .env.local (not .env)</li>
            <li>Environment variable names must start with NEXT_PUBLIC_</li>
            <li>Restart the server after changing environment variables</li>
            <li>Check that email authentication is enabled in Supabase</li>
          </ul>
        </div>
      </div>
    </div>
  );
}