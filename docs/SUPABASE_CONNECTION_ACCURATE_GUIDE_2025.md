# Supabase接続モード 正確な技術仕様ガイド (2025年版)

## 🔄 重要な変更情報 (2025年)

### ⚠️ 2025年2月28日の重要な変更
- **ポート6543**: Session Modeが廃止され、**Transaction Modeのみ**対応
- **ポート5432**: Session Modeは引き続き利用可能
- **理由**: ポートとモードの対応を明確化し、システムを簡素化

### 📌 現在の技術スタック
- **Supavisor**: 新しい接続プーラー（PgBouncerの後継）
- **IPv6**: Direct接続のデフォルト（IPv4は有料アドオン）

---

## 📊 接続モード詳細仕様

### 1. Direct Connection (直接接続)

#### 技術仕様
```
プロトコル: PostgreSQL native protocol
ポート: 5432
接続形式: 直接接続（プロキシなし）
IP: IPv6のみ（IPv4は有料アドオン）
ホスト形式: db.xxxxx.supabase.co
```

#### 接続文字列
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

#### 特徴
- ✅ **全PostgreSQL機能が利用可能**
  - LISTEN/NOTIFY
  - プリペアドステートメント
  - カーソル
  - 一時テーブル
  - セッション変数
- ✅ **永続的な接続**
- ❌ **IPv6必須**（IPv4は追加料金）
- ❌ **接続数制限あり**（無料プラン: 60接続）

#### 推奨用途
- 永続的なバックエンドサービス
- リアルタイム機能を使うアプリケーション
- 長時間実行されるバッチ処理
- VM、EC2、長寿命コンテナ

---

### 2. Supavisor Session Mode (セッションプーリング)

#### 技術仕様
```
プロトコル: Supavisor proxy経由
ポート: 5432
接続形式: プロキシ接続（Supavisor）
IP: IPv4/IPv6両対応
ホスト形式: aws-0-[REGION].pooler.supabase.com
ユーザー名形式: postgres.xxxxx（プロジェクトID付き）
```

#### 接続文字列
```
postgres://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

#### 特徴
- ✅ **IPv4/IPv6両対応**
- ✅ **セッション機能利用可能**
  - プリペアドステートメント
  - セッション変数
  - 一時テーブル
- ⚠️ **一部機能制限**
  - LISTEN/NOTIFYは使用不可
- ✅ **接続の再利用**（セッション終了後）

#### 推奨用途
- IPv4が必要な永続的バックエンド
- セッション状態を保持する必要があるアプリ
- 従来のWebアプリケーション

---

### 3. Supavisor Transaction Mode (トランザクションプーリング)

#### 技術仕様
```
プロトコル: Supavisor proxy経由
ポート: 6543（2025年2月28日以降専用）
接続形式: プロキシ接続（Supavisor）
IP: IPv4/IPv6両対応
ホスト形式: aws-0-[REGION].pooler.supabase.com
ユーザー名形式: postgres.xxxxx（プロジェクトID付き）
```

#### 接続文字列
```
postgres://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

#### 特徴
- ✅ **最高の接続効率**
- ✅ **IPv4/IPv6両対応**
- ✅ **サーバーレス環境に最適**
- ❌ **機能制限あり**
  - プリペアドステートメント使用不可
  - セッション変数使用不可
  - 一時テーブル使用不可
  - LISTEN/NOTIFY使用不可
- ✅ **自動接続管理**

#### 推奨用途
- **サーバーレス関数**（Lambda, Vercel Functions等）
- **エッジ関数**
- **短命な接続が多い環境**
- **開発・管理ツール**（A5M2等）

---

## 🏢 エンタープライズ向け: Dedicated Pooler (有料)

#### 技術仕様
```
技術: PgBouncer
配置: データベースと同一場所
性能: 最高のパフォーマンスと低レイテンシ
要件: IPv6対応またはIPv4アドオン
```

#### 特徴
- ✅ 専用リソース
- ✅ 最高のパフォーマンス
- ✅ カスタマイズ可能な設定
- 💰 追加コストが発生

---

## 🔍 接続モード選択フローチャート

```mermaid
graph TD
    Start[接続モードを選択] --> Q1{サーバーレス環境？}
    Q1 -->|Yes| TM[Transaction Mode<br/>ポート: 6543]
    Q1 -->|No| Q2{リアルタイム機能必要？}
    Q2 -->|Yes| Q3{IPv6対応？}
    Q3 -->|Yes| DC[Direct Connection<br/>ポート: 5432]
    Q3 -->|No| ERROR[IPv4アドオン必要]
    Q2 -->|No| Q4{セッション機能必要？}
    Q4 -->|Yes| SM[Session Mode<br/>ポート: 5432]
    Q4 -->|No| TM2[Transaction Mode<br/>ポート: 6543]
```

---

## 📋 機能比較表（正確版）

| 機能 | Direct | Session Mode | Transaction Mode |
|-----|--------|--------------|------------------|
| **ポート** | 5432 | 5432 | 6543 |
| **IPv4対応** | ❌（アドオン必要） | ✅ | ✅ |
| **IPv6対応** | ✅ | ✅ | ✅ |
| **LISTEN/NOTIFY** | ✅ | ❌ | ❌ |
| **プリペアドステートメント** | ✅ | ✅ | ❌ |
| **セッション変数** | ✅ | ✅ | ❌ |
| **一時テーブル** | ✅ | ✅ | ❌ |
| **カーソル** | ✅ | ⚠️制限あり | ❌ |
| **接続効率** | 低 | 中 | 高 |
| **推奨環境** | VM/永続サーバー | 通常のWebアプリ | サーバーレス |

---

## 🎯 A5M2での接続（あなたのケース）

### Transaction Mode（ポート6543）が最適な理由

1. **接続数の効率的な利用**
   - 短時間で接続を解放
   - 他のツールと競合しない

2. **管理ツールに最適**
   - SELECT/INSERT/UPDATE/DELETE操作に十分
   - プリペアドステートメント不要

3. **安定性**
   - 自動的な接続管理
   - タイムアウトの心配なし

### 接続設定（正確版）
```
ホスト: aws-0-[REGION].pooler.supabase.com
ポート: 6543
データベース: postgres
ユーザー: postgres.ttsdtjzcgxufudepclzg
パスワード: [あなたのパスワード]
SSL: 必須（sslmode=require）
```

---

## 🚨 よくある誤解の訂正

### ❌ 誤解1: 「Direct ConnectionはポートもSession/Transactionと同じ」
✅ **正解**: 
- Direct: `db.xxxxx.supabase.co`（別ホスト）
- Session/Transaction: `aws-0-[REGION].pooler.supabase.com`（プーラー経由）

### ❌ 誤解2: 「Session ModeとTransaction Modeは同じポート」
✅ **正解**: 
- Session Mode: ポート5432
- Transaction Mode: ポート6543（2025年2月28日以降）

### ❌ 誤解3: 「Transaction Modeは機能が少ないから劣っている」
✅ **正解**: 
- 用途に特化して最適化されている
- サーバーレス環境では最良の選択

---

## 📚 参考資料

- [Supabase公式ドキュメント - Database接続](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Supavisor発表ブログ](https://supabase.com/blog/supavisor-postgres-connection-pooler)
- [2025年2月28日の変更について](https://github.com/orgs/supabase/discussions/32755)

---

最終更新: 2025年1月（最新の仕様に基づく）