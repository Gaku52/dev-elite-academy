# コーディング規約とビルドエラー防止ガイド

## 目的
一度のpushでGitHub Actionsのビルドを成功させるため、よくあるTypeScriptとESLintのエラーを防ぐガイドライン。

## 1. TypeScript エラー防止

### 1.1 Null/Undefined チェック
```typescript
// ❌ 悪い例
const response = await fetch(`/api/user/progress?userId=${user.id}`);

// ✅ 良い例 - Optional Chainingを使用
const response = await fetch(`/api/user/progress?userId=${user?.id || ''}`);
```

### 1.2 型定義の明示
```typescript
// ❌ 悪い例
const [data, setData] = useState();

// ✅ 良い例
interface DataType {
  id: string;
  name: string;
}
const [data, setData] = useState<DataType | null>(null);
```

### 1.3 Async/Await エラーハンドリング
```typescript
// ✅ 必ずtry-catchで囲む
try {
  const response = await fetch('/api/endpoint');
  if (response.ok) {
    const data = await response.json();
  }
} catch (error) {
  console.error('Error:', error);
  // フォールバック処理
}
```

## 2. ESLint 警告防止

### 2.1 未使用のインポート
```typescript
// ❌ 悪い例 - 使用していないインポートは残さない
import { Book, Clock, Target } from 'lucide-react';
// Bookだけ使用

// ✅ 良い例 - 実際に使用するものだけインポート
import { Book } from 'lucide-react';
```

### 2.2 未使用の変数
```typescript
// ❌ 悪い例
const { user, signOut } = useAuth(); // signOutを使わない

// ✅ 良い例 - 使用するものだけ分割代入
const { user } = useAuth();
```

### 2.3 React Hooks の依存配列
```typescript
// ❌ 悪い例 - 関数を外部定義して依存配列に含めない
const fetchData = async () => { /* ... */ };

useEffect(() => {
  fetchData();
}, []); // ESLint警告: fetchDataが依存配列にない

// ✅ 良い例 - useEffect内で関数を定義
useEffect(() => {
  const fetchData = async () => { /* ... */ };
  fetchData();
}, []);
```

## 3. Next.js 特有の注意点

### 3.1 Client Component の明示
```typescript
// クライアントサイドで実行する必要があるコンポーネント
'use client';

import { useState, useEffect } from 'react';
```

### 3.2 Server Component と Client Component の分離
```typescript
// ❌ 悪い例 - Server ComponentでuseStateを使用
export default async function ServerComponent() {
  const [state, setState] = useState(); // エラー！
}

// ✅ 良い例 - Client Componentを別ファイルに分離
// ServerComponent.tsx (Server Component)
import ClientComponent from './ClientComponent';

export default async function ServerComponent() {
  const data = await fetchData();
  return <ClientComponent initialData={data} />;
}

// ClientComponent.tsx (Client Component)
'use client';
export default function ClientComponent({ initialData }) {
  const [state, setState] = useState(initialData);
}
```

## 4. Supabase 関連

### 4.1 環境変数の確認
```typescript
// ✅ 必ず環境変数の存在をチェック
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}
```

### 4.2 データベースクエリのエラーハンドリング
```typescript
// ✅ 必ずデータの存在をチェック
const { data, error } = await supabase
  .from('table')
  .select('*');

if (error) {
  console.error('Database error:', error);
  return null;
}

// dataがnullの可能性を考慮
const results = data || [];
```

## 5. ビルド前チェックリスト

### pushする前に必ず実行:

```bash
# 1. ローカルでビルドテスト
npm run build

# 2. ビルドが成功したら、型チェックのみ実行
npx tsc --noEmit

# 3. ESLintチェック
npm run lint

# 4. すべて成功したらコミット＆プッシュ
git add -A
git commit -m "feat: 機能説明"
git push origin main
```

## 6. よくあるエラーと解決方法

### 6.1 "Object is possibly 'null'"
**原因**: オプショナルなオブジェクトへの直接アクセス
**解決**: Optional Chaining (`?.`) または Nullish Coalescing (`??`) を使用

### 6.2 "Missing dependency in useEffect"
**原因**: useEffect内で外部変数/関数を参照
**解決**: 
- 関数はuseEffect内で定義
- 変数は依存配列に追加
- またはuseCallbackを使用

### 6.3 "Variable is assigned but never used"
**原因**: 定義したが使用していない変数
**解決**: 
- 未使用の変数を削除
- 必要なら`_`プレフィックスを付ける（例: `_unusedVar`）

### 6.4 "Cannot use useState in Server Component"
**原因**: Server ComponentでClient側のHooksを使用
**解決**: `'use client'`ディレクティブを追加、またはコンポーネントを分離

## 7. プロジェクト固有のルール

### 7.1 インポート順序
```typescript
// 1. React/Next.js
import { useState } from 'react';
import Link from 'next/link';

// 2. 外部ライブラリ
import { createClient } from '@supabase/supabase-js';

// 3. 内部コンポーネント/ユーティリティ
import Header from '@/components/Header';
import { formatDate } from '@/utils/date';

// 4. 型定義
import type { User } from '@/types';
```

### 7.2 コンポーネントの命名規則
- コンポーネント: PascalCase (例: `UserProfile`)
- ファイル名: PascalCase (例: `UserProfile.tsx`)
- フック: camelCase with 'use' prefix (例: `useAuth`)
- ユーティリティ: camelCase (例: `formatDate`)

### 7.3 非同期処理
- 必ずエラーハンドリングを実装
- ローディング状態を管理
- フォールバック処理を用意

## 8. デバッグTips

### ビルドエラーが出たら:
1. エラーメッセージの行番号を確認
2. TypeScriptエラーなら型定義を確認
3. ESLint警告なら該当ルールを確認
4. `npm run build`でローカル再現を試みる

### GitHub Actions失敗時:
1. Actions タブでエラーログを確認
2. ローカルで同じコマンドを実行
3. 環境変数の差異を確認
4. このドキュメントのチェックリストを再確認

## 9. 継続的改善

新しいエラーパターンを発見したら、このドキュメントに追加してください：

```markdown
### X.X 新しいエラーパターン
**エラー**: エラーメッセージ
**原因**: なぜ起きるか
**解決**: どう修正するか
**例**: コード例
```

---

最終更新: 2025-01-06
作成者: Claude Code with Dev Elite Academy Team