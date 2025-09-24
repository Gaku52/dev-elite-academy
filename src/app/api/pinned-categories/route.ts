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

    const { data: pinnedCategories, error } = await supabaseAdmin
      .from('pinned_categories')
      .select(`
        category_id,
        pinned_at,
        categories (
          id,
          name,
          description,
          icon,
          color
        )
      `)
      .eq('user_email', userEmail)
      .order('pinned_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error fetching pinned categories:', error);
      return NextResponse.json({ error: 'Failed to fetch pinned categories' }, { status: 500 });
    }

    return NextResponse.json({ pinnedCategories: pinnedCategories || [] });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userEmail, categoryId } = body;

    if (!userEmail || !categoryId) {
      return NextResponse.json({ error: 'User email and category ID are required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('pinned_categories')
      .insert({
        user_email: userEmail,
        category_id: categoryId
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Category is already pinned' }, { status: 409 });
      }
      console.error('Error pinning category:', error);
      return NextResponse.json({ error: 'Failed to pin category' }, { status: 500 });
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
    const { userEmail, categoryId } = body;

    if (!userEmail || !categoryId) {
      return NextResponse.json({ error: 'User email and category ID are required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('pinned_categories')
      .delete()
      .eq('user_email', userEmail)
      .eq('category_id', categoryId);

    if (error) {
      console.error('Error unpinning category:', error);
      return NextResponse.json({ error: 'Failed to unpin category' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}