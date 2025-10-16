import { SpecificationCategory } from '@/types/specifications';

export const specificationCategories: SpecificationCategory[] = [
  {
    id: 'system-design',
    name: 'システム設計書',
    description: 'システム全体の設計に関するドキュメント',
    documents: [
      {
        id: 'learning-system-spec',
        title: '学習システム仕様書',
        description: 'Dev Elite Academy 学習システムの詳細仕様',
        category: 'system-design',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-15',
        sections: [
          {
            title: '1. システム概要',
            order: 1,
            content: `## 1.1 目的

Dev Elite Academyは、高年収エンジニアを目指すための総合学習プラットフォームです。
本システムは以下の目的を持っています：

- IT基礎資格から専門技術まで体系的に学習できる環境の提供
- 実践的なスキル習得を支援する機能の実装
- 学習進捗の可視化とモチベーション維持の仕組み

## 1.2 システム構成

### フロントエンド
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4

### バックエンド
- Supabase (認証・データベース)
- PostgreSQL
- Prisma ORM

### デプロイ・CI/CD
- Vercel (ホスティング)
- GitHub Actions (CI/CD)`,
          },
          {
            title: '2. 機能要件',
            order: 2,
            content: `## 2.1 学習モジュール機能

### 基本情報技術者試験対策
- 8つの分野別学習コンテンツ
- 各分野ごとの理解度チェック問題
- 進捗管理と完了状況の記録

### DevOps・AWS学習
- 実践的なハンズオン教材
- 環境構築ガイド
- プロジェクト型演習

### AI・機械学習
- 理論から実装までの学習パス
- Pythonを使った実習
- モデル構築演習

### セキュリティ
- 脅威分析と対策
- セキュアコーディング
- ペネトレーションテスト基礎

### システム設計
- アーキテクチャパターン
- 設計原則とベストプラクティス
- ケーススタディ

## 2.2 進捗管理機能

- ユーザーごとの学習進捗記録
- モジュール別完了率の表示
- 達成状況のビジュアライゼーション

## 2.3 認証・アカウント管理

- Supabase Authを使用した認証
- メール認証とパスワードリセット
- ソーシャルログイン対応（将来実装）`,
          },
          {
            title: '3. 非機能要件',
            order: 3,
            content: `## 3.1 パフォーマンス要件

- ページロード時間: 3秒以内（LCP）
- インタラクティブまでの時間: 100ms以内（FID）
- レイアウトシフト: 0.1以下（CLS）

## 3.2 可用性要件

- システム稼働率: 99.9%以上
- 計画メンテナンス: 月1回、深夜時間帯

## 3.3 セキュリティ要件

- HTTPS通信の強制
- SQLインジェクション対策
- XSS対策
- CSRF対策
- 適切な認証・認可の実装

## 3.4 ユーザビリティ要件

- レスポンシブデザイン対応
- モバイルファーストUI
- ダークモード対応
- アクセシビリティ配慮（WCAG 2.1 AA準拠）`,
          },
          {
            title: '4. データベース設計',
            order: 4,
            content: `## 4.1 テーブル定義

### users テーブル
- id: UUID (PK)
- email: VARCHAR(255)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

### learning_progress テーブル
- id: BIGSERIAL (PK)
- user_id: UUID (FK -> users)
- module_type: VARCHAR(50)
- section_key: VARCHAR(100)
- is_completed: BOOLEAN
- completed_at: TIMESTAMP
- created_at: TIMESTAMP

### インデックス
- learning_progress(user_id, module_type)
- learning_progress(section_key)

## 4.2 データ整合性

- 外部キー制約による参照整合性の保証
- トランザクション処理の適用
- ユニーク制約による重複防止`,
          },
          {
            title: '5. API設計',
            order: 5,
            content: `## 5.1 学習進捗API

### GET /api/learning-progress
ユーザーの学習進捗を取得

**パラメータ:**
- moduleType: string (optional) - モジュールタイプでフィルタ

**レスポンス:**
\`\`\`json
{
  "progress": [
    {
      "id": 123,
      "module_type": "network",
      "section_key": "0-0-0",
      "is_completed": true,
      "completed_at": "2025-01-15T10:00:00Z"
    }
  ]
}
\`\`\`

### POST /api/learning-progress
学習進捗を保存

**リクエストボディ:**
\`\`\`json
{
  "moduleType": "network",
  "sectionKey": "0-0-0",
  "isCompleted": true,
  "isCorrect": true
}
\`\`\`

## 5.2 仕様書API

### GET /api/specifications
仕様書一覧を取得

### GET /api/specifications/:id/content
特定の仕様書コンテンツを取得`,
          },
        ],
      },
    ],
  },
  {
    id: 'architecture',
    name: 'アーキテクチャ設計',
    description: 'システムアーキテクチャに関する設計書',
    documents: [
      {
        id: 'frontend-architecture',
        title: 'フロントエンドアーキテクチャ',
        description: 'Next.js アプリケーションのアーキテクチャ設計',
        category: 'architecture',
        createdAt: '2025-01-10',
        updatedAt: '2025-01-20',
        sections: [
          {
            title: '1. アーキテクチャ概要',
            order: 1,
            content: `## 1.1 設計方針

### App Router採用
- Next.js 15のApp Routerを採用
- Server ComponentsとClient Componentsの適切な分離
- ストリーミングとサスペンスの活用

### コンポーネント設計
- Atomic Designの原則に基づく階層構造
- 再利用可能なコンポーネントライブラリの構築
- propsの型安全性の徹底

## 1.2 ディレクトリ構造

\`\`\`
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 認証関連ルート
│   ├── modules/           # 学習モジュール
│   ├── specifications/    # 仕様書・設計書
│   └── api/              # APIルート
├── components/            # 共通コンポーネント
│   ├── ui/               # UIプリミティブ
│   ├── learning/         # 学習機能
│   └── documents/        # ドキュメント表示
├── data/                 # 静的データ
├── hooks/                # カスタムフック
├── lib/                  # ユーティリティ
└── types/                # 型定義
\`\`\``,
          },
          {
            title: '2. コンポーネント設計',
            order: 2,
            content: `## 2.1 コンポーネント分類

### Atoms (原子)
- Button, Input, Label など基本的なUI要素
- スタイリングのみを持ち、ビジネスロジックは含まない

### Molecules (分子)
- FormField, SearchBar など、複数のAtomsを組み合わせた要素
- 限定的な機能を持つ

### Organisms (生体)
- Header, Sidebar, QuizComponent など、独立した機能単位
- 複数のMoleculesとAtomsで構成

### Templates
- ページ全体のレイアウト構造
- コンテンツは含まず、配置のみを定義

### Pages
- 実際のページコンポーネント
- データフェッチングとステート管理

## 2.2 状態管理

### クライアントステート
- React Hooksによるローカルステート
- useStateとuseReducerの使い分け

### サーバーステート
- Server Componentsでのデータフェッチ
- 必要に応じてSWRやReact Queryの検討

### グローバルステート
- コンテキストAPIの活用
- 最小限のグローバルステート`,
          },
          {
            title: '3. パフォーマンス最適化',
            order: 3,
            content: `## 3.1 レンダリング最適化

### Server Components優先
- デフォルトはServer Componentsとして実装
- インタラクティブな部分のみClient Components化
- 'use client'ディレクティブの適切な配置

### コード分割
- 動的インポートの活用
- next/dynamicによる遅延ロード
- ルートベースのコード分割

## 3.2 画像最適化

### next/imageの活用
- 自動的な画像最適化
- レスポンシブ画像の生成
- 遅延読み込み

## 3.3 データフェッチング

### 並列フェッチング
- Promise.allによる並列化
- ウォーターフォールの回避

### キャッシング戦略
- fetch APIのcacheオプション活用
- revalidateによる適切な再検証`,
          },
        ],
      },
    ],
  },
  {
    id: 'database-design',
    name: 'データベース設計',
    description: 'データベーススキーマと設計書',
    documents: [
      {
        id: 'db-schema',
        title: 'データベーススキーマ設計書',
        description: 'PostgreSQLデータベースのスキーマ定義',
        category: 'database-design',
        createdAt: '2025-01-05',
        updatedAt: '2025-01-18',
        sections: [
          {
            title: '1. データベース設計方針',
            order: 1,
            content: `## 1.1 設計原則

### 正規化
- 第3正規形までの正規化を基本とする
- パフォーマンスが必要な場合は意図的な非正規化も検討
- データの整合性を最優先

### 命名規約
- テーブル名: snake_case、複数形
- カラム名: snake_case、単数形
- 主キー: id (UUID推奨)
- 外部キー: {参照テーブル名}_id
- タイムスタンプ: created_at, updated_at

### インデックス戦略
- 主キーには自動的にインデックスが作成される
- 外部キーにはインデックスを作成
- 頻繁に検索されるカラムにインデックスを作成
- 複合インデックスの活用`,
          },
          {
            title: '2. テーブル定義',
            order: 2,
            content: `## 2.1 users テーブル

ユーザー情報を管理

\`\`\`sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
\`\`\`

## 2.2 learning_progress テーブル

学習進捗を記録

\`\`\`sql
CREATE TABLE learning_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_type VARCHAR(50) NOT NULL,
  section_key VARCHAR(100) NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  is_correct BOOLEAN,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, module_type, section_key)
);

CREATE INDEX idx_learning_progress_user_module
  ON learning_progress(user_id, module_type);
CREATE INDEX idx_learning_progress_section
  ON learning_progress(section_key);
\`\`\`

## 2.3 user_profiles テーブル

ユーザープロフィール情報

\`\`\`sql
CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  avatar_url VARCHAR(500),
  github_url VARCHAR(255),
  linkedin_url VARCHAR(255),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
\`\`\``,
          },
          {
            title: '3. リレーションシップ',
            order: 3,
            content: `## 3.1 テーブル関連図

\`\`\`
users (1) ----< (N) learning_progress
  |
  | (1)
  |
  | (1)
user_profiles
\`\`\`

## 3.2 制約

### 外部キー制約
- learning_progress.user_id -> users.id
  - ON DELETE CASCADE: ユーザー削除時に進捗も削除
- user_profiles.user_id -> users.id
  - ON DELETE CASCADE: ユーザー削除時にプロフィールも削除

### ユニーク制約
- users.email: メールアドレスの重複防止
- learning_progress(user_id, module_type, section_key):
  同一ユーザーの同一セクションの重複記録防止`,
          },
          {
            title: '4. セキュリティ',
            order: 4,
            content: `## 4.1 Row Level Security (RLS)

Supabaseの機能を活用したアクセス制御

### users テーブル
\`\`\`sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);
\`\`\`

### learning_progress テーブル
\`\`\`sql
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON learning_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON learning_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON learning_progress FOR UPDATE
  USING (auth.uid() = user_id);
\`\`\`

## 4.2 機密情報の保護

- パスワードは必ずハッシュ化（Supabase Authが自動処理）
- APIキーなどは環境変数で管理
- データベース接続文字列は暗号化`,
          },
        ],
      },
    ],
  },
];

export function getAllSpecifications() {
  return specificationCategories;
}

export function getSpecificationById(id: string) {
  for (const category of specificationCategories) {
    const doc = category.documents.find((d) => d.id === id);
    if (doc) return doc;
  }
  return null;
}

export function getSpecificationsByCategory(categoryId: string) {
  return specificationCategories.find((c) => c.id === categoryId);
}
