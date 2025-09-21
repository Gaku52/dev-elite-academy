'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, CheckCircle, AlertCircle, Trophy } from 'lucide-react';
import { useLearningProgress } from '@/hooks/useLearningProgress';

interface Quiz {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const quizData: Quiz[] = [
  {
    question: '職能ごとに部門を編成する組織形態は？',
    options: ['事業部制組織', '機能別組織', 'マトリックス組織', 'カンパニー制'],
    correct: 1,
    explanation: '機能別組織は、営業、製造、人事などの職能ごとに部門を編成する組織形態で、専門性を高めやすいという特徴があります。'
  },
  {
    question: 'SWOT分析の「O」は何を表すか？',
    options: ['Organization（組織）', 'Operation（運営）', 'Opportunities（機会）', 'Objectives（目標）'],
    correct: 2,
    explanation: 'SWOT分析の「O」はOpportunities（機会）を表し、外部環境の好機を分析します。'
  },
  {
    question: '貸借対照表の基本等式として正しいものは？',
    options: ['資産 = 負債 - 純資産', '資産 = 負債 + 純資産', '負債 = 資産 + 純資産', '純資産 = 資産 + 負債'],
    correct: 1,
    explanation: '貸借対照表の基本等式は「資産 = 負債 + 純資産」で、企業の財政状態を表します。'
  },
  {
    question: '特許権の保護期間は出願から何年か？',
    options: ['10年', '15年', '20年', '25年'],
    correct: 2,
    explanation: '特許権は出願から20年間、発明を独占的に実施する権利を保護します。'
  },
  {
    question: 'PDCAサイクルのCは何を表すか？',
    options: ['Create（創造）', 'Check（評価）', 'Control（管理）', 'Collaborate（協働）'],
    correct: 1,
    explanation: 'PDCAサイクルのCはCheck（評価）で、実施した結果を測定・評価し、目標との差異を確認します。'
  },
  {
    question: 'プロジェクト型業務に適した組織形態はどれか？',
    options: ['機能別組織', '事業部制組織', 'マトリックス組織', 'ホールディングカンパニー制'],
    correct: 2,
    explanation: 'マトリックス組織は、機能別と事業別の2つの指揮系統を持ち、プロジェクト型業務に適した柔軟な組織形態です。'
  },
  {
    question: 'PPMで高成長・高シェアの事業を何と呼ぶか？',
    options: ['金のなる木', '花形', '問題児', '負け犬'],
    correct: 1,
    explanation: '花形（Star）は、市場成長率が高く市場シェアも高い事業で、将来の主力事業として期待されます。'
  },
  {
    question: 'ROEを計算する式は？',
    options: ['当期純利益 ÷ 総資産', '当期純利益 ÷ 自己資本', '売上高 ÷ 総資産', '営業利益 ÷ 売上高'],
    correct: 1,
    explanation: 'ROE（Return on Equity：自己資本利益率）は、当期純利益を自己資本で割った指標で、株主資本の収益性を測ります。'
  },
  {
    question: 'プログラムが保護される知的財産権は？',
    options: ['特許権', '実用新案権', '意匠権', '著作権'],
    correct: 3,
    explanation: 'コンピュータプログラムは著作権法で保護される著作物として扱われます。'
  },
  {
    question: 'ISO 9001が対象とするマネジメントシステムは？',
    options: ['環境マネジメント', '品質マネジメント', '情報セキュリティマネジメント', 'ITサービスマネジメント'],
    correct: 1,
    explanation: 'ISO 9001は品質マネジメントシステムの国際規格で、組織の品質管理体制を規定しています。'
  },
  // Business Management Fundamentals (11-25)
  {
    question: '事業部制組織の特徴として最も適切なものは？',
    options: ['職能の専門性が高い', '製品や地域ごとに独立性がある', '指揮系統が一つ', '中央集権的な管理'],
    correct: 1,
    explanation: '事業部制組織は、製品、地域、顧客などの基準で事業部を設け、各事業部に独立性と責任を持たせる組織形態です。'
  },
  {
    question: 'ティール組織の特徴として正しいものは？',
    options: ['階層構造の強化', '自主管理（セルフマネジメント）', '中央集権的意思決定', '固定的な役職'],
    correct: 1,
    explanation: 'ティール組織は、階層構造を最小化し、自主管理、全体性、進化する目的を特徴とする新しい組織モデルです。'
  },
  {
    question: '株式会社の最高意思決定機関は？',
    options: ['取締役会', '株主総会', '監査役会', '経営会議'],
    correct: 1,
    explanation: '株主総会は株式会社の最高意思決定機関で、重要事項の決定権を持ちます。'
  },
  {
    question: 'コーポレートガバナンスの目的として最も適切なものは？',
    options: ['利益の最大化', '従業員満足度の向上', '透明・公正・迅速な意思決定', '市場シェアの拡大'],
    correct: 2,
    explanation: 'コーポレートガバナンスは、企業の透明・公正・迅速な意思決定を実現し、ステークホルダーの利益を保護することを目的とします。'
  },
  {
    question: 'BPR（Business Process Reengineering）の主要な目的は？',
    options: ['業務の自動化', '業務プロセスの抜本的な見直し', 'IT投資の効率化', '組織の階層化'],
    correct: 1,
    explanation: 'BPRは既存の業務プロセスを抜本的に見直し、劇的な改善を実現する経営手法です。'
  },
  {
    question: 'CSR（Corporate Social Responsibility）とは何か？',
    options: ['顧客満足責任', '企業の社会的責任', '株主利益責任', '従業員安全責任'],
    correct: 1,
    explanation: 'CSRは企業の社会的責任を指し、企業が社会や環境に配慮した経営を行うことを意味します。'
  },
  {
    question: 'ステークホルダーに含まれないものは？',
    options: ['株主', '従業員', '顧客', '競合他社'],
    correct: 3,
    explanation: 'ステークホルダーは企業活動に利害関係を持つ人々や組織で、株主、従業員、顧客、取引先、地域社会などが含まれますが、競合他社は含まれません。'
  },
  {
    question: 'M&A（Merger and Acquisition）において、Mergerとは何を指すか？',
    options: ['買収', '合併', '提携', '分割'],
    correct: 1,
    explanation: 'Mergerは合併を指し、Acquisitionは買収を指します。M&Aは企業の合併・買収の総称です。'
  },
  {
    question: 'コンプライアンスの意味として最も適切なものは？',
    options: ['利益追求', '法令遵守', '競争優位', '技術革新'],
    correct: 1,
    explanation: 'コンプライアンスは法令遵守を意味し、企業が法律や規則、社会規範を守って事業を行うことです。'
  },
  {
    question: 'フラット組織の特徴として正しいものは？',
    options: ['階層が多い', '意思決定が遅い', '階層が少ない', '官僚的である'],
    correct: 2,
    explanation: 'フラット組織は階層が少ない組織構造で、意思決定の迅速化とコミュニケーションの円滑化を図ります。'
  },
  {
    question: 'ホールディングカンパニー制の特徴は？',
    options: ['直接事業を行う', '子会社の株式を保有して支配', '単一事業に特化', '職能別組織'],
    correct: 1,
    explanation: 'ホールディングカンパニー（持株会社）は、子会社の株式を保有することで事業を支配する企業形態です。'
  },
  {
    question: 'エンパワーメントの意味として正しいものは？',
    options: ['権限の集中', '従業員への権限委譲', '組織の階層化', 'トップダウン管理'],
    correct: 1,
    explanation: 'エンパワーメントは従業員に権限や責任を委譲し、自律的な行動を促す経営手法です。'
  },
  {
    question: 'アウトソーシングの主な目的は？',
    options: ['従業員数の増加', 'コア業務への集中', '組織の拡大', '内製化の推進'],
    correct: 1,
    explanation: 'アウトソーシングは非コア業務を外部に委託し、経営資源をコア業務に集中させることを目的とします。'
  },
  {
    question: 'SBU（Strategic Business Unit）とは何か？',
    options: ['戦略的事業単位', '特別業務部門', '標準業務ユニット', '支援業務部'],
    correct: 0,
    explanation: 'SBUは戦略的事業単位で、独立した戦略を持つ事業の単位として管理される組織です。'
  },
  {
    question: 'バランススコアカードの4つの視点に含まれないものは？',
    options: ['財務の視点', '顧客の視点', '競合の視点', '学習と成長の視点'],
    correct: 2,
    explanation: 'バランススコアカードは財務、顧客、内部プロセス、学習と成長の4つの視点から組織を評価する手法です。'
  },
  // Strategic Management (26-40)
  {
    question: 'SWOT分析の「T」は何を表すか？',
    options: ['Technology（技術）', 'Target（目標）', 'Threats（脅威）', 'Trends（傾向）'],
    correct: 2,
    explanation: 'SWOT分析の「T」はThreats（脅威）を表し、外部環境の脅威要因を分析します。'
  },
  {
    question: 'ポーターの5つの力分析に含まれないものは？',
    options: ['既存競合他社', '新規参入者', '代替品', '政府規制'],
    correct: 3,
    explanation: 'ポーターの5つの力は、既存競合他社、新規参入者、代替品、買い手、売り手の5つです。政府規制は含まれません。'
  },
  {
    question: 'ブルーオーシャン戦略の特徴は？',
    options: ['既存市場での競争', '競合との差別化', '未開拓市場の創造', '低価格戦略'],
    correct: 2,
    explanation: 'ブルーオーシャン戦略は競争のない未開拓市場を創造し、競争を回避する戦略です。'
  },
  {
    question: 'コアコンピタンスとは何か？',
    options: ['基本的な能力', '他社に真似できない中核的な能力', '技術的な能力', '組織の規模'],
    correct: 1,
    explanation: 'コアコンピタンスは、企業が持つ他社には真似できない中核的な能力や強みのことです。'
  },
  {
    question: 'ベンチマーキングの目的は？',
    options: ['競合の模倣', '業界最高水準との比較・学習', '市場調査', '顧客分析'],
    correct: 1,
    explanation: 'ベンチマーキングは、業界最高水準の企業やプロセスと比較し、改善のヒントを得る手法です。'
  },
  {
    question: 'PPMでキャッシュカウ（金のなる木）の特徴は？',
    options: ['高成長・高シェア', '高成長・低シェア', '低成長・高シェア', '低成長・低シェア'],
    correct: 2,
    explanation: 'キャッシュカウは市場成長率が低く市場シェアが高い事業で、安定した収益源となります。'
  },
  {
    question: 'アンゾフのマトリクスで「新市場×既存製品」の戦略は？',
    options: ['市場浸透', '新製品開発', '市場開拓', '多角化'],
    correct: 2,
    explanation: 'アンゾフのマトリクスで新市場×既存製品は市場開拓戦略に該当します。'
  },
  {
    question: 'バリューチェーン分析の主活動に含まれないものは？',
    options: ['調達活動', '製造', '販売・マーケティング', '人事管理'],
    correct: 3,
    explanation: 'バリューチェーンの主活動は調達、製造、出荷、販売・マーケティング、サービスです。人事管理は支援活動に分類されます。'
  },
  {
    question: 'ファイブフォース分析で「買い手の交渉力」が高い場合の特徴は？',
    options: ['顧客が少数で大口', '代替品が少ない', '転換コストが高い', '情報の非対称性がある'],
    correct: 0,
    explanation: '買い手の交渉力は、顧客が少数で大口の場合、代替品が多い場合、転換コストが低い場合に高くなります。'
  },
  {
    question: 'リーンスタートアップの中核概念は？',
    options: ['大量生産', '完璧な製品開発', '仮説検証サイクル', '長期計画'],
    correct: 2,
    explanation: 'リーンスタートアップは、仮説を立て、最小限の製品で検証し、学習するサイクルを重視します。'
  },
  {
    question: 'OKR（Objectives and Key Results）の特徴は？',
    options: ['年次評価のみ', '目標と主要な結果の設定', '個人評価重視', '秘密主義'],
    correct: 1,
    explanation: 'OKRは目標（Objectives）と主要な結果（Key Results）を設定し、透明性の高い目標管理手法です。'
  },
  {
    question: 'ディスラプションの意味は？',
    options: ['段階的改善', '既存市場の破壊的創造', '価格競争', '品質向上'],
    correct: 1,
    explanation: 'ディスラプションは既存の市場や産業構造を破壊し、新しい価値創造を行うことです。'
  },
  {
    question: 'プラットフォーム戦略の特徴は？',
    options: ['垂直統合', '水平展開', 'ネットワーク効果の活用', '単一市場特化'],
    correct: 2,
    explanation: 'プラットフォーム戦略は、参加者同士をつなぐ場を提供し、ネットワーク効果を活用して価値を創造します。'
  },
  {
    question: 'デザイン思考のプロセスで最初の段階は？',
    options: ['プロトタイプ', 'テスト', '共感（Empathize）', 'アイデア発想'],
    correct: 2,
    explanation: 'デザイン思考は共感→問題定義→アイデア発想→プロトタイプ→テストの順序で進みます。'
  },
  {
    question: 'エコシステム戦略とは何か？',
    options: ['環境保護戦略', '生態系的な事業環境の構築', '自然エネルギー活用', '廃棄物削減'],
    correct: 1,
    explanation: 'エコシステム戦略は、複数の企業や組織が相互依存し合う生態系的な事業環境を構築する戦略です。'
  },
  // Financial Management (41-55)
  {
    question: '損益計算書で売上高から売上原価を引いたものは？',
    options: ['営業利益', '経常利益', '売上総利益', '当期純利益'],
    correct: 2,
    explanation: '売上総利益（粗利益）は売上高から売上原価を差し引いて計算されます。'
  },
  {
    question: 'ROA（総資産利益率）の計算式は？',
    options: ['当期純利益 ÷ 総資産', '営業利益 ÷ 総資産', '売上高 ÷ 総資産', '経常利益 ÷ 総資産'],
    correct: 0,
    explanation: 'ROA（Return on Assets）は当期純利益を総資産で割って計算し、資産の効率性を測ります。'
  },
  {
    question: '流動比率の計算式は？',
    options: ['流動資産 ÷ 流動負債', '流動負債 ÷ 流動資産', '総資産 ÷ 流動負債', '流動資産 ÷ 総負債'],
    correct: 0,
    explanation: '流動比率は流動資産を流動負債で割って計算し、短期的な支払能力を示します。'
  },
  {
    question: '自己資本比率が高い企業の特徴は？',
    options: ['借入金が多い', '財務安全性が高い', '利益率が高い', '成長性が高い'],
    correct: 1,
    explanation: '自己資本比率が高いほど他人資本（借入金）の依存度が低く、財務の安全性が高いとされます。'
  },
  {
    question: 'キャッシュフロー計算書の3つの活動区分に含まれないものは？',
    options: ['営業活動', '投資活動', '財務活動', '販売活動'],
    correct: 3,
    explanation: 'キャッシュフロー計算書は営業活動、投資活動、財務活動の3つの区分から構成されます。'
  },
  {
    question: '減価償却の目的として最も適切なものは？',
    options: ['節税対策', '固定資産の価値減少の費用計上', '利益調整', '資金調達'],
    correct: 1,
    explanation: '減価償却は固定資産の価値減少を各期間に配分して費用計上し、適正な期間損益計算を行うためです。'
  },
  {
    question: 'EBITDA の「D」は何を表すか？',
    options: ['配当（Dividend）', '負債（Debt）', '減価償却（Depreciation）', '割引（Discount）'],
    correct: 2,
    explanation: 'EBITDAのDはDepreciation（減価償却）を表し、企業の本業の収益力を測る指標です。'
  },
  {
    question: 'デットエクイティレシオ（D/E比率）が示すものは？',
    options: ['収益性', '安全性', '成長性', '効率性'],
    correct: 1,
    explanation: 'D/E比率は有利子負債と自己資本の比率で、企業の財務安全性を示す指標です。'
  },
  {
    question: '働いている資本の効率性を示す指標は？',
    options: ['総資本回転率', '売上高利益率', '自己資本比率', '流動比率'],
    correct: 0,
    explanation: '総資本回転率は売上高を総資本で割った指標で、資本がどの程度効率的に活用されているかを示します。'
  },
  {
    question: '売上債権回転率が高い場合の意味は？',
    options: ['回収が遅い', '回収が早い', '売上が少ない', '在庫が多い'],
    correct: 1,
    explanation: '売上債権回転率が高いほど、売掛金の回収が早く、資金効率が良いことを示します。'
  },
  {
    question: 'NPV（正味現在価値）がプラスの投資案件は？',
    options: ['投資すべきでない', '投資を検討すべき', '利益がない', '回収できない'],
    correct: 1,
    explanation: 'NPVがプラスの投資案件は、将来のキャッシュフローの現在価値が投資額を上回るため、投資価値があります。'
  },
  {
    question: 'IRR（内部収益率）とは何か？',
    options: ['投資回収期間', 'NPVがゼロになる割引率', '投資利益率', '資本コスト'],
    correct: 1,
    explanation: 'IRR（Internal Rate of Return）はNPVがゼロになる割引率で、投資の収益性を評価する指標です。'
  },
  {
    question: '複利の効果が最も大きく現れる条件は？',
    options: ['短期間・低利率', '短期間・高利率', '長期間・低利率', '長期間・高利率'],
    correct: 3,
    explanation: '複利効果は長期間かつ高利率の場合に最も大きく現れ、時間の経過とともに加速度的に増加します。'
  },
  {
    question: '資本コストの意味として正しいものは？',
    options: ['資本の調達費用', '資本の維持費用', '資本の運用益', '資本の償却費'],
    correct: 0,
    explanation: '資本コストは企業が資本を調達するために支払う費用で、投資判断の基準となります。'
  },
  {
    question: 'ファイナンシャルリースの特徴は？',
    options: ['短期契約', '解約可能', '所有権移転型', 'メンテナンス込み'],
    correct: 2,
    explanation: 'ファイナンシャルリースは解約不能で、リース期間終了後にリース物件の所有権が借手に移転するのが一般的です。'
  },
  // Human Resource Management (56-70)
  {
    question: '人事評価の360度フィードバックとは？',
    options: ['年1回の評価', '上司のみの評価', '多方面からの評価', '自己評価のみ'],
    correct: 2,
    explanation: '360度フィードバックは、上司、部下、同僚、顧客など多方面から評価を受ける手法です。'
  },
  {
    question: 'MBO（Management by Objectives）の特徴は？',
    options: ['トップダウン管理', '目標による管理', '成果主義', '年功序列'],
    correct: 1,
    explanation: 'MBOは目標による管理で、個人や部門が目標を設定し、その達成度で評価する手法です。'
  },
  {
    question: 'コンピテンシーとは何か？',
    options: ['学歴・資格', '高業績者の行動特性', '勤続年数', '技術スキル'],
    correct: 1,
    explanation: 'コンピテンシーは高業績者に共通する行動特性や能力で、人材開発や評価の基準となります。'
  },
  {
    question: 'ジョブローテーションの目的は？',
    options: ['専門性の向上', '多様な経験による人材育成', 'コスト削減', '業務効率化'],
    correct: 1,
    explanation: 'ジョブローテーションは様々な職務を経験させることで、多面的な能力を持つ人材を育成します。'
  },
  {
    question: '労働基準法で定められた法定労働時間は？',
    options: ['1日7時間、週35時間', '1日8時間、週40時間', '1日9時間、週45時間', '1日10時間、週50時間'],
    correct: 1,
    explanation: '労働基準法では1日8時間、週40時間が法定労働時間として定められています。'
  },
  {
    question: 'OJT（On-the-Job Training）の特徴は？',
    options: ['教室での研修', '実際の職場での指導', 'eラーニング', '外部研修'],
    correct: 1,
    explanation: 'OJTは実際の職場で業務を通じて行う教育訓練で、実践的なスキル習得に効果的です。'
  },
  {
    question: 'ダイバーシティ&インクルージョンの目的は？',
    options: ['コスト削減', '多様性の活用と包摂', '標準化推進', '階層の明確化'],
    correct: 1,
    explanation: 'ダイバーシティ&インクルージョンは多様な人材を活用し、すべての人が力を発揮できる環境を作ることです。'
  },
  {
    question: 'ワークライフバランスの意味は？',
    options: ['労働時間の延長', '仕事と生活の調和', '成果主義の導入', '給与の平等化'],
    correct: 1,
    explanation: 'ワークライフバランスは仕事と生活の調和を図り、充実した人生を送ることを目指します。'
  },
  {
    question: 'タレントマネジメントとは？',
    options: ['芸能人の管理', '優秀人材の戦略的活用', '一般的な人事管理', '給与計算'],
    correct: 1,
    explanation: 'タレントマネジメントは優秀な人材を戦略的に発掘、育成、活用する人事管理手法です。'
  },
  {
    question: 'エンプロイーエクスペリエンス（EX）とは？',
    options: ['従業員の経験価値', '従業員の技術力', '従業員の勤務年数', '従業員の学歴'],
    correct: 0,
    explanation: 'エンプロイーエクスペリエンスは従業員が職場で体験する価値や満足度の向上を図る概念です。'
  },
  {
    question: '労働契約法で定められた解雇の原則は？',
    options: ['自由解雇', '客観的合理的理由が必要', '30日前通知のみ', '金銭解決'],
    correct: 1,
    explanation: '労働契約法では、解雇は客観的に合理的な理由があり、社会通念上相当と認められる場合のみ有効です。'
  },
  {
    question: 'キャリア開発の支援方法に含まれないものは？',
    options: ['メンタリング', 'コーチング', 'キャリアカウンセリング', '強制配置転換'],
    correct: 3,
    explanation: 'キャリア開発支援は従業員の自主性を尊重し、メンタリングやコーチングなどの支援的手法を用います。'
  },
  {
    question: 'パフォーマンスマネジメントの主な目的は？',
    options: ['懲戒処分', '成果の向上と能力開発', '人件費削減', '監視強化'],
    correct: 1,
    explanation: 'パフォーマンスマネジメントは従業員の成果向上と能力開発を支援する継続的なプロセスです。'
  },
  {
    question: '内定取消しが認められる条件は？',
    options: ['企業の都合', '客観的合理的理由', '景気悪化', '上司の判断'],
    correct: 1,
    explanation: '内定取消しは客観的に合理的な理由があり、社会通念上相当と認められる場合のみ有効です。'
  },
  {
    question: 'リテンション（人材定着）の施策に含まれないものは？',
    options: ['働きやすい環境整備', '成長機会の提供', '適正な報酬', '頻繁な転勤'],
    correct: 3,
    explanation: 'リテンション施策は従業員の定着を図るもので、頻繁な転勤は逆効果となる可能性があります。'
  },
  // Project Management (71-85)
  {
    question: 'WBS（Work Breakdown Structure）の目的は？',
    options: ['予算管理', '作業の階層的分解', '人員配置', 'リスク管理'],
    correct: 1,
    explanation: 'WBSはプロジェクトの作業を管理可能な小さな単位に階層的に分解する手法です。'
  },
  {
    question: 'クリティカルパスとは何か？',
    options: ['最短経路', '最も重要な作業', '最長経路（所要時間）', '最も困難な作業'],
    correct: 2,
    explanation: 'クリティカルパスはプロジェクト完了までの最長経路で、プロジェクト期間を決定します。'
  },
  {
    question: 'アジャイル開発の特徴は？',
    options: ['詳細な計画重視', '反復的・漸進的開発', '文書重視', 'ウォーターフォール型'],
    correct: 1,
    explanation: 'アジャイル開発は短期間の反復（イテレーション）で漸進的に開発を進める手法です。'
  },
  {
    question: 'スクラムのタイムボックスに含まれないものは？',
    options: ['スプリント', 'デイリースクラム', 'スプリントレビュー', 'マスタープラン'],
    correct: 3,
    explanation: 'スクラムではスプリント、デイリースクラム、スプリントレビューなどの決まった期間のイベントがあります。'
  },
  {
    question: 'プロジェクトマネジメントの知識エリア（PMBOK）で含まれないものは？',
    options: ['統合管理', 'スコープ管理', 'コスト管理', 'マーケティング管理'],
    correct: 3,
    explanation: 'PMBOKの10の知識エリアにマーケティング管理は含まれません。プロジェクト固有の管理領域です。'
  },
  {
    question: 'リスクマトリクスで評価する2つの軸は？',
    options: ['発生確率と影響度', 'コストと時間', '品質と機能', '人員と技術'],
    correct: 0,
    explanation: 'リスクマトリクスは発生確率と影響度の2軸でリスクを評価し、優先順位を決定します。'
  },
  {
    question: 'ガントチャートの主な用途は？',
    options: ['予算管理', '品質管理', 'スケジュール管理', '人員管理'],
    correct: 2,
    explanation: 'ガントチャートは作業の開始・終了時期を視覚的に表現し、スケジュール管理に使用します。'
  },
  {
    question: 'プロジェクトの制約条件（三重制約）は？',
    options: ['時間・コスト・品質', 'スコープ・時間・コスト', '人員・技術・予算', '計画・実行・評価'],
    correct: 1,
    explanation: 'プロジェクトの三重制約はスコープ（範囲）、時間、コストです。'
  },
  {
    question: 'ステークホルダー分析の目的は？',
    options: ['予算算出', '利害関係者の特定と管理', '技術選定', 'スケジュール作成'],
    correct: 1,
    explanation: 'ステークホルダー分析はプロジェクトに影響を与える利害関係者を特定し、適切に管理するためです。'
  },
  {
    question: 'デスマーチプロジェクトの特徴は？',
    options: ['順調な進行', '計画通りの完了', '過酷な労働環境', '高い品質'],
    correct: 2,
    explanation: 'デスマーチプロジェクトは無謀なスケジュールや予算で、過酷な労働環境になるプロジェクトです。'
  },
  {
    question: 'プロジェクト憲章（プロジェクトチャーター）に含まれる内容は？',
    options: ['詳細設計書', 'プロジェクトの正式な承認', 'テスト仕様書', '運用マニュアル'],
    correct: 1,
    explanation: 'プロジェクト憲章はプロジェクトを正式に承認し、プロジェクトマネージャーに権限を与える文書です。'
  },
  {
    question: 'カンバン方式の特徴は？',
    options: ['プッシュ型生産', 'プル型生産', '大量生産', '予測型生産'],
    correct: 1,
    explanation: 'カンバン方式は必要な時に必要な分だけ生産するプル型（引っ張り型）の生産方式です。'
  },
  {
    question: 'MVP（Minimum Viable Product）の目的は？',
    options: ['完璧な製品開発', '最小限の機能で市場検証', '大量生産準備', '競合分析'],
    correct: 1,
    explanation: 'MVPは最小限の機能で早期に市場に出し、ユーザーフィードバックを得て学習することが目的です。'
  },
  {
    question: 'プロジェクトの終結フェーズで行うことは？',
    options: ['要件定義', '設計', '教訓の整理', '開発'],
    correct: 2,
    explanation: 'プロジェクト終結フェーズでは成果物の引き渡し、契約終了、教訓の整理などを行います。'
  },
  {
    question: 'QCD管理のQは何を表すか？',
    options: ['Quality（品質）', 'Quantity（数量）', 'Quick（迅速）', 'Question（疑問）'],
    correct: 0,
    explanation: 'QCD管理のQはQuality（品質）を表し、品質・コスト・納期の3要素を管理します。'
  },
  // Legal Frameworks and Compliance (86-100)
  {
    question: '著作権の保護期間（個人）は著作者の死後何年か？',
    options: ['20年', '50年', '70年', '100年'],
    correct: 2,
    explanation: '著作権（個人）の保護期間は著作者の死後70年間です。'
  },
  {
    question: '商標権の存続期間は？',
    options: ['5年', '10年', '15年', '20年'],
    correct: 1,
    explanation: '商標権の存続期間は登録から10年間で、更新により継続的に保護できます。'
  },
  {
    question: '意匠権の保護期間は？',
    options: ['15年', '20年', '25年', '30年'],
    correct: 2,
    explanation: '意匠権の保護期間は登録から25年間です。'
  },
  {
    question: '個人情報保護法で定める個人情報の定義に含まれないものは？',
    options: ['氏名', '生年月日', '法人名', '電話番号'],
    correct: 2,
    explanation: '個人情報は生存する個人に関する情報で、法人名は含まれません。'
  },
  {
    question: 'GDPR（EU一般データ保護規則）の忘れられる権利とは？',
    options: ['データ削除権', 'データ訂正権', 'データ閲覧権', 'データ移管権'],
    correct: 0,
    explanation: 'GDPRの忘れられる権利は、個人データの削除を求める権利です。'
  },
  {
    question: '不正競争防止法で保護される営業秘密の要件に含まれないものは？',
    options: ['秘密性', '有用性', '秘密管理性', '独創性'],
    correct: 3,
    explanation: '営業秘密の要件は秘密性、有用性、秘密管理性の3つです。独創性は特許の要件です。'
  },
  {
    question: 'SOX法（企業改革法）の主な目的は？',
    options: ['税務処理の統一', '財務報告の信頼性向上', '労働条件の改善', '環境保護'],
    correct: 1,
    explanation: 'SOX法は企業の財務報告の信頼性と透明性を向上させることを目的とします。'
  },
  {
    question: 'ITIL（IT Infrastructure Library）とは？',
    options: ['プログラミング言語', 'ITサービス管理のベストプラクティス', 'データベース管理', 'ネットワーク技術'],
    correct: 1,
    explanation: 'ITILはITサービス管理におけるベストプラクティスをまとめたフレームワークです。'
  },
  {
    question: 'ISO 27001が対象とするマネジメントシステムは？',
    options: ['品質マネジメント', '環境マネジメント', '情報セキュリティマネジメント', 'ITサービスマネジメント'],
    correct: 2,
    explanation: 'ISO 27001は情報セキュリティマネジメントシステム（ISMS）の国際規格です。'
  },
  {
    question: 'COBIT（Control Objectives for Information and Related Technology）の主な目的は？',
    options: ['プログラム開発', 'ITガバナンスの強化', 'データベース設計', 'ネットワーク構築'],
    correct: 1,
    explanation: 'COBITはITガバナンスとマネジメントのためのフレームワークです。'
  },
  {
    question: '下請代金支払遅延等防止法の対象となる取引は？',
    options: ['個人取引のみ', '資本金による区分があり', '金額制限なし', '業種制限なし'],
    correct: 1,
    explanation: '下請法は資本金の区分により適用される取引が決まります。'
  },
  {
    question: 'プライバシーマーク制度の目的は？',
    options: ['技術力の証明', '個人情報保護の適切な取扱い', '財務健全性の証明', '品質管理の徹底'],
    correct: 1,
    explanation: 'プライバシーマーク制度は個人情報を適切に取り扱っている事業者を認定する制度です。'
  },
  {
    question: '電子署名法で認められる電子署名の要件は？',
    options: ['パスワードのみ', '本人性・非改ざん性', '暗号化のみ', 'タイムスタンプのみ'],
    correct: 1,
    explanation: '電子署名法では本人性の確認と非改ざん性の確保が要件とされています。'
  },
  {
    question: '公益通報者保護法の目的は？',
    options: ['企業秘密の保護', '内部告発者の保護', '競合情報の保護', '技術情報の保護'],
    correct: 1,
    explanation: '公益通報者保護法は、法令違反を通報した労働者を解雇等の不利益から保護することを目的とします。'
  },
  {
    question: 'サイバーセキュリティ基本法の基本理念に含まれないものは？',
    options: ['自由・公正・安全', '国際協調', '民官協力', '利益最大化'],
    correct: 3,
    explanation: 'サイバーセキュリティ基本法は自由・公正・安全なサイバー空間の確保を基本理念とし、利益最大化は含まれません。'
  }
];

export default function ManagementLegalModule() {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizData.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<boolean[]>(new Array(quizData.length).fill(false));

  const { progress, saveProgress } = useLearningProgress('management-legal');

  useEffect(() => {
    if (progress.length > 0) {
      console.log('📚 Management Legal progress loaded:', progress.length, 'items');
    }
  }, [progress]);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuizIndex] = answerIndex;
    setSelectedAnswers(newAnswers);

