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

    // ピン固定された学習パスを取得（メールアドレスをuser_idとして使用）
    const { data, error } = await (supabaseAdmin as any)
      .from('pinned_learning_paths')
      .select('*')
      .eq('user_email', userEmail)
      .order('pinned_at', { ascending: false });

    if (error) {
      console.error('Error fetching pinned paths:', error);
      // テーブルが存在しない場合は空配列を返す
      if (error.code === '42P01') {
        return successResponse([]);
      }
      throw error;
    }

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

    // 既にピン固定されているかチェック
    const { data: existingPin } = await (supabaseAdmin as any)
      .from('pinned_learning_paths')
      .select('*')
      .eq('user_email', userEmail)
      .eq('learning_path_name', learningPathName)
      .single();

    if (existingPin) {
      // 既にピン固定されている場合は、それを返す（エラーにしない）
      return successResponse(existingPin);
    }

    // ピン固定を追加
    const { data, error } = await (supabaseAdmin as any)
      .from('pinned_learning_paths')
      .insert({
        user_email: userEmail,
        learning_path_name: learningPathName
      })
      .select()
      .single();

    if (error) {
      console.error('Error pinning path:', error);
      throw error;
    }

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

    // ピン固定を削除（メールアドレスをuser_emailとして使用）
    const { data, error } = await (supabaseAdmin as any)
      .from('pinned_learning_paths')
      .delete()
      .eq('user_email', userEmail)
      .eq('learning_path_name', learningPathName)
      .select();

    if (error) {
      console.error('Error unpinning path:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      // ピンが見つからない場合も成功として扱う
      return successResponse({ message: 'Pin not found or already removed' });
    }

    return successResponse({ message: 'Pin removed successfully' });
  } catch (error) {
    return handleAPIError(error);
  }
}