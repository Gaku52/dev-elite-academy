-- ピン機能のためのテーブル追加
-- 学習パスのピン状態を管理するテーブル

-- 既存のテーブルを削除（存在する場合）
DROP TABLE IF EXISTS pinned_learning_paths;

-- ピン固定された学習パス（簡易版：user_emailを使用）
CREATE TABLE pinned_learning_paths (
    id SERIAL PRIMARY KEY,
    user_email TEXT NOT NULL,
    learning_path_name TEXT NOT NULL,
    pinned_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_email, learning_path_name)
);

-- インデックスの作成（パフォーマンス最適化）
CREATE INDEX idx_pinned_learning_paths_email ON pinned_learning_paths(user_email);
CREATE INDEX idx_pinned_learning_paths_name ON pinned_learning_paths(learning_path_name);

-- RLSポリシーの設定（セキュリティ）
ALTER TABLE pinned_learning_paths ENABLE ROW LEVEL SECURITY;

-- すべてのユーザーがアクセス可能（開発環境用）
CREATE POLICY "Enable all access for all users" ON pinned_learning_paths
FOR ALL USING (true) WITH CHECK (true);