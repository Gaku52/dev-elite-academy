# クラウドプロバイダー比較

AWS、Azure、GCPの3大クラウドプロバイダーの比較と選定ガイドです。

## 市場シェアと学習優先度

| プロバイダー | 市場シェア | 学習優先度 | 求人数 | 特徴 |
|------------|-----------|-----------|--------|------|
| **AWS** | 🥇 32% | ⭐⭐⭐⭐⭐ 最優先 | 最多 | 最も成熟、案件豊富 |
| **Azure** | 🥈 23% | ⭐⭐⭐⭐ 次点 | 多い | 企業向け、MS製品連携 |
| **GCP** | 🥉 10% | ⭐⭐⭐ 余裕があれば | 普通 | データ分析、機械学習に強い |

**推奨**: まず**AWS**を習得 → 余裕があれば**Azure**を追加

---

## AWS（Amazon Web Services）

### 主要サービス一覧

#### コンピューティング
| サービス | 用途 | 料金モデル | 学習優先度 |
|---------|------|-----------|-----------|
| **EC2** | 仮想サーバー | 時間課金 | ⭐⭐⭐⭐⭐ 必須 |
| **Lambda** | サーバーレス関数 | 実行回数 | ⭐⭐⭐⭐⭐ 必須 |
| **ECS/EKS** | コンテナ実行 | インスタンス課金 | ⭐⭐⭐⭐ 重要 |
| **Fargate** | サーバーレスコンテナ | タスク課金 | ⭐⭐⭐ 推奨 |

#### ストレージ
| サービス | 用途 | 料金モデル | 学習優先度 |
|---------|------|-----------|-----------|
| **S3** | オブジェクトストレージ | 容量課金 | ⭐⭐⭐⭐⭐ 必須 |
| **EBS** | ブロックストレージ（EC2用） | 容量課金 | ⭐⭐⭐⭐ 重要 |
| **EFS** | ファイルストレージ | 容量課金 | ⭐⭐⭐ 推奨 |

#### データベース
| サービス | 種類 | 料金モデル | 学習優先度 |
|---------|------|-----------|-----------|
| **RDS** | リレーショナルDB | 時間課金 | ⭐⭐⭐⭐⭐ 必須 |
| **DynamoDB** | NoSQL | 容量・リクエスト課金 | ⭐⭐⭐⭐ 重要 |
| **Aurora** | 高性能RDS | 時間課金 | ⭐⭐⭐ 推奨 |

#### ネットワーク
| サービス | 用途 | 学習優先度 |
|---------|------|-----------|
| **VPC** | 仮想プライベートクラウド | ⭐⭐⭐⭐⭐ 必須 |
| **CloudFront** | CDN | ⭐⭐⭐⭐ 重要 |
| **Route 53** | DNS | ⭐⭐⭐⭐ 重要 |

#### その他重要サービス
| サービス | 用途 | 学習優先度 |
|---------|------|-----------|
| **IAM** | 権限管理 | ⭐⭐⭐⭐⭐ 必須 |
| **CloudWatch** | 監視・ログ | ⭐⭐⭐⭐⭐ 必須 |
| **CloudFormation** | IaC（Infrastructure as Code） | ⭐⭐⭐⭐ 重要 |

### AWS学習ロードマップ（3ヶ月）

#### 第1週: アカウント作成と基礎
```bash
# 1. AWS無料枠アカウント作成
https://aws.amazon.com/free/

# 2. EC2インスタンス起動
- Amazon Linux 2 選択
- t2.micro（無料枠）
- SSH接続確認

# 3. Webサーバー構築
sudo yum install -y httpd
sudo systemctl start httpd
```

#### 第2-4週: コアサービス習得
- **S3**: 静的Webホスティング
- **RDS**: PostgreSQL/MySQL構築
- **VPC**: ネットワーク設計
- **Lambda**: サーバーレス関数作成

#### 第5-8週: 実践プロジェクト
```
プロジェクト例: SaaSアプリのAWSデプロイ

フロントエンド: S3 + CloudFront
API: Lambda + API Gateway
DB: RDS (PostgreSQL)
認証: Cognito
```

#### 第9-12週: 資格取得準備
- **AWS Solutions Architect Associate** 取得
- Udemy講座 + 模擬試験
- ハンズオン演習

### AWS資格体系

| 資格名 | レベル | 難易度 | 取得目安 | 市場価値 |
|--------|--------|--------|---------|---------|
| **Cloud Practitioner** | 入門 | ⭐ | 1ヶ月 | △ |
| **Solutions Architect Associate** | アソシエイト | ⭐⭐⭐ | 2-3ヶ月 | ◎ 最重要 |
| **Developer Associate** | アソシエイト | ⭐⭐ | 2ヶ月 | ○ |
| **SysOps Administrator Associate** | アソシエイト | ⭐⭐⭐ | 2-3ヶ月 | ○ |
| **Solutions Architect Professional** | プロフェッショナル | ⭐⭐⭐⭐⭐ | 6ヶ月+ | ◎◎ |

