# コーディング規約

チーム開発・個人開発で使える実践的なコーディング規約です。

## TypeScript / JavaScript

### ESLint + Prettier設定（必須）

```bash
npm install -D eslint prettier eslint-config-prettier
npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

**.eslintrc.json**:

```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

**.prettierrc**:

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always"
}
```

**package.json scripts**:

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\""
  }
}
```

---

### 命名規則

#### ファイル名

```
// コンポーネント: PascalCase
components/UserProfile.tsx
components/auth/LoginForm.tsx

// ユーティリティ: camelCase
lib/formatDate.ts
hooks/useUser.ts

// 定数ファイル: SCREAMING_SNAKE_CASE または camelCase
constants/API_ENDPOINTS.ts
constants/config.ts
```

#### 変数・関数名

```typescript
// 変数: camelCase
const userName = 'John'
const isActive = true

// 定数: SCREAMING_SNAKE_CASE
const API_URL = 'https://api.example.com'
const MAX_RETRY_COUNT = 3

// 関数: camelCase（動詞で始める）
function getUserById(id: string) { }
function calculateTotal(items: Item[]) { }

// Boolean: is/has/canで始める
const isLoading = false
const hasError = true
const canEdit = user.role === 'admin'

// Reactコンポーネント: PascalCase
function UserProfile() { }
function LoginForm() { }

// カスタムフック: useで始める
function useUser() { }
function useAuth() { }

// 型: PascalCase
type User = { }
interface UserProps { }
```

---

### 型定義

#### 型を明示する

```typescript
// ❌ 悪い例
const user = { name: 'John', age: 30 }
function getUser(id) { }

// ✅ 良い例
interface User {
  name: string
  age: number
}

const user: User = { name: 'John', age: 30 }
function getUser(id: string): Promise<User> { }
```

#### any を避ける

```typescript
// ❌ 悪い例
function processData(data: any) {
  return data.value
}

// ✅ 良い例
interface Data {
  value: string
}

function processData(data: Data) {
  return data.value
}

// または unknown を使う
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as Data).value
  }
  throw new Error('Invalid data')
}
```

#### 型エイリアス vs インターフェース

```typescript
// オブジェクト: interface（拡張可能）
interface User {
  id: string
  name: string
}

interface AdminUser extends User {
  permissions: string[]
}

// ユニオン型: type
type Status = 'pending' | 'success' | 'error'
type ID = string | number
```

---

### 関数

#### アロー関数 vs 通常関数

```typescript
// ユーティリティ関数: アロー関数
const formatDate = (date: Date): string => {
  return date.toISOString()
}

// Reactコンポーネント: function（読みやすさ優先）
export function UserProfile({ userId }: { userId: string }) {
  return <div>{userId}</div>
}

// メソッド: 通常関数（this が必要な場合）
class User {
  name: string

  getName() {
    return this.name
  }
}
```

#### 早期リターン

```typescript
// ❌ 悪い例
function getUser(id: string) {
  if (id) {
    const user = db.findUser(id)
    if (user) {
      if (user.isActive) {
        return user
      } else {
        throw new Error('User is not active')
      }
    } else {
      throw new Error('User not found')
    }
  } else {
    throw new Error('ID is required')
  }
}

// ✅ 良い例
function getUser(id: string) {
  if (!id) {
    throw new Error('ID is required')
  }

  const user = db.findUser(id)

  if (!user) {
    throw new Error('User not found')
  }

  if (!user.isActive) {
    throw new Error('User is not active')
  }

  return user
}
```

---

### React

#### コンポーネント構造

```typescript
// 1. Import
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useUser } from '@/hooks/useUser'

// 2. 型定義
interface UserProfileProps {
  userId: string
  onUpdate?: (user: User) => void
}

// 3. コンポーネント
export function UserProfile({ userId, onUpdate }: UserProfileProps) {
  // 4. Hooks
  const [isLoading, setIsLoading] = useState(false)
  const { user, mutate } = useUser(userId)

  // 5. Effects
  useEffect(() => {
    console.log('User loaded:', user)
  }, [user])

  // 6. Event handlers
  const handleUpdate = async () => {
    setIsLoading(true)
    await mutate()
    setIsLoading(false)
    onUpdate?.(user)
  }

  // 7. Early return
  if (!user) {
    return <div>Loading...</div>
  }

  // 8. JSX
  return (
    <div className="space-y-4">
      <h1>{user.name}</h1>
      <Button onClick={handleUpdate} disabled={isLoading}>
        Update
      </Button>
    </div>
  )
}
```

