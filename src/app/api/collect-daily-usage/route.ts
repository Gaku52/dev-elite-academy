import { NextRequest, NextResponse } from 'next/server';
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

// 使用量データを収集する関数（usageページのロジックを再利用）
async function collectCurrentUsageStats() {
  if (!supabase) throw new Error('Supabase not configured');

  // 基本テーブルの情報取得
  const [categoriesResult, contentsResult] = await Promise.all([
    supabase.from('categories').select('*', { count: 'exact' }),
    supabase.from('learning_contents').select('*', { count: 'exact' })
  ]);

  // 進捗追跡テーブルの情報取得
  let userProgressCount = 0;
  let sectionProgressCount = 0;
  let learningSessionsCount = 0;
  let userLearningProgressCount = 0;
  let dailyProgressCount = 0;
  let dailyLearningProgressCount = 0;
  let learningStreaksCount = 0;
  let profilesCount = 0;

  try {
    const [userProgressResult, sectionProgressResult, learningSessionsResult] = await Promise.all([
      supabase.from('user_progress').select('*', { count: 'exact' }),
      supabase.from('section_progress').select('*', { count: 'exact' }),
      supabase.from('learning_sessions').select('*', { count: 'exact' })
    ]);

    userProgressCount = userProgressResult.count || 0;
    sectionProgressCount = sectionProgressResult.count || 0;
    learningSessionsCount = learningSessionsResult.count || 0;
  } catch (error) {
    console.log('Original progress tables not found:', error);
  }

  try {
    const [userLearningResult, dailyProgressResult] = await Promise.all([
      supabase.from('user_learning_progress').select('*', { count: 'exact' }),
      supabase.from('daily_progress').select('*', { count: 'exact' })
    ]);

    userLearningProgressCount = userLearningResult.count || 0;
    dailyProgressCount = dailyProgressResult.count || 0;
  } catch (error) {
    console.log('New learning progress tables not found:', error);
  }

  try {
    const [dailyLearningResult, streaksResult] = await Promise.all([
      supabase.from('daily_learning_progress').select('*', { count: 'exact' }),
      supabase.from('learning_streaks').select('*', { count: 'exact' })
    ]);

    dailyLearningProgressCount = dailyLearningResult.count || 0;
    learningStreaksCount = streaksResult.count || 0;
  } catch (error) {
    console.log('Analytics tables not found:', error);
  }

  try {
    const profilesResult = await supabase.from('profiles').select('*', { count: 'exact' });
    profilesCount = profilesResult.count || 0;
  } catch (error) {
    console.log('Profiles table not found:', error);
  }

  // 総レコード数の計算
  const totalRecords =
    (categoriesResult.count || 0) +
    (contentsResult.count || 0) +
    userProgressCount +
    sectionProgressCount +
    learningSessionsCount +
    userLearningProgressCount +
    dailyProgressCount +
    dailyLearningProgressCount +
    learningStreaksCount +
    profilesCount;

  // テーブル別カウント
  const tableCounts = {
    categories: categoriesResult.count || 0,
    learning_contents: contentsResult.count || 0,
    user_progress: userProgressCount,
    section_progress: sectionProgressCount,
    learning_sessions: learningSessionsCount,
    user_learning_progress: userLearningProgressCount,
    daily_progress: dailyProgressCount,
    daily_learning_progress: dailyLearningProgressCount,
    learning_streaks: learningStreaksCount,
    profiles: profilesCount
  };

  // テーブル別サイズ推定
  const tableSizes = {
    categories: (categoriesResult.count || 0) * 0.5,
    learning_contents: (contentsResult.count || 0) * 2.0,
    user_progress: userProgressCount * 0.3,
    section_progress: sectionProgressCount * 0.2,
    learning_sessions: learningSessionsCount * 0.2,
    user_learning_progress: userLearningProgressCount * 0.4,
    daily_progress: dailyProgressCount * 0.3,
    daily_learning_progress: dailyLearningProgressCount * 0.35,
    learning_streaks: learningStreaksCount * 0.25,
    profiles: profilesCount * 0.6
  };

  const estimatedDbSizeMB = Math.max(
    0.1,
    Object.values(tableSizes).reduce((sum, size) => sum + size, 0) / 1024
  );

  // 月間推定活動量
  const activeTablesCount = 11;
  const averageRequestsPerTable = totalRecords > 0 ? Math.ceil(totalRecords / activeTablesCount) * 50 : 100;
  const estimatedMonthlyRequests = Math.min(50000, Math.max(100, averageRequestsPerTable));
  const estimatedMonthlyBandwidthGB = Math.min(5, Math.max(0.01, estimatedDbSizeMB * 0.15));

  return {
    database_size_mb: estimatedDbSizeMB,
    total_records: totalRecords,
    estimated_monthly_requests: estimatedMonthlyRequests,
    estimated_monthly_bandwidth_gb: estimatedMonthlyBandwidthGB,
    table_counts: tableCounts,
    table_sizes: tableSizes
  };
}

