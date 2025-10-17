import { SWRConfiguration } from 'swr';

// ローカルストレージからキャッシュを即座に読み込み
const loadFromCache = (key: string) => {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(`swr-cache-${key}`);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      // 5分以内のキャッシュのみ使用
      if (Date.now() - timestamp < 5 * 60 * 1000) {
        return data;
      }
    }
  } catch (e) {
    // キャッシュ読み込みエラーは無視
  }
  return null;
};

// ローカルストレージにキャッシュを保存
const saveToCache = (key: string, data: unknown) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`swr-cache-${key}`, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (e) {
    // キャッシュ保存エラーは無視（容量制限など）
  }
};

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

  // ローディング状態の処理
  shouldRetryOnError: true,
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

  const data = await response.json();

  // データをローカルストレージに保存（次回の即座表示用）
  saveToCache(url, data);

  return data;
};

/**
 * キャッシュ優先フェッチャー（超高速表示用）
 * ローカルストレージから即座にキャッシュを返し、バックグラウンドで更新
 */
export const cachedFetcher = async (url: string) => {
  // まずキャッシュを確認（0.001秒レベル）
  const cached = loadFromCache(url);

  if (cached) {
    // キャッシュがあれば即座に返す
    // バックグラウンドで最新データを取得して更新
    authenticatedFetcher(url).catch(() => {
      // バックグラウンド更新のエラーは無視
    });
    return cached;
  }

  // キャッシュがない場合は通常のフェッチ
  return authenticatedFetcher(url);
};
