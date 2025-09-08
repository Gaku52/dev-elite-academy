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

    // ID型を判定（numberならINTEGER、そうでなければUUID）
    const refType = typeof tableInfo?.[0]?.id === 'number' ? 'INTEGER' : 'UUID';

    // 必要最小限のSQL文を生成（テーブル作成のみ）
    const sql = `
-- ==========================================
-- 学習進捗管理システム テーブル作成SQL (シンプル版)
-- 既存のlearning_contentsテーブルのID型: ${refType}
-- ==========================================

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

-- ==========================================
-- テーブル作成完了メッセージ
-- ==========================================
-- 以下のクエリで作成されたテーブルを確認できます：
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('user_progress', 'section_progress', 'learning_notes', 'quiz_results', 'learning_sessions');

-- 注意: インデックス、RLS、トリガーは後で別途実行してください
-- より高度な機能が必要な場合は、/api/generate-sql を使用してください
`;

    return new NextResponse(sql, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': 'attachment; filename="create_progress_tables_simple.sql"'
      }
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'SQL生成中にエラーが発生しました',
      details: (error as Error).message 
    }, { status: 500 });
  }
}