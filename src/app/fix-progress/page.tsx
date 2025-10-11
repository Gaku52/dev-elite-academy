'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function FixProgressPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    details: {
      inconsistentRecordsBefore: number;
      fixedRecords: number;
      inconsistentRecordsAfter: number;
      cycleStats: Record<number, { total: number; completed: number }>;
    };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    }
    init();
  }, []);

  const handleFix = async () => {
    if (!userId) {
      alert('ログインしてください');
      return;
    }

    if (!confirm('進捗データを修正します。よろしいですか？')) {
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/fix-progress-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fix data');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Link href="/learning-stats" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        学習統計に戻る
      </Link>

      <h1 className="text-3xl font-bold mb-6">進捗データ修正ツール</h1>

      <div className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">このツールについて</h2>
        <p className="text-sm mb-2">
          このツールは、以下の問題を修正します:
        </p>
        <ul className="list-disc pl-6 text-sm space-y-1">
          <li>問題に回答したが「未完了」として記録されているデータ</li>
          <li>不正解だったために進捗にカウントされていないデータ</li>
          <li>周回別統計が0%と表示される問題</li>
        </ul>
        <p className="text-sm mt-2 text-gray-600">
          ※ このツールは安全です。データが削除されることはありません。
        </p>
      </div>

      {!userId && (
        <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
          <p className="text-red-600">ログインが必要です</p>
        </div>
      )}

      {userId && (
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-4">User ID: {userId}</p>
          <button
            onClick={handleFix}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-semibold ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? '修正中...' : '進捗データを修正する'}
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
          <h3 className="font-semibold text-red-800 mb-2">エラー</h3>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-green-50 dark:bg-green-900 border border-green-200 rounded p-6">
          <h3 className="font-semibold text-green-800 mb-4 text-lg">✓ 修正完了</h3>
          <div className="space-y-3 mb-4">
            <p className="text-sm">
              <span className="font-semibold">修正前の不整合レコード:</span>{' '}
              {result.details.inconsistentRecordsBefore}件
            </p>
            <p className="text-sm">
              <span className="font-semibold">修正されたレコード:</span>{' '}
              {result.details.fixedRecords}件
            </p>
            <p className="text-sm">
              <span className="font-semibold">修正後の不整合レコード:</span>{' '}
              {result.details.inconsistentRecordsAfter}件
            </p>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold mb-3">周回別統計 (修正後)</h4>
            <div className="space-y-2">
              {Object.entries(result.details.cycleStats).map(([cycle, stats]) => (
                <div key={cycle} className="bg-white dark:bg-gray-800 rounded p-3 border border-gray-200">
                  <p className="font-semibold">第{cycle}周目</p>
                  <p className="text-sm text-gray-600">
                    完了: {stats.completed} / {stats.total} (
                    {Math.round((stats.completed / stats.total) * 100)}%)
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-green-200">
            <Link
              href="/learning-stats"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              学習統計ページで確認する
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
