# 06_GitHub_Actions_CI_CD

**学習時間目安: 2-3時間**

## 目次
1. [CI/CDとは](#1-cicdとは)
2. [GitHub Actionsの基礎](#2-github-actionsの基礎)
3. [ワークフローの構文](#3-ワークフローの構文)
4. [Jobs、Steps、Actions](#4-jobsstepsactions)
5. [環境変数とシークレット](#5-環境変数とシークレット)
6. [実践例：Dev Elite AcademyのCI/CD](#6-実践例dev-elite-academyのcicd)
7. [ビルド・テスト・デプロイプロセス](#7-ビルドテストデプロイプロセス)
8. [理解度チェック](#8-理解度チェック)

---

## 1. CI/CDとは

### 1.1 CI (Continuous Integration) - 継続的インテグレーション

**定義:**
開発者がコードをリポジトリに頻繁にマージし、その度に自動的にビルドとテストを実行する開発手法。

**目的:**
```
✅ バグの早期発見
✅ コードの品質維持
✅ チーム開発でのコンフリクト削減
✅ 統合作業の自動化
```

**CIの流れ:**
```
1. 開発者がコードをプッシュ
     ↓
2. 自動的にビルド開始
     ↓
3. テストの実行
     ↓
4. リント（コード品質チェック）
     ↓
5. 結果を開発者に通知
```

### 1.2 CD (Continuous Delivery/Deployment) - 継続的デリバリー/デプロイ

**Continuous Delivery（継続的デリバリー）:**
- ビルドとテストが成功したら、いつでもデプロイ可能な状態を維持
- 本番環境へのデプロイは手動で承認

**Continuous Deployment（継続的デプロイ）:**
- テストに合格したコードを**自動的に**本番環境にデプロイ
- 人間の承認なしで本番反映

**CDの流れ:**
```
1. CIが成功
     ↓
2. ステージング環境にデプロイ
     ↓
3. 追加テスト（E2Eテスト等）
     ↓
4. 本番環境にデプロイ
     ↓
5. 監視とロールバック準備
```

### 1.3 CI/CDのメリット

| メリット | 説明 |
|---------|------|
| **早期バグ検出** | コミット毎にテストが実行されるため、問題を即座に発見 |
| **品質向上** | 自動チェックにより、コーディング規約違反を防止 |
| **迅速なリリース** | 手動作業が減り、デプロイが高速化 |
| **安心感** | テストが通っているコードのみデプロイされる |
| **ドキュメント化** | ビルドプロセスがコード化され、明確になる |
| **チーム協調** | 全員が同じプロセスに従う |

### 1.4 CI/CDなしの開発 vs CI/CDありの開発

**CI/CDなし:**
```
開発 → 手動でテスト → 手動でビルド → 手動でサーバーにアップロード
時間: 30分〜数時間
エラー率: 高い（人的ミス）
ストレス: 高い
```

**CI/CDあり:**
```
開発 → Gitにプッシュ → 自動でテスト・ビルド・デプロイ
時間: 5〜15分
エラー率: 低い（自動化）
ストレス: 低い
```

---

## 2. GitHub Actionsの基礎

### 2.1 GitHub Actionsとは

GitHub Actionsは、GitHubに統合されたCI/CDプラットフォームです。

**特徴:**
- GitHub内で完結（外部サービス不要）
- YAML形式で設定
- 豊富な事前作成されたアクション
- Linux、Windows、macOSで実行可能
- 無料枠が充実（Publicリポジトリは無制限）

**他のCI/CDツールとの比較:**

| ツール | 特徴 | 価格 |
|-------|------|------|
| **GitHub Actions** | GitHub統合、設定簡単 | Public無制限、Private 2,000分/月 |
| **Jenkins** | 最も柔軟、自己ホスト | 無料（サーバー費用は別） |
| **CircleCI** | 高速、Docker統合良好 | 6,000分/月無料 |
| **Travis CI** | オープンソース向け | 有料プランのみ |
| **GitLab CI/CD** | GitLab統合 | 400分/月無料 |

### 2.2 GitHub Actionsの構成要素

```
┌─────────────────────────────────────┐
│         Workflow (ワークフロー)      │  ← YAMLファイルで定義
│  自動化プロセス全体                  │
└─────────────┬───────────────────────┘
              │
     ┌────────┴────────┐
     │                 │
┌────▼─────┐    ┌─────▼────┐
│  Job 1   │    │  Job 2   │          ← 並列または順次実行
└────┬─────┘    └─────┬────┘
     │                │
┌────▼─────┐    ┌─────▼────┐
│  Step 1  │    │  Step 1  │          ← 順次実行
├──────────┤    ├──────────┤
│  Step 2  │    │  Step 2  │
├──────────┤    ├──────────┤
│  Step 3  │    │  Step 3  │
└──────────┘    └──────────┘
```

**用語説明:**

- **Workflow（ワークフロー）**: 自動化プロセス全体（1つのYAMLファイル）
- **Job（ジョブ）**: ワークフロー内の独立した実行単位
- **Step（ステップ）**: ジョブ内の個別のタスク
- **Action（アクション）**: 再利用可能な処理のまとまり
- **Runner（ランナー）**: ワークフローを実行するサーバー

### 2.3 ワークフローの配置

ワークフローファイルは、リポジトリの特定のディレクトリに配置します：

```
your-repository/
├── .github/
│   └── workflows/
│       ├── ci-cd.yml          ← CI/CDワークフロー
│       ├── test.yml           ← テスト用ワークフロー
│       └── deploy.yml         ← デプロイ用ワークフロー
├── src/
├── package.json
└── ...
```

### 2.4 トリガー（Triggers）

ワークフローを実行するタイミングを指定します。

**主なトリガー:**

```yaml
# Pushトリガー（コードがプッシュされたとき）
on:
  push:
    branches: [ main, develop ]

# Pull Requestトリガー
on:
  pull_request:
    branches: [ main ]

# スケジュール実行（cronジョブ）
on:
  schedule:
    - cron: '0 0 * * *'  # 毎日0時

# 手動実行
on:
  workflow_dispatch:

# 複数のトリガー
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:
```

---

## 3. ワークフローの構文

### 3.1 基本構造

```yaml
name: ワークフロー名                    # ワークフローの名前（任意）

on:                                     # トリガー
  push:
    branches: [ main ]

jobs:                                   # ジョブ定義
  job-id:                               # ジョブID（任意の名前）
    runs-on: ubuntu-latest              # 実行環境

    steps:                              # ステップ定義
    - name: ステップ名                   # ステップの名前（任意）
      run: echo "Hello, World!"         # 実行するコマンド
```

### 3.2 詳細な構文解説

#### name（ワークフロー名）

```yaml
name: Dev Elite Academy CI/CD
```

GitHubのActionsタブに表示される名前です。

#### on（トリガー）

```yaml
on:
  push:
    branches: [ main, develop ]      # mainまたはdevelopブランチへのpush
    paths:                           # 特定のファイルが変更されたときのみ
      - 'src/**'
      - '!src/docs/**'               # src/docs/は除外
  pull_request:
    branches: [ main ]
    types: [ opened, synchronize ]   # PRが開かれたとき、更新されたとき
  workflow_dispatch:                 # 手動実行を許可
    inputs:                          # 手動実行時の入力パラメータ
      environment:
        description: 'デプロイ環境'
        required: true
        default: 'staging'
```

#### jobs（ジョブ定義）

```yaml
jobs:
  build:                              # ジョブID
    name: Build Application           # ジョブ名（表示用）
    runs-on: ubuntu-latest            # 実行環境

    strategy:                         # マトリックス戦略
      matrix:
        node-version: [18.x, 20.x]    # 複数バージョンでテスト

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
```

**実行環境の選択肢:**

- `ubuntu-latest` - Ubuntu Linux（最も一般的）
- `windows-latest` - Windows
- `macos-latest` - macOS
- `ubuntu-22.04` - 特定バージョン指定

#### steps（ステップ定義）

```yaml
steps:
  # 方法1: 既存のアクションを使用
  - name: Checkout code
    uses: actions/checkout@v4
    with:                             # アクションへのパラメータ
      fetch-depth: 0

  # 方法2: コマンドを直接実行
  - name: Run build
    run: npm run build

  # 方法3: 複数行のコマンド
  - name: Multiple commands
    run: |
      echo "Starting..."
      npm install
      npm test
```

### 3.3 条件分岐

```yaml
steps:
  - name: Deploy to production
    if: github.ref == 'refs/heads/main'    # mainブランチの場合のみ実行
    run: npm run deploy:prod

  - name: Deploy to staging
    if: github.ref == 'refs/heads/develop'
    run: npm run deploy:staging
```

**条件式の例:**

```yaml
# ブランチチェック
if: github.ref == 'refs/heads/main'

# イベントタイプチェック
if: github.event_name == 'push'

# ジョブの成功チェック
if: success()

# ジョブの失敗チェック
if: failure()

# 常に実行
if: always()

# 複数条件（AND）
if: success() && github.ref == 'refs/heads/main'

# 複数条件（OR）
if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop'
```

### 3.4 ジョブ間の依存関係

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Build
        run: npm run build

  test:
    needs: build                      # buildジョブの完了を待つ
    runs-on: ubuntu-latest
    steps:
      - name: Test
        run: npm test

  deploy:
    needs: [build, test]              # buildとtest両方の完了を待つ
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        run: npm run deploy
```

**依存関係の図:**
```
build
  ↓
test
  ↓
deploy
```

---

## 4. Jobs、Steps、Actions

### 4.1 Jobsの詳細

#### 並列実行 vs 順次実行

**並列実行（デフォルト）:**
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build

  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test

  lint:
    runs-on: ubuntu-latest
    steps:
      - run: npm run lint
```

この場合、build、test、lintは**同時に**実行されます。

**順次実行（needsを使用）:**
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build

  test:
    needs: build                    # buildの完了後に実行
    runs-on: ubuntu-latest
    steps:
      - run: npm test

  deploy:
    needs: [build, test]            # buildとtestの完了後に実行
    runs-on: ubuntu-latest
    steps:
      - run: npm run deploy
```

#### タイムアウト設定

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 30             # 30分でタイムアウト
    steps:
      - run: npm run build
```

### 4.2 Stepsの詳細

#### 複数行コマンド

```yaml
steps:
  - name: Install and Build
    run: |
      npm ci
      npm run build
      npm test
```

#### 作業ディレクトリの指定

```yaml
steps:
  - name: Build frontend
    working-directory: ./frontend
    run: npm run build
```

#### 環境変数の設定

```yaml
steps:
  - name: Build with env
    run: npm run build
    env:
      NODE_ENV: production
      API_URL: https://api.example.com
```

#### 出力の設定（次のステップで使用）

```yaml
steps:
  - name: Set version
    id: version
    run: echo "VERSION=$(node -p "require('./package.json').version")" >> $GITHUB_OUTPUT

  - name: Use version
    run: echo "Version is ${{ steps.version.outputs.VERSION }}"
```

### 4.3 Actionsの使用

Actionsは、再利用可能な処理のまとまりです。

#### 公式Actions

**1. actions/checkout@v4**
```yaml
- name: Checkout code
  uses: actions/checkout@v4
  with:
    fetch-depth: 0              # 全履歴を取得（デフォルトは1）
```

リポジトリのコードをクローンします。

**2. actions/setup-node@v4**
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20.x'
    cache: 'npm'                # npm cacheを有効化
```

Node.js環境をセットアップします。

**3. actions/cache@v4**
```yaml
- name: Cache dependencies
  uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

依存関係をキャッシュして、ビルド時間を短縮します。

**4. actions/upload-artifact@v4**
```yaml
- name: Upload build artifacts
  uses: actions/upload-artifact@v4
  with:
    name: build-output
    path: ./dist
```

ビルド成果物を保存します。

**5. actions/download-artifact@v4**
```yaml
- name: Download build artifacts
  uses: actions/download-artifact@v4
  with:
    name: build-output
    path: ./dist
```

保存した成果物をダウンロードします。

#### サードパーティActions

```yaml
# Vercel デプロイ
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

# Slack 通知
- name: Slack Notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

#### カスタムActionの作成

**ファイル: `.github/actions/my-action/action.yml`**
```yaml
name: 'My Custom Action'
description: 'カスタムアクションの例'
inputs:
  name:
    description: '名前'
    required: true
runs:
  using: 'node20'
  main: 'index.js'
```

**使用例:**
```yaml
- name: Run custom action
  uses: ./.github/actions/my-action
  with:
    name: 'John'
```

---

## 5. 環境変数とシークレット

### 5.1 環境変数

#### ワークフローレベル

```yaml
env:
  NODE_ENV: production              # 全ジョブで使用可能
  API_URL: https://api.example.com

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo $NODE_ENV
```

#### ジョブレベル

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    env:
      BUILD_ENV: staging            # このジョブ内でのみ使用可能
    steps:
      - run: echo $BUILD_ENV
```

#### ステップレベル

```yaml
steps:
  - name: Build
    run: npm run build
    env:
      NODE_OPTIONS: --max-old-space-size=4096
```

### 5.2 シークレット（Secrets）

機密情報（API キー、パスワード等）は、GitHubのSecretsに保存します。

#### シークレットの設定

1. GitHubリポジトリ → Settings → Secrets and variables → Actions
2. "New repository secret" をクリック
3. 名前と値を入力

#### シークレットの使用

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
      SUPABASE_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
      SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
    steps:
      - name: Deploy
        run: npm run deploy
```

**注意点:**
- シークレットはログに出力されません（自動的にマスクされます）
- Pull Requestからはアクセスできません（セキュリティ上の理由）

### 5.3 GitHub提供の環境変数

GitHub Actionsは、自動的に多くの環境変数を提供します。

```yaml
steps:
  - name: Print GitHub variables
    run: |
      echo "リポジトリ: ${{ github.repository }}"
      echo "ブランチ: ${{ github.ref }}"
      echo "コミットSHA: ${{ github.sha }}"
      echo "イベント: ${{ github.event_name }}"
      echo "アクター: ${{ github.actor }}"
```

**主な環境変数:**

| 変数 | 説明 | 例 |
|------|------|-----|
| `github.repository` | リポジトリ名 | `Gaku52/dev-elite-academy` |
| `github.ref` | ブランチ/タグ参照 | `refs/heads/main` |
| `github.sha` | コミットSHA | `ffac537e...` |
| `github.event_name` | トリガーイベント | `push`, `pull_request` |
| `github.actor` | 実行者 | `Gaku52` |
| `github.workspace` | ワークスペースパス | `/home/runner/work/...` |

---

## 6. 実践例：Dev Elite AcademyのCI/CD

### 6.1 ワークフロー全体像

**ファイル: `C:\Users\ganke\dev-elite-academy\.github\workflows\ci-cd.yml`**

```yaml
name: Dev Elite Academy CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

jobs:
  # ビルドとテストジョブ
  build-and-test:
    runs-on: ubuntu-latest

    env:
      NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
      NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
      SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js 20
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build application
      run: npm run build

    - name: Check build output
      run: |
        echo "✅ Build completed successfully"
        ls -la .next/

  # セキュリティ監査ジョブ
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
      run: npm audit --audit-level=critical || echo "Ignoring known false positives in development dependencies"

  # Vercelへのデプロイジョブ（本番環境）
  deploy-vercel:
    needs: [build-and-test, security-audit]
    runs-on: ubuntu-latest
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

  # 成功通知ジョブ
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

### 6.2 ワークフローの解説

#### トリガー設定

```yaml
on:
  push:
    branches: [ main, develop ]      # mainまたはdevelopへのpushで実行
  pull_request:
    branches: [ main ]               # mainへのPRで実行
  workflow_dispatch:                 # 手動実行も可能
```

**動作:**
- `main`または`develop`ブランチにコードがプッシュされると自動実行
- `main`ブランチへのPull Requestが作成されると自動実行
- GitHubのUIから手動で実行可能

#### Job 1: build-and-test

```yaml
build-and-test:
  runs-on: ubuntu-latest
  env:
    NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
    NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
    SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
```

**目的:**
- アプリケーションのビルドが成功するか確認
- 環境変数を設定してビルド実行

**ステップ詳細:**

1. **Checkout code**
```yaml
- name: Checkout code
  uses: actions/checkout@v4
```
リポジトリのコードをクローン

2. **Setup Node.js**
```yaml
- name: Setup Node.js 20
  uses: actions/setup-node@v4
  with:
    node-version: '20.x'
    cache: 'npm'
```
Node.js 20をインストールし、npmキャッシュを有効化

3. **Install dependencies**
```yaml
- name: Install dependencies
  run: npm ci
```
`npm ci`は`npm install`より高速で、`package-lock.json`から正確にインストール

4. **Build application**
```yaml
- name: Build application
  run: npm run build
```
Next.jsアプリケーションをビルド（`.next/`ディレクトリに出力）

5. **Check build output**
```yaml
- name: Check build output
  run: |
    echo "✅ Build completed successfully"
    ls -la .next/
```
ビルド結果を確認

#### Job 2: security-audit

```yaml
security-audit:
  runs-on: ubuntu-latest
```

**目的:**
- npmパッケージのセキュリティ脆弱性をチェック

**ステップ詳細:**

```yaml
- name: Run security audit
  run: npm audit --audit-level=critical || echo "Ignoring known false positives in development dependencies"
```

- `npm audit`: 依存パッケージの脆弱性スキャン
- `--audit-level=critical`: 重大な脆弱性のみチェック
- `|| echo ...`: エラーがあっても処理を続行（開発依存関係の既知の問題を無視）

#### Job 3: deploy-vercel

```yaml
deploy-vercel:
  needs: [build-and-test, security-audit]    # 前提ジョブ
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
```

**目的:**
- Vercelに本番環境をデプロイ

**条件:**
- `build-and-test`と`security-audit`が成功
- `main`ブランチへのpush時のみ実行

**ステップ詳細:**

1. **Install Vercel CLI**
```yaml
- name: Install Vercel CLI
  run: npm install --global vercel@latest
```

2. **Pull Vercel Environment Information**
```yaml
- name: Pull Vercel Environment Information
  run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
```
Vercelプロジェクトの設定情報を取得

3. **Build Project Artifacts**
```yaml
- name: Build Project Artifacts
  run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
```
Vercel用にビルド

4. **Deploy Project Artifacts**
```yaml
- name: Deploy Project Artifacts
  run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```
事前ビルドされた成果物をデプロイ

#### Job 4: success-notification

```yaml
success-notification:
  needs: [build-and-test, security-audit]
  if: success()
```

**目的:**
- CI/CDパイプラインの成功を通知

**条件:**
- `build-and-test`と`security-audit`が両方とも成功

### 6.3 ワークフローの実行フロー

```
Trigger (Push to main/develop or PR)
         ↓
   ┌─────────────────┐
   │  build-and-test │ ← 並列実行
   └────────┬────────┘
            │
   ┌────────┴────────┐
   │ security-audit  │ ← 並列実行
   └────────┬────────┘
            │
            ├─────────────────────────┐
            │                         │
   ┌────────▼────────┐    ┌──────────▼──────────┐
   │  deploy-vercel  │    │ success-notification │
   │  (条件付き実行)  │    │                     │
   └─────────────────┘    └─────────────────────┘
```

---

## 7. ビルド・テスト・デプロイプロセス

### 7.1 ビルドプロセス

**Dev Elite Academyのビルドコマンド:**

```json
// package.json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack",
    "start": "next start",
    "lint": "eslint",
    "typecheck": "tsc --noEmit"
  }
}
```

**ビルドステップの詳細:**

1. **依存関係インストール**
```bash
npm ci
```
- `package-lock.json`から正確にインストール
- `node_modules`を削除してクリーンインストール
- CI環境に最適化

2. **型チェック（オプション）**
```bash
npm run typecheck
```
- TypeScriptの型エラーをチェック
- コンパイルはせず、型チェックのみ

3. **リント（オプション）**
```bash
npm run lint
```
- ESLintでコード品質チェック
- コーディング規約違反を検出

4. **ビルド**
```bash
npm run build
```
- Next.jsアプリケーションをビルド
- `.next/`ディレクトリに出力
- 本番用に最適化（minify、tree-shaking等）

**ビルド時間の最適化:**

```yaml
- name: Cache node modules
  uses: actions/cache@v4
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}

- name: Install dependencies
  run: npm ci
```

キャッシュにより、2回目以降のビルドが高速化されます。

### 7.2 テストプロセス

**テスト戦略:**

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      # 単体テスト
      - name: Unit tests
        run: npm run test:unit

      # 統合テスト
      - name: Integration tests
        run: npm run test:integration

      # E2Eテスト
      - name: E2E tests
        run: npm run test:e2e
```

**テストカバレッジレポート:**

```yaml
- name: Run tests with coverage
  run: npm test -- --coverage

- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v4
  with:
    token: ${{ secrets.CODECOV_TOKEN }}
    files: ./coverage/lcov.info
```

### 7.3 デプロイプロセス

#### Vercelへのデプロイ

**ステージング環境:**
```yaml
deploy-staging:
  needs: [build, test]
  if: github.ref == 'refs/heads/develop'
  steps:
    - name: Deploy to Vercel (Staging)
      run: |
        vercel --token=${{ secrets.VERCEL_TOKEN }} \
               --scope=${{ secrets.VERCEL_ORG_ID }} \
               --confirm
```

**本番環境:**
```yaml
deploy-production:
  needs: [build, test]
  if: github.ref == 'refs/heads/main'
  steps:
    - name: Deploy to Vercel (Production)
      run: |
        vercel --prod \
               --token=${{ secrets.VERCEL_TOKEN }} \
               --scope=${{ secrets.VERCEL_ORG_ID }} \
               --confirm
```

#### 他のデプロイ先

**AWS S3 + CloudFront:**
```yaml
- name: Deploy to S3
  uses: jakejarvis/s3-sync-action@master
  with:
    args: --delete
  env:
    AWS_S3_BUCKET: ${{ secrets.AWS_S3_BUCKET }}
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

- name: Invalidate CloudFront
  uses: chetan/invalidate-cloudfront-action@v2
  env:
    DISTRIBUTION: ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }}
    PATHS: '/*'
    AWS_REGION: 'us-east-1'
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

**Netlify:**
```yaml
- name: Deploy to Netlify
  uses: nwtgck/actions-netlify@v3
  with:
    publish-dir: './out'
    production-deploy: true
  env:
    NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
    NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### 7.4 ロールバック戦略

**バージョンタグを使ったデプロイ:**

```yaml
- name: Create Release
  id: create_release
  uses: actions/create-release@v1
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    tag_name: v${{ github.run_number }}
    release_name: Release v${{ github.run_number }}

- name: Deploy with version tag
  run: |
    vercel --prod \
           --token=${{ secrets.VERCEL_TOKEN }} \
           --meta version=v${{ github.run_number }}
```

**手動ロールバック:**
Vercelダッシュボードから前のデプロイに戻す。

### 7.5 通知とモニタリング

**Slack通知:**
```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: |
      Deployment ${{ job.status }}
      Branch: ${{ github.ref }}
      Commit: ${{ github.sha }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

**メール通知:**
```yaml
- name: Send email notification
  if: failure()
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.EMAIL_USERNAME }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: 'CI/CD Failed: ${{ github.repository }}'
    body: 'Build failed on branch ${{ github.ref }}'
    to: team@example.com
```

---

## 8. 理解度チェック

### 8.1 基礎問題

**Q1:** CI/CDの「CI」と「CD」はそれぞれ何の略ですか？また、その目的は何ですか？

**Q2:** GitHub Actionsのワークフローファイルはどのディレクトリに配置しますか？

**Q3:** 以下のワークフローは、どのタイミングで実行されますか？
```yaml
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
```

**Q4:** `needs`キーワードの役割は何ですか？

**Q5:** `npm install`と`npm ci`の違いは何ですか？

### 8.2 実践問題

**Q6:** 以下の要件を満たすワークフローを作成してください：
- `main`ブランチへのプッシュで実行
- Node.js 20を使用
- 依存関係をインストール
- ビルドを実行
- テストを実行

**Q7:** Q6のワークフローに、以下の機能を追加してください：
- ビルド成功後にVercelにデプロイ
- デプロイは`main`ブランチのみ

**Q8:** セキュリティ上、APIキーをどのように扱うべきですか？コード例を示してください。

**Q9:** 複数のNode.jsバージョン（18、20、22）でテストを実行するワークフローを作成してください。

**Q10:** ビルド時間を短縮するため、`node_modules`をキャッシュする設定を追加してください。

### 8.3 応用問題

**Q11:** Dev Elite Academyのワークフローで、`security-audit`ジョブはなぜ並列実行されているのですか？順次実行にした場合のメリット・デメリットを説明してください。

**Q12:** Pull Requestでのみコードレビュー用の軽量ビルドを実行し、`main`へのマージ時には完全なビルドとデプロイを実行するワークフローを設計してください。

**Q13:** デプロイ失敗時に自動的に前のバージョンにロールバックする仕組みを設計してください（疑似コード可）。

**Q14:** モノレポ（複数のプロジェクトが1つのリポジトリにある）で、変更されたプロジェクトのみビルド・デプロイする仕組みを設計してください。

**Q15:** GitHub Actionsのコスト最適化のため、以下の点を考慮したワークフローを提案してください：
- 不要な実行を減らす
- ビルド時間を短縮
- 並列実行を活用

### 8.4 友達に説明できるかチェック

以下の項目を、技術知識のない友達に説明できますか？

- [ ] CI/CDが何のためにあるのか
- [ ] 自動テストの重要性
- [ ] なぜ手動デプロイより自動デプロイが良いのか
- [ ] GitHub Actionsが何をしているのか
- [ ] デプロイ失敗時にどうなるのか

### 8.5 技術面接準備

以下の質問に自信を持って答えられますか？

- [ ] CI/CDのメリットを3つ以上説明できる
- [ ] GitHub Actionsと他のCI/CDツールの違いを説明できる
- [ ] ワークフローの最適化手法を説明できる
- [ ] シークレットの安全な管理方法を説明できる
- [ ] デプロイ戦略（Blue-Green、Canary等）を説明できる
- [ ] ロールバック手順を説明できる
- [ ] キャッシュ戦略を説明できる

---

## 参考リソース

### 公式ドキュメント
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow syntax for GitHub Actions](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)

### 学習リソース
- [GitHub Actions Tutorial](https://docs.github.com/en/actions/quickstart)
- [Awesome GitHub Actions](https://github.com/sdras/awesome-actions)

### コミュニティ
- [GitHub Community Forum](https://github.community/)
- [Stack Overflow - GitHub Actions](https://stackoverflow.com/questions/tagged/github-actions)

---

## まとめ

このドキュメントでは、CI/CDとGitHub Actionsについて学習しました：

1. **CI/CDの基礎**: 継続的インテグレーションとデリバリーの概念
2. **GitHub Actions**: 構成要素とアーキテクチャ
3. **ワークフロー構文**: YAML形式での設定方法
4. **Jobs/Steps/Actions**: ワークフローの構成要素
5. **環境変数とシークレット**: 機密情報の安全な管理
6. **実践例**: Dev Elite Academyの実際のワークフロー
7. **プロセス**: ビルド、テスト、デプロイの流れ

CI/CDを導入することで、開発チームの生産性が向上し、より安全で迅速なリリースが可能になります！
