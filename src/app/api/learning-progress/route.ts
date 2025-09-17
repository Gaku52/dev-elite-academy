/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { handleAPIError, successResponse, validateRequired, APIError } from '@/lib/api-error-handler';
import type { LearningProgressRecord, LearningProgressInsert, LearningProgressUpdate } from '@/types/database';

// 進捗取得 GET /api/learning-progress?userId=xxx&moduleName=xxx
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const moduleName = searchParams.get('moduleName');

    if (!userId) {
      return handleAPIError(new APIError(400, 'userId is required', 'MISSING_USER_ID'));
    }

    let query = supabase
      .from('user_learning_progress')
      .select('*')
      .eq('user_id', userId);

    if (moduleName) {
      query = query.eq('module_name', moduleName);
    }

    const { data, error } = await query.order('created_at', { ascending: true });

    if (error) throw error;

    return successResponse({ progress: data || [] });
  } catch (error) {
    return handleAPIError(error);
  }
}

// 進捗保存/更新 POST /api/learning-progress
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const body = await request.json();
    const { userId, moduleName, sectionKey, isCompleted, isCorrect } = body;

    validateRequired(body, ['userId', 'moduleName', 'sectionKey']);

    // 既存の進捗を確認
    const { data: existingData, error: queryError } = await (supabase as any)
      .from('user_learning_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('module_name', moduleName)
      .eq('section_key', sectionKey)
      .maybeSingle();

    if (queryError) {
      throw queryError;
    }

    const existing = existingData as LearningProgressRecord | null;

    let result;

    if (existing) {
      // 既存レコードを更新
      const newAnswerCount = existing.answer_count + 1;
      const newCorrectCount = existing.correct_count + (isCorrect ? 1 : 0);

      const updateData: LearningProgressUpdate = {
        is_completed: isCompleted,
        is_correct: isCorrect,
        answer_count: newAnswerCount,
        correct_count: newCorrectCount,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await (supabase as any)
        .from('user_learning_progress')
        .update(updateData)
        .eq('user_id', userId)
        .eq('module_name', moduleName)
        .eq('section_key', sectionKey)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // 新規レコードを作成
      const insertData: LearningProgressInsert = {
        user_id: userId,
        module_name: moduleName,
        section_key: sectionKey,
        is_completed: isCompleted,
        is_correct: isCorrect,
        answer_count: 1,
        correct_count: isCorrect ? 1 : 0
      };

      const { data, error } = await (supabase as any)
        .from('user_learning_progress')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return successResponse({ progress: result });
  } catch (error) {
    return handleAPIError(error);
  }
}