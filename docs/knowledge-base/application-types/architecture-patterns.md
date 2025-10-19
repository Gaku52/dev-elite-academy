# アーキテクチャパターンによる分類

設計パターンの観点からアプリケーションを分類します。

## 一覧表

| パターン | 説明 | 適用例 | セットアップ複雑度 |
|----------|------|--------|-------------------|
| **SPA** | Single Page Application - 1ページで動作 | React/Vue アプリ | 低 ⚡⚡⚡ |
| **MPA** | Multi Page Application - 複数ページ構成 | 従来型Webサイト | 低 ⚡⚡⚡ |
| **SSR** | Server Side Rendering - サーバーでHTML生成 | Next.js, Nuxt.js | 中 ⚡⚡ |
| **SSG** | Static Site Generation - 静的サイト生成 | Gatsby, Astro, Hugo | 低 ⚡⚡⚡ |
| **ISR** | Incremental Static Regeneration - 段階的再生成 | Next.js | 中 ⚡⚡ |
| **JAMstack** | JavaScript + API + Markup の構成 | Netlify/Vercel デプロイ | 低 ⚡⚡⚡ |
| **マイクロサービス** | 機能ごとに独立したサービス群 | 大規模SaaS | 高 ⚡ |
| **モノリス** | 1つの大きなアプリケーション | 中小規模アプリ | 中 ⚡⚡ |
| **サーバーレス** | サーバー管理不要のアーキテクチャ | AWS Lambda + API Gateway | 中 ⚡⚡ |

---

## SPA（Single Page Application）

### 概要
1つのHTMLページ内で、JavaScriptによって動的にコンテンツを切り替えるアプリケーション。

### 特徴
- 🚀 高速なページ遷移（リロード不要）
- ⚡ リッチなUI体験
- 🔄 API通信でデータ取得
- 📱 アプリライクな操作感

### メリット
- ✅ UXが優れている
- ✅ フロントエンドとバックエンドを完全分離
- ✅ モバイルアプリと API を共有しやすい

### デメリット
- ❌ 初回読み込みが遅い
- ❌ SEOが難しい（対策必要）
- ❌ JavaScript無効環境で動作しない

### 技術スタック

```bash
# React (Vite)
npm create vite@latest my-spa -- --template react-ts

# Vue
npm create vue@latest

# Svelte
npm create svelte@latest my-spa
```

### 適用シーン
- 管理画面・ダッシュボード
- SaaSの機能画面（ログイン後）
- Webアプリケーション
- チャットアプリ

### SEO対策
SPAでSEOが必要な場合：
1. SSRに切り替え（Next.js等）
2. Prerendering（react-snap等）
3. Dynamic Rendering（Googlebot向け）

---

## MPA（Multi Page Application）

### 概要
従来型のWebサイト。ページ遷移ごとにサーバーから新しいHTMLを取得。

### 特徴
- 📄 ページごとに完全なHTML
- 🔄 ページ遷移時にリロード
- 🎯 SEOに有利

### メリット
- ✅ SEOが簡単
- ✅ シンプルな構成
- ✅ JavaScript不要でも動作

### デメリット
- ❌ ページ遷移が遅い
- ❌ 状態管理が複雑

### 技術スタック

```bash
# Ruby on Rails
rails new my-app

# Django
django-admin startproject my_app

# Laravel
composer create-project laravel/laravel my-app
```

### 適用シーン
- コーポレートサイト
- ブログ
- ECサイト（商品ページ等）
- 情報サイト

---

## SSR（Server Side Rendering）

### 概要
サーバー側でReact/Vueを実行してHTMLを生成し、クライアントに送信。

### 特徴
- 🎯 SEOとUXの両立
- ⚡ 初回表示が高速
- 🔄 その後はSPAのように動作

### メリット
- ✅ SEO対応
- ✅ 初回表示が速い
- ✅ SPAの利点も享受

### デメリット
- ❌ サーバー負荷が高い
- ❌ 設定が複雑
- ❌ ホスティングコストが高め

### 技術スタック

```bash
# Next.js (React)
npx create-next-app@latest my-app

# Nuxt.js (Vue)
npx nuxi@latest init my-app

# SvelteKit
npm create svelte@latest my-app
```

### 適用シーン
- SEOが重要なSaaS
- メディアサイト
- ECサイト
- マーケティングサイト

### SSRの仕組み

```
1. ユーザーがページをリクエスト
2. サーバーでReactを実行してHTMLを生成
3. HTMLをブラウザに送信（SEO対応、初回表示高速）
4. ブラウザでJavaScriptを読み込み
5. 以降はSPAとして動作
```

---

## SSG（Static Site Generation）

### 概要
ビルド時に全ページの静的HTMLを生成。CDNから配信。

### 特徴
- 🚀 超高速（事前生成されたHTML）
- 💰 コストが安い（CDN配信のみ）
- 🔒 セキュア（サーバー処理なし）
- 📈 スケールしやすい

### メリット
- ✅ 最速の表示速度
- ✅ SEO完璧
- ✅ ホスティングコストほぼゼロ
- ✅ セキュリティリスク低

### デメリット
- ❌ ビルド時間が長い（ページ数多いと）
- ❌ 動的コンテンツに不向き
- ❌ 更新にビルドが必要

### 技術スタック

```bash
# Astro（推奨）
npm create astro@latest

# Next.js (SSG mode)
npx create-next-app@latest
# next.config.js で output: 'export'

# Gatsby
npm init gatsby

# Hugo (Go製、超高速)
hugo new site my-site
```

