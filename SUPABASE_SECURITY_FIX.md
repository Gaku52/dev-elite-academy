# Supabase セキュリティ改善ガイド

## 🚨 発見されたセキュリティ問題（10個のエラー）

Supabase Security Advisorから以下の警告が報告されています：

### 1. RLSポリシーの問題
- **問題**: `USING (true)` を使用した全アクセス許可ポリシー
- **影響**: 認証されていないユーザーを含む全ユーザーがデータにアクセス可能
- **該当ファイル**: `supabase/migrations/002_user_progress.sql`

### 2. テーブル間のRLS設定不整合
- 一部のテーブルで適切なRLSが設定されているが、他のテーブルでは不適切

## 🔧 修正手順

### ステップ1: Supabaseダッシュボードでの確認
1. [Supabase Dashboard](https://app.supabase.com)にログイン
2. プロジェクト「dev-elite-academy-db」を選択
3. 左メニューから「Database」→「Security Advisor」へ移動
4. 表示される10個の警告を確認

### ステップ2: RLSポリシーの修正

#### A. 危険なポリシーの削除と再作成

```sql
-- 1. 危険な全許可ポリシーを削除
DROP POLICY IF EXISTS "Allow all access to user_progress" ON user_progress;
DROP POLICY IF EXISTS "Allow all access to section_progress" ON section_progress;
DROP POLICY IF EXISTS "Allow all access to learning_notes" ON learning_notes;
DROP POLICY IF EXISTS "Allow all access to quiz_results" ON quiz_results;
DROP POLICY IF EXISTS "Allow all access to learning_sessions" ON learning_sessions;

-- 2. 適切なRLSポリシーを作成
-- user_progressテーブル
CREATE POLICY "Users can view own progress" 
ON user_progress FOR SELECT 
USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can update own progress" 
ON user_progress FOR UPDATE 
USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can insert own progress" 
ON user_progress FOR INSERT 
WITH CHECK (auth.jwt() ->> 'email' = user_email);

-- section_progressテーブル
CREATE POLICY "Users can view own section progress" 
ON section_progress FOR SELECT 
USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can update own section progress" 
ON section_progress FOR UPDATE 
USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can insert own section progress" 
ON section_progress FOR INSERT 
WITH CHECK (auth.jwt() ->> 'email' = user_email);

-- learning_notesテーブル
CREATE POLICY "Users can view own notes" 
ON learning_notes FOR SELECT 
USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can update own notes" 
ON learning_notes FOR UPDATE 
USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can insert own notes" 
ON learning_notes FOR INSERT 
WITH CHECK (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can delete own notes" 
ON learning_notes FOR DELETE 
USING (auth.jwt() ->> 'email' = user_email);

-- quiz_resultsテーブル
CREATE POLICY "Users can view own quiz results" 
ON quiz_results FOR SELECT 
USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can insert own quiz results" 
ON quiz_results FOR INSERT 
WITH CHECK (auth.jwt() ->> 'email' = user_email);

-- learning_sessionsテーブル
CREATE POLICY "Users can view own sessions" 
ON learning_sessions FOR SELECT 
USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can insert own sessions" 
ON learning_sessions FOR INSERT 
WITH CHECK (auth.jwt() ->> 'email' = user_email);
```

### ステップ3: その他のセキュリティ設定

#### A. APIキーの管理
1. `.env`ファイルを確認し、以下のキーが適切に設定されているか確認：
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: 公開用（制限付き）
   - `SUPABASE_SERVICE_ROLE_KEY`: サーバーサイドのみ（絶対に公開しない）

#### B. 環境変数のセキュリティ
```bash
# .env.localに移動すべき機密情報
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=your-database-url

# .envに残すべき公開情報
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### ステップ4: テーブルごとのRLS確認

以下のSQLを実行して、全テーブルのRLS状態を確認：

```sql
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM 
    pg_tables
WHERE 
    schemaname = 'public'
ORDER BY 
    tablename;
```

### ステップ5: ポリシーの動作確認

```sql
-- 現在のユーザーとして動作確認
SELECT * FROM user_progress;
-- 自分のデータのみ表示されることを確認

-- 他のユーザーのデータにアクセスできないことを確認
SELECT * FROM user_progress WHERE user_email != (auth.jwt() ->> 'email');
-- 結果が0件であることを確認
```

## 🛡️ セキュリティベストプラクティス

### 1. RLSポリシーの原則
- ✅ 最小権限の原則を適用
- ✅ ユーザーは自分のデータのみアクセス可能に
- ✅ `USING (true)`は絶対に使用しない
- ✅ サービスロールキーは本番環境でのみ使用

### 2. 定期的な監査
- 週次でSecurity Advisorを確認
- RLSポリシーの定期的なレビュー
- APIキーのローテーション（3ヶ月ごと）

### 3. 開発環境のセキュリティ
- `.env.local`を`.gitignore`に追加
- 本番環境の認証情報は環境変数で管理
- ローカル開発では別のSupabaseプロジェクトを使用

## 📊 修正後の確認

修正完了後、以下を確認：

1. Supabase Dashboard → Security Advisorで警告が0になっているか
2. アプリケーションが正常に動作するか
3. 適切なユーザーのみがデータにアクセスできるか

## 🆘 サポート

問題が解決しない場合：
1. [Supabase Support](https://supabase.com/support)に連絡
2. [GitHub Issues](https://github.com/supabase/supabase/issues)で報告
3. [Supabase Discord](https://discord.supabase.com)でコミュニティに相談

## 次のアクション

1. **即座に実行**: 上記のSQLスクリプトをSupabase SQL Editorで実行
2. **確認**: Security Advisorで警告が解消されたか確認
3. **テスト**: アプリケーションの動作確認
4. **監視**: 週次でSecurity Advisorをチェック