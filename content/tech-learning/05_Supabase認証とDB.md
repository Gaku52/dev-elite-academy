# 05_Supabase認証とDB

**学習時間目安: 3-4時間**

## 目次
1. [Supabaseとは](#1-supabaseとは)
2. [認証システム](#2-認証システム)
3. [PostgreSQLデータベース基礎](#3-postgresqlデータベース基礎)
4. [Prisma ORM統合](#4-prisma-orm統合)
5. [Row Level Security (RLS)](#5-row-level-security-rls)
6. [リアルタイム購読](#6-リアルタイム購読)
7. [ストレージ](#7-ストレージ)
8. [実践例：Dev Elite Academyから](#8-実践例dev-elite-academyから)
9. [理解度チェック](#9-理解度チェック)

---

## 1. Supabaseとは

### 1.1 概要
Supabaseは「オープンソースのFirebase代替」として知られる、バックエンドサービス（BaaS: Backend as a Service）です。

**主な機能:**
- PostgreSQLデータベース
- 認証・認可システム
- リアルタイムデータ購読
- ファイルストレージ
- サーバーレスファンクション（Edge Functions）
- 自動生成されるREST API

### 1.2 なぜSupabaseを使うのか

**メリット:**
```
✅ フルスタックバックエンドが数分で構築可能
✅ PostgreSQL（SQLデータベース）の強力さ
✅ リアルタイム機能が標準搭載
✅ 認証システムが既に実装済み
✅ セキュリティ（RLS）が組み込まれている
✅ オープンソースで透明性が高い
✅ 無料プランで開発可能
```

**Firebase との比較:**
| 機能 | Supabase | Firebase |
|------|----------|----------|
| データベース | PostgreSQL (SQL) | Firestore (NoSQL) |
| クエリ | SQL | 専用クエリ言語 |
| オープンソース | Yes | No |
| セルフホスト可能 | Yes | No |
| リアルタイム | Yes | Yes |
| 価格 | 比較的安価 | 高額になりがち |

### 1.3 アーキテクチャ

```
┌─────────────────────────────────────────────┐
│         クライアントアプリケーション          │
│     (Next.js / React / Vue / etc.)         │
└────────────────┬────────────────────────────┘
                 │
                 │ Supabase Client SDK
                 │
┌────────────────▼────────────────────────────┐
│         Supabase API Layer                  │
│  (REST API / GraphQL / Realtime WebSocket)  │
└─────────────────┬───────────────────────────┘
                  │
        ┌─────────┼─────────┐
        │         │         │
┌───────▼──┐ ┌───▼───┐ ┌──▼─────┐
│PostgreSQL│ │ Auth  │ │Storage │
│    DB    │ │Service│ │        │
└──────────┘ └───────┘ └────────┘
```

---

## 2. 認証システム

### 2.1 Supabase Authの仕組み

Supabaseは複数の認証方法をサポートしています：

1. **Email & Password** - 伝統的な認証
2. **OAuth** - Google, GitHub, Twitter等のソーシャルログイン
3. **Magic Links** - パスワード不要のメールリンク認証
4. **Phone/SMS** - 電話番号認証
5. **Anonymous** - 匿名ユーザー

### 2.2 Email & Password認証

#### セットアップ

**環境変数設定 (.env.local):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
```

#### 実装例：Supabaseクライアント作成

**ファイル: `C:\Users\ganke\dev-elite-academy\src\lib\supabase.ts`**

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Supabaseクライアントの作成
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: true,      // セッションをローカルストレージに保存
      autoRefreshToken: true,    // トークンの自動更新
      detectSessionInUrl: true   // URLからセッション情報を検出
    }
  }
);

// 認証関連の関数
export const auth = {
  // ユーザー登録
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  },

  // ログイン
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // ログアウト
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // パスワードリセット
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  },

  // 現在のユーザー取得
  async getUser() {
    const { data, error } = await supabase.auth.getUser();
    return { data, error };
  }
};
```

#### コンポーネントでの使用例

```typescript
'use client';

import { useState } from 'react';
import { auth } from '@/lib/supabase';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await auth.signIn(email, password);

    if (error) {
      alert(`ログインエラー: ${error.message}`);
    } else {
      alert('ログイン成功！');
      // リダイレクト処理など
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? '処理中...' : 'ログイン'}
      </button>
    </form>
  );
}
```

### 2.3 OAuth認証（Google, GitHub等）

#### Supabaseダッシュボードでの設定

1. Supabaseダッシュボード → Authentication → Providers
2. 使用したいプロバイダー（Google, GitHub等）を有効化
3. OAuth credentials（Client ID, Secret）を設定

#### コード実装

```typescript
// Google認証
const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
};

// GitHub認証
const signInWithGitHub = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
};
```

#### コールバック処理（Next.js App Router）

**ファイル: `app/auth/callback/route.ts`**

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }

  // ログイン後のリダイレクト先
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
```

### 2.4 Magic Links（パスワードレス認証）

Magic Linksは、ユーザーがメールアドレスを入力するだけで、届いたリンクをクリックすればログインできる便利な認証方法です。

```typescript
const signInWithMagicLink = async (email: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    }
  });

  if (error) {
    console.error('Magic linkエラー:', error);
  } else {
    alert('メールを確認してください！');
  }
};
```

### 2.5 セッション管理

```typescript
// セッション取得
const { data: { session } } = await supabase.auth.getSession();

// セッション変更を監視
supabase.auth.onAuthStateChange((event, session) => {
  console.log('認証状態変更:', event); // SIGNED_IN, SIGNED_OUT等
  console.log('現在のセッション:', session);

  if (event === 'SIGNED_IN') {
    console.log('ユーザーがログインしました');
  }

  if (event === 'SIGNED_OUT') {
    console.log('ユーザーがログアウトしました');
  }
});
```

---

## 3. PostgreSQLデータベース基礎

### 3.1 PostgreSQLとは

PostgreSQLは世界で最も先進的なオープンソースのリレーショナルデータベース管理システム（RDBMS）です。

**特徴:**
- ACID準拠（トランザクションの信頼性）
- 複雑なクエリに対応
- JSON型のサポート
- 拡張性が高い
- 大規模データに強い

### 3.2 基本的なSQL操作

#### テーブル作成

**Dev Elite Academyの実例: `supabase/migrations/002_user_progress.sql`**

```sql
-- ユーザー進捗管理テーブル
CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  user_email TEXT NOT NULL,
  content_id INTEGER REFERENCES learning_contents(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed'))
    DEFAULT 'not_started',
  progress_percentage INTEGER DEFAULT 0
    CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_email, content_id)
);

-- セクション別進捗
CREATE TABLE IF NOT EXISTS section_progress (
  id SERIAL PRIMARY KEY,
  user_email TEXT NOT NULL,
  content_id INTEGER REFERENCES learning_contents(id) ON DELETE CASCADE,
  section_type TEXT CHECK (section_type IN ('video', 'reading', 'code', 'quiz')),
  section_number INTEGER NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_email, content_id, section_type, section_number)
);
```

**重要な概念:**

1. **PRIMARY KEY**: 各行を一意に識別するID
2. **SERIAL**: 自動増分する整数型
3. **REFERENCES**: 外部キー制約（他のテーブルとの関連）
4. **ON DELETE CASCADE**: 参照元が削除されたら、この行も削除
5. **CHECK**: データの検証制約
6. **UNIQUE**: 一意制約（重複禁止）
7. **TIMESTAMP WITH TIME ZONE**: タイムゾーン付き日時

#### インデックス作成

```sql
-- インデックス作成（検索パフォーマンス向上）
CREATE INDEX idx_user_progress_email ON user_progress(user_email);
CREATE INDEX idx_user_progress_content ON user_progress(content_id);
CREATE INDEX idx_user_progress_status ON user_progress(status);
```

**インデックスの目的:**
- 検索速度の向上
- WHERE句でよく使うカラムに作成
- JOIN条件に使うカラムに作成

### 3.3 Supabase JavaScriptクライアントでのデータ操作

#### データ取得 (SELECT)

```typescript
// 全データ取得
const { data, error } = await supabase
  .from('user_progress')
  .select('*');

// 条件付き取得
const { data, error } = await supabase
  .from('user_progress')
  .select('*')
  .eq('user_email', 'user@example.com')  // WHERE user_email = 'user@example.com'
  .eq('status', 'completed');

// 関連データも取得（JOIN）
const { data, error } = await supabase
  .from('user_progress')
  .select(`
    *,
    learning_contents (
      id,
      title,
      description
    )
  `)
  .eq('user_email', 'user@example.com');

// ソート
const { data, error } = await supabase
  .from('user_progress')
  .select('*')
  .order('created_at', { ascending: false });

// ページネーション
const { data, error } = await supabase
  .from('user_progress')
  .select('*')
  .range(0, 9);  // 最初の10件
```

#### データ挿入 (INSERT)

```typescript
const { data, error } = await supabase
  .from('user_progress')
  .insert([
    {
      user_email: 'user@example.com',
      content_id: 1,
      status: 'in_progress',
      progress_percentage: 25
    }
  ])
  .select();  // 挿入されたデータを返す
```

#### データ更新 (UPDATE)

```typescript
const { data, error } = await supabase
  .from('user_progress')
  .update({
    status: 'completed',
    progress_percentage: 100,
    completed_at: new Date().toISOString()
  })
  .eq('id', 123)
  .select();
```

#### データ削除 (DELETE)

```typescript
const { error } = await supabase
  .from('user_progress')
  .delete()
  .eq('id', 123);
```

#### Upsert（存在すれば更新、なければ挿入）

```typescript
const { data, error } = await supabase
  .from('user_progress')
  .upsert({
    user_email: 'user@example.com',
    content_id: 1,
    status: 'in_progress',
    progress_percentage: 50
  }, {
    onConflict: 'user_email,content_id'  // UNIQUE制約のカラムを指定
  })
  .select();
```

---

## 4. Prisma ORM統合

### 4.1 Prisma ORMとは

Prisma は次世代のTypeScript ORM（Object-Relational Mapping）ツールです。

**特徴:**
- 型安全なデータベースアクセス
- 自動生成されるTypeScript型定義
- マイグレーション管理
- 直感的なクエリAPI
- パフォーマンス最適化

### 4.2 PrismaとSupabaseの統合

#### インストール

```bash
npm install prisma @prisma/client
npx prisma init
```

#### Prisma Schema設定

**ファイル: `prisma/schema.prisma`**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model UserProgress {
  id                  Int       @id @default(autoincrement())
  userEmail           String    @map("user_email")
  contentId           Int       @map("content_id")
  status              String    @default("not_started")
  progressPercentage  Int       @default(0) @map("progress_percentage")
  startedAt           DateTime  @default(now()) @map("started_at")
  completedAt         DateTime? @map("completed_at")
  lastAccessedAt      DateTime  @default(now()) @map("last_accessed_at")
  createdAt           DateTime  @default(now()) @map("created_at")
  updatedAt           DateTime  @updatedAt @map("updated_at")

  learningContent     LearningContent @relation(fields: [contentId], references: [id])

  @@unique([userEmail, contentId])
  @@index([userEmail])
  @@index([contentId])
  @@index([status])
  @@map("user_progress")
}

model LearningContent {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  createdAt   DateTime @default(now()) @map("created_at")

  userProgress UserProgress[]

  @@map("learning_contents")
}
```

#### 環境変数設定

```bash
# Supabaseの接続URL（直接接続）
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# または、接続プーリング用URL
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

#### マイグレーション実行

```bash
# Prisma Schemaからマイグレーションファイルを生成
npx prisma migrate dev --name init

# 本番環境へのマイグレーション適用
npx prisma migrate deploy

# Prisma Clientの再生成
npx prisma generate
```

#### Prismaクライアントの使用

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// データ取得（型安全）
const userProgress = await prisma.userProgress.findMany({
  where: {
    userEmail: 'user@example.com',
    status: 'completed'
  },
  include: {
    learningContent: true  // リレーションも取得
  },
  orderBy: {
    createdAt: 'desc'
  }
});

// データ挿入
const newProgress = await prisma.userProgress.create({
  data: {
    userEmail: 'user@example.com',
    contentId: 1,
    status: 'in_progress',
    progressPercentage: 25
  }
});

// データ更新
const updatedProgress = await prisma.userProgress.update({
  where: {
    id: 123
  },
  data: {
    status: 'completed',
    progressPercentage: 100,
    completedAt: new Date()
  }
});

// Upsert
const progress = await prisma.userProgress.upsert({
  where: {
    userEmail_contentId: {
      userEmail: 'user@example.com',
      contentId: 1
    }
  },
  update: {
    progressPercentage: 75
  },
  create: {
    userEmail: 'user@example.com',
    contentId: 1,
    status: 'in_progress',
    progressPercentage: 75
  }
});
```

### 4.3 Prisma vs Supabase Client

| 項目 | Prisma | Supabase Client |
|------|--------|-----------------|
| 型安全性 | 完全な型安全 | 部分的 |
| リアルタイム | 非対応 | 対応 |
| 認証連携 | 手動実装 | 自動統合 |
| マイグレーション | 強力 | SQL直接 |
| 学習曲線 | 中程度 | 緩やか |
| パフォーマンス | 最適化可能 | 良好 |

**推奨:**
- **フロントエンド**: Supabase Client（リアルタイム、認証統合）
- **バックエンドAPI**: Prisma（型安全、複雑なクエリ）

---

## 5. Row Level Security (RLS)

### 5.1 RLSとは

Row Level Security（行レベルセキュリティ）は、PostgreSQLの機能で、**各行に対してアクセス制御**を行います。

**従来のセキュリティ:**
```
アプリケーションコード側でチェック
↓
if (user.id !== data.userId) {
  throw new Error('権限がありません');
}
```

**RLSのセキュリティ:**
```
データベース側で自動チェック
↓
SELECT * FROM user_progress
WHERE user_id = auth.uid();  // 自動的に適用される
```

### 5.2 RLSの有効化

**Dev Elite Academyの実例: `supabase/migrations/003_create_user_learning_progress.sql`**

```sql
-- RLSを有効化
ALTER TABLE user_learning_progress ENABLE ROW LEVEL SECURITY;

-- ポリシー: ユーザーは自分のデータのみ閲覧可能
CREATE POLICY "Users can view own learning progress"
ON user_learning_progress
FOR SELECT
USING (user_id::text = auth.uid()::text);

-- ポリシー: ユーザーは自分のデータのみ挿入可能
CREATE POLICY "Users can insert own learning progress"
ON user_learning_progress
FOR INSERT
WITH CHECK (user_id::text = auth.uid()::text);

-- ポリシー: ユーザーは自分のデータのみ更新可能
CREATE POLICY "Users can update own learning progress"
ON user_learning_progress
FOR UPDATE
USING (user_id::text = auth.uid()::text);
```

### 5.3 RLSポリシーの詳細

#### auth.uid()とは

Supabaseの特別な関数で、**現在ログイン中のユーザーのID**を返します。

```sql
-- 現在のユーザーIDを取得
SELECT auth.uid();

-- 現在のユーザーのメールアドレス取得
SELECT auth.email();
```

#### ポリシーの種類

```sql
-- SELECT用ポリシー（読み取り）
CREATE POLICY "policy_name" ON table_name
FOR SELECT
USING (condition);  -- この条件が真の行のみ取得可能

-- INSERT用ポリシー（挿入）
CREATE POLICY "policy_name" ON table_name
FOR INSERT
WITH CHECK (condition);  -- この条件が真の場合のみ挿入可能

-- UPDATE用ポリシー（更新）
CREATE POLICY "policy_name" ON table_name
FOR UPDATE
USING (condition)  -- 更新対象の選択条件
WITH CHECK (condition);  -- 更新後のデータの検証条件

-- DELETE用ポリシー（削除）
CREATE POLICY "policy_name" ON table_name
FOR DELETE
USING (condition);  -- この条件が真の行のみ削除可能

-- 全操作用ポリシー
CREATE POLICY "policy_name" ON table_name
FOR ALL
USING (condition);
```

### 5.4 実践的なRLSポリシー例

#### 例1: 公開データと非公開データ

```sql
-- 記事テーブル
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  author_id UUID REFERENCES auth.users(id),
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- 公開記事は誰でも閲覧可能
CREATE POLICY "Public articles are viewable by everyone"
ON articles
FOR SELECT
USING (is_published = true);

-- 自分の記事（公開/非公開問わず）は閲覧可能
CREATE POLICY "Authors can view own articles"
ON articles
FOR SELECT
USING (auth.uid() = author_id);

-- 自分の記事のみ更新可能
CREATE POLICY "Authors can update own articles"
ON articles
FOR UPDATE
USING (auth.uid() = author_id);
```

#### 例2: ロールベースアクセス制御

```sql
-- ユーザーテーブル
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role TEXT CHECK (role IN ('admin', 'moderator', 'user')),
  email TEXT NOT NULL
);

-- 投稿テーブル
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 全員が閲覧可能
CREATE POLICY "Anyone can view posts"
ON posts
FOR SELECT
USING (true);

-- 自分の投稿は削除可能
CREATE POLICY "Users can delete own posts"
ON posts
FOR DELETE
USING (auth.uid() = user_id);

-- 管理者は全ての投稿を削除可能
CREATE POLICY "Admins can delete any posts"
ON posts
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.role = 'admin'
  )
);
```

### 5.5 RLSのテスト

```typescript
// ログイン前（認証なし）
const { data, error } = await supabase
  .from('user_learning_progress')
  .select('*');
// エラー: RLSポリシーにより、データが返されない

// ログイン後
await supabase.auth.signIn({ email, password });

const { data, error } = await supabase
  .from('user_learning_progress')
  .select('*');
// 成功: 自分のデータのみ取得
```

---

## 6. リアルタイム購読

### 6.1 Supabase Realtimeとは

Supabase Realtimeは、データベースの変更をリアルタイムで購読（Subscribe）できる機能です。

**使用例:**
- チャットアプリケーション（新しいメッセージを即座に表示）
- コラボレーションツール（他のユーザーの編集をリアルタイム反映）
- ダッシュボード（データの自動更新）
- 通知システム

### 6.2 リアルタイム購読の設定

#### Supabaseダッシュボードでの有効化

1. Database → Replication
2. 購読したいテーブルを選択
3. "Enable Realtime" をオンにする

#### コード実装

```typescript
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export default function RealtimeComponent() {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    // 初期データ取得
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (data) setMessages(data);
    };

    fetchMessages();

    // リアルタイム購読
    const subscription = supabase
      .channel('messages-channel')  // チャンネル名（任意）
      .on(
        'postgres_changes',
        {
          event: '*',  // INSERT, UPDATE, DELETE, or *（全て）
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          console.log('データベース変更:', payload);

          // INSERT時
          if (payload.eventType === 'INSERT') {
            setMessages((prev) => [...prev, payload.new]);
          }

          // UPDATE時
          if (payload.eventType === 'UPDATE') {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === payload.new.id ? payload.new : msg
              )
            );
          }

          // DELETE時
          if (payload.eventType === 'DELETE') {
            setMessages((prev) =>
              prev.filter((msg) => msg.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    // クリーンアップ
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>{msg.content}</div>
      ))}
    </div>
  );
}
```

### 6.3 フィルター付き購読

```typescript
// 特定のユーザーのデータのみ購読
const subscription = supabase
  .channel('user-progress-channel')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'user_progress',
      filter: `user_email=eq.user@example.com`  // フィルター条件
    },
    (payload) => {
      console.log('自分のデータが更新されました:', payload);
    }
  )
  .subscribe();
```

### 6.4 複数テーブルの購読

```typescript
const subscription = supabase
  .channel('multi-table-channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'user_progress' },
    (payload) => console.log('user_progress変更:', payload)
  )
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'section_progress' },
    (payload) => console.log('section_progress変更:', payload)
  )
  .subscribe();
```

### 6.5 Presence（オンライン状態の共有）

```typescript
// オンラインユーザーのトラッキング
const channel = supabase.channel('online-users');

// 自分の状態を送信
channel
  .on('presence', { event: 'sync' }, () => {
    const state = channel.presenceState();
    console.log('オンラインユーザー:', state);
  })
  .on('presence', { event: 'join' }, ({ key, newPresences }) => {
    console.log('ユーザーが参加:', newPresences);
  })
  .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
    console.log('ユーザーが退出:', leftPresences);
  })
  .subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await channel.track({
        user_id: 'user-123',
        online_at: new Date().toISOString()
      });
    }
  });
```

---

## 7. ストレージ

### 7.1 Supabase Storageとは

Supabase Storageは、画像、動画、ドキュメント等のファイルを保存・管理するサービスです。

**特徴:**
- S3互換API
- RLSによるアクセス制御
- 自動画像変換・リサイズ
- CDN配信
- 大容量ファイル対応

### 7.2 バケットの作成

#### Supabaseダッシュボード

1. Storage → Create bucket
2. バケット名を入力（例: "avatars"）
3. Public / Private を選択

#### コード

```typescript
// バケット作成（管理者権限が必要）
const { data, error } = await supabase
  .storage
  .createBucket('avatars', {
    public: false,  // publicならRLSなしで誰でもアクセス可能
    fileSizeLimit: 1024000  // 1MB制限
  });
```

### 7.3 ファイルのアップロード

```typescript
// ファイル選択
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

// アップロード
const { data, error } = await supabase
  .storage
  .from('avatars')  // バケット名
  .upload(`public/${user.id}/avatar.png`, file, {
    cacheControl: '3600',
    upsert: true  // 既存ファイルを上書き
  });

if (error) {
  console.error('アップロードエラー:', error);
} else {
  console.log('アップロード成功:', data);

  // 公開URLを取得
  const { data: publicUrlData } = supabase
    .storage
    .from('avatars')
    .getPublicUrl(`public/${user.id}/avatar.png`);

  console.log('画像URL:', publicUrlData.publicUrl);
}
```

### 7.4 ファイルの取得

```typescript
// ファイルリスト取得
const { data, error } = await supabase
  .storage
  .from('avatars')
  .list('public', {
    limit: 100,
    offset: 0,
    sortBy: { column: 'created_at', order: 'desc' }
  });

// ファイルダウンロード
const { data, error } = await supabase
  .storage
  .from('avatars')
  .download('public/user-123/avatar.png');

// ファイルをBlobとして取得
if (data) {
  const url = URL.createObjectURL(data);
  // imgタグのsrcに設定可能
}
```

### 7.5 ファイルの削除

```typescript
const { data, error } = await supabase
  .storage
  .from('avatars')
  .remove(['public/user-123/avatar.png']);
```

### 7.6 画像変換

Supabaseは自動的に画像をリサイズ・変換できます。

```typescript
// 公開URLに変換パラメータを追加
const { data } = supabase
  .storage
  .from('avatars')
  .getPublicUrl('public/user-123/avatar.png', {
    transform: {
      width: 200,
      height: 200,
      resize: 'cover',  // contain, cover, fill
      quality: 80  // 画質（1-100）
    }
  });

console.log('リサイズ画像URL:', data.publicUrl);
```

### 7.7 StorageのRLS

```sql
-- アバター用バケットのRLS
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- 自分のフォルダにのみアップロード可能
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 自分のファイルのみ削除可能
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## 8. 実践例：Dev Elite Academyから

### 8.1 プロジェクト構成

**ファイル: `C:\Users\ganke\dev-elite-academy\src\lib\supabase-admin.ts`**

```typescript
import { createClient } from '@supabase/supabase-js';

let adminClient: ReturnType<typeof createClient> | null = null;

/**
 * サーバーサイド操作用のSupabase管理者クライアントを取得
 * サービスキーを使用して、データベースへのフルアクセスを提供
 */
export function getSupabaseAdmin() {
  // 既に作成済みの場合は再利用
  if (adminClient) {
    return adminClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing required Supabase environment variables');
  }

  // サービスキーで管理者クライアント作成（RLSをバイパス）
  adminClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  return adminClient;
}

/**
 * サーバーサイド操作用のSupabaseクライアントを取得（anon key使用）
 * 管理者権限が不要な操作に使用
 */
export function getSupabaseServer() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing required Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
```

**使い分け:**
- `getSupabaseAdmin()`: RLSをバイパスする必要がある管理者操作
- `getSupabaseServer()`: 通常のサーバーサイド操作（RLS適用）

### 8.2 学習進捗の記録（実際のAPI実装）

**ファイル例: `src\app\api\learning\progress\route.ts`**

```typescript
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
  try {
    const { userId, moduleName, sectionKey, isCompleted, isCorrect } =
      await request.json();

    const supabase = getSupabaseAdmin();

    // Upsert: 存在すれば更新、なければ挿入
    const { data, error } = await supabase
      .from('user_learning_progress')
      .upsert({
        user_id: userId,
        module_name: moduleName,
        section_key: sectionKey,
        is_completed: isCompleted,
        is_correct: isCorrect,
        answer_count: 1,
        correct_count: isCorrect ? 1 : 0,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,module_name,section_key',
        // 既存レコードがある場合の更新処理
        ignoreDuplicates: false
      })
      .select();

    if (error) {
      console.error('進捗保存エラー:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API エラー:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const moduleName = searchParams.get('moduleName');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    let query = supabase
      .from('user_learning_progress')
      .select('*')
      .eq('user_id', userId);

    if (moduleName) {
      query = query.eq('module_name', moduleName);
    }

    const { data, error } = await query;

    if (error) {
      console.error('進捗取得エラー:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('API エラー:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 8.3 トリガーと関数

**ファイル: `supabase/migrations/002_user_progress.sql`**

```sql
-- 更新日時自動更新用の関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- トリガー: user_progressテーブルが更新されたら自動的にupdated_atを更新
CREATE TRIGGER update_user_progress_updated_at
BEFORE UPDATE ON user_progress
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

**トリガーの仕組み:**
1. `BEFORE UPDATE`: データ更新の直前に実行
2. `FOR EACH ROW`: 各行ごとに実行
3. `NEW.updated_at = NOW()`: 新しい値のupdated_atを現在時刻に設定

### 8.4 ビューの作成

```sql
-- 学習統計を計算するビュー
CREATE OR REPLACE VIEW learning_stats AS
SELECT
  user_id,
  module_name,
  COUNT(*) as total_questions,
  COUNT(CASE WHEN is_completed = true THEN 1 END) as completed_questions,
  CASE
    WHEN COUNT(CASE WHEN is_completed = true THEN 1 END) > 0 THEN
      ROUND(
        (COUNT(CASE WHEN is_correct = true THEN 1 END)::DECIMAL /
         COUNT(CASE WHEN is_completed = true THEN 1 END)::DECIMAL) * 100,
        2
      )
    ELSE 0
  END as correct_rate
FROM user_learning_progress
WHERE is_completed = true
GROUP BY user_id, module_name;
```

**ビューの使用:**

```typescript
// ビューから統計データを取得
const { data, error } = await supabase
  .from('learning_stats')
  .select('*')
  .eq('user_id', userId);
```

---

## 9. 理解度チェック

### 9.1 基礎問題

**Q1:** Supabaseの主な機能を3つ挙げてください。

**Q2:** 環境変数 `NEXT_PUBLIC_SUPABASE_ANON_KEY` と `SUPABASE_SERVICE_KEY` の違いは何ですか？

**Q3:** Row Level Security (RLS) の目的は何ですか？

**Q4:** 以下のコードで取得できるデータは何ですか？
```typescript
const { data, error } = await supabase
  .from('user_progress')
  .select('*')
  .eq('status', 'completed')
  .order('created_at', { ascending: false })
  .limit(10);
```

**Q5:** Upsertとは何ですか？通常のInsertとの違いを説明してください。

### 9.2 実践問題

**Q6:** 以下の要件を満たすテーブルを作成するSQLを書いてください：
- テーブル名: `tasks`
- カラム:
  - id (自動増分、主キー)
  - user_id (UUID、auth.usersテーブルを参照)
  - title (テキスト、必須)
  - is_completed (真偽値、デフォルト: false)
  - created_at (タイムスタンプ)

**Q7:** Q6で作成したテーブルに、以下のRLSポリシーを追加してください：
- ユーザーは自分のタスクのみ閲覧可能
- ユーザーは自分のタスクのみ作成可能
- ユーザーは自分のタスクのみ更新可能
- ユーザーは自分のタスクのみ削除可能

**Q8:** リアルタイムで新しいタスクが追加されたときに画面を更新するReactコンポーネントを書いてください。

**Q9:** 画像アップロード機能を実装してください（バケット名: `user-uploads`）。アップロード後に公開URLを取得し、画面に表示してください。

**Q10:** 以下のデータベース操作を行うNext.js API Routeを実装してください：
- エンドポイント: `/api/tasks`
- GET: 現在のユーザーのタスク一覧を取得
- POST: 新しいタスクを作成
- 認証チェックも含める

### 9.3 応用問題

**Q11:** Dev Elite Academyの `user_learning_progress` テーブルで、「各モジュールの完了率」を計算するSQLクエリを書いてください。

**Q12:** 複数のユーザーが同時に同じレコードを更新しようとした場合、どのような問題が起こり得ますか？それを防ぐ方法を説明してください。

**Q13:** Supabase Functionsを使って、毎日0時に学習統計をメール送信する仕組みを設計してください（コードは不要、設計のみ）。

**Q14:** 100万行以上のデータがある `user_progress` テーブルで、特定ユーザーの進捗を高速に取得するために必要な最適化を3つ挙げてください。

**Q15:** 以下のシナリオで適切なセキュリティ設計を説明してください：
- ユーザーAとユーザーBが共同で1つのプロジェクトを編集できる
- プロジェクトの作成者のみが削除できる
- 公開プロジェクトは誰でも閲覧可能
- 非公開プロジェクトは関係者のみ閲覧可能

### 9.4 友達に説明できるかチェック

以下の項目を、技術知識のない友達に説明できますか？

- [ ] Supabaseが何のサービスか
- [ ] なぜSupabaseを使うと開発が早くなるのか
- [ ] データベースに保存されているデータがどう守られているか
- [ ] リアルタイム更新の仕組み
- [ ] 認証（ログイン）がどう動いているか

### 9.5 技術面接準備

以下の質問に自信を持って答えられますか？

- [ ] SupabaseとFirebaseの違いを説明できる
- [ ] RLSの重要性とセキュリティ上のメリットを説明できる
- [ ] Supabase ClientとPrismaの使い分けを説明できる
- [ ] リアルタイム購読のパフォーマンス上の注意点を説明できる
- [ ] N+1問題を説明し、Supabaseでの解決策を提示できる
- [ ] トランザクションの必要性を説明できる
- [ ] インデックスの役割とパフォーマンスへの影響を説明できる

---

## 参考リソース

### 公式ドキュメント
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs)

### 学習リソース
- [Supabase YouTube Channel](https://www.youtube.com/c/Supabase)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [SQL Bolt - Interactive SQL Tutorial](https://sqlbolt.com/)

### コミュニティ
- [Supabase Discord](https://discord.supabase.com/)
- [Supabase GitHub](https://github.com/supabase/supabase)

---

## まとめ

このドキュメントでは、Supabaseの主要機能を学習しました：

1. **Supabase基礎**: BaaSとしての役割と利点
2. **認証**: Email/OAuth/Magic Linksを使った認証実装
3. **PostgreSQL**: SQLデータベースの基本操作
4. **Prisma ORM**: 型安全なデータベースアクセス
5. **RLS**: 行レベルのセキュリティ制御
6. **リアルタイム**: データベース変更の購読
7. **ストレージ**: ファイル管理とアクセス制御
8. **実践**: Dev Elite Academyの実装例

次のステップとして、実際にプロジェクトを作成し、これらの機能を実装してみましょう！
