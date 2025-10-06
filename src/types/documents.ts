// 共通のドキュメント/問題の型定義

export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
}

export interface DocumentItem {
  name: string;
  displayName: string;
  path: string;
  size: number;
  downloadUrl: string;
  htmlUrl: string;
  lastModified?: string;
}

export interface DocumentConfig {
  // GitHub リポジトリのパス
  githubPath: string;
  // APIのベースパス
  apiPath: string;
  // ページタイトル
  pageTitle: string;
  // ページの説明
  pageDescription: string;
  // 空の状態のメッセージ
  emptyMessage: string;
  // ボタンテキスト
  viewButtonText: string;
  // 戻るリンクテキスト
  backButtonText: string;
  // GitHubリポジトリURL
  githubRepoUrl: string;
}
