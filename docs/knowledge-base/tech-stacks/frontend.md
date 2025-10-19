# フロントエンド技術スタック

実践的なフロントエンド技術の選定ガイドと実装例です。

## フレームワーク選定

### React エコシステム（推奨度: ⭐⭐⭐⭐⭐）

#### Next.js（最推奨）

**使いどころ**: SaaS、マーケサイト、ほぼすべてのWebアプリ

```bash
# プロジェクト作成
npx create-next-app@latest my-app --typescript --tailwind --app

# 主要パッケージ
npm install @tanstack/react-query zustand
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install lucide-react date-fns
```

**プロジェクト構造（ベストプラクティス）**:
```
app/
├── (auth)/              # 認証グループ
│   ├── login/
│   └── signup/
├── (dashboard)/         # ダッシュボードグループ
│   ├── layout.tsx      # 共通レイアウト
│   ├── page.tsx        # /dashboard
│   └── settings/
├── api/                # API Routes
│   └── users/
│       └── route.ts
components/
├── ui/                 # shadcn/ui コンポーネント
│   ├── button.tsx
│   └── dialog.tsx
├── features/          # 機能別コンポーネント
│   ├── auth/
│   └── dashboard/
lib/
├── db.ts              # DB接続
├── auth.ts            # 認証ロジック
└── utils.ts           # ユーティリティ
```

**実装例: 認証付きダッシュボード**

```typescript
// app/(dashboard)/layout.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100">
        {/* Sidebar */}
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
```

```typescript
// app/api/users/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const users = await db.user.findMany()
  return NextResponse.json(users)
}
```

#### Vite + React（SPA特化）

**使いどころ**: 管理画面、SPAアプリ

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install react-router-dom @tanstack/react-query axios
```

**実装例: React Router + 認証**

```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './contexts/AuthContext'

const queryClient = new QueryClient()

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <Navigate to="/login" />

  return <>{children}</>
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
```

---

### Vue エコシステム（推奨度: ⭐⭐⭐⭐）

#### Nuxt.js

**使いどころ**: Vueが好きな場合、SEO重視

```bash
npx nuxi@latest init my-app
cd my-app
npm install @pinia/nuxt @nuxtjs/supabase
```

**実装例: Composition API**

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFetch } from '#app'

const count = ref(0)
const doubled = computed(() => count.value * 2)

const { data: users } = await useFetch('/api/users')

function increment() {
  count.value++
}
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Doubled: {{ doubled }}</p>
    <button @click="increment">Increment</button>

    <ul>
      <li v-for="user in users" :key="user.id">
        {{ user.name }}
      </li>
    </ul>
  </div>
</template>
```

---

## スタイリング

### Tailwind CSS（推奨度: ⭐⭐⭐⭐⭐）

**なぜTailwind?**
- ✅ 開発速度が圧倒的に速い
- ✅ デザインシステムが自動で統一
- ✅ バンドルサイズが小さい

```bash
# Next.jsなら自動セットアップ
npx create-next-app@latest --tailwind

# Viteの場合
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**実装例: コンポーネント**

```tsx
// components/Card.tsx
export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      {children}
    </div>
  )
}

export function Button({ children, variant = 'primary' }: {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
}) {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition-colors"
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300"
  }

  return (
    <button className={`${baseStyles} ${variants[variant]}`}>
      {children}
    </button>
  )
}
```

**tailwind.config.js（実践的な設定）**:

```javascript
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          900: '#0c4a6e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

### shadcn/ui（推奨度: ⭐⭐⭐⭐⭐）

**なぜshadcn/ui?**
- ✅ コピペで使える高品質コンポーネント
- ✅ Radix UI ベースでアクセシビリティ完璧
- ✅ カスタマイズ自由

```bash
npx shadcn@latest init
npx shadcn@latest add button dialog dropdown-menu
```

**実装例: ダイアログ**

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function CreateUserDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>新規ユーザー作成</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ユーザー作成</DialogTitle>
        </DialogHeader>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="名前"
            className="w-full px-3 py-2 border rounded-md"
          />
          <Button type="submit">作成</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

---

## 状態管理

### Zustand（推奨度: ⭐⭐⭐⭐⭐）

**なぜZustand?**
- ✅ 最もシンプル（Redux比で10倍簡単）
- ✅ パフォーマンス良好
- ✅ TypeScript完全対応

```bash
npm install zustand
```

**実装例**:

```typescript
// store/useAuthStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string
}

interface AuthStore {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
)

// 使い方
function Header() {
  const { user, logout } = useAuthStore()

  return (
    <header>
      <span>{user?.name}</span>
      <button onClick={logout}>ログアウト</button>
    </header>
  )
}
```

---

## データフェッチング

### TanStack Query (React Query)（推奨度: ⭐⭐⭐⭐⭐）

**なぜReact Query?**
- ✅ キャッシュ自動管理
- ✅ ローディング・エラー状態を簡単に扱える
- ✅ リアルタイム更新が簡単

```bash
npm install @tanstack/react-query
```

**実装例**:

```typescript
// lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1分
      retry: 1,
    },
  },
})

// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('/api/users')
      return res.json()
    },
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { name: string; email: string }) => {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

// 使い方
function UserList() {
  const { data: users, isLoading, error } = useUsers()
  const createUser = useCreateUser()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <button onClick={() => createUser.mutate({ name: 'John', email: 'john@example.com' })}>
        ユーザー追加
      </button>
      <ul>
        {users?.map(user => <li key={user.id}>{user.name}</li>)}
      </ul>
    </div>
  )
}
```

---

## フォーム管理

### React Hook Form + Zod（推奨度: ⭐⭐⭐⭐⭐）

```bash
npm install react-hook-form zod @hookform/resolvers
```

**実装例**:

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const schema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上必要です'),
})

type FormData = z.infer<typeof schema>

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          type="email"
          {...register('email')}
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <input
          type="password"
          {...register('password')}
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md">
        ログイン
      </button>
    </form>
  )
}
```

---

## 推奨技術スタック（2025年版）

### SaaS MVP
```
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS + shadcn/ui
- State: Zustand
- Data Fetching: TanStack Query
- Forms: React Hook Form + Zod
- Auth: NextAuth.js or Clerk
- Database: Supabase or Prisma + PostgreSQL
```

### 管理画面
```
- Framework: Vite + React
- UI: React Admin or Tremor
- Styling: Tailwind CSS
- State: Zustand
- Data: TanStack Query
```

### マーケティングサイト
```
- Framework: Astro or Next.js (SSG)
- Styling: Tailwind CSS
- CMS: Markdown or Contentful
```

---

## 次のステップ

- [バックエンド技術](/tech-stacks/backend) - API設計
- [プロジェクトテンプレート](/templates/saas-mvp) - SaaS MVP完全実装例
- [ベストプラクティス](/best-practices/coding-standards) - コーディング規約
