'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCategories, getLearningContents, Category, LearningContent } from '@/lib/supabase';

export default function DbTestPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [learningContents, setLearningContents] = useState<LearningContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState({
    categoriesSuccess: false,
    learningContentsSuccess: false,
  });

  useEffect(() => {
    async function testDbConnection() {
      try {
        setLoading(true);
        setError(null);

        // 環境変数の状況をデバッグ
        console.log('🔧 環境変数チェック:');
        console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '設定済み' : '未設定');
        console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '設定済み' : '未設定');
        console.log('NODE_ENV:', process.env.NODE_ENV);

        // Categories テーブルをテスト
        try {
          const categoriesData = await getCategories();
          setCategories(categoriesData);
          setTestResults(prev => ({ ...prev, categoriesSuccess: true }));
          console.log('✅ Categories SELECT成功:', categoriesData);
        } catch (err) {
          console.error('❌ Categories SELECT失敗:', err);
          setError(prev => prev ? `${prev}\nCategories: ${err}` : `Categories: ${err}`);
        }

        // Learning Contents テーブルをテスト
        try {
          const contentsData = await getLearningContents();
          setLearningContents(contentsData);
          setTestResults(prev => ({ ...prev, learningContentsSuccess: true }));
          console.log('✅ Learning Contents SELECT成功:', contentsData);
        } catch (err) {
          console.error('❌ Learning Contents SELECT失敗:', err);
          setError(prev => prev ? `${prev}\nLearning Contents: ${err}` : `Learning Contents: ${err}`);
        }

      } catch (err) {
        console.error('❌ DB接続テスト失敗:', err);
        setError(`DB接続エラー: ${err}`);
      } finally {
        setLoading(false);
      }
    }

    testDbConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🧪 Database Connection Test
          </h1>
          <p className="text-gray-300">
            Supabase接続テスト - categoriesとlearning_contentsテーブルのSELECTクエリ確認
          </p>
        </div>

        {/* テスト結果サマリー */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className={`p-6 rounded-lg border-2 ${
            testResults.categoriesSuccess 
              ? 'bg-green-800/20 border-green-500' 
              : 'bg-red-800/20 border-red-500'
          }`}>
            <h3 className="text-xl font-semibold text-white mb-2">
              {testResults.categoriesSuccess ? '✅' : '❌'} Categories テーブル
            </h3>
            <p className="text-gray-300">
              データ件数: {categories.length}件
            </p>
          </div>

          <div className={`p-6 rounded-lg border-2 ${
            testResults.learningContentsSuccess 
              ? 'bg-green-800/20 border-green-500' 
              : 'bg-red-800/20 border-red-500'
          }`}>
            <h3 className="text-xl font-semibold text-white mb-2">
              {testResults.learningContentsSuccess ? '✅' : '❌'} Learning Contents テーブル
            </h3>
            <p className="text-gray-300">
              データ件数: {learningContents.length}件
            </p>
          </div>
        </div>

        {/* ローディング状態 */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-white">データベース接続テスト中...</p>
          </div>
        )}

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-800/20 border border-red-500 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-red-400 mb-2">❌ エラーが発生しました</h3>
            <pre className="text-red-300 whitespace-pre-wrap">{error}</pre>
          </div>
        )}

        {!loading && (
          <>
            {/* Categories データ表示 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">📚 Categories データ</h2>
              {categories.length > 0 ? (
                <div className="bg-slate-800/50 rounded-lg p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-purple-400 pb-2">ID</th>
                          <th className="text-purple-400 pb-2">名前</th>
                          <th className="text-purple-400 pb-2">説明</th>
                          <th className="text-purple-400 pb-2">アイコン</th>
                          <th className="text-purple-400 pb-2">色</th>
                          <th className="text-purple-400 pb-2">順序</th>
                          <th className="text-purple-400 pb-2">有効</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((category) => (
                          <tr key={category.id} className="border-b border-slate-700">
                            <td className="text-white py-2">{category.id}</td>
                            <td className="text-white py-2">{category.name}</td>
                            <td className="text-gray-300 py-2">{category.description}</td>
                            <td className="text-yellow-400 py-2">{category.icon}</td>
                            <td className="text-white py-2">
                              <div 
                                className="w-4 h-4 rounded-full inline-block mr-2" 
                                style={{ backgroundColor: category.color || '#gray' }}
                              ></div>
                              {category.color}
                            </td>
                            <td className="text-white py-2">{category.sort_order}</td>
                            <td className="text-white py-2">
                              {category.is_active ? '✅' : '❌'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-800/50 rounded-lg p-6">
                  <p className="text-gray-400">データが見つかりません</p>
                </div>
              )}
            </div>

            {/* Learning Contents データ表示 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">📖 Learning Contents データ</h2>
              {learningContents.length > 0 ? (
                <div className="bg-slate-800/50 rounded-lg p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-purple-400 pb-2">ID</th>
                          <th className="text-purple-400 pb-2">タイトル</th>
                          <th className="text-purple-400 pb-2">タイプ</th>
                          <th className="text-purple-400 pb-2">難易度</th>
                          <th className="text-purple-400 pb-2">時間(分)</th>
                          <th className="text-purple-400 pb-2">タグ</th>
                          <th className="text-purple-400 pb-2">公開</th>
                        </tr>
                      </thead>
                      <tbody>
                        {learningContents.map((content) => (
                          <tr key={content.id} className="border-b border-slate-700">
                            <td className="text-white py-2">{content.id}</td>
                            <td className="text-white py-2">{content.title}</td>
                            <td className="text-blue-400 py-2">{content.content_type}</td>
                            <td className="text-yellow-400 py-2">{content.difficulty}</td>
                            <td className="text-white py-2">{content.estimated_time}</td>
                            <td className="text-gray-300 py-2">
                              {content.tags.slice(0, 3).join(', ')}
                              {content.tags.length > 3 && '...'}
                            </td>
                            <td className="text-white py-2">
                              {content.is_published ? '✅' : '❌'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-800/50 rounded-lg p-6">
                  <p className="text-gray-400">データが見つかりません</p>
                </div>
              )}
            </div>

            {/* 接続情報 */}
            <div className="bg-slate-800/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">🔧 接続情報</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Supabase URL:</p>
                  <p className="text-white font-mono">
                    {process.env.NEXT_PUBLIC_SUPABASE_URL 
                      ? `✅ ${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30)}...` 
                      : '❌ 未設定'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Anonymous Key:</p>
                  <p className="text-white font-mono">
                    {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
                      ? `✅ ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...` 
                      : '❌ 未設定'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Service Key (サーバーサイド専用):</p>
                  <p className="text-white font-mono">
                    ⚠️ クライアントからは確認不可
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">環境:</p>
                  <p className="text-white font-mono">
                    {process.env.NODE_ENV || 'development'}
                  </p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-yellow-800/20 border border-yellow-600/30 rounded-lg">
                <p className="text-yellow-300 text-sm">
                  💡 Service Role Keyはサーバーサイドでのみ使用され、クライアントからは見えません。
                  実際の接続テストの成功/失敗で動作を確認してください。
                </p>
              </div>
            </div>
          </>
        )}

        {/* ナビゲーション */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            ← ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}