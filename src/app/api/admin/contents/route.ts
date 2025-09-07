import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('learning_contents')
      .select(`
        *,
        category:categories(*),
        progress:user_progress(count)
      `, { count: 'exact' })
      .order('category_id')
      .order('id')
      .range(from, to);

    if (categoryId) {
      query = query.eq('category_id', parseInt(categoryId));
    }

    const { data: contents, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      contents,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching contents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      categoryId,
      title,
      description,
      contentType,
      contentBody,
      difficulty,
      estimatedTime,
      tags,
      isPublished
    } = body;

    if (!categoryId || !title || !contentType || !contentBody || !difficulty) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    const { data: content, error } = await supabase
      .from('learning_contents')
      .insert({
        category_id: categoryId,
        title,
        description,
        content_type: contentType,
        content_body: contentBody,
        difficulty,
        estimated_time: estimatedTime ?? 30,
        tags: tags ?? [],
        is_published: isPublished ?? false
      })
      .select(`
        *,
        category:categories(*)
      `)
      .single();

    if (error) throw error;

    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      categoryId,
      title,
      description,
      contentType,
      contentBody,
      difficulty,
      estimatedTime,
      tags,
      isPublished
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const { data: content, error } = await supabase
      .from('learning_contents')
      .update({
        category_id: categoryId,
        title,
        description,
        content_type: contentType,
        content_body: contentBody,
        difficulty,
        estimated_time: estimatedTime,
        tags,
        is_published: isPublished
      })
      .eq('id', id)
      .select(`
        *,
        category:categories(*)
      `)
      .single();

    if (error) throw error;

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('learning_contents')
      .delete()
      .eq('id', parseInt(id));

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    );
  }
}