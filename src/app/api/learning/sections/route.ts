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

// セクション別進捗の取得
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const contentId = searchParams.get('contentId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();

    let query = supabaseAdmin
      .from('section_progress')
      .select('*')
      .eq('user_id', userId);

    if (contentId) {
      query = query.eq('content_id', contentId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Section progress fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch section progress' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}