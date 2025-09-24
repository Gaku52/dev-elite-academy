-- ピン留めされたカテゴリ（学習パス）を管理するテーブル
CREATE TABLE IF NOT EXISTS pinned_categories (
  id SERIAL PRIMARY KEY,
  user_email TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  pinned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_email, category_id)
);

-- インデックス作成（検索パフォーマンス向上）
CREATE INDEX idx_pinned_categories_email ON pinned_categories(user_email);
CREATE INDEX idx_pinned_categories_category ON pinned_categories(category_id);
CREATE INDEX idx_pinned_categories_pinned_at ON pinned_categories(pinned_at);

-- Row Level Security (RLS) を有効化
ALTER TABLE pinned_categories ENABLE ROW LEVEL SECURITY;

-- RLSポリシー（現時点では全アクセス許可、後で認証追加時に更新）
CREATE POLICY "Allow all access to pinned_categories" ON pinned_categories FOR ALL USING (true);