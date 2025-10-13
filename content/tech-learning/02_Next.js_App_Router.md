# 02. Next.js 15 App Router - モダンなフルスタックフレームワーク

## 🎯 この章の学習目標

- Next.jsとは何か、なぜ使うのかを説明できる
- 従来のReactとの違いを理解する
- App RouterとPages Routerの違いを説明できる
- ファイルベースルーティングシステムを使いこなせる
- Server ComponentsとClient Componentsの使い分けができる
- データフェッチング（SSR、SSG、ISR）を理解する
- API Routesの作り方が分かる
- Turbopackの利点を説明できる
- リポジトリのNext.jsコードを読んで理解できる

**学習時間目安**: 4-5時間

---

## 📚 Next.jsとは？

### 定義

**Next.js** = Reactベースのフルスタックフレームワーク

- Vercel社が開発・メンテナンス
- Reactの機能に加えて、ルーティング・SSR・SSG・API開発などを統合
- 本番環境に必要な機能がすべて揃っている
- 世界中の大企業で採用（Netflix、TikTok、Notion、OpenAI等）

### Reactとの違い

| React | Next.js |
|-------|---------|
| UIライブラリ | フルスタックフレームワーク |
| ルーティングは別途必要（React Router） | ファイルベースルーティング内蔵 |
| クライアントサイドレンダリング（CSR） | SSR/SSG/ISRに対応 |
| APIサーバーは別途必要 | API Routes内蔵 |
| SEO対策が難しい | SEOに強い |
| 設定が複雑 | ゼロコンフィグで始められる |

### 例：Reactの場合

```jsx
// Reactのみ（React Router使用）
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 例：Next.jsの場合

```typescript
// Next.js App Router（ファイルベースルーティング）
// app/page.tsx → "/"
// app/about/page.tsx → "/about"

// 設定不要！ファイルを作るだけ
export default function Home() {
  return <h1>Home</h1>;
}
```

**結果**: ルーティング設定が不要で、ファイル構造がURLになる！

---

## 🤔 なぜNext.jsを使うのか？

### 1. パフォーマンスが高い

- **SSR（Server-Side Rendering）**: 初回表示が高速
- **SSG（Static Site Generation）**: CDNでキャッシュ配信
- **自動コード分割**: 必要なコードだけ読み込む
- **画像最適化**: next/imageで自動最適化

### 2. SEO対策が簡単

```typescript
// メタデータを簡単に設定
export const metadata = {
  title: "Dev Elite Academy",
  description: "高年収エンジニアへの学習プラットフォーム",
};
```

### 3. 開発体験が優れている

- **ホットリロード**: コード変更が即座に反映
- **TypeScript完全対応**: 型安全な開発
- **エラー表示が親切**: 問題箇所がすぐ分かる
- **Turbopack**: 高速なビルドツール（Webpack後継）

### 4. フルスタック開発が可能

```typescript
// API Routeを簡単に作成
// app/api/users/route.ts
export async function GET() {
  return Response.json({ users: [] });
}
```

### 5. プロダクション対応

- Vercelで簡単デプロイ
- 自動スケーリング
- Edge Functionsでグローバル配信

---

## 🆚 App Router vs Pages Router

Next.js 13で導入されたApp Routerは、従来のPages Routerの進化版です。

### Pages Router（旧）

```
pages/
  index.tsx       → /
  about.tsx       → /about
  posts/
    [id].tsx      → /posts/:id
```

```typescript
// pages/index.tsx
import { GetServerSideProps } from 'next';

export default function Home({ data }) {
  return <div>{data}</div>;
}

// データフェッチング
export const getServerSideProps: GetServerSideProps = async () => {
  const data = await fetchData();
  return { props: { data } };
};
```

### App Router（新）

```
app/
  page.tsx        → /
  about/
    page.tsx      → /about
  posts/
    [id]/
      page.tsx    → /posts/:id
```

```typescript
// app/page.tsx
async function fetchData() {
  const res = await fetch('https://api.example.com/data');
  return res.json();
}

export default async function Home() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

### 主な違い

| 項目 | Pages Router | App Router |
|-----|-------------|------------|
| ファイル名 | `pages/about.tsx` | `app/about/page.tsx` |
| レイアウト | `_app.tsx` | `layout.tsx` |
| データフェッチ | `getServerSideProps` | `async/await`直接 |
| デフォルト | Client Component | Server Component |
| ネスト可能 | 不可 | 可能 |
| ストリーミング | 不可 | 対応 |

