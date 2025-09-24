-- ピン機能のためのテーブル追加
-- 学習パスのピン状態を管理するテーブル

-- ピン固定された学習パス
CREATE TABLE pinned_learning_paths (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    learning_path_name TEXT NOT NULL,
    pinned_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, learning_path_name)
);

-- インデックスの作成（パフォーマンス最適化）
CREATE INDEX idx_pinned_learning_paths_user ON pinned_learning_paths(user_id);
CREATE INDEX idx_pinned_learning_paths_name ON pinned_learning_paths(learning_path_name);

-- RLSポリシーの設定（セキュリティ）
ALTER TABLE pinned_learning_paths ENABLE ROW LEVEL SECURITY;

-- ピン固定学習パス：ユーザーは自分のピンのみ操作可能
CREATE POLICY "Users can view own pinned paths" ON pinned_learning_paths FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own pinned paths" ON pinned_learning_paths FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own pinned paths" ON pinned_learning_paths FOR DELETE USING (auth.uid() = user_id);