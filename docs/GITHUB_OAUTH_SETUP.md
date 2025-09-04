# GitHub OAuth セットアップ手順

## 1. GitHub OAuth App 作成

### GitHub側設定：
1. GitHub → Settings → Developer settings → OAuth Apps
2. "New OAuth App" をクリック
3. 以下を設定：
   - **Application name**: Dev Elite Academy
   - **Homepage URL**: http://localhost:3001 (開発用)
   - **Authorization callback URL**: http://localhost:3001/auth/callback
   - **Application description**: 高年収エンジニア学習プラットフォーム

### 本番環境用：
- **Homepage URL**: https://your-app.vercel.app
- **Authorization callback URL**: https://your-app.vercel.app/auth/callback

## 2. Supabase側設定

### Authentication Settings:
1. Supabase Dashboard → Authentication → Settings
2. **Site URL**: http://localhost:3001
3. **Redirect URLs**: 
   - http://localhost:3001
   - http://localhost:3001/auth/callback
   - https://your-app.vercel.app (本番用)

### GitHub Provider 設定:
1. Authentication → Providers → GitHub
2. **Enable GitHub provider**: ON
3. **Client ID**: GitHubで生成されたClient ID
4. **Client Secret**: GitHubで生成されたClient Secret

## 3. 環境変数更新

`.env.local`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsI..."
SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsI..."

# GitHub OAuth (Supabaseで管理するため不要だが、参考用)
# GITHUB_CLIENT_ID="your_github_client_id"
# GITHUB_CLIENT_SECRET="your_github_client_secret"
```

## 4. 期待される動作

### 新規ユーザー登録時:
1. GitHubでOAuth認証
2. Supabaseにauth.usersレコード作成
3. トリガーでpublic.usersレコード自動作成
4. GitHub情報（username, avatar等）が自動保存

### データ構造:
```sql
-- auth.users (Supabase管理)
id, email, raw_user_meta_data

-- public.users (アプリ管理)
id, auth_user_id, email, full_name, avatar_url, github_username, github_id

-- user_progress (学習進捗)
user_id (= auth.users.id を参照)
```

## 5. トラブルシューティング

### よくある問題：
- **Callback URL mismatch**: GitHubとSupabaseのURL設定を確認
- **Client ID/Secret 不一致**: 設定値を再確認
- **CORS エラー**: Supabaseの Redirect URLs設定を確認
- **トリガー未実行**: SQLでトリガー関数の確認

### 確認コマンド：
```sql
-- トリガー確認
SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';

-- ユーザーデータ確認  
SELECT * FROM auth.users LIMIT 5;
SELECT * FROM users LIMIT 5;
```