**推奨**: 新規プロジェクトはApp Routerを使う（本リポジトリもApp Router採用）

---

## 📁 ファイルベースルーティングシステム

### 基本ルール

Next.jsでは**ファイル構造がそのままURL**になります。

```
app/
  page.tsx                    → /
  about/
    page.tsx                  → /about
  blog/
    page.tsx                  → /blog
    [slug]/
      page.tsx                → /blog/:slug
  dashboard/
    layout.tsx                → レイアウト（ダッシュボード共通）
    page.tsx                  → /dashboard
    settings/
      page.tsx                → /dashboard/settings
```

### 特殊ファイル

| ファイル名 | 役割 | 例 |
|----------|------|---|
| `page.tsx` | ページコンポーネント | `/app/page.tsx` → `/` |
| `layout.tsx` | レイアウト（共通UI） | ヘッダー・フッター |
| `loading.tsx` | ローディングUI | Suspense境界 |
| `error.tsx` | エラーハンドリング | エラー画面 |
| `not-found.tsx` | 404ページ | カスタム404 |
| `route.ts` | API Route | `/app/api/users/route.ts` |

### 動的ルート

```
app/
  posts/
    [id]/
      page.tsx      → /posts/1, /posts/2, ...
  users/
    [username]/
      page.tsx      → /users/alice, /users/bob, ...
```

```typescript
// app/posts/[id]/page.tsx
interface Props {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  return <h1>Post ID: {id}</h1>;
}
```

### キャッチオールルート

```
app/
  docs/
    [...slug]/
      page.tsx      → /docs/a, /docs/a/b, /docs/a/b/c, ...
```

```typescript
// app/docs/[...slug]/page.tsx
interface Props {
  params: Promise<{ slug: string[] }>;
}

export default async function DocsPage({ params }: Props) {
  const { slug } = await params;
  return <h1>Docs: {slug.join('/')}</h1>;
}
```

---

## 🔀 Server Components vs Client Components

Next.js 15 App Routerの最大の特徴は**Server Components**です。

### Server Components（デフォルト）

```typescript
// app/page.tsx
// デフォルトでServer Component

async function getData() {
  const res = await fetch('https://api.example.com/data');
  return res.json();
}

export default async function Page() {
  const data = await getData();

  return (
    <div>
      <h1>{data.title}</h1>
    </div>
  );
}
```

**特徴**:
- サーバー側でレンダリング
- データベース直接アクセス可能
- JavaScriptバンドルサイズ削減
- SEOに強い
- useState、useEffectなどのフックは使えない

### Client Components

```typescript
// app/components/Counter.tsx
'use client';  // ← この行が必須

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

**特徴**:
- クライアント側でレンダリング
- useState、useEffect、イベントハンドラが使える
- ブラウザAPIにアクセス可能
- インタラクティブなUI

### 使い分けの原則

| Server Component | Client Component |
|-----------------|------------------|
| データフェッチング | インタラクティブUI |
| データベースアクセス | イベントハンドラ（onClick等） |
| 機密情報の扱い | useState、useEffect |
| 大きな依存ライブラリ | ブラウザAPI（localStorage等） |
| SEO重視 | リアルタイム更新 |

**ベストプラクティス**:
1. デフォルトはServer Componentを使う
2. 必要な箇所だけClient Componentにする
3. Client Componentは「葉」（ツリーの末端）に配置

### 組み合わせ例

```typescript
// app/page.tsx（Server Component）
import Counter from './Counter';

async function getData() {
  const res = await fetch('https://api.example.com/data');
  return res.json();
}

