import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
}) : null;

export async function GET(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  // すべての周回のデータを取得（limitを大きくする）
  const { data: allData, error } = await supabase
    .from('user_learning_progress')
    .select('cycle_number, module_name, section_key, is_completed, is_correct, answer_count, correct_count')
    .eq('user_id', userId)
    .order('cycle_number', { ascending: true })
    .limit(5000); // 複数周回に対応

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 周回ごとに集計
  const cycleStats: Record<number, {
    total: number;
    completed: number;
    answers: number;
    correct: number;
    modules: Record<string, { total: number; completed: number }>;
  }> = {};

  for (const item of allData || []) {
    const cycle = item.cycle_number;
    if (!cycleStats[cycle]) {
      cycleStats[cycle] = {
        total: 0,
        completed: 0,
        answers: 0,
        correct: 0,
        modules: {}
      };
    }

    cycleStats[cycle].total++;
    if (item.is_completed) cycleStats[cycle].completed++;
    cycleStats[cycle].answers += item.answer_count;
    cycleStats[cycle].correct += item.correct_count;

    if (!cycleStats[cycle].modules[item.module_name]) {
      cycleStats[cycle].modules[item.module_name] = { total: 0, completed: 0 };
    }
    cycleStats[cycle].modules[item.module_name].total++;
    if (item.is_completed) cycleStats[cycle].modules[item.module_name].completed++;
  }

  return NextResponse.json({
    userId,
    totalRecords: allData?.length || 0,
    cycleStats,
    rawSample: allData?.slice(0, 10) || []
  });
}
