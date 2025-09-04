import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function GET() {
  try {
    // 既存のlearning_contentsテーブルの構造を確認
    const { data: tableInfo } = await supabaseAdmin
      .from('learning_contents')
      .select('id')
      .limit(1);

    // ID型を判定（numberならINTEGER、そうでなければUUID）
    const idType = typeof tableInfo?.[0]?.id === 'number' ? 'INTEGER' : 'UUID DEFAULT gen_random_uuid()';
    const refType = typeof tableInfo?.[0]?.id === 'number' ? 'INTEGER' : 'UUID';

    // 完全なSQL文を生成
    const sql = `
-- ========================================
-- 学習進捗管理システム テーブル作成SQL
-- 既存のlearning_contentsテーブルのID型: ${refType}
-- ========================================

-- 1. ユーザー進捗管理テーブル
CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  user_email TEXT NOT NULL,
  content_id ${refType} REFERENCES learning_contents(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_email, content_id)
);

-- 2. セクション別進捗
CREATE TABLE IF NOT EXISTS section_progress (
  id SERIAL PRIMARY KEY,
  user_email TEXT NOT NULL,
  content_id ${refType} REFERENCES learning_contents(id) ON DELETE CASCADE,
  section_type TEXT CHECK (section_type IN ('video', 'reading', 'code', 'quiz')),
  section_number INTEGER NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_email, content_id, section_type, section_number)
);

-- 3. 学習メモ・ノート
CREATE TABLE IF NOT EXISTS learning_notes (
  id SERIAL PRIMARY KEY,
  user_email TEXT NOT NULL,
  content_id ${refType} REFERENCES learning_contents(id) ON DELETE CASCADE,
  note_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. クイズ結果
CREATE TABLE IF NOT EXISTS quiz_results (
  id SERIAL PRIMARY KEY,
  user_email TEXT NOT NULL,
  content_id ${refType} REFERENCES learning_contents(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percentage DECIMAL(5,2) GENERATED ALWAYS AS ((score::DECIMAL / NULLIF(total_questions, 0)) * 100) STORED,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 学習セッション記録
CREATE TABLE IF NOT EXISTS learning_sessions (
  id SERIAL PRIMARY KEY,
  user_email TEXT NOT NULL,
  content_id ${refType} REFERENCES learning_contents(id) ON DELETE CASCADE,
  session_date DATE DEFAULT CURRENT_DATE,
  duration_minutes INTEGER DEFAULT 0,
  activities_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- インデックス作成（検索パフォーマンス向上）
-- ========================================
CREATE INDEX IF NOT EXISTS idx_user_progress_email ON user_progress(user_email);
CREATE INDEX IF NOT EXISTS idx_user_progress_content ON user_progress(content_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_status ON user_progress(status);
CREATE INDEX IF NOT EXISTS idx_section_progress_email ON section_progress(user_email);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_date ON learning_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_quiz_results_email ON quiz_results(user_email);
CREATE INDEX IF NOT EXISTS idx_learning_notes_email ON learning_notes(user_email);

-- ========================================
-- Row Level Security (RLS) を有効化
-- ========================================
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;

-- RLSポリシー（現時点では全アクセス許可）
CREATE POLICY "Allow all access to user_progress" ON user_progress FOR ALL USING (true);
CREATE POLICY "Allow all access to section_progress" ON section_progress FOR ALL USING (true);
CREATE POLICY "Allow all access to learning_notes" ON learning_notes FOR ALL USING (true);
CREATE POLICY "Allow all access to quiz_results" ON quiz_results FOR ALL USING (true);
CREATE POLICY "Allow all access to learning_sessions" ON learning_sessions FOR ALL USING (true);

-- ========================================
-- 更新日時自動更新用トリガー
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_progress_updated_at 
  BEFORE UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_notes_updated_at 
  BEFORE UPDATE ON learning_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 実行確認用クエリ
-- ========================================
-- 以下のクエリで作成されたテーブルを確認できます：
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('user_progress', 'section_progress', 'learning_notes', 'quiz_results', 'learning_sessions');
`;

    return new NextResponse(sql, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': 'attachment; filename="create_progress_tables.sql"'
      }
    });

  } catch (error: any) {
    return NextResponse.json({ 
      error: 'SQL生成中にエラーが発生しました',
      details: error.message 
    }, { status: 500 });
  }
}