#### Props の型定義

```typescript
// ❌ 悪い例
function Button(props: any) { }

// ✅ 良い例
interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  onClick?: () => void
  disabled?: boolean
}

function Button({ children, variant = 'primary', onClick, disabled }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

// または、React.ComponentPropsを使う
type ButtonProps = React.ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary'
}
```

#### useState の型

```typescript
// プリミティブ型（型推論でOK）
const [count, setCount] = useState(0)
const [name, setName] = useState('')

// オブジェクト型（型を明示）
interface User {
  id: string
  name: string
}

const [user, setUser] = useState<User | null>(null)
const [users, setUsers] = useState<User[]>([])
```

---

## コメント

### いつコメントを書くか

```typescript
// ❌ 悪い例：コードを説明するコメント
// ユーザーの名前を取得
const userName = user.name

// ✅ 良い例：なぜそうするかを説明
// API制限のため、3秒ごとにリトライ
await sleep(3000)

// ✅ 良い例：複雑なビジネスロジック
// 管理者は全データにアクセス可能
// 一般ユーザーは自分のデータのみ
if (user.role === 'admin' || data.userId === user.id) {
  return data
}
```

### JSDoc

```typescript
/**
 * ユーザー情報を取得します
 * @param id ユーザーID
 * @returns ユーザー情報またはnull
 * @throws ネットワークエラー時にError
 */
async function getUser(id: string): Promise<User | null> {
  const res = await fetch(`/api/users/${id}`)
  if (!res.ok) throw new Error('Failed to fetch user')
  return res.json()
}
```

---

## エラーハンドリング

### try-catch

```typescript
// ❌ 悪い例
try {
  const user = await getUser(id)
  const posts = await getPosts(user.id)
  const comments = await getComments(posts[0].id)
} catch (error) {
  console.log(error)
}

// ✅ 良い例
try {
  const user = await getUser(id)
  if (!user) {
    throw new Error('User not found')
  }

  const posts = await getPosts(user.id)
  if (posts.length === 0) {
    return { user, posts: [], comments: [] }
  }

  const comments = await getComments(posts[0].id)

  return { user, posts, comments }
} catch (error) {
  if (error instanceof Error) {
    console.error('Failed to fetch data:', error.message)
  }
  throw error
}
```

---

## パフォーマンス

### React.memo

```typescript
// 重い計算やレンダリングが多いコンポーネントのみ
export const ExpensiveComponent = React.memo(function ExpensiveComponent({
  data,
}: {
  data: Data[]
}) {
  // 重い処理
  return <div>{/* ... */}</div>
})
```

### useMemo / useCallback

```typescript
function UserList({ users }: { users: User[] }) {
  // ❌ 毎回新しい配列を作成
  const activeUsers = users.filter((u) => u.isActive)

  // ✅ usersが変わったときのみ再計算
  const activeUsers = useMemo(
    () => users.filter((u) => u.isActive),
    [users]
  )

  // ❌ 毎回新しい関数を作成（子コンポーネントが再レンダリング）
  const handleClick = () => console.log('clicked')

  // ✅ 依存配列が変わったときのみ再作成
  const handleClick = useCallback(() => {
    console.log('clicked')
  }, [])

  return <div>{/* ... */}</div>
}
```

---

## 推奨ツール

| ツール | 用途 |
|--------|------|
| **ESLint** | 静的解析 |
| **Prettier** | コードフォーマット |
| **TypeScript** | 型チェック |
| **Husky** | Git hooks（lint-staged） |
| **Zod** | ランタイムバリデーション |

### Husky + lint-staged 設定

```bash
npm install -D husky lint-staged
npx husky init
echo "npx lint-staged" > .husky/pre-commit
```

**package.json**:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

---

## まとめ：チェックリスト

- ✅ ESLint + Prettier を設定
- ✅ 型を明示（any を避ける）
- ✅ 命名規則を統一
- ✅ 早期リターンを使う
- ✅ エラーハンドリングを適切に
- ✅ 不要なコメントは書かない
- ✅ パフォーマンスを意識（useMemo等）
- ✅ Husky で pre-commit チェック

これらを守ることで、保守性の高いコードベースを維持できます。
