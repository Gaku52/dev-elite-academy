# 学習インプットページ - コンテンツ構成・データ構造設計書

## 📋 ドキュメント情報
- **作成日**: 2025-10-07
- **バージョン**: 1.0
- **関連**: [要件定義書](./01-requirements.md) | [画面設計書](./02-screen-design.md)

---

## 📚 コンテンツ構成方針

### 学習コンテンツの原則
1. **段階的学習**: 易→難の順序
2. **具体例重視**: 抽象概念には必ず例を添える
3. **視覚的理解**: 図解・表を積極的に使用
4. **反復学習**: 重要ポイントを繰り返し提示

---

## 🗂️ コンテンツ階層構造

### レベル1: モジュール（8分野）

```
基本情報技術者試験
├── 1. コンピュータシステム（テクノロジ系）
├── 2. アルゴリズムとプログラミング（テクノロジ系）
├── 3. データベース（テクノロジ系）
├── 4. ネットワーク（テクノロジ系）
├── 5. セキュリティ（テクノロジ系）
├── 6. システム開発（マネジメント系）
├── 7. 経営・法務（ストラテジ系）
└── 8. ストラテジ（ストラテジ系）
```

---

### レベル2: セクション（各モジュール内）

例: コンピュータシステム

```
コンピュータシステム
├── 1. コンピュータの基本構成
│   ├── 1-1. 五大装置
│   ├── 1-2. フォン・ノイマン型
│   └── 1-3. プログラム内蔵方式
│
├── 2. CPU（中央処理装置）
│   ├── 2-1. 制御装置
│   ├── 2-2. 演算装置（ALU）
│   ├── 2-3. レジスタ
│   └── 2-4. キャッシュメモリ
│
├── 3. メモリ
│   ├── 3-1. 主記憶装置（RAM/ROM）
│   ├── 3-2. 仮想記憶
│   └── 3-3. メモリ管理
│
└── 4. 記憶装置
    ├── 4-1. ハードディスク（HDD）
    ├── 4-2. SSD
    ├── 4-3. 光学ディスク
    └── 4-4. RAID
```

---

### レベル3: コンテンツ要素（各セクション内）

```
セクション: 「五大装置」
├── 📝 導入（概要説明）
├── 📖 本文（詳細解説）
├── 🖼️ 図解
├── 📌 重要ポイント
├── 💡 例題
├── 🔗 関連リンク
└── ✅ 確認問題
```

---

## 📦 データ構造設計

### TypeScript型定義

```typescript
// モジュール全体の型
interface LearningModule {
  id: string;                    // 'computer-systems'
  title: string;                 // 'コンピュータシステム'
  category: 'technology' | 'management' | 'strategy';
  icon: string;                  // 絵文字またはアイコン名
  description: string;           // 概要説明
  sections: Section[];           // セクション配列
  estimatedTime: number;         // 推定学習時間（分）
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// セクションの型
interface Section {
  id: string;                    // 'section-1'
  title: string;                 // '五大装置'
  order: number;                 // 表示順序
  subsections: Subsection[];     // サブセクション配列
  estimatedTime: number;         // 推定学習時間（分）
}

// サブセクションの型
interface Subsection {
  id: string;                    // 'subsection-1-1'
  title: string;                 // '入力装置'
  order: number;                 // 表示順序
  content: Content;              // コンテンツ本体
}

// コンテンツの型
interface Content {
  introduction: string;          // 導入文（Markdown）
  mainText: string;              // 本文（Markdown）
  diagrams?: Diagram[];          // 図解配列
  keyPoints: string[];           // 重要ポイント配列
  examples?: Example[];          // 例題配列
  relatedLinks?: Link[];         // 関連リンク配列
  checkQuestions?: CheckQuestion[]; // 確認問題配列
}

// 図解の型
interface Diagram {
  id: string;
  type: 'image' | 'mermaid' | 'svg';
  src?: string;                  // 画像の場合のURL
  code?: string;                 // Mermaidコードの場合
  alt: string;                   // 代替テキスト
  caption?: string;              // キャプション
}

// 例題の型
interface Example {
  id: string;
  question: string;              // 問題文
  answer: string;                // 解答
  explanation: string;           // 解説
  collapsible: boolean;          // 折りたたみ可能か
}

// 確認問題の型
interface CheckQuestion {
  id: string;
  question: string;              // 問題文
  options: string[];             // 選択肢
  correctAnswer: number;         // 正解のインデックス
  explanation: string;           // 解説
  difficulty: 'easy' | 'medium' | 'hard';
}

// 関連リンクの型
interface Link {
  title: string;
  url: string;
  type: 'internal' | 'external';
}

// 進捗管理の型
interface LearningProgress {
  userId: string;
  moduleId: string;
  sectionId: string;
  subsectionId: string;
  completed: boolean;
  completedAt?: Date;
  timeSpent: number;             // 学習時間（秒）
}
```

