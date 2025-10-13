# 01. TypeScript基礎 - 型安全性の理解と実践

## 🎯 この章の学習目標

- TypeScriptとは何か、なぜ使うのかを説明できる
- 基本的な型の種類と使い方を理解する
- 型推論、型アノテーション、型エイリアスを使える
- インターフェースとジェネリクスを理解する
- リポジトリのTypeScriptコードを読んで理解できる

**学習時間目安**: 3-4時間

---

## 📚 TypeScriptとは？

### 定義

**TypeScript** = JavaScriptに**型システム**を追加したプログラミング言語

- Microsoftが開発・メンテナンス
- JavaScriptの**スーパーセット**（JavaScriptはすべて有効なTypeScript）
- 最終的にJavaScriptにコンパイル（トランスパイル）される

### JavaScriptとの違い

| JavaScript | TypeScript |
|-----------|------------|
| 動的型付け（実行時に型が決まる） | 静的型付け（コンパイル時に型チェック） |
| エラーは実行時に発見 | エラーはコード記述時に発見 |
| IDEの補完が弱い | IDEの補完が強力 |
| 大規模開発でバグが多い | 型安全性でバグを減らせる |

### 例：JavaScriptの問題

```javascript
// JavaScript
function add(a, b) {
  return a + b;
}

add(1, 2);        // 3
add("1", "2");    // "12" ← 意図しない動作
add(1, "2");      // "12" ← バグ！
```

### 例：TypeScriptで解決

```typescript
// TypeScript
function add(a: number, b: number): number {
  return a + b;
}

add(1, 2);        // 3 ✅
add("1", "2");    // ❌ コンパイルエラー！
add(1, "2");      // ❌ コンパイルエラー！
```

**結果**: バグを**実行前に**発見できる！

---

## 🤔 なぜTypeScriptを使うのか？

### 1. バグを減らせる

```typescript
// ❌ 間違い：プロパティ名のタイポ
const user = { name: "Alice", age: 25 };
console.log(user.nam);  // TypeScriptがエラーを出す
```

### 2. IDE補完が強力

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = { id: 1, name: "Alice", email: "alice@example.com" };

// "user." と入力すると、id, name, emailが自動補完される
user.  // ← IDEが候補を表示
```

### 3. リファクタリングが安全

変数名や関数名を変更しても、使っている箇所すべてで型エラーが出るので安全。

### 4. ドキュメントになる

```typescript
// 関数の引数・戻り値の型がドキュメントになる
function createUser(name: string, age: number): User {
  return { id: Date.now(), name, email: `${name}@example.com` };
}
```

### 5. チーム開発で統一性が保たれる

型定義により、API仕様やデータ構造が明確になる。

---

## 📖 基本的な型の種類

### プリミティブ型

```typescript
// string（文字列）
let name: string = "Alice";
name = 123;  // ❌ エラー

// number（数値）
let age: number = 25;
age = "25";  // ❌ エラー

// boolean（真偽値）
let isActive: boolean = true;
isActive = "true";  // ❌ エラー

// null / undefined
let empty: null = null;
let notAssigned: undefined = undefined;
```

### 配列

```typescript
// 配列の型定義 方法1
let numbers: number[] = [1, 2, 3];

// 配列の型定義 方法2（ジェネリクス）
let strings: Array<string> = ["a", "b", "c"];

// ❌ 型が合わない要素を追加できない
numbers.push("4");  // エラー
```

### オブジェクト

```typescript
// オブジェクトの型定義
let user: { name: string; age: number } = {
  name: "Alice",
  age: 25
};

// ❌ 必須プロパティが不足
let user2: { name: string; age: number } = {
  name: "Bob"  // エラー：ageがない
};
```

### any（なんでもOK）

```typescript
// any = 型チェックをスキップ（非推奨）
let anything: any = "hello";
anything = 123;      // OK
anything = true;     // OK

// ⚠️ anyは型安全性を失うので、できるだけ使わない
```

### unknown（安全なany）

```typescript
// unknown = 型が不明だが、使用前に型チェックが必要
let value: unknown = "hello";

// ❌ そのまま使えない
console.log(value.toUpperCase());  // エラー

// ✅ 型チェック後に使える
if (typeof value === "string") {
  console.log(value.toUpperCase());  // OK
}
```

### void（戻り値なし）

```typescript
// voidは戻り値がない関数の型
function logMessage(message: string): void {
  console.log(message);
  // return文なし
}
```

### never（到達しない）

```typescript
// neverは絶対に戻らない関数の型
function throwError(message: string): never {
  throw new Error(message);
  // ここには到達しない
}
```

---

## 🔍 型推論（Type Inference）

TypeScriptは値から**自動的に型を推測**してくれる。

```typescript
// 型を明示しなくても、自動的に推論される
let name = "Alice";  // string型と推論
let age = 25;        // number型と推論
let isActive = true; // boolean型と推論

