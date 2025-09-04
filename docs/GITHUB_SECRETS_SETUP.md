# GitHub Secrets 設定ガイド

GitHub ActionsでCI/CDパイプラインを正常に動作させるために必要なSecretsの設定手順です。

## 必要なSecrets一覧

以下の4つのSecretsを設定する必要があります：

1. **NEXT_PUBLIC_SUPABASE_URL** - SupabaseプロジェクトのURL
2. **NEXT_PUBLIC_SUPABASE_ANON_KEY** - Supabaseの匿名キー
3. **SUPABASE_SERVICE_KEY** - Supabaseのサービスキー（管理者権限）
4. **VERCEL_TOKEN** - Vercelのデプロイメントトークン

## 設定手順

### 1. GitHub Secretsの設定

1. GitHubリポジトリページを開く
2. **Settings** タブをクリック
3. 左側のメニューから **Secrets and variables** → **Actions** を選択
4. **New repository secret** ボタンをクリック

### 2. Supabase関連のSecrets

#### NEXT_PUBLIC_SUPABASE_URL
1. [Supabaseダッシュボード](https://app.supabase.com)にログイン
2. プロジェクトを選択
3. **Settings** → **API** に移動
4. **Project URL** をコピー
   ```
   例: https://ttsdtjzcgxufudepclzg.supabase.co
   ```
5. GitHubで以下を設定：
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Secret: コピーしたURL

#### NEXT_PUBLIC_SUPABASE_ANON_KEY
1. 同じくSupabaseの **Settings** → **API** ページ
2. **Project API keys** セクションの **anon public** キーをコピー
   ```
   例: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. GitHubで以下を設定：
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Secret: コピーしたキー

#### SUPABASE_SERVICE_KEY
1. 同じくSupabaseの **Settings** → **API** ページ
2. **Project API keys** セクションの **service_role** キーをコピー
   ⚠️ **注意**: このキーは管理者権限を持つため、絶対に公開しないでください
3. GitHubで以下を設定：
   - Name: `SUPABASE_SERVICE_KEY`
   - Secret: コピーしたキー

### 3. Vercel Token

#### VERCEL_TOKEN
1. [Vercel Dashboard](https://vercel.com/account/tokens)にログイン
2. **Create** ボタンをクリック
3. トークン名を入力（例: `dev-elite-academy-deploy`）
4. **Scope** は **Full Access** を選択
5. **Create Token** をクリック
6. 生成されたトークンをコピー（⚠️ 一度しか表示されません）
7. GitHubで以下を設定：
   - Name: `VERCEL_TOKEN`
   - Secret: コピーしたトークン

## 確認方法

### 1. Secrets一覧の確認
GitHubの **Settings** → **Secrets and variables** → **Actions** で、以下の4つのSecretsが登録されていることを確認：

- ✅ NEXT_PUBLIC_SUPABASE_URL
- ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
- ✅ SUPABASE_SERVICE_KEY
- ✅ VERCEL_TOKEN

### 2. GitHub Actionsの動作確認
1. コードをmainブランチにプッシュ
2. **Actions** タブを開く
3. ワークフローが正常に実行されることを確認

## トラブルシューティング

### ビルドエラー「Invalid API key」
- Secretsの名前が正確に一致しているか確認
- Supabaseのキーが正しくコピーされているか確認
- 余分なスペースや改行が含まれていないか確認

### Vercelデプロイエラー
- Vercelトークンの有効期限を確認
- トークンのスコープが適切か確認
- Vercelプロジェクトがリンクされているか確認

### Secretsが反映されない場合
- ワークフローを再実行してみる
- リポジトリのActions権限を確認
- ブランチ保護ルールを確認

## セキュリティ上の注意

⚠️ **重要な注意事項**：
- Secretsは一度設定すると値を確認できません
- 特に`SUPABASE_SERVICE_KEY`は管理者権限を持つため、取り扱いに注意
- Secretsをログに出力しないよう注意
- 定期的にトークンを更新することを推奨

## 関連ドキュメント
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Supabase API Keys](https://supabase.com/docs/guides/api/api-keys)
- [Vercel Tokens](https://vercel.com/docs/rest-api#authentication)