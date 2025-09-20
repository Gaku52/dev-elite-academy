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
          }
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
          }
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

  const progressPercentage = Math.round((completedSections.size /
    learningModules.reduce((acc, module) => acc + module.sections.length, 0)) * 100);

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
      </div>
    </div>
  );
}