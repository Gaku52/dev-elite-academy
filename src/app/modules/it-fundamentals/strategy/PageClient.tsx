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
    question: 'IT戦略策定プロセスで最初に行うべきことは？',
    options: ['ビジネス要求の分析', '現状分析', '実行計画の作成', '評価と改善'],
    correct: 1,
    explanation: 'IT戦略策定では、まず現状のIT資産やシステム構成を把握する現状分析から始める必要があります。'
  },
  {
    question: 'DXの段階で、ビジネスモデルの変革を伴うのは？',
    options: ['デジタイゼーション', 'デジタライゼーション', 'デジタルトランスフォーメーション', 'デジタルマーケティング'],
    correct: 2,
    explanation: 'デジタルトランスフォーメーションは、デジタル技術を活用してビジネスモデル自体を変革する最も高次の段階です。'
  },
  {
    question: 'システム企画段階で最初に行うべき活動は？',
    options: ['解決策の検討', '課題の明確化', '企画書の作成', '予算の確保'],
    correct: 1,
    explanation: 'システム企画では、まず現状を分析し、問題点を抽出して課題を明確にすることから始める必要があります。'
  },
  {
    question: 'ITILのサービスライフサイクルに含まれないものは？',
    options: ['サービスストラテジ', 'サービスデザイン', 'サービストランジション', 'サービスマーケティング'],
    correct: 3,
    explanation: 'ITILの5つのライフサイクルは、戦略、設計、移行、運用、継続的改善です。マーケティングは含まれません。'
  },
  {
    question: 'システム監査の主要な目的でないものは？',
    options: ['リスク管理', 'コンプライアンス確保', '売上向上', '改善提案'],
    correct: 2,
    explanation: 'システム監査の目的は、リスク管理、コンプライアンス確保、改善提案などで、直接的な売上向上は目的ではありません。'
  },
  {
    question: 'グローバル化の最初の段階は？',
    options: ['国際化段階', '輸出段階', '多国籍化段階', 'グローバル化段階'],
    correct: 1,
    explanation: '輸出段階は、国内で生産した製品を海外に販売する最初のグローバル化段階です。'
  },
  {
    question: 'SCMで全体最適を目指す際の重要な要素は？',
    options: ['個別最適', '部分最適', '情報共有', '競争関係'],
    correct: 2,
    explanation: 'SCMでは、サプライチェーン全体の情報共有により連携を強化し、全体最適を実現します。'
  },
  {
    question: 'プロダクトアウトの起点となるのは？',
    options: ['市場ニーズ', '顧客要求', '企業の技術力', '競合他社'],
    correct: 2,
    explanation: 'プロダクトアウトは、企業の技術力や生産能力を起点として製品開発を行う考え方です。'
  },
  {
    question: 'ビジネスエコシステムの特徴でないものは？',
    options: ['多様なプレイヤー', '相互依存関係', '単独での価値創造', 'イノベーションの促進'],
    correct: 2,
    explanation: 'ビジネスエコシステムは複数企業の協業による価値共創が特徴で、単独での価値創造とは対照的です。'
  },
  {
    question: 'ESGの「E」は何を表すか？',
    options: ['Economy', 'Environment', 'Ethics', 'Education'],
    correct: 1,
    explanation: 'ESGのEはEnvironment（環境）を表し、気候変動対策や資源効率などの環境課題への取り組みを指します。'
  },
  {
    question: '企業戦略の階層で、最上位にあるのは？',
    options: ['事業戦略', '機能戦略', '全社戦略', '競争戦略'],
    correct: 2,
    explanation: '全社戦略は企業全体の方向性を決める最上位の戦略で、事業ポートフォリオや資源配分を決定します。'
  },
  {
    question: 'ポーターの5つの競争要因に含まれないものは？',
    options: ['新規参入の脅威', '代替品の脅威', '競合他社との競争', '政府の規制'],
    correct: 3,
    explanation: 'ポーターの5つの競争要因は、新規参入、代替品、売り手・買い手の交渉力、既存競合です。政府規制は含まれません。'
  },
  {
    question: 'SWOT分析で内部環境要因に含まれるのは？',
    options: ['機会と脅威', '強みと弱み', '機会と強み', '脅威と弱み'],
    correct: 1,
    explanation: 'SWOT分析では、強み（Strength）と弱み（Weakness）が内部環境要因、機会（Opportunity）と脅威（Threat）が外部環境要因です。'
  },
  {
    question: '競争優位の基本戦略で、コストリーダーシップ戦略の特徴は？',
    options: ['高品質で差別化', '低コストで価格競争力', 'ニッチ市場への集中', '技術革新による差別化'],
    correct: 1,
    explanation: 'コストリーダーシップ戦略は、業界で最も低いコストで製品・サービスを提供し、価格競争力を実現する戦略です。'
  },
  {
    question: 'バリューチェーン分析で主活動に含まれないものは？',
    options: ['購買・調達', 'インバウンド物流', '製造・オペレーション', 'アウトバウンド物流'],
    correct: 0,
    explanation: '購買・調達は支援活動です。主活動は、インバウンド物流、製造、アウトバウンド物流、マーケティング・販売、サービスです。'
  },
  {
    question: 'アンゾフの成長マトリックスで、新市場×既存製品は？',
    options: ['市場浸透', '新製品開発', '市場開拓', '多角化'],
    correct: 2,
    explanation: '市場開拓は、既存製品を新しい市場に投入する成長戦略です。新しい顧客層や地域への展開が含まれます。'
  },
  {
    question: 'BCGマトリックスで「金のなる木」の特徴は？',
    options: ['高成長・高シェア', '高成長・低シェア', '低成長・高シェア', '低成長・低シェア'],
    correct: 2,
    explanation: '「金のなる木」は低成長・高シェアの事業で、安定した収益を生み出し、他事業への投資原資となります。'
  },
  {
    question: 'コアコンピタンスの条件に含まれないものは？',
    options: ['顧客価値への貢献', '競合他社による模倣困難性', '多様な市場への応用可能性', '短期的な収益性'],
    correct: 3,
    explanation: 'コアコンピタンスは、顧客価値、模倣困難性、応用可能性の3つの条件を満たす企業の中核的能力です。短期収益性は条件ではありません。'
  },
  {
    question: 'ブルーオーシャン戦略の基本原則でないものは？',
    options: ['価値とコストのトレードオフを超越', '差別化と低コストの同時追求', '競争のない市場空間の創造', '既存競合との直接対決'],
    correct: 3,
    explanation: 'ブルーオーシャン戦略は既存競合との直接対決を避け、新たな市場空間を創造する戦略です。'
  },
  {
    question: 'プラットフォーム戦略の特徴でないものは？',
    options: ['ネットワーク効果', '両面市場の活用', '垂直統合の推進', 'エコシステムの構築'],
    correct: 2,
    explanation: 'プラットフォーム戦略は垂直統合ではなく、オープンなエコシステムを構築し、多様な参加者をつなぐ戦略です。'
  },
  {
    question: 'IT戦略とビジネス戦略の関係で最も適切なのは？',
    options: ['IT戦略はビジネス戦略に従属', 'ビジネス戦略はIT戦略に従属', '両者は相互に影響し合う', '両者は独立して策定される'],
    correct: 2,
    explanation: '現代では、IT戦略とビジネス戦略は相互に影響し合い、統合的に策定される必要があります。'
  },
  {
    question: 'エンタープライズアーキテクチャの4つの体系に含まれないものは？',
    options: ['ビジネスアーキテクチャ', 'データアーキテクチャ', 'アプリケーションアーキテクチャ', 'セキュリティアーキテクチャ'],
    correct: 3,
    explanation: 'EA（エンタープライズアーキテクチャ）の4つの体系は、ビジネス、データ、アプリケーション、テクノロジーアーキテクチャです。'
  },
  {
    question: 'IT投資評価でTCO（Total Cost of Ownership）に含まれないものは？',
    options: ['初期導入コスト', '運用保守コスト', '教育訓練コスト', '機会損失コスト'],
    correct: 3,
    explanation: 'TCOは、初期導入、運用保守、教育訓練など、システムの全生涯にわたる直接的なコストを指します。機会損失は間接的コストです。'
  },
  {
    question: 'クラウドコンピューティングのサービスモデルでないものは？',
    options: ['SaaS', 'PaaS', 'IaaS', 'DaaS'],
    correct: 3,
    explanation: 'クラウドの主要サービスモデルは、SaaS（Software as a Service）、PaaS（Platform as a Service）、IaaS（Infrastructure as a Service）です。'
  },
  {
    question: 'DevOpsの主要な目的は？',
    options: ['開発コストの削減', '運用負荷の軽減', '開発と運用の連携強化', 'セキュリティの向上'],
    correct: 2,
    explanation: 'DevOpsは、開発（Development）と運用（Operations）の連携を強化し、迅速で高品質なソフトウェア開発・運用を実現する手法です。'
  },
  {
    question: 'アジャイル開発の特徴でないものは？',
    options: ['反復的・漸進的開発', '詳細な仕様書の事前作成', '顧客との継続的コラボレーション', '変化への対応'],
    correct: 1,
    explanation: 'アジャイル開発は、詳細な仕様書よりも動作するソフトウェアを重視し、柔軟性と迅速性を追求します。'
  },
  {
    question: 'ビッグデータの3Vに含まれないものは？',
    options: ['Volume（量）', 'Velocity（速度）', 'Variety（多様性）', 'Visibility（可視性）'],
    correct: 3,
    explanation: 'ビッグデータの特徴は、Volume（大容量）、Velocity（高速性）、Variety（多様性）の3Vで表現されます。'
  },
  {
    question: 'IoT（Internet of Things）の活用効果でないものは？',
    options: ['リアルタイムデータ収集', '予知保全の実現', 'プロセスの自動化', 'データの暗号化'],
    correct: 3,
    explanation: 'IoTの主な効果は、データ収集、予知保全、自動化などです。データ暗号化はセキュリティ対策であり、IoT固有の効果ではありません。'
  },
  {
    question: 'マーケティングミックス4Pに含まれないものは？',
    options: ['Product（製品）', 'Price（価格）', 'Place（流通）', 'Performance（業績）'],
    correct: 3,
    explanation: 'マーケティングミックス4Pは、Product（製品）、Price（価格）、Place（流通）、Promotion（販促）です。'
  },
  {
    question: 'STP戦略の「T」は何を表すか？',
    options: ['Targeting（標的設定）', 'Timing（タイミング）', 'Technology（技術）', 'Territory（地域）'],
    correct: 0,
    explanation: 'STP戦略は、Segmentation（市場細分化）、Targeting（標的設定）、Positioning（位置づけ）の3つのステップです。'
  },
  {
    question: '顧客生涯価値（CLV）の計算で考慮されない要素は？',
    options: ['平均購買単価', '購買頻度', '顧客維持期間', '市場シェア'],
    correct: 3,
    explanation: 'CLVは、顧客が生涯にわたって企業にもたらす価値で、購買単価、頻度、維持期間から算出されます。市場シェアは直接関係しません。'
  },
  {
    question: 'デジタルマーケティングの手法でないものは？',
    options: ['SEO（検索エンジン最適化）', 'SNSマーケティング', 'コンテンツマーケティング', 'テレマーケティング'],
    correct: 3,
    explanation: 'テレマーケティングは電話を使った従来の手法です。デジタルマーケティングはオンラインチャネルを活用した手法です。'
  },
  {
    question: 'カスタマージャーニーマップの主要な構成要素でないものは？',
    options: ['タッチポイント', '顧客の感情', '行動・思考', '競合分析'],
    correct: 3,
    explanation: 'カスタマージャーニーマップは、顧客の行動、思考、感情、タッチポイントを時系列で可視化したものです。競合分析は別の手法です。'
  },
  {
    question: 'オムニチャネル戦略の特徴は？',
    options: ['単一チャネルへの集中', '複数チャネルの独立運用', '全チャネルの統合体験', 'オンライン専業'],
    correct: 2,
    explanation: 'オムニチャネル戦略は、すべてのチャネルを統合し、顧客にシームレスな体験を提供する戦略です。'
  },
  {
    question: 'KPI（Key Performance Indicator）設定の原則でないものは？',
    options: ['具体的（Specific）', '測定可能（Measurable）', '達成可能（Achievable）', '競合優位（Competitive）'],
    correct: 3,
    explanation: 'KPI設定はSMARTの原則（Specific、Measurable、Achievable、Relevant、Time-bound）に従います。'
  },
  {
    question: 'リーン生産方式の基本思想は？',
    options: ['大量生産による効率化', '無駄の徹底的排除', '高品質の追求', '従業員満足度向上'],
    correct: 1,
    explanation: 'リーン生産方式は、あらゆる無駄を排除し、価値を生まない活動を最小化することを基本思想とします。'
  },
  {
    question: 'サプライチェーンマネジメントで重要でない要素は？',
    options: ['需要予測の精度向上', '在庫の最適化', '情報共有の促進', '価格競争の激化'],
    correct: 3,
    explanation: 'SCMは、需要予測、在庫最適化、情報共有によりサプライチェーン全体の効率を向上させます。価格競争は目的ではありません。'
  },
  {
    question: 'TQM（Total Quality Management）の特徴でないものは？',
    options: ['全社的品質管理', '継続的改善', '顧客満足の追求', '短期利益の最大化'],
    correct: 3,
    explanation: 'TQMは、全社的な品質管理により長期的な顧客満足と競争優位を追求します。短期利益最大化は対象外です。'
  },
  {
    question: 'シックスシグマ手法のDMAIC段階に含まれないものは？',
    options: ['Define（定義）', 'Measure（測定）', 'Analyze（分析）', 'Deploy（展開）'],
    correct: 3,
    explanation: 'DMAICは、Define（定義）、Measure（測定）、Analyze（分析）、Improve（改善）、Control（管理）の5段階です。'
  },
  {
    question: 'ジャストインタイム生産の効果でないものは？',
    options: ['在庫削減', 'リードタイム短縮', '品質向上', '設備投資増加'],
    correct: 3,
    explanation: 'ジャストインタイム生産は、必要な時に必要な分だけ生産することで、在庫削減、リードタイム短縮、品質向上を実現します。'
  },
  {
    question: 'BPR（Business Process Reengineering）の特徴は？',
    options: ['業務の段階的改善', '業務プロセスの抜本的見直し', '既存システムの改良', '人員削減の実施'],
    correct: 1,
    explanation: 'BPRは、既存の業務プロセスを抜本的に見直し、劇的な改善を目指すアプローチです。'
  },
  {
    question: '予算管理の種類で、変動費と固定費を区別するのは？',
    options: ['固定予算', '変動予算', 'ゼロベース予算', '継続予算'],
    correct: 1,
    explanation: '変動予算は、売上高や生産量の変動に応じて、変動費と固定費を区別して予算を調整する手法です。'
  },
  {
    question: 'ROI（Return on Investment）の計算式は？',
    options: ['利益÷売上高×100', '利益÷投資額×100', '売上高÷投資額×100', '投資額÷利益×100'],
    correct: 1,
    explanation: 'ROIは投資収益率で、投資から得られる利益を投資額で割って算出します。'
  },
  {
    question: 'NPV（Net Present Value）がプラスの場合、投資判断は？',
    options: ['投資すべきでない', '投資すべき', '判断保留', '追加検討が必要'],
    correct: 1,
    explanation: 'NPVがプラスの場合、投資により価値が創造されるため、投資すべきと判断されます。'
  },
  {
    question: 'IRR（Internal Rate of Return）の意味は？',
    options: ['投資回収期間', '内部収益率', '割引現在価値', '投資利益率'],
    correct: 1,
    explanation: 'IRRは内部収益率で、NPVをゼロにする割引率のことです。投資の収益性を評価する指標です。'
  },
  {
    question: 'ペイバック法で評価される期間は？',
    options: ['投資効果継続期間', '投資回収期間', '投資検討期間', '投資評価期間'],
    correct: 1,
    explanation: 'ペイバック法は、投資額を回収するのに必要な期間を算出し、投資の安全性を評価する手法です。'
  },
  {
    question: 'キャッシュフロー計算書の3つの区分に含まれないものは？',
    options: ['営業活動によるキャッシュフロー', '投資活動によるキャッシュフロー', '財務活動によるキャッシュフロー', '事業活動によるキャッシュフロー'],
    correct: 3,
    explanation: 'キャッシュフロー計算書は、営業活動、投資活動、財務活動の3つの区分で構成されます。'
  },
  {
    question: 'WACC（Weighted Average Cost of Capital）とは？',
    options: ['加重平均資本コスト', '総資産利益率', '自己資本利益率', '売上高利益率'],
    correct: 0,
    explanation: 'WACCは加重平均資本コストで、企業が資金調達にかかるコストの加重平均です。'
  },
  {
    question: 'イノベーションの普及過程で最初に採用するのは？',
    options: ['イノベーター', 'アーリーアダプター', 'アーリーマジョリティ', 'レイトマジョリティ'],
    correct: 0,
    explanation: 'イノベーター理論では、イノベーター（革新者）が最初に新技術を採用し、その後段階的に普及していきます。'
  },
  {
    question: 'キャズム理論における「キャズム」とは？',
    options: ['イノベーターとアーリーアダプターの間', 'アーリーアダプターとアーリーマジョリティの間', 'アーリーマジョリティとレイトマジョリティの間', 'レイトマジョリティとラガードの間'],
    correct: 1,
    explanation: 'キャズムは、アーリーアダプターとアーリーマジョリティの間にある「深い溝」で、多くの技術がここで普及に失敗します。'
  },
  {
    question: '破壊的イノベーションの特徴でないものは？',
    options: ['低価格・低性能からスタート', '新しい市場の創造', '既存顧客の満足度向上', '既存企業の淘汰'],
    correct: 2,
    explanation: '破壊的イノベーションは、既存顧客ではなく新しい顧客層をターゲットとし、既存市場を破壊する特徴があります。'
  },
  {
    question: 'オープンイノベーションの効果でないものは？',
    options: ['外部知識の活用', '開発期間の短縮', 'リスクの分散', '自社技術の独占'],
    correct: 3,
    explanation: 'オープンイノベーションは外部との協業により価値創造を目指すため、技術独占とは対照的なアプローチです。'
  },
  {
    question: 'アンビデクストラス経営（両利きの経営）とは？',
    options: ['左右両手の活用', '探索と活用の両立', '国内と海外の並行展開', '新規と既存の同時対応'],
    correct: 1,
    explanation: 'アンビデクストラス経営は、既存事業の活用（Exploitation）と新事業の探索（Exploration）を同時に行う経営です。'
  },
  {
    question: 'MOT（Management of Technology）の主要課題でないものは？',
    options: ['技術戦略の策定', '研究開発の管理', '技術移転の促進', '財務諸表の作成'],
    correct: 3,
    explanation: 'MOTは技術経営のことで、技術戦略、R&D管理、技術移転などが主要課題です。財務諸表作成は一般的な経営管理業務です。'
  },
  {
    question: 'ステージゲート法の目的は？',
    options: ['製品品質の向上', '研究開発プロジェクトの管理', '製造コストの削減', '販売促進の強化'],
    correct: 1,
    explanation: 'ステージゲート法は、研究開発プロジェクトを段階的に管理し、各段階でゲート審査を行うプロジェクト管理手法です。'
  },
  {
    question: 'グローバル化の段階で、海外に生産拠点を設置するのは？',
    options: ['輸出段階', '国際化段階', '多国籍化段階', 'グローバル化段階'],
    correct: 2,
    explanation: '多国籍化段階では、海外に生産拠点や子会社を設立し、現地での事業展開を本格化します。'
  },
  {
    question: 'CAGE分析の4つの距離に含まれないものは？',
    options: ['文化的距離', '制度的距離', '地理的距離', '技術的距離'],
    correct: 3,
    explanation: 'CAGE分析は、Cultural（文化）、Administrative（制度）、Geographic（地理）、Economic（経済）の4つの距離を分析します。'
  },
  {
    question: 'PPP（Purchasing Power Parity）とは？',
    options: ['公的民間パートナーシップ', '購買力平価', '生産性向上プログラム', 'プライベートエクイティ'],
    correct: 1,
    explanation: 'PPPは購買力平価で、各国の物価水準を考慮した為替レートの指標です。'
  },
  {
    question: 'FTA（Free Trade Agreement）の効果でないものは？',
    options: ['関税の撤廃・削減', '貿易障壁の除去', '投資の促進', '通貨統合'],
    correct: 3,
    explanation: 'FTAは自由貿易協定で、関税撤廃や貿易障壁除去が主な内容です。通貨統合は経済統合のより高次の段階です。'
  },
  {
    question: 'グローバルサプライチェーンのリスク要因でないものは？',
    options: ['為替変動', '政治的不安定', '自然災害', '製品差別化'],
    correct: 3,
    explanation: 'グローバルサプライチェーンのリスクには、為替、政治、災害などがあります。製品差別化は競争戦略の要素です。'
  },
  {
    question: '国際マーケティングの標準化戦略の利点は？',
    options: ['現地適応性の向上', '規模の経済の実現', 'カントリーリスクの分散', '現地パートナーとの連携'],
    correct: 1,
    explanation: '標準化戦略は、世界共通の製品・マーケティングにより規模の経済を実現し、コスト削減を図ります。'
  },
  {
    question: 'CSR（Corporate Social Responsibility）の基本的考え方は？',
    options: ['利益最大化の追求', '株主価値の向上', '社会的責任の履行', '市場シェアの拡大'],
    correct: 2,
    explanation: 'CSRは企業の社会的責任で、経済的利益だけでなく、社会や環境に対する責任を果たすことです。'
  },
  {
    question: 'SDGs（持続可能な開発目標）の目標数は？',
    options: ['15個', '17個', '20個', '25個'],
    correct: 1,
    explanation: 'SDGsは2030年までに達成すべき17の持続可能な開発目標で構成されています。'
  },
  {
    question: 'トリプルボトムライン経営の3つの要素に含まれないものは？',
    options: ['People（社会）', 'Planet（環境）', 'Profit（経済）', 'Performance（業績）'],
    correct: 3,
    explanation: 'トリプルボトムラインは、People（社会）、Planet（環境）、Profit（経済）の3つの価値を重視する経営です。'
  },
  {
    question: 'サステナビリティ経営の特徴でないものは？',
    options: ['長期的視点', 'ステークホルダー重視', '持続可能性の追求', '短期利益の最大化'],
    correct: 3,
    explanation: 'サステナビリティ経営は、短期利益よりも長期的な持続可能性を重視する経営アプローチです。'
  },
  {
    question: 'ESG投資の「S」は何を表すか？',
    options: ['Sustainability', 'Social', 'Strategy', 'Security'],
    correct: 1,
    explanation: 'ESG投資のSはSocial（社会）を表し、人権、労働、地域社会への貢献などの社会的側面を評価します。'
  },
  {
    question: 'サーキュラーエコノミーの基本原則でないものは？',
    options: ['廃棄物の削減', '資源の循環利用', '製品寿命の延長', '大量生産・大量消費'],
    correct: 3,
    explanation: 'サーキュラーエコノミーは、大量生産・大量消費の線形モデルから脱却し、資源の循環利用を目指します。'
  },
  {
    question: 'カーボンニュートラルの意味は？',
    options: ['CO2排出量の削減', 'CO2排出量と吸収量の均衡', 'CO2排出量ゼロ', 'カーボンオフセットの実施'],
    correct: 1,
    explanation: 'カーボンニュートラルは、CO2の排出量と吸収量を均衡させ、実質的な排出量をゼロにすることです。'
  },
  {
    question: '組織変革のコッターの8段階プロセスで最初のステップは？',
    options: ['危機意識の醸成', 'ビジョンの策定', 'チームの結成', '短期的成果の実現'],
    correct: 0,
    explanation: 'コッターの8段階プロセスでは、まず組織内に変革の必要性に対する危機意識を醸成することから始まります。'
  },
  {
    question: 'チェンジマネジメントで最も重要な要素は？',
    options: ['技術的変更', 'プロセス変更', '人的要素の管理', 'システム変更'],
    correct: 2,
    explanation: 'チェンジマネジメントでは、変革に対する人々の抵抗を管理し、組織文化の変革を推進することが最も重要です。'
  },
  {
    question: 'ADKAR変革モデルの5つの要素に含まれないものは？',
    options: ['Awareness（認識）', 'Desire（欲求）', 'Knowledge（知識）', 'Direction（方向性）'],
    correct: 3,
    explanation: 'ADKARモデルは、Awareness（認識）、Desire（欲求）、Knowledge（知識）、Ability（能力）、Reinforcement（強化）の5要素です。'
  },
  {
    question: '組織学習の段階で最も高次なのは？',
    options: ['シングルループ学習', 'ダブルループ学習', 'トリプルループ学習', 'メタ学習'],
    correct: 2,
    explanation: 'トリプルループ学習は、前提や価値観そのものを問い直す最も高次の組織学習です。'
  },
  {
    question: 'ナレッジマネジメントのSECIモデルで暗黙知から形式知への変換は？',
    options: ['共同化', '表出化', '連結化', '内面化'],
    correct: 1,
    explanation: 'SECIモデルの表出化（Externalization）は、暗黙知を形式知に変換するプロセスです。'
  },
  {
    question: 'ラーニングオーガニゼーションの特徴でないものは？',
    options: ['継続的学習', '知識共有', 'システム思考', '階層的意思決定'],
    correct: 3,
    explanation: 'ラーニングオーガニゼーションは、階層的ではなくフラットな組織構造で、全員が学習に参加します。'
  },
  {
    question: '戦略的アライアンスの形態でないものは？',
    options: ['ジョイントベンチャー', 'ライセンシング', 'アウトソーシング', 'M&A'],
    correct: 3,
    explanation: 'M&A（買収・合併）は企業統合であり、独立性を保つ戦略的アライアンスとは異なります。'
  },
  {
    question: 'コンソーシアムの特徴は？',
    options: ['2社間の提携', '業界標準の策定', '資本関係の構築', '完全統合'],
    correct: 1,
    explanation: 'コンソーシアムは、複数企業が共同で業界標準の策定や共通技術の開発を行う協業形態です。'
  },
  {
    question: 'Win-Win関係構築で重要でない要素は？',
    options: ['相互利益の追求', '長期的視点', '情報共有', '一方的優位性の確保'],
    correct: 3,
    explanation: 'Win-Win関係は、一方的優位ではなく、双方が利益を得られる相互利益の関係を目指します。'
  },
  {
    question: 'エコシステム型提携の特徴は？',
    options: ['2社間の排他的関係', '多数企業のネットワーク', '垂直統合の推進', '競合企業の排除'],
    correct: 1,
    explanation: 'エコシステム型提携は、多数の企業が参加するオープンなネットワークを形成し、価値共創を目指します。'
  },
  {
    question: 'リスクマネジメントプロセスで最初に行うのは？',
    options: ['リスク評価', 'リスク識別', 'リスク対応', 'リスク監視'],
    correct: 1,
    explanation: 'リスクマネジメントでは、まずリスクを識別し、その後評価、対応、監視の順序で進めます。'
  },
  {
    question: 'BCP（Business Continuity Plan）の主要目的は？',
    options: ['売上拡大', '事業継続', 'コスト削減', '品質向上'],
    correct: 1,
    explanation: 'BCPは事業継続計画で、災害や事故時に重要な事業を継続するための計画です。'
  },
  {
    question: 'リスクマトリックスの2つの軸は？',
    options: ['頻度と影響度', '可能性と重要度', '発生確率と影響度', '時期と規模'],
    correct: 2,
    explanation: 'リスクマトリックスは、リスクの発生確率と影響度の2軸でリスクを評価・分類します。'
  },
  {
    question: 'COSO（Committee of Sponsoring Organizations）フレームワークの目的は？',
    options: ['品質管理', '内部統制', '財務分析', 'マーケティング'],
    correct: 1,
    explanation: 'COSOフレームワークは、内部統制の統合的な枠組みを提供し、企業のリスク管理を支援します。'
  },
  {
    question: 'サイバーセキュリティの3要素（CIA）に含まれないものは？',
    options: ['機密性（Confidentiality）', '完全性（Integrity）', '可用性（Availability）', '認証性（Authentication）'],
    correct: 3,
    explanation: 'サイバーセキュリティの基本3要素は、機密性、完全性、可用性（CIA）です。認証性は重要ですが基本3要素には含まれません。'
  },
  {
    question: 'BSC（Balanced Scorecard）の4つの視点に含まれないものは？',
    options: ['財務の視点', '顧客の視点', '内部プロセスの視点', '競合の視点'],
    correct: 3,
    explanation: 'BSCの4つの視点は、財務、顧客、内部プロセス、学習と成長です。競合の視点は含まれません。'
  },
  {
    question: 'OKR（Objectives and Key Results）の特徴は？',
    options: ['年次評価のみ', '定性的目標の設定', '頻繁な見直しと調整', 'トップダウンの目標設定'],
    correct: 2,
    explanation: 'OKRは、四半期ごとなど頻繁に見直しを行い、アジャイルな目標管理を特徴とします。'
  },
  {
    question: 'SLA（Service Level Agreement）で定義されるのは？',
    options: ['サービス品質の目標値', '従業員の評価基準', '顧客満足度調査', '売上目標'],
    correct: 0,
    explanation: 'SLAはサービスレベル合意書で、提供するサービスの品質目標値を定義します。'
  },
  {
    question: 'ベンチマーキングの種類でないものは？',
    options: ['内部ベンチマーキング', '競合ベンチマーキング', '機能別ベンチマーキング', '財務ベンチマーキング'],
    correct: 3,
    explanation: 'ベンチマーキングの主な種類は、内部、競合、機能別、ベストプラクティスベンチマーキングです。'
  },
  {
    question: 'ダッシュボードの主要機能でないものは？',
    options: ['リアルタイム表示', 'KPIの可視化', 'トレンド分析', 'データ入力'],
    correct: 3,
    explanation: 'ダッシュボードは情報の可視化と分析が主機能で、データ入力は別のシステムが担当します。'
  },
  {
    question: 'デジタルトランスフォーメーション（DX）の最終目標は？',
    options: ['システム効率化', 'コスト削減', 'ビジネスモデル変革', 'ペーパーレス化'],
    correct: 2,
    explanation: 'DXの最終目標は、デジタル技術を活用してビジネスモデル自体を変革し、新たな価値を創造することです。'
  },
  {
    question: 'RPA（Robotic Process Automation）の適用領域は？',
    options: ['創造的業務', '定型的業務', '戦略的業務', '対人コミュニケーション'],
    correct: 1,
    explanation: 'RPAは、ルールベースの定型的業務の自動化に適しており、人間の判断が必要な業務には不向きです。'
  },
  {
    question: 'サブスクリプションモデルの特徴でないものは？',
    options: ['継続課金', '顧客との長期関係', 'カスタマイゼーション', '一括購入'],
    correct: 3,
    explanation: 'サブスクリプションモデルは継続課金制で、一括購入とは対照的なビジネスモデルです。'
  },
  {
    question: 'フリーミアムモデルの収益源は？',
    options: ['無料ユーザーからの課金', 'プレミアムユーザーからの課金', '広告収入のみ', 'データ販売'],
    correct: 1,
    explanation: 'フリーミアムモデルは、無料ユーザーを獲得し、その一部をプレミアム（有料）ユーザーに転換して収益を得ます。'
  },
  {
    question: 'シェアリングエコノミーの特徴でないものは？',
    options: ['資産の共有利用', 'デジタルプラットフォーム', '所有から利用へ', '大量生産・大量所有'],
    correct: 3,
    explanation: 'シェアリングエコノミーは、大量所有ではなく、資産の共有利用により効率性を追求する経済モデルです。'
  },
  {
    question: 'MarTech（マーケティングテクノロジー）の活用目的でないものは？',
    options: ['顧客データの分析', 'マーケティング自動化', 'パーソナライゼーション', '製品製造'],
    correct: 3,
    explanation: 'MarTechは、マーケティング活動をテクノロジーで効率化・高度化するツール群で、製品製造は対象外です。'
  },
  {
    question: 'FinTech（フィンテック）の領域でないものは？',
    options: ['決済サービス', '資産運用', '融資プラットフォーム', '製造業DX'],
    correct: 3,
    explanation: 'FinTechは金融（Finance）とテクノロジーの融合分野で、製造業DXは別の領域です。'
  },
  {
    question: 'ブロックチェーン技術の特徴でないものは？',
    options: ['分散管理', '改ざん困難性', '透明性', '中央集権制'],
    correct: 3,
    explanation: 'ブロックチェーンは分散台帳技術で、中央集権的な管理者を必要としない非中央集権的システムです。'
  }
];

export default function StrategyModule() {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizData.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<boolean[]>(new Array(quizData.length).fill(false));

  const { progress, saveProgress } = useLearningProgress('strategy');

  useEffect(() => {
    if (progress.length > 0) {
      console.log('📚 Strategy progress loaded:', progress.length, 'items');
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
      const quizKey = `strategy-quiz-${currentQuizIndex}`;

      try {
        saveProgress(quizKey, true, isCorrect);
        console.log('✅ Strategy progress saved:', { quiz: currentQuizIndex, correct: isCorrect });
      } catch (error) {
        console.error('❌ Failed to save strategy progress:', error);
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
              <h2 className="text-3xl font-bold text-gray-800 mb-2">ストラテジ 完了！</h2>
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ストラテジ</h1>
          <p className="text-gray-600 mb-4">企業戦略、IT戦略、マーケティングを体系的に学習します</p>
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