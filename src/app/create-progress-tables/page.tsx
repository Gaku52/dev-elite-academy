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
  const [sqlType, setSqlType] = useState('simple'); // 'simple', 'full', 'user_master', 'auth_integration'
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [idType, setIdType] = useState('');
  const [tableStatus, setTableStatus] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [statusLoading, setStatusLoading] = useState(false);

  const fetchSql = (type: 'simple' | 'full' | 'user_master' | 'auth_integration') => {
    setLoading(true);
    let endpoint = '/api/generate-simple-sql';
    
    switch(type) {
      case 'full':
        endpoint = '/api/generate-sql';
        break;
      case 'user_master':
        endpoint = '/api/generate-user-master-sql';
        break;
      case 'auth_integration':
        endpoint = '/api/generate-auth-integration-sql';
        break;
      default:
        endpoint = '/api/generate-simple-sql';
    }
    
    fetch(endpoint)
      .then(response => response.text())
      .then(data => {
        setSql(data);
        setSqlType(type);
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
  };

  const fetchTableStatus = async () => {
    setStatusLoading(true);
    try {
      const response = await fetch('/api/check-tables-status');
      if (response.ok) {
        const data = await response.json();
        setTableStatus(data);
      }
    } catch (error) {
      console.error('テーブル状況確認エラー:', error);
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    // デフォルトでテーブル状況確認を実行
    fetchTableStatus();
    // シンプル版SQLを読み込み
    fetchSql('simple');
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

        {/* テーブル状況確認 */}
        <div className="bg-gradient-to-br from-slate-800/30 to-slate-700/30 rounded-lg p-6 border border-slate-600/30 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Database className="w-6 h-6 mr-2" />
              現在のデータベース状況
            </h2>
            <button
              onClick={fetchTableStatus}
              disabled={statusLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {statusLoading ? '確認中...' : '再確認'}
            </button>
          </div>
          
          {tableStatus && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-black/30 rounded-lg p-4">
                <h3 className="text-blue-300 font-semibold mb-2">基本情報</h3>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>総テーブル数: {tableStatus.summary.totalTables}</div>
                  <div>ID型: {tableStatus.summary.idType}</div>
                  <div>認証統合: {
                    tableStatus.summary.authIntegrationStatus === 'fully_integrated' ? '✅ 完了' :
                    tableStatus.summary.authIntegrationStatus === 'partial_tables_only' ? '⚠️ 部分的' :
                    '❌ 未実装'
                  }</div>
                </div>
              </div>
              
              <div className="bg-black/30 rounded-lg p-4">
                <h3 className="text-green-300 font-semibold mb-2">コアテーブル ({tableStatus.summary.coreAppTablesCount}/2)</h3>
                <div className="text-sm text-gray-300">
                  {tableStatus.tables.coreApp.map((table: string) => (
                    <div key={table}>✅ {table}</div>
                  ))}
                  {tableStatus.summary.coreAppTablesCount < 2 && (
                    <div className="text-yellow-400">⚠️ 基本テーブルが不足</div>
                  )}
                </div>
              </div>
              
              <div className="bg-black/30 rounded-lg p-4">
                <h3 className="text-purple-300 font-semibold mb-2">進捗テーブル ({tableStatus.summary.progressTablesCount}/3)</h3>
                <div className="text-sm text-gray-300">
                  {tableStatus.tables.progress.map((table: string) => (
                    <div key={table}>✅ {table}</div>
                  ))}
                  {tableStatus.summary.progressTablesCount === 0 && (
                    <div className="text-yellow-400">⚠️ 進捗テーブルなし</div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {tableStatus?.recommendations?.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-800/30 border border-yellow-700/50 rounded-lg">
              <h4 className="text-yellow-300 font-semibold mb-2">推奨アクション</h4>
              <ul className="text-yellow-200 text-sm space-y-1">
                {tableStatus.recommendations.map((rec: any, index: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                  <li key={index}>• {rec.message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

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

        {/* SQL種類選択 */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 rounded-lg p-6 border border-slate-600/30 mb-6">
          <h3 className="text-white font-semibold mb-4">SQL種類を選択</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <button
              onClick={() => fetchSql('simple')}
              className={`p-4 rounded-lg border transition-all ${
                sqlType === 'simple' 
                  ? 'bg-green-800/30 border-green-500 text-green-300'
                  : 'bg-slate-700/50 border-slate-600 text-gray-300 hover:border-green-500'
              }`}
            >
              <div className="text-lg font-semibold mb-2">🔰 基本進捗テーブル</div>
              <div className="text-sm">
                • user_email ベース<br/>
                • エラーが発生しにくい<br/>
                • 基本機能で十分
              </div>
            </button>
            <button
              onClick={() => fetchSql('full')}
              className={`p-4 rounded-lg border transition-all ${
                sqlType === 'full' 
                  ? 'bg-blue-800/30 border-blue-500 text-blue-300'
                  : 'bg-slate-700/50 border-slate-600 text-gray-300 hover:border-blue-500'
              }`}
            >
              <div className="text-lg font-semibold mb-2">⚙️ 完全版進捗テーブル</div>
              <div className="text-sm">
                • インデックス・RLS・トリガー含む<br/>
                • 最大パフォーマンス<br/>
                • user_email ベース
              </div>
            </button>
          </div>
          
          <div className="border-t border-slate-600/30 pt-4">
            <h4 className="text-white font-semibold mb-3">🔐 認証システム対応版</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => fetchSql('user_master')}
                className={`p-4 rounded-lg border transition-all ${
                  sqlType === 'user_master' 
                    ? 'bg-purple-800/30 border-purple-500 text-purple-300'
                    : 'bg-slate-700/50 border-slate-600 text-gray-300 hover:border-purple-500'
                }`}
              >
                <div className="text-lg font-semibold mb-2">👤 ユーザーマスターテーブル</div>
                <div className="text-sm">
                  • GitHub OAuth対応<br/>
                  • auth.users との連携<br/>
                  • 自動トリガー付き
                </div>
              </button>
              <button
                onClick={() => fetchSql('auth_integration')}
                className={`p-4 rounded-lg border transition-all ${
                  sqlType === 'auth_integration' 
                    ? 'bg-orange-800/30 border-orange-500 text-orange-300'
                    : 'bg-slate-700/50 border-slate-600 text-gray-300 hover:border-orange-500'
                }`}
              >
                <div className="text-lg font-semibold mb-2">🔄 認証統合更新版</div>
                <div className="text-sm">
                  • 既存テーブル更新<br/>
                  • user_email → auth.users.id<br/>
                  • データ移行サポート
                </div>
              </button>
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