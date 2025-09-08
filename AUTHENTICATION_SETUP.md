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

### ⚠️ **重要: APIキータイプについて**

**2025年1月より、SupabaseがAPIキー体系を変更しました。**

#### 新しいAPIキー形式（推奨・必須）:
- **Publishable Key**: `sb_publishable_...` で始まる
- **Secret Key**: `sb_secret_...` で始まる

#### 廃止予定のLegacy APIキー:
- **Anon Key**: `eyJhbGciOiJIUzI1NiIs...` で始まるJWTトークン
- **Service Role Key**: `eyJhbGciOiJIUzI1NiIs...` で始まるJWTトークン

### 🚨 **Legacy API Keys Disabled エラーの解決方法**

**症状:** 
- データベース接続エラー
- "Legacy API keys disabled" メッセージ
- 使用状況モニターで0.1MB表示

**解決策:**
1. Supabaseダッシュボード → Settings → API Keys
2. **Create new publishable key** をクリック
3. **Create new secret key** をクリック  
4. 新しいキーで環境変数を更新

### 1. GitHub Actions Secrets
以下のsecretsが設定済み（**新しいAPIキー使用**）：
- `NEXT_PUBLIC_SUPABASE_URL`: `https://ttsdtjzcgxufudepclzg.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `sb_publishable_yMGPNABnusHZlx1vUs3oew_HcVM3pEe`
- `SUPABASE_SERVICE_KEY`: `sb_secret_0aQNUeGZ8jzlrkKXe9j3GQ_c2z-Zpbx`

### 2. Vercel環境変数
以下の環境変数が設定済み（**新しいAPIキー使用**）：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Production) → `sb_publishable_...`
- `SUPABASE_SERVICE_KEY` (Production) → `sb_secret_...`

### 3. APIキー移行チェックリスト
- [ ] Supabase ダッシュボードで新しいキーを作成
- [ ] GitHub Actions Secrets を新しいキーで更新
- [ ] Vercel Environment Variables を新しいキーで更新
- [ ] デプロイして db-test ページで接続確認
- [ ] 使用状況モニターで正確な容量が表示されることを確認

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

### ❌ Legacy API Keys Disabled Error
**症状:** 
- データベース接続で "Legacy API keys disabled" エラー
- /usage ページで 0.1MB 表示
- /db-test ページでデータ取得失敗

**原因:** Legacy JWT形式のAPIキーが廃止された
**解決方法:**
1. Supabaseダッシュボード → Settings → API Keys
2. Create new publishable key (`sb_publishable_...`)
3. Create new secret key (`sb_secret_...`)
4. GitHub Actions Secrets を新しいキーで更新
5. Vercel Environment Variables を新しいキーで更新
6. 再デプロイ実行

### ❌ 401 Unauthorized Error
**原因:**
1. 古いAPIキー使用
2. 環境変数の設定ミス
3. キーの有効期限切れ

**解決方法:**
1. 新しいAPIキー形式の確認 (`sb_` プレフィックス)
2. 環境変数の再設定
3. デプロイの実行

### ❌ 500 Database Error
**原因:**
1. `public.users`テーブル不存在
2. 進捗テーブル不存在
3. RLSポリシー設定ミス

**解決方法:**
1. /api/setup-progress-tables でSQL取得
2. Supabase SQL Editorで実行
3. RLSポリシーの確認

### ❌ 学習進捗が0%に戻る問題
**原因:** 修正済み（ローカルストレージフォールバック実装）
**現在の動作:** 進捗は確実に保存・表示される

## 更新履歴
- 2025-09-06: 初回作成、本番環境専用設定に変更
- 2025-09-06: 新APIキー対応、Legacy API Keys問題の解決策を追加