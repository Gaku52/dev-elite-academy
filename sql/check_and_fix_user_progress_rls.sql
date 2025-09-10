-- =====================================================
-- user_progress テーブルのRLSポリシー確認と修正
-- 実行日: 2025-09-10
-- 目的: 進捗の保存・更新が正常に動作するようにRLSポリシーを修正
-- =====================================================

-- =======================================
-- 1. 現在の状態確認
-- =======================================

-- テーブルのRLS状態確認
SELECT 
    tablename,
    rowsecurity,
    CASE 
        WHEN rowsecurity = true THEN '✅ RLS有効'
        ELSE '❌ RLS無効'
    END as rls_status
FROM 
    pg_tables
WHERE 
    schemaname = 'public'
    AND tablename IN ('user_progress', 'learning_contents', 'categories', 'profiles', 'users');

-- user_progressテーブルの現在のポリシー確認
SELECT 
    policyname,
    cmd,
    permissive,
    roles,
    qual,
    with_check
FROM 
    pg_policies
WHERE 
    schemaname = 'public'
    AND tablename = 'user_progress';

-- =======================================
-- 2. RLSを有効化（無効になっている場合）
-- =======================================

-- user_progressテーブルのRLSを有効化
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- =======================================
-- 3. 既存のポリシーを削除
-- =======================================

-- 既存のuser_progressポリシーをすべて削除
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can delete own progress" ON user_progress;
DROP POLICY IF EXISTS "Enable read access for all users" ON user_progress;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_progress;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON user_progress;

-- =======================================
-- 4. 新しいポリシーを作成
-- =======================================

-- 認証ユーザーは自分の進捗を表示できる
CREATE POLICY "Users can view own progress" 
ON user_progress 
FOR SELECT 
USING (
    auth.uid() = user_id 
    OR auth.uid() IS NOT NULL  -- 認証済みユーザーは全体を見られる（一時的）
);

-- 認証ユーザーは自分の進捗を作成できる
CREATE POLICY "Users can insert own progress" 
ON user_progress 
FOR INSERT 
WITH CHECK (
    auth.uid() = user_id
);

-- 認証ユーザーは自分の進捗を更新できる
CREATE POLICY "Users can update own progress" 
ON user_progress 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 認証ユーザーは自分の進捗を削除できる
CREATE POLICY "Users can delete own progress" 
ON user_progress 
FOR DELETE 
USING (auth.uid() = user_id);

-- =======================================
-- 5. サービスロール用のポリシー（管理者用）
-- =======================================

-- サービスロールは全操作可能（バックエンドAPI用）
CREATE POLICY "Service role has full access" 
ON user_progress 
FOR ALL 
USING (
    auth.jwt() ->> 'role' = 'service_role'
);

-- =======================================
-- 6. 関連テーブルのポリシー確認と修正
-- =======================================

-- learning_contentsテーブル（読み取り専用）
ALTER TABLE learning_contents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published contents" ON learning_contents;
CREATE POLICY "Anyone can view published contents" 
ON learning_contents 
FOR SELECT 
USING (is_published = true);

-- categoriesテーブル（読み取り専用）
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active categories" ON categories;
CREATE POLICY "Anyone can view active categories" 
ON categories 
FOR SELECT 
USING (is_active = true);

-- =======================================
-- 7. トリガーの確認と修正
-- =======================================

-- updated_at自動更新用の関数が存在するか確認
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- user_progressのupdated_atトリガー
DROP TRIGGER IF EXISTS update_user_progress_updated_at ON user_progress;
CREATE TRIGGER update_user_progress_updated_at
    BEFORE UPDATE ON user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =======================================
-- 8. 動作確認用のテストクエリ
-- =======================================

-- テスト用: 現在のユーザーIDを確認
SELECT auth.uid() as current_user_id;

-- テスト用: user_progressへのINSERTテスト（実行しない、参考用）
/*
INSERT INTO user_progress (user_id, content_id, status, score, time_spent, attempts)
VALUES (
    auth.uid(), 
    1, 
    'IN_PROGRESS', 
    0, 
    0, 
    1
)
ON CONFLICT (user_id, content_id) 
DO UPDATE SET 
    status = EXCLUDED.status,
    updated_at = NOW();
*/

-- =======================================
-- 9. ポリシー適用後の確認
-- =======================================

-- 新しいポリシーの確認
SELECT 
    policyname,
    cmd,
    CASE cmd
        WHEN 'SELECT' THEN '👁️ 読み取り'
        WHEN 'INSERT' THEN '➕ 作成'
        WHEN 'UPDATE' THEN '✏️ 更新'
        WHEN 'DELETE' THEN '🗑️ 削除'
        WHEN 'ALL' THEN '🔓 全操作'
    END as operation,
    permissive
FROM 
    pg_policies
WHERE 
    schemaname = 'public'
    AND tablename = 'user_progress'
ORDER BY 
    policyname;

-- =======================================
-- 注意事項:
-- =======================================
-- 1. このSQLはSupabaseのSQL Editorで実行してください
-- 2. 実行前に現在のポリシーをバックアップすることを推奨
-- 3. 本番環境での実行前にステージング環境でテストしてください
-- 4. auth.uid()がnullの場合（未認証）はアクセス拒否されます
-- =======================================