import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// サーバーサイドでカテゴリを取得
async function getCategories() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return [];
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    const { data: categories } = await supabaseAdmin
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    
    return categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function LearnPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-card dark:bg-card">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              📚 学習コンテンツ
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              エンジニアとしてのスキルを向上させるためのコンテンツを選択してください
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/learn/${category.id}`}
                className="bg-background rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{category.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-xs text-muted">
                        順序: {category.sort_order}
                      </span>
                    </div>
                    <div className="text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
                      学習開始 →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              学習コンテンツを準備中です
            </h3>
            <p className="text-muted-foreground mb-8">
              現在、学習コンテンツを準備しています。しばらくお待ちください。
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              ← ホームに戻る
            </Link>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-border text-foreground rounded-lg hover:bg-muted transition-colors"
            >
              ← ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}