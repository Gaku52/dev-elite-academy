import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { handleAPIError, successResponse, APIError } from '@/lib/api-error-handler';

// GET: ストリーク情報の取得
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      throw new APIError(400, 'userId is required', 'MISSING_USER_ID');
    }

    const { data: streak, error } = await supabase
      .from('learning_streaks')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error;
    }

    // データがない場合はデフォルト値を返す
    if (!streak) {
      return successResponse({
        current_streak: 0,
        longest_streak: 0,
        last_activity_date: null,
        total_days_learned: 0
      });
    }

    return successResponse(streak);
  } catch (error) {
    return handleAPIError(error);
  }
}