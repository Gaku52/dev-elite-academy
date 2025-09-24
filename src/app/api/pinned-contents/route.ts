import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('user_email');

    if (!userEmail) {
      return NextResponse.json({ error: 'User email is required' }, { status: 400 });
    }

    const { data: pinnedContents, error } = await supabaseAdmin
      .from('pinned_contents')
      .select(`
        content_id,
        pinned_at,
        learning_contents (
          id,
          title,
          description,
          content_type,
          difficulty,
          estimated_time,
          tags,
          category_id
        )
      `)
      .eq('user_email', userEmail)
      .order('pinned_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error fetching pinned contents:', error);
      return NextResponse.json({ error: 'Failed to fetch pinned contents' }, { status: 500 });
    }

    return NextResponse.json({ pinnedContents: pinnedContents || [] });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userEmail, contentId } = body;

    if (!userEmail || !contentId) {
      return NextResponse.json({ error: 'User email and content ID are required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('pinned_contents')
      .insert({
        user_email: userEmail,
        content_id: contentId
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Content is already pinned' }, { status: 409 });
      }
      console.error('Error pinning content:', error);
      return NextResponse.json({ error: 'Failed to pin content' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userEmail, contentId } = body;

    if (!userEmail || !contentId) {
      return NextResponse.json({ error: 'User email and content ID are required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('pinned_contents')
      .delete()
      .eq('user_email', userEmail)
      .eq('content_id', contentId);

    if (error) {
      console.error('Error unpinning content:', error);
      return NextResponse.json({ error: 'Failed to unpin content' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}