### 適用シーン
- ブログ
- ドキュメントサイト（このサイトも！）
- ランディングページ
- ポートフォリオサイト
- マーケティングサイト

---

## ISR（Incremental Static Regeneration）

### 概要
SSGとSSRのハイブリッド。静的生成しつつ、必要に応じて再生成。

### 特徴
- ✨ SSGの速度 + 動的コンテンツ対応
- 🔄 バックグラウンドで再生成
- ⏰ キャッシュを指定時間で無効化

### メリット
- ✅ 大量ページでもビルド時間短縮
- ✅ コンテンツを定期的に更新
- ✅ CDN配信可能

### 技術スタック

```javascript
// Next.js の ISR 設定例
export async function getStaticProps() {
  const data = await fetchData();

  return {
    props: { data },
    revalidate: 60, // 60秒ごとに再生成
  };
}
```

### 適用シーン
- ニュースサイト
- ECサイト（商品ページ）
- 頻繁に更新されるコンテンツ

---

## JAMstack

### 概要
JavaScript + API + Markup の構成。フロントエンドとバックエンドを完全分離。

### 特徴
- 🎯 フロントエンド: 静的サイト or SPA
- 🔌 バックエンド: API（マイクロサービス）
- 📄 Markup: ビルド時生成

### メリット
- ✅ 高速・セキュア・スケーラブル
- ✅ 開発者体験が良い
- ✅ 各部分を独立して開発

### 技術スタック

```bash
# フロントエンド
Astro / Next.js / Nuxt.js

# API
Supabase / Firebase / 自前API

# ホスティング
Vercel / Netlify / Cloudflare Pages
```

### 構成例

```
フロントエンド: Next.js (SSG) → Vercel
API: Supabase (BaaS)
CMS: Contentful / Strapi
決済: Stripe
認証: Clerk
```

### 適用シーン
- モダンなWebサイト全般
- ヘッドレスCMS構成
- API駆動のアプリ

---

## マイクロサービス

### 概要
機能ごとに独立したサービスに分割。各サービスが独立してデプロイ可能。

### 特徴
- 🧩 機能ごとに分離
- 🚀 独立したデプロイ
- 🔧 技術スタックを混在可能

### メリット
- ✅ スケールしやすい
- ✅ 障害が局所化
- ✅ チームごとに開発可能

### デメリット
- ❌ 複雑性が高い
- ❌ 運用コスト大
- ❌ 初期開発には不向き

### いつ採用するか
- ❌ MVP・初期開発では避ける
- ✅ ユーザー数が数万人超
- ✅ 複数チームで開発
- ✅ スケール課題が顕在化

---

## モノリス

### 概要
全機能を1つのアプリケーションにまとめる従来型の構成。

### 特徴
- 📦 単一のコードベース
- 🚀 シンプルなデプロイ

### メリット
- ✅ 開発が早い（初期）
- ✅ デバッグしやすい
- ✅ トランザクション管理が簡単

### デメリット
- ❌ スケールしづらい
- ❌ 部分的な更新が困難

### 推奨
**初期開発はモノリスで始めるべき**

理由：
- 要件が固まっていない段階でマイクロサービスは過剰
- 開発速度が圧倒的に速い
- 必要になってから分割できる

---

## サーバーレス

### 概要
サーバー管理を完全に排除したアーキテクチャ。

### 特徴
- ☁️ インフラ管理不要
- 📈 自動スケーリング
- 💰 使った分だけ課金

### 構成例

```
フロントエンド: Next.js (Vercel)
API: AWS Lambda + API Gateway
データベース: DynamoDB / Aurora Serverless
認証: Auth0 / Cognito
ストレージ: S3
```

### メリット
- ✅ 運用負荷ゼロ
- ✅ コスト最適化
- ✅ スケール自動

### デメリット
- ❌ コールドスタート
- ❌ ベンダーロックイン
- ❌ デバッグが難しい

### 適用シーン
- スパイクアクセスがあるアプリ
- 小〜中規模のAPI
- イベント駆動処理

---

## 選択フローチャート

```
何を作る？
  │
  ├─ SEO重要？
  │   ├─ Yes → SSG / SSR / ISR
  │   └─ No → SPA
  │
  ├─ 動的コンテンツ多い？
  │   ├─ Yes → SSR / ISR
  │   └─ No → SSG
  │
  ├─ 大規模・複雑？
  │   ├─ Yes（将来的に） → モノリス → マイクロサービス
  │   └─ No → モノリス
  │
  └─ サーバー管理したくない？
      └─ Yes → サーバーレス / JAMstack
```

---

## 開発速度ランキング

| ランク | パターン | 初期開発速度 | スケーラビリティ |
|--------|---------|------------|----------------|
| 🥇 | SSG（Astro等） | 最速 | 高 |
| 🥈 | SPA（Vite+React） | 速い | 中 |
| 🥉 | JAMstack | 速い | 高 |
| 4位 | SSR（Next.js） | やや速い | 高 |
| 5位 | モノリス（Rails等） | やや速い | 低 |
| 6位 | サーバーレス | 普通 | 高 |
| 7位 | マイクロサービス | 遅い | 最高 |

---

## MVP開発の推奨パターン

### ケース1: SaaS（管理画面メイン）
```
SPA (React + Vite) + BaaS (Supabase)
```

### ケース2: マーケティングサイト + SaaS
```
SSG (Astro) マーケサイト
+ SSR (Next.js) アプリ部分
+ BaaS (Supabase)
```

### ケース3: コンテンツサイト
```
SSG (Astro) + Headless CMS
```

### ケース4: API中心
```
Serverless (Vercel Functions / Lambda)
```