---

## 📄 コンテンツテンプレート

### テンプレート1: 標準セクション

```markdown
# {セクションタイトル}

## 📝 このセクションで学ぶこと
- 学習目標1
- 学習目標2
- 学習目標3

---

## 📖 {トピック1}

{導入文: なぜこのトピックが重要か}

### 詳細説明
{本文: 詳しい解説}

### 図解
![図解タイトル](画像URL)

### 📌 重要ポイント
- ポイント1
- ポイント2
- ポイント3

---

## 💡 例題

**問題**: {問題文}

<details>
<summary>答えを見る</summary>

**答え**: {答え}

**解説**: {解説}
</details>

---

## ✅ 確認問題

{確認問題へのリンクまたは埋め込み}

---

## 🔗 関連リンク
- [関連セクション1](#)
- [関連セクション2](#)
```

---

## 📚 実際のコンテンツ例

### 例: 「五大装置」セクション

```typescript
const fiveMajorDevicesSection: Subsection = {
  id: 'five-major-devices',
  title: '五大装置',
  order: 1,
  content: {
    introduction: `
コンピュータは5つの基本装置で構成されています。
これはコンピュータを理解する上で最も基本的な概念です。
`,

    mainText: `
コンピュータの五大装置は以下の通りです：

1. **入力装置（Input Device）**
   - キーボード、マウス、スキャナ、タッチパネルなど
   - データや命令をコンピュータに入力する役割

2. **出力装置（Output Device）**
   - ディスプレイ、プリンタ、スピーカーなど
   - 処理結果を人間が理解できる形で出力

3. **記憶装置（Storage Device）**
   - RAM、ROM、HDD、SSDなど
   - プログラムやデータを保存
   - 主記憶装置と補助記憶装置に分類

4. **演算装置（ALU: Arithmetic Logic Unit）**
   - 四則演算、論理演算、比較演算を実行
   - CPUの中核的な構成要素

5. **制御装置（Control Unit）**
   - プログラムの実行制御
   - 各装置間の連携調整
`,

    diagrams: [
      {
        id: 'diagram-1',
        type: 'mermaid',
        code: \`
graph LR
  A[入力装置] --> B[制御装置]
  B --> C[演算装置]
  C --> B
  B --> D[記憶装置]
  D --> B
  B --> E[出力装置]
\`,
        alt: '五大装置の関係図',
        caption: '五大装置の相互関係'
      }
    ],

    keyPoints: [
      'コンピュータは5つの基本装置で構成される',
      '入力→処理→出力の流れが基本',
      'CPUは演算装置と制御装置を含む',
      '記憶装置は主記憶と補助記憶に分類される'
    ],

    examples: [
      {
        id: 'example-1',
        question: 'あなたがキーボードで文字を入力し、画面に表示される過程で、五大装置はどのように動作するでしょうか？',
        answer: '入力装置（キーボード）→ 制御装置 → 演算装置 → 記憶装置 → 制御装置 → 出力装置（ディスプレイ）の順で動作します。',
        explanation: `
1. キーボード（入力装置）でキーを押す
2. 制御装置がキー入力を受け取る
3. 演算装置で文字コードに変換
4. 記憶装置（RAM）に一時保存
5. 制御装置が表示命令を出す
6. ディスプレイ（出力装置）に文字が表示される
`,
        collapsible: true
      }
    ],

    checkQuestions: [
      {
        id: 'check-1',
        question: 'CPUに含まれる装置はどれですか？',
        options: [
          '入力装置と出力装置',
          '演算装置と制御装置',
          '記憶装置と入力装置',
          '出力装置と記憶装置'
        ],
        correctAnswer: 1,
        explanation: 'CPUは演算装置（ALU）と制御装置を中心に構成されます。',
        difficulty: 'easy'
      }
    ],

    relatedLinks: [
      {
        title: 'CPU（中央処理装置）の詳細',
        url: '#cpu',
        type: 'internal'
      },
      {
        title: '記憶装置の種類',
        url: '#memory',
        type: 'internal'
      }
    ]
  }
};
```

