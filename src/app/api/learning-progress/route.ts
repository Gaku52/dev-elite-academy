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

    // 最新の周回番号を取得
    let maxCycleQuery = supabase
      .from('user_learning_progress')
      .select('cycle_number')
      .eq('user_id', userId)
      .order('cycle_number', { ascending: false })
      .limit(1);

    if (moduleName) {
      maxCycleQuery = maxCycleQuery.eq('module_name', moduleName);
    }

    const { data: maxCycleData } = await maxCycleQuery;
    const currentCycle = (maxCycleData as { cycle_number: number }[] | null)?.[0]?.cycle_number || 1;

    // 最新周回のデータのみを取得
    let query = supabase
      .from('user_learning_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('cycle_number', currentCycle);

    if (moduleName) {
      query = query.eq('module_name', moduleName);
    }

    const { data, error } = await query.order('created_at', { ascending: true });

    if (error) throw error;

    return successResponse({ progress: data || [], currentCycle });
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

    // 最新の周回番号を取得
    const { data: maxCycleData } = await supabase
      .from('user_learning_progress')
      .select('cycle_number')
      .eq('user_id', userId)
      .eq('module_name', moduleName)
      .order('cycle_number', { ascending: false })
      .limit(1);

    const currentCycle = (maxCycleData as { cycle_number: number }[] | null)?.[0]?.cycle_number || 1;

    console.log('[SAVE PROGRESS] Current cycle:', currentCycle, 'for user:', userId, 'module:', moduleName, 'section:', sectionKey);

    // 最新周回の既存進捗を確認
    const { data: existingData, error: queryError } = await (supabase as any)
      .from('user_learning_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('module_name', moduleName)
      .eq('section_key', sectionKey)
      .eq('cycle_number', currentCycle)
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
        .eq('cycle_number', currentCycle)
        .select()
        .single();

      if (error) throw error;
      result = data;
      console.log('[SAVE PROGRESS] ✅ Updated existing record for cycle', currentCycle, '- answer_count:', data.answer_count, 'correct_count:', data.correct_count);
    } else {
      // 新規レコードを作成
      console.log('[SAVE PROGRESS] Creating new record for cycle', currentCycle);
      const insertData: LearningProgressInsert = {
        user_id: userId,
        module_name: moduleName,
        section_key: sectionKey,
        cycle_number: currentCycle,
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
      console.log('[SAVE PROGRESS] ✅ Created new record for cycle', currentCycle, '- answer_count:', data.answer_count, 'correct_count:', data.correct_count);
    }

    console.log('[SAVE PROGRESS] 🎉 Success! Returning result for cycle', currentCycle);
    return successResponse({ progress: result, currentCycle });
  } catch (error) {
    return handleAPIError(error);
  }
}