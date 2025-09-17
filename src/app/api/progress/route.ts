/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { handleAPIError, successResponse, validateRequired, APIError } from '@/lib/api-error-handler';
import { LEARNING_CONFIG } from '@/constants/learning';

// GET: ユーザーの進捗を取得
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userEmail = searchParams.get('email');
  const contentId = searchParams.get('contentId');

  if (!userEmail) {
    return handleAPIError(new APIError(400, 'Email is required', 'MISSING_EMAIL'));
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    let query = (supabaseAdmin as any)
      .from('user_progress')
      .select('*, learning_contents(title, description)')
      .eq('user_email', userEmail);

    if (contentId) {
      query = query.eq('content_id', contentId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return successResponse(data || []);
  } catch (error) {
    return handleAPIError(error);
  }
}

// POST: 進捗を保存/更新
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userEmail, contentId, status, progressPercentage } = body;

  try {
    validateRequired(body, ['userEmail', 'contentId']);
    const supabaseAdmin = getSupabaseAdmin();
    // 既存の進捗をチェック
    const { data: existingProgress } = await (supabaseAdmin as any)
      .from('user_progress')
      .select('*')
      .eq('user_email', userEmail)
      .eq('content_id', contentId)
      .single();

    let result;

    if (existingProgress) {
      // 更新
      const updateData: Record<string, unknown> = {
        status: status || (existingProgress as any).status,
        progress_percentage: progressPercentage ?? (existingProgress as any).progress_percentage,
        last_accessed_at: new Date().toISOString()
      };

      if (status === 'completed' && (existingProgress as any).status !== 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { data, error } = await (supabaseAdmin as any)
        .from('user_progress')
        .update(updateData)
        .eq('id', (existingProgress as any).id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // 新規作成
      const { data, error } = await (supabaseAdmin as any)
        .from('user_progress')
        .insert({
          user_email: userEmail,
          content_id: contentId,
          status: status || LEARNING_CONFIG.STATUS.IN_PROGRESS,
          progress_percentage: progressPercentage || 0,
          started_at: new Date().toISOString(),
          completed_at: status === 'completed' ? new Date().toISOString() : null
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return successResponse(result);
  } catch (error) {
    return handleAPIError(error);
  }
}

// PUT: セクション進捗を更新
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { userEmail, contentId, sectionType, sectionNumber, isCompleted } = body;

  try {
    validateRequired(body, ['userEmail', 'contentId', 'sectionType']);
    if (sectionNumber === undefined) {
      throw new APIError(400, 'Section number is required', 'MISSING_SECTION_NUMBER');
    }
    const supabaseAdmin = getSupabaseAdmin();
    // セクション進捗を更新
    const { data: sectionData, error: sectionError } = await (supabaseAdmin as any)
      .from('section_progress')
      .upsert({
        user_email: userEmail,
        content_id: contentId,
        section_type: sectionType,
        section_number: sectionNumber,
        is_completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null
      }, {
        onConflict: 'user_email,content_id,section_type,section_number'
      })
      .select()
      .single();

    if (sectionError) throw sectionError;

    // 全セクションの進捗を確認して全体進捗を更新
    const { data: allSections } = await (supabaseAdmin as any)
      .from('section_progress')
      .select('*')
      .eq('user_email', userEmail)
      .eq('content_id', contentId);

    const totalSections = LEARNING_CONFIG.DEFAULT_SECTIONS_COUNT;
    const completedSections = allSections?.filter((s: any) => s.is_completed).length || 0;
    const progressPercentage = Math.round((completedSections / totalSections) * 100);

    // 全体進捗を更新
    await POST(new NextRequest(new URL('/api/progress', request.url), {
      method: 'POST',
      body: JSON.stringify({
        userEmail,
        contentId,
        status: progressPercentage === LEARNING_CONFIG.PROGRESS_COMPLETE_THRESHOLD ? LEARNING_CONFIG.STATUS.COMPLETED : LEARNING_CONFIG.STATUS.IN_PROGRESS,
        progressPercentage
      })
    }));

    return successResponse({
      section: sectionData,
      overallProgress: progressPercentage
    });
  } catch (error) {
    return handleAPIError(error);
  }
}