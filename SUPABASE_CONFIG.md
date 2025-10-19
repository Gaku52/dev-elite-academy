# Supabase 認証設定ガイド

## 問題
メール認証リンクが古いVercelプレビュー環境のURLになっている
例: `https://dev-elite-academy-91g12z26b-gaku52s-projects.vercel.app/`

## 解決方法

### 1. Supabaseダッシュボードにアクセス

https://app.supabase.com にログイン

### 2. 認証設定を更新

1. プロジェクト選択: `dev-elite-academy`
2. 左メニュー: **Authentication** → **URL Configuration**
3. 以下のURLを設定:

#### 本番環境
```
Site URL: https://ogadix.com
Redirect URLs:
  - https://ogadix.com/auth/callback
  - https://ogadix.com/reset-password
  - http://localhost:3000/auth/callback  (開発環境用)
  - http://localhost:3000/reset-password  (開発環境用)
```

#### Vercel環境を含める場合（オプション）
```
Redirect URLs に追加:
  - https://*.vercel.app/auth/callback
  - https://dev-elite-academy.vercel.app/auth/callback
```

### 3. Email Templatesの確認

**Authentication** → **Email Templates** で以下を確認:

#### Confirm signup (新規登録確認)
- Subject: `Confirm your signup`
- 本文に含まれるリンク: `{{ .ConfirmationURL }}`
  - これが自動的に設定したRedirect URLsを使用します

#### Reset Password (パスワードリセット)
- Subject: `Reset your password`
- 本文に含まれるリンク: `{{ .ConfirmationURL }}`

### 4. 設定完了後の確認

1. 新規アカウント作成
2. メールで届くリンクのURLを確認
3. 期待されるURL: `https://ogadix.com/auth/callback?code=...`

## コード側の対応

以下のファイルで `emailRedirectTo` を設定済み:

- `src/lib/supabase.ts` - signUp関数
- `src/app/auth/callback/route.ts` - コールバックハンドラー

## トラブルシューティング

### メールが届かない場合
1. Supabaseダッシュボードの **Authentication** → **Users** でユーザーが作成されているか確認
2. Email Provider設定を確認

### リンクが動かない場合
1. Redirect URLsに正しいドメインが登録されているか確認
2. ブラウザのコンソールでエラーを確認

## 最終更新
2025-10-19
