# 🚨 緊急：セキュリティ修正完了

## Service Key漏洩の対応

### ✅ 修正済み
- `setup-db.js`, `create-user-only.js`, `disable-trigger.js`からハードコーディングされたService Keyを削除
- 環境変数（`.env.local`）を使用するように変更
- `dotenv`パッケージをインストール

### 🔐 次に必要な手順

#### 1. **Supabaseでキーをローテーション（必須）**
```bash
# Supabase Dashboardで実行
1. https://app.supabase.com にアクセス
2. プロジェクト「dev-elite-academy-db」を選択
3. Settings → API
4. 「Generate new service role key」をクリック
5. 古いキーを無効化
```

#### 2. **新しいキーを設定**
`.env.local`ファイルを作成して新しいキーを設定：

```env
NEXT_PUBLIC_SUPABASE_URL=https://ttsdtjzcgxufudepclzg.supabase.co
SUPABASE_SERVICE_KEY=新しいキーをここに設定
```

#### 3. **GitHub Secretでの警告を解決**
- GitHub → Settings → Security → Secrets scanning alerts
- 該当の警告を「Close as resolved」に設定

### 📝 修正されたファイル
- `setup-db.js` - 環境変数を使用
- `create-user-only.js` - 環境変数を使用  
- `disable-trigger.js` - 環境変数を使用
- `package.json` - dotenvを追加

### 🛡️ セキュリティ強化
- `.env.local`は`.gitignore`で除外済み
- ハードコーディングされた認証情報の完全削除
- 実行時の環境変数チェック機能追加

### ⚠️ 重要な注意
**古い漏洩したキーは無効化が必要です。新しいキーを生成するまでデータベースアクセスが制限される可能性があります。**