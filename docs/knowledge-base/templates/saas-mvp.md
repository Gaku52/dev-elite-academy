# SaaS MVP テンプレート

最速でSaaS MVPを立ち上げるための完全実装例です。

## 技術構成

```
フロントエンド: Next.js 15 (App Router) + TypeScript
スタイリング: Tailwind CSS + shadcn/ui
バックエンド: Next.js API Routes
データベース: Prisma + PostgreSQL (Supabase)
認証: NextAuth.js
決済: Stripe
メール: Resend
デプロイ: Vercel
```

## セットアップ（30分）

### ステップ1: プロジェクト作成

```bash
npx create-next-app@latest my-saas \
  --typescript \
  --tailwind \
  --app \
  --use-npm

cd my-saas
```

### ステップ2: 依存関係インストール

```bash
# UI・スタイリング
npx shadcn@latest init
npx shadcn@latest add button card dialog dropdown-menu input label select toast

# データベース・認証
npm install prisma @prisma/client
npm install next-auth @auth/prisma-adapter
npm install bcryptjs
npm install -D @types/bcryptjs

# フォーム・バリデーション
npm install react-hook-form @hookform/resolvers zod

# データフェッチング
npm install @tanstack/react-query

# 状態管理
npm install zustand

# 決済
npm install stripe @stripe/stripe-js

# メール
npm install resend

# ユーティリティ
npm install date-fns lucide-react
```

### ステップ3: 環境変数設定

```bash
# .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

RESEND_API_KEY="re_..."
```

### ステップ4: Prismaセットアップ

```bash
npx prisma init
```

**prisma/schema.prisma**:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  hashedPassword String?
  accounts      Account[]
  sessions      Session[]
  subscription  Subscription?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Subscription {
  id                String   @id @default(cuid())
  userId            String   @unique
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  stripeCustomerId  String   @unique
  stripeSubscriptionId String @unique
  stripePriceId     String
  stripeCurrentPeriodEnd DateTime
  status            String
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

## ディレクトリ構造

```
my-saas/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── billing/
│   │       └── page.tsx
│   ├── (marketing)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── pricing/
│   │       └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── webhooks/
│   │   │   └── stripe/
│   │   │       └── route.ts
│   │   └── subscription/
│   │       └── route.ts
│   └── layout.tsx
├── components/
│   ├── ui/              # shadcn/ui
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── dashboard/
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   ├── marketing/
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   └── PricingTable.tsx
│   └── shared/
│       └── UserButton.tsx
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── stripe.ts
│   └── utils.ts
├── hooks/
│   ├── useUser.ts
│   └── useSubscription.ts
└── types/
    └── index.ts
```

---

## 主要実装

### 1. 認証（NextAuth.js）

**app/api/auth/[...nextauth]/route.ts**:

```typescript
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error('Invalid credentials')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.hashedPassword) {
          throw new Error('Invalid credentials')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        )

        if (!isPasswordValid) {
          throw new Error('Invalid credentials')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

**components/auth/LoginForm.tsx**:

```typescript
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'

const schema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上必要です'),
})

type FormData = z.infer<typeof schema>

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: 'エラー',
          description: 'メールアドレスまたはパスワードが正しくありません',
          variant: 'destructive',
        })
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      toast({
        title: 'エラー',
        description: 'ログインに失敗しました',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="メールアドレス"
            {...register('email')}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Input
            type="password"
            placeholder="パスワード"
            {...register('password')}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'ログイン中...' : 'ログイン'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">または</span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        disabled={isLoading}
      >
        Googleでログイン
      </Button>
    </div>
  )
}
```

---

### 2. サブスクリプション（Stripe）

**lib/stripe.ts**:

```typescript
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export const getStripeCustomer = async (email: string) => {
  const customers = await stripe.customers.list({ email, limit: 1 })

  if (customers.data.length > 0) {
    return customers.data[0]
  }

  return await stripe.customers.create({ email })
}

export const createCheckoutSession = async (
  customerId: string,
  priceId: string,
  userId: string
) => {
  return await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
    metadata: {
      userId,
    },
  })
}
```

**app/api/subscription/route.ts**:

```typescript
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { stripe, getStripeCustomer, createCheckoutSession } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { priceId } = await request.json()

  const customer = await getStripeCustomer(session.user.email)

  const checkoutSession = await createCheckoutSession(
    customer.id,
    priceId,
    session.user.id
  )

  return NextResponse.json({ url: checkoutSession.url })
}
```

**components/marketing/PricingTable.tsx**:

```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const plans = [
  {
    name: 'Starter',
    price: '$9',
    priceId: 'price_xxxxx',
    features: ['機能1', '機能2', '機能3'],
  },
  {
    name: 'Pro',
    price: '$29',
    priceId: 'price_yyyyy',
    features: ['Starter の全機能', '機能4', '機能5', '機能6'],
  },
]

export function PricingTable() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (priceId: string) => {
    setLoading(priceId)

    const res = await fetch('/api/subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
    })

    const { url } = await res.json()

    if (url) {
      window.location.href = url
    }

    setLoading(null)
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {plans.map((plan) => (
        <Card key={plan.name} className="p-6">
          <h3 className="text-2xl font-bold">{plan.name}</h3>
          <div className="mt-4 text-4xl font-bold">{plan.price}<span className="text-lg font-normal">/月</span></div>
          <ul className="mt-6 space-y-3">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          <Button
            className="w-full mt-6"
            onClick={() => handleSubscribe(plan.priceId)}
            disabled={loading === plan.priceId}
          >
            {loading === plan.priceId ? '処理中...' : '申し込む'}
          </Button>
        </Card>
      ))}
    </div>
  )
}
```

---

### 3. Webhook（Stripe）

**app/api/webhooks/stripe/route.ts**:

```typescript
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      )

      await prisma.subscription.create({
        data: {
          userId: session.metadata!.userId,
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          status: subscription.status,
        },
      })
      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      const subscription = await stripe.subscriptions.retrieve(
        invoice.subscription as string
      )

      await prisma.subscription.update({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          status: subscription.status,
        },
      })
      break
    }
  }

  return NextResponse.json({ received: true })
}
```

---

## デプロイ（Vercel）

```bash
# Vercelにデプロイ
npm install -g vercel
vercel

# 環境変数を設定（Vercel Dashboard）
# - DATABASE_URL
# - NEXTAUTH_SECRET
# - NEXTAUTH_URL
# - GOOGLE_CLIENT_ID
# - GOOGLE_CLIENT_SECRET
# - STRIPE_SECRET_KEY
# - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
# - STRIPE_WEBHOOK_SECRET
# - RESEND_API_KEY
```

---

## チェックリスト

- ✅ プロジェクト作成
- ✅ データベース設定
- ✅ 認証実装（Google + Email/Password）
- ✅ ダッシュボード作成
- ✅ サブスクリプション（Stripe）
- ✅ Webhook設定
- ✅ デプロイ

**所要時間**: 3-5時間でMVP完成

---

## 次のステップ

- メール通知（Resend）
- ユーザーダッシュボード機能拡充
- 分析（Posthog / Google Analytics）
- エラートラッキング（Sentry）
