# Supabase接続モード完全ガイド - 3つの接続方式を完全理解

## 📊 3つの接続モードの概要

Supabaseは**PgBouncer**というPostgreSQL接続プーリングツールを使用して、3つの接続モードを提供しています。

| 接続モード | ポート | 用途 | 接続の持続性 |
|------------|--------|------|--------------|
| **Direct Connection** | 5432 | リアルタイム・長時間処理 | 永続的 |
| **Session Pooler** | 5432 | 一般的なWebアプリ | セッション単位 |
| **Transaction Pooler** | 6543 | 開発・管理ツール | トランザクション単位 |

---

## 1️⃣ Direct Connection（直接接続）

### 🎯 特徴
```
ポート: 5432
接続方式: PostgreSQLへ直接接続
接続の維持: アプリが切断するまで永続的
```

### 📝 仕組みの説明
**「専用の電話回線」のようなもの**
- あなたのアプリケーションがデータベースと1対1で直接つながる
- 一度接続したら、切断するまでその接続を占有
- 他の人はその接続を使えない

### ✅ メリット
- **全PostgreSQL機能が使える**
  - LISTEN/NOTIFY（リアルタイム通知）
  - カーソル
  - 一時テーブル
  - プリペアドステートメント
- **接続が安定**
  - 長時間のクエリ実行可能
  - セッション変数を保持

### ❌ デメリット
- **接続数制限に達しやすい**（無料プラン: 60接続）
- **リソースを多く消費**
- **接続の無駄遣いが発生しやすい**

### 💡 使用すべき場面
```javascript
// リアルタイム機能を使う場合
const { data, error } = await supabase
  .from('messages')
  .on('INSERT', payload => {
    console.log('New message!', payload)
  })
  .subscribe()

// 長時間のバッチ処理
// 大量データのエクスポート
// WebSocketが必要な場合
```

---

## 2️⃣ Session Pooler（セッションプーリング）

### 🎯 特徴
```
ポート: 5432（Supabaseでは5432を共有）
接続方式: PgBouncer経由
接続の維持: セッション（ログイン〜ログアウト）単位
```

### 📝 仕組みの説明
**「共有オフィスの会議室」のようなもの**
- ユーザーセッションの間、接続を保持
- セッション中は同じ接続を使い回す
- セッション終了時に接続を解放して他の人が使える

### ✅ メリット
- **セッション変数が使える**
  ```sql
  SET SESSION my.variable = 'value';
  -- セッション中は保持される
  ```
- **プリペアドステートメントが使える**
- **Direct Connectionより効率的**

### ❌ デメリット
- **LISTEN/NOTIFYは使えない**
- **長時間アイドル状態だと切断される可能性**
- **Transaction Poolerより接続効率は劣る**

### 💡 使用すべき場面
```javascript
// ユーザーごとのセッション管理が必要な場合
// 例: ショッピングカート、ユーザー設定の一時保存

// セッション変数を活用する場合
await db.query("SET SESSION app.current_user = $1", [userId])
// このセッション中はapp.current_userが保持される
```

---

## 3️⃣ Transaction Pooler（トランザクションプーリング）⭐

### 🎯 特徴
```
ポート: 6543
接続方式: PgBouncer経由（最も積極的なプーリング）
接続の維持: トランザクション単位（超短期）
```

### 📝 仕組みの説明
**「レストランの相席システム」のようなもの**
- 1つのクエリ/トランザクションごとに接続を割り当て
- 実行が終わったら即座に接続を解放
- 次の人がすぐに使える（最高効率）

### ✅ メリット
- **最も効率的な接続管理**
- **接続数制限を最大限活用**
  - 60接続で数百〜数千のクライアントに対応可能
- **接続のオーバーヘッドが最小**
- **自動的な接続管理**

### ❌ デメリット
- **セッション機能は使えない**
  - SET SESSION変数
  - 一時テーブル
  - プリペアドステートメント
  - LISTEN/NOTIFY
- **トランザクションをまたぐ処理は不可**

### 💡 使用すべき場面
```javascript
// 一般的なCRUD操作
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)

// 短時間のクエリ実行
// 管理ツール（A5M2、DBeaver等）での接続
// 開発環境での作業
// APIエンドポイントからのDB接続
```

---

## 🎓 他人に説明する時の例え話

### 🏢 オフィスビルの例え

**Direct Connection = 専用オフィス**
- あなた専用の部屋
- 24時間使い放題
- でも家賃が高い（リソース消費大）

**Session Pooler = シェアオフィス**
- 利用時間中は専用デスク
- 帰ったら他の人が使える
- 荷物は置いておける（セッション変数）

**Transaction Pooler = ホットデスキング**
- 作業する時だけ席を使う
- 終わったらすぐ次の人へ
- 最も多くの人が使える（効率的）

---

## 🚀 実践的な選び方

```mermaid
graph TD
    A[どの接続モードを使う？] --> B{リアルタイム機能必要？}
    B -->|Yes| C[Direct Connection]
    B -->|No| D{セッション変数必要？}
    D -->|Yes| E[Session Pooler]
    D -->|No| F[Transaction Pooler ⭐]
    
    F --> G[開発環境]
    F --> H[管理ツール]
    F --> I[通常のWebアプリ]
    F --> J[REST API]
```

## 💡 プロのアドバイス

### 開発環境での推奨設定
```javascript
// .env.local
// Transaction Pooler（開発に最適）
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:6543/postgres?pgbouncer=true

// Direct（リアルタイム開発時のみ）
DIRECT_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```

### 本番環境での使い分け
```javascript
// 通常のクエリ: Transaction Pooler
const pgPool = new Pool({
  port: 6543,
  // ...
})

// リアルタイム専用: Direct
const realtimeClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})
```

## 📊 パフォーマンス比較

| メトリクス | Direct | Session | Transaction |
|-----------|--------|---------|-------------|
| 同時接続数対応 | 😰 低 | 😊 中 | 😄 高 |
| レスポンス速度 | 😄 速 | 😊 普通 | 😊 普通 |
| リソース効率 | 😰 低 | 😊 中 | 😄 高 |
| 機能の完全性 | 😄 100% | 😊 80% | 🤔 60% |
| 開発での使いやすさ | 😊 良 | 😊 良 | 😄 最高 |

---

## 🎯 まとめ：あなたの選択は正解！

**Transaction Pooler（ポート6543）を選んだのは最適な判断です！**

理由：
1. ✅ 開発・管理ツールに最適
2. ✅ 接続数を効率的に使える
3. ✅ 自動的な接続管理で楽
4. ✅ A5M2のような管理ツールとの相性抜群

Direct Connectionは「必要な時だけ」使えばOKです！