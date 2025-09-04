-- 1. 全テーブル一覧確認
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_catalog.pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 2. 特定テーブルの詳細定義確認
SELECT 
  column_name,
  data_type,
  character_maximum_length,
  is_nullable,
  column_default,
  ordinal_position
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'learning_contents'  -- テーブル名を指定
ORDER BY ordinal_position;

-- 3. 外部キー制約確認
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- 4. インデックス確認
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- 5. テーブル作成文を生成（PostgreSQL形式）
SELECT 
  'CREATE TABLE ' || table_name || ' (' || 
  array_to_string(
    array_agg(
      column_name || ' ' || 
      CASE 
        WHEN data_type = 'character varying' THEN 'VARCHAR(' || character_maximum_length || ')'
        WHEN data_type = 'text' THEN 'TEXT'
        WHEN data_type = 'integer' THEN 'INTEGER'
        WHEN data_type = 'bigint' THEN 'BIGINT'
        WHEN data_type = 'boolean' THEN 'BOOLEAN'
        WHEN data_type = 'timestamp with time zone' THEN 'TIMESTAMP WITH TIME ZONE'
        WHEN data_type = 'uuid' THEN 'UUID'
        WHEN data_type = 'jsonb' THEN 'JSONB'
        ELSE UPPER(data_type)
      END ||
      CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END ||
      CASE WHEN column_default IS NOT NULL THEN ' DEFAULT ' || column_default ELSE '' END
      ORDER BY ordinal_position
    ), 
    ', '
  ) || ');' as create_statement
FROM information_schema.columns 
WHERE table_schema = 'public'
  AND table_name = 'learning_contents'  -- テーブル名を指定
GROUP BY table_name;

-- 6. RLS (Row Level Security) ポリシー確認
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 7. トリガー確認
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement,
  action_timing
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;