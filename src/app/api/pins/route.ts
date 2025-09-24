/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { handleAPIError, successResponse, validateRequired, APIError } from '@/lib/api-error-handler';

// GET: ユーザーのピン固定学習パスを取得
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userEmail = searchParams.get('email');

  if (!userEmail) {
    return handleAPIError(new APIError(400, 'Email is required', 'MISSING_EMAIL'));
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();

    // プロフィールテーブルからuser_idを取得
    const { data: profile, error: profileError } = await (supabaseAdmin as any)
      .from('profiles')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (profileError || !profile) {
      throw new APIError(404, 'User not found', 'USER_NOT_FOUND');
    }

    // ピン固定された学習パスを取得
    const { data, error } = await (supabaseAdmin as any)
      .from('pinned_learning_paths')
      .select('*')
      .eq('user_id', profile.id)
      .order('pinned_at', { ascending: false });

    if (error) throw error;

    return successResponse(data || []);
  } catch (error) {
    return handleAPIError(error);
  }
}

// POST: 学習パスをピン固定
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userEmail, learningPathName } = body;

  try {
    validateRequired(body, ['userEmail', 'learningPathName']);
    const supabaseAdmin = getSupabaseAdmin();

    // プロフィールテーブルからuser_idを取得
    const { data: profile, error: profileError } = await (supabaseAdmin as any)
      .from('profiles')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (profileError || !profile) {
      throw new APIError(404, 'User not found', 'USER_NOT_FOUND');
    }

    // 既にピン固定されているかチェック
    const { data: existingPin } = await (supabaseAdmin as any)
      .from('pinned_learning_paths')
      .select('*')
      .eq('user_id', profile.id)
      .eq('learning_path_name', learningPathName)
      .single();

    if (existingPin) {
      throw new APIError(400, 'Learning path is already pinned', 'ALREADY_PINNED');
    }

    // ピン固定を追加
    const { data, error } = await (supabaseAdmin as any)
      .from('pinned_learning_paths')
      .insert({
        user_id: profile.id,
        learning_path_name: learningPathName
      })
      .select()
      .single();

    if (error) throw error;

    return successResponse(data);
  } catch (error) {
    return handleAPIError(error);
  }
}

// DELETE: 学習パスのピン固定を解除
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userEmail = searchParams.get('email');
  const learningPathName = searchParams.get('learningPathName');

  if (!userEmail || !learningPathName) {
    return handleAPIError(new APIError(400, 'Email and learningPathName are required', 'MISSING_PARAMETERS'));
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();

    // プロフィールテーブルからuser_idを取得
    const { data: profile, error: profileError } = await (supabaseAdmin as any)
      .from('profiles')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (profileError || !profile) {
      throw new APIError(404, 'User not found', 'USER_NOT_FOUND');
    }

    // ピン固定を削除
    const { data, error } = await (supabaseAdmin as any)
      .from('pinned_learning_paths')
      .delete()
      .eq('user_id', profile.id)
      .eq('learning_path_name', learningPathName)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      throw new APIError(404, 'Pin not found', 'PIN_NOT_FOUND');
    }

    return successResponse({ message: 'Pin removed successfully' });
  } catch (error) {
    return handleAPIError(error);
  }
}