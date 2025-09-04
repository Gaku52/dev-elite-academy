-- 既存のuser_progressテーブルを更新してusersテーブルと連携
-- user_idをauth.usersではなくpublic.usersを参照するように変更

-- 1. 外部キー制約を削除
ALTER TABLE user_progress DROP CONSTRAINT IF EXISTS user_progress_user_id_fkey;
ALTER TABLE section_progress DROP CONSTRAINT IF EXISTS section_progress_user_id_fkey;  
ALTER TABLE learning_sessions DROP CONSTRAINT IF EXISTS learning_sessions_user_id_fkey;

-- 2. 新しい外部キー制約を追加（public.usersテーブルを参照）
ALTER TABLE user_progress 
ADD CONSTRAINT user_progress_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(auth_user_id) ON DELETE CASCADE;

ALTER TABLE section_progress 
ADD CONSTRAINT section_progress_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(auth_user_id) ON DELETE CASCADE;

ALTER TABLE learning_sessions 
ADD CONSTRAINT learning_sessions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(auth_user_id) ON DELETE CASCADE;

-- 3. ユーザー情報取得用のビューを作成
CREATE OR REPLACE VIEW user_learning_summary AS
SELECT 
  u.id as user_master_id,
  u.auth_user_id,
  u.email,
  u.full_name,
  u.avatar_url,
  u.github_username,
  u.subscription_tier,
  COUNT(DISTINCT up.content_id) as contents_started,
  COUNT(DISTINCT CASE WHEN up.status = 'completed' THEN up.content_id END) as contents_completed,
  SUM(ls.duration_minutes) as total_study_minutes,
  MAX(up.last_accessed_at) as last_study_date,
  u.created_at as joined_at
FROM users u
LEFT JOIN user_progress up ON u.auth_user_id = up.user_id
LEFT JOIN learning_sessions ls ON u.auth_user_id = ls.user_id
GROUP BY u.id, u.auth_user_id, u.email, u.full_name, u.avatar_url, u.github_username, u.subscription_tier, u.created_at;

-- 4. RLS ポリシー更新
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (
    user_id = auth.uid() OR 
    user_id IN (SELECT auth_user_id FROM users WHERE auth_user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
CREATE POLICY "Users can update own progress" ON user_progress
  FOR ALL USING (
    user_id = auth.uid() OR 
    user_id IN (SELECT auth_user_id FROM users WHERE auth_user_id = auth.uid())
  );