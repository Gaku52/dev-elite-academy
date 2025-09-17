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

// 進捗リセット DELETE /api/learning-progress/reset
export async function DELETE(request: NextRequest) {
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
      .delete()
      .eq('user_id', userId);

    if (moduleName) {
      // 特定のモジュールのみリセット
      query = query.eq('module_name', moduleName);
    }

    const { error } = await query;

    if (error) {
      console.error('Delete error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: moduleName
        ? `Progress for module "${moduleName}" has been reset`
        : 'All progress has been reset'
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 統計情報取得 GET /api/learning-progress/reset?userId=xxx&action=stats
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
    const action = searchParams.get('action');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    if (action === 'stats') {
      // 全体統計を取得
      const { data, error } = await supabase
        .from('user_learning_progress')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      const progress = data || [];
      const totalQuestions = progress.length;
      const completedQuestions = progress.filter(p => p.is_completed).length;
      const correctAnswers = progress.reduce((sum, p) => sum + p.correct_count, 0);
      const totalAnswers = progress.reduce((sum, p) => sum + p.answer_count, 0);
      const correctRate = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

      // モジュール別統計
      const moduleStats = {
        'computer-systems': {
          total: progress.filter(p => p.module_name === 'computer-systems').length,
          completed: progress.filter(p => p.module_name === 'computer-systems' && p.is_completed).length
        },
        'algorithms-programming': {
          total: progress.filter(p => p.module_name === 'algorithms-programming').length,
          completed: progress.filter(p => p.module_name === 'algorithms-programming' && p.is_completed).length
        },
        'database': {
          total: progress.filter(p => p.module_name === 'database').length,
          completed: progress.filter(p => p.module_name === 'database' && p.is_completed).length
        }
      };

      return NextResponse.json({
        stats: {
          totalQuestions,
          completedQuestions,
          correctRate,
          moduleStats
        }
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}