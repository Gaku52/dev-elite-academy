import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { adminAuthMiddleware, validateInput } from '../../../../lib/auth-middleware';
import type { AuthResult, ValidationResult } from '../../../../lib/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️ Supabase configuration missing, API will not function properly');
}

const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
}) : null;

export async function GET(request: NextRequest) {
  // 管理者認証チェック（診断付き）
  const authResult = await adminAuthMiddleware(request);
  if (!authResult.success || !(authResult.result as AuthResult)?.authenticated) {
    return (authResult.result as AuthResult)?.response || NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase configuration missing' },
      { status: 500 }
    );
  }

  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select(`
        *,
        contents:learning_contents(count),
        study_plans(count)
      `)
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // 管理者認証チェック（診断付き）
  const authResult = await adminAuthMiddleware(request);
  if (!authResult.success || !(authResult.result as AuthResult)?.authenticated) {
    return (authResult.result as AuthResult)?.response || NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase configuration missing' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();

    // 入力値検証（診断付き）
    const validationResult = validateInput(body, {
      name: (value: unknown) => typeof value === 'string' && value.trim().length > 0 && value.length <= 100,
      description: (value: unknown) => value === undefined || (typeof value === 'string' && value.length <= 500),
      icon: (value: unknown) => value === undefined || (typeof value === 'string' && value.length <= 50),
      color: (value: unknown) => value === undefined || (typeof value === 'string' && /^#[0-9A-Fa-f]{6}$/.test(value)),
      sortOrder: (value: unknown) => value === undefined || (typeof value === 'number' && value >= 0),
      isActive: (value: unknown) => value === undefined || typeof value === 'boolean'
    });

    if (!validationResult.success || !(validationResult.result as ValidationResult)?.isValid) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: (validationResult.result as ValidationResult)?.errors || ['Unknown validation error']
        },
        { status: 400 }
      );
    }

    const { name, description, icon, color, sortOrder, isActive } = body;

    const { data: category, error } = await supabase
      .from('categories')
      .insert({
        name,
        description,
        icon,
        color,
        sort_order: sortOrder ?? 0,
        is_active: isActive ?? true
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase configuration missing' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { id, name, description, icon, color, sortOrder, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const { data: category, error } = await supabase
      .from('categories')
      .update({
        name,
        description,
        icon,
        color,
        sort_order: sortOrder,
        is_active: isActive
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase configuration missing' },
      { status: 500 }
    );
  }

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
      .from('categories')
      .delete()
      .eq('id', parseInt(id));

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}