# 開発速度重視マトリックス

目的別に**最速**でプロジェクトを立ち上げるための技術スタックとコマンド一覧。

## 🎯 目的別クイックスタート

| 目的 | 最速構成 | 技術スタック | セットアップコマンド | 所要時間 |
|------|---------|-------------|---------------------|----------|
| **SaaS MVP** | Next.js + Supabase + Vercel | TypeScript, Tailwind, Prisma | `npx create-next-app@latest` | ⚡ 5分 |
| **管理画面** | React Admin + Firebase | React, MUI, Firebase | `npx create-react-app + React Admin` | ⚡ 10分 |
| **LP/マーケサイト** | Astro + Tailwind | Astro, Tailwind CSS | `npm create astro@latest` | ⚡ 3分 |
| **モバイルアプリ** | Expo (React Native) | TypeScript, Expo Router | `npx create-expo-app` | ⚡ 5分 |
| **デスクトップアプリ** | Tauri + React | Rust, React, TypeScript | `npm create tauri-app` | ⚡ 10分 |
| **API サーバー** | FastAPI / Hono | Python / TypeScript | `pip install fastapi` | ⚡ 3分 |
| **CLI ツール** | Commander.js / Click | Node.js / Python | `npm init` | ⚡ 2分 |
| **ドキュメントサイト** | Nextra / VitePress | Next.js / Vue | `npx create-next-app` | ⚡ 5分 |
| **ブログ** | Astro + CMS | Astro, Markdown | `npm create astro@latest` | ⚡ 3分 |
| **ECサイト** | Next.js + Shopify | Next.js, Shopify API | `npx create-next-app` | ⚡ 15分 |

---

## 詳細ガイド

### 1. SaaS MVP（最速構成）

#### 技術構成
```
フロントエンド: Next.js 15 (App Router)
バックエンド: Supabase (PostgreSQL + Auth + Storage)
スタイリング: Tailwind CSS + shadcn/ui
デプロイ: Vercel
決済: Stripe (オプション)
```

#### セットアップ手順

```bash
# 1. Next.js プロジェクト作成
npx create-next-app@latest my-saas \
  --typescript \
  --tailwind \
  --app \
  --use-npm

cd my-saas

# 2. Supabase インストール
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

# 3. shadcn/ui 初期化（オプション）
npx shadcn@latest init

# 4. Stripe インストール（決済機能が必要な場合）
npm install stripe @stripe/stripe-js

# 5. 開発サーバー起動
npm run dev
```

#### Vercel デプロイ

```bash
npm install -g vercel
vercel

# 環境変数を Vercel で設定
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - STRIPE_SECRET_KEY (決済機能利用時)
```

#### 所要時間
- セットアップ: 5分
- 基本的な認証実装: 30分
- CRUD機能実装: 1-2時間
- **最速1日でMVP完成**

---

### 2. 管理画面（ダッシュボード）

#### 技術構成
```
フロントエンド: React Admin
バックエンド: Supabase / Firebase
UI: Material-UI（React Admin標準）
```

#### セットアップ手順

```bash
# 1. Vite + React プロジェクト作成
npm create vite@latest my-admin -- --template react-ts

cd my-admin

# 2. React Admin インストール
npm install react-admin ra-data-supabase

# 3. Supabase クライアント
npm install @supabase/supabase-js

# 4. 開発サーバー起動
npm run dev
```

#### 最小構成コード

```tsx
import { Admin, Resource, ListGuesser } from 'react-admin';
import { supabaseDataProvider } from 'ra-data-supabase';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const dataProvider = supabaseDataProvider(supabase);

const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="users" list={ListGuesser} />
  </Admin>
);
```

#### 所要時間
- セットアップ: 10分
- データ表示: 5分
- **30分で動く管理画面完成**

---

### 3. ランディングページ / マーケティングサイト

#### 技術構成
```
フレームワーク: Astro
スタイリング: Tailwind CSS
デプロイ: Vercel / Netlify
```

#### セットアップ手順

```bash
# 1. Astro プロジェクト作成
npm create astro@latest my-landing

# テンプレート選択: Empty or Portfolio
# TypeScript: Yes (Strict推奨)
# Install dependencies: Yes

cd my-landing

# 2. Tailwind CSS 追加
npx astro add tailwind

# 3. 開発サーバー起動
npm run dev
```

#### Astro の利点
- ✅ **ゼロJS** デフォルト（超高速）
- ✅ 複数フレームワーク混在可能（React + Vue 同時可）
- ✅ Markdown/MDX ネイティブサポート
- ✅ 画像最適化自動

#### 所要時間
- セットアップ: 3分
- LP制作: 1-2時間
- **半日で公開可能**

---

### 4. モバイルアプリ

#### 技術構成
```
フレームワーク: Expo (React Native)
言語: TypeScript
ナビゲーション: Expo Router
デプロイ: EAS (Expo Application Services)
```

#### セットアップ手順

```bash
# 1. Expo プロジェクト作成
npx create-expo-app@latest my-app

cd my-app

# 2. 開発サーバー起動
npx expo start

# スマホでExpo Goアプリを開いてQRコードをスキャン
```

#### クロスプラットフォーム対応

```bash
# iOS シミュレーター
npx expo run:ios

# Android エミュレーター
npx expo run:android

# Web（プレビュー）
npx expo start --web
```

#### 本番ビルド

```bash
# EAS CLI インストール
npm install -g eas-cli

# ビルド（iOS/Android同時）
eas build --platform all
```

#### 所要時間
- セットアップ: 5分
- 基本画面実装: 1-2時間
- **1-2日でストア申請可能**

---

### 5. デスクトップアプリ

#### 技術構成
```
フレームワーク: Tauri
フロントエンド: React / Vue / Svelte
バックエンド: Rust
```

#### セットアップ手順

```bash
# Tauri プロジェクト作成
npm create tauri-app@latest

# プロジェクト名、フレームワーク（React推奨）、言語（TypeScript）を選択

cd my-tauri-app
npm install

# 開発サーバー起動
npm run tauri dev
```

#### ビルド（バイナリ生成）

```bash
# 現在のOSのバイナリ生成
npm run tauri build

# 生成物: src-tauri/target/release/
```

#### Tauri vs Electron

| | Tauri | Electron |
|---|-------|----------|
| サイズ | **3MB〜** | 50MB〜 |
| メモリ | **少ない** | 多い |
| セキュリティ | **高い** | 普通 |
| 実績 | 新しい | 豊富 |

#### 所要時間
- セットアップ: 10分
- 基本機能実装: 2-4時間
- **1-2日でリリース可能**

---

### 6. API サーバー

#### パターンA: FastAPI (Python)

```bash
# 1. FastAPI インストール
pip install fastapi uvicorn

# 2. main.py 作成
cat > main.py << 'EOF'
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}
EOF

# 3. 起動
uvicorn main:app --reload
```

#### パターンB: Hono (TypeScript)

```bash
# 1. プロジェクト作成
npm create hono@latest my-api

cd my-api
npm install

# 2. 開発サーバー起動
npm run dev
```

#### パターンC: Express (Node.js)

```bash
npx express-generator my-api --view=ejs
cd my-api
npm install
npm start
```

#### 推奨: Hono
- ✅ TypeScript ネイティブ
- ✅ 超高速（Cloudflare Workers対応）
- ✅ モダンなAPI設計

#### 所要時間
- セットアップ: 3分
- CRUD API実装: 1-2時間

---

### 7. CLI ツール

#### パターンA: Node.js (Commander.js)

```bash
# 1. プロジェクト初期化
mkdir my-cli && cd my-cli
npm init -y

# 2. 依存関係インストール
npm install commander inquirer chalk

# 3. index.js 作成
cat > index.js << 'EOF'
#!/usr/bin/env node
import { Command } from 'commander';

const program = new Command();

program
  .name('my-cli')
  .description('My awesome CLI tool')
  .version('1.0.0');

program
  .command('hello')
  .description('Say hello')
  .action(() => {
    console.log('Hello from CLI!');
  });

program.parse();
EOF

# 4. package.json に bin 追加
# "bin": { "my-cli": "./index.js" }

# 5. ローカルインストール
npm link

# 6. 実行
my-cli hello
```

#### パターンB: Python (Click)

```bash
pip install click

cat > cli.py << 'EOF'
import click

@click.command()
@click.option('--name', default='World', help='Name to greet')
def hello(name):
    click.echo(f'Hello, {name}!')

if __name__ == '__main__':
    hello()
EOF

python cli.py --name=Gaku
```

#### 所要時間
- セットアップ: 2分
- 基本コマンド実装: 30分

---

### 8. ドキュメントサイト

#### パターンA: Nextra (このサイト!)

```bash
npx create-next-app@latest my-docs --typescript
cd my-docs
npm install nextra nextra-theme-docs
```

#### パターンB: VitePress (Vue製)

```bash
npx vitepress init
```

#### パターンC: Docusaurus (Meta製)

```bash
npx create-docusaurus@latest my-docs classic
```

#### 推奨: Nextra
- ✅ Next.js ベース
- ✅ MDX サポート
- ✅ 美しいデフォルトテーマ

---

### 9. ブログ

#### 技術構成
```
フレームワーク: Astro
CMS: Markdown or Headless CMS (Contentful)
デプロイ: Vercel / Netlify
```

```bash
npm create astro@latest my-blog -- --template blog
cd my-blog
npm run dev
```

#### Headless CMS 統合

```bash
# Contentful
npm install contentful

# Strapi (セルフホスト)
npx create-strapi-app my-cms
```

---

### 10. ECサイト

#### パターンA: Next.js + Shopify

```bash
npx create-next-app@latest my-shop
npm install @shopify/hydrogen-react
```

#### パターンB: Medusa (オープンソースEC)

```bash
npx create-medusa-app
```

---

## 選択フローチャート

```
何を作る？
  │
  ├─ SaaS → Next.js + Supabase
  │
  ├─ 管理画面 → React Admin
  │
  ├─ LP → Astro
  │
  ├─ モバイル → Expo
  │
  ├─ デスクトップ → Tauri
  │
  ├─ API → Hono / FastAPI
  │
  ├─ CLI → Node.js + Commander
  │
  ├─ ドキュメント → Nextra
  │
  ├─ ブログ → Astro
  │
  └─ ECサイト → Shopify + Next.js
```

---

## 総合セットアップ速度ランキング

| ランク | プロジェクト種類 | セットアップ時間 | MVP完成まで |
|--------|----------------|----------------|------------|
| 🥇 | CLI ツール | 2分 | 1時間 |
| 🥈 | LP (Astro) | 3分 | 半日 |
| 🥉 | API (Hono) | 3分 | 2時間 |
| 4位 | ドキュメント (Nextra) | 5分 | 1日 |
| 5位 | ブログ (Astro) | 3分 | 1日 |
| 6位 | SaaS (Next.js + Supabase) | 5分 | 1-2日 |
| 7位 | モバイル (Expo) | 5分 | 2-3日 |
| 8位 | 管理画面 (React Admin) | 10分 | 1日 |
| 9位 | デスクトップ (Tauri) | 10分 | 2-3日 |
| 10位 | EC (Shopify) | 15分 | 1週間 |

---

## まとめ：最速開発のための鉄則

### 1. BaaS を活用
バックエンド開発をスキップ → **開発時間50%削減**

### 2. フルスタックフレームワークを使う
Next.js, Nuxt.js, SvelteKit → **設定不要で即開発**

### 3. Tailwind CSS でスタイリング高速化
ゼロから CSS 書かない → **デザイン時間70%削減**

### 4. PaaS でデプロイ
Vercel/Netlify → **1コマンドで本番稼働**

### 5. 既存テンプレート活用
shadcn/ui, DaisyUI → **UI実装時間80%削減**

---

## 次のステップ

このマトリックスを使って、即座にプロジェクトを立ち上げましょう！

- [技術スタック詳細](/tech-stacks) - 各技術の深掘り
- [プロジェクトテンプレート](/templates) - コピペできる構成例
- [ベストプラクティス](/best-practices) - 品質を担保する方法
