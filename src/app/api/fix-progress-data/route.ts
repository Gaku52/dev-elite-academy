import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️ Supabase configuration missing');
}

const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
}) : null;

export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase configuration missing' },
      { status: 500 }
    );
  }

  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    console.log('[FIX DATA] Starting data fix for user:', userId);

    // 1. 現在の不整合なレコードを確認
    const { data: inconsistentBefore, error: beforeError } = await supabase
      .from('user_learning_progress')
      .select('id, module_name, section_key, cycle_number, answer_count, is_completed')
      .eq('user_id', userId)
      .gt('answer_count', 0)
      .eq('is_completed', false);

    if (beforeError) {
      console.error('[FIX DATA] Error checking before:', beforeError);
      throw beforeError;
    }

    console.log('[FIX DATA] Inconsistent records before fix:', inconsistentBefore?.length || 0);

    // 2. answer_count > 0 かつ is_completed = false のレコードを修正
    const { data: fixedRecords, error: fixError } = await supabase
      .from('user_learning_progress')
      .update({
        is_completed: true,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .gt('answer_count', 0)
      .eq('is_completed', false)
      .select();

    if (fixError) {
      console.error('[FIX DATA] Error fixing data:', fixError);
      throw fixError;
    }

    console.log('[FIX DATA] Fixed records:', fixedRecords?.length || 0);

    // 3. 修正後の確認
    const { data: inconsistentAfter, error: afterError } = await supabase
      .from('user_learning_progress')
      .select('id')
      .eq('user_id', userId)
      .gt('answer_count', 0)
      .eq('is_completed', false);

    if (afterError) {
      console.error('[FIX DATA] Error checking after:', afterError);
      throw afterError;
    }

    console.log('[FIX DATA] Inconsistent records after fix:', inconsistentAfter?.length || 0);

    // 4. 各周回の統計を再計算
    const { data: allRecords } = await supabase
      .from('user_learning_progress')
      .select('cycle_number, is_completed')
      .eq('user_id', userId);

    const cycleStats: Record<number, { total: number; completed: number }> = {};
    (allRecords || []).forEach(record => {
      const cycle = record.cycle_number || 1;
      if (!cycleStats[cycle]) {
        cycleStats[cycle] = { total: 0, completed: 0 };
      }
      cycleStats[cycle].total++;
      if (record.is_completed) {
        cycleStats[cycle].completed++;
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Data fix completed',
      details: {
        inconsistentRecordsBefore: inconsistentBefore?.length || 0,
        fixedRecords: fixedRecords?.length || 0,
        inconsistentRecordsAfter: inconsistentAfter?.length || 0,
        cycleStats
      }
    });
  } catch (error) {
    console.error('[FIX DATA] Error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
