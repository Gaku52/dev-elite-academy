-- 既存データのis_completedフラグを修正
-- 問題: answer_count > 0なのにis_completed = falseになっているレコードを修正

-- 回答履歴があるレコードはすべてis_completed = trueにすべき
-- (正解・不正解に関わらず、回答したら完了扱い)

UPDATE user_learning_progress
SET
  is_completed = true,
  updated_at = NOW()
WHERE
  answer_count > 0
  AND is_completed = false;

-- 確認用: 影響を受けたレコード数を表示
DO $$
DECLARE
  affected_count INTEGER;
BEGIN
  GET DIAGNOSTICS affected_count = ROW_COUNT;
  RAISE NOTICE '更新されたレコード数: %', affected_count;
END $$;

-- データの整合性チェック: answer_count > 0 だが is_completed = false のレコードが残っていないか確認
DO $$
DECLARE
  inconsistent_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO inconsistent_count
  FROM user_learning_progress
  WHERE answer_count > 0 AND is_completed = false;

  IF inconsistent_count > 0 THEN
    RAISE WARNING '警告: まだ % 件の不整合なレコードが存在します', inconsistent_count;
  ELSE
    RAISE NOTICE '✓ データの整合性チェック完了: 不整合なレコードはありません';
  END IF;
END $$;
