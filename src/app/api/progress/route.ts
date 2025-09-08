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

// GET: ユーザーの進捗を取得
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userEmail = searchParams.get('email');
  const contentId = searchParams.get('contentId');

  if (!userEmail) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    let query = supabaseAdmin
      .from('user_progress')
      .select('*, learning_contents(title, description)')
      .eq('user_email', userEmail);

    if (contentId) {
      query = query.eq('content_id', contentId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}

// POST: 進捗を保存/更新
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userEmail, contentId, status, progressPercentage } = body;

  if (!userEmail || !contentId) {
    return NextResponse.json({ error: 'Email and contentId are required' }, { status: 400 });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    // 既存の進捗をチェック
    const { data: existingProgress } = await supabaseAdmin
      .from('user_progress')
      .select('*')
      .eq('user_email', userEmail)
      .eq('content_id', contentId)
      .single();

    let result;

    if (existingProgress) {
      // 更新
      const updateData: Record<string, unknown> = {
        status: status || existingProgress.status,
        progress_percentage: progressPercentage ?? existingProgress.progress_percentage,
        last_accessed_at: new Date().toISOString()
      };

      if (status === 'completed' && existingProgress.status !== 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { data, error } = await supabaseAdmin
        .from('user_progress')
        .update(updateData)
        .eq('id', existingProgress.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // 新規作成
      const { data, error } = await supabaseAdmin
        .from('user_progress')
        .insert({
          user_email: userEmail,
          content_id: contentId,
          status: status || 'in_progress',
          progress_percentage: progressPercentage || 0,
          started_at: new Date().toISOString(),
          completed_at: status === 'completed' ? new Date().toISOString() : null
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error saving progress:', error);
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 });
  }
}

// PUT: セクション進捗を更新
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { userEmail, contentId, sectionType, sectionNumber, isCompleted } = body;

  if (!userEmail || !contentId || !sectionType || sectionNumber === undefined) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    // セクション進捗を更新
    const { data: sectionData, error: sectionError } = await supabaseAdmin
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
    const { data: allSections } = await supabaseAdmin
      .from('section_progress')
      .select('*')
      .eq('user_email', userEmail)
      .eq('content_id', contentId);

    const totalSections = 4; // 現在は固定で4セクション
    const completedSections = allSections?.filter(s => s.is_completed).length || 0;
    const progressPercentage = Math.round((completedSections / totalSections) * 100);

    // 全体進捗を更新
    await POST(new NextRequest(new URL('/api/progress', request.url), {
      method: 'POST',
      body: JSON.stringify({
        userEmail,
        contentId,
        status: progressPercentage === 100 ? 'completed' : 'in_progress',
        progressPercentage
      })
    }));

    return NextResponse.json({ 
      section: sectionData, 
      overallProgress: progressPercentage 
    });
  } catch (error) {
    console.error('Error updating section progress:', error);
    return NextResponse.json({ error: 'Failed to update section progress' }, { status: 500 });
  }
}