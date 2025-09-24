# Database CLI 使用ガイド - Dev Elite Academy

## 🚀 概要

Dev Elite AcademyプロジェクトのためのカスタムDB CLIツール。Supabaseデータベースのテーブル作成、マイグレーション、管理を効率化します。

## ⚙️ セットアップ

### 1. 必要な依存関係のインストール

```bash
npm install --save-dev dotenv-cli pg
```

### 2. 環境変数の設定

`.env.local`ファイルに以下を追加：

```env
# Database CLI用設定（Transaction Pooler）
SUPABASE_HOST=aws-0-ap-southeast-1.pooler.supabase.com
SUPABASE_PORT=6543
SUPABASE_DATABASE=postgres
SUPABASE_USER=postgres.example-project-xyz
SUPABASE_PASSWORD=your-actual-password
```

## 🔧 使用方法

### NPMスクリプトで実行（推奨）

```bash
# テーブル作成・マイグレーション
npm run db:migrate

# データベース状態確認
npm run db:status

# 初期データ投入
npm run db:seed

# データベースリセット
npm run db:reset

# 任意のSQLクエリ実行
npm run db:query "SELECT * FROM profiles LIMIT 5"
```

### 直接実行

```bash
# 基本構文
node scripts/db-cli.js <command> [options]

# 例
node scripts/db-cli.js migrate
node scripts/db-cli.js status
node scripts/db-cli.js query "SELECT COUNT(*) FROM categories"
```

## 📋 コマンド一覧

### `migrate` - マイグレーション実行

```bash
npm run db:migrate
```

**機能:**
- `sql/`ディレクトリ内のSQLファイルを順番に実行
- 実行履歴を`migration_history`テーブルで管理
- 未実行のマイグレーションのみを実行

**実行されるファイル:**
- `01_create_tables.sql` - テーブル定義
- `02_initial_data.sql` - 初期データ
- `03_create_users_master.sql` - ユーザーマスターテーブル
- `04_update_progress_tables.sql` - 進捗テーブル更新

### `status` - データベース状態確認

```bash
npm run db:status
```

**表示内容:**
- 全テーブル一覧と行数
- 最近のマイグレーション履歴
- 接続確認

**出力例:**
```
ℹ テーブル数: 8

📊 テーブル一覧:
  • profiles: 5行
  • categories: 6行
  • learning_contents: 24行
  • user_progress: 12行

📝 最近のマイグレーション:
  • 02_initial_data.sql (2025/01/06 14:30:45)
  • 01_create_tables.sql (2025/01/06 14:30:20)
```

### `seed` - 初期データ投入

```bash
npm run db:seed
```

**機能:**
- カテゴリー、学習コンテンツの初期データを投入
- 開発用のサンプルデータを作成

### `reset` - データベースリセット

```bash
npm run db:reset
```

**機能:**
- 全テーブルとデータを削除
- スキーマを再作成
- マイグレーションを自動実行

**⚠️ 注意:** データが完全に削除されるため、確認プロンプトが表示されます

### `query` - SQLクエリ実行

```bash
npm run db:query "SELECT * FROM profiles WHERE skill_level = 'BEGINNER'"
```

**機能:**
- 任意のSQLクエリを実行
- 結果をテーブル形式で表示
- SELECT以外のクエリ（INSERT/UPDATE/DELETE）も実行可能

### `help` - ヘルプ表示

```bash
node scripts/db-cli.js help
```

## 📁 ディレクトリ構造

```
dev-elite-academy/
├── scripts/
│   └── db-cli.js           # DB CLIメインスクリプト
├── sql/                    # SQLマイグレーションファイル
│   ├── 01_create_tables.sql
│   ├── 02_initial_data.sql
│   ├── 03_create_users_master.sql
│   └── 04_update_progress_tables.sql
└── .env.local             # 環境変数（パスワード設定が必要）
```

## 🔄 ワークフロー例

### 新規プロジェクト設定

```bash
# 1. データベースパスワードを.env.localに設定
echo "SUPABASE_PASSWORD=your-password" >> .env.local

# 2. 接続テスト
npm run db:status

# 3. テーブル作成
npm run db:migrate

# 4. 初期データ投入
npm run db:seed

# 5. 確認
npm run db:status
```

### 開発時の一般的な使用

```bash
# 新しいマイグレーション追加後
npm run db:migrate

# データベース状態確認
npm run db:status

# テストデータの確認
npm run db:query "SELECT * FROM categories"

# 必要に応じて完全リセット
npm run db:reset
```

## 🛡️ セキュリティ・ベストプラクティス

### 1. 環境変数の管理
- `.env.local`はGitにコミットしない（`.gitignore`で除外済み）
- パスワードは必要最小限の権限のユーザーを使用

### 2. Transaction Pooler使用
- 接続効率を最大化
- 接続数制限を回避
- 自動的な接続管理

### 3. マイグレーション管理
- すべての変更をSQLファイルで管理
- 実行履歴を自動記録
- ロールバック機能（手動で対応）

## ❓ トラブルシューティング

### 接続エラーの場合

```bash
❌ エラー: SUPABASE_PASSWORD環境変数が設定されていません
```
→ `.env.local`にパスワードを設定してください

```bash
❌ 接続エラー: no pg_hba.conf entry for host
```
→ SSL設定を確認（自動的に設定されているはず）

### SQLエラーの場合

```bash
❌ ステートメント 5 でエラー: relation "profiles" does not exist
```
→ 依存関係のあるテーブルが先に作成されているか確認

### パフォーマンスの確認

```bash
# 接続数確認
npm run db:query "SELECT count(*) FROM pg_stat_activity WHERE datname = 'postgres'"

# 実行中のクエリ確認
npm run db:query "SELECT query, state, query_start FROM pg_stat_activity WHERE state != 'idle'"
```

## 🚀 高度な使用方法

### カスタムSQLファイルの追加

1. `sql/`ディレクトリに新しいファイルを作成
2. ファイル名は番号順（例: `05_add_notifications.sql`）
3. `npm run db:migrate`で自動実行

### バックアップとリストア

```bash
# データ確認（バックアップ前）
npm run db:query "SELECT table_name, pg_size_pretty(pg_total_relation_size(table_name::regclass)) as size FROM information_schema.tables WHERE table_schema = 'public'"

# 本番環境では別途pg_dumpを使用してバックアップを取得
```

---

これでSupabaseデータベースを効率的に管理できます！