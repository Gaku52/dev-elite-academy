-- =====================================================
-- 緊急: RLSセキュリティ修正スクリプト
-- 実行日: 2025-09-09
-- 目的: 無効化されているRLSを有効化し、適切なポリシーを設定
-- =====================================================

-- ステップ1: RLSが無効になっているテーブルを有効化
-- =====================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_progress ENABLE ROW LEVEL SECURITY;

-- ステップ2: 危険な全許可ポリシーを削除（存在する場合）
-- =====================================================

-- user_progressテーブルの危険なポリシーを削除
DROP POLICY IF EXISTS "Allow all access to user_progress" ON user_progress;
DROP POLICY IF EXISTS "Allow all access to section_progress" ON section_progress;
DROP POLICY IF EXISTS "Allow all access to learning_notes" ON learning_notes;
DROP POLICY IF EXISTS "Allow all access to quiz_results" ON quiz_results;
DROP POLICY IF EXISTS "Allow all access to learning_sessions" ON learning_sessions;

-- ステップ3: 適切なRLSポリシーを作成
-- =====================================================

-- categoriesテーブル: 全ユーザーが閲覧可能（マスターデータ）
CREATE POLICY "Categories are viewable by everyone" 
ON categories FOR SELECT 
USING (true);

-- learning_contentsテーブル: 公開コンテンツは全員閲覧可能
CREATE POLICY "Published content is viewable by everyone" 
ON learning_contents FOR SELECT 
USING (is_published = true);

-- profilesテーブル: ユーザーは自分のプロフィールのみ操作可能
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- user_progressテーブル: 既存のポリシーを適切に修正
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;

CREATE POLICY "Users can view own progress" 
ON user_progress FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" 
ON user_progress FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" 
ON user_progress FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- section_progressテーブル: emailベースからUUIDベースに変更が必要
-- 注意: このテーブルはuser_emailを使用しているため、一時的にauth.jwt()を使用
CREATE POLICY "Users can view own section progress" 
ON section_progress FOR SELECT 
USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can update own section progress" 
ON section_progress FOR UPDATE 
USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can insert own section progress" 
ON section_progress FOR INSERT 
WITH CHECK (auth.jwt() ->> 'email' = user_email);

-- learning_notesテーブル
CREATE POLICY "Users can view own notes" 
ON learning_notes FOR SELECT 
USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can update own notes" 
ON learning_notes FOR UPDATE 
USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can insert own notes" 
ON learning_notes FOR INSERT 
WITH CHECK (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can delete own notes" 
ON learning_notes FOR DELETE 
USING (auth.jwt() ->> 'email' = user_email);

-- quiz_resultsテーブル
CREATE POLICY "Users can view own quiz results" 
ON quiz_results FOR SELECT 
USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can insert own quiz results" 
ON quiz_results FOR INSERT 
WITH CHECK (auth.jwt() ->> 'email' = user_email);

-- learning_sessionsテーブル
CREATE POLICY "Users can view own sessions" 
ON learning_sessions FOR SELECT 
USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can insert own sessions" 
ON learning_sessions FOR INSERT 
WITH CHECK (auth.jwt() ->> 'email' = user_email);

-- ステップ4: 結果確認用クエリ
-- =====================================================

-- RLSの状態を再確認
SELECT 
    schemaname,
    tablename,
    rowsecurity as "RLS有効",
    CASE 
        WHEN rowsecurity = true THEN '✅ 安全'
        ELSE '❌ 危険 - RLS無効'
    END as "状態"
FROM 
    pg_tables
WHERE 
    schemaname = 'public'
ORDER BY 
    tablename;

-- 各テーブルのポリシー数を確認
SELECT 
    tablename,
    COUNT(*) as policy_count,
    CASE 
        WHEN COUNT(*) = 0 THEN '❌ ポリシーなし'
        ELSE '✅ ポリシー設定済み'
    END as status
FROM 
    pg_policies
WHERE 
    schemaname = 'public'
GROUP BY 
    tablename
ORDER BY 
    tablename;

-- =====================================================
-- 実行後の確認事項:
-- 1. 全テーブルのrowsecurityがtrueになっていること
-- 2. 各テーブルに適切なポリシーが設定されていること
-- 3. Security Advisorの警告が0になること
-- =====================================================