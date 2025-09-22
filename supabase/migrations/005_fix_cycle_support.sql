-- 周回記録システムの修正版実装
-- user_learning_progressテーブルとcycle_statisticsビューの作成

-- 1. user_learning_progressテーブルの確認と修正
DO $$
BEGIN
    -- cycle_numberカラムが存在するかチェック
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_learning_progress'
        AND column_name = 'cycle_number'
    ) THEN
        -- cycle_numberカラムを追加
        ALTER TABLE user_learning_progress
        ADD COLUMN cycle_number INTEGER DEFAULT 1;

        RAISE NOTICE 'Added cycle_number column to user_learning_progress';
    ELSE
        RAISE NOTICE 'cycle_number column already exists';
    END IF;

    -- 既存データに周回数1を設定
    UPDATE user_learning_progress
    SET cycle_number = 1
    WHERE cycle_number IS NULL;

    -- cycle_numberをNOT NULLに変更
    ALTER TABLE user_learning_progress
    ALTER COLUMN cycle_number SET NOT NULL;

    -- 既存のユニーク制約を削除（存在する場合）
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'user_learning_progress_user_id_module_name_section_key_key'
        AND table_name = 'user_learning_progress'
    ) THEN
        ALTER TABLE user_learning_progress
        DROP CONSTRAINT user_learning_progress_user_id_module_name_section_key_key;
        RAISE NOTICE 'Dropped old unique constraint';
    END IF;

    -- 新しい複合ユニーク制約を追加（存在しない場合）
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'user_learning_progress_unique'
        AND table_name = 'user_learning_progress'
    ) THEN
        ALTER TABLE user_learning_progress
        ADD CONSTRAINT user_learning_progress_unique
        UNIQUE(user_id, module_name, section_key, cycle_number);
        RAISE NOTICE 'Added new unique constraint with cycle_number';
    END IF;

END $$;

-- 2. インデックスの作成
CREATE INDEX IF NOT EXISTS idx_user_learning_progress_cycle
ON user_learning_progress(user_id, cycle_number);

-- 3. 周回別統計用のビューを作成/更新
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
  COALESCE(SUM(answer_count), 0) as total_attempts,
  COALESCE(SUM(correct_count), 0) as total_correct_answers,
  MIN(created_at) as cycle_start_date,
  MAX(updated_at) as cycle_last_update
FROM user_learning_progress
GROUP BY user_id, module_name, cycle_number
ORDER BY user_id, module_name, cycle_number;

-- 4. 権限設定
GRANT SELECT ON cycle_statistics TO authenticated;
GRANT SELECT ON cycle_statistics TO anon;

-- 5. Row Level Security (RLS) の設定
ALTER VIEW cycle_statistics SET (security_invoker = true);

-- 6. コメント追加
COMMENT ON COLUMN user_learning_progress.cycle_number IS '学習周回数（1周目、2周目...）';
COMMENT ON VIEW cycle_statistics IS '周回別学習統計ビュー（セキュリティ改善版）';

-- 7. テスト用クエリ（実行結果の確認）
DO $$
BEGIN
    RAISE NOTICE 'Migration completed successfully';
    RAISE NOTICE 'Tables and views are now ready for cycle system';
END $$;