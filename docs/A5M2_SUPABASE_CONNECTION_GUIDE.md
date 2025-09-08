# A5:SQL Mk-2 (A5M2) でSupabaseに接続する完全ガイド

## 📋 必要な情報の準備

### 1. Supabaseダッシュボードから接続情報を取得

1. [Supabase Dashboard](https://app.supabase.com) にログイン
2. 対象のプロジェクトを選択
3. **Settings** → **Database** に移動
4. 以下の情報をメモ：

#### 接続情報の場所
- **Host**: `Connection string` セクションの `Host` 欄
  - 形式: `db.xxxxxxxxxx.supabase.co`
  
- **Database name**: `postgres`（固定）

- **Port**: `5432`（デフォルト）または `6543`（プーリング接続用）

- **User**: `postgres`（デフォルト）

- **Password**: プロジェクト作成時に設定したデータベースパスワード
  - 忘れた場合: Settings → Database → Reset database password

#### Direct Connection（推奨）
```
Host: db.xxxxxxxxxx.supabase.co
Port: 5432
Database: postgres
User: postgres
Password: [your-database-password]
```

#### Connection Pooling（接続数制限がある場合）
```
Host: db.xxxxxxxxxx.supabase.co
Port: 6543
Database: postgres
User: postgres
Password: [your-database-password]
```

## 🔧 A5M2での設定手順

### Step 1: データベース接続設定

1. A5M2を起動
2. メニューから **データベース** → **データベースの追加と削除** を選択
3. **追加** ボタンをクリック

### Step 2: 接続情報の入力

#### 基本設定タブ
```
データベース種類: PostgreSQL
ホスト名/IPアドレス: db.xxxxxxxxxx.supabase.co
ポート番号: 5432
データベース名: postgres
ユーザーID: postgres
パスワード: [your-database-password]
```

#### オプション設定
```
スキーマ: public（デフォルト）
文字セット: UTF8
SSL接続: 必須（チェックを入れる）
```

### Step 3: SSL設定（重要！）

SupabaseはSSL接続を必須としているため、以下の設定が必要：

1. **詳細設定** タブを開く
2. **SSL Mode** を選択：
   - `require`（推奨）
   - `prefer` 
   - `allow`

3. **接続パラメータ** に以下を追加：
```
sslmode=require
```

### Step 4: 接続テスト

1. **テスト接続** ボタンをクリック
2. 成功メッセージが表示されることを確認
3. **OK** をクリックして保存

## ❌ よくあるエラーと解決方法

### エラー1: "no pg_hba.conf entry for host"
**原因**: SSL接続が有効になっていない
**解決方法**: 
- 接続パラメータに `sslmode=require` を追加
- SSL接続のチェックボックスを有効化

### エラー2: "password authentication failed"
**原因**: パスワードが間違っている
**解決方法**:
- Supabaseダッシュボードでパスワードをリセット
- Settings → Database → Reset database password

### エラー3: "timeout expired" 
**原因**: ネットワーク接続の問題
**解決方法**:
- ファイアウォール/プロキシ設定を確認
- ポート5432が開いているか確認
- VPNを使用している場合は無効化してテスト

### エラー4: "SSL SYSCALL error"
**原因**: SSL証明書の検証エラー
**解決方法**:
- sslmode を `require` から `disable` に変更（非推奨、テスト用のみ）
- A5M2のSSL証明書検証設定を確認

### エラー5: "too many connections"
**原因**: 接続数の上限に達している
**解決方法**:
- Connection Pooling（ポート6543）を使用
- 既存の接続を閉じる
- Supabaseダッシュボードで接続状況を確認

## 🔍 接続確認方法

### A5M2での確認
1. 接続後、左側のツリーでデータベースを展開
2. スキーマ → public → テーブル を確認
3. テーブル一覧が表示されれば成功

### SQLでの確認
```sql
-- 接続確認
SELECT current_database(), current_user, version();

-- テーブル一覧確認
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- 現在の接続数確認
SELECT count(*) 
FROM pg_stat_activity 
WHERE datname = 'postgres';
```

## 💡 Tips & ベストプラクティス

### 1. Connection Poolingの利用
開発環境で複数の接続を使用する場合：
- ポート `6543` を使用
- Transaction modeで接続

### 2. 接続文字列の保存
A5M2で接続文字列として保存する場合：
```
postgresql://postgres:[password]@db.xxxxxxxxxx.supabase.co:5432/postgres?sslmode=require
```

### 3. 読み取り専用ユーザーの作成
本番環境では読み取り専用ユーザーを作成：
```sql
CREATE USER readonly_user WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE postgres TO readonly_user;
GRANT USAGE ON SCHEMA public TO readonly_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;
```

### 4. 接続プールの管理
```sql
-- アクティブな接続を確認
SELECT pid, usename, application_name, client_addr, state
FROM pg_stat_activity
WHERE datname = 'postgres';

-- 不要な接続を切断
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'postgres' 
  AND pid <> pg_backend_pid()
  AND state = 'idle'
  AND state_change < current_timestamp - INTERVAL '10 minutes';
```

## 📞 サポート

問題が解決しない場合：
1. Supabaseのステータスページを確認: https://status.supabase.com/
2. Supabaseサポートドキュメント: https://supabase.com/docs
3. A5M2の設定を再確認
4. ネットワーク管理者に問い合わせ（企業ネットワークの場合）

---
最終更新: 2025年9月6日