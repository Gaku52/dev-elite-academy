-- UUID拡張機能の有効化（必要な場合）
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 日次学習進捗テーブル
CREATE TABLE IF NOT EXISTS daily_learning_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  module_name TEXT NOT NULL,
  questions_attempted INTEGER DEFAULT 0,
  questions_correct INTEGER DEFAULT 0,
  time_spent_minutes INTEGER DEFAULT 0,
  sections_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date, module_name)
);

-- 学習ストリークテーブル
CREATE TABLE IF NOT EXISTS learning_streaks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  total_days_learned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 週次/月次サマリーテーブル
CREATE TABLE IF NOT EXISTS learning_summaries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  period_type TEXT NOT NULL CHECK (period_type IN ('weekly', 'monthly')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_questions INTEGER DEFAULT 0,
  correct_questions INTEGER DEFAULT 0,
  total_time_minutes INTEGER DEFAULT 0,
  modules_studied INTEGER DEFAULT 0,
  avg_daily_time INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, period_type, period_start)
);

-- インデックスの作成（既に存在する場合はエラーを無視）
CREATE INDEX IF NOT EXISTS idx_daily_progress_user_date ON daily_learning_progress(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_progress_date ON daily_learning_progress(date);
CREATE INDEX IF NOT EXISTS idx_learning_summaries_user_period ON learning_summaries(user_id, period_type, period_start DESC);

-- RLSポリシーの設定
ALTER TABLE daily_learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_summaries ENABLE ROW LEVEL SECURITY;

-- 既存ポリシーを削除してから作成（重複エラー防止）
DROP POLICY IF EXISTS "Users can view own daily progress" ON daily_learning_progress;
DROP POLICY IF EXISTS "Users can view own streaks" ON learning_streaks;
DROP POLICY IF EXISTS "Users can view own summaries" ON learning_summaries;

-- ユーザーは自分のデータのみアクセス可能
CREATE POLICY "Users can view own daily progress" ON daily_learning_progress
  FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view own streaks" ON learning_streaks
  FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view own summaries" ON learning_summaries
  FOR ALL USING (auth.uid()::text = user_id);

-- サービスロールは全データアクセス可能（APIサーバー用）
CREATE POLICY "Service role can access all daily progress" ON daily_learning_progress
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can access all streaks" ON learning_streaks
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can access all summaries" ON learning_summaries
  FOR ALL USING (auth.role() = 'service_role');