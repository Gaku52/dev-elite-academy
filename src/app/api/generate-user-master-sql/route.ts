import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    // 既存のlearning_contentsテーブルの構造を確認
    const { data: tableInfo } = await supabaseAdmin
      .from('learning_contents')
      .select('id')
      .limit(1);

    // ID型を判定
    const refType = typeof tableInfo?.[0]?.id === 'number' ? 'INTEGER' : 'UUID';

    const sql = `
-- ==========================================
-- ユーザーマスターテーブル作成SQL
-- GitHub OAuth認証対応版
-- 参照ID型: ${refType}
-- ==========================================

-- 1. ユーザーマスターテーブル
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  avatar_url TEXT,
  github_username VARCHAR(100),
  github_id BIGINT,
  preferred_language VARCHAR(10) DEFAULT 'ja',
  timezone VARCHAR(50) DEFAULT 'Asia/Tokyo',
  notification_preferences JSONB DEFAULT '{"email": true, "push": false}',
  subscription_tier VARCHAR(20) DEFAULT 'free', -- free, premium, enterprise
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  profile_completed BOOLEAN DEFAULT false,
  terms_accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_github_username ON users(github_username);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- RLS (Row Level Security) 設定
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分の情報のみ閲覧・更新可能
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = auth_user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = auth_user_id);

-- 自動的にユーザーレコード作成のトリガー
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (auth_user_id, email, full_name, avatar_url, github_username, github_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'user_name',
    (NEW.raw_user_meta_data->>'provider_id')::BIGINT
  );
  RETURN NEW;
END;
$$ language plpgsql security definer;

-- ユーザー作成時に自動でマスターレコード作成
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 更新時刻の自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 追加：学習統計ビュー作成
-- ==========================================

-- ユーザー学習サマリービュー
CREATE OR REPLACE VIEW user_learning_summary AS
SELECT 
  u.id as user_master_id,
  u.auth_user_id,
  u.email,
  u.full_name,
  u.avatar_url,
  u.github_username,
  u.subscription_tier,
  COALESCE(stats.contents_started, 0) as contents_started,
  COALESCE(stats.contents_completed, 0) as contents_completed,
  COALESCE(stats.total_study_minutes, 0) as total_study_minutes,
  stats.last_study_date,
  u.created_at as joined_at
FROM users u
LEFT JOIN (
  SELECT 
    user_id,
    COUNT(DISTINCT content_id) as contents_started,
    COUNT(DISTINCT CASE WHEN status = 'completed' THEN content_id END) as contents_completed,
    0 as total_study_minutes,  -- learning_sessions テーブル作成後に更新
    MAX(last_accessed_at) as last_study_date
  FROM user_progress 
  GROUP BY user_id
) stats ON u.auth_user_id = stats.user_id;

-- ==========================================
-- テスト・確認用クエリ
-- ==========================================

-- 作成されたテーブル確認
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users';

-- トリガー確認  
-- SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';

-- ポリシー確認
-- SELECT * FROM pg_policies WHERE schemaname = 'public' AND tablename = 'users';

-- ==========================================
-- 注意事項
-- ==========================================
-- 1. このSQLはSupabase認証システムと連携します
-- 2. GitHub OAuthでユーザー作成時、自動でusersテーブルにレコードが作成されます
-- 3. 既存の進捗テーブルがある場合、別途統合SQLが必要です
-- 4. RLSが有効なので、ユーザーは自分のデータのみアクセス可能です
`;

    return new NextResponse(sql, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': 'attachment; filename="create_user_master_table.sql"'
      }
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'ユーザーマスターSQL生成中にエラーが発生しました',
      details: (error as Error).message 
    }, { status: 500 });
  }
}