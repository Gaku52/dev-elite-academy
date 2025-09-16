-- =====================================================
-- セキュリティ問題修正スクリプト（最終版）
-- 実行日: 2025-09-09
-- study_plan_contentsテーブルを除外
-- =====================================================

-- =======================================
-- 1. RLSポリシーが欠落しているテーブルの修正
-- =======================================

-- achievementsテーブルの既存ポリシーを削除して再作成
DROP POLICY IF EXISTS "Users can view own achievements" ON achievements;
DROP POLICY IF EXISTS "Users can insert own achievements" ON achievements;

CREATE POLICY "Users can view own achievements" 
ON achievements FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements" 
ON achievements FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- section_progressテーブルの既存ポリシーを削除して再作成
DROP POLICY IF EXISTS "Users can view own section progress" ON section_progress;
DROP POLICY IF EXISTS "Users can update own section progress" ON section_progress;
DROP POLICY IF EXISTS "Users can insert own section progress" ON section_progress;

CREATE POLICY "Users can view own section progress" 
ON section_progress FOR SELECT 
USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can update own section progress" 
ON section_progress FOR UPDATE 
USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can insert own section progress" 
ON section_progress FOR INSERT 
WITH CHECK (auth.jwt() ->> 'email' = user_email);

-- study_plansテーブルの既存ポリシーを削除して再作成
DROP POLICY IF EXISTS "Users can view own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can update own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can insert own study plans" ON study_plans;
DROP POLICY IF EXISTS "Users can delete own study plans" ON study_plans;

CREATE POLICY "Users can view own study plans" 
ON study_plans FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own study plans" 
ON study_plans FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own study plans" 
ON study_plans FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own study plans" 
ON study_plans FOR DELETE 
USING (auth.uid() = user_id);

-- =======================================
-- 2. 関数のsearch_path修正
-- =======================================

-- handle_new_user関数のsearch_path設定（存在する場合のみ）
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user' AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
        ALTER FUNCTION public.handle_new_user() SET search_path = public, pg_temp;
    END IF;
END $$;

-- update_updated_at_column関数のsearch_path設定
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column' AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
        ALTER FUNCTION public.update_updated_at_column() SET search_path = public, pg_temp;
    END IF;
END $$;

-- =======================================
-- 3. 確認クエリ
-- =======================================

-- 現在存在するテーブルの確認
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
ORDER BY 
    tablename;

-- RLSポリシーの確認
SELECT 
    tablename,
    COUNT(*) as policy_count,
    CASE 
        WHEN COUNT(*) = 0 THEN '❌ ポリシーなし'
        ELSE '✅ ポリシー設定済み (' || COUNT(*) || '件)'
    END as status
FROM 
    pg_policies
WHERE 
    schemaname = 'public'
GROUP BY 
    tablename
ORDER BY 
    tablename;

-- 関数のsearch_path確認
SELECT 
    proname as function_name,
    CASE 
        WHEN proconfig::text LIKE '%search_path%' THEN '✅ search_path設定済み'
        ELSE '❌ search_path未設定'
    END as status
FROM 
    pg_proc 
WHERE 
    pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    AND proname IN ('handle_new_user', 'update_updated_at_column');

-- =======================================
-- 残りの手動設定項目:
-- =======================================
-- 1. パスワード漏洩保護の有効化：
--    Dashboard > Authentication > Password > Enable leaked password protection
--
-- 2. PostgreSQLのアップグレード：
--    Dashboard > Settings > Infrastructure > Upgrade Database
-- =======================================