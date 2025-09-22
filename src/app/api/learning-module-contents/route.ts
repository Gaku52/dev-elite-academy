import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

// 学習モジュールのコンテンツ数を取得
export async function GET(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase configuration missing' },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const categoryName = searchParams.get('categoryName');

    if (!categoryName) {
      return NextResponse.json({ error: 'categoryName is required' }, { status: 400 });
    }

    // 特別処理: 基本情報技術者試験の実装済みモジュール数を返す
    if (categoryName === '基本情報技術者試験') {
      const implementedModules = [
        { name: 'コンピュータシステム', isImplemented: true },
        { name: 'アルゴリズムとプログラミング', isImplemented: true },
        { name: 'データベース', isImplemented: true },
        { name: 'ネットワーク', isImplemented: true },
        { name: 'セキュリティ', isImplemented: true },
        { name: 'システム開発', isImplemented: true },
        { name: '経営・法務', isImplemented: true },
        { name: 'ストラテジ', isImplemented: true }
      ];

      const implementedCount = implementedModules.filter(module => module.isImplemented).length;

      return NextResponse.json({
        categoryName,
        totalModules: implementedModules.length,
        implementedModules: implementedCount,
        modules: implementedModules
      });
    }

    // 他のカテゴリは従来通り learning_contents から取得
    const { data, error } = await supabase
      .from('learning_contents')
      .select('*')
      .eq('is_published', true);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // カテゴリ名でフィルタリング（実際のテーブル構造に応じて調整）
    const categoryContents = data?.filter(content =>
      content.title?.includes(categoryName) || content.description?.includes(categoryName)
    ) || [];

    return NextResponse.json({
      categoryName,
      contentCount: categoryContents.length,
      contents: categoryContents
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// モジュールの実装状況を更新（管理者用）
export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase configuration missing' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { categoryName, moduleName, isImplemented } = body;

    if (!categoryName || !moduleName || typeof isImplemented !== 'boolean') {
      return NextResponse.json({
        error: 'categoryName, moduleName, and isImplemented are required'
      }, { status: 400 });
    }

    // 実装状況を更新するロジック（将来的にデータベーステーブルを作成時に使用）
    return NextResponse.json({
      message: `Module ${moduleName} implementation status updated to ${isImplemented}`,
      categoryName,
      moduleName,
      isImplemented
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}