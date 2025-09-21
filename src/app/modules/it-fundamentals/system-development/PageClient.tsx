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
    question: 'ウォーターフォールモデルの特徴として誤っているものはどれか？',
    options: ['各フェーズを順番に進める', '変更に柔軟に対応できる', 'ドキュメント重視', '計画的で管理しやすい'],
    correct: 1,
    explanation: 'ウォーターフォールモデルは変更に対して柔軟性が低いのが特徴です。一度フェーズを完了すると後戻りが困難です。'
  },
  {
    question: 'Scrumはどの開発モデルの手法の一つか？',
    options: ['ウォーターフォールモデル', 'アジャイル開発', 'プロトタイプモデル', 'スパイラルモデル'],
    correct: 1,
    explanation: 'Scrumはアジャイル開発の代表的なフレームワークの一つで、スプリントと呼ばれる短い期間で反復的に開発を行います。'
  },
  {
    question: 'システム開発ライフサイクルの最初のフェーズは何ですか？',
    options: ['設計', '要件定義', '実装', 'テスト'],
    correct: 1,
    explanation: '要件定義は、システム開発の最初のフェーズで、ユーザーのニーズを明確にし、システムの機能要件と非機能要件を定義します。'
  },
  {
    question: 'プロジェクト管理でWBS（Work Breakdown Structure）は何の管理で使用される技法か？',
    options: ['スケジュール管理', 'スコープ管理', 'コスト管理', 'リスク管理'],
    correct: 1,
    explanation: 'WBSはスコープ管理で使用され、プロジェクトの成果物を階層的に分解して、作業範囲を明確にする技法です。'
  },
  {
    question: 'ホワイトボックステストの網羅基準で、すべての命令を少なくとも1回実行する基準は？',
    options: ['C0（命令網羅）', 'C1（分岐網羅）', 'C2（条件網羅）', '複合条件網羅'],
    correct: 0,
    explanation: 'C0（命令網羅）は、プログラムのすべての命令を少なくとも1回実行することを目指す最も基本的な網羅基準です。'
  },
  {
    question: 'Gitはどのような種類のバージョン管理システムか？',
    options: ['集中型', '分散型', 'ローカル型', 'クラウド型'],
    correct: 1,
    explanation: 'Gitは分散型バージョン管理システムで、各開発者が完全なリポジトリのコピーを持ち、オフラインでも作業できます。'
  },
  {
    question: 'SOLID原則の「S」が表す原則は何か？',
    options: ['セキュア原則', 'シンプル原則', '単一責任の原則', 'ステート原則'],
    correct: 2,
    explanation: 'Single Responsibility Principle（単一責任の原則）は、クラスは単一の責任のみを持つべきという原則です。'
  },
  {
    question: 'MVCアーキテクチャのControllerの役割は何か？',
    options: ['データの永続化', 'ユーザーインターフェースの表示', 'ModelとViewの仲介', 'ビジネスロジックの実行'],
    correct: 2,
    explanation: 'ControllerはModelとViewの間を仲介し、ユーザーの入力を処理してModelを更新し、Viewに反映させます。'
  },
  {
    question: 'ISO/IEC 25010で定義される製品品質特性でないものは？',
    options: ['機能適合性', '性能効率性', 'プロジェクト管理性', '信頼性'],
    correct: 2,
    explanation: 'プロジェクト管理性はISO/IEC 25010の製品品質特性には含まれません。8つの主特性は機能適合性、性能効率性、互換性、使用性、信頼性、セキュリティ、保守性、移植性です。'
  },
  {
    question: 'PDCAサイクルのCは何を表すか？',
    options: ['Create（創造）', 'Check（評価）', 'Control（管理）', 'Collaborate（協働）'],
    correct: 1,
    explanation: 'PDCAサイクルのCはCheck（評価）で、実施した結果を測定・評価し、目標との差異を確認します。'
  },
  // Advanced SDLC Models
  {
    question: 'スパイラルモデルの特徴として最も適切なものはどれか？',
    options: ['リニアな開発プロセス', 'リスク分析を重視', '短期間での開発', 'ドキュメントを軽視'],
    correct: 1,
    explanation: 'スパイラルモデルは各反復でリスク分析を実施し、リスクを管理しながら段階的に開発を進める手法です。'
  },
  {
    question: 'RAD（Rapid Application Development）の主な特徴は何か？',
    options: ['詳細な計画を重視', '短期間での開発', '大規模なチーム編成', '厳格な品質管理'],
    correct: 1,
    explanation: 'RADは短期間でのアプリケーション開発を目的とし、プロトタイピングやツールの活用により迅速な開発を実現します。'
  },
  {
    question: 'DevOpsの主要な目的は何か？',
    options: ['開発コストの削減', '開発と運用の連携強化', 'セキュリティの向上', 'ドキュメント作成の効率化'],
    correct: 1,
    explanation: 'DevOpsは開発（Development）と運用（Operations）の連携を強化し、継続的なデリバリーを実現することを目的としています。'
  },
  {
    question: 'CI/CD（継続的インテグレーション/継続的デリバリー）の効果として適切でないものは？',
    options: ['品質の向上', 'リリース頻度の向上', '開発コストの大幅削減', 'フィードバックの早期取得'],
    correct: 2,
    explanation: 'CI/CDは品質向上、リリース頻度向上、早期フィードバックには効果的ですが、初期導入コストがかかるため開発コストの大幅削減は期待できません。'
  },
  {
    question: 'プロトタイプモデルの主な利点は何か？',
    options: ['開発期間の短縮', 'ユーザー要求の早期把握', '開発コストの削減', 'バグの完全な排除'],
    correct: 1,
    explanation: 'プロトタイプモデルでは早期に動作するモデルを作成することで、ユーザーの要求を具体的に把握し、要求の変更リスクを軽減できます。'
  },
  // Requirements Engineering
  {
    question: '機能要件の説明として最も適切なものはどれか？',
    options: ['システムの性能に関する要件', 'システムが実行すべき機能', 'システムの操作性に関する要件', 'システムの信頼性に関する要件'],
    correct: 1,
    explanation: '機能要件はシステムが提供すべき機能やサービスを定義する要件です。非機能要件は性能、操作性、信頼性などの品質要件を定義します。'
  },
  {
    question: '要件定義書に記載すべき内容として適切でないものはどれか？',
    options: ['機能要件', '非機能要件', '制約条件', '詳細設計仕様'],
    correct: 3,
    explanation: '要件定義書には機能要件、非機能要件、制約条件を記載しますが、詳細設計仕様は設計フェーズで作成される別の成果物です。'
  },
  {
    question: 'ユースケース図の目的として最も適切なものはどれか？',
    options: ['システムの内部構造を表現', 'ユーザーとシステムの相互作用を表現', 'データの流れを表現', 'クラス間の関係を表現'],
    correct: 1,
    explanation: 'ユースケース図はユーザー（アクター）とシステムとの相互作用を表現し、システムの機能要件を整理するために使用されます。'
  },
  {
    question: '要件の妥当性確認手法として適切でないものはどれか？',
    options: ['レビュー', 'プロトタイピング', 'テストケース作成', 'コーディング'],
    correct: 3,
    explanation: '要件の妥当性確認はレビュー、プロトタイピング、テストケース作成などで行います。コーディングは実装フェーズの作業です。'
  },
  {
    question: '要件変更管理で重要な要素として適切でないものはどれか？',
    options: ['変更の影響分析', '変更の承認プロセス', '変更履歴の管理', '開発者の個人的判断'],
    correct: 3,
    explanation: '要件変更管理では変更の影響分析、承認プロセス、履歴管理が重要です。開発者の個人的判断だけで変更することは適切ではありません。'
  },
  // System Design Methodologies
  {
    question: '構造化設計手法の特徴として最も適切なものはどれか？',
    options: ['オブジェクト指向', 'トップダウンアプローチ', '反復的開発', 'プロトタイピング'],
    correct: 1,
    explanation: '構造化設計手法はトップダウンアプローチで、機能を階層的に分解して設計を行う手法です。'
  },
  {
    question: 'オブジェクト指向設計の基本概念でないものはどれか？',
    options: ['カプセル化', '継承', '多態性', '正規化'],
    correct: 3,
    explanation: 'オブジェクト指向設計の基本概念はカプセル化、継承、多態性です。正規化はデータベース設計の概念です。'
  },
  {
    question: 'DDD（ドメイン駆動設計）の主要な概念として適切でないものはどれか？',
    options: ['ドメインモデル', 'ユビキタス言語', 'バウンデッドコンテキスト', 'データベーススキーマ'],
    correct: 3,
    explanation: 'DDDではドメインモデル、ユビキタス言語、バウンデッドコンテキストが主要概念です。データベーススキーマは技術的な実装詳細です。'
  },
  {
    question: 'サービス指向アーキテクチャ（SOA）の特徴として適切でないものはどれか？',
    options: ['サービスの再利用性', '疎結合', 'プラットフォーム独立性', 'モノリシック構造'],
    correct: 3,
    explanation: 'SOAはサービスの再利用性、疎結合、プラットフォーム独立性を特徴とします。モノリシック構造は対極の概念です。'
  },
  {
    question: 'コンポーネント指向開発の利点として最も適切なものはどれか？',
    options: ['開発期間の短縮', '再利用性の向上', 'メモリ使用量の削減', 'セキュリティの向上'],
    correct: 1,
    explanation: 'コンポーネント指向開発では、既存のコンポーネントを再利用することで開発効率が向上し、再利用性が高まります。'
  },
  // UML Diagrams
  {
    question: 'UMLのクラス図で表現される関係として適切でないものはどれか？',
    options: ['継承', '集約', '依存', '実行'],
    correct: 3,
    explanation: 'クラス図では継承、集約、依存などの静的な関係を表現します。実行は動的な概念で、シーケンス図などで表現されます。'
  },
  {
    question: 'シーケンス図の主な目的は何か？',
    options: ['クラス間の静的関係', 'オブジェクト間の時系列相互作用', 'システムの状態遷移', 'データの流れ'],
    correct: 1,
    explanation: 'シーケンス図はオブジェクト間のメッセージ交換を時系列で表現し、動的な相互作用を視覚化します。'
  },
  {
    question: '状態遷移図で使用される基本要素でないものはどれか？',
    options: ['状態', '遷移', 'イベント', 'クラス'],
    correct: 3,
    explanation: '状態遷移図は状態、遷移、イベントで構成されます。クラスはクラス図の要素です。'
  },
  {
    question: 'アクティビティ図の用途として最も適切なものはどれか？',
    options: ['クラス設計', 'ワークフローの表現', 'データベース設計', 'ネットワーク構成'],
    correct: 1,
    explanation: 'アクティビティ図は業務プロセスやアルゴリズムのワークフローを表現するために使用されます。'
  },
  {
    question: 'コンポーネント図で表現される内容として適切でないものはどれか？',
    options: ['コンポーネント間の依存関係', 'インターフェース', 'オブジェクトの状態', 'パッケージ構造'],
    correct: 2,
    explanation: 'コンポーネント図は物理的なコンポーネント間の関係を表現します。オブジェクトの状態は状態遷移図で表現されます。'
  },
  // Database Design
  {
    question: 'データベースの第1正規形の条件として正しいものはどれか？',
    options: ['主キーが存在する', '繰り返し項目がない', '部分関数従属がない', '推移関数従属がない'],
    correct: 1,
    explanation: '第1正規形では繰り返し項目（重複する列）がないことが条件です。部分関数従属の除去は第2正規形、推移関数従属の除去は第3正規形の条件です。'
  },
  {
    question: 'ERD（Entity Relationship Diagram）で表現されないものはどれか？',
    options: ['エンティティ', '属性', 'リレーションシップ', 'アルゴリズム'],
    correct: 3,
    explanation: 'ERDはエンティティ、属性、リレーションシップを表現します。アルゴリズムは処理手順であり、ERDでは表現されません。'
  },
  {
    question: 'データベース設計における非正規化の目的として最も適切なものはどれか？',
    options: ['データの一意性確保', '性能の向上', 'データ容量の削減', 'セキュリティの向上'],
    correct: 1,
    explanation: '非正規化は正規化されたテーブルを意図的に結合して、検索性能を向上させることを目的として行われます。'
  },
  {
    question: 'ACID特性のDが表す特性は何か？',
    options: ['Atomicity（原子性）', 'Consistency（一貫性）', 'Isolation（分離性）', 'Durability（永続性）'],
    correct: 3,
    explanation: 'ACID特性のDはDurability（永続性）で、コミットされたトランザクションの結果が永続的に保存されることを保証します。'
  },
  {
    question: 'データベースインデックスの主な目的は何か？',
    options: ['データの圧縮', '検索性能の向上', 'データの暗号化', 'バックアップの高速化'],
    correct: 1,
    explanation: 'インデックスはデータの検索性能を向上させるために作成される補助的なデータ構造です。'
  },
  // User Interface Design
  {
    question: 'ユーザビリティの5つの要素に含まれないものはどれか？',
    options: ['学習しやすさ', '効率性', '記憶しやすさ', '開発効率性'],
    correct: 3,
    explanation: 'ユーザビリティの5要素は学習しやすさ、効率性、記憶しやすさ、エラー回避性、満足度です。開発効率性は含まれません。'
  },
  {
    question: 'アクセシビリティ向上のための手法として適切でないものはどれか？',
    options: ['代替テキストの提供', 'キーボード操作対応', '音声読み上げ対応', '複雑なアニメーション多用'],
    correct: 3,
    explanation: 'アクセシビリティ向上には代替テキスト、キーボード操作、音声読み上げ対応が重要です。複雑なアニメーションは逆効果になる場合があります。'
  },
  {
    question: 'UIデザインの基本原則として適切でないものはどれか？',
    options: ['一貫性', '可視性', '複雑性', 'フィードバック'],
    correct: 2,
    explanation: 'UIデザインでは一貫性、可視性、フィードバックが重要な原則です。複雑性は避けるべき要素であり、シンプルさが求められます。'
  },
  {
    question: 'レスポンシブデザインの主な目的は何か？',
    options: ['デザインの美しさ向上', '様々なデバイスサイズへの対応', '開発コストの削減', 'セキュリティの強化'],
    correct: 1,
    explanation: 'レスポンシブデザインは、PC、タブレット、スマートフォンなど様々なデバイスサイズに自動的に適応するデザイン手法です。'
  },
  {
    question: 'ワイヤーフレームの主な目的は何か？',
    options: ['最終的なデザイン決定', 'レイアウトと機能の構造化', 'プログラミング仕様の詳細化', '色彩設計の確定'],
    correct: 1,
    explanation: 'ワイヤーフレームは色やデザイン要素を排除して、レイアウトと機能の構造を明確化することが主な目的です。'
  },
  // Software Testing Strategies
  {
    question: 'V字モデルにおけるテストレベルの順序として正しいものはどれか？',
    options: ['単体→結合→システム→受入', '受入→システム→結合→単体', '結合→単体→受入→システム', '単体→システム→結合→受入'],
    correct: 0,
    explanation: 'V字モデルでは、単体テスト、結合テスト、システムテスト、受入テストの順序で実施されます。'
  },
  {
    question: '境界値分析の目的として最も適切なものはどれか？',
    options: ['全ての条件を網羅', '境界付近のエラー検出', 'コードの構造分析', 'ユーザビリティ評価'],
    correct: 1,
    explanation: '境界値分析は、入力値の境界付近でエラーが発生しやすいという特性を利用したテスト技法です。'
  },
  {
    question: '同値分割法の説明として正しいものはどれか？',
    options: ['入力値を同じ結果になるグループに分割', '全ての入力値を個別にテスト', 'ランダムに入力値を選択', '最大値と最小値のみテスト'],
    correct: 0,
    explanation: '同値分割法は、同じ結果が期待される入力値をグループ（同値クラス）に分割し、各グループから代表値を選んでテストする手法です。'
  },
  {
    question: 'リグレッションテストの目的は何か？',
    options: ['新機能の動作確認', '修正による既存機能への影響確認', '性能の測定', 'セキュリティの検証'],
    correct: 1,
    explanation: 'リグレッションテスト（退行テスト）は、システムの変更が既存の機能に悪影響を与えていないことを確認するテストです。'
  },
  {
    question: 'ストレステストの主な目的は何か？',
    options: ['機能の正確性確認', 'システムの限界点把握', 'ユーザビリティ評価', 'セキュリティ脆弱性発見'],
    correct: 1,
    explanation: 'ストレステストは、システムに通常以上の負荷をかけて、システムの限界点や異常時の動作を確認するテストです。'
  },
  // Test Automation
  {
    question: 'テスト自動化の利点として適切でないものはどれか？',
    options: ['テスト実行時間の短縮', '人的ミスの削減', 'テスト設計工数の削減', '繰り返し実行の効率化'],
    correct: 2,
    explanation: 'テスト自動化は実行時間短縮、人的ミス削減、繰り返し実行の効率化には効果的ですが、テスト設計工数は削減されません。'
  },
  {
    question: '継続的インテグレーション（CI）でのテスト実行タイミングとして最も適切なものはどれか？',
    options: ['週1回定期実行', 'コード変更時の自動実行', '月末の手動実行', 'リリース前のみ実行'],
    correct: 1,
    explanation: 'CIでは、コードの変更やコミット時に自動的にテストを実行し、早期に問題を発見することが重要です。'
  },
  {
    question: 'テスト自動化ツールの選定基準として適切でないものはどれか？',
    options: ['対象技術への対応', '保守性', '初期コストの安さ', 'チームのスキルレベル'],
    correct: 2,
    explanation: 'テスト自動化ツールの選定では、対象技術への対応、保守性、チームスキルが重要です。初期コストだけでなくTCOを考慮する必要があります。'
  },
  {
    question: 'BDD（Behavior Driven Development）の特徴として最も適切なものはどれか？',
    options: ['技術仕様中心', 'ビジネス価値重視', 'コード品質重視', '開発速度重視'],
    correct: 1,
    explanation: 'BDDは、システムの振る舞いをビジネス価値の観点から記述し、ステークホルダー間の共通理解を促進する開発手法です。'
  },
  {
    question: 'テストデータ管理で重要な要素として適切でないものはどれか？',
    options: ['データの版数管理', 'プライバシー保護', 'データの再現性', 'データサイズの最大化'],
    correct: 3,
    explanation: 'テストデータ管理では版数管理、プライバシー保護、再現性が重要です。データサイズは必要最小限に抑えることが望ましいです。'
  },
  // Software Maintenance
  {
    question: 'ソフトウェア保守の分類として適切でないものはどれか？',
    options: ['修正保守', '適応保守', '完全保守', '予防保守'],
    correct: 2,
    explanation: 'ソフトウェア保守は修正保守、適応保守、完全化保守、予防保守に分類されます。「完全保守」という分類はありません。'
  },
  {
    question: 'レガシーシステムの課題として最も重要なものはどれか？',
    options: ['最新技術の採用', '保守コストの増大', 'ユーザビリティの向上', '機能の拡張'],
    correct: 1,
    explanation: 'レガシーシステムでは、古い技術や複雑な構造により保守コストが増大することが最も重要な課題です。'
  },
  {
    question: 'システム移行の方式として適切でないものはどれか？',
    options: ['一斉移行', '段階移行', '並行移行', '逆行移行'],
    correct: 3,
    explanation: 'システム移行方式には一斉移行、段階移行、並行移行があります。「逆行移行」という方式はありません。'
  },
  {
    question: 'ソフトウェアメトリクスとして適切でないものはどれか？',
    options: ['コード行数', 'サイクロマティック複雑度', '開発者の年収', 'バグ密度'],
    correct: 2,
    explanation: 'ソフトウェアメトリクスはコード行数、複雑度、バグ密度など、ソフトウェアの特性を定量化する指標です。開発者の年収は無関係です。'
  },
  {
    question: 'リファクタリングの主な目的は何か？',
    options: ['新機能の追加', 'バグの修正', 'コード品質の改善', '性能の向上'],
    correct: 2,
    explanation: 'リファクタリングは外部仕様を変更せずに、コードの内部構造を改善してコード品質を向上させることが主な目的です。'
  },
  // Configuration Management
  {
    question: '構成管理の要素として適切でないものはどれか？',
    options: ['構成識別', '構成統制', '構成状況報告', '構成監査'],
    correct: 3,
    explanation: '構成管理の4つの要素は構成識別、構成統制、構成状況報告、構成監査です。すべて適切な要素です。'
  },
  {
    question: 'ベースラインの説明として正しいものはどれか？',
    options: ['最新版のソースコード', '正式に承認された構成', '開発中の中間成果物', 'バックアップファイル'],
    correct: 1,
    explanation: 'ベースラインは正式に承認され、今後の作業の基準となる構成項目の集合です。'
  },
  {
    question: 'ブランチ戦略のGit Flowにおけるdevelopブランチの役割は何か？',
    options: ['本番環境のコード管理', '開発中の統合', 'リリース用の準備', 'ホットフィックス対応'],
    correct: 1,
    explanation: 'Git Flowのdevelopブランチは開発中の機能を統合するためのブランチで、次回リリース予定の機能が統合されます。'
  },
  {
    question: '変更管理プロセスで最初に実施すべきことは何か？',
    options: ['変更の実装', '変更の影響分析', '変更の承認', '変更の通知'],
    correct: 1,
    explanation: '変更管理では、まず変更による影響を分析し、その結果に基づいて承認可否を判断します。'
  },
  {
    question: 'タグ管理の目的として最も適切なものはどれか？',
    options: ['開発効率の向上', '特定時点の状態保存', 'ストレージ容量の削減', 'セキュリティの強化'],
    correct: 1,
    explanation: 'タグ管理はリリース時点など、特定の重要な時点でのソースコードの状態を保存し、後で参照できるようにすることが目的です。'
  },
  // Risk Management
  {
    question: 'プロジェクトリスクの対応戦略として適切でないものはどれか？',
    options: ['回避', '軽減', '転嫁', '放置'],
    correct: 3,
    explanation: 'リスク対応戦略には回避、軽減、転嫁、受容があります。「放置」は適切な戦略ではありません。'
  },
  {
    question: 'リスクアセスメントの要素として正しいものはどれか？',
    options: ['発生確率と影響度', '時間と人員', 'コストと品質', '機能と性能'],
    correct: 0,
    explanation: 'リスクアセスメントでは、リスクの発生確率と発生時の影響度を評価してリスクレベルを決定します。'
  },
  {
    question: 'プロジェクトリスクの例として適切でないものはどれか？',
    options: ['要件変更', 'キーマンの離脱', '技術的困難', '売上目標の達成'],
    correct: 3,
    explanation: '要件変更、キーマンの離脱、技術的困難はプロジェクトリスクの例です。売上目標の達成はビジネスリスクであり、プロジェクトリスクではありません。'
  },
  {
    question: 'リスク監視の目的として最も適切なものはどれか？',
    options: ['新しいリスクの特定', 'プロジェクト進捗の確認', '品質の保証', 'コストの削減'],
    correct: 0,
    explanation: 'リスク監視の主な目的は、既知のリスクの状況を監視し、新しいリスクを早期に特定することです。'
  },
  {
    question: '残存リスクの説明として正しいものはどれか？',
    options: ['完全に除去されたリスク', '対応後も残るリスク', '新たに発見されたリスク', '影響度の高いリスク'],
    correct: 1,
    explanation: '残存リスクは、リスク対応策を実施した後でも残るリスクのことです。'
  },
  // Quality Assurance
  {
    question: '品質保証（QA）と品質管理（QC）の違いとして正しいものはどれか？',
    options: ['QAは事後確認、QCは事前予防', 'QAは事前予防、QCは事後確認', 'QAとQCは同じ意味', 'QAは開発、QCは運用'],
    correct: 1,
    explanation: 'QA（Quality Assurance）は品質を確保するための事前の予防活動、QC（Quality Control）は品質を確認するための事後の検査活動です。'
  },
  {
    question: 'レビューの種類として適切でないものはどれか？',
    options: ['インスペクション', 'ウォークスルー', 'ペアプログラミング', 'コンパイル'],
    correct: 3,
    explanation: 'レビューの種類にはインスペクション、ウォークスルー、ペアプログラミングなどがあります。コンパイルはレビュー手法ではありません。'
  },
  {
    question: 'コードレビューの効果として適切でないものはどれか？',
    options: ['バグの早期発見', '知識の共有', 'コーディング規約の統一', '開発速度の大幅向上'],
    correct: 3,
    explanation: 'コードレビューはバグの早期発見、知識共有、規約統一に効果的ですが、一時的に開発速度は低下する場合があります。'
  },
  {
    question: 'プロセス改善手法として適切でないものはどれか？',
    options: ['CMMI', 'ISO 9001', 'SPICE', 'SQL'],
    correct: 3,
    explanation: 'CMMI、ISO 9001、SPICEはプロセス改善のフレームワークです。SQLはデータベース操作言語であり、プロセス改善手法ではありません。'
  },
  {
    question: '品質メトリクスとして適切でないものはどれか？',
    options: ['欠陥密度', 'テストカバレッジ', '顧客満足度', '開発者の出身大学'],
    correct: 3,
    explanation: '品質メトリクスには欠陥密度、テストカバレッジ、顧客満足度などがあります。開発者の出身大学は品質と関係ありません。'
  },
  // Software Metrics
  {
    question: 'LOC（Lines of Code）メトリクスの問題点として適切でないものはどれか？',
    options: ['言語依存性', '品質との相関不明', '保守性の評価困難', '測定の困難さ'],
    correct: 3,
    explanation: 'LOCは言語依存性があり、品質や保守性との相関が不明確ですが、測定自体は比較的容易です。'
  },
  {
    question: 'ファンクションポイント法の主な用途は何か？',
    options: ['コードの複雑度測定', 'ソフトウェア規模の見積もり', 'バグの検出', '性能の評価'],
    correct: 1,
    explanation: 'ファンクションポイント法は、ソフトウェアの機能的な複雑さからソフトウェア規模を見積もる手法です。'
  },
  {
    question: 'サイクロマティック複雑度が示すものは何か？',
    options: ['メモリ使用量', 'プログラムの複雑さ', '実行速度', 'コードサイズ'],
    correct: 1,
    explanation: 'サイクロマティック複雑度は、プログラムの制御構造の複雑さを表す指標です。'
  },
  {
    question: 'メトリクス収集の目的として適切でないものはどれか？',
    options: ['プロセス改善', '品質向上', '進捗管理', '個人評価のみ'],
    correct: 3,
    explanation: 'メトリクス収集はプロセス改善、品質向上、進捗管理が目的です。個人評価のみを目的とすることは適切ではありません。'
  },
  {
    question: 'GQM（Goal-Question-Metric）アプローチの説明として正しいものはどれか？',
    options: ['ゴールから逆算してメトリクスを定義', 'メトリクスからゴールを設定', 'ランダムにメトリクスを選択', '業界標準のメトリクスを使用'],
    correct: 0,
    explanation: 'GQMアプローチは、まずゴール（目標）を設定し、それを達成するための質問を考え、最後に適切なメトリクスを定義する手法です。'
  },
  // Object-Oriented Analysis and Design
  {
    question: 'オブジェクト指向分析で重要な概念として適切でないものはどれか？',
    options: ['責任駆動設計', 'CRCカード', 'データフロー図', 'ドメインモデル'],
    correct: 2,
    explanation: 'オブジェクト指向分析では責任駆動設計、CRCカード、ドメインモデルが重要です。データフロー図は構造化分析の手法です。'
  },
  {
    question: 'デザインパターンの利点として適切でないものはどれか？',
    options: ['設計の再利用', '保守性の向上', 'コミュニケーションの改善', '実行速度の向上'],
    correct: 3,
    explanation: 'デザインパターンは設計の再利用、保守性向上、コミュニケーション改善に効果的ですが、実行速度の向上が目的ではありません。'
  },
  {
    question: 'Singletonパターンの用途として最も適切なものはどれか？',
    options: ['複数のインスタンスが必要な場合', 'インスタンスを1つに制限したい場合', 'オブジェクトの生成を隠したい場合', 'インターフェースを統一したい場合'],
    correct: 1,
    explanation: 'Singletonパターンは、クラスのインスタンスを1つに制限し、グローバルなアクセスポイントを提供するパターンです。'
  },
  {
    question: 'Facadeパターンの目的は何か？',
    options: ['オブジェクトの生成', '複雑なサブシステムの簡略化', 'オブジェクトの状態管理', 'メソッドの動的追加'],
    correct: 1,
    explanation: 'Facadeパターンは、複雑なサブシステムに対して統一された簡単なインターフェースを提供するパターンです。'
  },
  {
    question: 'Observerパターンの特徴として正しいものはどれか？',
    options: ['1対1の関係', '1対多の関係', '多対多の関係', '関係性なし'],
    correct: 1,
    explanation: 'Observerパターンは、1つのオブジェクト（Subject）の状態変化を複数のオブジェクト（Observer）に通知する1対多の関係を実現します。'
  },
  // Component-Based Development
  {
    question: 'コンポーネントベース開発の特徴として適切でないものはどれか？',
    options: ['再利用性', '独立性', '交換可能性', '密結合'],
    correct: 3,
    explanation: 'コンポーネントベース開発では再利用性、独立性、交換可能性が重要な特徴です。密結合は避けるべき特徴です。'
  },
  {
    question: 'コンポーネントインターフェースの設計で重要な原則は何か？',
    options: ['実装の詳細を公開', 'インターフェースの最小化', '内部状態の共有', 'グローバル変数の使用'],
    correct: 1,
    explanation: 'コンポーネントインターフェースは必要最小限にし、実装の詳細は隠蔽することが重要です。'
  },
  {
    question: 'CBSE（Component-Based Software Engineering）の利点として適切でないものはどれか？',
    options: ['開発期間の短縮', '品質の向上', '初期開発コストの削減', '保守の容易さ'],
    correct: 2,
    explanation: 'CBSEは開発期間短縮、品質向上、保守の容易さの利点がありますが、コンポーネント設計の初期コストは高くなる場合があります。'
  },
  {
    question: 'コンポーネントの粒度決定で考慮すべき要素として適切でないものはどれか？',
    options: ['再利用性', '保守性', '開発者の好み', '性能要件'],
    correct: 2,
    explanation: 'コンポーネントの粒度は再利用性、保守性、性能要件を考慮して決定します。開発者の個人的な好みは適切な判断基準ではありません。'
  },
  {
    question: 'コンポーネント統合時の課題として適切でないものはどれか？',
    options: ['インターフェース不整合', 'バージョン管理', '依存関係の複雑化', '開発言語の統一'],
    correct: 3,
    explanation: 'コンポーネント統合ではインターフェース不整合、バージョン管理、依存関係が課題です。異なる言語で開発されたコンポーネントの統合も可能です。'
  },
  // Web Application Development
  {
    question: 'RESTfulAPIの設計原則として適切でないものはどれか？',
    options: ['ステートレス', '統一インターフェース', 'キャッシュ可能', 'セッション管理必須'],
    correct: 3,
    explanation: 'RESTはステートレス、統一インターフェース、キャッシュ可能などが原則です。セッション管理は必須ではなく、ステートレスに反します。'
  },
  {
    question: 'SPAアプリケーションの特徴として適切でないものはどれか？',
    options: ['ページ遷移時のリロードなし', 'クライアント側でのルーティング', 'SEO対策が容易', 'レスポンシブな操作感'],
    correct: 2,
    explanation: 'SPAはページリロードなし、クライアント側ルーティング、レスポンシブな操作感が特徴ですが、SEO対策は困難です。'
  },
  {
    question: 'Webアプリケーションのセキュリティ対策として適切でないものはどれか？',
    options: ['XSS対策', 'SQL注入対策', 'CSRF対策', 'パスワードの平文保存'],
    correct: 3,
    explanation: 'XSS、SQL注入、CSRF対策は重要なセキュリティ対策です。パスワードの平文保存は重大なセキュリティ問題です。'
  },
  {
    question: 'HTTP/2の特徴として適切でないものはどれか？',
    options: ['多重化', 'ヘッダー圧縮', 'サーバープッシュ', 'テキストベースプロトコル'],
    correct: 3,
    explanation: 'HTTP/2は多重化、ヘッダー圧縮、サーバープッシュが特徴です。HTTP/2はバイナリベースプロトコルで、HTTP/1.1のテキストベースから変更されました。'
  },
  {
    question: 'Webアプリケーションの性能向上手法として適切でないものはどれか？',
    options: ['CDNの活用', 'キャッシュの利用', '画像の最適化', 'データベースの非正規化のみ'],
    correct: 3,
    explanation: 'CDN、キャッシュ、画像最適化は有効な性能向上手法です。データベースの非正規化は場合によっては有効ですが、「のみ」に依存するのは適切ではありません。'
  },
  // Mobile Application Development
  {
    question: 'ネイティブアプリ開発の利点として適切でないものはどれか？',
    options: ['高いパフォーマンス', 'プラットフォーム固有機能への完全アクセス', 'クロスプラットフォーム対応', 'オフライン動作'],
    correct: 2,
    explanation: 'ネイティブアプリは高パフォーマンス、プラットフォーム機能への完全アクセス、オフライン動作が利点ですが、クロスプラットフォーム対応は困難です。'
  },
  {
    question: 'ハイブリッドアプリ開発の特徴として正しいものはどれか？',
    options: ['完全なネイティブコード', 'WebView内でのHTML/CSS/JavaScript実行', 'プラットフォーム固有言語必須', 'アプリストア配信不可'],
    correct: 1,
    explanation: 'ハイブリッドアプリはWebView内でHTML/CSS/JavaScriptを実行し、ネイティブアプリのように配信できます。'
  },
  {
    question: 'レスポンシブWebデザインの利点として適切でないものはどれか？',
    options: ['複数デバイス対応', 'メンテナンス効率', 'ネイティブ機能へのフルアクセス', '一つのコードベース'],
    correct: 2,
    explanation: 'レスポンシブWebデザインは複数デバイス対応、メンテナンス効率、一つのコードベースが利点ですが、ネイティブ機能への完全アクセスはできません。'
  },
  {
    question: 'モバイルアプリのUX設計で重要な要素として適切でないものはどれか？',
    options: ['タッチ操作対応', 'バッテリー消費考慮', '画面サイズ最適化', '複雑なナビゲーション'],
    correct: 3,
    explanation: 'モバイルアプリではタッチ操作対応、バッテリー消費考慮、画面サイズ最適化が重要です。複雑なナビゲーションは避けるべきです。'
  },
  {
    question: 'PWA（Progressive Web Apps）の特徴として適切でないものはどれか？',
    options: ['オフライン動作', 'プッシュ通知', 'アプリストア必須', 'ホーム画面追加'],
    correct: 2,
    explanation: 'PWAはオフライン動作、プッシュ通知、ホーム画面追加が可能です。アプリストアを経由せずに配信できることが特徴の一つです。'
  },
  // API Design and Integration
  {
    question: 'API設計におけるベストプラクティスとして適切でないものはどれか？',
    options: ['一貫した命名規則', '適切なHTTPステータスコード', 'バージョニング戦略', '認証なしでの公開'],
    correct: 3,
    explanation: 'API設計では一貫した命名規則、適切なHTTPステータスコード、バージョニング戦略が重要です。認証なしでの公開はセキュリティリスクです。'
  },
  {
    question: 'GraphQLの特徴として適切でないものはどれか？',
    options: ['必要なデータのみ取得', '単一エンドポイント', '強い型システム', 'RESTとの完全互換性'],
    correct: 3,
    explanation: 'GraphQLは必要なデータのみ取得、単一エンドポイント、強い型システムが特徴ですが、RESTとは異なるアプローチで互換性はありません。'
  },
  {
    question: 'APIレート制限の目的として適切でないものはどれか？',
    options: ['サーバー負荷の制御', '悪用の防止', 'サービス品質の維持', 'API利用の完全阻止'],
    correct: 3,
    explanation: 'APIレート制限はサーバー負荷制御、悪用防止、サービス品質維持が目的です。API利用の完全阻止が目的ではありません。'
  },
  {
    question: 'OAuth 2.0の主な目的は何か？',
    options: ['データの暗号化', '認可の仕組み提供', 'データベースアクセス', 'ファイル転送'],
    correct: 1,
    explanation: 'OAuth 2.0は、リソースへのアクセス認可を安全に行うためのフレームワークです。'
  },
  {
    question: 'API文書化で重要な要素として適切でないものはどれか？',
    options: ['エンドポイント仕様', 'リクエスト/レスポンス例', 'エラーコード説明', '開発者の個人情報'],
    correct: 3,
    explanation: 'API文書化ではエンドポイント仕様、リクエスト/レスポンス例、エラーコード説明が重要です。開発者の個人情報は不要です。'
  },
  // Performance Optimization
  {
    question: 'アプリケーション性能最適化の手法として適切でないものはどれか？',
    options: ['キャッシュの活用', 'データベースインデックス', 'コードの並列化', 'メモリリークの放置'],
    correct: 3,
    explanation: 'キャッシュ活用、データベースインデックス、コード並列化は性能最適化手法です。メモリリークの放置は性能悪化の原因です。'
  },
  {
    question: 'データベース性能向上のための手法として適切でないものはどれか？',
    options: ['適切なインデックス作成', 'クエリの最適化', 'パーティショニング', '全テーブルのフルスキャン'],
    correct: 3,
    explanation: 'インデックス作成、クエリ最適化、パーティショニングは性能向上手法です。フルスキャンは性能悪化の原因です。'
  },
  {
    question: 'Webアプリケーションの表示速度向上手法として適切でないものはどれか？',
    options: ['画像圧縮', 'JavaScriptの最小化', 'CSSの最適化', '大量の外部ライブラリ読み込み'],
    correct: 3,
    explanation: '画像圧縮、JavaScript最小化、CSS最適化は表示速度向上に効果的です。大量の外部ライブラリ読み込みは速度低下の原因です。'
  },
  {
    question: 'メモリ使用量最適化の手法として適切でないものはどれか？',
    options: ['不要なオブジェクトの削除', 'メモリプールの活用', 'ガベージコレクション調整', 'メモリリークの意図的作成'],
    correct: 3,
    explanation: '不要なオブジェクト削除、メモリプール活用、GC調整は最適化手法です。メモリリークの意図的作成は問題の原因です。'
  },
  {
    question: '負荷分散の手法として適切でないものはどれか？',
    options: ['ロードバランサーの使用', '水平スケーリング', 'キャッシュサーバーの配置', '単一サーバーへの集中'],
    correct: 3,
    explanation: 'ロードバランサー、水平スケーリング、キャッシュサーバーは負荷分散手法です。単一サーバーへの集中は負荷分散に反します。'
  },
  // Security in Software Development
  {
    question: 'セキュアコーディングの原則として適切でないものはどれか？',
    options: ['入力値の検証', '最小権限の原則', 'セキュリティの透明化', 'パスワードの平文保存'],
    correct: 3,
    explanation: '入力値検証、最小権限の原則、セキュリティの透明化（多層防御）はセキュアコーディングの原則です。パスワード平文保存は危険です。'
  },
  {
    question: 'SQLインジェクション対策として最も効果的なものはどれか？',
    options: ['入力値の文字列結合', 'プリペアドステートメント', 'パスワードの複雑化', 'サーバーの物理的保護'],
    correct: 1,
    explanation: 'SQLインジェクション対策にはプリペアドステートメント（パラメータ化クエリ）が最も効果的です。'
  },
  {
    question: 'XSS（Cross-Site Scripting）対策として適切でないものはどれか？',
    options: ['入力値のサニタイズ', '出力時のエスケープ', 'CSPの設定', 'SQLインジェクション対策'],
    correct: 3,
    explanation: 'XSS対策には入力値サニタイズ、出力エスケープ、CSP設定が有効です。SQLインジェクション対策は別の脆弱性への対策です。'
  },
  {
    question: 'CSRF（Cross-Site Request Forgery）対策として適切でないものはどれか？',
    options: ['CSRFトークンの使用', 'Referrerヘッダーの確認', 'SameSite Cookieの設定', 'パスワードの定期変更'],
    correct: 3,
    explanation: 'CSRF対策にはCSRFトークン、Referrerヘッダー確認、SameSite Cookie設定が有効です。パスワード定期変更は直接的な対策ではありません。'
  },
  {
    question: 'セキュリティテストの種類として適切でないものはどれか？',
    options: ['脆弱性スキャン', 'ペネトレーションテスト', 'セキュリティコードレビュー', '機能テスト'],
    correct: 3,
    explanation: '脆弱性スキャン、ペネトレーションテスト、セキュリティコードレビューはセキュリティテストです。機能テストは別の観点のテストです。'
  },
  // Documentation and Standards
  {
    question: 'ソフトウェア文書の種類として適切でないものはどれか？',
    options: ['要件定義書', '設計書', 'テスト仕様書', '売上報告書'],
    correct: 3,
    explanation: '要件定義書、設計書、テスト仕様書はソフトウェア文書です。売上報告書はビジネス文書であり、ソフトウェア文書ではありません。'
  },
  {
    question: '技術文書作成の原則として適切でないものはどれか？',
    options: ['明確性', '簡潔性', '一貫性', '曖昧性'],
    correct: 3,
    explanation: '技術文書では明確性、簡潔性、一貫性が重要です。曖昧性は避けるべき要素です。'
  },
  {
    question: 'ドキュメント管理で重要な要素として適切でないものはどれか？',
    options: ['版数管理', 'アクセス制御', '変更履歴', '装飾の豪華さ'],
    correct: 3,
    explanation: 'ドキュメント管理では版数管理、アクセス制御、変更履歴が重要です。装飾の豪華さは本質的ではありません。'
  },
  {
    question: 'API文書の自動生成ツールとして適切でないものはどれか？',
    options: ['Swagger', 'OpenAPI', 'JSDoc', 'Photoshop'],
    correct: 3,
    explanation: 'Swagger、OpenAPI、JSDocはAPI文書生成ツールです。Photoshopは画像編集ソフトで文書生成ツールではありません。'
  },
  {
    question: '国際標準規格として適切でないものはどれか？',
    options: ['ISO/IEC 25010', 'IEEE 830', 'ISO 9001', '会社独自の規格'],
    correct: 3,
    explanation: 'ISO/IEC 25010、IEEE 830、ISO 9001は国際標準規格です。会社独自の規格は国際標準ではありません。'
  },
  // Team Collaboration
  {
    question: 'チーム開発での課題として適切でないものはどれか？',
    options: ['コミュニケーション不足', 'コードの統一性', '進捗の可視化', '個人の専門性向上'],
    correct: 3,
    explanation: 'コミュニケーション不足、コード統一性、進捗可視化はチーム開発の課題です。個人の専門性向上は課題ではなく目標です。'
  },
  {
    question: 'ペアプログラミングの効果として適切でないものはどれか？',
    options: ['知識の共有', 'コード品質向上', 'バグの早期発見', '開発速度の倍増'],
    correct: 3,
    explanation: 'ペアプログラミングは知識共有、品質向上、バグ早期発見に効果的ですが、開発速度が倍増するわけではありません。'
  },
  {
    question: 'チームワークを向上させる手法として適切でないものはどれか？',
    options: ['定期的なミーティング', 'コードレビュー', '知識の文書化', '情報の隠蔽'],
    correct: 3,
    explanation: '定期ミーティング、コードレビュー、知識文書化はチームワーク向上に効果的です。情報隠蔽は逆効果です。'
  },
  {
    question: '分散チーム開発での課題として適切でないものはどれか？',
    options: ['時差の問題', 'コミュニケーション手段', '文化的違い', '対面での打ち合わせの増加'],
    correct: 3,
    explanation: '分散チーム開発では時差、コミュニケーション手段、文化的違いが課題です。対面打ち合わせは分散チームでは困難です。'
  },
  {
    question: 'チーム内でのナレッジシェアの手法として適切でないものはどれか？',
    options: ['勉強会の開催', 'Wiki の活用', 'コードレビュー', '情報の独占'],
    correct: 3,
    explanation: '勉強会、Wiki活用、コードレビューはナレッジシェアの手法です。情報独占はナレッジシェアに反します。'
  },
  // Vendor Management
  {
    question: 'ベンダー選定の評価基準として適切でないものはどれか？',
    options: ['技術力', '実績', 'コスト', '営業担当者の外見'],
    correct: 3,
    explanation: 'ベンダー選定では技術力、実績、コストが重要な評価基準です。営業担当者の外見は適切な評価基準ではありません。'
  },
  {
    question: 'SLA（Service Level Agreement）に含まれる項目として適切でないものはどれか？',
    options: ['サービス稼働時間', 'レスポンス時間', '障害復旧時間', 'ベンダーの売上目標'],
    correct: 3,
    explanation: 'SLAにはサービス稼働時間、レスポンス時間、障害復旧時間などが含まれます。ベンダーの売上目標は含まれません。'
  },
  {
    question: 'オフショア開発の課題として適切でないものはどれか？',
    options: ['言語の壁', '時差の問題', '文化的違い', '開発コストの増大'],
    correct: 3,
    explanation: 'オフショア開発では言語の壁、時差、文化的違いが課題です。開発コストの削減が目的の一つであり、増大は課題です。'
  },
  {
    question: 'ベンダー管理で重要な要素として適切でないものはどれか？',
    options: ['契約管理', '品質管理', '進捗管理', '競合他社の機密情報収集'],
    correct: 3,
    explanation: 'ベンダー管理では契約、品質、進捗の管理が重要です。競合他社の機密情報収集は倫理的に問題があります。'
  },
  {
    question: 'アウトソーシングのリスクとして適切でないものはどれか？',
    options: ['情報漏洩', '品質低下', '依存度の増大', '社内技術力の向上'],
    correct: 3,
    explanation: 'アウトソーシングのリスクには情報漏洩、品質低下、依存度増大があります。社内技術力の向上はリスクではありません。'
  },
  // Software Licensing
  {
    question: 'オープンソースライセンスの特徴として適切でないものはどれか？',
    options: ['ソースコードの公開', '自由な利用', '無償提供', '商用利用の完全禁止'],
    correct: 3,
    explanation: 'オープンソースライセンスはソースコード公開、自由な利用、無償提供が特徴です。多くは商用利用も認めています。'
  },
  {
    question: 'GPLライセンスの特徴として正しいものはどれか？',
    options: ['コピーレフト', '商用利用禁止', 'ソースコード非公開', 'ライセンス料必須'],
    correct: 0,
    explanation: 'GPLライセンスはコピーレフト（派生作品も同じライセンスで公開）が特徴です。商用利用は可能です。'
  },
  {
    question: 'プロプライエタリソフトウェアの特徴として適切でないものはどれか？',
    options: ['ソースコード非公開', 'ライセンス料', '利用制限', 'ソースコードの自由改変'],
    correct: 3,
    explanation: 'プロプライエタリソフトウェアはソースコード非公開、ライセンス料、利用制限が特徴です。ソースコードの自由改変はできません。'
  },
  {
    question: 'ソフトウェア特許の保護対象として適切でないものはどれか？',
    options: ['アルゴリズム', 'ビジネスモデル', 'ユーザーインターフェース', '数学的公式'],
    correct: 3,
    explanation: 'ソフトウェア特許ではアルゴリズム、ビジネスモデル、UIなどが保護対象となりえます。数学的公式自体は特許対象外です。'
  },
  {
    question: 'ライセンス違反のリスクとして適切でないものはどれか？',
    options: ['法的責任', '損害賠償', '信用失墜', '技術力の向上'],
    correct: 3,
    explanation: 'ライセンス違反のリスクには法的責任、損害賠償、信用失墜があります。技術力の向上はリスクではありません。'
  },
  // Emerging Technologies
  {
    question: 'クラウドコンピューティングのサービスモデルとして適切でないものはどれか？',
    options: ['IaaS', 'PaaS', 'SaaS', 'DaaS'],
    correct: 3,
    explanation: 'クラウドのサービスモデルはIaaS、PaaS、SaaSです。DaaSはDesktop as a Serviceで、一般的な分類ではありません。'
  },
  {
    question: 'AIを活用したソフトウェア開発の例として適切でないものはどれか？',
    options: ['コード自動生成', 'バグ検出', 'テストケース生成', '人間の完全な代替'],
    correct: 3,
    explanation: 'AIはコード自動生成、バグ検出、テストケース生成に活用できますが、人間の完全な代替は現実的ではありません。'
  },
  {
    question: 'IoTシステム開発での考慮事項として適切でないものはどれか？',
    options: ['セキュリティ', '電力消費', 'ネットワーク通信', 'デスクトップUI'],
    correct: 3,
    explanation: 'IoTシステムではセキュリティ、電力消費、ネットワーク通信が重要です。デスクトップUIは一般的に不要です。'
  },
  {
    question: 'ブロックチェーン技術の特徴として適切でないものはどれか？',
    options: ['分散型', '改ざん困難', '透明性', '中央集権制'],
    correct: 3,
    explanation: 'ブロックチェーンは分散型、改ざん困難、透明性が特徴です。中央集権制は対極の概念です。'
  },
  {
    question: 'マイクロサービスアーキテクチャの利点として適切でないものはどれか？',
    options: ['独立したデプロイ', '技術スタックの柔軟性', 'スケーラビリティ', 'システムの単純化'],
    correct: 3,
    explanation: 'マイクロサービスは独立デプロイ、技術柔軟性、スケーラビリティが利点ですが、システム全体は複雑になります。'
  }
];

export default function SystemDevelopmentModule() {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizData.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<boolean[]>(new Array(quizData.length).fill(false));

  const { progress, saveProgress } = useLearningProgress('system-development');

  useEffect(() => {
    if (progress.length > 0) {
      console.log('📚 System Development progress loaded:', progress.length, 'items');
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
      const quizKey = `system-development-quiz-${currentQuizIndex}`;

      try {
        saveProgress(quizKey, true, isCorrect);
        console.log('✅ System Development progress saved:', { quiz: currentQuizIndex, correct: isCorrect });
      } catch (error) {
        console.error('❌ Failed to save system development progress:', error);
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
              <h2 className="text-3xl font-bold text-gray-800 mb-2">システム開発 完了！</h2>
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">システム開発</h1>
          <p className="text-gray-600 mb-4">システム開発の基礎から実践まで体系的に学習します</p>
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