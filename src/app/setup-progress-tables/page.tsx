'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Database, 
  AlertTriangle, 
  PlayCircle,
  Loader2
} from 'lucide-react';

export default function SetupProgressTablesPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<{
    idType?: string;
    results?: {
      created?: string[];
      existing?: string[];
      errors?: Array<{ table: string; error: string }>;
    };
    sqlForManualExecution?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createTables = async () => {
    setIsCreating(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/setup-tables', {
        method: 'POST'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'テーブル作成に失敗しました');
      }

      setResult(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          🔧 学習進捗管理テーブル自動作成
        </h1>

        <div className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 rounded-lg p-6 border border-purple-700/30 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Database className="w-6 h-6 mr-2" />
            作成されるテーブル
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-black/30 rounded-lg p-4">
              <h3 className="text-purple-300 font-semibold mb-2">📊 user_progress</h3>
              <p className="text-gray-400 text-sm">ユーザーの学習進捗を管理</p>
            </div>
            <div className="bg-black/30 rounded-lg p-4">
              <h3 className="text-purple-300 font-semibold mb-2">📝 section_progress</h3>
              <p className="text-gray-400 text-sm">セクション別の完了状態</p>
            </div>
            <div className="bg-black/30 rounded-lg p-4">
              <h3 className="text-purple-300 font-semibold mb-2">📔 learning_notes</h3>
              <p className="text-gray-400 text-sm">学習メモとノート</p>
            </div>
            <div className="bg-black/30 rounded-lg p-4">
              <h3 className="text-purple-300 font-semibold mb-2">🎯 quiz_results</h3>
              <p className="text-gray-400 text-sm">クイズの結果と点数</p>
            </div>
            <div className="bg-black/30 rounded-lg p-4">
              <h3 className="text-purple-300 font-semibold mb-2">⏱️ learning_sessions</h3>
              <p className="text-gray-400 text-sm">学習セッションの記録</p>
            </div>
          </div>
        </div>

        {/* 実行ボタン */}
        <div className="text-center mb-8">
          <button
            onClick={createTables}
            disabled={isCreating}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                作成中...
              </>
            ) : (
              <>
                <PlayCircle className="w-5 h-5 mr-2" />
                テーブルを自動作成
              </>
            )}
          </button>
        </div>

        {/* 結果表示 */}
        {result && (
          <div className="space-y-4 mb-8">
            {/* ID型情報 */}
            <div className="bg-blue-800/30 border border-blue-700/50 rounded-lg p-4">
              <p className="text-blue-300">{result.idType}</p>
            </div>

            {/* 作成済みテーブル */}
            {result.results?.created && result.results.created.length > 0 && (
              <div className="bg-green-800/30 border border-green-700/50 rounded-lg p-4">
                <h3 className="text-green-300 font-semibold mb-2">✅ 作成成功</h3>
                <ul className="text-green-200 text-sm">
                  {result.results.created.map((table: string) => (
                    <li key={table}>• {table}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 既存テーブル */}
            {result.results?.existing && result.results.existing.length > 0 && (
              <div className="bg-yellow-800/30 border border-yellow-700/50 rounded-lg p-4">
                <h3 className="text-yellow-300 font-semibold mb-2">⚠️ 既に存在</h3>
                <ul className="text-yellow-200 text-sm">
                  {result.results.existing.map((table: string) => (
                    <li key={table}>• {table}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* エラー */}
            {result.results?.errors && result.results.errors.length > 0 && (
              <div className="bg-red-800/30 border border-red-700/50 rounded-lg p-4">
                <h3 className="text-red-300 font-semibold mb-2">❌ エラー</h3>
                <div className="space-y-2">
                  {result.results.errors.map((error, index) => (
                    <div key={index}>
                      <p className="text-red-200 text-sm">• {error.table}: {error.error}</p>
                    </div>
                  ))}
                </div>
                {result.sqlForManualExecution && (
                  <div className="mt-4">
                    <p className="text-red-300 text-sm mb-2">
                      以下のSQLをSupabase SQL Editorで実行してください：
                    </p>
                    <pre className="bg-black/50 p-3 rounded text-xs text-gray-300 overflow-x-auto">
                      {result.sqlForManualExecution}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-800/30 border border-red-700/50 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* 注意事項 */}
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/30 mb-8">
          <h3 className="text-white font-semibold mb-3">📌 重要事項</h3>
          <ul className="text-gray-300 space-y-2 text-sm">
            <li>• 既存の<code className="bg-black/50 px-2 py-1 rounded">learning_contents</code>テーブルのID型に自動的に合わせます</li>
            <li>• テーブルが既に存在する場合はスキップされます</li>
            <li>• エラーが発生した場合は、表示されるSQLをSupabase SQL Editorで実行してください</li>
            <li>• Supabaseの無料プランの制限内で動作します</li>
          </ul>
        </div>

        {/* ナビゲーション */}
        <div className="flex space-x-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            📊 ダッシュボードへ
          </Link>
          <Link
            href="/db-test-progress"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🧪 テーブル確認
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            ← ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}