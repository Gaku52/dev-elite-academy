import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration');
}

const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
}) : null;

export async function POST() {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase configuration missing' },
      { status: 500 }
    );
  }

  try {
    // 日次使用量統計テーブルの作成
    const { error: createTableError } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS daily_usage_stats (
          id SERIAL PRIMARY KEY,
          date DATE NOT NULL UNIQUE,
          database_size_mb DECIMAL(10,3) NOT NULL,
          total_records INTEGER NOT NULL,
          estimated_monthly_requests INTEGER NOT NULL,
          estimated_monthly_bandwidth_gb DECIMAL(8,3) NOT NULL,
          table_counts JSONB NOT NULL,
          table_sizes JSONB NOT NULL,
          growth_rate_mb_per_day DECIMAL(10,4),
          growth_rate_records_per_day INTEGER,
          prediction_days_to_limit INTEGER,
          prediction_limit_reach_date DATE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- インデックスの作成
        CREATE INDEX IF NOT EXISTS idx_daily_usage_stats_date ON daily_usage_stats(date DESC);
        CREATE INDEX IF NOT EXISTS idx_daily_usage_stats_prediction ON daily_usage_stats(prediction_limit_reach_date);

        -- 更新日時の自動更新トリガー
        CREATE OR REPLACE FUNCTION update_daily_usage_stats_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        DROP TRIGGER IF EXISTS trigger_update_daily_usage_stats_updated_at ON daily_usage_stats;
        CREATE TRIGGER trigger_update_daily_usage_stats_updated_at
          BEFORE UPDATE ON daily_usage_stats
          FOR EACH ROW
          EXECUTE FUNCTION update_daily_usage_stats_updated_at();
      `
    });

    if (createTableError) {
      console.error('Create table error:', createTableError);
      return NextResponse.json({ error: createTableError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Daily usage tracking table created successfully',
      tables_created: ['daily_usage_stats'],
      features: [
        'Daily usage statistics storage',
        'Growth rate calculation',
        'Prediction data storage',
        'Automatic timestamp updates'
      ]
    });

  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase configuration missing' },
      { status: 500 }
    );
  }

  try {
    // テーブルの存在確認と現在のデータ確認
    const { data, error } = await supabase
      .from('daily_usage_stats')
      .select('*')
      .order('date', { ascending: false })
      .limit(7);

    if (error && error.code !== 'PGRST116') { // PGRST116 = table not found
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      table_exists: !error,
      recent_data: data || [],
      data_count: data?.length || 0,
      status: error ? 'Table not found - run POST to create' : 'Table exists and accessible'
    });

  } catch (error) {
    console.error('Check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}