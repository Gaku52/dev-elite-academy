import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { moduleQuizCounts, getTotalQuestions } from '@/lib/moduleQuizCounts';

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

    const currentMaxCycle = maxCycleData?.[0]?.cycle_number || 1; // デフォルトは1周目
    const nextCycle = currentMaxCycle + 1;

    console.log('[RESET] Starting new cycle:', {
      userId,
      moduleName,
      currentMaxCycle,
      nextCycle
    });

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

    console.log('[RESET] Current progress records:', currentProgress?.length || 0);

    if (!currentProgress || currentProgress.length === 0) {
      console.log('[RESET] ERROR: No progress data found to reset');
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

    console.log('[RESET] Prepared new cycle data:', newCycleData.length, 'records');

    // 新しい周回データを挿入
    const { data: insertedData, error: insertError } = await supabase
      .from('user_learning_progress')
      .insert(newCycleData)
      .select();

    if (insertError) {
      console.log('[RESET] ERROR: Insert failed:', insertError);
      throw insertError;
    }

    console.log('[RESET] Successfully inserted:', insertedData?.length || 0, 'records for cycle', nextCycle);

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
      // まず現在の最大周回数を取得
      const { data: maxCycleData } = await supabase
        .from('user_learning_progress')
        .select('cycle_number')
        .eq('user_id', userId)
        .order('cycle_number', { ascending: false })
        .limit(1);

      const currentCycle = maxCycleData?.[0]?.cycle_number || 1;

      // 現在の周回のみの統計を取得
      const { data, error } = await supabase
        .from('user_learning_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('cycle_number', currentCycle);

      if (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      const progress = data || [];
      const totalQuestions = getTotalQuestions(); // 動的に総問題数を取得
      // answer_count > 0 のレコードを「完了」としてカウント（is_completedフラグに依存しない）
      const completedQuestions = progress.filter(p => (p.answer_count || 0) > 0).length;
      const correctAnswers = progress.reduce((sum, p) => sum + p.correct_count, 0);
      const totalAnswers = progress.reduce((sum, p) => sum + p.answer_count, 0);
      const correctRate = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

      // モジュール別統計（動的に構築、現在の周回のみ）
      const moduleStats: Record<string, { total: number; completed: number }> = {};
      Object.entries(moduleQuizCounts).forEach(([moduleName, total]) => {
        moduleStats[moduleName] = {
          total,
          // answer_count > 0 のレコードを「完了」としてカウント
          completed: progress.filter(p => p.module_name === moduleName && (p.answer_count || 0) > 0).length
        };
      });

      // 実際に存在する周回を取得
      const { data: allCycles, error: allCyclesError } = await supabase
        .from('user_learning_progress')
        .select('cycle_number')
        .eq('user_id', userId)
        .order('cycle_number', { ascending: true });

      console.log('[CYCLE DEBUG] All cycles query result:', {
        userId,
        allCycles,
        allCyclesError,
        count: allCycles?.length || 0
      });

      // ユニークな周回番号を取得（実際にデータが存在する周回のみ）
      const existingCycles = [...new Set((allCycles || []).map(c => c.cycle_number))].sort((a, b) => a - b);

      console.log('[CYCLE DEBUG] Existing cycles:', existingCycles);

      // 実際の最大周回番号（存在するデータの中で最大）
      const actualCurrentCycle = existingCycles.length > 0 ? existingCycles[existingCycles.length - 1] : currentCycle;

      // すべての周回を取得（制限なし）
      const cyclesToShow = existingCycles;

      console.log('[CYCLE DEBUG] Cycles to show:', cyclesToShow);

      const cycleHistory = [];
      for (const cycle of cyclesToShow) {
        const { data: cycleData, error: cycleDataError } = await supabase
          .from('user_learning_progress')
          .select('*')
          .eq('user_id', userId)
          .eq('cycle_number', cycle);

        console.log(`[CYCLE DEBUG] Cycle ${cycle} data:`, {
          cycleDataCount: cycleData?.length || 0,
          cycleDataError,
          sampleData: cycleData?.[0]
        });

        const cycleProgress = cycleData || [];
        // answer_count > 0 のレコードを「完了」としてカウント（is_completedフラグに依存しない）
        const cycleCompleted = cycleProgress.filter(p => (p.answer_count || 0) > 0).length;
        const cycleCorrect = cycleProgress.reduce((sum, p) => sum + p.correct_count, 0);
        const cycleTotal = cycleProgress.reduce((sum, p) => sum + p.answer_count, 0);
        const cycleRate = cycleTotal > 0 ? Math.round((cycleCorrect / cycleTotal) * 100) : 0;

        // 総問題数を使用（実際に存在するレコード数ではなく、全体の問題数）
        const cycleTotalQuestions = totalQuestions;

        const historyItem = {
          cycle_number: cycle,
          totalQuestions: cycleTotalQuestions,
          completedQuestions: cycleCompleted,
          correctRate: cycleRate,
          completionRate: cycleTotalQuestions > 0
            ? Math.round((cycleCompleted / cycleTotalQuestions) * 100)
            : 0
        };

        console.log(`[CYCLE DEBUG] Cycle ${cycle} history item:`, historyItem);

        cycleHistory.push(historyItem);
      }

      console.log('[CYCLE DEBUG] Final cycle history:', cycleHistory);

      // デバッグ: 2周目の生データを確認
      if (actualCurrentCycle >= 2) {
        const { data: cycle2Debug } = await supabase
          .from('user_learning_progress')
          .select('*')
          .eq('user_id', userId)
          .eq('cycle_number', 2)
          .limit(5);

        console.log('[CYCLE 2 DEBUG] Sample data:', cycle2Debug);
      }

      return NextResponse.json({
        stats: {
          totalQuestions,
          completedQuestions,
          correctRate,
          moduleStats,
          currentCycle: actualCurrentCycle,
          cycleHistory
        }
      });
    }

    if (action === 'cycles') {
      // 周回別統計を取得（テーブルが存在しない場合のフォールバック付き）
      let cycleStats = [];
      let cycleError: { message: string } | null = null;

      try {
        const { data, error } = await supabase
          .from('cycle_statistics')
          .select('*')
          .eq('user_id', userId)
          .order('cycle_number', { ascending: true });

        cycleStats = data || [];
        cycleError = error;
      } catch (error: unknown) {
        // cycle_statisticsテーブル/ビューが存在しない場合
        const errorMessage = error instanceof Error ? error.message : '';
        const errorCode = (error as { code?: string })?.code;
        if (errorMessage.includes('cycle_statistics') || errorCode === 'PGRST106') {
          console.warn('cycle_statistics view not found. Migration 005_fix_cycle_support.sql needs to be executed.');
          cycleStats = [];
          cycleError = null;
        } else {
          cycleError = error as { message: string };
        }
      }

      if (cycleError) {
        console.error('Cycle stats error:', cycleError);
        return NextResponse.json({
          error: cycleError.message,
          migrationRequired: true,
          migrationFile: '005_fix_cycle_support.sql'
        }, { status: 500 });
      }

      // 現在の最大周回数を取得（cycle_numberカラムが存在しない場合のフォールバック付き）
      let currentCycle = 1;
      let maxCycleError: { message: string } | null = null;

      try {
        const { data: maxCycleData, error } = await supabase
          .from('user_learning_progress')
          .select('cycle_number')
          .eq('user_id', userId)
          .order('cycle_number', { ascending: false })
          .limit(1);

        if (error) {
          maxCycleError = error as { message: string };
        } else {
          currentCycle = maxCycleData?.[0]?.cycle_number || 1;
        }
      } catch (error: unknown) {
        // cycle_numberカラムが存在しない場合
        const errorMessage = error instanceof Error ? error.message : '';
        const errorCode = (error as { code?: string })?.code;
        if (errorMessage.includes('cycle_number') || errorCode === 'PGRST103') {
          console.warn('cycle_number column not found. Migration 005_fix_cycle_support.sql needs to be executed.');
          currentCycle = 1;
          maxCycleError = null;
        } else {
          maxCycleError = error as { message: string };
        }
      }

      if (maxCycleError) {
        console.error('Max cycle error:', maxCycleError);
        return NextResponse.json({
          error: maxCycleError.message,
          migrationRequired: true,
          migrationFile: '005_fix_cycle_support.sql'
        }, { status: 500 });
      }

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