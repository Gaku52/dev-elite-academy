import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabaseクライアントを作成（サービスロール用）
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// サービスロール用のクライアント（管理者用）
// 現在は使用していないが、将来の管理機能のために残しておく
// function getSupabaseAdmin() {
//   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
//   const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

//   if (!supabaseUrl || !supabaseServiceKey) {
//     throw new Error('Missing Supabase environment variables');
//   }

//   return createClient(supabaseUrl, supabaseServiceKey, {
//     auth: {
//       autoRefreshToken: false,
//       persistSession: false
//     }
//   });
// }

// POST: 進捗を保存/更新（認証ユーザー用）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentId, status, score, timeSpent, attempts } = body;

    if (!contentId) {
      return NextResponse.json({ error: 'contentId is required' }, { status: 400 });
    }

    // 認証チェック（ヘッダーからユーザーIDを取得）
    const authHeader = request.headers.get('authorization');
    const userId = authHeader?.replace('Bearer ', '') || null;

    if (!userId) {
      // 未認証の場合はゲストとして処理（ローカルストレージで管理）
      return NextResponse.json({ 
        success: false, 
        message: 'Authentication required for saving progress to database',
        isGuest: true 
      }, { status: 401 });
    }

    const supabase = getSupabaseClient();
    
    // 既存の進捗をチェック
    const { data: existingProgress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('content_id', contentId)
      .single();

    let result;

    if (existingProgress) {
      // 更新
      const updateData: Record<string, unknown> = {
        status: status || existingProgress.status,
        updated_at: new Date().toISOString()
      };

      // オプショナルなフィールドの更新
      if (score !== undefined) updateData.score = score;
      if (timeSpent !== undefined) updateData.time_spent = (existingProgress.time_spent || 0) + timeSpent;
      if (attempts !== undefined) updateData.attempts = (existingProgress.attempts || 0) + 1;

      // ステータスが完了に変わった場合
      if (status === 'COMPLETED' && existingProgress.status !== 'COMPLETED') {
        updateData.completed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('user_progress')
        .update(updateData)
        .eq('user_id', userId)
        .eq('content_id', contentId)
        .select()
        .single();

      if (error) {
        console.error('Update error:', error);
        throw error;
      }
      result = data;
    } else {
      // 新規作成
      const insertData: Record<string, unknown> = {
        user_id: userId,
        content_id: contentId,
        status: status || 'IN_PROGRESS',
        score: score || 0,
        time_spent: timeSpent || 0,
        attempts: attempts || 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (status === 'COMPLETED') {
        insertData.completed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('user_progress')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }
      result = data;
    }

    return NextResponse.json({ 
      success: true, 
      data: result,
      message: 'Progress saved successfully'
    });

  } catch (error) {
    console.error('Error saving progress:', error);
    return NextResponse.json({ 
      error: 'Failed to save progress',
      details: error instanceof Error ? error.message : 'Unknown error',
      code: (error as { code?: string }).code || 'UNKNOWN'
    }, { status: 500 });
  }
}

// GET: ユーザーの進捗を取得
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const contentId = searchParams.get('contentId');

    // 認証チェック（ヘッダーからユーザーIDを取得）
    const authHeader = request.headers.get('authorization');
    const userId = authHeader?.replace('Bearer ', '') || null;

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authentication required',
        isGuest: true,
        data: [] 
      });
    }

    const supabase = getSupabaseClient();

    let query = supabase
      .from('user_progress')
      .select(`
        *,
        learning_contents (
          id,
          title,
          description,
          difficulty,
          estimated_time,
          category_id,
          categories (
            id,
            name,
            icon,
            color
          )
        )
      `)
      .eq('user_id', userId);

    if (contentId) {
      query = query.eq('content_id', contentId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Fetch error:', error);
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      data: data || [] 
    });

  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch progress',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE: 進捗をリセット
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const contentId = searchParams.get('contentId');

    if (!contentId) {
      return NextResponse.json({ error: 'contentId is required' }, { status: 400 });
    }

    // 認証チェック（ヘッダーからユーザーIDを取得）
    const authHeader = request.headers.get('authorization');
    const userId = authHeader?.replace('Bearer ', '') || null;

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authentication required',
        isGuest: true 
      }, { status: 401 });
    }

    const supabase = getSupabaseClient();

    const { error } = await supabase
      .from('user_progress')
      .delete()
      .eq('user_id', userId)
      .eq('content_id', contentId);

    if (error) {
      console.error('Delete error:', error);
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Progress reset successfully' 
    });

  } catch (error) {
    console.error('Error resetting progress:', error);
    return NextResponse.json({ 
      error: 'Failed to reset progress',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}