-- =====================================================
-- 残りのセキュリティ問題修正スクリプト
-- 実行日: 2025-09-09
-- 警告: 4件、Info: 3件の修正
-- =====================================================

-- =======================================
-- 1. RLSポリシーが欠落しているテーブルの修正
-- =======================================

-- achievementsテーブルのポリシー追加
CREATE POLICY IF NOT EXISTS "Users can view own achievements" 
ON achievements FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own achievements" 
ON achievements FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- section_progressテーブルのポリシー追加
CREATE POLICY IF NOT EXISTS "Users can view own section progress" 
ON section_progress FOR SELECT 
USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY IF NOT EXISTS "Users can update own section progress" 
ON section_progress FOR UPDATE 
USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY IF NOT EXISTS "Users can insert own section progress" 
ON section_progress FOR INSERT 
WITH CHECK (auth.jwt() ->> 'email' = user_email);

-- study_plansテーブルのポリシー追加
CREATE POLICY IF NOT EXISTS "Users can view own study plans" 
ON study_plans FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own study plans" 
ON study_plans FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own study plans" 
ON study_plans FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete own study plans" 
ON study_plans FOR DELETE 
USING (auth.uid() = user_id);

-- study_plan_contentsテーブルのポリシー追加（関連テーブル）
CREATE POLICY IF NOT EXISTS "Users can manage own study plan contents" 
ON study_plan_contents 
FOR ALL USING (
    auth.uid() = (SELECT user_id FROM study_plans WHERE id = study_plan_id)
);

-- =======================================
-- 2. 関数のsearch_path修正
-- =======================================

-- handle_new_user関数のsearch_path設定
ALTER FUNCTION public.handle_new_user() 
SET search_path = public, pg_temp;

-- update_updated_at_column関数のsearch_path設定
ALTER FUNCTION public.update_updated_at_column() 
SET search_path = public, pg_temp;

-- =======================================
-- 3. 確認クエリ
-- =======================================

-- RLSポリシーの確認
SELECT 
    tablename,
    COUNT(*) as policy_count,
    CASE 
        WHEN COUNT(*) = 0 THEN '❌ ポリシーなし - 要修正'
        ELSE '✅ ポリシー設定済み'
    END as status
FROM 
    pg_policies
WHERE 
    schemaname = 'public'
    AND tablename IN ('achievements', 'section_progress', 'study_plans', 'study_plan_contents')
GROUP BY 
    tablename
ORDER BY 
    tablename;

-- 関数のsearch_path確認
SELECT 
    proname as function_name,
    prosecdef as security_definer,
    proconfig as configuration,
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
-- 注意事項:
-- =======================================
-- 1. パスワード漏洩保護の有効化：
--    Supabase Dashboardから設定してください
--    Dashboard > Authentication > Password > Enable leaked password protection
--
-- 2. PostgreSQLのアップグレード：
--    Supabase Dashboardから実行してください
--    Dashboard > Settings > Database > Upgrade Database
--
-- これらは管理画面からの操作が必要です
-- =======================================