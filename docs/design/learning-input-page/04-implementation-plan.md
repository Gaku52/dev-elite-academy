# 学習インプットページ - 実装計画書

## 📋 ドキュメント情報
- **作成日**: 2025-10-07
- **バージョン**: 1.0
- **関連**: [要件定義書](./01-requirements.md) | [画面設計書](./02-screen-design.md) | [コンテンツ構成書](./03-content-structure.md)

---

## 🎯 実装方針

### 基本原則
1. **段階的実装**: MVP → 機能拡張 → 最適化
2. **既存コード活用**: 現在の問題演習ページを流用
3. **型安全性**: TypeScript を徹底活用
4. **テスト**: 動作確認しながら進める

---

## 📅 実装スケジュール

### Phase 1: MVP実装（1週間）

#### Day 1-2: 基盤構築
- [x] 設計ドキュメント作成
- [ ] 型定義ファイル作成
- [ ] コンテンツデータ構造作成
- [ ] 共通コンポーネント実装

#### Day 3-4: コアUI実装
- [ ] タブナビゲーション実装
- [ ] 学習コンテンツ表示コンポーネント
- [ ] 目次コンポーネント
- [ ] レスポンシブ対応

#### Day 5-6: コンテンツ作成
- [ ] 「コンピュータシステム」の学習コンテンツ作成
- [ ] 図解・イラスト追加
- [ ] 例題作成

#### Day 7: テスト・調整
- [ ] 動作確認
- [ ] UI/UX調整
- [ ] パフォーマンス最適化

---

### Phase 2: 機能拡張（2週間）

#### Week 2: 残りコンテンツ作成
- [ ] 8分野すべてのコンテンツ作成
- [ ] 進捗管理機能実装
- [ ] セクション完了マーク機能

#### Week 3: 高度な機能
- [ ] ブックマーク機能
- [ ] 検索機能
- [ ] 学習時間トラッキング

---

### Phase 3: 最適化・拡張（1週間以降）
- [ ] パフォーマンス最適化
- [ ] アクセシビリティ改善
- [ ] PWA対応（別タスク）

---

## 🛠️ 技術スタック

### 使用技術
- **フレームワーク**: Next.js 15 (App Router) ✅
- **言語**: TypeScript ✅
- **スタイリング**: Tailwind CSS 4 ✅
- **UI コンポーネント**: Radix UI ✅
- **アニメーション**: Framer Motion ✅
- **Markdown**: react-markdown または marked
- **状態管理**: React Context + Supabase
- **図解**: Mermaid.js (オプション)

### 新規インストールが必要なパッケージ

```bash
npm install react-markdown remark-gfm rehype-highlight
npm install @types/react-markdown --save-dev
```

---

## 📁 ファイル構成

```
dev-elite-academy/
├── docs/
│   └── design/
│       └── learning-input-page/          ← 設計書（完了）
│           ├── 01-requirements.md
│           ├── 02-screen-design.md
│           ├── 03-content-structure.md
│           └── 04-implementation-plan.md
│
├── src/
│   ├── app/
│   │   └── modules/
│   │       └── it-fundamentals/
│   │           └── [module]/
│   │               ├── page.tsx              ← 統合ページ（タブ）
│   │               └── components/           ← ページ専用コンポーネント
│   │                   ├── TabNavigation.tsx
│   │                   ├── LearningTab.tsx
│   │                   ├── QuizTab.tsx
│   │                   └── StatsTab.tsx
│   │
│   ├── components/
│   │   └── learning/                        ← 共通コンポーネント
│   │       ├── TableOfContents.tsx
│   │       ├── LearningContent.tsx
│   │       ├── KeyPointsBox.tsx
│   │       ├── ExampleQuestion.tsx
│   │       ├── CheckQuestion.tsx
│   │       ├── ProgressTracker.tsx
│   │       └── SectionCompleteButton.tsx
│   │
│   ├── lib/
│   │   └── learning-content/                ← コンテンツデータ
│   │       ├── types.ts                     ← 型定義
│   │       ├── computer-systems.ts          ← コンテンツ
│   │       ├── algorithms-programming.ts
│   │       ├── database.ts
│   │       ├── network.ts
│   │       ├── security.ts
│   │       ├── system-development.ts
│   │       ├── management-legal.ts
│   │       └── strategy.ts
│   │
│   └── hooks/
│       ├── useLearningContent.ts            ← コンテンツ取得
│       └── useSectionProgress.ts            ← 進捗管理
│
└── public/
    └── images/
        └── learning/                         ← 図解画像
            ├── computer-systems/
            ├── algorithms/
            └── ...
```

---

## 🔨 実装詳細

### ステップ1: 型定義ファイル作成

**ファイル**: `src/lib/learning-content/types.ts`

