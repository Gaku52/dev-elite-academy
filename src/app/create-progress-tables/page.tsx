'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Database, 
  Copy, 
  CheckCircle,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';

export default function CreateProgressTablesPage() {
  const [sql, setSql] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [idType, setIdType] = useState('');

  useEffect(() => {
    // SQL取得
    fetch('/api/generate-sql')
      .then(response => response.text())
      .then(data => {
        setSql(data);
        // ID型を判定
        if (data.includes('INTEGER')) {
          setIdType('INTEGER');
        } else {
          setIdType('UUID');
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('SQL取得エラー:', error);
        setLoading(false);
      });
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('クリップボードへのコピーに失敗:', error);
    }
  };

  const openSupabaseSQL = () => {
    // SupabaseのSQL Editorを開く（プロジェクトURLは環境変数から取得）
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      const projectId = supabaseUrl.split('//')[1].split('.')[0];
      window.open(`https://supabase.com/dashboard/project/${projectId}/sql`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">SQL生成中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          🔧 学習進捗管理テーブル作成
        </h1>

        {/* 手順説明 */}
        <div className="bg-gradient-to-br from-blue-800/30 to-cyan-800/30 rounded-lg p-6 border border-blue-700/30 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Database className="w-6 h-6 mr-2" />
            作成手順
          </h2>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-black/30 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">1️⃣</div>
              <h3 className="text-blue-300 font-semibold mb-2">SQLをコピー</h3>
              <p className="text-gray-400 text-sm">下のボタンでSQLをクリップボードにコピー</p>
            </div>
            <div className="bg-black/30 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">2️⃣</div>
              <h3 className="text-blue-300 font-semibold mb-2">SQL Editorを開く</h3>
              <p className="text-gray-400 text-sm">SupabaseのSQL Editorページを開く</p>
            </div>
            <div className="bg-black/30 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">3️⃣</div>
              <h3 className="text-blue-300 font-semibold mb-2">SQLを実行</h3>
              <p className="text-gray-400 text-sm">コピーしたSQLを貼り付けて実行</p>
            </div>
          </div>
        </div>

        {/* ID型情報 */}
        <div className="bg-green-800/30 border border-green-700/50 rounded-lg p-4 mb-6">
          <p className="text-green-300">
            🔍 検出されたID型: <strong>{idType}</strong> 
            （既存のlearning_contentsテーブルに合わせて自動調整済み）
          </p>
        </div>

        {/* アクションボタン */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={copyToClipboard}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
          >
            {copied ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                コピー済み！
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 mr-2" />
                SQLをクリップボードにコピー
              </>
            )}
          </button>

          <button
            onClick={openSupabaseSQL}
            className="flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Supabase SQL Editorを開く
          </button>
        </div>

        {/* SQLプレビュー */}
        <div className="bg-slate-800/50 rounded-lg border border-slate-600/30 mb-6">
          <div className="flex items-center justify-between p-4 border-b border-slate-600/30">
            <h3 className="text-white font-semibold">実行用SQL</h3>
            <span className="text-gray-400 text-sm">自動生成済み</span>
          </div>
          <div className="p-4">
            <pre className="bg-black/50 p-4 rounded text-sm text-gray-300 overflow-x-auto max-h-96 overflow-y-auto">
              {sql}
            </pre>
          </div>
        </div>

        {/* 注意事項 */}
        <div className="bg-yellow-800/30 border border-yellow-700/50 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2 mt-0.5" />
            <div>
              <h3 className="text-yellow-300 font-semibold mb-2">重要な注意事項</h3>
              <ul className="text-yellow-200 text-sm space-y-1">
                <li>• SQLには<code className="bg-black/50 px-1 rounded">IF NOT EXISTS</code>が含まれているため、既存テーブルは保護されます</li>
                <li>• 実行前にSupabaseプロジェクトの<strong>バックアップ</strong>を推奨します</li>
                <li>• エラーが発生した場合は、エラーメッセージを確認してください</li>
                <li>• 成功後は下の「テーブル確認」ボタンで結果を確認してください</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ナビゲーション */}
        <div className="flex flex-wrap gap-4">
          <Link
            href="/db-test-progress"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            🧪 テーブル作成確認
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            📊 ダッシュボードへ
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