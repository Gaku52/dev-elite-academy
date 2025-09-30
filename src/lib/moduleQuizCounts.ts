// 各モジュールの総クイズ数（実装済みのモジュールから取得）
// この数値は各モジュールの実装状況に基づいて更新される
export const moduleQuizCounts: Record<string, number> = {
  'computer-systems': 134,        // 拡張済み - 134クイズ（基礎理論+30問追加）
  'algorithms-programming': 118,  // 拡張済み - 118クイズ（数学系+30問追加）
  'database': 80,                 // 実装済み - 80クイズ
  'network': 120,                 // 拡張済み - 120クイズ（情報・通信理論+20問追加）
  'security': 100,                // 実装済み - 100クイズ
  'system-development': 120,      // 実装済み - 120クイズ
  'management-legal': 100,        // 実装済み - 100クイズ
  'strategy': 106                 // 拡張済み - 106クイズ（ビジネスインダストリ+10問追加）
};

// 総問題数を計算
export const getTotalQuestions = (): number => {
  return Object.values(moduleQuizCounts).reduce((sum, count) => sum + count, 0);
};

// モジュール名のマッピング
export const moduleNameMapping: Record<number, string> = {
  1: 'computer-systems',
  2: 'algorithms-programming',
  3: 'database',
  4: 'network',
  5: 'security',
  6: 'system-development',
  7: 'management-legal',
  8: 'strategy'
};