```typescript
export interface LearningModule {
  id: string;
  title: string;
  category: 'technology' | 'management' | 'strategy';
  icon: string;
  description: string;
  sections: Section[];
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Section {
  id: string;
  title: string;
  order: number;
  subsections: Subsection[];
  estimatedTime: number;
}

export interface Subsection {
  id: string;
  title: string;
  order: number;
  content: Content;
}

export interface Content {
  introduction: string;
  mainText: string;
  diagrams?: Diagram[];
  keyPoints: string[];
  examples?: Example[];
  relatedLinks?: Link[];
  checkQuestions?: CheckQuestion[];
}

// その他の型定義...
```

---

### ステップ2: サンプルコンテンツ作成

**ファイル**: `src/lib/learning-content/computer-systems.ts`

```typescript
import { LearningModule } from './types';

export const computerSystemsModule: LearningModule = {
  id: 'computer-systems',
  title: 'コンピュータシステム',
  category: 'technology',
  icon: '💻',
  description: 'ハードウェア、ソフトウェア、システム構成の基礎知識',
  estimatedTime: 180, // 3時間
  difficulty: 'beginner',
  sections: [
    {
      id: 'basic-structure',
      title: 'コンピュータの基本構成',
      order: 1,
      estimatedTime: 45,
      subsections: [
        {
          id: 'five-devices',
          title: '五大装置',
          order: 1,
          content: {
            introduction: 'コンピュータは5つの基本装置で構成されています...',
            mainText: `
## 五大装置とは

コンピュータの五大装置は以下の通りです：

1. **入力装置**
2. **出力装置**
3. **記憶装置**
4. **演算装置**
5. **制御装置**
            `,
            keyPoints: [
              'コンピュータは5つの基本装置で構成される',
              '入力→処理→出力の流れが基本',
              'CPUは演算装置と制御装置を含む'
            ],
            examples: [
              {
                id: 'example-1',
                question: 'キーボードで文字を入力し、画面に表示される過程は？',
                answer: '入力装置→制御装置→演算装置→記憶装置→出力装置',
                explanation: '各装置が順序良く連携して動作します。',
                collapsible: true
              }
            ]
          }
        }
      ]
    }
  ]
};
```

---

### ステップ3: 共通コンポーネント実装

#### コンポーネント1: TableOfContents

**ファイル**: `src/components/learning/TableOfContents.tsx`

