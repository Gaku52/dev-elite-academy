import type { DocumentConfig } from '@/types/documents';

export const specificationsConfig: DocumentConfig = {
  githubPath: 'project-docs/specifications',
  apiPath: '/api/specifications',
  pageTitle: '仕様書・設計書',
  pageDescription: 'プロジェクトの仕様書と設計書の一覧です。各ドキュメントをクリックして詳細を確認できます。',
  emptyMessage: '仕様書・設計書がまだありません',
  viewButtonText: '仕様書を表示',
  backButtonText: '仕様書一覧に戻る',
  githubRepoUrl: 'https://github.com/Gaku52/dev-elite-academy/blob/main'
};

export const subjectBConfig: DocumentConfig = {
  githubPath: 'project-docs/subject-b',
  apiPath: '/api/subject-b',
  pageTitle: '科目B 過去問題',
  pageDescription: '基本情報技術者試験 科目Bの過去問題集です。各問題をクリックして挑戦してください。',
  emptyMessage: '科目Bの問題がまだありません',
  viewButtonText: '問題を表示',
  backButtonText: '問題一覧に戻る',
  githubRepoUrl: 'https://github.com/Gaku52/dev-elite-academy/blob/main'
};
