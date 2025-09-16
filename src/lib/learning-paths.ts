// 学習パスのルートマッピング
export const learningPaths = {
  'AWS認定': '/modules/aws',
  '基本情報技術者試験': '/modules/it-fundamentals',
  'AI & 機械学習': '/modules/ai-ml',
  'プログラミング基礎': '/modules/programming-basics',
  'ネットワーク': '/modules/network',
  'セキュリティ': '/modules/security',
  'DB設計': '/modules/db-design',
} as const;

export type LearningPathName = keyof typeof learningPaths;

// カテゴリ名からパスを取得
export function getLearningPathUrl(categoryName: string): string | null {
  return learningPaths[categoryName as LearningPathName] || null;
}