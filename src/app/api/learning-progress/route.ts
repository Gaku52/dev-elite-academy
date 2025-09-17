import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️ Supabase configuration missing, API will not function properly');
}

const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
}) : null;

// 進捗取得 GET /api/learning-progress?userId=xxx&moduleName=xxx
export async function GET(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase configuration missing' },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const moduleName = searchParams.get('moduleName');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    let query = supabase
      .from('user_learning_progress')
      .select('*')
      .eq('user_id', userId);

    if (moduleName) {
      query = query.eq('module_name', moduleName);
    }

    const { data, error } = await query.order('created_at', { ascending: true });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ progress: data || [] });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 進捗保存/更新 POST /api/learning-progress
export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase configuration missing' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { userId, moduleName, sectionKey, isCompleted, isCorrect } = body;

    if (!userId || !moduleName || !sectionKey) {
      return NextResponse.json(
        { error: 'userId, moduleName, and sectionKey are required' },
        { status: 400 }
      );
    }

    // 既存の進捗を確認
    const { data: existing } = await supabase
      .from('user_learning_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('module_name', moduleName)
      .eq('section_key', sectionKey)
      .single();

    let result;

    if (existing) {
      // 既存レコードを更新
      const newAnswerCount = existing.answer_count + 1;
      const newCorrectCount = existing.correct_count + (isCorrect ? 1 : 0);

      const { data, error } = await supabase
        .from('user_learning_progress')
        .update({
          is_completed: isCompleted,
          is_correct: isCorrect,
          answer_count: newAnswerCount,
          correct_count: newCorrectCount,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('module_name', moduleName)
        .eq('section_key', sectionKey)
        .select()
        .single();

      if (error) {
        console.error('Update error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      result = data;
    } else {
      // 新規レコードを作成
      const { data, error } = await supabase
        .from('user_learning_progress')
        .insert({
          user_id: userId,
          module_name: moduleName,
          section_key: sectionKey,
          is_completed: isCompleted,
          is_correct: isCorrect,
          answer_count: 1,
          correct_count: isCorrect ? 1 : 0
        })
        .select()
        .single();

      if (error) {
        console.error('Insert error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      result = data;
    }

    return NextResponse.json({ progress: result });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}