    if (!answered[currentQuizIndex]) {
      const newAnswered = [...answered];
      newAnswered[currentQuizIndex] = true;
      setAnswered(newAnswered);

      // 即座に進捗を保存
      const quiz = quizData[currentQuizIndex];
      const isCorrect = answerIndex === quiz.correct;
      const quizKey = `management-legal-quiz-${currentQuizIndex}`;

      try {
        saveProgress(quizKey, true, isCorrect);
        console.log('✅ Management Legal progress saved:', { quiz: currentQuizIndex, correct: isCorrect });
      } catch (error) {
        console.error('❌ Failed to save management legal progress:', error);
      }
    }
  };

  const handleNext = () => {
    if (currentQuizIndex < quizData.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    } else {
      calculateFinalScore();
    }
  };

  const handlePrevious = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(currentQuizIndex - 1);
    }
  };

  const calculateFinalScore = () => {
    let correctCount = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === quizData[index].correct) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswers(new Array(quizData.length).fill(null));
    setAnswered(new Array(quizData.length).fill(false));
    setShowResults(false);
    setScore(0);
  };

  const currentQuiz = quizData[currentQuizIndex];
  const progressPercentage = ((currentQuizIndex + 1) / quizData.length) * 100;
  const completedQuizzes = progress.filter(p => p.is_completed).length;

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="text-center mb-8">
              <Trophy className="mx-auto text-yellow-500 mb-4" size={64} />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">経営・法務 完了！</h2>
              <p className="text-xl text-gray-600">
                最終スコア: {score} / {quizData.length}
                <span className="ml-2">
                  ({Math.round((score / quizData.length) * 100)}%)
                </span>
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {quizData.map((quiz, index) => {
                const userAnswer = selectedAnswers[index];
                const isCorrect = userAnswer === quiz.correct;
                return (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start gap-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle className="text-green-500 mt-1" size={20} />
                      ) : (
                        <AlertCircle className="text-red-500 mt-1" size={20} />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 mb-2">{quiz.question}</p>
                        <p className="text-sm text-gray-600 mb-1">
                          あなたの回答: {userAnswer !== null ? quiz.options[userAnswer] : '未回答'}
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-green-600 mb-2">
                            正解: {quiz.options[quiz.correct]}
                          </p>
                        )}
                        <p className="text-sm text-gray-500 bg-blue-50 p-2 rounded">
                          {quiz.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={resetQuiz}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
              >
                もう一度挑戦
              </button>
              <Link
                href="/modules/it-fundamentals"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700"
              >
                モジュール一覧に戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/modules/it-fundamentals" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="mr-2" size={20} />
          IT基礎知識に戻る
        </Link>

        <div className="bg-white rounded-xl shadow-xl p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">経営・法務</h1>
          <p className="text-gray-600 mb-4">企業活動、経営管理、法務知識を体系的に学習します</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <BookOpen size={16} />
              {quizData.length} 問
            </span>
            <span className="flex items-center gap-1">
              <Trophy size={16} />
              完了: {completedQuizzes} / {quizData.length}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-gray-800">問題 {currentQuizIndex + 1}</h2>
              <span className="text-sm text-gray-600">
                {currentQuizIndex + 1} / {quizData.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">{currentQuiz.question}</h3>
            <div className="space-y-3">
              {currentQuiz.options.map((option, index) => {
                const isSelected = selectedAnswers[currentQuizIndex] === index;
                const isDisabled = answered[currentQuizIndex];
                const isCorrect = index === currentQuiz.correct;
                const isWrong = isDisabled && isSelected && !isCorrect;

                return (
                  <button
                    key={index}
                    onClick={() => !isDisabled && handleAnswer(index)}
                    disabled={isDisabled}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                      isDisabled
                        ? isCorrect
                          ? 'border-green-500 bg-green-50'
                          : isWrong
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 bg-gray-50'
                        : isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                        isDisabled
                          ? isCorrect
                            ? 'border-green-500 bg-green-500'
                            : isWrong
                            ? 'border-red-500 bg-red-500'
                            : 'border-gray-300'
                          : isSelected
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {((isDisabled && isCorrect) || (isSelected && !isDisabled)) && (
                          <div className="w-full h-full rounded-full bg-white scale-50" />
                        )}
                      </div>
                      <span className="text-gray-700">{option}</span>
                      {isDisabled && isCorrect && (
                        <CheckCircle className="ml-auto text-green-500" size={20} />
                      )}
                      {isWrong && (
                        <AlertCircle className="ml-auto text-red-500" size={20} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {answered[currentQuizIndex] && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 font-medium">解説:</p>
                <p className="text-blue-700">{currentQuiz.explanation}</p>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuizIndex === 0}
              className={`px-6 py-2 rounded-lg font-medium ${
                currentQuizIndex === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              前の問題
            </button>
            <button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuizIndex] === null}
              className={`px-6 py-2 rounded-lg font-medium ${
                selectedAnswers[currentQuizIndex] === null
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700'
              }`}
            >
              {currentQuizIndex === quizData.length - 1 ? '結果を見る' : '次の問題'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}