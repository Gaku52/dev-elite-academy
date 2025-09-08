-- ユーザー進捗管理テーブル（既存のINTEGER型IDに合わせる）
CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  user_email TEXT NOT NULL,
  content_id INTEGER REFERENCES learning_contents(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_email, content_id)
);

-- セクション別進捗
CREATE TABLE IF NOT EXISTS section_progress (
  id SERIAL PRIMARY KEY,
  user_email TEXT NOT NULL,
  content_id INTEGER REFERENCES learning_contents(id) ON DELETE CASCADE,
  section_type TEXT CHECK (section_type IN ('video', 'reading', 'code', 'quiz')),
  section_number INTEGER NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_email, content_id, section_type, section_number)
);

-- 学習メモ・ノート
CREATE TABLE IF NOT EXISTS learning_notes (
  id SERIAL PRIMARY KEY,
  user_email TEXT NOT NULL,
  content_id INTEGER REFERENCES learning_contents(id) ON DELETE CASCADE,
  note_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- クイズ結果
CREATE TABLE IF NOT EXISTS quiz_results (
  id SERIAL PRIMARY KEY,
  user_email TEXT NOT NULL,
  content_id INTEGER REFERENCES learning_contents(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percentage DECIMAL(5,2) GENERATED ALWAYS AS ((score::DECIMAL / NULLIF(total_questions, 0)) * 100) STORED,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 学習セッション記録
CREATE TABLE IF NOT EXISTS learning_sessions (
  id SERIAL PRIMARY KEY,
  user_email TEXT NOT NULL,
  content_id INTEGER REFERENCES learning_contents(id) ON DELETE CASCADE,
  session_date DATE DEFAULT CURRENT_DATE,
  duration_minutes INTEGER DEFAULT 0,
  activities_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス作成（検索パフォーマンス向上）
CREATE INDEX idx_user_progress_email ON user_progress(user_email);
CREATE INDEX idx_user_progress_content ON user_progress(content_id);
CREATE INDEX idx_user_progress_status ON user_progress(status);
CREATE INDEX idx_section_progress_email ON section_progress(user_email);
CREATE INDEX idx_learning_sessions_date ON learning_sessions(session_date);

-- Row Level Security (RLS) を有効化
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;

-- RLSポリシー（現時点では全アクセス許可、後で認証追加時に更新）
CREATE POLICY "Allow all access to user_progress" ON user_progress FOR ALL USING (true);
CREATE POLICY "Allow all access to section_progress" ON section_progress FOR ALL USING (true);
CREATE POLICY "Allow all access to learning_notes" ON learning_notes FOR ALL USING (true);
CREATE POLICY "Allow all access to quiz_results" ON quiz_results FOR ALL USING (true);
CREATE POLICY "Allow all access to learning_sessions" ON learning_sessions FOR ALL USING (true);

-- 更新日時自動更新用トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_notes_updated_at BEFORE UPDATE ON learning_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();