// ❌ 推論された型と違う値を代入できない
name = 123;  // エラー
```

### 型推論のメリット

コードが簡潔になりつつ、型安全性は保たれる。

```typescript
// ❌ 冗長（型を明示）
let message: string = "Hello";

// ✅ 簡潔（型推論）
let message = "Hello";  // string型と推論される
```

---

## 🏷️ 型アノテーション（Type Annotation）

型を**明示的に指定**すること。

```typescript
// 変数に型アノテーション
let name: string = "Alice";

// 関数の引数・戻り値に型アノテーション
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// オブジェクトに型アノテーション
let user: { name: string; age: number } = {
  name: "Alice",
  age: 25
};
```

### いつ型アノテーションを使うべきか？

| 型推論で十分 | 型アノテーションを使うべき |
|------------|-------------------------|
| 初期値がある変数 | 関数の引数・戻り値 |
| 明らかな値 | 複雑なオブジェクト |
| - | APIのレスポンス型 |

---

## 📝 インターフェース（Interface）

オブジェクトの**型定義を再利用**するための仕組み。

### 基本的な使い方

```typescript
// インターフェースの定義
interface User {
  id: number;
  name: string;
  email: string;
}

// インターフェースを使う
const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
};

// ✅ 型チェックが働く
const user2: User = {
  id: 2,
  name: "Bob"
  // ❌ エラー：emailがない
};
```

### オプショナルプロパティ（任意）

```typescript
interface User {
  id: number;
  name: string;
  email?: string;  // ?を付けると任意（省略可能）
}

// ✅ emailなしでもOK
const user: User = {
  id: 1,
  name: "Alice"
};
```

### 読み取り専用プロパティ

```typescript
interface User {
  readonly id: number;  // readonlyで変更不可
  name: string;
}

const user: User = { id: 1, name: "Alice" };
user.name = "Bob";  // ✅ OK
user.id = 2;        // ❌ エラー：readonlyは変更不可
```

### インターフェースの継承

```typescript
interface Person {
  name: string;
  age: number;
}

// Personを継承してUserを作る
interface User extends Person {
  id: number;
  email: string;
}

const user: User = {
  id: 1,
  name: "Alice",
  age: 25,
  email: "alice@example.com"
};
```

---

## 🎭 型エイリアス（Type Alias）

型に**別名をつける**仕組み。インターフェースと似ているが、より柔軟。

### 基本的な使い方

```typescript
// 型エイリアスの定義
type User = {
  id: number;
  name: string;
  email: string;
};

// 使い方はインターフェースと同じ
const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
};
```

### ユニオン型（複数の型のいずれか）

```typescript
// stringまたはnumber
type ID = string | number;

let userId: ID = 123;       // ✅ OK
userId = "abc";             // ✅ OK
userId = true;              // ❌ エラー

// 関数の引数でも使える
function printID(id: ID) {
  console.log(`ID: ${id}`);
}
```

### リテラル型（特定の値のみ）

```typescript
// "success" または "error" のみ
type Status = "success" | "error" | "loading";

let status: Status = "success";  // ✅ OK
status = "pending";              // ❌ エラー
```

### インターフェース vs 型エイリアス

| インターフェース | 型エイリアス |
|---------------|------------|
| `interface User {}` | `type User = {}` |
| 継承しやすい | ユニオン型が使える |
| 宣言の統合が可能 | プリミティブ型にも使える |
| オブジェクトに最適 | 柔軟性が高い |

**迷ったら**：オブジェクトは `interface`、それ以外は `type`

---

## 🧬 ジェネリクス（Generics）

**型をパラメータ化**して、再利用可能な関数やコンポーネントを作る仕組み。

### 基本的な使い方

```typescript
// ジェネリクスなし：number専用
function identity(value: number): number {
  return value;
}

// ジェネリクスあり：どの型でも使える
function identity<T>(value: T): T {
  return value;
}

// 使い方
const num = identity<number>(123);      // T = number
const str = identity<string>("hello");  // T = string
```

### 配列のジェネリクス

```typescript
// 配列を返す関数
function wrapInArray<T>(value: T): T[] {
  return [value];
}

