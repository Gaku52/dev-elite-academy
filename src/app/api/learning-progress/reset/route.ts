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

// 安全な進捗リセット（周回システム対応） POST /api/learning-progress/reset
export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase configuration missing' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { userId, moduleName, resetType = 'safe' } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    if (resetType === 'safe') {
      // 安全なリセット：新しい周回を開始
      return await startNewCycle(userId, moduleName);
    } else if (resetType === 'complete') {
      // 完全リセット（古い機能、非推奨）
      return await completeReset(userId, moduleName);
    }

    return NextResponse.json({ error: 'Invalid reset type' }, { status: 400 });
  } catch (error) {
    console.error('Reset API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 新しい周回を開始する関数
async function startNewCycle(userId: string, moduleName?: string) {
  if (!supabase) {
    throw new Error('Supabase configuration missing');
  }

  try {
    // 現在の最大周回数を取得
    let maxCycleQuery = supabase
      .from('user_learning_progress')
      .select('cycle_number')
      .eq('user_id', userId)
      .order('cycle_number', { ascending: false })
      .limit(1);

    if (moduleName) {
      maxCycleQuery = maxCycleQuery.eq('module_name', moduleName);
    }

    const { data: maxCycleData, error: maxCycleError } = await maxCycleQuery;

    if (maxCycleError) {
      throw maxCycleError;
    }

    const currentMaxCycle = maxCycleData?.[0]?.cycle_number || 0;
    const nextCycle = currentMaxCycle + 1;

    // 現在の周回の進捗データを取得
    let currentProgressQuery = supabase
      .from('user_learning_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('cycle_number', currentMaxCycle);

    if (moduleName) {
      currentProgressQuery = currentProgressQuery.eq('module_name', moduleName);
    }

    const { data: currentProgress, error: currentProgressError } = await currentProgressQuery;

    if (currentProgressError) {
      throw currentProgressError;
    }

    if (!currentProgress || currentProgress.length === 0) {
      return NextResponse.json({ error: 'No progress data found to reset' }, { status: 404 });
    }

    // 新しい周回用のデータを準備
    const newCycleData = currentProgress.map(item => ({
      user_id: item.user_id,
      module_name: item.module_name,
      section_key: item.section_key,
      cycle_number: nextCycle,
      is_completed: false,
      is_correct: false,
      answer_count: 0,
      correct_count: 0
    }));

    // 新しい周回データを挿入
    const { data: insertedData, error: insertError } = await supabase
      .from('user_learning_progress')
      .insert(newCycleData)
      .select();

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({
      success: true,
      message: moduleName
        ? `Module "${moduleName}" reset to cycle ${nextCycle}`
        : `All progress reset to cycle ${nextCycle}`,
      previousCycle: currentMaxCycle,
      newCycle: nextCycle,
      resetSections: insertedData?.length || 0,
      preservedData: {
        dailyProgress: true,
        streaks: true,
        previousCycles: true,
        statistics: true
      }
    });
  } catch (error) {
    console.error('Start new cycle error:', error);
    throw error;
  }
}

// 完全リセット（非推奨、後方互換性のため保持）
async function completeReset(userId: string, moduleName?: string) {
  if (!supabase) {
    throw new Error('Supabase configuration missing');
  }

  let query = supabase
    .from('user_learning_progress')
    .delete()
    .eq('user_id', userId);

  if (moduleName) {
    query = query.eq('module_name', moduleName);
  }

  const { error } = await query;

  if (error) {
    throw error;
  }

  return NextResponse.json({
    success: true,
    message: moduleName
      ? `Progress for module "${moduleName}" has been completely reset`
      : 'All progress has been completely reset',
    warning: 'This was a complete reset - all historical data has been lost'
  });
}

// リセット前情報取得とサイクル統計 GET /api/learning-progress/reset
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
      const totalQuestions = 105 + 89 + 80 + 100 + 100 + 120 + 100 + 96; // 790問
      const completedQuestions = progress.filter(p => p.is_completed).length;
      const correctAnswers = progress.reduce((sum, p) => sum + p.correct_count, 0);
      const totalAnswers = progress.reduce((sum, p) => sum + p.answer_count, 0);
      const correctRate = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

      // モジュール別統計
      const moduleStats = {
        'computer-systems': { total: 105, completed: progress.filter(p => p.module_name === 'computer-systems' && p.is_completed).length },
        'algorithms-programming': { total: 89, completed: progress.filter(p => p.module_name === 'algorithms-programming' && p.is_completed).length },
        'database': { total: 80, completed: progress.filter(p => p.module_name === 'database' && p.is_completed).length },
        'network': { total: 100, completed: progress.filter(p => p.module_name === 'network' && p.is_completed).length },
        'security': { total: 100, completed: progress.filter(p => p.module_name === 'security' && p.is_completed).length },
        'system-development': { total: 120, completed: progress.filter(p => p.module_name === 'system-development' && p.is_completed).length },
        'management-legal': { total: 100, completed: progress.filter(p => p.module_name === 'management-legal' && p.is_completed).length },
        'strategy': { total: 96, completed: progress.filter(p => p.module_name === 'strategy' && p.is_completed).length }
      };

      return NextResponse.json({
        stats: { totalQuestions, completedQuestions, correctRate, moduleStats }
      });
    }

    if (action === 'cycles') {
      // 周回別統計を取得
      const { data: cycleStats, error: cycleError } = await supabase
        .from('cycle_statistics')
        .select('*')
        .eq('user_id', userId)
        .order('cycle_number', { ascending: true });

      if (cycleError) {
        console.error('Cycle stats error:', cycleError);
        return NextResponse.json({ error: cycleError.message }, { status: 500 });
      }

      // 現在の最大周回数を取得
      const { data: maxCycleData, error: maxCycleError } = await supabase
        .from('user_learning_progress')
        .select('cycle_number')
        .eq('user_id', userId)
        .order('cycle_number', { ascending: false })
        .limit(1);

      if (maxCycleError) {
        console.error('Max cycle error:', maxCycleError);
        return NextResponse.json({ error: maxCycleError.message }, { status: 500 });
      }

      const currentCycle = maxCycleData?.[0]?.cycle_number || 1;
      const nextCycle = currentCycle + 1;

      return NextResponse.json({
        cycleStats: cycleStats || [],
        currentCycle,
        nextCycle,
        resetPreview: {
          preservedData: [
            '過去の周回記録（第1〜' + currentCycle + '周目）',
            '日次学習推移グラフ',
            '学習ストリーク記録',
            '総回答数・正解数の統計'
          ],
          resetData: [
            '現在の完了状況',
            '第' + nextCycle + '周目として再スタート'
          ],
          benefits: [
            '周回別の成績比較が可能',
            '学習の成長過程が可視化',
            '復習効果の測定が可能'
          ]
        }
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}