**推奨順序**:
1. ~~Cloud Practitioner~~（スキップ可）
2. **Solutions Architect Associate** ← まずこれ！
3. Developer Associate または SysOps Administrator（必要に応じて）

---

## Azure（Microsoft Azure）

### 主要サービス一覧

| Azure | AWS対応 | 用途 |
|-------|---------|------|
| **App Service** | Elastic Beanstalk | Webアプリホスティング |
| **Functions** | Lambda | サーバーレス |
| **Virtual Machines** | EC2 | 仮想サーバー |
| **Blob Storage** | S3 | オブジェクトストレージ |
| **SQL Database** | RDS | リレーショナルDB |
| **Cosmos DB** | DynamoDB | NoSQL |
| **AKS** | EKS | Kubernetes |

### Azureの強み

- ✅ **Microsoft製品との連携** - Office 365, Active Directory
- ✅ **企業向け** - 大企業での採用が多い
- ✅ **ハイブリッドクラウド** - オンプレミス連携に強い
- ✅ **日本語サポート充実**

### Azure資格体系

| 資格名 | 難易度 | 取得目安 | 市場価値 |
|--------|--------|---------|---------|
| **Azure Fundamentals (AZ-900)** | ⭐ | 1ヶ月 | △ |
| **Azure Administrator (AZ-104)** | ⭐⭐⭐ | 2-3ヶ月 | ◎ |
| **Azure Solutions Architect (AZ-305)** | ⭐⭐⭐⭐ | 4-6ヶ月 | ◎◎ |

---

## GCP（Google Cloud Platform）

### 主要サービス一覧

| GCP | AWS対応 | 用途 |
|-----|---------|------|
| **Compute Engine** | EC2 | 仮想サーバー |
| **Cloud Functions** | Lambda | サーバーレス |
| **Cloud Run** | Fargate | コンテナ実行 |
| **Cloud Storage** | S3 | オブジェクトストレージ |
| **Cloud SQL** | RDS | リレーショナルDB |
| **BigQuery** | Athena | データウェアハウス |
| **GKE** | EKS | Kubernetes |

### GCPの強み

- ✅ **機械学習・AI** - TensorFlow, Vertex AI
- ✅ **データ分析** - BigQuery が強力
- ✅ **Kubernetes** - k8s発祥のGoogleが開発
- ✅ **料金が明瞭**

### GCP資格体系

| 資格名 | 難易度 | 市場価値 |
|--------|--------|---------|
| **Cloud Engineer (Associate)** | ⭐⭐⭐ | ○ |
| **Cloud Architect (Professional)** | ⭐⭐⭐⭐ | ◎ |

---

## クラウド選定基準

### プロジェクト要件による選択

| 要件 | 推奨クラウド | 理由 |
|------|------------|------|
| スタートアップSaaS | **AWS** | エコシステムが最も充実 |
| 企業内システム | **Azure** | AD連携、Office 365統合 |
| データ分析基盤 | **GCP** | BigQuery, AI/ML |
| コスト重視 | **GCP** | 料金体系がシンプル |
| グローバル展開 | **AWS** | リージョン数最多 |

### キャリア戦略による選択

| 目標 | 推奨 | 理由 |
|------|------|------|
| 最速で案件獲得 | **AWS** | 求人数が圧倒的 |
| 大企業転職 | **Azure** | 企業採用率高い |
| 技術特化 | **GCP** | 先進技術に触れられる |

---

## マルチクラウド戦略

### いつマルチクラウドを検討するか？

- ❌ **初期段階では不要** - 複雑性が増すだけ
- ✅ **ベンダーロックイン回避が重要な場合**
- ✅ **各クラウドの強みを活かしたい場合**

### マルチクラウド実装例

```
フロントエンド: Vercel (エッジ配信)
API: AWS Lambda (メイン処理)
データ分析: GCP BigQuery (分析基盤)
企業連携: Azure AD (認証)
```

---

## 実践演習プロジェクト

### プロジェクト1: 3層Webアプリ（AWS）
```
フロントエンド: S3 + CloudFront
API: Lambda + API Gateway
DB: RDS (PostgreSQL)
```

### プロジェクト2: コンテナアプリ（AWS）
```
コンテナ: ECS Fargate
ロードバランサー: ALB
DB: Aurora Serverless
監視: CloudWatch
```

### プロジェクト3: サーバーレスSaaS（AWS）
```
認証: Cognito
API: Lambda + API Gateway
DB: DynamoDB
ストレージ: S3
決済: Stripe
```

---

## 次のステップ

1. **AWSアカウント作成** - 無料枠で実践開始
2. **ハンズオン演習** - 上記プロジェクトを実装
3. **資格取得** - AWS Solutions Architect Associate
4. **実案件への適用** - 副業・本業で活用

詳細な学習計画は[キャリア・資格戦略](/career-strategy)を参照してください。
