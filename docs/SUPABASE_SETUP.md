# Supabase セットアップガイド

このドキュメントでは、Dev Elite AcademyでSupabaseを設定する手順を説明します。

## 1. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com)にアクセスしてアカウントを作成
2. 新しいプロジェクトを作成
3. プロジェクト名、データベースパスワードを設定

## 2. 環境変数の設定

プロジェクトダッシュボードから以下の情報を取得：

1. **Settings** → **API** に移動
2. 以下の値をコピー：
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. `.env.local`ファイルを更新：

```
NEXT_PUBLIC_SUPABASE_URL=https://example-project-xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb-example-anon-key-1234567890abcdef
```

## 3. 認証設定

### メール認証の有効化

1. **Authentication** → **Providers** に移動
2. **Email** プロバイダーを有効化
3. 以下の設定を確認：
   - `Enable Email Signup` をONにする
   - `Confirm email` の設定（推奨：ON）

### メールテンプレートの設定（オプション）

1. **Authentication** → **Email Templates** に移動
2. 必要に応じてメールテンプレートをカスタマイズ

### URL設定

1. **Authentication** → **URL Configuration** に移動
2. 以下を設定：
   - `Site URL`: `http://localhost:3000`（開発環境）
   - `Redirect URLs`: `http://localhost:3000/**`

## 4. データベーステーブルの作成

`sql/01_create_tables.sql`のSQLを実行：

1. **SQL Editor** に移動
2. SQLファイルの内容をコピー＆ペースト
3. 実行

## 5. Row Level Security (RLS) の設定

必要に応じてRLSポリシーを設定：

```sql
-- ユーザーマスターテーブルのRLS
ALTER TABLE user_master ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のデータのみ参照可能
CREATE POLICY "Users can view own profile" 
ON user_master FOR SELECT 
USING (auth.uid() = user_id);

-- ユーザーは自分のデータのみ更新可能
CREATE POLICY "Users can update own profile" 
ON user_master FOR UPDATE 
USING (auth.uid() = user_id);
```

## 6. トラブルシューティング

### よくあるエラーと対処法

1. **"Email signups are disabled"**
   - Email プロバイダーが無効になっています
   - Authentication → Providers → Email を有効化

2. **"supabaseUrl is required"**
   - 環境変数が設定されていません
   - `.env.local`ファイルを確認

3. **"Invalid API key"**
   - APIキーが正しくありません
   - Supabaseダッシュボードから正しいキーをコピー

4. **メール確認が送信されない**
   - SMTP設定を確認（Pro版以上で独自SMTP設定可能）
   - 開発環境では、Authentication → Users でメール確認を手動で行える

## 7. 本番環境への移行

1. Vercelなどのホスティングサービスで環境変数を設定
2. URL設定を本番URLに更新
3. RLSポリシーを適切に設定
4. バックアップ戦略を確立