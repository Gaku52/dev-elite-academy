-- 周回記録システムの実装
-- user_learning_progressテーブルに周回数カラムを追加

-- 1. cycle_numberカラムを追加
ALTER TABLE user_learning_progress
ADD COLUMN IF NOT EXISTS cycle_number INTEGER DEFAULT 1;

-- 2. 既存データに周回数1を設定
UPDATE user_learning_progress
SET cycle_number = 1
WHERE cycle_number IS NULL;

-- 3. cycle_numberをNOT NULLに変更
ALTER TABLE user_learning_progress
ALTER COLUMN cycle_number SET NOT NULL;

-- 4. 既存のユニーク制約を削除
ALTER TABLE user_learning_progress
DROP CONSTRAINT IF EXISTS user_learning_progress_user_id_module_name_section_key_key;

-- 5. 新しい複合ユニーク制約を追加（周回数を含む）
ALTER TABLE user_learning_progress
ADD CONSTRAINT user_learning_progress_unique
UNIQUE(user_id, module_name, section_key, cycle_number);

-- 6. 周回数用のインデックスを追加
CREATE INDEX IF NOT EXISTS idx_user_learning_progress_cycle
ON user_learning_progress(user_id, cycle_number);

-- 7. 周回別統計用のビューを作成
CREATE OR REPLACE VIEW cycle_statistics AS
SELECT
  user_id,
  module_name,
  cycle_number,
  COUNT(*) as total_questions,
  COUNT(CASE WHEN is_completed = true THEN 1 END) as completed_questions,
  COUNT(CASE WHEN is_completed = true AND is_correct = true THEN 1 END) as correct_questions,
  CASE
    WHEN COUNT(CASE WHEN is_completed = true THEN 1 END) > 0 THEN
      ROUND((COUNT(CASE WHEN is_completed = true AND is_correct = true THEN 1 END)::DECIMAL / COUNT(CASE WHEN is_completed = true THEN 1 END)::DECIMAL) * 100, 2)
    ELSE 0
  END as completion_rate,
  SUM(answer_count) as total_attempts,
  SUM(correct_count) as total_correct_answers,
  MIN(created_at) as cycle_start_date,
  MAX(updated_at) as cycle_last_update
FROM user_learning_progress
GROUP BY user_id, module_name, cycle_number
ORDER BY user_id, module_name, cycle_number;

-- 8. 周回別統計ビューの権限設定
GRANT SELECT ON cycle_statistics TO authenticated;
GRANT SELECT ON cycle_statistics TO anon;

-- 9. コメント追加
COMMENT ON COLUMN user_learning_progress.cycle_number IS '学習周回数（1周目、2周目...）';
COMMENT ON VIEW cycle_statistics IS '周回別学習統計ビュー';