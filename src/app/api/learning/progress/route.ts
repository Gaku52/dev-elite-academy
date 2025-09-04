import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
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

// 学習進捗の取得
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const contentId = searchParams.get('contentId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();

    // ユーザーの進捗を取得
    let query = supabaseAdmin
      .from('user_progress')
      .select(`
        *,
        learning_contents (
          id,
          title,
          description,
          estimated_time,
          difficulty,
          content_type
        )
      `)
      .eq('user_id', userId);

    if (contentId) {
      query = query.eq('content_id', contentId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Progress fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 学習進捗の更新・作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      contentId, 
      status, 
      progressPercentage, 
      sessionDurationMinutes = 0,
      completedSections = []
    } = body;

    if (!userId || !contentId) {
      return NextResponse.json({ error: 'User ID and Content ID are required' }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // トランザクション処理（複数テーブル更新）

    // 1. user_progress テーブルの更新
    const { data: existingProgress } = await supabaseAdmin
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('content_id', contentId)
      .single();

    const now = new Date().toISOString();
    let progressData;

    if (existingProgress) {
      // 既存の進捗を更新
      const updateData = {
        status: status || existingProgress.status,
        progress_percentage: progressPercentage ?? existingProgress.progress_percentage,
        last_accessed_at: now,
        ...(status === 'completed' && existingProgress.status !== 'completed' 
            ? { completed_at: now } : {}),
        updated_at: now
      };

      const { data, error } = await supabaseAdmin
        .from('user_progress')
        .update(updateData)
        .eq('id', existingProgress.id)
        .select()
        .single();

      if (error) throw error;
      progressData = data;
    } else {
      // 新しい進捗を作成
      const { data, error } = await supabaseAdmin
        .from('user_progress')
        .insert({
          user_id: userId,
          content_id: contentId,
          status: status || 'in_progress',
          progress_percentage: progressPercentage || 0,
          started_at: now,
          ...(status === 'completed' ? { completed_at: now } : {}),
          last_accessed_at: now,
          created_at: now,
          updated_at: now
        })
        .select()
        .single();

      if (error) throw error;
      progressData = data;
    }

    // 2. セクション別進捗の更新（completedSections配列がある場合）
    if (completedSections.length > 0) {
      for (const section of completedSections) {
        await supabaseAdmin
          .from('section_progress')
          .upsert({
            user_id: userId,
            content_id: contentId,
            section_type: section.type,
            section_number: section.number,
            is_completed: section.completed,
            completed_at: section.completed ? now : null,
            duration_minutes: section.duration || 0,
            created_at: now
          }, {
            onConflict: 'user_id,content_id,section_type,section_number'
          });
      }
    }

    // 3. 学習セッションの記録
    if (sessionDurationMinutes > 0) {
      const today = new Date().toISOString().split('T')[0];
      
      // 今日の学習セッションがあるかチェック
      const { data: existingSession } = await supabaseAdmin
        .from('learning_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('content_id', contentId)
        .eq('session_date', today)
        .single();

      if (existingSession) {
        // 既存セッションの更新
        await supabaseAdmin
          .from('learning_sessions')
          .update({
            duration_minutes: existingSession.duration_minutes + sessionDurationMinutes,
            activities_completed: existingSession.activities_completed + completedSections.filter((s: any) => s.completed).length // eslint-disable-line @typescript-eslint/no-explicit-any
          })
          .eq('id', existingSession.id);
      } else {
        // 新しいセッションの作成
        await supabaseAdmin
          .from('learning_sessions')
          .insert({
            user_id: userId,
            content_id: contentId,
            session_date: today,
            duration_minutes: sessionDurationMinutes,
            activities_completed: completedSections.filter((s: any) => s.completed).length, // eslint-disable-line @typescript-eslint/no-explicit-any
            created_at: now
          });
      }
    }

    return NextResponse.json({
      success: true,
      progress: progressData,
      message: 'Progress updated successfully'
    });

  } catch (error) {
    console.error('Progress update error:', error);
    return NextResponse.json({ 
      error: 'Failed to update progress',
      details: (error as Error).message 
    }, { status: 500 });
  }
}