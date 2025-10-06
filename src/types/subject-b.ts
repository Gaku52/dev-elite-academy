// 科目B 問題の型定義

export type QuestionType = 'fill-in-blank' | 'multiple-choice' | 'trace-execution';

export interface CodeBlock {
  lineNumber?: number;
  code: string;
  highlight?: boolean;
}

export interface FillInBlankOption {
  id: string;
  text: string;
}

export interface FillInBlank {
  id: string;
  label: string; // 例: "a", "b", "c"
  options: FillInBlankOption[];
  correctAnswer: string; // オプションのID
}

export interface SubQuestion {
  id: string;
  questionNumber: string; // 例: "設問1"
  text: string;
  type: QuestionType;
  fillInBlanks?: FillInBlank[];
  choices?: {
    id: string;
    text: string;
  }[];
  correctAnswer?: string | string[];
  explanation: string;
  detailedExplanation?: string;
}

export interface SubjectBQuestion {
  id: string;
  title: string;
  description: string;
  category: 'algorithm' | 'security' | 'database' | 'network';
  difficulty: 'easy' | 'medium' | 'hard';
  timeEstimate: number; // 分

  // 問題文
  problemStatement: string;

  // コード（擬似言語）
  pseudoCode?: CodeBlock[];

  // 補足説明や図
  additionalInfo?: string;

  // 設問
  subQuestions: SubQuestion[];

  // 全体の解説
  overallExplanation?: string;

  // 学習ポイント
  learningPoints?: string[];

  // 関連キーワード
  keywords?: string[];
}

export interface UserAnswer {
  questionId: string;
  subQuestionId: string;
  answer: string | string[];
  isCorrect?: boolean;
  attemptedAt: string;
}

export interface QuestionProgress {
  questionId: string;
  userId: string;
  answers: UserAnswer[];
  score: number;
  maxScore: number;
  completedAt?: string;
  timeSpent: number; // 秒
}
