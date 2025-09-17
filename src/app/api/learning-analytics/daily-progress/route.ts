import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { handleAPIError, successResponse, APIError } from '@/lib/api-error-handler';
import { format, subDays } from 'date-fns';

// GET: 日次進捗データの取得
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const days = parseInt(searchParams.get('days') || '30'); // デフォルト30日間

    if (!userId) {
      throw new APIError(400, 'userId is required', 'MISSING_USER_ID');
    }

    const startDate = subDays(new Date(), days - 1);
    const endDate = new Date();

    // 日次進捗データの取得
    const { data: dailyProgress, error } = await supabase
      .from('daily_learning_progress')
      .select('*')
      .eq('user_id', userId)
      .gte('date', format(startDate, 'yyyy-MM-dd'))
      .lte('date', format(endDate, 'yyyy-MM-dd'))
      .order('date', { ascending: true });

    if (error) throw error;

    // データを日付ごとに集計
    const progressByDate: Record<string, {
      date: string;
      totalQuestions: number;
      correctQuestions: number;
      timeSpent: number;
      sectionsCompleted: number;
      modules: string[];
    }> = {};
    const dates = [];

    for (let i = 0; i < days; i++) {
      const date = format(subDays(endDate, days - 1 - i), 'yyyy-MM-dd');
      dates.push(date);
      progressByDate[date] = {
        date,
        totalQuestions: 0,
        correctQuestions: 0,
        timeSpent: 0,
        sectionsCompleted: 0,
        modules: []
      };
    }

    // 実際のデータをマージ
    dailyProgress?.forEach((record: {
      date: string;
      questions_attempted?: number;
      questions_correct?: number;
      time_spent_minutes?: number;
      sections_completed?: number;
      module_name: string;
    }) => {
      const date = record.date;
      if (progressByDate[date]) {
        progressByDate[date].totalQuestions += record.questions_attempted || 0;
        progressByDate[date].correctQuestions += record.questions_correct || 0;
        progressByDate[date].timeSpent += record.time_spent_minutes || 0;
        progressByDate[date].sectionsCompleted += record.sections_completed || 0;
        progressByDate[date].modules.push(record.module_name);
      }
    });

    // 配列に変換
    const chartData = dates.map(date => ({
      ...progressByDate[date],
      correctRate: progressByDate[date].totalQuestions > 0
        ? Math.round((progressByDate[date].correctQuestions / progressByDate[date].totalQuestions) * 100)
        : 0
    }));

    return successResponse({
      dailyProgress: chartData,
      summary: {
        totalDays: days,
        activeDays: chartData.filter(d => d.totalQuestions > 0).length,
        totalQuestions: chartData.reduce((sum, d) => sum + d.totalQuestions, 0),
        totalCorrect: chartData.reduce((sum, d) => sum + d.correctQuestions, 0),
        totalTimeMinutes: chartData.reduce((sum, d) => sum + d.timeSpent, 0)
      }
    });
  } catch (error) {
    return handleAPIError(error);
  }
}

// POST: 日次進捗の記録/更新
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const body = await request.json();
    const {
      userId,
      moduleName,
      questionsAttempted,
      questionsCorrect,
      timeSpentMinutes,
      sectionsCompleted
    } = body;

    if (!userId || !moduleName) {
      throw new APIError(400, 'userId and moduleName are required', 'MISSING_REQUIRED_FIELDS');
    }

    const today = format(new Date(), 'yyyy-MM-dd');

    // 既存のレコードをチェック
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existing } = await (supabase as any)
      .from('daily_learning_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .eq('module_name', moduleName)
      .single();

    let result;
    if (existing) {
      // 更新
      const updateData = {
        questions_attempted: (existing.questions_attempted || 0) + (questionsAttempted || 0),
        questions_correct: (existing.questions_correct || 0) + (questionsCorrect || 0),
        time_spent_minutes: (existing.time_spent_minutes || 0) + (timeSpentMinutes || 0),
        sections_completed: (existing.sections_completed || 0) + (sectionsCompleted || 0),
        updated_at: new Date().toISOString()
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('daily_learning_progress')
        .update(updateData)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // 新規作成
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('daily_learning_progress')
        .insert({
          user_id: userId,
          date: today,
          module_name: moduleName,
          questions_attempted: questionsAttempted || 0,
          questions_correct: questionsCorrect || 0,
          time_spent_minutes: timeSpentMinutes || 0,
          sections_completed: sectionsCompleted || 0
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    // ストリークの更新
    await updateStreak(supabase, userId);

    return successResponse(result);
  } catch (error) {
    return handleAPIError(error);
  }
}

// ストリーク情報の更新
async function updateStreak(supabase: ReturnType<typeof getSupabaseAdmin>, userId: string) {
  const today = format(new Date(), 'yyyy-MM-dd');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: streak } = await (supabase as any)
    .from('learning_streaks')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!streak) {
    // 新規作成
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('learning_streaks')
      .insert({
        user_id: userId,
        current_streak: 1,
        longest_streak: 1,
        last_activity_date: today,
        total_days_learned: 1
      });
  } else {
    const lastActivity = streak.last_activity_date;
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

    let newStreak = streak.current_streak;
    let totalDays = streak.total_days_learned;

    if (lastActivity === today) {
      // 今日既に学習済み
      return;
    } else if (lastActivity === yesterday) {
      // 連続学習
      newStreak += 1;
      totalDays += 1;
    } else {
      // ストリークが切れた
      newStreak = 1;
      totalDays += 1;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('learning_streaks')
      .update({
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, streak.longest_streak),
        last_activity_date: today,
        total_days_learned: totalDays,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
  }
}