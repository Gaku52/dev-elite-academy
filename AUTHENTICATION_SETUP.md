# 認証システム設定仕様書

## 概要
本アプリケーションの認証システムは **本番環境（Vercel）専用** で動作するよう設定されています。

## 重要な設計方針
- **本番環境での動作を優先**
- **ローカル開発での認証テストは行わない**
- **全ての認証テストは本番環境で実施**

## Supabase設定

### URL Configuration
**Authentication** → **Settings** → **URL Configuration**

- **Site URL**: `https://dev-elite-academy.vercel.app`
- **Redirect URLs**:
  - `https://dev-elite-academy.vercel.app/**`
  - `https://dev-elite-academy.vercel.app/auth/**`

## 環境変数設定

### 1. GitHub Actions Secrets
以下のsecretsが設定済み：
- `NEXT_PUBLIC_SUPABASE_URL`: `https://ttsdtjzcgxufudepclzg.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- `SUPABASE_SERVICE_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 2. Vercel環境変数
以下の環境変数が設定済み：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`

## データベース設定

### テーブル構成
```sql
-- 認証テーブル（Supabase管理）
auth.users

-- プロフィールテーブル（アプリケーション管理）
public.users (
  id uuid REFERENCES auth.users ON DELETE CASCADE,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
)
```

### RLS（Row Level Security）
```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
```

### トリガー設定
新規ユーザー作成時に自動でプロフィールレコードを作成：
```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## テストユーザー

### 認証情報
- **Email**: `gan.keyss3kfree2350@gmail.com`
- **Password**: `password123`

## テスト手順

### 1. 本番環境でのサインインテスト
1. https://dev-elite-academy.vercel.app/auth にアクセス
2. 上記認証情報でサインイン
3. 認証成功を確認

### 2. 新規ユーザー作成テスト
1. https://dev-elite-academy.vercel.app/auth でサインアップ
2. 新しいメールアドレスとパスワードで登録
3. `public.users`テーブルにレコードが自動作成されることを確認

## 重要な注意事項

### ⚠️ ローカル開発について
- **ローカルでの認証テストは行わない**
- **Supabase URL設定は本番環境固定**
- **ローカル開発は認証機能以外のUI/UX確認のみ**

### ⚠️ デプロイメント
- **GitHub Actionsが自動でVercelにデプロイ**
- **環境変数は既に設定済み**
- **認証機能は本番環境でのみ動作**

## トラブルシューティング

### 401 Unauthorized Error
1. Supabase URL設定の確認
2. 環境変数の確認
3. APIキーの有効性確認

### 500 Database Error
1. `public.users`テーブルの存在確認
2. トリガー関数の動作確認
3. RLSポリシーの確認

## 更新履歴
- 2025-09-06: 初回作成、本番環境専用設定に変更