---

## 🗄️ データ保存先

### オプション1: TypeScriptファイル（推奨・MVP）

```
src/lib/learning-content/
├── computer-systems.ts
├── algorithms-programming.ts
├── database.ts
├── network.ts
├── security.ts
├── system-development.ts
├── management-legal.ts
└── strategy.ts
```

**メリット**:
- 実装が簡単
- 型安全性が高い
- ビルド時に最適化される
- バージョン管理が容易

**デメリット**:
- コンテンツ更新にデプロイが必要
- 大量のコンテンツには不向き

---

### オプション2: Supabase（将来）

```sql
-- learning_modules テーブル
CREATE TABLE learning_modules (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  estimated_time INTEGER,
  difficulty TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- learning_sections テーブル
CREATE TABLE learning_sections (
  id TEXT PRIMARY KEY,
  module_id TEXT REFERENCES learning_modules(id),
  title TEXT NOT NULL,
  order_num INTEGER NOT NULL,
  estimated_time INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- learning_subsections テーブル
CREATE TABLE learning_subsections (
  id TEXT PRIMARY KEY,
  section_id TEXT REFERENCES learning_sections(id),
  title TEXT NOT NULL,
  order_num INTEGER NOT NULL,
  introduction TEXT,
  main_text TEXT,
  key_points JSONB,
  diagrams JSONB,
  examples JSONB,
  check_questions JSONB,
  related_links JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- learning_progress テーブル（既存と統合）
CREATE TABLE learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  module_id TEXT,
  section_id TEXT,
  subsection_id TEXT,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  time_spent INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, subsection_id)
);
```

**メリット**:
- コンテンツの動的更新が可能
- 管理画面からの編集が可能
- スケーラブル

**デメリット**:
- 初期実装が複雑
- API通信のオーバーヘッド

---

### オプション3: Markdown + MDX（中間案）

```
content/
├── computer-systems/
│   ├── 01-five-devices.mdx
│   ├── 02-cpu.mdx
│   ├── 03-memory.mdx
│   └── 04-storage.mdx
├── algorithms-programming/
└── ...
```

**メリット**:
- Markdownで書きやすい
- GitHubで編集可能
- JSXコンポーネントを埋め込める

**デメリット**:
- ビルド時の処理が必要
- 構造化が難しい

---

## 🎯 推奨実装方針

### Phase 1: MVP（TypeScriptファイル）
- 最初は`src/lib/learning-content/*.ts`に記述
- 型安全で実装が簡単
- 1-2週間で実装可能

### Phase 2: 拡張（MDX）
- コンテンツ量が増えたらMDXに移行
- より柔軟なコンテンツ管理

### Phase 3: 本格運用（Supabase）
- 管理画面が必要になったらDB化
- 動的コンテンツ更新

---

## 📝 コンテンツ作成ガイドライン

### 文章スタイル
1. **簡潔明瞭**: 1文は50文字以内を目安
2. **能動態**: 受動態より能動態を優先
3. **具体例**: 抽象概念には必ず例を添える
4. **段落分け**: 3-5行ごとに段落を分ける

### 図解作成
1. **必須要素**: タイトル、ラベル、凡例
2. **色使い**: 最大3色まで（ブランドカラー優先）
3. **サイズ**: 横800px推奨
4. **形式**: PNG or SVG

### 重要ポイント
- 各セクションに3-5個
- 箇条書き形式
- 試験に出やすい内容を優先

---

## 📊 コンテンツボリューム目安

| モジュール | セクション数 | 推定ページ数 | 推定学習時間 |
|-----------|-------------|------------|------------|
| コンピュータシステム | 4 | 12 | 3-4時間 |
| アルゴリズム | 5 | 15 | 4-5時間 |
| データベース | 4 | 12 | 3-4時間 |
| ネットワーク | 5 | 15 | 4-5時間 |
| セキュリティ | 4 | 12 | 3-4時間 |
| システム開発 | 4 | 12 | 3-4時間 |
| 経営・法務 | 5 | 15 | 4-5時間 |
| ストラテジ | 4 | 12 | 3-4時間 |
| **合計** | **35** | **105** | **30-35時間** |

---

## 📝 変更履歴

| 日付 | バージョン | 変更内容 | 担当者 |
|------|-----------|---------|--------|
| 2025-10-07 | 1.0 | 初版作成 | Claude |
