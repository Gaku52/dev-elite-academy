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

export async function POST() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const results = [];

    // テーブル作成のSQL文を生成して返すのみ（手動実行用）
    const sql = `
-- ==========================================
-- 学習進捗追跡テーブル作成SQL
-- 新APIキー対応版
-- ==========================================

-- 1. user_progressテーブル作成
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id INTEGER NOT NULL REFERENCES learning_contents(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'paused')),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, content_id)
);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_content_id ON user_progress(content_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_status ON user_progress(status);

-- 2. section_progressテーブル作成
CREATE TABLE IF NOT EXISTS section_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id INTEGER NOT NULL REFERENCES learning_contents(id) ON DELETE CASCADE,
  section_type VARCHAR(50) NOT NULL,
  section_number INTEGER NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, content_id, section_type, section_number)
);

CREATE INDEX IF NOT EXISTS idx_section_progress_user_id ON section_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_section_progress_content_id ON section_progress(content_id);

-- 3. learning_sessionsテーブル作成
CREATE TABLE IF NOT EXISTS learning_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id INTEGER NOT NULL REFERENCES learning_contents(id) ON DELETE CASCADE,
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  duration_minutes INTEGER DEFAULT 0,
  activities_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, content_id, session_date)
);

CREATE INDEX IF NOT EXISTS idx_learning_sessions_user_id ON learning_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_date ON learning_sessions(session_date);

-- 4. RLS (Row Level Security) 設定
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;

-- user_progressのポリシー
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
CREATE POLICY "Users can update own progress" ON user_progress
  FOR ALL USING (auth.uid() = user_id);

-- section_progressのポリシー
DROP POLICY IF EXISTS "Users can view own section progress" ON section_progress;
CREATE POLICY "Users can view own section progress" ON section_progress
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own section progress" ON section_progress;
CREATE POLICY "Users can update own section progress" ON section_progress
  FOR ALL USING (auth.uid() = user_id);

-- learning_sessionsのポリシー
DROP POLICY IF EXISTS "Users can view own sessions" ON learning_sessions;
CREATE POLICY "Users can view own sessions" ON learning_sessions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own sessions" ON learning_sessions;
CREATE POLICY "Users can update own sessions" ON learning_sessions
  FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 使用方法:
-- 1. Supabaseダッシュボード → SQL Editor
-- 2. 上記SQLをコピー&ペーストして実行
-- ==========================================
`;

    // テーブルの存在確認
    try {
      await supabaseAdmin
        .from('user_progress')
        .select('id')
        .limit(1);
      results.push({ table: 'user_progress', exists: true });
    } catch {
      results.push({ table: 'user_progress', exists: false });
    }

    try {
      await supabaseAdmin
        .from('section_progress')
        .select('id')
        .limit(1);
      results.push({ table: 'section_progress', exists: true });
    } catch {
      results.push({ table: 'section_progress', exists: false });
    }

    try {
      await supabaseAdmin
        .from('learning_sessions')
        .select('id')
        .limit(1);
      results.push({ table: 'learning_sessions', exists: true });
    } catch {
      results.push({ table: 'learning_sessions', exists: false });
    }

    const allTablesExist = results.every(r => r.exists);

    return NextResponse.json({
      success: true,
      message: allTablesExist 
        ? 'All progress tracking tables already exist'
        : 'Execute the provided SQL in Supabase SQL Editor to create missing tables',
      tables_status: results,
      sql_to_execute: allTablesExist ? null : sql
    });

  } catch (error) {
    console.error('Setup progress tables error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to check/create progress tables',
      details: (error as Error).message
    }, { status: 500 });
  }
}