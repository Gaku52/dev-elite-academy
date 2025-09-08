# A5M2 Supabase接続チェックリスト

## ✅ 接続前の確認事項

### Supabaseダッシュボードでの確認
- [ ] Supabaseにログインできる
- [ ] プロジェクトが存在する
- [ ] Settings → Database にアクセスできる
- [ ] Connection stringが表示される

### 必要情報の収集
- [ ] **Host名**: `db.xxxxxxxxxx.supabase.co` の形式
- [ ] **Port番号**: `5432`（Direct）または `6543`（Pooled）
- [ ] **Database名**: `postgres`
- [ ] **User名**: `postgres`
- [ ] **Password**: データベースパスワードを把握している

## ✅ A5M2での設定

### 基本設定
- [ ] A5M2を起動
- [ ] データベースの追加と削除を選択
- [ ] PostgreSQLを選択
- [ ] ホスト名を正しく入力（db.で始まる）
- [ ] ポート番号: 5432を入力
- [ ] データベース名: postgresを入力
- [ ] ユーザーID: postgresを入力
- [ ] パスワードを入力

### SSL設定（最重要）
- [ ] **詳細設定タブ**を開く
- [ ] **接続パラメータ**欄に `sslmode=require` を追加
- [ ] またはSSL接続のチェックボックスをON

## ✅ トラブルシューティング

### 接続できない場合の確認
1. **パスワードエラーの場合**
   - [ ] パスワードに特殊文字が含まれている場合は正しくエスケープされているか
   - [ ] Supabaseでパスワードをリセットしてみる

2. **SSL関連エラーの場合**
   - [ ] sslmode=requireが設定されているか
   - [ ] ポート番号が正しいか（5432）

3. **タイムアウトの場合**
   - [ ] インターネット接続を確認
   - [ ] 会社のファイアウォールでブロックされていないか
   - [ ] VPNを使用している場合は一時的に切断してテスト

4. **接続数上限エラーの場合**
   - [ ] ポート6543（Connection Pooling）を試す
   - [ ] 他のツールでの接続を切断する

## 🔄 代替接続方法

A5M2でうまくいかない場合の代替案：

### 1. pgAdmin 4を使用
- 公式PostgreSQLクライアント
- SSL接続のサポートが充実
- [ダウンロード](https://www.pgadmin.org/download/)

### 2. DBeaver
- 無料の汎用データベースクライアント  
- SSL自動設定機能あり
- [ダウンロード](https://dbeaver.io/download/)

### 3. TablePlus
- シンプルで使いやすいUI
- SSL接続対応
- [ダウンロード](https://tableplus.com/)

## 📝 接続成功後の確認

```sql
-- 1. 接続確認
SELECT current_database(), current_user;

-- 2. テーブル一覧取得
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 3. バージョン確認
SELECT version();
```

## 🆘 それでも接続できない場合

1. **Supabaseのステータス確認**
   - https://status.supabase.com/

2. **接続情報の再確認**
   - Supabaseダッシュボード → Settings → Database
   - Connection stringをコピーして分解

3. **別のツールで試す**
   - psqlコマンドラインツール
   - VSCode SQLTools拡張機能

4. **サポートへの問い合わせ情報収集**
   - エラーメッセージの全文
   - 使用しているA5M2のバージョン
   - OS情報（Windows 10/11など）
   - ネットワーク環境（自宅/会社/VPN使用など）

---
このチェックリストを上から順番に確認してください。
特に**SSL設定**は必須なので、必ず設定してください。