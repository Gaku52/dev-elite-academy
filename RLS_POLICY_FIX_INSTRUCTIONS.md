# RLSポリシー修正手順

## 🎯 目的
`user_progress`テーブルの進捗保存・更新が正常に動作するように、RLSポリシーとAPIを修正します。

## 📋 修正内容の概要

### 1. 問題点
- **RLSポリシーの問題**: `user_progress`テーブルのINSERT/UPDATE権限が適切に設定されていない
- **API実装の問題**: 現在のAPIが`user_email`を使用しているが、実際のテーブルは`user_id`（UUID）を使用
- **認証の問題**: 認証ユーザーのみが進捗を保存できるようにする必要がある

### 2. 修正内容
- RLSポリシーの修正（SQLスクリプト作成済み）
- 新しい進捗更新APIの作成（`user_id`ベースに変更）
- 認証チェックの追加

## 🚀 実行手順

### Step 1: Supabaseダッシュボードでの作業

1. [Supabase Dashboard](https://app.supabase.com)にログイン
2. 該当プロジェクトを選択
3. 左メニューから「SQL Editor」を選択

### Step 2: RLSポリシーの確認と修正

1. SQL Editorで以下のファイルの内容を実行：
   ```sql
   -- ファイル: sql/check_and_fix_user_progress_rls.sql
   ```

2. 実行手順：
   - まず、セクション1（現在の状態確認）を実行して現状を確認
   - 問題がある場合は、セクション2〜7を順番に実行
   - 最後にセクション9（確認クエリ）を実行して修正が適用されたことを確認

### Step 3: APIの更新

新しいAPIエンドポイントが作成されました：
- **パス**: `/api/progress/update`
- **特徴**:
  - `user_id`（UUID）を使用
  - 認証チェック付き
  - ゲストユーザーのフォールバック対応

### Step 4: フロントエンドの更新が必要な箇所

以下のファイルでAPIエンドポイントを更新する必要があります：

1. 学習コンテンツページで進捗を保存する部分
2. ダッシュボードで進捗を表示する部分

**旧API呼び出し例**:
```javascript
fetch('/api/progress', {
  method: 'POST',
  body: JSON.stringify({
    userEmail: email,
    contentId: id,
    status: 'completed'
  })
})
```

**新API呼び出し例**:
```javascript
fetch('/api/progress/update', {
  method: 'POST',
  body: JSON.stringify({
    contentId: id,
    status: 'COMPLETED',
    score: 100,
    timeSpent: 30
  })
})
```

## 🧪 動作確認

### 1. RLSポリシーの確認
SQL Editorで以下を実行：
```sql
-- 現在のユーザーIDを確認
SELECT auth.uid() as current_user_id;

-- ポリシーが適用されているか確認
SELECT * FROM pg_policies 
WHERE tablename = 'user_progress';
```

### 2. APIの動作確認
以下の操作をテスト：
1. ログイン状態で進捗を保存
2. 保存した進捗が表示されるか確認
3. 進捗を更新（完了にする）
4. ログアウト状態でのゲストユーザー処理

## ⚠️ 注意事項

1. **本番環境での実行前に**:
   - ステージング環境でテスト
   - 現在のポリシーをバックアップ
   - メンテナンス時間中に実行

2. **ロールバック手順**:
   - 元のポリシーに戻す場合は、修正前の状態を記録しておく
   - APIは旧バージョンが残っているので切り戻し可能

## 📊 期待される効果

- ✅ 認証ユーザーが進捗を正常に保存・更新できる
- ✅ 「完了にする」ボタンが正常に動作
- ✅ ページリロード後も進捗が維持される
- ✅ セキュリティが向上（認証ユーザーのみアクセス可能）

## 🔧 トラブルシューティング

### 問題: 進捗が保存されない
- RLSポリシーが正しく適用されているか確認
- ブラウザの開発者ツールでAPIレスポンスを確認
- Supabaseのログを確認

### 問題: 権限エラーが発生
- ユーザーが正しく認証されているか確認
- `auth.uid()`が正しい値を返しているか確認
- RLSポリシーの条件を再確認