'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, CheckCircle, Circle, ChevronRight, Shield, AlertCircle, Trophy } from 'lucide-react';
import { useLearningProgress } from '@/hooks/useLearningProgress';

interface Quiz {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface Section {
  title: string;
  content: string;
  quizzes: Quiz[];
}

interface Module {
  id: number;
  title: string;
  sections: Section[];
}

const learningModules: Module[] = [
  {
    id: 1,
    title: '情報セキュリティの基礎',
    sections: [
      {
        title: '情報セキュリティの3要素',
        content: `情報セキュリティの基本的な考え方と重要な概念：

**CIA Triad（情報セキュリティの3要素）:**

1. **機密性（Confidentiality）**
   - 認可された者だけが情報にアクセスできる
   - アクセス制御、暗号化、認証
   - Need-to-knowの原則
   - 情報漏洩の防止

2. **完全性（Integrity）**
   - 情報の正確性・完全性を保つ
   - 改ざん防止、デジタル署名
   - ハッシュ関数による検証
   - 監査ログの保護

3. **可用性（Availability）**
   - 必要な時に情報にアクセスできる
   - システムの冗長化、バックアップ
   - DDoS対策、災害復旧計画
   - サービスレベルアグリーメント（SLA）

**追加の要素:**

4. **真正性（Authenticity）**
   - 利用者・情報が本物であることの保証
   - デジタル証明書、電子署名
   - 本人確認、なりすまし防止

5. **責任追跡性（Accountability）**
   - 行動を個人と結びつけられる
   - ログ管理、監査証跡
   - アクセス履歴の記録

6. **否認防止（Non-repudiation）**
   - 行為を後で否定できない
   - デジタル署名、タイムスタンプ
   - 証拠の保全

**信頼性（Reliability）**
- システムの安定稼働
- 障害率の低減
- MTBF、MTTR`,
        quizzes: [
          {
            question: '情報セキュリティの3要素（CIA）に含まれないものはどれか？',
            options: ['機密性', '完全性', '可用性', '効率性'],
            correct: 3,
            explanation: '情報セキュリティの3要素は機密性（Confidentiality）、完全性（Integrity）、可用性（Availability）です。効率性は含まれません。'
          },
          {
            question: 'デジタル署名の主な目的として適切なものはどれか？',
            options: ['通信速度の向上', '改ざん検出と本人確認', 'データ圧縮', 'アクセス制御'],
            correct: 1,
            explanation: 'デジタル署名は、データの改ざん検出（完全性）と署名者の本人確認（真正性）を実現し、否認防止にも寄与します。'
          },
          {
            question: '可用性を向上させる対策として適切でないものはどれか？',
            options: ['システムの冗長化', 'バックアップの取得', 'アクセス権限の厳格化', '負荷分散'],
            correct: 2,
            explanation: 'アクセス権限の厳格化は機密性を高める対策です。可用性向上には冗長化、バックアップ、負荷分散などが有効です。'
          },
          {
            question: 'MTBFとMTTRの説明として正しいものはどれか？',
            options: ['MTBFは修理時間、MTTRは故障間隔', 'MTBFは故障間隔、MTTRは修理時間', 'どちらも故障率を表す', 'どちらも修理時間を表す'],
            correct: 1,
            explanation: 'MTBF（Mean Time Between Failures）は平均故障間隔、MTTR（Mean Time To Repair）は平均修理時間を表します。'
          },
          {
            question: '否認防止を実現する技術として最も適切なものはどれか？',
            options: ['ファイアウォール', 'デジタル署名', 'ウイルス対策ソフト', 'VPN'],
            correct: 1,
            explanation: 'デジタル署名は秘密鍵で署名することで、後から「自分が行った行為ではない」と否認することを防ぎます。'
          },
          {
            question: '機密性の確保に最も適した技術はどれか？',
            options: ['データの複製', '暗号化', 'データ圧縮', 'インデックス作成'],
            correct: 1,
            explanation: '暗号化は認可されていない者がデータを読み取れないようにするため、機密性の確保に最も適した技術です。'
          },
          {
            question: '完全性を脅かす攻撃はどれか？',
            options: ['盗聴', 'データ改ざん', 'DDoS攻撃', 'なりすまし'],
            correct: 1,
            explanation: 'データ改ざんは情報の正確性や完全性を損なう攻撃で、完全性を直接脅かします。'
          },
          {
            question: 'Need-to-know原則の説明として正しいものはどれか？',
            options: ['全員が全ての情報にアクセスできる', '業務に必要な情報のみアクセス可能', '管理者のみアクセス可能', '誰もアクセスできない'],
            correct: 1,
            explanation: 'Need-to-know原則は、業務遂行に必要な情報のみにアクセスを制限する機密性の基本原則です。'
          },
          {
            question: 'SLA（Service Level Agreement）の主な目的はどれか？',
            options: ['セキュリティ強化', 'サービス品質の保証', 'コスト削減', 'システム高速化'],
            correct: 1,
            explanation: 'SLAはサービス提供者と利用者の間でサービス品質を明確にし、可用性などの基準を保証する契約です。'
          },
          {
            question: '真正性（Authenticity）を確保する仕組みとして適切でないものはどれか？',
            options: ['デジタル証明書', 'バイオメトリクス認証', 'データ暗号化', 'ワンタイムパスワード'],
            correct: 2,
            explanation: 'データ暗号化は主に機密性を確保する技術です。真正性は身元確認や本人確認に関する要素です。'
          },
          {
            question: 'アカウンタビリティ（責任追跡性）を実現するために必要なものはどれか？',
            options: ['データ暗号化', '監査ログ', 'ファイアウォール', 'ウイルス対策'],
            correct: 1,
            explanation: '監査ログは誰がいつ何を行ったかを記録し、行動の責任を追跡可能にするため、アカウンタビリティに必要です。'
          },
          {
            question: 'タイムスタンプの主な用途はどれか？',
            options: ['処理時間の短縮', '否認防止', 'データ圧縮', 'アクセス制御'],
            correct: 1,
            explanation: 'タイムスタンプは特定の時刻にデータが存在していたことを証明し、後からの否認を防ぐために使用されます。'
          },
          {
            question: '情報資産の価値を決定する際に考慮すべき要素として適切でないものはどれか？',
            options: ['機密性の度合い', '業務への影響度', 'ファイルサイズ', '法的要求事項'],
            correct: 2,
            explanation: '情報資産の価値は機密性、業務への影響、法的要求などで決まりますが、ファイルサイズは直接的な価値とは関係ありません。'
          },
        ]
      },
      {
        title: '脅威と脆弱性',
        content: `情報システムに対する様々な脅威と脆弱性：

**脅威の分類:**

1. **人的脅威**
   - 意図的脅威: サイバー攻撃、内部不正
   - 偶発的脅威: 操作ミス、設定ミス
   - 環境的脅威: 自然災害、停電

2. **技術的脅威**
   - マルウェア: ウイルス、ワーム、トロイの木馬
   - ランサムウェア: データ暗号化による身代金要求
   - スパイウェア: 情報窃取
   - ボットネット: 遠隔操作による攻撃

**主な攻撃手法:**

1. **ソーシャルエンジニアリング**
   - フィッシング: 偽サイトへの誘導
   - スピアフィッシング: 標的型攻撃
   - プリテキスティング: なりすまし
   - ショルダーハッキング: 覗き見

2. **技術的攻撃**
   - SQLインジェクション: DB不正操作
   - XSS（クロスサイトスクリプティング）
   - CSRF（クロスサイトリクエストフォージェリ）
   - バッファオーバーフロー
   - ゼロデイ攻撃

3. **ネットワーク攻撃**
   - DoS/DDoS攻撃: サービス妨害
   - MitM（中間者攻撃）
   - セッションハイジャック
   - DNSキャッシュポイズニング

**脆弱性管理:**
- CVE（共通脆弱性識別子）
- CVSS（共通脆弱性評価システム）
- パッチマネジメント
- 脆弱性診断、ペネトレーションテスト`,
        quizzes: [
          {
            question: 'SQLインジェクション攻撃の対策として最も効果的なものはどれか？',
            options: ['ファイアウォールの導入', 'プリペアドステートメントの使用', 'アンチウイルスソフトの導入', 'パスワードの複雑化'],
            correct: 1,
            explanation: 'プリペアドステートメント（パラメータ化クエリ）を使用することで、SQLコードとデータを分離し、SQLインジェクションを防げます。'
          },
          {
            question: 'ランサムウェアの特徴として正しいものはどれか？',
            options: ['システムの処理速度を低下させる', 'データを暗号化して身代金を要求する', 'パスワードを盗み取る', 'スパムメールを大量送信する'],
            correct: 1,
            explanation: 'ランサムウェアは、ユーザーのデータを暗号化し、復号化の対価として身代金（ransom）を要求するマルウェアです。'
          },
          {
            question: 'XSS（クロスサイトスクリプティング）攻撃を防ぐ対策はどれか？',
            options: ['入力値のエスケープ処理', 'ポート番号の変更', 'MACアドレスフィルタリング', 'ディスク暗号化'],
            correct: 0,
            explanation: '入力値の適切なエスケープ処理（サニタイジング）により、悪意のあるスクリプトの実行を防ぐことができます。'
          },
          {
            question: 'ゼロデイ攻撃の説明として正しいものはどれか？',
            options: ['0時に実行される攻撃', '修正パッチが公開される前の脆弱性を狙う攻撃', 'ログを0にリセットする攻撃', '0番ポートを狙う攻撃'],
            correct: 1,
            explanation: 'ゼロデイ攻撃は、脆弱性が発見されてから修正パッチが提供されるまでの期間（0日）に行われる攻撃です。'
          },
          {
            question: 'フィッシング攻撃の手口として一般的なものはどれか？',
            options: ['大量のパケットを送信する', '正規サイトに似せた偽サイトへ誘導する', 'ウイルスを添付する', 'パスワードを総当たりする'],
            correct: 1,
            explanation: 'フィッシングは、正規の組織を装った偽のWebサイトやメールで、ユーザーをだまして個人情報を入力させる攻撃です。'
          },
          {
            question: 'トロイの木馬の特徴として正しいものはどれか？',
            options: ['自己複製する', '有用なソフトウェアを装って侵入する', 'ネットワークを介して拡散する', '自動的にバックアップを作成する'],
            correct: 1,
            explanation: 'トロイの木馬は有用なプログラムを装って侵入し、内部で悪意のある活動を行うマルウェアです。'
          },
          {
            question: 'ボットネットの説明として正しいものはどれか？',
            options: ['高速なネットワーク', '感染したコンピュータの集合体', '暗号化通信プロトコル', 'データ保存システム'],
            correct: 1,
            explanation: 'ボットネットは、マルウェアに感染し攻撃者に制御されたコンピュータ群で、協調してサイバー攻撃を行います。'
          },
          {
            question: 'スピアフィッシングの特徴はどれか？',
            options: ['無差別な攻撃', '特定の組織や個人を標的とした攻撃', 'システムの脆弱性を狙う攻撃', 'サービス拒否攻撃'],
            correct: 1,
            explanation: 'スピアフィッシングは特定の組織や個人を標的として、その情報を事前に調査した上で行う精密なフィッシング攻撃です。'
          },
          {
            question: 'DoS攻撃とDDoS攻撃の違いはどれか？',
            options: ['攻撃対象が異なる', '攻撃手法が異なる', '攻撃元の数が異なる', '攻撃時間が異なる'],
            correct: 2,
            explanation: 'DoS攻撃は単一の攻撃元から、DDoS攻撃は複数の攻撃元から同時にサービス拒否攻撃を行います。'
          },
          {
            question: 'CSRF（クロスサイトリクエストフォージェリ）攻撃の対策として適切なものはどれか？',
            options: ['SQLインジェクション対策', 'CSRFトークンの実装', 'SSL/TLSの使用', 'ファイアウォールの設置'],
            correct: 1,
            explanation: 'CSRFトークンを実装することで、正当なユーザーからのリクエストであることを検証し、CSRF攻撃を防げます。'
          },
          {
            question: 'バッファオーバーフロー攻撃の説明として正しいものはどれか？',
            options: ['メモリの境界を超えてデータを書き込む攻撃', 'ネットワーク帯域を消費する攻撃', 'パスワードを推測する攻撃', 'データを暗号化する攻撃'],
            correct: 0,
            explanation: 'バッファオーバーフローは、プログラムのメモリ境界を超えてデータを書き込み、システムの制御を奪う攻撃です。'
          },
          {
            question: 'APT（Advanced Persistent Threat）攻撃の特徴はどれか？',
            options: ['短期間で大規模な攻撃', '長期間潜伏して継続的に活動', '自動化された攻撃', '単発的な攻撃'],
            correct: 1,
            explanation: 'APT攻撃は、標的のシステムに長期間潜伏し、継続的に情報を窃取する高度で持続的な攻撃です。'
          },
          {
            question: 'ソーシャルエンジニアリングの対策として最も重要なものはどれか？',
            options: ['技術的対策の強化', '従業員の教育・訓練', 'パスワードの複雑化', 'ファイアウォールの設置'],
            correct: 1,
            explanation: 'ソーシャルエンジニアリングは人の心理を利用した攻撃のため、従業員への教育・訓練が最も重要な対策です。'
          },
          {
            question: 'ワーム型ウイルスの特徴として正しいものはどれか？',
            options: ['宿主ファイルが必要', '自己複製してネットワーク経由で拡散', '手動で実行する必要がある', '暗号化機能を持つ'],
            correct: 1,
            explanation: 'ワームは宿主ファイルを必要とせず、自己複製してネットワークを通じて自動的に拡散するマルウェアです。'
          },
          {
            question: 'CVE（Common Vulnerabilities and Exposures）の目的はどれか？',
            options: ['暗号化の標準化', '脆弱性の共通識別', 'ネットワークの最適化', 'パフォーマンスの測定'],
            correct: 1,
            explanation: 'CVEは脆弱性に共通の識別子を付与し、情報共有と管理を効率化するための仕組みです。'
          },
          {
            question: 'CVSS（Common Vulnerability Scoring System）で評価される項目に含まれないものはどれか？',
            options: ['攻撃元の複雑さ', '攻撃に必要な権限', 'ユーザーの介在', '発見者の身元'],
            correct: 3,
            explanation: 'CVSSは脆弱性の深刻度を評価するシステムで、技術的な要素を評価しますが、発見者の身元は評価項目ではありません。'
          },
          {
            question: 'ペネトレーションテストの目的として正しいものはどれか？',
            options: ['システムの処理速度向上', '実際の攻撃手法でセキュリティ検証', 'データのバックアップ', 'ネットワーク帯域の測定'],
            correct: 1,
            explanation: 'ペネトレーションテストは実際の攻撃手法を模擬して、システムのセキュリティ強度を検証する手法です。'
          },
          {
            question: 'ハニーポットの主な用途はどれか？',
            options: ['データの暗号化', '攻撃手法の分析', 'ネットワーク速度の向上', 'データの圧縮'],
            correct: 1,
            explanation: 'ハニーポットは意図的に攻撃を誘引して攻撃手法を分析し、セキュリティ対策の向上に活用するシステムです。'
          },
          {
            question: 'セッションハイジャックの対策として適切なものはどれか？',
            options: ['パスワードの定期変更', 'SSL/TLSによる通信暗号化', 'ファイルの圧縮', 'データの複製'],
            correct: 1,
            explanation: 'SSL/TLSによる通信暗号化により、セッションIDの盗聴を防ぎ、セッションハイジャックを対策できます。'
          },
          {
            question: 'DNSキャッシュポイズニングの説明として正しいものはどれか？',
            options: ['DNSサーバの物理的破壊', '偽のDNS応答でキャッシュを汚染', 'DNS設定の削除', 'DNSサーバの過負荷'],
            correct: 1,
            explanation: 'DNSキャッシュポイズニングは、偽のDNS応答をキャッシュさせることで、ユーザーを悪意のあるサイトに誘導する攻撃です。'
          }
        ]
      },
      {
        title: '暗号技術',
        content: `データ保護のための暗号化技術：

**暗号方式の分類:**

1. **共通鍵暗号（対称鍵暗号）**
   - DES: 56ビット鍵（現在は非推奨）
   - 3DES: DESを3回適用
   - AES: 128/192/256ビット（現在の標準）
   - 特徴: 高速、鍵配送問題

2. **公開鍵暗号（非対称鍵暗号）**
   - RSA: 素因数分解の困難性
   - DSA: 離散対数問題
   - 楕円曲線暗号（ECC）: 短い鍵長で高セキュリティ
   - 特徴: 低速、鍵配送問題を解決

3. **ハイブリッド暗号**
   - 共通鍵暗号と公開鍵暗号の組み合わせ
   - SSL/TLSで使用
   - セッション鍵の安全な交換

**ハッシュ関数:**
- MD5: 128ビット（脆弱性あり）
- SHA-1: 160ビット（非推奨）
- SHA-256/512: 安全性が高い
- 用途: パスワード保管、改ざん検出

**デジタル署名と認証:**
- PKI（公開鍵基盤）
- デジタル証明書（X.509）
- 認証局（CA）、登録局（RA）
- SSL/TLSサーバ証明書
- コード署名

**暗号化の応用:**
- VPN: IPsec、SSL-VPN
- メール暗号化: S/MIME、PGP
- ディスク暗号化: BitLocker、FileVault
- データベース暗号化: TDE
- ブロックチェーン: ハッシュチェーン`,
        quizzes: [
          {
            question: 'AES暗号の鍵長として正しくないものはどれか？',
            options: ['128ビット', '192ビット', '256ビット', '512ビット'],
            correct: 3,
            explanation: 'AES（Advanced Encryption Standard）の鍵長は128ビット、192ビット、256ビットの3種類です。512ビットは存在しません。'
          },
          {
            question: '公開鍵暗号方式の特徴として誤っているものはどれか？',
            options: ['鍵配送問題を解決できる', '処理速度が速い', 'デジタル署名に利用できる', '暗号化と復号で異なる鍵を使用'],
            correct: 1,
            explanation: '公開鍵暗号は共通鍵暗号に比べて処理速度が遅いため、大量のデータ暗号化には不向きです。'
          },
          {
            question: 'ハッシュ関数の特性として正しくないものはどれか？',
            options: ['一方向性がある', '元のデータを復元できる', '固定長の出力', '衝突耐性がある'],
            correct: 1,
            explanation: 'ハッシュ関数は一方向性関数であり、ハッシュ値から元のデータを復元することはできません。'
          },
          {
            question: 'SSL/TLSで最初に行われる処理はどれか？',
            options: ['データの暗号化', 'ハンドシェイク', 'デジタル署名', 'ハッシュ値の計算'],
            correct: 1,
            explanation: 'SSL/TLSではまずハンドシェイクを行い、サーバ認証、暗号スイートの決定、セッション鍵の交換などを行います。'
          },
          {
            question: 'PKIにおける認証局（CA）の役割はどれか？',
            options: ['暗号鍵の生成', 'デジタル証明書の発行', 'データの暗号化', 'ウイルスチェック'],
            correct: 1,
            explanation: '認証局（CA）は、申請者の身元を確認し、公開鍵に対するデジタル証明書を発行する信頼できる第三者機関です。'
          },
          {
            question: 'DES暗号が現在非推奨とされる理由はどれか？',
            options: ['処理速度が遅い', '鍵長が短すぎる', '特許の問題', '実装が複雑'],
            correct: 1,
            explanation: 'DESは56ビットの鍵長で、現在のコンピュータの性能では総当たり攻撃が可能なため非推奨とされています。'
          },
          {
            question: '楕円曲線暗号（ECC）の利点はどれか？',
            options: ['実装が簡単', '短い鍵長で高いセキュリティ', '処理速度が最も速い', '古くからある技術'],
            correct: 1,
            explanation: '楕円曲線暗号は、RSAなどに比べて短い鍵長で同等のセキュリティレベルを実現できます。'
          },
          {
            question: 'ハイブリッド暗号方式が使用される理由はどれか？',
            options: ['セキュリティの向上', '共通鍵と公開鍵の利点を組み合わせ', '鍵管理の簡素化', '標準規格への準拠'],
            correct: 1,
            explanation: 'ハイブリッド暗号は公開鍵暗号で鍵配送問題を解決し、共通鍵暗号で高速処理を実現する方式です。'
          },
          {
            question: 'SHA-1ハッシュ関数が非推奨とされる理由はどれか？',
            options: ['処理速度が遅い', '出力長が短い', '衝突攻撃の脆弱性', '実装が困難'],
            correct: 2,
            explanation: 'SHA-1は理論的および実用的な衝突攻撃が発見されており、現在は非推奨とされています。'
          },
          {
            question: 'ソルト（Salt）の目的として正しいものはどれか？',
            options: ['データ圧縮', 'レインボーテーブル攻撃の防止', '処理速度向上', 'メモリ使用量削減'],
            correct: 1,
            explanation: 'ソルトはパスワードハッシュ化時にランダム値を追加し、同じパスワードでも異なるハッシュ値にしてレインボーテーブル攻撃を防ぎます。'
          },
          {
            question: 'RSA暗号の安全性の根拠となる数学的問題はどれか？',
            options: ['離散対数問題', '素因数分解問題', '楕円曲線問題', 'ナップサック問題'],
            correct: 1,
            explanation: 'RSA暗号の安全性は、大きな合成数の素因数分解が困難であることに基づいています。'
          },
          {
            question: 'ブロック暗号とストリーム暗号の違いはどれか？',
            options: ['鍵の長さ', 'データ処理の単位', 'セキュリティレベル', '使用する数学的問題'],
            correct: 1,
            explanation: 'ブロック暗号は固定長のブロック単位で、ストリーム暗号は1ビットまたは1バイト単位でデータを処理します。'
          },
          {
            question: 'X.509証明書に含まれない情報はどれか？',
            options: ['証明書の有効期限', '発行者のデジタル署名', '秘密鍵', '公開鍵'],
            correct: 2,
            explanation: 'X.509証明書には公開鍵は含まれますが、セキュリティ上、秘密鍵は含まれません。'
          },
          {
            question: 'PGP（Pretty Good Privacy）の主な用途はどれか？',
            options: ['Webサーバの認証', 'メール暗号化', 'データベース暗号化', 'ディスク暗号化'],
            correct: 1,
            explanation: 'PGPは主に電子メールの暗号化とデジタル署名に使用される暗号化ソフトウェアです。'
          },
          {
            question: 'S/MIMEとPGPの主な違いはどれか？',
            options: ['暗号化強度', '証明書の管理方式', '対応メールソフト', '処理速度'],
            correct: 1,
            explanation: 'S/MIMEは階層型PKI、PGPは分散型の信頼モデル（Web of Trust）を採用している点が主な違いです。'
          },
          {
            question: 'CTR（Counter）モードの特徴はどれか？',
            options: ['エラーが伝播する', '並列処理が可能', '最も古いモード', 'IVが不要'],
            correct: 1,
            explanation: 'CTRモードは各ブロックを独立して処理できるため、並列処理が可能で高速化できます。'
          },
          {
            question: 'HMAC（Hash-based Message Authentication Code）の目的はどれか？',
            options: ['データ暗号化', 'メッセージ認証と完全性確保', 'デジタル署名', '鍵交換'],
            correct: 1,
            explanation: 'HMACは共有鍵とハッシュ関数を使用してメッセージの認証と完全性を確保する仕組みです。'
          },
          {
            question: 'Diffie-Hellman鍵交換の用途はどれか？',
            options: ['デジタル署名', '共通鍵の安全な共有', 'データ暗号化', 'ハッシュ値計算'],
            correct: 1,
            explanation: 'Diffie-Hellman鍵交換は、公開チャネル上で安全に共通鍵を共有するためのプロトコルです。'
          },
          {
            question: 'ブロックチェーンで使用されるハッシュチェーンの目的はどれか？',
            options: ['処理速度向上', 'データの改ざん検出', 'データ圧縮', 'アクセス制御'],
            correct: 1,
            explanation: 'ハッシュチェーンは前のブロックのハッシュ値を含むことで、チェーン全体の改ざんを検出できます。'
          },
          {
            question: 'IPsec VPNで使用される暗号化プロトコルはどれか？',
            options: ['SSL/TLS', 'ESP（Encapsulating Security Payload）', 'SSH', 'HTTPS'],
            correct: 1,
            explanation: 'IPsecではESP（Encapsulating Security Payload）プロトコルがデータの暗号化を担当します。'
          }
        ]
      },
      {
        title: 'アクセス制御と認証',
        content: `システムへのアクセス管理と本人確認の仕組み：

**認証の要素:**

1. **知識情報（Something you know）**
   - パスワード、PIN
   - 秘密の質問
   - パスフレーズ

2. **所持情報（Something you have）**
   - ICカード、トークン
   - スマートフォン（SMS、アプリ）
   - ハードウェアキー

3. **生体情報（Something you are）**
   - 指紋、虹彩、顔認証
   - 静脈パターン、声紋
   - FAR（他人受入率）、FRR（本人拒否率）

**多要素認証（MFA）:**
- 2要素認証（2FA）
- リスクベース認証
- ワンタイムパスワード（OTP）
- FIDO認証

**アクセス制御モデル:**

1. **任意アクセス制御（DAC）**
   - 所有者が権限を設定
   - UNIX/Linuxのファイル権限

2. **強制アクセス制御（MAC）**
   - システムが権限を強制
   - セキュリティラベル、機密レベル

3. **役割ベースアクセス制御（RBAC）**
   - 役割に応じた権限付与
   - 職務分離の原則

4. **属性ベースアクセス制御（ABAC）**
   - 属性の組み合わせで制御
   - 柔軟な権限管理

**シングルサインオン（SSO）:**
- SAML、OAuth 2.0、OpenID Connect
- Kerberos認証
- Active Directory、LDAP`,
        quizzes: [
          {
            question: '生体認証のFAR（他人受入率）を下げると、どのような影響があるか？',
            options: ['FRR（本人拒否率）が上がる', 'FRRが下がる', '認証速度が上がる', 'セキュリティが低下する'],
            correct: 0,
            explanation: 'FARを下げる（他人を誤って受け入れにくくする）と、判定が厳しくなるためFRR（本人を誤って拒否する率）が上がります。'
          },
          {
            question: '2要素認証として適切な組み合わせはどれか？',
            options: ['パスワードとPIN', 'パスワードと指紋', '指紋と虹彩', 'ICカードとUSBトークン'],
            correct: 1,
            explanation: 'パスワード（知識情報）と指紋（生体情報）は異なる要素の組み合わせです。同じ要素の組み合わせは2要素認証になりません。'
          },
          {
            question: 'RBAC（役割ベースアクセス制御）の利点として正しいものはどれか？',
            options: ['処理速度が速い', '権限管理が簡素化される', 'ハードウェアコストが低い', 'パスワードが不要になる'],
            correct: 1,
            explanation: 'RBACでは役割（ロール）に権限を割り当て、ユーザーに役割を付与するため、大規模組織での権限管理が簡素化されます。'
          },
          {
            question: 'Kerberos認証の特徴として正しいものはどれか？',
            options: ['公開鍵暗号を使用する', 'チケットベースの認証を行う', 'パスワードをサーバに送信する', '生体認証が必須である'],
            correct: 1,
            explanation: 'Kerberosはチケットベースの認証システムで、認証サーバから発行されたチケットを使ってサービスにアクセスします。'
          },
          {
            question: 'OAuth 2.0の主な用途はどれか？',
            options: ['パスワード管理', 'API認可', 'ウイルス対策', 'データ暗号化'],
            correct: 1,
            explanation: 'OAuth 2.0は、サードパーティアプリケーションに対してAPIへの限定的なアクセス権限を安全に委譲する認可フレームワークです。'
          },
          {
            question: 'DAC（任意アクセス制御）の特徴として正しいものはどれか？',
            options: ['システムが権限を強制的に設定', 'ファイル所有者が権限を決定', '役割に基づいて権限付与', '属性の組み合わせで制御'],
            correct: 1,
            explanation: 'DACでは、ファイルやリソースの所有者が自由にアクセス権限を設定できます。'
          },
          {
            question: 'MAC（強制アクセス制御）が主に使用される環境はどれか？',
            options: ['一般企業', '高セキュリティ環境', '個人利用', '教育機関'],
            correct: 1,
            explanation: 'MACは軍事機関や政府機関など、高度なセキュリティが要求される環境で主に使用されます。'
          },
          {
            question: 'ABAC（属性ベースアクセス制御）の利点はどれか？',
            options: ['実装が簡単', '柔軟なアクセス制御', '処理速度が速い', '管理コストが低い'],
            correct: 1,
            explanation: 'ABACは様々な属性（時間、場所、部署など）を組み合わせて柔軟なアクセス制御ルールを定義できます。'
          },
          {
            question: 'TOTP（Time-based One-Time Password）の特徴はどれか？',
            options: ['時間に依存しない', '時間に基づいて変化する', '一度だけ使用可能', '無期限で有効'],
            correct: 1,
            explanation: 'TOTPは現在時刻を基に計算され、一定時間（通常30秒）ごとに新しいパスワードが生成されます。'
          },
          {
            question: 'FIDO（Fast IDentity Online）認証の特徴はどれか？',
            options: ['パスワードベース認証', '公開鍵暗号ベース認証', '共通鍵暗号ベース認証', 'ハッシュベース認証'],
            correct: 1,
            explanation: 'FIDO認証は公開鍵暗号方式を使用し、パスワードレス認証を実現する標準規格です。'
          },
          {
            question: 'リスクベース認証で考慮される要素として適切でないものはどれか？',
            options: ['ログイン場所', 'ログイン時間', 'デバイス情報', 'ユーザーの年齢'],
            correct: 3,
            explanation: 'リスクベース認証は行動パターンや技術的情報を基にリスクを判定しますが、年齢などの個人属性は直接的な要素ではありません。'
          },
          {
            question: 'SAML（Security Assertion Markup Language）の主な用途はどれか？',
            options: ['データ暗号化', 'シングルサインオン', 'ネットワーク監視', 'ファイル圧縮'],
            correct: 1,
            explanation: 'SAMLは異なるドメイン間での認証情報の安全な交換を可能にし、シングルサインオンを実現するプロトコルです。'
          },
          {
            question: 'OpenID Connectの説明として正しいものはどれか？',
            options: ['OAuth 2.0の拡張', 'SAML の後継', '独立した認証プロトコル', 'Kerberos の改良版'],
            correct: 0,
            explanation: 'OpenID ConnectはOAuth 2.0を拡張して認証機能を追加したプロトコルです。'
          },
          {
            question: 'Active Directoryにおけるドメインコントローラの役割はどれか？',
            options: ['ファイル共有', '認証とディレクトリサービス', 'メール配信', 'Webサーバ機能'],
            correct: 1,
            explanation: 'ドメインコントローラはActive Directoryの中核で、ユーザー認証とディレクトリサービスを提供します。'
          },
          {
            question: 'LDAP（Lightweight Directory Access Protocol）の用途はどれか？',
            options: ['ファイル転送', 'ディレクトリサービスへのアクセス', 'メール送信', 'Web閲覧'],
            correct: 1,
            explanation: 'LDAPはディレクトリサービスに格納された情報にアクセスするためのプロトコルです。'
          },
          {
            question: '職務分離（Separation of Duties）の原則の目的はどれか？',
            options: ['業務効率の向上', '不正行為の防止', '処理速度の向上', 'コスト削減'],
            correct: 1,
            explanation: '職務分離は重要な業務を複数の人に分担させることで、単独での不正行為を防止する原則です。'
          },
          {
            question: '最小権限の原則（Principle of Least Privilege）の説明として正しいものはどれか？',
            options: ['全ての権限を付与する', '業務に必要な最小限の権限のみ付与', '管理者権限を全員に付与', '権限の制限を行わない'],
            correct: 1,
            explanation: '最小権限の原則は、ユーザーには業務遂行に必要な最小限の権限のみを付与するセキュリティ原則です。'
          },
          {
            question: 'RADIUS（Remote Authentication Dial-In User Service）の主な用途はどれか？',
            options: ['ファイル共有', 'リモートアクセス認証', 'メール配信', 'DNS解決'],
            correct: 1,
            explanation: 'RADIUSはダイアルアップやVPN、無線LANなどのリモートアクセスにおける認証・認可・課金を行うプロトコルです。'
          },
          {
            question: 'CAC（Common Access Card）の説明として正しいものはどれか？',
            options: ['クレジットカード', '米国政府職員用ICカード', '交通系ICカード', '商業施設ポイントカード'],
            correct: 1,
            explanation: 'CACは米国政府職員や軍人が使用する多機能ICカードで、認証とデジタル署名機能を持ちます。'
          },
          {
            question: 'スマートカードの特徴として正しいものはどれか？',
            options: ['磁気ストライプのみ', 'マイクロプロセッサ内蔵', '読み取り専用', '一回限りの使用'],
            correct: 1,
            explanation: 'スマートカードはマイクロプロセッサとメモリを内蔵し、暗号化処理や認証機能を提供できます。'
          }
        ]
      },
      {
        title: 'セキュリティ対策と管理',
        content: `組織的・技術的なセキュリティ対策：

**技術的対策:**

1. **境界防御**
   - ファイアウォール: パケットフィルタリング、ステートフルインスペクション
   - IDS/IPS: 侵入検知/防止システム
   - WAF: Webアプリケーションファイアウォール
   - UTM: 統合脅威管理

2. **エンドポイント保護**
   - アンチウイルス/アンチマルウェア
   - EDR（Endpoint Detection and Response）
   - パーソナルファイアウォール
   - デバイス制御（USB等）

3. **ネットワークセキュリティ**
   - ネットワークセグメンテーション
   - VLAN、DMZ
   - VPN（リモートアクセス）
   - 無線LANセキュリティ（WPA3）

**組織的対策:**

1. **セキュリティマネジメント**
   - ISMS（ISO/IEC 27001）
   - セキュリティポリシー
   - リスクアセスメント
   - PDCA サイクル

2. **インシデント対応**
   - CSIRT/SOC
   - インシデントレスポンス計画
   - フォレンジック
   - BCP（事業継続計画）

3. **人的対策**
   - セキュリティ教育・訓練
   - 情報資産の分類
   - クリアデスク・クリアスクリーン
   - 退職者の権限削除

**コンプライアンス:**
- 個人情報保護法
- GDPR（EU一般データ保護規則）
- PCI DSS（カード業界標準）
- サイバーセキュリティ基本法`,
        quizzes: [
          {
            question: 'DMZ（非武装地帯）に配置するサーバとして適切なものはどれか？',
            options: ['データベースサーバ', 'Webサーバ', 'ファイルサーバ', 'バックアップサーバ'],
            correct: 1,
            explanation: 'DMZには外部からアクセスされるWebサーバやメールサーバを配置し、内部ネットワークを保護します。DBサーバなどは内部に配置します。'
          },
          {
            question: 'IDS（侵入検知システム）とIPS（侵入防止システム）の違いは何か？',
            options: ['IDSは検知のみ、IPSは検知と遮断', 'IDSは遮断、IPSは検知のみ', '違いはない', 'IDSは有線、IPSは無線用'],
            correct: 0,
            explanation: 'IDSは不正アクセスを検知して警告しますが、IPSは検知に加えて自動的に通信を遮断する機能を持ちます。'
          },
          {
            question: 'ISMS（情報セキュリティマネジメントシステム）のPDCAサイクルで最初に行うのはどれか？',
            options: ['Do（実施）', 'Check（点検）', 'Act（改善）', 'Plan（計画）'],
            correct: 3,
            explanation: 'PDCAサイクルはPlan（計画）→Do（実施）→Check（点検）→Act（改善）の順で継続的改善を行います。'
          },
          {
            question: 'EDRの主な機能として正しいものはどれか？',
            options: ['メール送信', 'エンドポイントの脅威検知と対応', 'Webサイトの作成', 'ネットワーク速度の向上'],
            correct: 1,
            explanation: 'EDR（Endpoint Detection and Response）は、エンドポイント上の脅威を検知し、調査・対応を行うセキュリティソリューションです。'
          },
          {
            question: 'BCP（事業継続計画）の目的として最も適切なものはどれか？',
            options: ['利益の最大化', '災害時でも重要業務を継続する', '新規事業の立ち上げ', 'コスト削減'],
            correct: 1,
            explanation: 'BCPは災害や障害が発生しても、重要な業務を中断させない、または早期に復旧させるための計画です。'
          },
          {
            question: 'UTM（統合脅威管理）の特徴として正しいものはどれか？',
            options: ['単一機能の特化型', '複数のセキュリティ機能を統合', 'ハードウェアのみ', 'クラウド専用'],
            correct: 1,
            explanation: 'UTMはファイアウォール、IPS、アンチウイルス、Webフィルタリングなど複数のセキュリティ機能を一つの装置に統合したものです。'
          },
          {
            question: 'WAF（Webアプリケーションファイアウォール）の主な防御対象はどれか？',
            options: ['ネットワーク層攻撃', 'Webアプリケーション層攻撃', '物理的攻撃', 'ソーシャルエンジニアリング'],
            correct: 1,
            explanation: 'WAFはSQLインジェクション、XSSなどWebアプリケーション層への攻撃を防御することに特化しています。'
          },
          {
            question: 'SIEM（Security Information and Event Management）の機能として正しいものはどれか？',
            options: ['データ暗号化', 'ログの収集・分析・監視', 'ファイル共有', 'メール送信'],
            correct: 1,
            explanation: 'SIEMは様々なシステムからログを収集し、相関分析を行ってセキュリティインシデントを検知・監視するシステムです。'
          },
          {
            question: 'SOC（Security Operations Center）の主な役割はどれか？',
            options: ['システム開発', '24時間365日のセキュリティ監視', 'データバックアップ', 'ネットワーク構築'],
            correct: 1,
            explanation: 'SOCは24時間365日体制でセキュリティ監視、インシデント対応、脅威分析を行う組織または施設です。'
          },
          {
            question: 'CSIRT（Computer Security Incident Response Team）の主な活動はどれか？',
            options: ['セキュリティインシデントの対応', 'システム開発', 'ネットワーク設計', 'データ分析'],
            correct: 0,
            explanation: 'CSIRTはセキュリティインシデントの対応、調査、復旧、再発防止を専門とする組織です。'
          },
          {
            question: 'パーソナルファイアウォールの説明として正しいものはどれか？',
            options: ['ネットワーク全体を保護', '個々のコンピュータを保護', 'データベースを保護', 'メールサーバを保護'],
            correct: 1,
            explanation: 'パーソナルファイアウォールは個々のPC上で動作し、そのコンピュータへの不正アクセスを防ぐソフトウェアです。'
          },
          {
            question: 'ネットワークセグメンテーションの目的として適切でないものはどれか？',
            options: ['攻撃の拡散防止', 'トラフィックの最適化', 'コンプライアンス要件の満たし', 'ネットワーク速度の低下'],
            correct: 3,
            explanation: 'ネットワークセグメンテーションは攻撃拡散防止、性能向上、コンプライアンス対応が目的で、速度低下は副作用です。'
          },
          {
            question: 'VPN（Virtual Private Network）の種類として正しくないものはどれか？',
            options: ['IPsec VPN', 'SSL-VPN', 'L2TP VPN', 'HTTP VPN'],
            correct: 3,
            explanation: 'VPNの主要な種類にはIPsec VPN、SSL-VPN、L2TP VPN、PPTP VPNなどがありますが、HTTP VPNは存在しません。'
          },
          {
            question: 'WPA3（Wi-Fi Protected Access 3）の改善点として正しいものはどれか？',
            options: ['処理速度の向上', '暗号化強度の向上', 'コストの削減', '設定の簡素化'],
            correct: 1,
            explanation: 'WPA3はWPA2に比べて192ビット暗号化の採用、SAE（Simultaneous Authentication of Equals）の実装により暗号化強度が向上しています。'
          },
          {
            question: 'DLP（Data Loss Prevention）の主な機能はどれか？',
            options: ['データ圧縮', '機密データの漏洩防止', 'データ復旧', 'データ分析'],
            correct: 1,
            explanation: 'DLPは機密データの識別、監視、制御を行い、意図しないデータ漏洩を防止するセキュリティソリューションです。'
          },
          {
            question: 'フォレンジック調査の目的として適切でないものはどれか？',
            options: ['証拠の保全', '攻撃手法の解明', 'システムの性能向上', '法的証拠の収集'],
            correct: 2,
            explanation: 'フォレンジック調査は証拠保全、攻撃解明、法的証拠収集が目的で、システム性能向上は対象外です。'
          },
          {
            question: 'クリアデスクポリシーの説明として正しいものはどれか？',
            options: ['机上に書類を放置しない', 'デスクトップを整理する', 'パソコンを清掃する', 'デスクの色を統一する'],
            correct: 0,
            explanation: 'クリアデスクポリシーは、機密情報が記載された書類を机上に放置せず、適切に保管することを求める方針です。'
          },
          {
            question: 'クリアスクリーンポリシーの説明として正しいものはどれか？',
            options: ['画面を清掃する', '離席時にスクリーンロックする', '明るい画面を使用する', '大きな画面を使用する'],
            correct: 1,
            explanation: 'クリアスクリーンポリシーは離席時にスクリーンロックを行い、第三者による画面の覗き見を防ぐ方針です。'
          },
          {
            question: 'GDPR（EU一般データ保護規則）の適用対象として正しいものはどれか？',
            options: ['EU域内の企業のみ', 'EU市民の個人データを扱う全ての組織', '大企業のみ', '政府機関のみ'],
            correct: 1,
            explanation: 'GDPRはEU市民の個人データを処理する世界中の全ての組織に適用され、地理的制限はありません。'
          },
          {
            question: 'サイバーセキュリティ基本法の目的として正しいものはどれか？',
            options: ['企業の利益向上', '国家・社会のサイバーセキュリティ確保', 'IT産業の発展', '個人情報の商用利用'],
            correct: 1,
            explanation: 'サイバーセキュリティ基本法は国家および社会の重要機能の維持、国民生活の安全・安心確保を目的としています。'
          }
        ]
      },
      {
        title: '新興技術とセキュリティ',
        content: `新しい技術環境におけるセキュリティ課題と対策：

**クラウドセキュリティ:**

1. **責任共有モデル**
   - CSPとユーザーの責任分界
   - IaaS、PaaS、SaaSでの責任範囲
   - セキュリティ設定の適切な管理

2. **クラウド固有の脅威**
   - 設定ミスによる情報漏洩
   - 権限の過剰付与
   - マルチテナンシーのリスク
   - API経由の攻撃

3. **クラウドセキュリティ対策**
   - CASB（Cloud Access Security Broker）
   - CSPM（Cloud Security Posture Management）
   - CWPP（Cloud Workload Protection Platform）
   - Identity and Access Management

**IoT セキュリティ:**

1. **IoT デバイスの脆弱性**
   - デフォルトパスワード
   - ファームウェア更新の困難
   - 暗号化の欠如
   - 物理的アクセス

2. **IoT セキュリティ対策**
   - デバイス認証
   - 通信暗号化
   - セキュアブート
   - ライフサイクル管理

**AI・ML セキュリティ:**

1. **AI/ML への攻撃**
   - 敵対的攻撃（Adversarial Attack）
   - データポイズニング
   - モデル反転攻撃
   - 推論攻撃

2. **AI セキュリティ対策**
   - 対抗訓練
   - 差分プライバシー
   - フェデレーテッドラーニング
   - モデルの検証・監査

**モバイルセキュリティ:**

1. **モバイル固有の脅威**
   - 悪意のあるアプリ
   - 不正なWi-Fi接続
   - デバイスの紛失・盗難
   - SMSフィッシング

2. **モバイルセキュリティ対策**
   - MDM（Mobile Device Management）
   - MAM（Mobile Application Management）
   - MTD（Mobile Threat Defense）
   - コンテナ化

**ゼロトラストセキュリティ:**
- "決して信頼せず、常に検証する"
- 境界防御からの脱却
- ID中心のセキュリティ
- 継続的な検証と監視`,
        quizzes: [
          {
            question: 'クラウドサービスの責任共有モデルで、IaaSにおいてCSP（クラウドサービスプロバイダ）の責任範囲はどれか？',
            options: ['アプリケーションのセキュリティ', 'オペレーティングシステムのセキュリティ', '物理インフラのセキュリティ', 'データの暗号化'],
            correct: 2,
            explanation: 'IaaSでは、CSPは物理インフラ（サーバ、ネットワーク、データセンタ）のセキュリティに責任を持ち、OS以上はユーザーの責任です。'
          },
          {
            question: 'CASB（Cloud Access Security Broker）の主な機能として正しくないものはどれか？',
            options: ['可視化', 'コンプライアンス', 'データセキュリティ', 'アプリケーション開発'],
            correct: 3,
            explanation: 'CASBは可視化、コンプライアンス、データセキュリティ、脅威防御の4つの柱を持ちますが、アプリケーション開発は含まれません。'
          },
          {
            question: 'IoTデバイスのセキュリティ課題として最も深刻なものはどれか？',
            options: ['高い処理能力', 'デフォルトパスワードの使用', '大容量メモリ', '高速通信'],
            correct: 1,
            explanation: 'IoTデバイスの多くがデフォルトパスワードを変更せずに使用され、これが大規模なボットネット構築の原因となっています。'
          },
          {
            question: '敵対的攻撃（Adversarial Attack）の説明として正しいものはどれか？',
            options: ['AIモデルを騙すために入力データを微妙に改変', 'システムの物理的破壊', 'ネットワークへの大量攻撃', 'データベースの不正アクセス'],
            correct: 0,
            explanation: '敵対的攻撃は、人間には識別困難な微細な変更を入力データに加えて、AIモデルの判定を誤らせる攻撃手法です。'
          },
          {
            question: 'MDM（Mobile Device Management）の主な機能として適切でないものはどれか？',
            options: ['リモートワイプ', 'アプリケーション配布', 'バッテリー充電', 'ポリシー適用'],
            correct: 2,
            explanation: 'MDMはデバイスの管理、セキュリティ、ポリシー適用を行いますが、バッテリー充電は物理的機能で管理対象外です。'
          },
          {
            question: 'ゼロトラストセキュリティの基本原則として正しいものはどれか？',
            options: ['すべてを信頼する', '境界防御を強化する', '決して信頼せず、常に検証する', '内部ネットワークは安全とする'],
            correct: 2,
            explanation: 'ゼロトラストは「Never Trust, Always Verify」が基本原則で、あらゆるアクセスを検証し続けます。'
          },
        ]
      }
    ]
  }
];

export default function SecurityLearningPage() {
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [quizHistory, setQuizHistory] = useState<boolean[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completedQuizzes, setCompletedQuizzes] = useState<Set<string>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<{[key: string]: number}>({});
  const [showQuizResults, setShowQuizResults] = useState<{[key: string]: boolean}>({});
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());

