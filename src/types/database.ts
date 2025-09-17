export interface LearningProgressRecord {
  id: string;
  user_id: string;
  module_name: string;
  section_key: string;
  is_completed: boolean;
  is_correct: boolean;
  answer_count: number;
  correct_count: number;
  created_at: string;
  updated_at: string;
}

export interface LearningProgressInsert {
  user_id: string;
  module_name: string;
  section_key: string;
  is_completed: boolean;
  is_correct: boolean;
  answer_count: number;
  correct_count: number;
}

export interface LearningProgressUpdate {
  is_completed?: boolean;
  is_correct?: boolean;
  answer_count?: number;
  correct_count?: number;
  updated_at?: string;
}