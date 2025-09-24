'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SetupPinsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const setupTable = async () => {
    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await fetch('/api/setup-pins-table');
      const data = await response.json();

      if (response.ok) {
        setResult('✅ ピン固定テーブルのセットアップが完了しました！');

        // localStorageにデフォルトのメールアドレスを設定
        localStorage.setItem('userEmail', 'user@example.com');

        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError(`エラー: ${data.error || 'テーブルの作成に失敗しました'}`);
      }
    } catch (err) {
      setError(`エラー: ${err instanceof Error ? err.message : '不明なエラー'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">ピン機能セットアップ</h1>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700 mb-2">
            このページでは、学習パスのピン機能用データベーステーブルをセットアップします。
          </p>
          <p className="text-sm text-gray-700">
            初回のみ実行してください。
          </p>
        </div>

        {!result && !error && (
          <button
            onClick={setupTable}
            disabled={loading}
            className="w-full bg-[#8E9C78] text-white py-3 rounded-lg font-semibold hover:bg-[#7a8a6a] transition-colors disabled:opacity-50"
          >
            {loading ? 'セットアップ中...' : 'テーブルをセットアップ'}
          </button>
        )}

        {result && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">{result}</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
            <button
              onClick={setupTable}
              disabled={loading}
              className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              再試行
            </button>
          </div>
        )}
      </div>
    </div>
  );
}