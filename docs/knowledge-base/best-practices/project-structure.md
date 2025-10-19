# プロジェクト構成

スケーラブルで保守性の高いプロジェクト構成のベストプラクティスです。

## Next.js App Router（推奨）

### 基本構造

```
my-app/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Route Group（認証系）
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (dashboard)/         # Route Group（ダッシュボード）
│   │   ├── layout.tsx       # 共通レイアウト
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── (marketing)/         # Route Group（マーケティング）
│   │   ├── layout.tsx
│   │   ├── page.tsx         # トップページ
│   │   ├── pricing/
│   │   └── about/
│   ├── api/                 # API Routes
│   │   ├── auth/
│   │   ├── users/
│   │   └── webhooks/
│   ├── layout.tsx           # ルートレイアウト
│   └── globals.css
├── components/              # コンポーネント
│   ├── ui/                  # 汎用UIコンポーネント（shadcn/ui等）
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── dialog.tsx
│   ├── features/            # 機能別コンポーネント
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── dashboard/
│   │   │   ├── Sidebar.tsx
│   │   │   └── Header.tsx
│   │   └── user/
│   │       ├── UserList.tsx
│   │       └── UserCard.tsx
│   └── layouts/             # レイアウトコンポーネント
│       ├── MainLayout.tsx
│       └── AuthLayout.tsx
├── lib/                     # ライブラリ・ユーティリティ
│   ├── prisma.ts           # Prismaクライアント
│   ├── auth.ts             # 認証ロジック
│   ├── api.ts              # API クライアント
│   └── utils.ts            # 汎用ユーティリティ
├── hooks/                   # カスタムフック
│   ├── useUser.ts
│   ├── useAuth.ts
│   └── useSubscription.ts
├── types/                   # 型定義
│   ├── index.ts
│   ├── api.ts
│   └── models.ts
├── constants/               # 定数
│   ├── routes.ts
│   └── config.ts
├── stores/                  # 状態管理（Zustand等）
│   └── useAuthStore.ts
├── prisma/                  # Prisma
│   └── schema.prisma
├── public/                  # 静的ファイル
│   ├── images/
│   └── fonts/
├── .env.local              # 環境変数
├── .gitignore
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## Route Groups（App Router）

**なぜRoute Groupsを使うか？**
- URLに影響を与えずにフォルダでルートをグループ化
- 異なるレイアウトを適用可能

```
app/
├── (auth)/              # URL: /login, /signup
│   ├── login/
│   └── signup/
├── (dashboard)/         # URL: /dashboard, /settings
│   ├── layout.tsx      # ダッシュボード専用レイアウト
│   ├── dashboard/
│   └── settings/
└── (marketing)/         # URL: /, /pricing
    ├── layout.tsx      # マーケティング専用レイアウト
    ├── page.tsx        # トップページ
    └── pricing/
```

**app/(dashboard)/layout.tsx**:

```typescript
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <Header />
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
```

---

## コンポーネント分類

### 1. UI Components（ui/）

**shadcn/ui 等の汎用コンポーネント**

```typescript
// components/ui/button.tsx
export function Button({ children, variant = 'default' }: ButtonProps) {
  return <button className={cn(variants[variant])}>{children}</button>
}
```

### 2. Feature Components（features/）

**機能に特化したコンポーネント**

```typescript
// components/features/auth/LoginForm.tsx
export function LoginForm() {
  // 認証フォームのロジック
}

// components/features/dashboard/UserList.tsx
export function UserList() {
  // ユーザー一覧の表示
}
```

### 3. Layout Components（layouts/）

**ページ全体のレイアウト**

```typescript
// components/layouts/MainLayout.tsx
export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
```

---

## lib/ ディレクトリ

### シングルトンパターン（Prisma等）

**lib/prisma.ts**:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### API Client

**lib/api.ts**:

```typescript
class ApiClient {
  private baseURL: string

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL
  }

  async get<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseURL}${path}`)
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`)
    return res.json()
  }

  async post<T>(path: string, data: unknown): Promise<T> {
    const res = await fetch(`${this.baseURL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`)
    return res.json()
  }
}

export const api = new ApiClient()

// 使い方
import { api } from '@/lib/api'

const users = await api.get<User[]>('/users')
const newUser = await api.post<User>('/users', { name: 'John', email: 'john@example.com' })
```

---

## Hooks（hooks/）

### データフェッチング

**hooks/useUser.ts**:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.get<User>(`/users/${userId}`),
  })
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => api.get<User[]>('/users'),
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserData) => api.post<User>('/users', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
```

---

## Types（types/）

### 型定義の整理

**types/models.ts**:

```typescript
// データベースモデル
export interface User {
  id: string
  email: string
  name: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Post {
  id: string
  title: string
  content: string
  authorId: string
  published: boolean
  createdAt: Date
  updatedAt: Date
}
```

**types/api.ts**:

```typescript
// API リクエスト/レスポンス
export interface CreateUserRequest {
  email: string
  name?: string
  password: string
}

export interface UserResponse {
  data: User
  meta: {
    timestamp: string
  }
}

export interface ErrorResponse {
  error: {
    code: string
    message: string
    details?: unknown
  }
  meta: {
    timestamp: string
  }
}
```

---

## Constants（constants/）

**constants/routes.ts**:

```typescript
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
  PROFILE: (userId: string) => `/users/${userId}`,
} as const
```

**constants/config.ts**:

```typescript
export const APP_CONFIG = {
  APP_NAME: 'My SaaS',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  MAX_UPLOAD_SIZE: 5 * 1024 * 1024, // 5MB
} as const

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const
```

---

## 環境変数

**.env.local**:

```bash
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email
RESEND_API_KEY="re_..."

# Analytics
NEXT_PUBLIC_GA_ID="G-..."
```

**lib/env.ts（型安全な環境変数）**:

```typescript
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
})

export const env = envSchema.parse(process.env)

// 使い方
import { env } from '@/lib/env'

console.log(env.DATABASE_URL) // 型安全
```

---

## .gitignore

```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# prisma
/prisma/migrations
```

---

## package.json（scripts）

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "typecheck": "tsc --noEmit",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts",
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

---

## まとめ：チェックリスト

- ✅ Route Groups でルートを整理
- ✅ components/ を ui / features / layouts に分類
- ✅ lib/ にシングルトンやユーティリティを配置
- ✅ hooks/ でデータフェッチングロジックを集約
- ✅ types/ で型定義を整理
- ✅ constants/ で定数を管理
- ✅ 環境変数を型安全に管理
- ✅ .gitignore で不要なファイルを除外

この構成に従うことで、スケールしても保守性の高いプロジェクトを維持できます。