  const currentModule = learningModules[currentModuleIndex];
  const currentSection = currentModule.sections[currentSectionIndex];
  const currentQuiz = currentSection.quizzes[currentQuizIndex];

  const { progress, saveProgress } = useLearningProgress('security');

  useEffect(() => {
    if (progress.length > 0) {
      console.log('🔄 Restoring security progress state...');
      const completedSet = new Set<string>();
      const answersMap: {[key: string]: number} = {};
      const resultsMap: {[key: string]: boolean} = {};

      progress.forEach((p) => {
        const sectionKey = p.section_key;
        if (p.is_completed) {
          completedSet.add(sectionKey);
          resultsMap[sectionKey] = true;

          const parts = sectionKey.split('-');
          if (parts.length >= 3) {
            const moduleIndex = parseInt(parts[0]);
            const sectionIndex = parseInt(parts[1]);
            const quizIndex = parseInt(parts[2]);

            if (!isNaN(moduleIndex) && !isNaN(sectionIndex) && !isNaN(quizIndex)) {
              const learningModule = learningModules[moduleIndex];
              if (learningModule && learningModule.sections[sectionIndex] && learningModule.sections[sectionIndex].quizzes[quizIndex]) {
                const correctAnswer = learningModule.sections[sectionIndex].quizzes[quizIndex].correct;
                answersMap[sectionKey] = correctAnswer;
              }
            }
          }
        }
      });

      setCompletedQuizzes(completedSet);
      setQuizAnswers(answersMap);
      setShowQuizResults(resultsMap);
      console.log('✅ Security progress restored:', { completed: completedSet.size, answers: Object.keys(answersMap).length });
    }
  }, [progress]);

