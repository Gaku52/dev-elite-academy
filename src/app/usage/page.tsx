import Link from 'next/link';
import Header from '@/components/Header';
import GrowthPredictionDisplay from '@/components/GrowthPredictionDisplay';
import { getUsageStats } from '@/lib/usage-stats';
import {
  Database,
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Server,
  HardDrive
} from 'lucide-react';

// Supabase無料プラン制限
const FREE_PLAN_LIMITS = {
  database_size_mb: 500,      // 500MB
  monthly_requests: 50000,    // 50,000リクエスト/月
  concurrent_connections: 60,  // 60同時接続
  monthly_bandwidth_gb: 5,    // 5GB帯域幅/月
  auth_users: 50000,          // 50,000認証ユーザー
  storage_gb: 1,              // 1GBストレージ
  edge_functions: 500000      // 500,000 Edge Function実行/月
};

// ISR設定: 1時間ごとに再生成
export const revalidate = 3600;

// 使用率の計算とステータス判定
function getUsageStatus(current: number, limit: number) {
  const percentage = (current / limit) * 100;
  
  if (percentage >= 90) {
    return { status: 'danger', color: 'red', message: '危険' };
  } else if (percentage >= 70) {
    return { status: 'warning', color: 'yellow', message: '注意' };
  } else {
    return { status: 'safe', color: 'green', message: '正常' };
  }
}

