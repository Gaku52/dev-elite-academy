import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(_request: NextRequest) {
  // サーバーサイド用Supabaseクライアント（Service Role Key使用）
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Environment variables missing');
    return NextResponse.json(
      { error: '環境変数未設定', details: 'SUPABASE_URL or SUPABASE_SERVICE_KEY missing' },
      { status: 500 }
    );
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  try {
    console.log('📡 Categories API called');
    
    // CategoriesテーブルからデータをSELECT
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) {
      console.error('❌ Categories SELECT error:', error);
      return NextResponse.json(
        { error: 'Categories取得エラー', details: error.message },
        { status: 500 }
      );
    }

    console.log('✅ Categories SELECT success:', data?.length, 'records');
    
    // 文字化け対策：UTF-8レスポンスヘッダーを明示
    return NextResponse.json(data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
    
  } catch (err) {
    console.error('❌ Categories API error:', err);
    return NextResponse.json(
      { error: 'サーバーエラー', details: String(err) },
      { status: 500 }
    );
  }
}

// CORS対応（必要に応じて）
export async function OPTIONS(_request: NextRequest) {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}