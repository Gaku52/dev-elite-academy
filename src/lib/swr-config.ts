import { SWRConfiguration } from 'swr';

/**
 * SWR グローバル設定
 * データキャッシュと自動再検証の動作を定義
 */
export const swrConfig: SWRConfiguration = {
  // データの再検証間隔
  dedupingInterval: 2000, // 2秒間は同じリクエストを重複させない

  // フォーカス時の自動再検証
  revalidateOnFocus: true, // タブに戻った時に最新データを取得

  // 再接続時の自動再検証
  revalidateOnReconnect: true, // ネットワーク復帰時に最新データを取得

  // 定期的な再検証（無効化して必要に応じて個別設定）
  refreshInterval: 0,

  // エラー時のリトライ
  errorRetryCount: 3, // 最大3回リトライ
  errorRetryInterval: 5000, // 5秒間隔でリトライ

  // キャッシュの保持時間（ミリ秒）
  // デフォルトではブラウザを閉じるまでキャッシュを保持

  // ローディング状態の処理
  shouldRetryOnError: true,

  // フェッチャーのデフォルト設定は各コンポーネントで定義
};

/**
 * 認証付きフェッチャー
 * 学習進捗データの取得に使用
 */
export const authenticatedFetcher = async (url: string) => {
  const response = await fetch(url, {
    credentials: 'include', // 認証クッキーを含める
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = new Error('データの取得に失敗しました') as Error & { status?: number; info?: unknown };
    // エラー情報を付加
    error.status = response.status;
    error.info = await response.json().catch(() => ({}));
    throw error;
  }

  return response.json();
};