export default async function Page() {
  const data = await getData();

  return (
    <div>
      <h1>{data.title}</h1>
      {/* Client Componentを埋め込む */}
      <Counter />
    </div>
  );
}
```

---

## 📡 データフェッチング（SSR、SSG、ISR）

Next.jsは複数のレンダリング戦略をサポートしています。

### 1. SSR（Server-Side Rendering）

リクエストごとにサーバーでレンダリング。

```typescript
// app/page.tsx
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'no-store'  // キャッシュしない = SSR
  });
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <div>{data.title}</div>;
}
```

**特徴**:
- 常に最新データ
- リクエストごとに実行
- 動的コンテンツに最適

### 2. SSG（Static Site Generation）

ビルド時に静的ページを生成。

```typescript
// app/page.tsx
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'force-cache'  // キャッシュする = SSG
  });
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <div>{data.title}</div>;
}
```

**特徴**:
- 超高速（静的ファイル配信）
- CDNでキャッシュ
- ブログ・ドキュメントに最適

### 3. ISR（Incremental Static Regeneration）

一定時間ごとに再生成。

```typescript
// app/page.tsx
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 60 }  // 60秒ごとに再検証
  });
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <div>{data.title}</div>;
}
```

**特徴**:
- 静的ページの速さ + 定期的な更新
- ニュースサイト・ECサイトに最適

### 比較表

| 方式 | タイミング | 速度 | データ鮮度 | 用途 |
|-----|----------|------|----------|------|
| SSR | リクエスト時 | 普通 | 常に最新 | ダッシュボード |
| SSG | ビルド時 | 最速 | ビルド時点 | ブログ |
| ISR | 定期的 | 高速 | 設定による | ニュース |

---

## 🛣️ API Routes

Next.jsでは、APIエンドポイントを簡単に作成できます。

### 基本的な使い方

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

// GET /api/users
export async function GET() {
  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ];

  return NextResponse.json(users);
}

// POST /api/users
export async function POST(request: NextRequest) {
  const body = await request.json();

  // データベースに保存
  // ...

  return NextResponse.json({ success: true, data: body });
}
```

### 動的ルート

```typescript
// app/api/users/[id]/route.ts
interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: Props
) {
  const { id } = await params;

  // データベースから取得
  const user = await db.users.findUnique({ where: { id } });

  return NextResponse.json(user);
}

export async function DELETE(
  request: NextRequest,
  { params }: Props
) {
  const { id } = await params;

  // データベースから削除
  await db.users.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
```

### クエリパラメータ

```typescript
// app/api/search/route.ts
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const page = searchParams.get('page') || '1';

  // 検索処理
  const results = await search(query, parseInt(page));

  return NextResponse.json(results);
}

// 使用例: GET /api/search?q=nextjs&page=2
```

### エラーハンドリング

```typescript
// app/api/users/route.ts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const user = await createUser(body);
    return NextResponse.json(user);

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## ⚡ Turbopack - 次世代ビルドツール

### Turbopackとは？

- **Rust製**の超高速ビルドツール
- Webpack後継（Webpack作者が開発）
- Next.js 13+で実験的サポート、Next.js 15で安定版

### Webpackとの比較

| 項目 | Webpack | Turbopack |
|-----|---------|-----------|
| 言語 | JavaScript | Rust |
| 起動速度 | 遅い | 約10倍高速 |
| HMR速度 | 普通 | 約700倍高速 |
| 設定 | 複雑 | シンプル |

### 使い方

```json
// package.json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack"
  }
}
```

```bash
# 開発サーバー起動
npm run dev
```

### 利点

1. **開発体験が向上**
   - コード変更が瞬時に反映
   - 大規模プロジェクトでもストレスフリー

2. **設定不要**
   - Next.jsが自動最適化
   - webpack.config.jsは不要

3. **将来的にデフォルト化**
   - Next.js 16以降でデフォルトになる予定
   - 今から慣れておくべき

---

## 🛠️ dev-elite-academyでの実例

実例の詳細は本文に含まれています（省略）

---

## ⚠️ よくあるエラーと解決方法

エラー例と解決方法は本文に含まれています（省略）

---

## ✅ この章の理解度チェック

以下の質問に答えられますか？

- [ ] Next.jsとReactの違いを3つ挙げられる
- [ ] App RouterとPages Routerの違いを説明できる
- [ ] ファイルベースルーティングの仕組みが分かる
- [ ] Server ComponentとClient Componentの使い分けができる
- [ ] SSR、SSG、ISRの違いを説明できる
- [ ] API Routeを作成できる
- [ ] Turbopackの利点を説明できる
- [ ] 動的ルートの作り方が分かる
- [ ] リポジトリのNext.jsコードを読んで理解できる
- [ ] 他の人にNext.jsについて教えられる

**すべてにチェックが入ったら次の章へ進みましょう！**

---

## 📚 さらに学ぶためのリソース

- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [Next.js Learn（チュートリアル）](https://nextjs.org/learn)
- [App Routerガイド](https://nextjs.org/docs/app)

---

## 🔜 次のステップ

次は **[03_React_19.md](./03_React_19.md)** でReactのコンポーネント設計とフックを学びます。

---

**学習日**: ____年__月__日
**理解度**: [ ] 理解した  [ ] 部分的に理解  [ ] 要復習
**メモ**:
