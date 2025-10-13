# 07_YAML設定ファイル

**学習時間目安: 2時間**

## 目次
1. [YAMLとは](#1-yamlとは)
2. [基本構文](#2-基本構文)
3. [データ型](#3-データ型)
4. [インデント規則](#4-インデント規則)
5. [コメント](#5-コメント)
6. [複数行文字列](#6-複数行文字列)
7. [実践例：Dev Elite Academyから](#7-実践例dev-elite-academyから)
8. [よくある間違いとデバッグ](#8-よくある間違いとデバッグ)
9. [理解度チェック](#9-理解度チェック)

---

## 1. YAMLとは

### 1.1 概要

**YAML（ヤムル）** = **Y**AML **A**in't **M**arkup **L**anguage

YAMLは、人間が読み書きしやすいデータシリアライゼーション形式です。

**特徴:**
```
✅ 人間が読みやすい
✅ JSONのスーパーセット（JSONはYAMLの一部）
✅ 設定ファイルに最適
✅ コメントが書ける
✅ インデントでデータ構造を表現
```

**よく使われる場面:**
- GitHub Actions（ワークフロー定義）
- Docker Compose（コンテナ設定）
- Kubernetes（クラスター設定）
- CI/CD設定（Travis CI、CircleCI等）
- Ansible（インフラ自動化）
- アプリケーション設定ファイル

### 1.2 YAML vs JSON vs XML

**同じデータを3つの形式で表現:**

**YAML:**
```yaml
user:
  name: 田中太郎
  age: 25
  skills:
    - JavaScript
    - TypeScript
    - React
```

**JSON:**
```json
{
  "user": {
    "name": "田中太郎",
    "age": 25,
    "skills": [
      "JavaScript",
      "TypeScript",
      "React"
    ]
  }
}
```

**XML:**
```xml
<user>
  <name>田中太郎</name>
  <age>25</age>
  <skills>
    <skill>JavaScript</skill>
    <skill>TypeScript</skill>
    <skill>React</skill>
  </skills>
</user>
```

**比較:**

| 項目 | YAML | JSON | XML |
|------|------|------|-----|
| 可読性 | 高い | 中程度 | 低い |
| 記述量 | 少ない | 中程度 | 多い |
| コメント | 可能 | 不可 | 可能 |
| データ型 | 豊富 | 限定的 | 文字列中心 |
| パース速度 | 遅い | 速い | 遅い |

### 1.3 ファイル拡張子

- `.yml` - 一般的
- `.yaml` - 正式

**どちらも有効ですが、`.yml`がより一般的です。**

---

## 2. 基本構文

### 2.1 キー・バリュー（Key-Value）

最も基本的な構造です。

```yaml
# 基本形
key: value

# 実例
name: 田中太郎
age: 25
email: tanaka@example.com
isActive: true
```

**JSON変換:**
```json
{
  "name": "田中太郎",
  "age": 25,
  "email": "tanaka@example.com",
  "isActive": true
}
```

### 2.2 ネストされたオブジェクト

インデントを使って階層構造を表現します。

```yaml
user:
  name: 田中太郎
  age: 25
  address:
    city: 東京
    zip: 100-0001
```

**JSON変換:**
```json
{
  "user": {
    "name": "田中太郎",
    "age": 25,
    "address": {
      "city": "東京",
      "zip": "100-0001"
    }
  }
}
```

### 2.3 リスト（配列）

**方法1: ハイフン（-）を使用**

```yaml
skills:
  - JavaScript
  - TypeScript
  - React
  - Next.js
```

**方法2: インライン（JSONスタイル）**

```yaml
skills: [JavaScript, TypeScript, React, Next.js]
```

**両方とも同じJSON:**
```json
{
  "skills": ["JavaScript", "TypeScript", "React", "Next.js"]
}
```

### 2.4 オブジェクトのリスト

```yaml
users:
  - name: 田中太郎
    age: 25
    role: developer
  - name: 佐藤花子
    age: 30
    role: designer
  - name: 鈴木次郎
    age: 28
    role: manager
```

**JSON変換:**
```json
{
  "users": [
    { "name": "田中太郎", "age": 25, "role": "developer" },
    { "name": "佐藤花子", "age": 30, "role": "designer" },
    { "name": "鈴木次郎", "age": 28, "role": "manager" }
  ]
}
```

---

## 3. データ型

### 3.1 文字列（String）

```yaml
# クォートなし
name: 田中太郎

# シングルクォート
name: '田中太郎'

# ダブルクォート（エスケープシーケンス使用可能）
message: "こんにちは\n世界"

# 特殊文字を含む場合はクォート必要
special: "key: value"
url: "https://example.com?param=value&other=123"
```

**クォートが必要なケース:**
```yaml
# NG: コロンがあるとエラー
title: Error: Something went wrong

# OK: クォートで囲む
title: "Error: Something went wrong"

# NG: 特殊文字
tag: @user

# OK
tag: "@user"
```

### 3.2 数値（Number）

```yaml
# 整数
age: 25
count: 1000

# 浮動小数点数
price: 99.99
pi: 3.14159

# 指数表記
large: 1.0e+6  # 1000000
small: 1.0e-6  # 0.000001

# 8進数
octal: 0o755

# 16進数
hex: 0xFF
```

### 3.3 真偽値（Boolean）

```yaml
# true の表現
isActive: true
isActive: True
isActive: TRUE
isActive: yes
isActive: Yes
isActive: YES
isActive: on
isActive: On
isActive: ON

# false の表現
isActive: false
isActive: False
isActive: FALSE
isActive: no
isActive: No
isActive: NO
isActive: off
isActive: Off
isActive: OFF

# 推奨: true/false を使用
isActive: true
isDisabled: false
```

### 3.4 Null

```yaml
# null の表現
value: null
value: Null
value: NULL
value: ~
value:        # 空値もnull

# 推奨: null を使用
value: null
```

### 3.5 日付・時刻

```yaml
# ISO 8601形式
date: 2025-01-15
datetime: 2025-01-15T10:30:00Z
datetime_with_tz: 2025-01-15T10:30:00+09:00
```

---

## 4. インデント規則

### 4.1 基本ルール

**重要:**
- **スペースのみ使用**（タブ文字は使用禁止）
- **一貫したインデント幅**（通常2スペース）
- 同じレベルは同じインデント

```yaml
# 正しい例（2スペースインデント）
user:
  name: 田中太郎
  address:
    city: 東京
    zip: 100-0001
```

```yaml
# 間違い例（インデントが不揃い）
user:
  name: 田中太郎
   address:        # 3スペース（エラー）
    city: 東京
```

### 4.2 リストのインデント

```yaml
# 方法1: リストアイテムを親と同じインデント
users:
- name: 田中太郎
  age: 25
- name: 佐藤花子
  age: 30

# 方法2: リストアイテムをインデント（推奨）
users:
  - name: 田中太郎
    age: 25
  - name: 佐藤花子
    age: 30
```

### 4.3 複雑なネスト

```yaml
project:
  name: Dev Elite Academy
  technologies:
    frontend:
      framework: Next.js
      language: TypeScript
      styling:
        - Tailwind CSS
        - CSS Modules
    backend:
      database: PostgreSQL
      auth: Supabase
      hosting: Vercel
```

**視覚化:**
```
project (0スペース)
  name (2スペース)
  technologies (2スペース)
    frontend (4スペース)
      framework (6スペース)
      language (6スペース)
      styling (6スペース)
        - Tailwind CSS (8スペース)
        - CSS Modules (8スペース)
    backend (4スペース)
      database (6スペース)
      auth (6スペース)
      hosting (6スペース)
```

### 4.4 よくある間違い

**❌ タブとスペースの混在**
```yaml
user:
→ name: 太郎        # タブ（ダメ）
  age: 25          # スペース
```

**❌ インデント幅が不揃い**
```yaml
user:
  name: 太郎        # 2スペース
   age: 25         # 3スペース（ダメ）
```

**✅ 正しい例**
```yaml
user:
  name: 太郎        # 2スペース
  age: 25          # 2スペース
```

---

## 5. コメント

### 5.1 基本的なコメント

```yaml
# これは1行コメントです
name: 田中太郎  # 行末コメントも可能

# 複数行のコメント
# 各行に # を付ける必要があります
# ブロックコメント機能はありません

user:
  # ユーザー名
  name: 田中太郎
  # 年齢
  age: 25
```

### 5.2 セクションコメント

```yaml
# ================================
# ユーザー設定セクション
# ================================
user:
  name: 田中太郎
  age: 25

# ================================
# データベース設定セクション
# ================================
database:
  host: localhost
  port: 5432
```

### 5.3 TODO コメント

```yaml
# TODO: 環境変数から読み込むように変更
api_key: "hardcoded-key"

# FIXME: セキュリティ上の問題を修正
debug_mode: true

# NOTE: この設定は本番環境でのみ有効
production_only: true
```

---

## 6. 複数行文字列

### 6.1 リテラルブロック（|）- 改行をそのまま保持

```yaml
description: |
  これは複数行の
  説明文です。
  改行がそのまま
  保持されます。
```

**結果:**
```
これは複数行の
説明文です。
改行がそのまま
保持されます。
```

### 6.2 折りたたみブロック（>）- 改行をスペースに変換

```yaml
summary: >
  これは複数行の
  テキストですが
  1行に折りたたまれます。
```

**結果:**
```
これは複数行の テキストですが 1行に折りたたまれます。
```

### 6.3 実用例

**SQLクエリ:**
```yaml
query: |
  SELECT *
  FROM users
  WHERE age > 18
    AND status = 'active'
  ORDER BY created_at DESC
  LIMIT 10;
```

**シェルスクリプト:**
```yaml
script: |
  #!/bin/bash
  echo "Starting deployment..."
  npm install
  npm run build
  echo "Deployment complete!"
```

**長いメッセージ:**
```yaml
error_message: >
  データベース接続に失敗しました。
  ネットワーク接続を確認してください。
  問題が続く場合は、管理者に連絡してください。
```

### 6.4 末尾の改行制御

```yaml
# デフォルト: 末尾に1つの改行
text1: |
  Hello
  World

# 末尾の改行を削除（|-）
text2: |-
  Hello
  World

# 末尾の改行を全て保持（|+）
text3: |+
  Hello
  World


```

---

## 7. 実践例：Dev Elite Academyから

### 7.1 GitHub Actions ワークフロー

**ファイル: `.github/workflows/ci-cd.yml`**

```yaml
# ワークフロー名
name: Dev Elite Academy CI/CD

# トリガー設定
on:
  # Pushイベント
  push:
    branches: [ main, develop ]  # 対象ブランチ
  # Pull Requestイベント
  pull_request:
    branches: [ main ]
  # 手動実行を許可
  workflow_dispatch:

# ジョブ定義
jobs:
  # ジョブ1: ビルドとテスト
  build-and-test:
    # 実行環境
    runs-on: ubuntu-latest

    # 環境変数（ジョブレベル）
    env:
      NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
      NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
      SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}

    # ステップ定義
    steps:
    # ステップ1: コードチェックアウト
    - name: Checkout code
      uses: actions/checkout@v4

    # ステップ2: Node.jsセットアップ
    - name: Setup Node.js 20
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
        cache: 'npm'

    # ステップ3: 依存関係インストール
    - name: Install dependencies
      run: npm ci

    # ステップ4: ビルド
    - name: Build application
      run: npm run build

    # ステップ5: ビルド結果確認
    - name: Check build output
      run: |
        echo "✅ Build completed successfully"
        ls -la .next/

  # ジョブ2: セキュリティ監査
  security-audit:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run security audit
      run: npm audit --audit-level=critical || echo "Ignoring known false positives"

  # ジョブ3: Vercelデプロイ
  deploy-vercel:
    # 依存ジョブ（これらが成功したら実行）
    needs: [build-and-test, security-audit]
    runs-on: ubuntu-latest
    # 条件: mainブランチへのpush時のみ
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
        cache: 'npm'

    - name: Install Vercel CLI
      run: npm install --global vercel@latest

    - name: Pull Vercel Environment Information
      run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

    - name: Build Project Artifacts
      run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

    - name: Deploy Project Artifacts
      run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}

  # ジョブ4: 成功通知
  success-notification:
    needs: [build-and-test, security-audit]
    runs-on: ubuntu-latest
    if: success()

    steps:
    - name: Success Message
      run: |
        echo "🎉 Dev Elite Academy CI/CD Pipeline Successful!"
        echo "✅ Build: Passed"
        echo "✅ Tests: Passed"
        echo "✅ Security: Passed"
        echo "🚀 Ready for deployment!"
```

**構造の分析:**

```yaml
name: ...                           # 文字列
on:                                 # オブジェクト
  push:                             # オブジェクト
    branches: [ ... ]               # 配列（インライン形式）
  pull_request:                     # オブジェクト
    branches: [ ... ]               # 配列
  workflow_dispatch:                # nullまたは空オブジェクト

jobs:                               # オブジェクト
  build-and-test:                   # オブジェクト（ジョブID）
    runs-on: ...                    # 文字列
    env:                            # オブジェクト
      KEY: ${{ secrets.KEY }}       # 文字列（式展開）
    steps:                          # 配列
    - name: ...                     # オブジェクト（配列要素）
      uses: ...                     # 文字列
    - name: ...                     # オブジェクト
      run: |                        # 複数行文字列
        command1
        command2
```

### 7.2 Next.js設定ファイル（TypeScript）

**ファイル: `next.config.ts`**

実際はTypeScriptですが、YAMLで表現すると：

```yaml
nextConfig:
  # セキュリティヘッダー設定
  headers:
    - source: "/:path*"
      headers:
        - key: X-Frame-Options
          value: DENY
        - key: X-Content-Type-Options
          value: nosniff
        - key: X-XSS-Protection
          value: "1; mode=block"
        - key: Referrer-Policy
          value: strict-origin-when-cross-origin
        - key: Content-Security-Policy
          value: >
            default-src 'self';
            script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net;
            style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
            font-src 'self' https://fonts.gstatic.com;
            img-src 'self' data: https:;
            connect-src 'self' https://*.supabase.co https://api.github.com;
            frame-ancestors 'none';
```

### 7.3 Package.json（YAMLで表現）

```yaml
name: dev-elite-academy
version: 0.1.0
private: true

scripts:
  dev: next dev --turbopack
  build: next build --turbopack
  start: next start
  lint: eslint
  typecheck: tsc --noEmit
  db:migrate: node scripts/db-cli.js migrate
  db:reset: node scripts/db-cli.js reset
  db:status: node scripts/db-cli.js status

dependencies:
  "@supabase/ssr": "^0.7.0"
  "@supabase/supabase-js": "^2.57.0"
  next: "15.5.2"
  react: "19.1.0"
  react-dom: "19.1.0"
  typescript: "^5"

devDependencies:
  "@types/node": "^20.19.11"
  "@types/react": "^19"
  eslint: "^9"
  prettier: "^3.6.2"
  tailwindcss: "^4"
```

### 7.4 Docker Compose例（Dev Elite Academyには未使用）

```yaml
version: '3.8'

services:
  # Webアプリケーション
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb
    depends_on:
      - db
    volumes:
      - ./src:/app/src
    networks:
      - app-network

  # PostgreSQLデータベース
  db:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: mydb
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - app-network

# ボリューム定義
volumes:
  postgres-data:

# ネットワーク定義
networks:
  app-network:
    driver: bridge
```

### 7.5 Kubernetesマニフェスト例

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: dev-elite-academy
  labels:
    app: dev-elite-academy
spec:
  replicas: 3
  selector:
    matchLabels:
      app: dev-elite-academy
  template:
    metadata:
      labels:
        app: dev-elite-academy
    spec:
      containers:
      - name: web
        image: dev-elite-academy:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: production
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

---

## 8. よくある間違いとデバッグ

### 8.1 インデント関連のエラー

**❌ 間違い1: タブ文字を使用**
```yaml
user:
→ name: 太郎        # タブ（ダメ）
```

**エラーメッセージ:**
```
Error: Invalid YAML: found character '\t' that cannot start any token
```

**✅ 修正:**
```yaml
user:
  name: 太郎        # 2スペース
```

---

**❌ 間違い2: インデント幅が不統一**
```yaml
user:
  name: 太郎        # 2スペース
   age: 25         # 3スペース（ダメ）
```

**エラーメッセージ:**
```
Error: bad indentation of a mapping entry
```

**✅ 修正:**
```yaml
user:
  name: 太郎        # 2スペース
  age: 25          # 2スペース
```

### 8.2 構文エラー

**❌ 間違い3: コロンの後にスペースがない**
```yaml
name:太郎          # ダメ
```

**✅ 修正:**
```yaml
name: 太郎         # コロンの後にスペース必須
```

---

**❌ 間違い4: クォートが必要な文字列**
```yaml
message: Error: Something went wrong   # ダメ（コロンがある）
```

**エラーメッセージ:**
```
Error: mapping values are not allowed in this context
```

**✅ 修正:**
```yaml
message: "Error: Something went wrong"
```

### 8.3 データ型の間違い

**❌ 間違い5: 真偽値のつもりが文字列**
```yaml
isActive: "true"   # 文字列の"true"
```

**✅ 修正:**
```yaml
isActive: true     # 真偽値のtrue
```

---

**❌ 間違い6: 数値のつもりが文字列**
```yaml
age: "25"          # 文字列の"25"
```

**✅ 修正:**
```yaml
age: 25            # 数値の25
```

### 8.4 リスト関連のエラー

**❌ 間違い7: リストアイテムのインデントミス**
```yaml
skills:
- JavaScript
  - TypeScript     # インデントが不正
```

**✅ 修正:**
```yaml
skills:
  - JavaScript
  - TypeScript
```

### 8.5 アンカーとエイリアス（参照）

**重複を避けるための高度な機能:**

```yaml
# アンカー定義（&）
defaults: &defaults
  timeout: 30
  retry: 3

# エイリアス使用（*）
production:
  <<: *defaults      # defaultsの内容をマージ
  url: https://api.example.com

staging:
  <<: *defaults
  url: https://staging.api.example.com
```

**展開結果:**
```yaml
production:
  timeout: 30
  retry: 3
  url: https://api.example.com

staging:
  timeout: 30
  retry: 3
  url: https://staging.api.example.com
```

### 8.6 デバッグツール

**オンラインYAMLバリデーター:**
- [YAML Lint](http://www.yamllint.com/)
- [YAML Validator](https://codebeautify.org/yaml-validator)
- [JSON to YAML Converter](https://www.json2yaml.com/)

**VS Code拡張機能:**
- [YAML by Red Hat](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml)
  - シンタックスハイライト
  - リアルタイムバリデーション
  - 自動補完

**コマンドラインツール:**
```bash
# yamlintのインストール
pip install yamllint

# YAMLファイルのチェック
yamllint myfile.yml

# 厳格なチェック
yamllint -d strict myfile.yml
```

---

## 9. 理解度チェック

### 9.1 基礎問題

**Q1:** YAMLとJSONの主な違いを3つ挙げてください。

**Q2:** 以下のJSONをYAMLに変換してください：
```json
{
  "name": "田中太郎",
  "age": 25,
  "hobbies": ["読書", "音楽", "プログラミング"]
}
```

**Q3:** YAMLでインデントに使用できるのは、スペースとタブのどちらですか？

**Q4:** 以下のYAMLで、エラーがある行を指摘し、修正してください：
```yaml
user:
  name: 太郎
   age: 25
  email:tanaka@example.com
```

**Q5:** 複数行の文字列を改行を保持したまま記述する記号は何ですか？

### 9.2 実践問題

**Q6:** 以下の情報をYAMLで表現してください：
- プロジェクト名: My App
- バージョン: 1.0.0
- 開発者リスト:
  - 名前: 田中太郎、役割: フロントエンド
  - 名前: 佐藤花子、役割: バックエンド
- 使用技術: React, Node.js, PostgreSQL

**Q7:** GitHub Actionsで、以下の条件のワークフローをYAMLで書いてください：
- ワークフロー名: Test Workflow
- トリガー: mainブランチへのpush
- ジョブ名: test
- 実行環境: ubuntu-latest
- ステップ1: コードチェックアウト（actions/checkout@v4使用）
- ステップ2: テスト実行（`npm test`コマンド）

**Q8:** 以下のYAMLのインデントを修正してください：
```yaml
services:
web:
build: .
ports:
- "3000:3000"
environment:
NODE_ENV: production
```

**Q9:** アンカーとエイリアスを使って、以下のYAMLの重複を削除してください：
```yaml
development:
  host: localhost
  port: 3000
  timeout: 30

staging:
  host: staging.example.com
  port: 3000
  timeout: 30

production:
  host: example.com
  port: 3000
  timeout: 30
```

**Q10:** 以下のSQLクエリをYAMLの複数行文字列として表現してください：
```sql
SELECT users.name, orders.total
FROM users
JOIN orders ON users.id = orders.user_id
WHERE orders.status = 'completed'
ORDER BY orders.created_at DESC;
```

### 9.3 応用問題

**Q11:** Dev Elite AcademyのCI/CDワークフローで、なぜ`needs`キーワードが使われているのか説明してください。また、`needs`がない場合の動作との違いも説明してください。

**Q12:** 以下のDocker Composeファイルで、環境変数を外部ファイル（.env）から読み込むように修正してください：
```yaml
version: '3.8'
services:
  web:
    image: myapp:latest
    environment:
      DATABASE_URL: postgresql://user:pass@localhost/db
      API_KEY: secret-key-123
```

**Q13:** GitHub Actionsで、複数のNode.jsバージョン（18, 20, 22）でテストを実行するマトリックス戦略をYAMLで実装してください。

**Q14:** YAMLで循環参照（エイリアスが自分自身を参照）を作成した場合、どのような問題が発生しますか？

**Q15:** 以下の要件を満たすKubernetesのConfigMapをYAMLで作成してください：
- 名前: app-config
- データ:
  - `app.properties`: 複数行の設定ファイル
  - `database.url`: 文字列値
  - `max.connections`: 数値

### 9.4 友達に説明できるかチェック

以下の項目を、技術知識のない友達に説明できますか？

- [ ] YAMLが何のために使われるのか
- [ ] インデントがなぜ重要なのか
- [ ] YAMLとJSONの違い
- [ ] 設定ファイルがコードと分離されている理由
- [ ] コメントの重要性

### 9.5 技術面接準備

以下の質問に自信を持って答えられますか？

- [ ] YAMLの主な用途を3つ以上説明できる
- [ ] YAMLのインデント規則を説明できる
- [ ] JSONとYAMLの変換ができる
- [ ] アンカーとエイリアスの使い方を説明できる
- [ ] 複数行文字列の記法（|と>）の違いを説明できる
- [ ] YAMLのデータ型を列挙できる
- [ ] よくあるYAMLエラーとその修正方法を説明できる

---

## 参考リソース

### 公式ドキュメント
- [YAML Official Website](https://yaml.org/)
- [YAML Specification](https://yaml.org/spec/1.2.2/)

### 学習リソース
- [Learn YAML in Y Minutes](https://learnxinyminutes.com/docs/yaml/)
- [YAML Tutorial](https://www.tutorialspoint.com/yaml/index.htm)

### ツール
- [YAML Lint](http://www.yamllint.com/) - オンラインバリデーター
- [JSON to YAML](https://www.json2yaml.com/) - 変換ツール
- [YAML to JSON](https://www.convertjson.com/yaml-to-json.htm) - 逆変換

### VS Code拡張機能
- [YAML by Red Hat](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml)
- [YAML Sort](https://marketplace.visualstudio.com/items?itemName=PascalReitermann93.vscode-yaml-sort)

---

## まとめ

このドキュメントでは、YAMLの基礎から実践的な使い方まで学習しました：

1. **YAMLの基礎**: 人間が読みやすい設定ファイル形式
2. **基本構文**: キー・バリュー、リスト、ネスト
3. **データ型**: 文字列、数値、真偽値、null、日付
4. **インデント規則**: スペースのみ、一貫したインデント幅
5. **コメント**: `#`を使った注釈
6. **複数行文字列**: `|`（リテラル）と`>`（折りたたみ）
7. **実践例**: GitHub Actions、設定ファイル
8. **デバッグ**: よくある間違いと修正方法

YAMLは多くのモダンな開発ツールで使用されているため、この知識は幅広く活用できます！
