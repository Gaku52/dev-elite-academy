# バックエンド技術スタック

実践的なバックエンド技術の選定ガイドと実装例です。

## フレームワーク選定

### Node.js エコシステム（推奨度: ⭐⭐⭐⭐⭐）

#### Hono（最推奨・最速）

**なぜHono?**
- ✅ 超高速（Express比で10倍以上）
- ✅ TypeScript完全対応
- ✅ エッジ環境で動作（Cloudflare Workers等）
- ✅ シンプルなAPI

```bash
npm create hono@latest my-api
cd my-api
npm install
```

**実装例: CRUD API**

```typescript
// src/index.ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { jwt } from 'hono/jwt'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const app = new Hono()

// ミドルウェア
app.use('*', cors())
app.use('/api/*', jwt({ secret: process.env.JWT_SECRET! }))

// バリデーションスキーマ
const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})

// ルート
app.get('/', (c) => c.json({ message: 'Hello Hono!' }))

app.post('/api/users', zValidator('json', createUserSchema), async (c) => {
  const data = c.req.valid('json')

  // データベース操作（例: Prisma）
  const user = await db.user.create({ data })

  return c.json(user, 201)
})

app.get('/api/users/:id', async (c) => {
  const id = c.req.param('id')
  const user = await db.user.findUnique({ where: { id } })

  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }

  return c.json(user)
})

app.put('/api/users/:id', zValidator('json', createUserSchema), async (c) => {
  const id = c.req.param('id')
  const data = c.req.valid('json')

  const user = await db.user.update({
    where: { id },
    data,
  })

  return c.json(user)
})

app.delete('/api/users/:id', async (c) => {
  const id = c.req.param('id')
  await db.user.delete({ where: { id } })

  return c.json({ message: 'Deleted' })
})

export default app
```

#### Next.js API Routes（フルスタック向け）

**使いどころ**: フロントエンドとバックエンドを同じリポジトリで管理

```typescript
// app/api/users/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
})

export async function GET() {
  const users = await prisma.user.findMany()
  return NextResponse.json(users)
}

export async function POST(request: Request) {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = createUserSchema.parse(body)

    const user = await prisma.user.create({ data })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// app/api/users/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
  })

  if (!user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(user)
}
```

---

### Python エコシステム（推奨度: ⭐⭐⭐⭐）

#### FastAPI（Python最速）

**なぜFastAPI?**
- ✅ 自動でOpenAPI（Swagger）ドキュメント生成
- ✅ Pydanticによる型安全性
- ✅ 非同期処理対応

```bash
pip install fastapi uvicorn sqlalchemy psycopg2-binary
```

**実装例: CRUD API**

```python
# main.py
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from typing import List
import models, database

app = FastAPI()

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# スキーマ定義
class UserCreate(BaseModel):
    name: str
    email: EmailStr

class User(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True

# 依存性注入
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ルート
@app.get("/")
def read_root():
    return {"message": "Hello FastAPI"}

@app.post("/api/users", response_model=User, status_code=201)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(name=user.name, email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/api/users", response_model=List[User])
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@app.get("/api/users/{user_id}", response_model=User)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/api/users/{user_id}", response_model=User)
def update_user(user_id: int, user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db_user.name = user.name
    db_user.email = user.email
    db.commit()
    db.refresh(db_user)
    return db_user

@app.delete("/api/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(db_user)
    db.commit()
    return {"message": "Deleted"}

# 起動
# uvicorn main:app --reload
```

```python
# models.py
from sqlalchemy import Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
```

```python
# database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://user:password@localhost/dbname"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
```

---

## データベースアクセス

### Prisma（推奨度: ⭐⭐⭐⭐⭐）

**なぜPrisma?**
- ✅ TypeScript完全対応
- ✅ マイグレーション自動生成
- ✅ 型安全なクエリ

```bash
npm install prisma @prisma/client
npx prisma init
```

**schema.prisma**:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  posts     Post[]
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

```bash
# マイグレーション実行
npx prisma migrate dev --name init

# Prisma Clientを生成
npx prisma generate
```

**実装例**:

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// 使い方
import { prisma } from '@/lib/prisma'

// 作成
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
  },
})

// 取得（リレーション含む）
const userWithPosts = await prisma.user.findUnique({
  where: { id: userId },
  include: { posts: true },
})

// 更新
const updated = await prisma.user.update({
  where: { id: userId },
  data: { name: 'Jane Doe' },
})

// 削除
await prisma.user.delete({
  where: { id: userId },
})

// トランザクション
await prisma.$transaction([
  prisma.user.create({ data: userData }),
  prisma.post.create({ data: postData }),
])
```

---

## 認証

### NextAuth.js (Auth.js)（推奨度: ⭐⭐⭐⭐⭐）

```bash
npm install next-auth @prisma/client
```

**実装例**:

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions = {
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
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.hashedPassword) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        )

        if (!isPasswordValid) {
          return null
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
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

// 使い方（Server Component）
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export default async function Page() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <div>Please log in</div>
  }

  return <div>Hello, {session.user.name}</div>
}

// 使い方（Client Component）
'use client'
import { useSession, signIn, signOut } from 'next-auth/react'

export function AuthButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') return <div>Loading...</div>

  if (session) {
    return (
      <>
        <span>{session.user.name}</span>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }

  return <button onClick={() => signIn()}>Sign in</button>
}
```

---

## API設計パターン

### REST API（推奨度: ⭐⭐⭐⭐⭐）

**リソース設計**:

```
GET    /api/users           # 一覧取得
POST   /api/users           # 新規作成
GET    /api/users/:id       # 詳細取得
PUT    /api/users/:id       # 更新
DELETE /api/users/:id       # 削除

GET    /api/users/:id/posts # ユーザーの投稿一覧
```

**レスポンス形式（統一）**:

```typescript
// 成功レスポンス
{
  "data": { ... },
  "meta": {
    "timestamp": "2025-10-19T12:00:00Z"
  }
}

// エラーレスポンス
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  },
  "meta": {
    "timestamp": "2025-10-19T12:00:00Z"
  }
}
```

### tRPC（推奨度: ⭐⭐⭐⭐）

**なぜtRPC?**
- ✅ フロントエンド・バックエンド間で型共有
- ✅ REST APIより開発速度が速い
- ✅ Zodでバリデーション統一

```bash
npm install @trpc/server @trpc/client @trpc/react-query @trpc/next
```

**実装例**:

```typescript
// server/trpc.ts
import { initTRPC } from '@trpc/server'
import { z } from 'zod'

const t = initTRPC.create()

export const router = t.router
export const publicProcedure = t.procedure

// server/routers/user.ts
import { router, publicProcedure } from '../trpc'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

export const userRouter = router({
  list: publicProcedure.query(async () => {
    return await prisma.user.findMany()
  }),

  create: publicProcedure
    .input(z.object({
      name: z.string(),
      email: z.string().email(),
    }))
    .mutation(async ({ input }) => {
      return await prisma.user.create({ data: input })
    }),

  getById: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await prisma.user.findUnique({ where: { id: input } })
    }),
})

// フロントエンドで使用
'use client'
import { trpc } from '@/lib/trpc'

export function UserList() {
  const { data: users, isLoading } = trpc.user.list.useQuery()
  const createUser = trpc.user.create.useMutation()

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <button onClick={() => createUser.mutate({ name: 'John', email: 'john@example.com' })}>
        Add User
      </button>
      <ul>
        {users?.map(user => <li key={user.id}>{user.name}</li>)}
      </ul>
    </div>
  )
}
```

---

## 推奨技術スタック（2025年版）

### SaaS Backend（Next.js同居）
```
- Framework: Next.js API Routes
- Database: Prisma + PostgreSQL (Supabase)
- Auth: NextAuth.js
- Validation: Zod
```

### 独立API（マイクロサービス）
```
- Framework: Hono
- Database: Prisma + PostgreSQL
- Auth: JWT (jose)
- Validation: Zod
- Deploy: Cloudflare Workers / Vercel
```

### Python Backend
```
- Framework: FastAPI
- ORM: SQLAlchemy
- Auth: OAuth2 + JWT
- Database: PostgreSQL
- Deploy: Railway / Render
```

---

## 次のステップ

- [データベース](/tech-stacks/database) - DB設計
- [DevOps・インフラ](/tech-stacks/devops) - デプロイ戦略
- [プロジェクトテンプレート](/templates/saas-mvp) - 完全実装例
