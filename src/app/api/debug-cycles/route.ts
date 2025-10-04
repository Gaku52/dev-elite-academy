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

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // 1. テーブル構造を確認
    const { data: columns, error: columnsError } = await supabase
      .from('user_learning_progress')
      .select('*')
      .limit(1);

    // 2. すべてのデータを取得（cycle_numberでグループ化）
    const { data: allData, error: allDataError } = await supabase
      .from('user_learning_progress')
      .select('*')
      .eq('user_id', userId)
      .order('cycle_number', { ascending: true })
      .order('created_at', { ascending: true });

    // 3. cycle_numberでグループ化
    interface ProgressItem {
      cycle_number?: number;
      is_completed?: boolean;
      is_correct?: boolean;
      answer_count?: number;
      correct_count?: number;
      module_name?: string;
      created_at: string;
      updated_at: string;
      [key: string]: unknown;
    }

    const cycleGroups: Record<number, ProgressItem[]> = {};
    (allData || []).forEach((item: ProgressItem) => {
      const cycle = item.cycle_number || 1;
      if (!cycleGroups[cycle]) {
        cycleGroups[cycle] = [];
      }
      cycleGroups[cycle].push(item);
    });

    // 4. 各周回の統計
    const cycleStats = Object.entries(cycleGroups).map(([cycle, items]) => ({
      cycle_number: parseInt(cycle),
      total_records: items.length,
      completed: items.filter(i => i.is_completed).length,
      correct: items.filter(i => i.is_correct).length,
      total_answer_count: items.reduce((sum, i) => sum + (i.answer_count || 0), 0),
      total_correct_count: items.reduce((sum, i) => sum + (i.correct_count || 0), 0),
      modules: [...new Set(items.map(i => i.module_name))],
      earliest_created: items.reduce((min: string | null, i) =>
        !min || new Date(i.created_at) < new Date(min) ? i.created_at : min, null as string | null),
      latest_updated: items.reduce((max: string | null, i) =>
        !max || new Date(i.updated_at) > new Date(max) ? i.updated_at : max, null as string | null)
    }));

    // 5. cycle_statisticsビューからデータ取得を試みる
    let viewData = null;
    let viewError = null;
    try {
      const { data, error } = await supabase
        .from('cycle_statistics')
        .select('*')
        .eq('user_id', userId);
      viewData = data;
      viewError = error;
    } catch (e) {
      viewError = e;
    }

    return NextResponse.json({
      debug: {
        userId,
        tableStructure: {
          sampleColumns: columns?.[0] ? Object.keys(columns[0]) : [],
          columnsError
        },
        rawData: {
          totalRecords: allData?.length || 0,
          allDataError,
          sampleRecord: allData?.[0]
        },
        cycleGroups: {
          cycles: Object.keys(cycleGroups).map(Number).sort((a, b) => a - b),
          stats: cycleStats
        },
        cycleStatisticsView: {
          available: !viewError,
          data: viewData,
          error: viewError ? String(viewError) : null
        }
      }
    });
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