wrapInArray<number>(123);      // [123]
wrapInArray<string>("hello");  // ["hello"]
```

### インターフェースのジェネリクス

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// User型のレスポンス
const userResponse: ApiResponse<User> = {
  data: { id: 1, name: "Alice", email: "alice@example.com" },
  status: 200,
  message: "Success"
};

// 配列のレスポンス
const usersResponse: ApiResponse<User[]> = {
  data: [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" }
  ],
  status: 200,
  message: "Success"
};
```

---

## 🛠️ dev-elite-academyでの実例

### 例1: src/app/page.tsx

```typescript
// Next.jsのページコンポーネント
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Welcome to Dev Elite Academy</h1>
    </main>
  );
}
```

- 関数コンポーネントの戻り値は `JSX.Element` 型（暗黙的）
- TypeScriptが型推論してくれる

### 例2: API Routeの型定義

```typescript
// src/app/api/learning/progress/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();

  // レスポンスの型
  return NextResponse.json({
    success: true,
    data: body
  });
}
```

- `NextRequest`, `NextResponse` はNext.jsが提供する型
- 型安全なAPI開発が可能

### 例3: Supabaseのクライアント型

```typescript
import { createClient } from '@supabase/supabase-js';

// Supabaseクライアントの型
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// データベースから取得
const { data, error } = await supabase
  .from('users')
  .select('*');

// dataの型は自動的に推論される
```

---

## ⚠️ よくあるエラーと対処法

### エラー1: 型が一致しない

```typescript
// ❌ エラー
let age: number = "25";

// ✅ 修正
let age: number = 25;
```

### エラー2: プロパティが不足

```typescript
interface User {
  id: number;
  name: string;
}

// ❌ エラー
const user: User = { id: 1 };

// ✅ 修正
const user: User = { id: 1, name: "Alice" };
```

### エラー3: nullやundefinedの可能性

```typescript
function greet(name: string) {
  console.log(name.toUpperCase());
}

// ❌ エラー：nameがnullの可能性
const name: string | null = getName();
greet(name);

// ✅ 修正：nullチェック
if (name !== null) {
  greet(name);
}
```

### エラー4: anyを使いすぎ

```typescript
// ❌ 悪い例
function process(data: any) {
  return data.value;  // 型安全性がない
}

// ✅ 良い例
interface Data {
  value: string;
}

function process(data: Data) {
  return data.value;  // 型安全
}
```

---

## 🎓 実践的な学習ステップ

### ステップ1: 基本型を使ってみる

tsconfig.jsonを見て、プロジェクトのTypeScript設定を確認：

```bash
cat C:\Users\ganke\dev-elite-academy\tsconfig.json
```

### ステップ2: リポジトリのコードを読む

以下のファイルを読んで、型定義を確認：

1. `src/app/page.tsx` - ページコンポーネント
2. `src/app/layout.tsx` - レイアウトコンポーネント
3. `src/app/api/*/route.ts` - API Routes

### ステップ3: 型エラーを体験する

わざと型を間違えて、エラーメッセージを読む：

```typescript
// 例：src/app/test.tsxを作成
const age: number = "25";  // エラーを確認

// npm run typecheck を実行
```

### ステップ4: 自分でインターフェースを作る

学習データの型を定義してみる：

```typescript
interface LearningModule {
  id: string;
  title: string;
  description: string;
  progress: number;  // 0-100
}
```

---

## ✅ この章の理解度チェック

以下の質問に答えられますか？

- [ ] TypeScriptとJavaScriptの違いを3つ挙げられる
- [ ] なぜTypeScriptを使うのか、3つ理由を説明できる
- [ ] `string`, `number`, `boolean`, `any`, `unknown`の違いが分かる
- [ ] インターフェースと型エイリアスの違いを説明できる
- [ ] ジェネリクスが何か、簡単な例を書ける
- [ ] リポジトリのTypeScriptコードを読んで、型定義が理解できる

**すべてにチェックが入ったら次の章へ進みましょう！**

---

## 📚 さらに学ぶためのリソース

- [TypeScript公式ドキュメント](https://www.typescriptlang.org/docs/)
- [TypeScript Deep Dive（日本語）](https://typescript-jp.gitbook.io/deep-dive/)
- [サバイバルTypeScript](https://typescriptbook.jp/)

---

## 🔜 次のステップ

次は **[02_Next.js_App_Router.md](./02_Next.js_App_Router.md)** でNext.jsフレームワークを学びます。

TypeScriptの知識を活かして、Next.jsのルーティング・SSR・API Routesを理解しましょう！

---

**学習日**: ____年__月__日
**理解度**: [ ] 理解した  [ ] 部分的に理解  [ ] 要復習
**メモ**:
