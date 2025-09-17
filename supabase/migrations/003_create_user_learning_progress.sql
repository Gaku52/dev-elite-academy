-- 学習進捗管理テーブル作成
-- このテーブルはAPIコード（/api/learning-progress）で使用される
CREATE TABLE IF NOT EXISTS user_learning_progress (
  id TEXT DEFAULT gen_random_uuid()::text PRIMARY KEY,
  user_id TEXT NOT NULL,
  module_name TEXT NOT NULL,
  section_key TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  is_correct BOOLEAN DEFAULT FALSE,
  answer_count INTEGER DEFAULT 1,
  correct_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, module_name, section_key)
);

-- インデックス作成（検索パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_user_learning_progress_user_id ON user_learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_learning_progress_module ON user_learning_progress(module_name);
CREATE INDEX IF NOT EXISTS idx_user_learning_progress_section ON user_learning_progress(section_key);
CREATE INDEX IF NOT EXISTS idx_user_learning_progress_completed ON user_learning_progress(is_completed);

-- Row Level Security (RLS) を有効化
ALTER TABLE user_learning_progress ENABLE ROW LEVEL SECURITY;

-- RLSポリシー：ユーザーは自分の進捗のみアクセス可能
DROP POLICY IF EXISTS "Users can view own learning progress" ON user_learning_progress;
CREATE POLICY "Users can view own learning progress" ON user_learning_progress
  FOR SELECT USING (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Users can insert own learning progress" ON user_learning_progress;
CREATE POLICY "Users can insert own learning progress" ON user_learning_progress
  FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Users can update own learning progress" ON user_learning_progress;
CREATE POLICY "Users can update own learning progress" ON user_learning_progress
  FOR UPDATE USING (user_id::text = auth.uid()::text);

-- 更新日時自動更新用トリガー
CREATE OR REPLACE FUNCTION update_user_learning_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_learning_progress_updated_at ON user_learning_progress;
CREATE TRIGGER update_user_learning_progress_updated_at
  BEFORE UPDATE ON user_learning_progress
  FOR EACH ROW EXECUTE FUNCTION update_user_learning_progress_updated_at();

-- 統計計算用のビュー作成
CREATE OR REPLACE VIEW learning_stats AS
SELECT
  user_id,
  module_name,
  COUNT(*) as total_questions,
  COUNT(CASE WHEN is_completed = true THEN 1 END) as completed_questions,
  CASE
    WHEN COUNT(CASE WHEN is_completed = true THEN 1 END) > 0 THEN
      ROUND((COUNT(CASE WHEN is_correct = true THEN 1 END)::DECIMAL / COUNT(CASE WHEN is_completed = true THEN 1 END)::DECIMAL) * 100, 2)
    ELSE 0
  END as correct_rate
FROM user_learning_progress
WHERE is_completed = true
GROUP BY user_id, module_name;