export default async function UsagePage() {
  const usageStats = await getUsageStats();
  
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleDateString('ja-JP', { 
    year: 'numeric', 
    month: 'long' 
  });

  // 使用状況の項目（改良版）
  const usageItems = [
    {
      name: 'データベース容量',
      icon: <Database className="w-6 h-6" />,
      current: usageStats?.estimated_db_size_mb || 0,
      limit: FREE_PLAN_LIMITS.database_size_mb,
      unit: 'MB',
      description: 'すべてのテーブルとインデックスの推定容量'
    },
    {
      name: '月間リクエスト数',
      icon: <Activity className="w-6 h-6" />,
      current: usageStats?.estimated_monthly_requests || 0,
      limit: FREE_PLAN_LIMITS.monthly_requests,
      unit: 'req',
      description: 'API呼び出しとデータベースクエリの推定数'
    },
    {
      name: '認証ユーザー数',
      icon: <Server className="w-6 h-6" />,
      current: usageStats?.auth_users_count || 0,
      limit: FREE_PLAN_LIMITS.auth_users,
      unit: '人',
      description: '登録済みユーザーアカウント数'
    },
    {
      name: '月間帯域幅',
      icon: <TrendingUp className="w-6 h-6" />,
      current: usageStats?.estimated_monthly_bandwidth_gb || 0,
      limit: FREE_PLAN_LIMITS.monthly_bandwidth_gb,
      unit: 'GB',
      description: 'データ転送量の推定値'
    },
    {
      name: '学習進捗レコード',
      icon: <CheckCircle className="w-6 h-6" />,
      current: (usageStats?.user_progress_count || 0) + (usageStats?.section_progress_count || 0) + (usageStats?.user_learning_progress_count || 0),
      limit: 50000, // 推定値
      unit: '件',
      description: 'ユーザーの学習進捗データ（全テーブル合計）'
    },
    {
      name: '学習セッション',
      icon: <HardDrive className="w-6 h-6" />,
      current: usageStats?.learning_sessions_count || 0,
      limit: 25000, // 推定値
      unit: '件',
      description: '学習セッションの履歴データ'
    },
    {
      name: 'コンテンツデータ',
      icon: <AlertTriangle className="w-6 h-6" />,
      current: (usageStats?.categories_count || 0) + (usageStats?.learning_contents_count || 0),
      limit: 5000, // 推定値
      unit: '件',
      description: 'カテゴリーと学習コンテンツの総数'
    },
    {
      name: 'データベース効率',
      icon: <TrendingUp className="w-6 h-6" />,
      current: Math.round(((usageStats?.total_records || 1) / Math.max(1, (usageStats?.estimated_db_size_mb || 0.1) * 1024)) * 100) / 100,
      limit: 2000, // レコード/MB (効率値)
      unit: 'rec/MB',
      description: 'データベースの格納効率（高いほど良い）'
    },
    {
      name: '日次統計レコード',
      icon: <Activity className="w-6 h-6" />,
      current: (usageStats?.daily_progress_count || 0) + (usageStats?.daily_learning_progress_count || 0),
      limit: 10000, // 推定値
      unit: '件',
      description: '日次学習統計データ（全テーブル合計）'
    },
    {
      name: '学習ストリーク',
      icon: <TrendingUp className="w-6 h-6" />,
      current: usageStats?.learning_streaks_count || 0,
      limit: 5000, // 推定値
      unit: '件',
      description: '連続学習日数の追跡データ'
    },
    {
      name: 'プロファイルデータ',
      icon: <Server className="w-6 h-6" />,
      current: usageStats?.profiles_count || 0,
      limit: 50000, // 推定値
      unit: '件',
      description: 'ユーザープロファイル拡張データ'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container-modern py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">
            📊 Supabase使用状況モニター
          </h1>
          <p className="text-[#6F6F6F]">
            無料プラン制限の監視と有料プラン移行タイミングの判断
          </p>
          <p className="text-sm text-[#6F6F6F] mt-2">
            対象期間: {currentMonth} | 最終更新: {usageStats?.last_updated ? new Date(usageStats.last_updated).toLocaleString('ja-JP') : '取得中'}
          </p>
        </div>

        {/* 監視状況サマリー */}
        <div className={`card-modern p-6 mb-8 ${
          usageStats?.partial_data
            ? 'bg-yellow-50 border-yellow-200'
            : 'bg-green-50 border-green-200'
        }`}>
          <h2 className="text-2xl font-bold text-black mb-4 flex items-center">
            {usageStats?.partial_data ? (
              <AlertTriangle className="w-6 h-6 mr-2 text-yellow-500" />
            ) : (
              <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
            )}
            データベース監視状況
            {usageStats?.partial_data && (
              <span className="ml-3 text-sm text-yellow-700 font-normal">
                （一部データ取得失敗）
              </span>
            )}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
            <div>
              <p className={usageStats?.partial_data ? 'text-yellow-700' : 'text-green-700'}>監視中テーブル</p>
              <p className="text-black font-mono">{usageStats?.monitored_tables_count || 0} / {usageStats?.active_tables_count || 11}</p>
            </div>
            <div>
              <p className={usageStats?.partial_data ? 'text-yellow-700' : 'text-green-700'}>総レコード数</p>
              <p className="text-black font-mono">{usageStats?.total_records?.toLocaleString() || 0}</p>
            </div>
            <div>
              <p className={usageStats?.partial_data ? 'text-yellow-700' : 'text-green-700'}>DB使用量</p>
              <p className="text-black font-mono">{usageStats?.estimated_db_size_mb?.toFixed(2) || '0.00'} MB</p>
            </div>
            <div>
              <p className={usageStats?.partial_data ? 'text-yellow-700' : 'text-green-700'}>最終更新</p>
              <p className="text-black font-mono text-xs">{usageStats?.last_updated ? new Date(usageStats.last_updated).toLocaleTimeString('ja-JP') : '取得中'}</p>
            </div>
          </div>

          {/* 失敗したテーブルの警告 */}
          {usageStats?.failed_tables && usageStats.failed_tables.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
              <p className="text-sm text-yellow-800 font-semibold mb-1">
                ⚠️ 以下のテーブルでデータ取得に失敗しました:
              </p>
              <p className="text-xs text-yellow-700 font-mono">
                {usageStats.failed_tables.join(', ')}
              </p>
              <p className="text-xs text-yellow-600 mt-2">
                統計データは利用可能なテーブルの情報のみで算出されています。
              </p>
            </div>
          )}
        </div>

        {/* 無料プラン概要 */}
        <div className="card-modern p-6 mb-8 bg-blue-50 border-blue-200">
          <h2 className="text-2xl font-bold text-black mb-4 flex items-center">
            <AlertTriangle className="w-6 h-6 mr-2 text-blue-500" />
            Supabase無料プラン制限
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-blue-700">データベース容量</p>
              <p className="text-black font-mono">{FREE_PLAN_LIMITS.database_size_mb}MB</p>
            </div>
            <div>
              <p className="text-blue-700">月間リクエスト</p>
              <p className="text-black font-mono">{FREE_PLAN_LIMITS.monthly_requests.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-blue-700">同時接続数</p>
              <p className="text-black font-mono">{FREE_PLAN_LIMITS.concurrent_connections}</p>
            </div>
            <div>
              <p className="text-blue-700">月間帯域幅</p>
              <p className="text-black font-mono">{FREE_PLAN_LIMITS.monthly_bandwidth_gb}GB</p>
            </div>
          </div>
        </div>

        {/* 使用状況詳細 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {usageItems.map((item) => {
            const status = getUsageStatus(item.current, item.limit);
            const percentage = Math.min(100, (item.current / item.limit) * 100);
            
            return (
              <div
                key={item.name}
                className="card-modern p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-2xl ${
                      status.status === 'danger' ? 'bg-red-100 border border-red-200' :
                      status.status === 'warning' ? 'bg-yellow-100 border border-yellow-200' :
                      'bg-green-100 border border-green-200'
                    }`}>
                      <div className={`${
                        status.status === 'danger' ? 'text-red-600' :
                        status.status === 'warning' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {item.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-black">{item.name}</h3>
                      <p className="text-sm text-[#6F6F6F]">{item.description}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    status.status === 'danger' ? 'bg-red-100 text-red-800 border border-red-200' :
                    status.status === 'warning' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                    'bg-green-100 text-green-800 border border-green-200'
                  }`}>
                    {status.message}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-black">
                      {item.current.toLocaleString()} / {item.limit.toLocaleString()} {item.unit}
                    </span>
                    <span className={`font-mono ${
                      status.status === 'danger' ? 'text-red-700' :
                      status.status === 'warning' ? 'text-yellow-700' :
                      'text-green-700'
                    }`}>
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full bg-gradient-to-r transition-all duration-500 ${
                        status.status === 'danger' 
                          ? 'from-red-500 to-red-600' 
                          : status.status === 'warning'
                          ? 'from-yellow-500 to-orange-500'
                          : 'from-green-500 to-[#8E9C78]'
                      }`}
                      style={{ width: `${Math.min(100, percentage)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 成長予測と制限到達予測 */}
        <div className="card-modern p-6 mb-8 bg-purple-50 border-purple-200">
          <h2 className="text-2xl font-bold text-black mb-4 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-purple-600" />
            成長予測とタイムライン
          </h2>
          <GrowthPredictionDisplay />
        </div>

        {/* 有料プラン移行判断 */}
        <div className="card-modern p-6 mb-8 bg-[#8E9C78]/10 border-[#8E9C78]/20">
          <h2 className="text-2xl font-bold text-black mb-4 flex items-center">
            <AlertTriangle className="w-6 h-6 mr-2 text-[#8E9C78]" />
            有料プラン移行判断
          </h2>
          
          {/* 総合判定 */}
          <div className="mb-6">
            {usageStats && (
              (() => {
                const dbUsage = (usageStats.estimated_db_size_mb / FREE_PLAN_LIMITS.database_size_mb) * 100;
                
                if (dbUsage >= 80) {
                  return (
                    <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
                      <AlertTriangle className="w-8 h-8 text-red-600" />
                      <div>
                        <p className="text-black font-semibold">🚨 有料プラン移行推奨</p>
                        <p className="text-red-700 text-sm">データベース使用率が{dbUsage.toFixed(1)}%に達しています</p>
                      </div>
                    </div>
                  );
                } else if (dbUsage >= 60) {
                  return (
                    <div className="flex items-center space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
                      <AlertTriangle className="w-8 h-8 text-yellow-600" />
                      <div>
                        <p className="text-black font-semibold">⚠️ 監視強化期間</p>
                        <p className="text-yellow-700 text-sm">使用量増加を注意深く監視してください</p>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-2xl">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="text-black font-semibold">✅ 無料プランで問題なし</p>
                        <p className="text-green-700 text-sm">現在の使用量なら無料プランで継続可能です</p>
                      </div>
                    </div>
                  );
                }
              })()
            )}
          </div>

          {/* 推奨アクション */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card-modern p-4">
              <h4 className="text-black font-semibold mb-2">📈 Pro Plan (月$25)</h4>
              <ul className="text-[#6F6F6F] text-sm space-y-1">
                <li>• データベース: 8GB</li>
                <li>• 月間帯域幅: 250GB</li>
                <li>• 同時接続: 200</li>
                <li>• 自動バックアップ</li>
              </ul>
            </div>
            
            <div className="card-modern p-4">
              <h4 className="text-black font-semibold mb-2">🚀 Team Plan (月$599)</h4>
              <ul className="text-[#6F6F6F] text-sm space-y-1">
                <li>• データベース: 500GB</li>
                <li>• 月間帯域幅: 2.5TB</li>
                <li>• 同時接続: 1,500</li>
                <li>• 高度な監視・サポート</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <Link
            href="/"
            className="btn-modern inline-flex items-center px-6 py-3 mr-4"
          >
            ← ホームに戻る
          </Link>
          <Link
            href="/db-test"
            className="btn-secondary inline-flex items-center px-6 py-3"
          >
            🧪 DB接続テスト
          </Link>
        </div>
      </div>
    </div>
  );
}