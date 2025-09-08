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

// 既存のlearning_contentsテーブルの構造を確認してから適切な型で作成
export async function POST() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    // まず既存のlearning_contentsテーブルの構造を確認
    const { data: tableInfo, error: infoError } = await supabaseAdmin
      .from('learning_contents')
      .select('id')
      .limit(1);

    if (infoError) {
      return NextResponse.json({ 
        error: 'learning_contentsテーブルが見つかりません', 
        details: infoError 
      }, { status: 400 });
    }

    // learning_contentsのIDの型を確認（numberならINTEGER）
    const idType = typeof tableInfo?.[0]?.id === 'number' ? 'INTEGER' : 'UUID';
    
    const results = {
      created: [] as string[],
      existing: [] as string[],
      errors: [] as Array<{ table: string; error: string }>
    };

    // テーブル作成SQL（既存の型に合わせて動的に生成）
    const tables = [
      {
        name: 'user_progress',
        sql: `
          CREATE TABLE IF NOT EXISTS user_progress (
            id SERIAL PRIMARY KEY,
            user_email TEXT NOT NULL,
            content_id ${idType} REFERENCES learning_contents(id) ON DELETE CASCADE,
            status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
            progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
            started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            completed_at TIMESTAMP WITH TIME ZONE,
            last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_email, content_id)
          )
        `
      },
      {
        name: 'section_progress',
        sql: `
          CREATE TABLE IF NOT EXISTS section_progress (
            id SERIAL PRIMARY KEY,
            user_email TEXT NOT NULL,
            content_id ${idType} REFERENCES learning_contents(id) ON DELETE CASCADE,
            section_type TEXT CHECK (section_type IN ('video', 'reading', 'code', 'quiz')),
            section_number INTEGER NOT NULL,
            is_completed BOOLEAN DEFAULT FALSE,
            completed_at TIMESTAMP WITH TIME ZONE,
            duration_minutes INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_email, content_id, section_type, section_number)
          )
        `
      },
      {
        name: 'learning_notes',
        sql: `
          CREATE TABLE IF NOT EXISTS learning_notes (
            id SERIAL PRIMARY KEY,
            user_email TEXT NOT NULL,
            content_id ${idType} REFERENCES learning_contents(id) ON DELETE CASCADE,
            note_text TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          )
        `
      },
      {
        name: 'quiz_results',
        sql: `
          CREATE TABLE IF NOT EXISTS quiz_results (
            id SERIAL PRIMARY KEY,
            user_email TEXT NOT NULL,
            content_id ${idType} REFERENCES learning_contents(id) ON DELETE CASCADE,
            score INTEGER NOT NULL,
            total_questions INTEGER NOT NULL,
            percentage DECIMAL(5,2) GENERATED ALWAYS AS ((score::DECIMAL / NULLIF(total_questions, 0)) * 100) STORED,
            attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          )
        `
      },
      {
        name: 'learning_sessions',
        sql: `
          CREATE TABLE IF NOT EXISTS learning_sessions (
            id SERIAL PRIMARY KEY,
            user_email TEXT NOT NULL,
            content_id ${idType} REFERENCES learning_contents(id) ON DELETE CASCADE,
            session_date DATE DEFAULT CURRENT_DATE,
            duration_minutes INTEGER DEFAULT 0,
            activities_completed INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          )
        `
      }
    ];

    // 各テーブルを作成
    for (const table of tables) {
      try {
        // テーブルが既に存在するか確認（relation does not existエラーなら存在しない）
        const { error: checkError } = await supabaseAdmin
          .from(table.name)
          .select('*', { count: 'exact', head: true });

        if (!checkError) {
          results.existing.push(table.name);
          continue;
        }

        // テーブルが存在しない場合のエラーメッセージを確認
        if (checkError.message && !checkError.message.includes('relation') && !checkError.message.includes('does not exist')) {
          results.errors.push({ table: table.name, error: checkError.message });
          continue;
        }

        // テーブルを作成
        const { error: createError } = await supabaseAdmin.rpc('exec_sql', {
          sql: table.sql
        }).single();

        if (createError) {
          // RPCが存在しない場合は直接SQLを実行（Supabase特有の方法）
          // 注: これは動作しない可能性があるため、実際にはSupabase管理画面で実行する必要があります
          throw new Error(`テーブル作成にはSupabase SQL Editorを使用してください`);
        }

        results.created.push(table.name);
      } catch (error) {
        results.errors.push({ table: table.name, error: (error as Error).message });
      }
    }

    // インデックス作成（将来の実装用）
    // const indexes = [
    //   'CREATE INDEX IF NOT EXISTS idx_user_progress_email ON user_progress(user_email)',
    //   'CREATE INDEX IF NOT EXISTS idx_user_progress_content ON user_progress(content_id)',
    //   'CREATE INDEX IF NOT EXISTS idx_user_progress_status ON user_progress(status)',
    //   'CREATE INDEX IF NOT EXISTS idx_section_progress_email ON section_progress(user_email)',
    //   'CREATE INDEX IF NOT EXISTS idx_learning_sessions_date ON learning_sessions(session_date)'
    // ];

    // RLS設定（将来の実装用）
    // const rlsCommands = tables.map(t => ({
    //   enable: `ALTER TABLE ${t.name} ENABLE ROW LEVEL SECURITY`,
    //   policy: `CREATE POLICY IF NOT EXISTS "Allow all access to ${t.name}" ON ${t.name} FOR ALL USING (true)`
    // }));

    // トリガー作成（将来の実装用）
    // const triggerSQL = `
    //   CREATE OR REPLACE FUNCTION update_updated_at_column()
    //   RETURNS TRIGGER AS $$
    //   BEGIN
    //       NEW.updated_at = NOW();
    //       RETURN NEW;
    //   END;
    //   $$ language 'plpgsql';
    // `;

    return NextResponse.json({
      message: 'テーブル作成処理を実行しました',
      idType: `learning_contentsのID型: ${idType}`,
      results,
      note: results.errors.length > 0 
        ? 'エラーが発生しました。Supabase SQL Editorで直接SQLを実行してください。'
        : 'テーブル作成が完了しました。',
      sqlForManualExecution: results.errors.length > 0 ? tables.map(t => t.sql).join('\n\n') : null
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'テーブル作成中にエラーが発生しました',
      details: (error as Error).message 
    }, { status: 500 });
  }
}