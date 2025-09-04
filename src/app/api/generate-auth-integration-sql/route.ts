import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    // 既存のlearning_contentsテーブルの構造を確認
    const { data: tableInfo } = await supabaseAdmin
      .from('learning_contents')
      .select('id')
      .limit(1);

    // ID型を判定
    const refType = typeof tableInfo?.[0]?.id === 'number' ? 'INTEGER' : 'UUID';

    const sql = `
-- ==========================================
-- 既存進捗テーブルの認証システム統合更新SQL
-- user_email から auth.users.id 参照への移行
-- 参照ID型: ${refType}
-- ==========================================

-- 注意: このSQLは既存データを保持しながら段階的に移行します
-- バックアップを取ってから実行してください

-- 1. 既存テーブル構造の更新準備
-- user_progress テーブルの user_id カラムを追加（既存の user_email と併用）
DO $$
BEGIN
  -- user_id カラムが存在しない場合のみ追加
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_progress' 
    AND column_name = 'user_id'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE user_progress ADD COLUMN user_id UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- section_progress テーブルの user_id カラムを追加
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'section_progress' 
    AND column_name = 'user_id'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE section_progress ADD COLUMN user_id UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- learning_sessions テーブルの user_id カラムを追加
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'learning_sessions' 
    AND column_name = 'user_id'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE learning_sessions ADD COLUMN user_id UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- 2. 新しい認証統合版テーブル作成（既存テーブルがない場合）
-- user_progress テーブル（認証統合版）
CREATE TABLE IF NOT EXISTS user_progress_v2 (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id ${refType} NOT NULL REFERENCES learning_contents(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, content_id)
);

-- section_progress テーブル（認証統合版）
CREATE TABLE IF NOT EXISTS section_progress_v2 (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id ${refType} NOT NULL REFERENCES learning_contents(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL CHECK (section_type IN ('video', 'reading', 'code', 'quiz')),
  section_number INTEGER NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, content_id, section_type, section_number)
);

-- learning_sessions テーブル（認証統合版）
CREATE TABLE IF NOT EXISTS learning_sessions_v2 (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id ${refType} NOT NULL REFERENCES learning_contents(id) ON DELETE CASCADE,
  session_date DATE DEFAULT CURRENT_DATE,
  duration_minutes INTEGER DEFAULT 0,
  activities_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. インデックス作成
CREATE INDEX IF NOT EXISTS idx_user_progress_v2_user_id ON user_progress_v2(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_v2_content_id ON user_progress_v2(content_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_v2_status ON user_progress_v2(status);

CREATE INDEX IF NOT EXISTS idx_section_progress_v2_user_id ON section_progress_v2(user_id);
CREATE INDEX IF NOT EXISTS idx_section_progress_v2_content_id ON section_progress_v2(content_id);

CREATE INDEX IF NOT EXISTS idx_learning_sessions_v2_user_id ON learning_sessions_v2(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_v2_session_date ON learning_sessions_v2(session_date);

-- 4. RLS (Row Level Security) 設定
ALTER TABLE user_progress_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_progress_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions_v2 ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のデータのみアクセス可能
CREATE POLICY "Users can manage own progress v2" ON user_progress_v2
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own sections v2" ON section_progress_v2
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own sessions v2" ON learning_sessions_v2
  FOR ALL USING (auth.uid() = user_id);

-- 5. 更新時刻の自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_progress_v2_updated_at ON user_progress_v2;
CREATE TRIGGER update_user_progress_v2_updated_at 
  BEFORE UPDATE ON user_progress_v2
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. 統合ビューの更新
CREATE OR REPLACE VIEW user_learning_summary AS
SELECT 
  u.id as user_master_id,
  u.auth_user_id,
  u.email,
  u.full_name,
  u.avatar_url,
  u.github_username,
  u.subscription_tier,
  COUNT(DISTINCT up.content_id) as contents_started,
  COUNT(DISTINCT CASE WHEN up.status = 'completed' THEN up.content_id END) as contents_completed,
  COALESCE(SUM(ls.duration_minutes), 0) as total_study_minutes,
  MAX(up.last_accessed_at) as last_study_date,
  u.created_at as joined_at
FROM users u
LEFT JOIN user_progress_v2 up ON u.auth_user_id = up.user_id
LEFT JOIN learning_sessions_v2 ls ON u.auth_user_id = ls.user_id
GROUP BY u.id, u.auth_user_id, u.email, u.full_name, u.avatar_url, u.github_username, u.subscription_tier, u.created_at;

-- ==========================================
-- データ移行スクリプト（手動実行）
-- ==========================================

-- 注意: 以下は参考用のデータ移行クエリです
-- 実際の移行時は、usersテーブルでemail一致でマッピングしてください

/*
-- 既存データの移行例（usersテーブル作成後に実行）
INSERT INTO user_progress_v2 (user_id, content_id, status, progress_percentage, started_at, completed_at, last_accessed_at, created_at, updated_at)
SELECT 
  u.auth_user_id,
  up.content_id,
  up.status,
  up.progress_percentage,
  up.started_at,
  up.completed_at,
  up.last_accessed_at,
  up.created_at,
  up.updated_at
FROM user_progress up
JOIN users u ON u.email = up.user_email
ON CONFLICT (user_id, content_id) DO NOTHING;

-- section_progress の移行
INSERT INTO section_progress_v2 (user_id, content_id, section_type, section_number, is_completed, completed_at, duration_minutes, created_at)
SELECT 
  u.auth_user_id,
  sp.content_id,
  sp.section_type,
  sp.section_number,
  sp.is_completed,
  sp.completed_at,
  sp.duration_minutes,
  sp.created_at
FROM section_progress sp
JOIN users u ON u.email = sp.user_email
ON CONFLICT (user_id, content_id, section_type, section_number) DO NOTHING;

-- learning_sessions の移行
INSERT INTO learning_sessions_v2 (user_id, content_id, session_date, duration_minutes, activities_completed, created_at)
SELECT 
  u.auth_user_id,
  ls.content_id,
  ls.session_date,
  ls.duration_minutes,
  ls.activities_completed,
  ls.created_at
FROM learning_sessions ls
JOIN users u ON u.email = ls.user_email;
*/

-- ==========================================
-- 移行完了後のクリーンアップ（慎重に実行）
-- ==========================================

/*
-- 移行確認後、古いテーブルをリネーム（削除前のバックアップ）
-- ALTER TABLE user_progress RENAME TO user_progress_backup_email;
-- ALTER TABLE section_progress RENAME TO section_progress_backup_email;
-- ALTER TABLE learning_sessions RENAME TO learning_sessions_backup_email;

-- 新しいテーブルを本テーブル名に変更
-- ALTER TABLE user_progress_v2 RENAME TO user_progress;
-- ALTER TABLE section_progress_v2 RENAME TO section_progress;
-- ALTER TABLE learning_sessions_v2 RENAME TO learning_sessions;
*/

-- ==========================================
-- 確認クエリ
-- ==========================================

-- テーブル作成確認
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_progress_v2', 'section_progress_v2', 'learning_sessions_v2');

-- RLS確認
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';
`;

    return new NextResponse(sql, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': 'attachment; filename="auth_integration_update.sql"'
      }
    });

  } catch (error) {
    return NextResponse.json({ 
      error: '認証統合SQL生成中にエラーが発生しました',
      details: (error as Error).message 
    }, { status: 500 });
  }
}