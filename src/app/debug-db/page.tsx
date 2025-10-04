'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function DebugDatabasePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [debugData, setDebugData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError('ログインが必要です');
          setLoading(false);
          return;
        }

        setUserId(user.id);

        const response = await fetch(`/api/debug-cycles?userId=${user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch debug data');
        }

        const data = await response.json();
        setDebugData(data.debug);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <p>読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-red-600">エラー: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/learning-stats" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          学習統計に戻る
        </Link>

        <h1 className="text-3xl font-bold mb-6">データベース診断</h1>

        <div className="space-y-6">
          {/* ユーザーID */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">ユーザー情報</h2>
            <p className="font-mono text-sm bg-gray-100 p-3 rounded">{userId}</p>
          </div>

          {/* テーブル構造 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">テーブル構造</h2>
            <p className="text-sm text-gray-600 mb-2">サンプルレコードのカラム:</p>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-xs">
              {JSON.stringify(debugData?.tableStructure?.sampleColumns || [], null, 2)}
            </pre>
          </div>

          {/* 生データ */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">生データ</h2>
            <div className="mb-4">
              <p className="text-sm"><strong>総レコード数:</strong> {debugData?.rawData?.totalRecords || 0}</p>
            </div>
            <p className="text-sm text-gray-600 mb-2">サンプルレコード:</p>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-xs">
              {JSON.stringify(debugData?.rawData?.sampleRecord || {}, null, 2)}
            </pre>
          </div>

          {/* 周回グループ */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">周回別データ</h2>
            <div className="mb-4">
              <p className="text-sm"><strong>存在する周回:</strong> {debugData?.cycleGroups?.cycles?.join(', ') || 'なし'}</p>
            </div>
            <div className="space-y-4">
              {debugData?.cycleGroups?.stats?.map((stat: any) => (
                <div key={stat.cycle_number} className="border-l-4 border-blue-500 pl-4 py-2">
                  <h3 className="font-semibold text-lg mb-2">第{stat.cycle_number}周目</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>総レコード数:</strong> {stat.total_records}</p>
                      <p><strong>完了済み:</strong> {stat.completed}</p>
                      <p><strong>正解数:</strong> {stat.correct}</p>
                    </div>
                    <div>
                      <p><strong>総回答数:</strong> {stat.total_answer_count}</p>
                      <p><strong>正解回答数:</strong> {stat.total_correct_count}</p>
                      <p><strong>モジュール:</strong> {stat.modules.join(', ')}</p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    <p><strong>開始日:</strong> {stat.earliest_created}</p>
                    <p><strong>最終更新:</strong> {stat.latest_updated}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* cycle_statistics ビュー */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">cycle_statistics ビュー</h2>
            <div className="mb-4">
              <p className="text-sm">
                <strong>利用可能:</strong>{' '}
                {debugData?.cycleStatisticsView?.available ? (
                  <span className="text-green-600">はい</span>
                ) : (
                  <span className="text-red-600">いいえ</span>
                )}
              </p>
            </div>
            {debugData?.cycleStatisticsView?.error && (
              <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
                <p className="text-sm text-red-800">
                  <strong>エラー:</strong> {debugData.cycleStatisticsView.error}
                </p>
              </div>
            )}
            {debugData?.cycleStatisticsView?.data && (
              <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-xs">
                {JSON.stringify(debugData.cycleStatisticsView.data, null, 2)}
              </pre>
            )}
          </div>

          {/* 完全なデバッグデータ */}
          <details className="bg-white rounded-lg shadow p-6">
            <summary className="text-xl font-semibold cursor-pointer">完全なデバッグデータ（展開）</summary>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-xs mt-4">
              {JSON.stringify(debugData, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}