// 成長率と予測を計算する関数
async function calculateGrowthAndPrediction(currentStats: {
  database_size_mb: number;
  total_records: number;
  estimated_monthly_requests: number;
  estimated_monthly_bandwidth_gb: number;
  table_counts: Record<string, number>;
  table_sizes: Record<string, number>;
}) {
  if (!supabase) return null;

  try {
    // 過去7日間のデータを取得
    const { data: recentData, error } = await supabase
      .from('daily_usage_stats')
      .select('*')
      .order('date', { ascending: false })
      .limit(7);

    if (error || !recentData || recentData.length < 2) {
      return null; // データが不足している場合は予測なし
    }

    // 成長率の計算（線形回帰を簡略化）
    const sortedData = recentData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const daysCount = sortedData.length;

    const sizeGrowth = (currentStats.database_size_mb - sortedData[0].database_size_mb) / (daysCount - 1);
    const recordsGrowth = Math.round((currentStats.total_records - sortedData[0].total_records) / (daysCount - 1));

    // 制限到達予測
    const freeLimit = 500; // 500MB
    const remainingCapacity = freeLimit - currentStats.database_size_mb;
    const daysToLimit = sizeGrowth > 0 ? Math.ceil(remainingCapacity / sizeGrowth) : null;

    let limitReachDate = null;
    if (daysToLimit && daysToLimit > 0) {
      const today = new Date();
      limitReachDate = new Date(today.getTime() + (daysToLimit * 24 * 60 * 60 * 1000));
    }

    return {
      growth_rate_mb_per_day: sizeGrowth,
      growth_rate_records_per_day: recordsGrowth,
      prediction_days_to_limit: daysToLimit,
      prediction_limit_reach_date: limitReachDate?.toISOString().split('T')[0] || null
    };

  } catch (error) {
    console.error('Growth calculation error:', error);
    return null;
  }
}

export async function POST() {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase configuration missing' },
      { status: 500 }
    );
  }

  try {
    const today = new Date().toISOString().split('T')[0];

    // 今日のデータが既に存在するかチェック
    const { data: existingData, error: checkError } = await supabase
      .from('daily_usage_stats')
      .select('*')
      .eq('date', today)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Check existing data error:', checkError);
    }

    // 現在の使用量データを収集
    const currentStats = await collectCurrentUsageStats();

    // 成長率と予測を計算
    const predictions = await calculateGrowthAndPrediction(currentStats);

    const statsData = {
      date: today,
      database_size_mb: currentStats.database_size_mb,
      total_records: currentStats.total_records,
      estimated_monthly_requests: currentStats.estimated_monthly_requests,
      estimated_monthly_bandwidth_gb: currentStats.estimated_monthly_bandwidth_gb,
      table_counts: currentStats.table_counts,
      table_sizes: currentStats.table_sizes,
      ...predictions
    };

    let result;
    if (existingData) {
      // 既存データを更新
      const { data, error } = await supabase
        .from('daily_usage_stats')
        .update(statsData)
        .eq('date', today)
        .select()
        .single();

      if (error) throw error;
      result = { action: 'updated', data };
    } else {
      // 新規データを挿入
      const { data, error } = await supabase
        .from('daily_usage_stats')
        .insert(statsData)
        .select()
        .single();

      if (error) throw error;
      result = { action: 'inserted', data };
    }

    return NextResponse.json({
      success: true,
      ...result,
      stats_summary: {
        database_size_mb: currentStats.database_size_mb,
        total_records: currentStats.total_records,
        growth_rate_mb_per_day: predictions?.growth_rate_mb_per_day || null,
        days_to_limit: predictions?.prediction_days_to_limit || null,
        limit_reach_date: predictions?.prediction_limit_reach_date || null
      }
    });

  } catch (error) {
    console.error('Daily usage collection error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase configuration missing' },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    // 指定日数分のデータを取得
    const { data, error } = await supabase
      .from('daily_usage_stats')
      .select('*')
      .order('date', { ascending: false })
      .limit(days);

    if (error) {
      throw error;
    }

    // 最新の予測データを取得
    const latestData = data?.[0];
    const freeLimit = 500; // 500MB

    return NextResponse.json({
      daily_stats: data || [],
      latest_prediction: latestData ? {
        current_size_mb: latestData.database_size_mb,
        growth_rate_mb_per_day: latestData.growth_rate_mb_per_day,
        days_to_limit: latestData.prediction_days_to_limit,
        limit_reach_date: latestData.prediction_limit_reach_date,
        usage_percentage: ((latestData.database_size_mb / freeLimit) * 100).toFixed(1)
      } : null,
      data_available: data?.length || 0
    });

  } catch (error) {
    console.error('Get daily usage error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}