  const handleAnswerSelect = async (answerIndex: number) => {
    if (showResult) return;

    const quizKey = `${currentModuleIndex}-${currentSectionIndex}-${currentQuizIndex}`;

    setSelectedAnswer(answerIndex);
    setQuizAnswers({...quizAnswers, [quizKey]: answerIndex});
    setShowResult(true);
    setShowExplanation(true);
    setShowQuizResults({...showQuizResults, [quizKey]: true});

    const isCorrect = answerIndex === currentQuiz.correct;
    setQuizHistory([...quizHistory, isCorrect]);

    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
      setCompletedQuizzes(new Set([...completedQuizzes, quizKey]));
    }
    setTotalQuestions(totalQuestions + 1);

    // Save progress to database
    try {
      await saveProgress(quizKey, isCorrect, isCorrect);
      console.log('✅ Security progress saved:', { section: quizKey, correct: isCorrect });
    } catch (error) {
      console.error('❌ Failed to save security progress:', error);
    }
  };

  const handleNextQuiz = () => {
    if (currentQuizIndex < currentSection.quizzes.length - 1) {
      const nextQuizIndex = currentQuizIndex + 1;
      const nextQuizKey = `${currentModuleIndex}-${currentSectionIndex}-${nextQuizIndex}`;
      setCurrentQuizIndex(nextQuizIndex);
      setSelectedAnswer(quizAnswers[nextQuizKey] ?? null);
      setShowResult(showQuizResults[nextQuizKey] ?? false);
      setShowExplanation(showQuizResults[nextQuizKey] ?? false);
    } else {
      const sectionKey = `${currentModuleIndex}-${currentSectionIndex}`;
      setCompletedSections(new Set([...completedSections, sectionKey]));

      if (currentSectionIndex < currentModule.sections.length - 1) {
        const nextSectionIndex = currentSectionIndex + 1;
        const nextQuizKey = `${currentModuleIndex}-${nextSectionIndex}-0`;
        setCurrentSectionIndex(nextSectionIndex);
        setCurrentQuizIndex(0);
        setSelectedAnswer(quizAnswers[nextQuizKey] ?? null);
        setShowResult(showQuizResults[nextQuizKey] ?? false);
        setShowExplanation(showQuizResults[nextQuizKey] ?? false);
        setQuizHistory([]);
      } else if (currentModuleIndex < learningModules.length - 1) {
        const nextModuleIndex = currentModuleIndex + 1;
        const nextQuizKey = `${nextModuleIndex}-0-0`;
        setCurrentModuleIndex(nextModuleIndex);
        setCurrentSectionIndex(0);
        setCurrentQuizIndex(0);
        setSelectedAnswer(quizAnswers[nextQuizKey] ?? null);
        setShowResult(showQuizResults[nextQuizKey] ?? false);
        setShowExplanation(showQuizResults[nextQuizKey] ?? false);
        setQuizHistory([]);
      }
    }
  };

  const handlePreviousQuiz = () => {
    if (currentQuizIndex > 0) {
      const prevQuizIndex = currentQuizIndex - 1;
      const prevQuizKey = `${currentModuleIndex}-${currentSectionIndex}-${prevQuizIndex}`;
      setCurrentQuizIndex(prevQuizIndex);
      setSelectedAnswer(quizAnswers[prevQuizKey] ?? null);
      setShowResult(showQuizResults[prevQuizKey] ?? false);
      setShowExplanation(showQuizResults[prevQuizKey] ?? false);
      const newHistory = [...quizHistory];
      newHistory.pop();
      setQuizHistory(newHistory);
    }
  };

  const handleSectionSelect = (moduleIndex: number, sectionIndex: number) => {
    const quizKey = `${moduleIndex}-${sectionIndex}-0`;
    setCurrentModuleIndex(moduleIndex);
    setCurrentSectionIndex(sectionIndex);
    setCurrentQuizIndex(0);
    setSelectedAnswer(quizAnswers[quizKey] ?? null);
    setShowResult(showQuizResults[quizKey] ?? false);
    setShowExplanation(showQuizResults[quizKey] ?? false);
    setQuizHistory([]);
  };

  const totalQuizzes = learningModules.reduce((acc, module) =>
    acc + module.sections.reduce((sectionAcc, section) =>
      sectionAcc + section.quizzes.length, 0), 0);

  const quizProgress = (completedQuizzes.size / totalQuizzes) * 100;
  const progressPercentage = Math.round(quizProgress);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/modules/it-fundamentals" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            基本情報技術者試験対策に戻る
          </Link>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Shield className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">セキュリティ</h1>
                  <p className="text-gray-600 mt-1">情報保護と脅威対策の基礎知識</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">{progressPercentage}%</div>
                <p className="text-sm text-gray-600">完了</p>
              </div>
            </div>

            <div className="relative pt-1">
              <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-200">
                <div
                  style={{ width: `${progressPercentage}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                学習内容
              </h2>

              <div className="space-y-3">
                {learningModules.map((module, moduleIndex) => (
                  <div key={module.id}>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">{module.title}</h3>
                    <div className="space-y-1">
                      {module.sections.map((section, sectionIndex) => {
                        const sectionKey = `${moduleIndex}-${sectionIndex}`;
                        const isCompleted = completedSections.has(sectionKey);
                        const isCurrent = moduleIndex === currentModuleIndex && sectionIndex === currentSectionIndex;

                        return (
                          <button
                            key={sectionIndex}
                            onClick={() => handleSectionSelect(moduleIndex, sectionIndex)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between transition-colors ${
                              isCurrent
                                ? 'bg-blue-50 text-blue-700 font-medium'
                                : isCompleted
                                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                : 'hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            <span className="flex items-center">
                              {isCompleted ? (
                                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                              ) : (
                                <Circle className="w-4 h-4 mr-2 text-gray-400" />
                              )}
                              {section.title}
                            </span>
                            {isCurrent && <ChevronRight className="w-4 h-4" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* 統計情報 */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">学習統計</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">総問題数</span>
                    <span className="font-medium">{totalQuizzes}問</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">完了済み</span>
                    <span className="font-medium text-green-600">{completedQuizzes.size}問</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">正答率</span>
                    <span className="font-medium">{completedQuizzes.size > 0 ? Math.round(quizProgress) : 0}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md">
              <div className="border-b px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{currentSection.title}</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {currentModule.title} - 問題 {currentQuizIndex + 1} / {currentSection.quizzes.length}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="font-semibold">{correctAnswers} / {totalQuestions}</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <div className="prose max-w-none mb-8">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <h3 className="text-lg font-semibold text-blue-900 mb-3">学習内容</h3>
                      <div className="text-gray-700 whitespace-pre-line">{currentSection.content}</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-start">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-semibold mr-3 flex-shrink-0">
                        {currentQuizIndex + 1}
                      </span>
                      <p className="text-gray-900 font-medium text-lg">{currentQuiz.question}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {currentQuiz.options.map((option, index) => {
                      const isSelected = selectedAnswer === index;
                      const isCorrect = index === currentQuiz.correct;

                      let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-all ";

                      if (showResult) {
                        if (isCorrect) {
                          buttonClass += "border-green-500 bg-green-50 ";
                        } else if (isSelected && !isCorrect) {
                          buttonClass += "border-red-500 bg-red-50 ";
                        } else {
                          buttonClass += "border-gray-200 bg-white ";
                        }
                      } else {
                        buttonClass += isSelected
                          ? "border-blue-500 bg-blue-50 "
                          : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 cursor-pointer ";
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          disabled={showResult}
                          className={buttonClass}
                        >
                          <div className="flex items-start">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border-2 mr-3 mt-0.5 flex-shrink-0">
                              {showResult && isCorrect ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : showResult && isSelected && !isCorrect ? (
                                <AlertCircle className="w-5 h-5 text-red-600" />
                              ) : (
                                <span className="text-sm">{String.fromCharCode(65 + index)}</span>
                              )}
                            </span>
                            <span className={`${showResult && isCorrect ? 'font-semibold' : ''}`}>
                              {option}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {showExplanation && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">解説</h4>
                      <p className="text-gray-700">{currentQuiz.explanation}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <button
                    onClick={handlePreviousQuiz}
                    disabled={currentQuizIndex === 0}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    前の問題へ
                  </button>

                  <div className="flex space-x-1">
                    {currentSection.quizzes.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentQuizIndex
                            ? 'bg-blue-600'
                            : index < currentQuizIndex
                            ? quizHistory[index] ? 'bg-green-500' : 'bg-red-500'
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  {showResult && (
                    <button
                      onClick={handleNextQuiz}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {currentQuizIndex < currentSection.quizzes.length - 1
                        ? '次の問題へ'
                        : currentSectionIndex < currentModule.sections.length - 1
                        ? '次のセクションへ'
                        : currentModuleIndex < learningModules.length - 1
                        ? '次のモジュールへ'
                        : '完了'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 次のセクション */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">次のセクション</h3>
          <p className="text-gray-600 mb-6">
            セキュリティの学習を終えたら、次の関連分野の学習に進みましょう。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/modules/it-fundamentals/system-development"
              className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <div className="flex items-center">
                <span className="text-lg mr-3">⚙️</span>
                <span className="text-gray-700 font-medium">システム開発</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </Link>
            <Link
              href="/modules/it-fundamentals/network"
              className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <div className="flex items-center">
                <span className="text-lg mr-3">🌐</span>
                <span className="text-gray-700 font-medium">ネットワーク</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </Link>
            <Link
              href="/modules/it-fundamentals"
              className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <div className="flex items-center">
                <span className="text-lg mr-3">📚</span>
                <span className="text-gray-700 font-medium">IT基礎一覧に戻る</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}