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
    question: 'データベースの3層スキーマ構造で、実際にデータが格納される層は？',
    options: ['外部スキーマ', '概念スキーマ', '内部スキーマ', '論理スキーマ'],
    correct: 2,
    explanation: '内部スキーマは物理的なデータの格納方法を定義し、実際にデータが格納される層です。'
  },
  {
    question: '関係データベースにおいて、主キーの制約として正しいものは？',
    options: ['重複可能、NULL可能', '重複不可、NULL可能', '重複可能、NULL不可', '重複不可、NULL不可'],
    correct: 3,
    explanation: '主キーは一意性制約と非NULL制約の両方を持ち、重複不可でNULL値も許可されません。'
  },
  {
    question: 'SQLのJOIN操作で、両テーブルの一致する行のみを取得するのは？',
    options: ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL OUTER JOIN'],
    correct: 2,
    explanation: 'INNER JOINは両テーブルで結合条件に一致する行のみを取得します。'
  },
  {
    question: 'データベースの正規化で、第1正規形の条件は？',
    options: ['部分関数従属の除去', '完全関数従属のみ', '原子値のみ格納', '推移関数従属の除去'],
    correct: 2,
    explanation: '第1正規形（1NF）は、各属性が原子値（分割不可能な値）のみを持つことが条件です。'
  },
  {
    question: 'トランザクションのACID特性のうち、「一貫性」を表すのは？',
    options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
    correct: 1,
    explanation: 'Consistencyは一貫性を表し、トランザクション実行前後でデータの整合性が保たれることを意味します。'
  },
  {
    question: 'SQLのGROUP BY句と組み合わせて使用される集約関数でないものは？',
    options: ['COUNT', 'SUM', 'SUBSTRING', 'AVG'],
    correct: 2,
    explanation: 'SUBSTRINGは文字列を切り出す関数で、集約関数ではありません。'
  },
  {
    question: 'データベースのインデックスの主な目的は？',
    options: ['データの暗号化', '検索性能の向上', 'データの圧縮', 'バックアップの高速化'],
    correct: 1,
    explanation: 'インデックスは検索性能を向上させるためのデータ構造です。'
  },
  {
    question: 'ビューの利点として適切でないものは？',
    options: ['セキュリティの向上', 'データの論理的独立性', 'ストレージ容量の削減', 'データアクセスの簡素化'],
    correct: 2,
    explanation: 'ビューは仮想的なテーブルであり、実際のデータは基となるテーブルに格納されるため、ストレージ容量は削減されません。'
  },
  {
    question: 'SQLのWHERE句で使用できない集約関数を使用する場合は？',
    options: ['ORDER BY句', 'GROUP BY句', 'HAVING句', 'SELECT句'],
    correct: 2,
    explanation: 'HAVING句は集約関数を使った条件指定に使用され、WHERE句では集約関数は使用できません。'
  },
  {
    question: 'データベースの同期制御で、デッドロックを防ぐ方法として適切でないものは？',
    options: ['タイムアウト設定', 'ロック順序の統一', 'ロック時間の延長', '2相ロック'],
    correct: 2,
    explanation: 'ロック時間の延長はデッドロックの解決ではなく、むしろ発生確率を高める可能性があります。'
  },
  {
    question: 'NoSQLデータベースの特徴として正しいものは？',
    options: ['ACID特性を厳密に保証', 'スキーマレス設計', 'SQL言語の使用', '正規化が必須'],
    correct: 1,
    explanation: 'NoSQLデータベースの多くはスキーマレス設計を採用し、固定的なスキーマを必要としません。'
  },
  {
    question: 'データベースのバックアップ方式で、差分バックアップの特徴は？',
    options: ['全データを毎回保存', '前回の完全バックアップからの変更分のみ', '前回のバックアップからの変更分のみ', 'ログファイルのみ保存'],
    correct: 1,
    explanation: '差分バックアップは前回の完全バックアップ以降に変更されたデータのみを保存します。'
  },
  {
    question: 'データマイニングの手法でないものは？',
    options: ['クラスタリング', '分類', 'データクレンジング', '相関ルール'],
    correct: 2,
    explanation: 'データクレンジングはデータの品質向上を目的とした前処理で、データマイニング手法ではありません。'
  },
  {
    question: 'SQLのサブクエリで、外部クエリの値を参照するものは？',
    options: ['非相関サブクエリ', '相関サブクエリ', 'EXISTS句', 'IN句'],
    correct: 1,
    explanation: '相関サブクエリは外部クエリの列値を参照して実行されるサブクエリです。'
  },
  {
    question: 'データベースの並行制御で、読み取り専用トランザクションでも取得するロックは？',
    options: ['共有ロック', '排他ロック', '更新ロック', 'スキーマロック'],
    correct: 0,
    explanation: '読み取り専用トランザクションは共有ロック（Sロック）を取得し、他の読み取りは許可しますが書き込みはブロックします。'
  },
  {
    question: 'データウェアハウスの特徴として適切でないものは？',
    options: ['主にOLAP用途', '時系列データの保持', 'リアルタイム更新', '大容量データの格納'],
    correct: 2,
    explanation: 'データウェアハウスは分析用途に最適化されており、リアルタイム更新よりもバッチ処理による定期更新が一般的です。'
  },
  {
    question: 'データベースの整合性制約で、参照整合性を保つための制約は？',
    options: ['CHECK制約', 'NOT NULL制約', '外部キー制約', 'UNIQUE制約'],
    correct: 2,
    explanation: '外部キー制約は参照整合性を保ち、参照先のテーブルに存在しない値の挿入を防ぎます。'
  },
  {
    question: 'SQLのWINDOW関数でないものは？',
    options: ['ROW_NUMBER()', 'RANK()', 'DENSE_RANK()', 'GROUP_CONCAT()'],
    correct: 3,
    explanation: 'GROUP_CONCAT()はMySQL固有の集約関数で、標準SQLのWINDOW関数ではありません。'
  },
  {
    question: 'データベースのパーティショニングの利点として適切でないものは？',
    options: ['クエリ性能の向上', '管理の簡素化', 'データの圧縮', '並列処理の向上'],
    correct: 2,
    explanation: 'パーティショニングは性能と管理性の向上が主目的で、データ圧縮は直接的な利点ではありません。'
  },
  {
    question: 'OLTPシステムの特徴として正しいものは？',
    options: ['大量データの分析', '複雑な集計処理', '短時間の単純な処理', '履歴データの保持'],
    correct: 2,
    explanation: 'OLTP（Online Transaction Processing）は短時間で完了する単純なトランザクション処理が特徴です。'
  },
  {
    question: 'データベースの冗長性排除の第2正規形の条件は？',
    options: ['原子値のみ', '部分関数従属の除去', '推移関数従属の除去', '多値従属の除去'],
    correct: 1,
    explanation: '第2正規形（2NF）は第1正規形を満たし、かつ部分関数従属を除去した形です。'
  },
  {
    question: 'NoSQLデータベースのタイプでないものは？',
    options: ['ドキュメント型', 'キー・バリュー型', 'グラフ型', 'リレーショナル型'],
    correct: 3,
    explanation: 'リレーショナル型は従来のRDBMSであり、NoSQLのタイプではありません。'
  },
  {
    question: 'データベースのレプリケーションで、マスター・スレーブ方式の特徴は？',
    options: ['すべてのノードで更新可能', 'マスターのみ更新可能', '自動負荷分散', 'データの暗号化'],
    correct: 1,
    explanation: 'マスター・スレーブ方式では、マスターノードのみが更新処理を行い、スレーブは読み取り専用です。'
  },
  {
    question: 'SQLのSTORED PROCEDUREの利点として適切でないものは？',
    options: ['性能の向上', 'セキュリティの向上', 'ポータビリティの向上', '保守性の向上'],
    correct: 2,
    explanation: 'ストアドプロシージャはDBMS固有の機能であり、ポータビリティ（移植性）は低下する傾向があります。'
  },
  {
    question: 'データベースの分散処理で、CAP定理の3つの特性に含まれないものは？',
    options: ['一貫性(Consistency)', '可用性(Availability)', '分断耐性(Partition tolerance)', '効率性(Efficiency)'],
    correct: 3,
    explanation: 'CAP定理は一貫性、可用性、分断耐性の3つの特性について述べており、効率性は含まれません。'
  },
  {
    question: 'データベースのクラスタリングの主な目的は？',
    options: ['データの暗号化', '高可用性の実現', 'データの圧縮', 'バックアップの高速化'],
    correct: 1,
    explanation: 'クラスタリングの主目的は複数のサーバで冗長化を図り、高可用性（HA）を実現することです。'
  },
  {
    question: 'SQLのTRIGGERが実行されるタイミングでないものは？',
    options: ['BEFORE INSERT', 'AFTER UPDATE', 'DURING SELECT', 'AFTER DELETE'],
    correct: 2,
    explanation: 'TRIGGERはINSERT、UPDATE、DELETEに対してBEFOREまたはAFTERで実行され、SELECTでは実行されません。'
  },
  {
    question: 'データベースの性能指標で、1秒間に処理できるトランザクション数を表すのは？',
    options: ['QPS', 'TPS', 'RPS', 'IOPS'],
    correct: 1,
    explanation: 'TPS（Transactions Per Second）は1秒間に処理できるトランザクション数を表す指標です。'
  },
  {
    question: 'データベースのシャーディングの利点として適切でないものは？',
    options: ['スケーラビリティの向上', '性能の向上', 'JOIN処理の高速化', '負荷の分散'],
    correct: 2,
    explanation: 'シャーディングでは異なるシャード間のJOIN処理が複雑になり、通常は性能が低下します。'
  },
  {
    question: 'データベースのMVCC（Multi-Version Concurrency Control）の特徴は？',
    options: ['ロックフリーの読み取り', '書き込み性能の低下', 'デッドロックの発生', 'メモリ使用量の削減'],
    correct: 0,
    explanation: 'MVCCは複数バージョンを管理することで、読み取り処理をロックフリーで実行できます。'
  },
  {
    question: 'BigDataの3Vに含まれないものは？',
    options: ['Volume（量）', 'Velocity（速度）', 'Variety（多様性）', 'Validity（妥当性）'],
    correct: 3,
    explanation: 'BigDataの3Vは Volume（量）、Velocity（速度）、Variety（多様性）です。'
  },
  {
    question: 'データベースのインメモリ処理の利点は？',
    options: ['ストレージ容量の削減', '処理速度の向上', 'データの永続化', '消費電力の削減'],
    correct: 1,
    explanation: 'インメモリ処理はディスクI/Oを削減し、大幅な処理速度向上を実現します。'
  },
  {
    question: 'SQLのFULL OUTER JOINの結果として正しいものは？',
    options: ['左テーブルの全行', '右テーブルの全行', '両テーブルの一致行のみ', '両テーブルの全行'],
    correct: 3,
    explanation: 'FULL OUTER JOINは左右両方のテーブルの全行を取得し、一致しない行はNULLで埋められます。'
  },
  {
    question: 'データベースの圧縮技術で、行指向圧縮の特徴は？',
    options: ['列ごとに圧縮', '行ごとに圧縮', 'ページ単位で圧縮', 'テーブル全体を圧縮'],
    correct: 1,
    explanation: '行指向圧縮は各行を個別に圧縮する方式で、OLTPシステムに適しています。'
  },
  {
    question: 'データベースのETL処理の「T」は何を表すか？',
    options: ['Transfer', 'Transform', 'Track', 'Transaction'],
    correct: 1,
    explanation: 'ETLのTはTransform（変換）を表し、データの形式変換や加工を行います。'
  },
  {
    question: 'SQLのCOALESCE関数の動作は？',
    options: ['最大値を返す', '最小値を返す', '最初の非NULL値を返す', '平均値を返す'],
    correct: 2,
    explanation: 'COALESCE関数は引数の中で最初に見つかった非NULL値を返します。'
  },
  {
    question: 'データベースのマテリアライズドビューの特徴は？',
    options: ['仮想的なテーブル', '実際にデータを格納', 'リアルタイム更新', 'インデックス不可'],
    correct: 1,
    explanation: 'マテリアライズドビューは実際にデータを格納する物理的なビューです。'
  },
  {
    question: 'データベースの分析関数LAG()の機能は？',
    options: ['前の行の値を取得', '次の行の値を取得', '最大値を取得', '最小値を取得'],
    correct: 0,
    explanation: 'LAG()関数は指定した行数だけ前の行の値を取得する分析関数です。'
  },
  {
    question: 'データベースのパーティション・プルーニングの効果は？',
    options: ['データの圧縮', '不要なパーティションの除外', 'インデックスの作成', 'ロックの取得'],
    correct: 1,
    explanation: 'パーティション・プルーニングは検索条件に基づいて不要なパーティションを除外し、性能を向上させます。'
  },
  {
    question: 'NoSQLのEventual Consistencyとは？',
    options: ['即座に一貫性を保証', '最終的に一貫性を保証', '一貫性を保証しない', '強い一貫性を保証'],
    correct: 1,
    explanation: 'Eventual Consistency（結果的一貫性）は時間が経てば最終的に一貫性が保たれることを意味します。'
  },
  {
    question: 'データベースのコネクションプーリングの利点は？',
    options: ['メモリ使用量の増加', 'コネクション確立コストの削減', 'セキュリティの低下', '処理速度の低下'],
    correct: 1,
    explanation: 'コネクションプーリングはコネクションを再利用することで、確立・切断のオーバーヘッドを削減します。'
  },
  {
    question: 'データベースのB+ツリーインデックスの特徴は？',
    options: ['リーフノードにのみデータ', '全ノードにデータ', 'ランダムアクセス不可', 'ソート不可'],
    correct: 0,
    explanation: 'B+ツリーではリーフノードにのみ実際のデータが格納され、範囲検索に適しています。'
  },
  {
    question: 'データベースのロールベースアクセス制御（RBAC）の概念は？',
    options: ['ユーザーに直接権限付与', '役割に権限を付与し、ユーザーに役割を割当', 'パスワードによる認証のみ', 'IPアドレスによる制御'],
    correct: 1,
    explanation: 'RBACでは役割（ロール）に権限を付与し、ユーザーには役割を割り当てることで権限管理を簡素化します。'
  },
  {
    question: 'データベースのWAL（Write-Ahead Logging）の目的は？',
    options: ['データの暗号化', '障害回復の実現', 'データの圧縮', '検索性能の向上'],
    correct: 1,
    explanation: 'WALはデータ変更前にログを書き込むことで、障害時の回復を可能にします。'
  },
  {
    question: 'データベースの垂直分割（Vertical Partitioning）とは？',
    options: ['行による分割', '列による分割', '時間による分割', 'ハッシュによる分割'],
    correct: 1,
    explanation: '垂直分割は列（カラム）ごとにテーブルを分割する手法です。'
  },
  {
    question: 'SQLのCTE（Common Table Expression）の特徴は？',
    options: ['永続的なテーブル', '一時的な結果セット', 'インデックス作成可能', '複数セッションで共有'],
    correct: 1,
    explanation: 'CTEは1つのクエリ内で使用される一時的な結果セットです。'
  },
  {
    question: 'データベースのスナップショット分離レベルの特徴は？',
    options: ['ダーティリード発生', 'ファントムリード発生', '読み取り一貫性保証', 'デッドロック頻発'],
    correct: 2,
    explanation: 'スナップショット分離はトランザクション開始時点のデータの読み取り一貫性を保証します。'
  },
  {
    question: 'データベースのカーディナリティとは？',
    options: ['テーブル数', '行数', '列の一意値の数', 'インデックス数'],
    correct: 2,
    explanation: 'カーディナリティは列に含まれる一意な値の数を表します。'
  },
  {
    question: 'データベースのバインド変数の利点は？',
    options: ['実行計画の再利用', 'セキュリティの低下', '性能の低下', 'メモリ使用量の増加'],
    correct: 0,
    explanation: 'バインド変数により実行計画を再利用でき、SQLインジェクション対策にもなります。'
  },
  {
    question: 'NewSQLデータベースの特徴は？',
    options: ['SQLサポートなし', 'ACIDサポートなし', 'スケーラビリティとACIDの両立', '単一ノードのみ'],
    correct: 2,
    explanation: 'NewSQLは従来のSQL機能とACID特性を保ちながら、水平スケーラビリティを実現します。'
  },
  {
    question: 'データベースのファンクション従属とは？',
    options: ['テーブル間の関係', '列間の依存関係', 'インデックスの種類', 'ロックの種類'],
    correct: 1,
    explanation: 'ファンクション従属は、ある列の値が決まれば他の列の値が一意に決まる関係です。'
  },
  {
    question: 'データベースのマルチテナント設計のアプローチでないものは？',
    options: ['共有データベース・共有スキーマ', '共有データベース・分離スキーマ', '分離データベース', '分散データベース'],
    correct: 3,
    explanation: 'マルチテナント設計の主なアプローチは、共有/分離の組み合わせによる3つの方式です。'
  },
  {
    question: 'データベースのリードレプリカの主な用途は？',
    options: ['書き込み性能向上', '読み取り負荷分散', 'データ暗号化', 'バックアップ高速化'],
    correct: 1,
    explanation: 'リードレプリカは読み取り専用のレプリカで、読み取り負荷を分散するために使用されます。'
  },
  {
    question: 'データベースのオプティミスティック・ロックの特徴は？',
    options: ['事前にロック取得', '更新時に競合チェック', 'デッドロック頻発', '読み取り不可'],
    correct: 1,
    explanation: 'オプティミスティック・ロックは更新時にバージョン番号等で競合をチェックする楽観的制御です。'
  },
  {
    question: 'データベースのデータマスキングの目的は？',
    options: ['性能向上', '機密データの保護', 'データ圧縮', '冗長性排除'],
    correct: 1,
    explanation: 'データマスキングは本番データを開発/テスト環境で安全に使用するため、機密性を保護します。'
  },
  {
    question: 'データベースのHot Standbyの特徴は？',
    options: ['手動切り替えのみ', '自動フェイルオーバー可能', 'データ同期なし', 'リードアクセス不可'],
    correct: 1,
    explanation: 'Hot Standbyは常にデータが同期されており、自動フェイルオーバーによる高可用性を実現できます。'
  },
  {
    question: 'データベースのColumnstore indexの利点は？',
    options: ['OLTP性能向上', '分析クエリ性能向上', 'ストレージ使用量増加', 'インデックス作成不可'],
    correct: 1,
    explanation: 'Columnstore indexは列指向の格納により、集計や分析クエリの性能を大幅に向上させます。'
  },
  {
    question: 'データベースのChange Data Capture（CDC）の用途は？',
    options: ['データバックアップ', 'データ変更の追跡', 'インデックス最適化', 'クエリ高速化'],
    correct: 1,
    explanation: 'CDCはデータベースの変更を追跡し、リアルタイムでデータ統合やレプリケーションを行います。'
  },
  {
    question: 'データベースのTime Travel機能とは？',
    options: ['将来データの予測', '過去の時点のデータアクセス', 'タイムゾーン変換', 'スケジュール実行'],
    correct: 1,
    explanation: 'Time Travel機能は過去の特定時点のデータ状態にアクセスできる機能です。'
  },
  {
    question: 'データベースのVector databaseの主な用途は？',
    options: ['従来のリレーショナルデータ', '類似性検索とAI/ML', 'ファイルストレージ', 'キューイング'],
    correct: 1,
    explanation: 'Vector databaseは高次元ベクトルデータの類似性検索やAI/ML用途に特化したデータベースです。'
  },
  {
    question: 'データベースのFederated queryの機能は？',
    options: ['単一データベース内検索', '複数データソースの統合検索', 'データバックアップ', 'インデックス作成'],
    correct: 1,
    explanation: 'Federated queryは複数の異なるデータソースを統合して、単一のクエリで検索できる機能です。'
  },
  {
    question: 'データベースのData lineageとは？',
    options: ['データサイズ', 'データの系譜・来歴', 'データタイプ', 'データ暗号化'],
    correct: 1,
    explanation: 'Data lineageはデータの起源、変換過程、流れを追跡・可視化する概念です。'
  },
  {
    question: 'Serverless databaseの特徴として適切でないものは？',
    options: ['使用量に応じた課金', 'サーバー管理不要', '自動スケーリング', '24時間稼働必須'],
    correct: 3,
    explanation: 'Serverless databaseは必要に応じて自動的にスケールし、使用しない時は停止してコストを削減できます。'
  },
  {
    question: 'データベースのGraph databaseのクエリ言語として一般的なものは？',
    options: ['SQL', 'Cypher', 'JavaScript', 'Python'],
    correct: 1,
    explanation: 'CypherはNeo4jなどのGraph databaseで使用される、グラフ構造に特化したクエリ言語です。'
  },
  {
    question: 'データベースのZero-copy operationの利点は？',
    options: ['データ暗号化', 'メモリコピー削減', 'ディスク容量削減', 'ネットワーク暗号化'],
    correct: 1,
    explanation: 'Zero-copy operationはデータのメモリコピーを削減し、CPU使用率とメモリ使用量を改善します。'
  },
  {
    question: 'データベースのMicro-partitioningの利点は？',
    options: ['管理の複雑化', 'クエリ性能とメタデータ管理の最適化', 'ストレージ増加', 'セキュリティ低下'],
    correct: 1,
    explanation: 'Micro-partitioningは小さな単位でのパーティション分割により、クエリ性能とメタデータ管理を最適化します。'
  },
  {
    question: 'データベースのImmutable storageの特徴は？',
    options: ['データの頻繁な更新', 'データの不変性', 'リアルタイム処理', 'メモリ使用量削減'],
    correct: 1,
    explanation: 'Immutable storageはデータの不変性を保ち、変更時は新しいバージョンを作成します。'
  },
  {
    question: 'Cloud-native databaseの設計原則でないものは？',
    options: ['弾力性(Elasticity)', '耐障害性(Fault tolerance)', '単一障害点の除去', 'オンプレミス専用設計'],
    correct: 3,
    explanation: 'Cloud-native databaseはクラウド環境に最適化されており、オンプレミス専用設計は該当しません。'
  },
  {
    question: 'データベースのStreaming ETLの特徴は？',
    options: ['バッチ処理のみ', 'リアルタイムデータ処理', '手動実行のみ', '過去データのみ処理'],
    correct: 1,
    explanation: 'Streaming ETLはリアルタイムでデータの抽出、変換、読み込みを行う連続的な処理方式です。'
  },
  {
    question: 'Multi-model databaseの利点は？',
    options: ['単一データモデルのみ', '複数データモデルの統合', 'シンプルな構造', '従来技術のみ使用'],
    correct: 1,
    explanation: 'Multi-model databaseは文書、グラフ、キー・バリューなど複数のデータモデルを統合的に扱えます。'
  },
  {
    question: 'データベースのAuto-tuningの目的は？',
    options: ['手動設定の増加', '自動的な性能最適化', 'セキュリティ向上', 'データ暗号化'],
    correct: 1,
    explanation: 'Auto-tuningはワークロードを分析して自動的にインデックスやパラメータを最適化し、性能を向上させます。'
  }
];

export default function DatabaseModule() {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizData.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<boolean[]>(new Array(quizData.length).fill(false));

  const { progress, saveProgress } = useLearningProgress('database');

  useEffect(() => {
    if (progress.length > 0) {
      console.log('📚 Database progress loaded:', progress.length, 'items');
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
      const quizKey = `database-quiz-${currentQuizIndex}`;

      try {
        saveProgress(quizKey, true, isCorrect);
        console.log('✅ Database progress saved:', { quiz: currentQuizIndex, correct: isCorrect });
      } catch (error) {
        console.error('❌ Failed to save database progress:', error);
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
              <h2 className="text-3xl font-bold text-gray-800 mb-2">データベース 完了！</h2>
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">データベース</h1>
          <p className="text-gray-600 mb-4">データベース設計、SQL、NoSQL、データ管理を体系的に学習します</p>
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