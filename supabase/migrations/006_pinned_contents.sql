-- ピン留めされた学習コンテンツを管理するテーブル
CREATE TABLE IF NOT EXISTS pinned_contents (
  id SERIAL PRIMARY KEY,
  user_email TEXT NOT NULL,
  content_id INTEGER REFERENCES learning_contents(id) ON DELETE CASCADE,
  pinned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_email, content_id)
);

-- インデックス作成（検索パフォーマンス向上）
CREATE INDEX idx_pinned_contents_email ON pinned_contents(user_email);
CREATE INDEX idx_pinned_contents_content ON pinned_contents(content_id);
CREATE INDEX idx_pinned_contents_pinned_at ON pinned_contents(pinned_at);

-- Row Level Security (RLS) を有効化
ALTER TABLE pinned_contents ENABLE ROW LEVEL SECURITY;

-- RLSポリシー（現時点では全アクセス許可、後で認証追加時に更新）
CREATE POLICY "Allow all access to pinned_contents" ON pinned_contents FOR ALL USING (true);