```typescript
'use client';

import { useState } from 'react';
import { CheckCircle, Circle, ChevronDown, ChevronRight } from 'lucide-react';
import type { Section } from '@/lib/learning-content/types';

interface Props {
  sections: Section[];
  currentSectionId: string;
  completedSections: Set<string>;
  onNavigate: (sectionId: string, subsectionId: string) => void;
}

export function TableOfContents({
  sections,
  currentSectionId,
  completedSections,
  onNavigate
}: Props) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set([currentSectionId])
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  return (
    <nav className="sticky top-4 bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        📚 目次
      </h3>

      <div className="space-y-2">
        {sections.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          const completedCount = section.subsections.filter(
            sub => completedSections.has(sub.id)
          ).length;

          return (
            <div key={section.id}>
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded"
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  <span className="font-medium">{section.title}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {completedCount}/{section.subsections.length}
                </span>
              </button>

              {isExpanded && (
                <div className="ml-6 mt-1 space-y-1">
                  {section.subsections.map((subsection) => {
                    const isCompleted = completedSections.has(subsection.id);
                    const isCurrent = currentSectionId === subsection.id;

                    return (
                      <button
                        key={subsection.id}
                        onClick={() => onNavigate(section.id, subsection.id)}
                        className={`w-full flex items-center gap-2 p-2 text-sm rounded ${
                          isCurrent ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-300" />
                        )}
                        <span>{subsection.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
```

---

#### コンポーネント2: LearningContent

**ファイル**: `src/components/learning/LearningContent.tsx`

```typescript
'use client';

import ReactMarkdown from 'react-markdown';
import { KeyPointsBox } from './KeyPointsBox';
import { ExampleQuestion } from './ExampleQuestion';
import type { Content } from '@/lib/learning-content/types';

interface Props {
  content: Content;
  subsectionId: string;
  isCompleted: boolean;
  onComplete: () => void;
}

export function LearningContent({
  content,
  subsectionId,
  isCompleted,
  onComplete
}: Props) {
  return (
    <article className="prose prose-lg max-w-none">
      {/* 導入 */}
      <div className="text-gray-600 italic mb-6">
        {content.introduction}
      </div>

      {/* 本文 */}
      <ReactMarkdown>{content.mainText}</ReactMarkdown>

      {/* 図解 */}
      {content.diagrams?.map((diagram) => (
        <div key={diagram.id} className="my-8">
          <img
            src={diagram.src}
            alt={diagram.alt}
            className="w-full rounded-lg shadow-md"
          />
          {diagram.caption && (
            <p className="text-center text-sm text-gray-500 mt-2">
              {diagram.caption}
            </p>
          )}
        </div>
      ))}

      {/* 重要ポイント */}
      {content.keyPoints.length > 0 && (
        <KeyPointsBox points={content.keyPoints} />
      )}

      {/* 例題 */}
      {content.examples?.map((example) => (
        <ExampleQuestion key={example.id} example={example} />
      ))}

      {/* 完了ボタン */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <button
          onClick={onComplete}
          disabled={isCompleted}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
            isCompleted
              ? 'bg-green-100 text-green-700 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isCompleted ? '✓ 完了済み' : '✓ このセクションを完了にする'}
        </button>
      </div>
    </article>
  );
}
```

---

### ステップ4: メインページ統合

**ファイル**: `src/app/modules/it-fundamentals/computer-systems/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';
import { TableOfContents } from '@/components/learning/TableOfContents';
import { LearningContent } from '@/components/learning/LearningContent';
import { computerSystemsModule } from '@/lib/learning-content/computer-systems';

export default function ComputerSystemsPage() {
  const [activeTab, setActiveTab] = useState('learn');
  const [currentSubsectionId, setCurrentSubsectionId] = useState(
    computerSystemsModule.sections[0].subsections[0].id
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="container-modern py-8">
        {/* ヘッダー */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold">
            {computerSystemsModule.title}
          </h1>
          <p className="text-gray-600 mt-2">
            {computerSystemsModule.description}
          </p>
        </header>

        {/* タブ */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex gap-2 border-b mb-8">
            <TabsTrigger value="learn" className="tab-trigger">
              📖 学習
            </TabsTrigger>
            <TabsTrigger value="quiz" className="tab-trigger">
              ✍️ 演習
            </TabsTrigger>
            <TabsTrigger value="stats" className="tab-trigger">
              📊 統計
            </TabsTrigger>
          </TabsList>

          {/* 学習タブ */}
          <TabsContent value="learn">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* 目次 */}
              <aside className="lg:col-span-1">
                <TableOfContents
                  sections={computerSystemsModule.sections}
                  currentSectionId={currentSubsectionId}
                  completedSections={new Set()}
                  onNavigate={(sectionId, subsectionId) => {
                    setCurrentSubsectionId(subsectionId);
                  }}
                />
              </aside>

              {/* コンテンツ */}
              <main className="lg:col-span-3">
                <LearningContent
                  content={getCurrentContent()}
                  subsectionId={currentSubsectionId}
                  isCompleted={false}
                  onComplete={() => {}}
                />
              </main>
            </div>
          </TabsContent>

          {/* 演習タブ（既存） */}
          <TabsContent value="quiz">
            {/* 既存の問題演習コンポーネント */}
          </TabsContent>

          {/* 統計タブ */}
          <TabsContent value="stats">
            {/* 統計表示（将来実装） */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
```

---

## ✅ 実装チェックリスト

### Phase 1: MVP（1週間）

#### 基盤構築
- [ ] `src/lib/learning-content/types.ts` 作成
- [ ] `src/lib/learning-content/computer-systems.ts` 作成
- [ ] react-markdown インストール

#### コンポーネント実装
- [ ] `TableOfContents` コンポーネント
- [ ] `LearningContent` コンポーネント
- [ ] `KeyPointsBox` コンポーネント
- [ ] `ExampleQuestion` コンポーネント
- [ ] Radix UI Tabs 統合

#### ページ統合
- [ ] 既存ページにタブ追加
- [ ] 学習タブのレイアウト実装
- [ ] レスポンシブ対応

#### コンテンツ作成
- [ ] コンピュータシステムの4セクション作成
- [ ] 重要ポイント記述
- [ ] 例題作成

#### テスト
- [ ] PC表示確認
- [ ] モバイル表示確認
- [ ] タブ切り替え動作確認
- [ ] 目次ナビゲーション確認

---

## 🚀 デプロイ計画

### 開発環境
1. ローカルで動作確認
2. git commit & push
3. GitHub Actions で自動ビルド

### 本番環境
1. ogadix.com に自動デプロイ
2. 動作確認
3. ユーザーフィードバック収集

---

## 📊 成功指標

### 技術指標
- [ ] ページ読み込み速度: 2秒以内
- [ ] Lighthouse スコア: 90点以上
- [ ] TypeScript エラー: 0件
- [ ] ビルドエラー: 0件

### ユーザー指標
- [ ] 学習完了率: 50% → 70%
- [ ] 平均学習時間: 30分/分野
- [ ] 問題正答率: 40% → 60%

---

## 🔄 次のステップ

1. **実装開始**: この設計書に基づいて実装
2. **進捗報告**: 毎日の進捗を共有
3. **問題解決**: 詰まったら相談
4. **レビュー**: 完成後にコードレビュー

---

## 📝 変更履歴

| 日付 | バージョン | 変更内容 | 担当者 |
|------|-----------|---------|--------|
| 2025-10-07 | 1.0 | 初版作成 | Claude |
