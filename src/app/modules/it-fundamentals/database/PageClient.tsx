'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, CheckCircle, Circle, ChevronRight, Database, Menu, X, RotateCcw } from 'lucide-react';
import { useLearningProgress } from '@/hooks/useLearningProgress';
import DebugPanel from '@/components/DebugPanel';

const learningModules = [
  {
    id: 1,
    title: 'データベースの基礎',
    sections: [
      {
        title: 'データベースとは',
        content: `データベースは、組織化されたデータの集合とその管理システムです。

**データベースの特徴:**
- **データの一元管理**: 複数のアプリケーションから共有
- **データの整合性**: 矛盾のないデータを維持
- **データの独立性**: アプリケーションと分離
- **同時実行制御**: 複数ユーザーの同時アクセス
- **障害回復**: バックアップとリカバリ機能

**データベース管理システム（DBMS）:**
- データの定義、操作、制御を行うソフトウェア
- 代表例: MySQL, PostgreSQL, Oracle, SQL Server

**データモデル:**
- **階層型**: ツリー構造
- **ネットワーク型**: グラフ構造
- **関係型（リレーショナル）**: 表形式 ← 最も普及
- **NoSQL**: キー・バリュー、ドキュメント型など`,
        quiz: {
          question: 'DBMSの主な機能として適切でないものはどれですか？',
          options: ['データの定義', 'プログラムのコンパイル', '同時実行制御', '障害回復'],
          correct: 1,
          explanation: 'DBMSは、データの定義（DDL）、データ操作（DML）、同時実行制御、障害回復などを行うソフトウェアですが、プログラムのコンパイルは行いません。'
        }
      },
      {
        title: 'データベースの利点',
        content: `データベースを使用することによる利点を理解しましょう。

**データの共有:**
- 複数のアプリケーション、ユーザーが同じデータを利用
- データの重複を避けて効率的に管理
- 一元的なデータ管理による整合性の確保

**データ独立性:**
- **論理的独立性**: アプリケーションがデータベース構造の変更に影響されない
- **物理的独立性**: 記憶装置の変更がアプリケーションに影響しない

**データセキュリティ:**
- アクセス制御によるデータ保護
- ユーザーごとの権限管理
- データの暗号化

**データの整合性:**
- 制約による不正データの防止
- 参照整合性の維持
- トランザクション処理による一貫性

**バックアップとリカバリ:**
- 定期的なバックアップ
- 障害時の自動回復機能
- ログによるデータ復旧`,
        quiz: {
          question: 'データベースの「論理的独立性」とは何ですか？',
          options: [
            'アプリケーションが記憶装置の変更に影響されないこと',
            'アプリケーションがデータベース構造の変更に影響されないこと',
            'データが物理的に分散していること',
            'データが論理的に暗号化されていること'
          ],
          correct: 1,
          explanation: '論理的独立性とは、データベースの論理構造（テーブル構造など）の変更が、アプリケーションプログラムに影響を与えないことです。'
        }
      },
      {
        title: 'データベース設計の手順',
        content: `効率的なデータベースを構築するための設計手順を学びましょう。

**1. 要件分析:**
- ユーザーの要求を明確化
- 業務プロセスの理解
- データの種類と量の把握

**2. 概念設計:**
- E-R図（Entity-Relationship図）の作成
- エンティティ（実体）の抽出
- リレーションシップ（関係）の定義
- 属性の特定

**3. 論理設計:**
- 関係モデルへの変換
- 正規化の実施
- テーブル構造の決定
- 制約の定義

**4. 物理設計:**
- インデックスの設計
- ストレージの選択
- パフォーマンスの最適化
- セキュリティ設定

**E-R図の基本要素:**
- **エンティティ**: 矩形で表現（例：顧客、商品）
- **リレーションシップ**: ひし形で表現（例：購入）
- **属性**: 楕円で表現（例：顧客名、商品価格）`,
        quiz: {
          question: 'データベース設計において、E-R図で「エンティティ」を表現する図形はどれですか？',
          options: ['円', '矩形', 'ひし形', '三角形'],
          correct: 1,
          explanation: 'E-R図では、エンティティ（実体）は矩形で表現されます。ひし形はリレーションシップ、楕円は属性を表します。'
        }
      },
      {
        title: '関係データベースの概念',
        content: `関係データベースは表（テーブル）形式でデータを管理します。

**基本用語:**
- **テーブル（表）**: データの集合
- **レコード（行）**: 1件のデータ
- **フィールド（列）**: データの項目
- **主キー**: レコードを一意に識別
- **外部キー**: 他テーブルとの関連

**例: 社員テーブル**
\`\`\`
社員ID | 氏名   | 部署ID | 入社日
-------|--------|--------|----------
001    | 田中   | 10     | 2020-04-01
002    | 鈴木   | 20     | 2019-04-01
003    | 佐藤   | 10     | 2021-04-01
\`\`\`

**関係演算:**
- **選択**: 条件に合うレコードを抽出
- **射影**: 特定の列を抽出
- **結合**: 複数のテーブルを関連付け
- **和・差・積**: 集合演算`,
        quiz: {
          question: '主キーの特徴として正しいものはどれですか？',
          options: ['NULL値を含むことができる', 'レコードを一意に識別する', '必ず数値型である', '複数の列に設定できない'],
          correct: 1,
          explanation: '主キーは各レコードを一意に識別するためのキーで、NULL値は許可されません。データ型は数値型以外でも可能で、複数の列で構成することもできます（複合キー）。'
        }
      },
      {
        title: 'キーの種類',
        content: `関係データベースでは様々な種類のキーが使用されます。

**主キー（Primary Key）:**
- テーブル内のレコードを一意に識別
- NULL値は許可されない
- 1つのテーブルに1つだけ設定可能
- 複数の列で構成可能（複合キー）

**外部キー（Foreign Key）:**
- 他のテーブルの主キーを参照
- 参照整合性を維持
- NULL値の設定可能
- 複数設定可能

**候補キー（Candidate Key）:**
- 主キーになり得るキー
- レコードを一意に識別できる最小の属性集合
- 複数存在する場合もある

**代替キー（Alternate Key）:**
- 主キー以外の候補キー
- 一意性制約として設定されることが多い

**スーパーキー（Super Key）:**
- レコードを一意に識別する属性の集合
- 候補キーに余分な属性を加えたもの

**例:**
\`\`\`
社員テーブル
- 主キー: 社員ID
- 候補キー: 社員ID, 社員番号, メールアドレス
- 外部キー: 部署ID（部署テーブルの主キーを参照）
\`\`\``,
        quiz: {
          question: '外部キーの特徴として誤っているものはどれですか？',
          options: [
            '他のテーブルの主キーを参照する',
            'NULL値を設定できる',
            '1つのテーブルに1つしか設定できない',
            '参照整合性を維持する'
          ],
          correct: 2,
          explanation: '外部キーは1つのテーブルに複数設定することができます。また、参照先のテーブルに対応するレコードが存在しない場合、NULL値も設定可能です。'
        }
      },
      {
        title: 'データ型と制約',
        content: `データベースでは適切なデータ型と制約を設定することが重要です。

**主なデータ型:**

**数値型:**
- INT/INTEGER: 整数
- DECIMAL/NUMERIC: 固定小数点数
- FLOAT/REAL: 浮動小数点数
- BIGINT: 大きな整数

**文字列型:**
- CHAR(n): 固定長文字列
- VARCHAR(n): 可変長文字列
- TEXT: 長い文字列

**日付・時刻型:**
- DATE: 日付
- TIME: 時刻
- DATETIME/TIMESTAMP: 日付と時刻

**真偽型:**
- BOOLEAN: True/False

**制約の種類:**

**NOT NULL制約:**
- NULL値の入力を禁止
- 必須項目に設定

**UNIQUE制約:**
- 重複値の入力を禁止
- 一意性を保証

**CHECK制約:**
- 条件を満たすデータのみ許可
- 例: 年齢 >= 0

**DEFAULT制約:**
- 値が入力されない場合のデフォルト値

**参照整合性制約:**
- 外部キー制約
- 参照先のデータの存在を保証`,
        quiz: {
          question: 'CHECK制約について正しい説明はどれですか？',
          options: [
            'NULL値の入力を禁止する',
            '重複値の入力を禁止する',
            '条件を満たすデータのみ許可する',
            'デフォルト値を設定する'
          ],
          correct: 2,
          explanation: 'CHECK制約は、列に入力されるデータが指定した条件を満たす場合のみ、データの入力を許可する制約です。例えば「年齢 >= 0」のような条件を設定できます。'
        }
      },
      {
        title: '正規化の基礎',
        content: `正規化はデータの冗長性を排除し、整合性を保つための設計手法です。

**第1正規形（1NF）:**
- 繰り返し項目の排除
- すべての属性値が単一値

悪い例: 社員(社員ID, 氏名, 電話番号1, 電話番号2)
良い例: 社員(社員ID, 氏名), 電話(社員ID, 電話番号)

**第2正規形（2NF）:**
- 1NFを満たす
- 部分関数従属の排除

悪い例: 注文明細(注文ID, 商品ID, 商品名, 数量)
良い例: 商品(商品ID, 商品名), 注文明細(注文ID, 商品ID, 数量)

**第3正規形（3NF）:**
- 2NFを満たす
- 推移的関数従属の排除

悪い例: 社員(社員ID, 氏名, 部署ID, 部署名)
良い例: 社員(社員ID, 氏名, 部署ID), 部署(部署ID, 部署名)

**正規化のメリット:**
- データの重複排除
- 更新異常の防止
- 記憶容量の節約

**正規化のデメリット:**
- テーブル数の増加
- 結合処理の複雑化
- パフォーマンスの低下`,
        quiz: {
          question: '第2正規形の条件として正しいものはどれですか？',
          options: ['推移的関数従属の排除', '部分関数従属の排除', '繰り返し項目の排除', 'NULL値の排除'],
          correct: 1,
          explanation: '第2正規形は第1正規形を満たし、かつ部分関数従属を排除したものです。部分関数従属とは、複合キーの一部の属性に他の属性が従属することです。'
        }
      },
      {
        title: '関数従属性',
        content: `関数従属性は正規化を理解する上で重要な概念です。

**関数従属性とは:**
- 属性Aの値が決まると属性Bの値が一意に決まる関係
- A → B と表記（AはBを関数従属させる）
- 例: 社員ID → 氏名（社員IDが決まれば氏名が一意に決まる）

**関数従属性の種類:**

**完全関数従属:**
- 複合キーのすべての属性に従属
- 例: (注文ID, 商品ID) → 数量

**部分関数従属:**
- 複合キーの一部の属性に従属
- 第2正規形で排除対象
- 例: (注文ID, 商品ID) → 商品名（商品IDのみに従属）

**推移的関数従属:**
- A → B, B → C のとき、A → C が成立
- 第3正規形で排除対象
- 例: 社員ID → 部署ID → 部署名

**自明な関数従属:**
- 属性が自分自身に従属
- 例: 社員ID → 社員ID

**関数従属図の例:**
\`\`\`
注文明細テーブル（正規化前）
注文ID, 商品ID → 数量     （完全関数従属）
商品ID → 商品名          （部分関数従属）
商品ID → カテゴリID      （部分関数従属）
カテゴリID → カテゴリ名   （推移的関数従属）
\`\`\``,
        quiz: {
          question: '推移的関数従属の定義として正しいものはどれですか？',
          options: [
            'A → B, B → C のとき、A → C が成立すること',
            '複合キーの一部の属性に従属すること',
            '属性が自分自身に従属すること',
            '複合キーのすべての属性に従属すること'
          ],
          correct: 0,
          explanation: '推移的関数従属とは、A → B かつ B → C のとき、A → C が成立する関係のことです。第3正規形では、この推移的関数従属を排除します。'
        }
      },
      {
        title: 'ボイス・コッド正規形（BCNF）',
        content: `ボイス・コッド正規形は第3正規形よりもさらに厳しい正規形です。

**BCNF（Boyce-Codd Normal Form）:**
- 第3正規形を満たす
- すべての非自明な関数従属において、決定項が候補キーである
- より厳密な正規化ルール

**BCNFの条件:**
- 関係Rのすべての関数従属 X → Y において
- X → Y が自明である、または
- X が候補キーである

**第3正規形とBCNFの違い:**

第3正規形の例:
\`\`\`
学生講義テーブル(学生ID, 講義名, 教授名)
学生ID, 講義名 → 教授名（候補キー）
教授名 → 講義名（候補キーでない決定項）
\`\`\`

BCNFへの変換:
\`\`\`
教授講義テーブル(教授名, 講義名)
学生履修テーブル(学生ID, 教授名)
\`\`\`

**BCNFの特徴:**
- 関数従属による更新異常を完全に排除
- 分解により関係が増える可能性
- 無損失分解を保証
- すべての関係がBCNFになるとは限らない

**BCNFの利点:**
- データの冗長性を最小化
- 更新異常の完全排除
- 論理的整合性の向上

**BCNFの欠点:**
- 関係の数が増加
- 結合コストの増大
- 設計の複雑化`,
        quiz: {
          question: 'ボイス・コッド正規形（BCNF）の条件として正しいものはどれですか？',
          options: [
            'すべての非キー属性が主キーに完全関数従属すること',
            'すべての決定項が候補キーであること',
            '推移的関数従属を排除すること',
            '部分関数従属を排除すること'
          ],
          correct: 1,
          explanation: 'BCNFでは、すべての非自明な関数従属において、決定項が候補キーである必要があります。これにより、関数従属による更新異常を完全に排除できます。'
        }
      },
      {
        title: '第4正規形と第5正規形',
        content: `第4正規形と第5正規形は多値従属性と結合従属性を扱います。

**第4正規形（4NF）:**
- BCNFを満たす
- 多値従属性を排除
- 非自明な多値従属は候補キーから発生

**多値従属性とは:**
- 一つの属性値に対して、他の属性の複数の値が対応
- A →→ B と表記
- 独立した複数の値の組み合わせ

**多値従属の例:**
\`\`\`
社員スキル表(社員ID, スキル, 資格)
山田 → プログラミング, 設計
山田 → 基本情報, 応用情報
\`\`\`

**第4正規形への分解:**
\`\`\`
社員スキル表(社員ID, スキル)
社員資格表(社員ID, 資格)
\`\`\`

**第5正規形（5NF、PJNF）:**
- 第4正規形を満たす
- 結合従属性を排除
- プロジェクション結合正規形とも呼ばれる

**結合従属性とは:**
- 関係を複数の射影に分解した後、自然結合で元の関係を復元できる性質
- 3つ以上の属性間の複雑な依存関係

**結合従属の例:**
\`\`\`
代理店商品表(代理店, 商品, 製造会社)
分解: (代理店, 製造会社), (製造会社, 商品), (代理店, 商品)
\`\`\`

**高次正規形の特徴:**
- 実用上は第3正規形やBCNFで十分
- 特殊なケースでのみ適用
- 理論的完全性を追求
- 設計の複雑化を招く場合がある`,
        quiz: {
          question: '第4正規形で排除される従属性はどれですか？',
          options: [
            '関数従属性',
            '多値従属性',
            '結合従属性',
            '推移的従属性'
          ],
          correct: 1,
          explanation: '第4正規形では多値従属性を排除します。多値従属性とは、一つの属性値に対して他の属性の複数の値が独立して対応する関係です。'
        }
      },
      {
        title: 'データベース設計手法',
        content: `効率的なデータベース設計を行うための手法と原則です。

**トップダウン設計:**
- 概念レベルから詳細レベルへ
- ER図から関係スキーマへの変換
- 業務分析から開始
- 正規化による設計改善

**ボトムアップ設計:**
- 既存データから設計
- 関数従属性の分析
- 正規化による統合
- レガシーシステムの再設計

**設計原則:**

**正規化の適切な適用:**
- 第3正規形までは必須
- BCNFは必要に応じて適用
- 非正規化は慎重に検討

**パフォーマンスとの バランス:**
- 読み取り頻度の考慮
- インデックス設計
- クエリパターンの分析
- ビュー活用

**設計パターン:**

**エンティティ分類:**
- 基本エンティティ（顧客、商品）
- イベントエンティティ（注文、入金）
- 属性エンティティ（分類、区分）

**関係の設計:**
- 1対1：分割可能性を検討
- 1対多：外部キーで実装
- 多対多：関連エンティティで解決

**設計品質の評価:**
- データの冗長性
- 更新異常の有無
- クエリの複雑さ
- 保守性

**設計ドキュメント:**
- ER図
- テーブル定義書
- データ辞書
- 制約一覧
- インデックス設計書`,
        quiz: {
          question: 'データベース設計において、多対多の関係を実装する最適な方法はどれですか？',
          options: [
            '両方のテーブルに外部キーを追加',
            '関連テーブル（中間テーブル）を作成',
            '一方のテーブルに配列型の列を追加',
            'ビューを使用して仮想的に結合'
          ],
          correct: 1,
          explanation: '多対多の関係は、両方のエンティティの主キーを外部キーとして持つ関連テーブル（中間テーブル）を作成することで実装します。これにより正規化を保ちながら関係を表現できます。'
        }
      },
      {
        title: 'データベース設計の実践例',
        content: `実際の業務システムでのデータベース設計例を学習しましょう。

**ECサイトの設計例:**

**主要エンティティ:**
- 顧客（Customer）
- 商品（Product）
- 注文（Order）
- 注文明細（OrderDetail）
- カテゴリ（Category）

**関係の設計:**
\`\`\`
顧客 --1:多-- 注文 --1:多-- 注文明細 --多:1-- 商品
商品 --多:1-- カテゴリ
\`\`\`

**テーブル設計:**
\`\`\`sql
-- 顧客テーブル
CREATE TABLE Customer (
    CustomerID INT PRIMARY KEY,
    CustomerName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE,
    Phone VARCHAR(20),
    Address TEXT,
    RegistrationDate DATE
);

-- 商品テーブル
CREATE TABLE Product (
    ProductID INT PRIMARY KEY,
    ProductName VARCHAR(100) NOT NULL,
    CategoryID INT,
    Price DECIMAL(10,2),
    Stock INT DEFAULT 0,
    Description TEXT,
    FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID)
);

-- 注文テーブル
CREATE TABLE Order (
    OrderID INT PRIMARY KEY,
    CustomerID INT NOT NULL,
    OrderDate DATE NOT NULL,
    TotalAmount DECIMAL(10,2),
    Status VARCHAR(20) DEFAULT 'pending',
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID)
);
\`\`\`

**設計上の考慮点:**

**正規化の適用:**
- 顧客情報の重複排除
- 商品情報の一元管理
- 注文と商品の分離

**制約の設定:**
- 主キー制約
- 外部キー制約
- CHECK制約（在庫数 >= 0）
- UNIQUE制約（メールアドレス）

**インデックス設計:**
- 顧客IDでの検索
- 商品名での検索
- 注文日での範囲検索
- カテゴリ別商品検索

**パフォーマンス考慮:**
- 頻繁な集計クエリ
- 在庫数の更新頻度
- 注文履歴の参照パターン`,
        quiz: {
          question: 'ECサイトの注文明細テーブルで、注文IDと商品IDの組み合わせに対する制約として最適なものはどれですか？',
          options: [
            'CHECK制約',
            'UNIQUE制約',
            'NOT NULL制約',
            'FOREIGN KEY制約'
          ],
          correct: 1,
          explanation: '注文明細テーブルでは、同一注文で同一商品の重複登録を防ぐため、注文IDと商品IDの組み合わせにUNIQUE制約を設定するのが適切です。'
        }
      }
    ]
  },
  {
    id: 2,
    title: 'SQL基礎',
    sections: [
      {
        title: 'SQLの概要',
        content: `SQL（Structured Query Language）は、関係データベースを操作するための標準言語です。

**SQLの特徴:**
- 宣言型言語（何をするかを記述）
- 標準化されている（ISO/IEC 9075）
- データベースベンダーごとに拡張機能あり
- 大文字小文字を区別しない（一般的）

**SQLの分類:**

**DDL（Data Definition Language）:**
- データベース構造の定義・変更
- CREATE, ALTER, DROP

**DML（Data Manipulation Language）:**
- データの操作
- SELECT, INSERT, UPDATE, DELETE

**DCL（Data Control Language）:**
- データアクセス制御
- GRANT, REVOKE

**TCL（Transaction Control Language）:**
- トランザクション制御
- COMMIT, ROLLBACK, SAVEPOINT

**基本的な構文規則:**
- 文の終わりにはセミコロン（;）
- 文字列はシングルクォート（'）で囲む
- コメントは -- または /* */
- 予約語は大文字推奨（可読性向上）`,
        quiz: {
          question: 'SQLの分類で、CREATE文が属するものはどれですか？',
          options: ['DDL', 'DML', 'DCL', 'TCL'],
          correct: 0,
          explanation: 'CREATE文はデータベースの構造（テーブル、インデックスなど）を定義するため、DDL（Data Definition Language）に分類されます。'
        }
      },
      {
        title: 'データ定義言語（DDL）',
        content: `DDLはデータベースの構造を定義・変更するSQL文です。

**CREATE TABLE:**
\`\`\`sql
CREATE TABLE 社員 (
    社員ID INT PRIMARY KEY,
    氏名 VARCHAR(50) NOT NULL,
    部署ID INT,
    給与 DECIMAL(10, 2),
    入社日 DATE,
    FOREIGN KEY (部署ID) REFERENCES 部署(部署ID)
);
\`\`\`

**ALTER TABLE:**
\`\`\`sql
-- 列の追加
ALTER TABLE 社員 ADD メールアドレス VARCHAR(100);

-- 列の削除
ALTER TABLE 社員 DROP COLUMN メールアドレス;

-- 列の変更
ALTER TABLE 社員 MODIFY 氏名 VARCHAR(100);

-- 制約の追加
ALTER TABLE 社員 ADD CONSTRAINT chk_salary
CHECK (給与 >= 0);
\`\`\`

**CREATE INDEX:**
\`\`\`sql
-- 単一列インデックス
CREATE INDEX idx_employee_name ON 社員(氏名);

-- 複合インデックス
CREATE INDEX idx_emp_dept_salary ON 社員(部署ID, 給与);

-- 一意インデックス
CREATE UNIQUE INDEX idx_employee_email ON 社員(メールアドレス);
\`\`\`

**DROP TABLE:**
\`\`\`sql
DROP TABLE 社員;  -- テーブルを削除
\`\`\`

**制約の種類:**
- PRIMARY KEY: 主キー制約
- FOREIGN KEY: 外部キー制約
- UNIQUE: 一意制約
- NOT NULL: NULL禁止
- CHECK: 条件制約
- DEFAULT: デフォルト値`,
        quiz: {
          question: 'PRIMARY KEY制約の特徴として誤っているものはどれですか？',
          options: ['値の重複を許可しない', 'NULLを許可しない', '1テーブルに複数設定できる', 'レコードを一意に識別する'],
          correct: 2,
          explanation: 'PRIMARY KEY制約は1つのテーブルに1つだけ設定できます。値の重複とNULLは許可されず、レコードを一意に識別します。'
        }
      },
      {
        title: 'データ操作言語（DML）- SELECT',
        content: `SELECT文はデータの検索を行う最も重要なSQL文です。

**基本構文:**
\`\`\`sql
SELECT 列名1, 列名2, ...
FROM テーブル名
WHERE 条件
ORDER BY 列名
LIMIT 件数;
\`\`\`

**基本的な検索:**
\`\`\`sql
-- 全件取得
SELECT * FROM 社員;

-- 特定の列のみ取得
SELECT 氏名, 給与 FROM 社員;

-- 条件付き検索
SELECT 氏名, 給与 FROM 社員 WHERE 部署ID = 10;

-- 範囲指定
SELECT * FROM 社員 WHERE 給与 BETWEEN 300000 AND 500000;

-- パターン検索
SELECT * FROM 社員 WHERE 氏名 LIKE '田%';
\`\`\`

**並び替え（ORDER BY）:**
\`\`\`sql
-- 昇順（ASC）
SELECT * FROM 社員 ORDER BY 給与 ASC;

-- 降順（DESC）
SELECT * FROM 社員 ORDER BY 給与 DESC;

-- 複数列での並び替え
SELECT * FROM 社員 ORDER BY 部署ID ASC, 給与 DESC;
\`\`\`

**重複の排除（DISTINCT）:**
\`\`\`sql
SELECT DISTINCT 部署ID FROM 社員;
\`\`\`

**比較演算子:**
- = : 等しい
- <> または != : 等しくない
- < : より小さい
- > : より大きい
- <= : 以下
- >= : 以上
- IS NULL : NULLである
- IS NOT NULL : NULLでない`,
        quiz: {
          question: 'SQL文でパターン検索を行う際に使用する演算子はどれですか？',
          options: ['LIKE', 'MATCH', 'PATTERN', 'SEARCH'],
          correct: 0,
          explanation: 'LIKE演算子を使用してパターン検索を行います。ワイルドカード文字として %（任意の文字列）や _（任意の1文字）を使用できます。'
        }
      },
      {
        title: '集約関数とGROUP BY',
        content: `集約関数は複数の行をまとめて計算を行う関数です。

**主な集約関数:**
- COUNT(): レコード数をカウント
- SUM(): 数値の合計
- AVG(): 数値の平均
- MAX(): 最大値
- MIN(): 最小値

**基本的な使用例:**
\`\`\`sql
-- 社員数をカウント
SELECT COUNT(*) FROM 社員;

-- NULL値を除いてカウント
SELECT COUNT(メールアドレス) FROM 社員;

-- 平均給与
SELECT AVG(給与) FROM 社員;

-- 最高給与と最低給与
SELECT MAX(給与) AS 最高給与, MIN(給与) AS 最低給与 FROM 社員;
\`\`\`

**GROUP BY句:**
\`\`\`sql
-- 部署ごとの社員数
SELECT 部署ID, COUNT(*) AS 社員数
FROM 社員
GROUP BY 部署ID;

-- 部署ごとの平均給与
SELECT 部署ID, AVG(給与) AS 平均給与
FROM 社員
GROUP BY 部署ID;

-- 複数列でのグループ化
SELECT 部署ID, 入社年, COUNT(*) AS 人数
FROM 社員
GROUP BY 部署ID, YEAR(入社日);
\`\`\`

**HAVING句:**
\`\`\`sql
-- 社員数が3人以上の部署
SELECT 部署ID, COUNT(*) AS 社員数
FROM 社員
GROUP BY 部署ID
HAVING COUNT(*) >= 3;

-- 平均給与が40万円以上の部署
SELECT 部署ID, AVG(給与) AS 平均給与
FROM 社員
GROUP BY 部署ID
HAVING AVG(給与) >= 400000;
\`\`\`

**WHEREとHAVINGの違い:**
- WHERE: グループ化前の行を絞り込み
- HAVING: グループ化後の結果を絞り込み`,
        quiz: {
          question: 'GROUP BY句と一緒に使用する条件指定の句はどれですか？',
          options: ['WHERE', 'HAVING', 'ORDER BY', 'LIMIT'],
          correct: 1,
          explanation: 'HAVING句はGROUP BYでグループ化された結果に対して条件を指定します。WHERE句はグループ化前の行に対する条件指定です。'
        }
      },
      {
        title: '結合（JOIN）',
        content: `複数のテーブルからデータを取得する方法です。

**内部結合（INNER JOIN）:**
\`\`\`sql
-- 両方のテーブルに存在するデータのみ
SELECT s.氏名, d.部署名
FROM 社員 s
INNER JOIN 部署 d ON s.部署ID = d.部署ID;

-- WHERE句を使った結合（古い書き方）
SELECT s.氏名, d.部署名
FROM 社員 s, 部署 d
WHERE s.部署ID = d.部署ID;
\`\`\`

**左外部結合（LEFT OUTER JOIN）:**
\`\`\`sql
-- 左側のテーブル（社員）は全件表示
SELECT s.氏名, d.部署名
FROM 社員 s
LEFT OUTER JOIN 部署 d ON s.部署ID = d.部署ID;
\`\`\`

**右外部結合（RIGHT OUTER JOIN）:**
\`\`\`sql
-- 右側のテーブル（部署）は全件表示
SELECT s.氏名, d.部署名
FROM 社員 s
RIGHT OUTER JOIN 部署 d ON s.部署ID = d.部署ID;
\`\`\`

**完全外部結合（FULL OUTER JOIN）:**
\`\`\`sql
-- 両方のテーブルの全データを表示
SELECT s.氏名, d.部署名
FROM 社員 s
FULL OUTER JOIN 部署 d ON s.部署ID = d.部署ID;
\`\`\`

**自己結合（Self JOIN）:**
\`\`\`sql
-- 社員と上司の関係を表示
SELECT e.氏名 AS 社員名, m.氏名 AS 上司名
FROM 社員 e
LEFT JOIN 社員 m ON e.上司ID = m.社員ID;
\`\`\`

**複数テーブルの結合:**
\`\`\`sql
SELECT s.氏名, d.部署名, p.プロジェクト名
FROM 社員 s
INNER JOIN 部署 d ON s.部署ID = d.部署ID
INNER JOIN プロジェクト_参加 pa ON s.社員ID = pa.社員ID
INNER JOIN プロジェクト p ON pa.プロジェクトID = p.プロジェクトID;
\`\`\``,
        quiz: {
          question: 'LEFT OUTER JOINの特徴として正しいものはどれですか？',
          options: ['右側のテーブルは全件表示される', '左側のテーブルは全件表示される', '両方のテーブルに存在するデータのみ表示', '結合条件を指定できない'],
          correct: 1,
          explanation: 'LEFT OUTER JOINでは、左側（FROM句で指定した）テーブルのすべてのレコードが表示され、右側のテーブルに対応するデータがない場合はNULLが表示されます。'
        }
      },
      {
        title: '副問合せ（サブクエリ）',
        content: `副問合せ（サブクエリ）は、SQL文の中に別のSQL文を埋め込む機能です。

**WHERE句での使用:**
\`\`\`sql
-- 平均給与より高い給与の社員
SELECT 氏名, 給与 FROM 社員
WHERE 給与 > (SELECT AVG(給与) FROM 社員);

-- 特定部署に所属する社員
SELECT 氏名 FROM 社員
WHERE 部署ID IN (SELECT 部署ID FROM 部署 WHERE 場所 = '東京');

-- 部下がいない社員（NOT EXISTS使用）
SELECT 氏名 FROM 社員 s
WHERE NOT EXISTS (
    SELECT 1 FROM 社員 WHERE 上司ID = s.社員ID
);
\`\`\`

**FROM句での使用:**
\`\`\`sql
-- 部署ごとの平均給与が30万円以上の部署
SELECT * FROM
(SELECT 部署ID, AVG(給与) as 平均給与
 FROM 社員 GROUP BY 部署ID) t
WHERE t.平均給与 >= 300000;
\`\`\`

**SELECT句での使用:**
\`\`\`sql
-- 各社員の給与と全体平均給与の差
SELECT 氏名, 給与,
       給与 - (SELECT AVG(給与) FROM 社員) AS 平均との差
FROM 社員;
\`\`\`

**相関副問合せ:**
\`\`\`sql
-- 各部署の最高給与を受け取る社員
SELECT 氏名, 部署ID, 給与
FROM 社員 s1
WHERE 給与 = (
    SELECT MAX(給与)
    FROM 社員 s2
    WHERE s2.部署ID = s1.部署ID
);
\`\`\`

**副問合せで使用する演算子:**
- IN / NOT IN: 値のリストに含まれる/含まれない
- EXISTS / NOT EXISTS: 結果が存在する/存在しない
- ANY / SOME: いずれかの値と比較
- ALL: すべての値と比較`,
        quiz: {
          question: '副問合せでよく使用される「EXISTS」演算子の動作として正しいものはどれですか？',
          options: [
            '副問合せの結果が空の場合にTrueを返す',
            '副問合せの結果にレコードが存在する場合にTrueを返す',
            '副問合せの結果の値と比較する',
            '副問合せの結果の個数を数える'
          ],
          correct: 1,
          explanation: 'EXISTS演算子は、副問合せの結果にレコードが1件以上存在する場合にTrueを返します。レコードが存在しない場合はFalseを返します。'
        }
      },
      {
        title: 'INSERT, UPDATE, DELETE',
        content: `データの追加、更新、削除を行うDML文です。

**INSERT文（データ追加）:**
\`\`\`sql
-- 基本的な挿入
INSERT INTO 社員 (社員ID, 氏名, 部署ID, 入社日)
VALUES (004, '山田太郎', 30, '2022-04-01');

-- 複数行の挿入
INSERT INTO 社員 (社員ID, 氏名, 部署ID, 入社日)
VALUES
  (005, '佐藤花子', 20, '2022-04-01'),
  (006, '田中次郎', 10, '2022-04-01');

-- 副問合せを使用した挿入
INSERT INTO 退職者 (社員ID, 氏名, 部署ID)
SELECT 社員ID, 氏名, 部署ID
FROM 社員
WHERE 退職日 IS NOT NULL;
\`\`\`

**UPDATE文（データ更新）:**
\`\`\`sql
-- 基本的な更新
UPDATE 社員 SET 給与 = 350000 WHERE 社員ID = 001;

-- 複数列の更新
UPDATE 社員
SET 給与 = 給与 * 1.1, 更新日 = CURRENT_DATE
WHERE 部署ID = 10;

-- 計算による更新
UPDATE 社員
SET 給与 = 給与 + 50000
WHERE 入社日 < '2020-01-01';

-- 副問合せを使用した更新
UPDATE 社員
SET 給与 = (
    SELECT AVG(給与) * 1.2
    FROM 社員 s2
    WHERE s2.部署ID = 社員.部署ID
)
WHERE 役職 = '主任';
\`\`\`

**DELETE文（データ削除）:**
\`\`\`sql
-- 基本的な削除
DELETE FROM 社員 WHERE 社員ID = 001;

-- 条件による削除
DELETE FROM 社員 WHERE 入社日 < '2020-01-01';

-- 副問合せを使用した削除
DELETE FROM 社員
WHERE 部署ID IN (
    SELECT 部署ID FROM 部署 WHERE 廃止日 IS NOT NULL
);

-- 全件削除（注意が必要）
DELETE FROM 一時テーブル;
\`\`\`

**注意点:**
- WHERE句を忘れると全件が対象となる
- UPDATE/DELETEの前にSELECTで確認する
- トランザクションを使用して安全に実行`,
        quiz: {
          question: 'UPDATE文で複数の列を同時に更新する場合の正しい構文はどれですか？',
          options: [
            'UPDATE テーブル SET 列1 = 値1 AND 列2 = 値2',
            'UPDATE テーブル SET 列1 = 値1, 列2 = 値2',
            'UPDATE テーブル SET 列1 = 値1; SET 列2 = 値2',
            'UPDATE テーブル SET (列1, 列2) = (値1, 値2)'
          ],
          correct: 1,
          explanation: 'UPDATE文で複数の列を更新する場合は、SET句でカンマ（,）区切りで指定します。「SET 列1 = 値1, 列2 = 値2」が正しい構文です。'
        }
      },
      {
        title: 'インデックス',
        content: `インデックスはデータ検索を高速化するための仕組みです。

**インデックスとは:**
- データの格納場所を示すポインタの集合
- 本の目次のような役割
- 検索処理を高速化
- 更新処理は若干遅くなる

**インデックスの種類:**

**クラスタ化インデックス:**
- データの物理的な並び順を決める
- 1つのテーブルに1つだけ
- 通常、主キーに自動作成

**非クラスタ化インデックス:**
- データとは別にインデックスを格納
- 複数作成可能
- 検索によく使用される列に作成

**複合インデックス:**
- 複数の列を組み合わせたインデックス
- 列の順序が重要
- 前方一致で効果を発揮

**インデックスの作成:**
\`\`\`sql
-- 単一列インデックス
CREATE INDEX idx_employee_name ON 社員(氏名);

-- 複合インデックス
CREATE INDEX idx_dept_salary ON 社員(部署ID, 給与);

-- 一意インデックス
CREATE UNIQUE INDEX idx_employee_email
ON 社員(メールアドレス);

-- 部分インデックス（PostgreSQLなど）
CREATE INDEX idx_active_employees
ON 社員(氏名) WHERE 退職日 IS NULL;
\`\`\`

**インデックスの削除:**
\`\`\`sql
DROP INDEX idx_employee_name;
\`\`\`

**インデックス設計のポイント:**
- WHERE句でよく使用される列
- JOIN条件で使用される列
- ORDER BYで使用される列
- 選択性の高い列（重複の少ない列）

**インデックスの注意点:**
- 過度の作成は更新性能を低下させる
- 記憶容量を消費する
- 定期的なメンテナンスが必要`,
        quiz: {
          question: '複合インデックス「CREATE INDEX idx_name ON テーブル(列A, 列B)」が効果的に使用される検索条件はどれですか？',
          options: [
            'WHERE 列B = 値',
            'WHERE 列A = 値',
            'WHERE 列B = 値 AND 列A = 値',
            'WHERE 列A LIKE \'%値%\''
          ],
          correct: 1,
          explanation: '複合インデックスは前方一致で効果を発揮します。(列A, 列B)の順序で作成されたインデックスは、列Aの条件から使用され、列Aだけの検索や列A + 列Bの検索で効果的です。'
        }
      },
      {
        title: 'ビューの作成と活用',
        content: `ビューは仮想的なテーブルで、実際のデータを持たずにクエリ結果を表現します。

**ビューとは:**
- SELECT文を名前付きで保存した仮想テーブル
- 実際のデータは基底テーブルに格納
- セキュリティと利便性を向上

**ビューの作成:**
\`\`\`sql
-- 基本的なビュー
CREATE VIEW 部署別社員数 AS
SELECT 部署ID, COUNT(*) AS 社員数
FROM 社員
GROUP BY 部署ID;

-- 複数テーブルを結合したビュー
CREATE VIEW 社員詳細 AS
SELECT s.社員ID, s.氏名, d.部署名, s.給与
FROM 社員 s
INNER JOIN 部署 d ON s.部署ID = d.部署ID;

-- 条件付きビュー
CREATE VIEW 高給社員 AS
SELECT 社員ID, 氏名, 給与
FROM 社員
WHERE 給与 >= 400000;
\`\`\`

**ビューの利点:**

**セキュリティ向上:**
- 必要な列のみを公開
- 行レベルのセキュリティ
- 複雑な権限制御

**操作の簡素化:**
- 複雑なクエリの再利用
- ユーザーフレンドリーなインターフェース
- 業務ロジックの集約

**データ独立性:**
- 基底テーブル構造の変更を隠蔽
- アプリケーションの影響最小化
- 段階的なシステム移行

**ビューの種類:**

**単純ビュー:**
- 1つのテーブルから作成
- 更新可能
- インデックス利用可能

**複雑ビュー:**
- 複数テーブルの結合
- 集約関数を含む
- 通常は読み取り専用

**更新可能ビュー:**
- INSERT, UPDATE, DELETE可能
- 単一テーブルベース
- 制約に従う必要

**ビューの管理:**
\`\`\`sql
-- ビューの変更
CREATE OR REPLACE VIEW 社員詳細 AS
SELECT s.社員ID, s.氏名, d.部署名, s.給与, s.入社日
FROM 社員 s
INNER JOIN 部署 d ON s.部署ID = d.部署ID;

-- ビューの削除
DROP VIEW 高給社員;

-- ビューの確認
SHOW CREATE VIEW 社員詳細;
\`\`\``,
        quiz: {
          question: 'ビューの主な利点として最も適切でないものはどれですか？',
          options: [
            'セキュリティの向上',
            '複雑なクエリの簡素化',
            'データベースの処理速度向上',
            'データ独立性の確保'
          ],
          correct: 2,
          explanation: 'ビューは仮想テーブルであり、実行時に基底テーブルからデータを取得するため、処理速度の向上は期待できません。むしろ複雑なビューは処理速度を低下させる場合があります。'
        }
      },
      {
        title: 'ストアドプロシージャと関数',
        content: `ストアドプロシージャと関数は、データベース内で実行される事前コンパイル済みのSQLコードです。

**ストアドプロシージャ:**
- 一連のSQL文をまとめたもの
- データベースサーバーで実行
- パラメータを受け取り可能
- 戻り値は必須ではない

**プロシージャの作成例:**
\`\`\`sql
-- 社員給与更新プロシージャ
DELIMITER //
CREATE PROCEDURE UpdateSalary(
    IN emp_id INT,
    IN new_salary DECIMAL(10,2)
)
BEGIN
    UPDATE 社員
    SET 給与 = new_salary
    WHERE 社員ID = emp_id;

    -- ログの記録
    INSERT INTO 給与変更ログ (社員ID, 変更日, 新給与)
    VALUES (emp_id, NOW(), new_salary);
END //
DELIMITER ;

-- プロシージャの実行
CALL UpdateSalary(001, 450000);
\`\`\`

**関数（Function）:**
- 値を返すことが必須
- SELECT文内で使用可能
- 副作用を持たない（理想的）
- 単一の値を返す

**関数の作成例:**
\`\`\`sql
-- 年数計算関数
DELIMITER //
CREATE FUNCTION CalculateYears(start_date DATE)
RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    RETURN YEAR(CURDATE()) - YEAR(start_date);
END //
DELIMITER ;

-- 関数の使用
SELECT 氏名, CalculateYears(入社日) AS 勤続年数
FROM 社員;
\`\`\`

**利点:**

**パフォーマンス向上:**
- プリコンパイル済み
- 実行計画の再利用
- ネットワークトラフィック削減

**セキュリティ強化:**
- SQLインジェクション対策
- 権限制御の細分化
- ビジネスロジックの隠蔽

**再利用性:**
- コードの共通化
- 保守性の向上
- 開発効率の向上

**制御構造:**
\`\`\`sql
-- 条件分岐とループ
DELIMITER //
CREATE PROCEDURE ProcessEmployees()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE emp_id INT;
    DECLARE emp_cursor CURSOR FOR
        SELECT 社員ID FROM 社員;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN emp_cursor;
    read_loop: LOOP
        FETCH emp_cursor INTO emp_id;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- 処理ロジック
        IF emp_id > 100 THEN
            UPDATE 社員 SET ステータス = '正社員' WHERE 社員ID = emp_id;
        END IF;
    END LOOP;
    CLOSE emp_cursor;
END //
DELIMITER ;
\`\`\``,
        quiz: {
          question: 'ストアドプロシージャの主な利点として適切でないものはどれですか？',
          options: [
            'プリコンパイルによる実行速度向上',
            'SQLインジェクション対策',
            'データベースの可搬性向上',
            'ネットワークトラフィック削減'
          ],
          correct: 2,
          explanation: 'ストアドプロシージャはDBMS固有の機能であり、異なるデータベース間での可搬性は低下します。利点としては実行速度向上、セキュリティ強化、ネットワーク効率化があります。'
        }
      },
      {
        title: 'トリガーの概念と実装',
        content: `トリガーは、特定のデータベースイベントに応じて自動実行されるプログラムです。

**トリガーとは:**
- テーブルへの操作に対して自動実行
- INSERT、UPDATE、DELETE時に発動
- ビジネスルールの自動適用
- データ整合性の維持

**トリガーの種類:**

**実行タイミング:**
- BEFORE: 操作の前に実行
- AFTER: 操作の後に実行
- INSTEAD OF: ビューに対する操作の代替

**イベントタイプ:**
- INSERT: データ挿入時
- UPDATE: データ更新時
- DELETE: データ削除時

**トリガーの作成例:**
\`\`\`sql
-- 監査ログトリガー
CREATE TRIGGER audit_salary_changes
AFTER UPDATE ON 社員
FOR EACH ROW
BEGIN
    IF OLD.給与 != NEW.給与 THEN
        INSERT INTO 給与変更ログ (
            社員ID,
            変更前給与,
            変更後給与,
            変更日時,
            変更者
        ) VALUES (
            NEW.社員ID,
            OLD.給与,
            NEW.給与,
            NOW(),
            USER()
        );
    END IF;
END;

-- 在庫管理トリガー
CREATE TRIGGER update_stock
AFTER INSERT ON 注文明細
FOR EACH ROW
BEGIN
    UPDATE 商品
    SET 在庫数 = 在庫数 - NEW.数量
    WHERE 商品ID = NEW.商品ID;

    -- 在庫不足チェック
    IF (SELECT 在庫数 FROM 商品 WHERE 商品ID = NEW.商品ID) < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = '在庫不足です';
    END IF;
END;
\`\`\`

**トリガーの活用場面:**

**監査とログ:**
- データ変更履歴の記録
- セキュリティ監査
- 法的要件への対応

**ビジネスルール実装:**
- 複雑な制約の実装
- 自動計算処理
- 関連データの同期

**データ整合性:**
- 複雑な整合性制約
- 派生データの自動更新
- レプリケーションの支援

**注意事項:**

**パフォーマンス影響:**
- DML操作の負荷増加
- 複雑なロジックは避ける
- 無限ループの回避

**デバッグの困難さ:**
- 暗黙的な実行
- エラーの特定が困難
- テストの複雑化

**依存関係:**
- テーブル構造への依存
- 他のトリガーとの相互作用
- アプリケーションとの競合

**管理コマンド:**
\`\`\`sql
-- トリガーの確認
SHOW TRIGGERS LIKE '社員';

-- トリガーの削除
DROP TRIGGER audit_salary_changes;

-- トリガーの詳細確認
SHOW CREATE TRIGGER update_stock;
\`\`\``,
        quiz: {
          question: 'BEFOREトリガーとAFTERトリガーの使い分けとして適切なものはどれですか？',
          options: [
            'BEFOREは監査ログ、AFTERはデータ検証',
            'BEFOREはデータ検証、AFTERは関連データ更新',
            'BEFOREは削除処理、AFTERは挿入処理',
            'BEFOREとAFTERに機能的な違いはない'
          ],
          correct: 1,
          explanation: 'BEFOREトリガーは操作前に実行されるため、データの検証や変更に適しています。AFTERトリガーは操作後に実行されるため、監査ログや関連データの更新に適しています。'
        }
      },
      {
        title: 'ウィンドウ関数',
        content: `ウィンドウ関数は、行のグループに対して計算を実行する高度なSQL機能です。

**ウィンドウ関数とは:**
- 結果セットの行グループに対する計算
- GROUP BYと異なり、元の行数を保持
- OVER句で計算範囲を指定
- 集計、ランキング、分析に活用

**基本構文:**
\`\`\`sql
関数名() OVER (
    [PARTITION BY 列名]
    [ORDER BY 列名]
    [ROWS/RANGE BETWEEN ... AND ...]
)
\`\`\`

**集計ウィンドウ関数:**
\`\`\`sql
-- 累積合計
SELECT
    氏名,
    給与,
    SUM(給与) OVER (ORDER BY 社員ID) AS 累積給与
FROM 社員;

-- 部署別の平均給与
SELECT
    氏名,
    部署ID,
    給与,
    AVG(給与) OVER (PARTITION BY 部署ID) AS 部署平均給与
FROM 社員;

-- 移動平均（3行）
SELECT
    日付,
    売上,
    AVG(売上) OVER (
        ORDER BY 日付
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) AS 移動平均
FROM 売上データ;
\`\`\`

**ランキング関数:**
\`\`\`sql
-- 順位付け
SELECT
    氏名,
    給与,
    ROW_NUMBER() OVER (ORDER BY 給与 DESC) AS 行番号,
    RANK() OVER (ORDER BY 給与 DESC) AS 順位,
    DENSE_RANK() OVER (ORDER BY 給与 DESC) AS 密順位
FROM 社員;

-- 部署内順位
SELECT
    氏名,
    部署ID,
    給与,
    RANK() OVER (
        PARTITION BY 部署ID
        ORDER BY 給与 DESC
    ) AS 部署内順位
FROM 社員;
\`\`\`

**値アクセス関数:**
\`\`\`sql
-- 前後の値を取得
SELECT
    氏名,
    給与,
    LAG(給与, 1) OVER (ORDER BY 社員ID) AS 前の給与,
    LEAD(給与, 1) OVER (ORDER BY 社員ID) AS 次の給与
FROM 社員;

-- 最初と最後の値
SELECT
    氏名,
    給与,
    FIRST_VALUE(給与) OVER (
        PARTITION BY 部署ID
        ORDER BY 給与 DESC
    ) AS 部署最高給与,
    LAST_VALUE(給与) OVER (
        PARTITION BY 部署ID
        ORDER BY 給与 DESC
        ROWS UNBOUNDED FOLLOWING
    ) AS 部署最低給与
FROM 社員;
\`\`\`

**フレーム指定:**
- ROWS: 物理的な行数指定
- RANGE: 論理的な値範囲指定
- PRECEDING: 前の行
- FOLLOWING: 後の行
- CURRENT ROW: 現在の行
- UNBOUNDED: 無制限

**実用例:**
\`\`\`sql
-- 売上の前年同月比
SELECT
    年月,
    売上,
    LAG(売上, 12) OVER (ORDER BY 年月) AS 前年同月売上,
    ROUND(
        (売上 - LAG(売上, 12) OVER (ORDER BY 年月))
        / LAG(売上, 12) OVER (ORDER BY 年月) * 100, 2
    ) AS 前年同月比
FROM 月次売上;

-- パーセンタイル計算
SELECT
    氏名,
    給与,
    PERCENT_RANK() OVER (ORDER BY 給与) AS パーセンタイル順位,
    CUME_DIST() OVER (ORDER BY 給与) AS 累積分布
FROM 社員;
\`\`\``,
        quiz: {
          question: 'ウィンドウ関数でRANK()とDENSE_RANK()の違いは何ですか？',
          options: [
            'RANK()は昇順、DENSE_RANK()は降順でソート',
            'RANK()は同順位の次に順位が飛ぶ、DENSE_RANK()は連続する',
            'RANK()は文字列、DENSE_RANK()は数値のみ対応',
            '機能的な違いはない'
          ],
          correct: 1,
          explanation: 'RANK()は同順位がある場合、次の順位が飛びます（1,2,2,4...）。DENSE_RANK()は連続した順位を付けます（1,2,2,3...）。'
        }
      },
      {
        title: 'Common Table Expression (CTE)',
        content: `CTEは一時的な結果セットを定義する機能で、複雑なクエリを読みやすくします。

**CTEとは:**
- WITH句で定義する一時的なビュー
- クエリ内でのみ有効
- 再帰的な処理も可能
- 可読性と保守性の向上

**基本的なCTE:**
\`\`\`sql
-- 部署別統計
WITH 部署統計 AS (
    SELECT
        部署ID,
        COUNT(*) AS 社員数,
        AVG(給与) AS 平均給与,
        MAX(給与) AS 最高給与
    FROM 社員
    GROUP BY 部署ID
)
SELECT
    d.部署名,
    ds.社員数,
    ds.平均給与,
    ds.最高給与
FROM 部署統計 ds
JOIN 部署 d ON ds.部署ID = d.部署ID
WHERE ds.社員数 >= 5;
\`\`\`

**複数のCTE:**
\`\`\`sql
-- 複数のCTEを使用
WITH
高給社員 AS (
    SELECT 社員ID, 氏名, 給与
    FROM 社員
    WHERE 給与 >= 400000
),
部署統計 AS (
    SELECT
        部署ID,
        COUNT(*) AS 社員数
    FROM 社員
    GROUP BY 部署ID
)
SELECT
    h.氏名,
    h.給与,
    d.部署名,
    ds.社員数
FROM 高給社員 h
JOIN 社員 s ON h.社員ID = s.社員ID
JOIN 部署 d ON s.部署ID = d.部署ID
JOIN 部署統計 ds ON d.部署ID = ds.部署ID;
\`\`\`

**再帰CTE:**
\`\`\`sql
-- 組織階層の取得
WITH RECURSIVE 組織階層 AS (
    -- アンカー部分（トップレベル）
    SELECT
        社員ID,
        氏名,
        上司ID,
        1 AS レベル,
        氏名 AS パス
    FROM 社員
    WHERE 上司ID IS NULL

    UNION ALL

    -- 再帰部分
    SELECT
        s.社員ID,
        s.氏名,
        s.上司ID,
        oh.レベル + 1,
        CONCAT(oh.パス, ' > ', s.氏名)
    FROM 社員 s
    JOIN 組織階層 oh ON s.上司ID = oh.社員ID
    WHERE oh.レベル < 10  -- 無限ループ防止
)
SELECT
    社員ID,
    氏名,
    レベル,
    パス
FROM 組織階層
ORDER BY レベル, 氏名;
\`\`\`

**数列生成:**
\`\`\`sql
-- 日付シーケンスの生成
WITH RECURSIVE 日付シーケンス AS (
    SELECT DATE('2023-01-01') AS 日付
    UNION ALL
    SELECT DATE_ADD(日付, INTERVAL 1 DAY)
    FROM 日付シーケンス
    WHERE 日付 < '2023-12-31'
)
SELECT
    ds.日付,
    COALESCE(s.売上, 0) AS 売上
FROM 日付シーケンス ds
LEFT JOIN 売上データ s ON ds.日付 = s.日付
ORDER BY ds.日付;
\`\`\`

**CTEの利点:**

**可読性向上:**
- 複雑なサブクエリの分割
- 論理的な処理単位の明確化
- コメント的な役割

**再利用性:**
- 同一クエリ内での複数参照
- 計算結果の共有
- 中間結果の再利用

**保守性:**
- 修正箇所の限定
- テストの容易さ
- デバッグの簡素化

**最適化への影響:**
\`\`\`sql
-- 実行計画の確認
EXPLAIN WITH 売上統計 AS (
    SELECT
        商品ID,
        SUM(売上) AS 総売上
    FROM 売上明細
    WHERE 売上日 >= '2023-01-01'
    GROUP BY 商品ID
)
SELECT p.商品名, ss.総売上
FROM 売上統計 ss
JOIN 商品 p ON ss.商品ID = p.商品ID
WHERE ss.総売上 > 100000;
\`\`\`

**注意事項:**
- 再帰CTEでは必ず終了条件を設定
- 過度に複雑なCTEは避ける
- パフォーマンスへの影響を考慮
- DBMSの制限事項を確認`,
        quiz: {
          question: '再帰CTEで必須の要素として正しいものはどれですか？',
          options: [
            'GROUP BY句',
            'ORDER BY句',
            '終了条件',
            'HAVING句'
          ],
          correct: 2,
          explanation: '再帰CTEでは無限ループを防ぐため、必ず終了条件を設定する必要があります。通常はWHERE句で再帰の深度やレコード数を制限します。'
        }
      }
    ]
  },
  {
    id: 3,
    title: 'トランザクション管理',
    sections: [
      {
        title: 'トランザクションとACID特性',
        content: `トランザクションは、データベースに対する一連の処理をまとめた単位です。

**ACID特性:**

**A: Atomicity（原子性）:**
- すべて成功するか、すべて失敗するか
- 中途半端な状態は許されない
- 例: 銀行振込（出金と入金が両方成功）
- 一部が失敗した場合、すべてがロールバック

**C: Consistency（一貫性）:**
- トランザクション前後でデータの整合性を保つ
- 制約違反を起こさない
- ビジネスルールに矛盾しない状態を維持
- 例: 在庫数が負の値にならない

**I: Isolation（独立性）:**
- 複数のトランザクションが干渉しない
- 同時実行しても単独実行と同じ結果
- 分離レベルによって制御
- 例: A社の処理がB社の処理に影響しない

**D: Durability（永続性）:**
- コミット後のデータは永続的に保存
- システム障害が起きても失われない
- ディスクへの書き込み保証
- 例: 注文完了後は停電でも注文データが残る

**トランザクション制御:**
\`\`\`sql
-- トランザクション開始
BEGIN TRANSACTION;

-- 処理1: A口座から出金
UPDATE 口座 SET 残高 = 残高 - 10000
WHERE 口座ID = 'A';

-- 処理2: B口座に入金
UPDATE 口座 SET 残高 = 残高 + 10000
WHERE 口座ID = 'B';

-- 成功時: 確定
COMMIT;

-- エラー時: 取り消し
ROLLBACK;
\`\`\``,
        quiz: {
          question: 'ACID特性のうち、「すべて成功するか、すべて失敗するか」を表すものはどれですか？',
          options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
          correct: 0,
          explanation: 'Atomicity（原子性）は、トランザクション内のすべての処理が成功するか、すべてが失敗するかのどちらかであることを保証する特性です。'
        }
      },
      {
        title: '分離レベル',
        content: `分離レベルは、トランザクション間の独立性の程度を制御します。

**問題となる現象:**

**ダーティリード（Dirty Read）:**
- 未コミットのデータを読む
- トランザクションAの未確定データをBが読む
- 後でAがロールバックすると問題

**非再現リード（Non-Repeatable Read）:**
- 同じデータを2回読んで異なる値
- 他のトランザクションの更新の影響
- 読み取り一貫性の問題

**ファントムリード（Phantom Read）:**
- 同じ検索で異なる結果行数
- 他のトランザクションの挿入・削除の影響
- 集計処理で問題となる

**ロストアップデート（Lost Update）:**
- 更新が失われる
- 同時更新で後の更新が前の更新を上書き

**分離レベルの種類:**

**READ UNCOMMITTED（レベル0）:**
- ダーティリードを許可
- 最も緩い分離レベル
- 性能は最も良い

**READ COMMITTED（レベル1）:**
- ダーティリードを防止
- コミット済みデータのみ読み取り
- 多くのDBMSのデフォルト

**REPEATABLE READ（レベル2）:**
- 非再現リードも防止
- トランザクション中は同じ値を保証
- ファントムリードは発生可能

**SERIALIZABLE（レベル3）:**
- すべての問題を防止
- 逐次実行と同等の結果
- 最も厳しく、性能は最低

**分離レベルの設定:**
\`\`\`sql
-- セッション全体の設定
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- 特定のトランザクション
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
\`\`\``,
        quiz: {
          question: '「READ COMMITTED」分離レベルで防止される現象はどれですか？',
          options: ['ダーティリード', 'ファントムリード', '非再現リード', 'ロストアップデート'],
          correct: 0,
          explanation: 'READ COMMITTED分離レベルでは、コミット済みのデータのみを読み取るため、ダーティリードを防止できます。ただし、非再現リードやファントムリードは発生する可能性があります。'
        }
      },
      {
        title: '同時実行制御',
        content: `複数のトランザクションを同時に実行する際の制御方法です。

**ロック方式:**

**共有ロック（Sロック、読み取りロック）:**
- 読み込み専用のロック
- 複数のトランザクションが同時に取得可能
- 排他ロックの取得を阻止
- SELECT文で取得

**排他ロック（Xロック、書き込みロック）:**
- 書き込み専用のロック
- 1つのトランザクションのみ取得可能
- 他のすべてのロックを阻止
- INSERT, UPDATE, DELETE文で取得

**ロックの互換性:**
\`\`\`
        要求ロック
現在 →   S    X
 S      ○    ×
 X      ×    ×
\`\`\`

**2相ロッキングプロトコル:**
1. **成長相（Expanding Phase）**: ロックの取得のみ
2. **縮小相（Shrinking Phase）**: ロックの解放のみ

**デッドロック:**
- 複数のトランザクションが互いのロック解放を待つ
- 例: TxA（表A→表B）、TxB（表B→表A）

**デッドロック対策:**
- タイムアウト設定
- デッドロック検出アルゴリズム
- ロック順序の統一
- トランザクション時間の短縮

**ロックの粒度:**
- **データベースレベル**: 最も大きい単位
- **テーブルレベル**: テーブル全体をロック
- **ページレベル**: ページ単位でロック
- **行レベル**: 行単位でロック（最も細かい）

**楽観的ロック vs 悲観的ロック:**

**悲観的ロック:**
- 競合が起こることを前提
- 事前にロックを取得
- 確実だが性能が低い

**楽観的ロック:**
- 競合が起こらないことを前提
- 更新時にバージョンチェック
- 性能は良いが競合時に失敗`,
        quiz: {
          question: '共有ロック（Sロック）の特徴として正しいものはどれですか？',
          options: ['書き込み専用である', '複数のトランザクションが同時に取得できる', '1つのトランザクションのみ取得可能', 'データの削除時に使用'],
          correct: 1,
          explanation: '共有ロック（Sロック）は読み取り専用のロックで、複数のトランザクションが同時に取得することができます。主にSELECT文で使用されます。'
        }
      },
      {
        title: '障害回復',
        content: `データベースの障害から回復する仕組みです。

**障害の種類:**

**トランザクション障害:**
- プログラムエラー
- デッドロック
- ユーザーによる中断
- 制約違反

**システム障害:**
- OSの異常終了
- DBMSの異常終了
- 電源障害
- メモリエラー

**メディア障害:**
- ディスクの物理的故障
- ディスクヘッドクラッシュ
- 火災、地震などの災害

**ログファイル:**
データベースの更新履歴を記録するファイル

**更新前ログ（UNDO情報）:**
- 変更前の値を記録
- ロールバック処理で使用
- 未完了トランザクションの取り消し

**更新後ログ（REDO情報）:**
- 変更後の値を記録
- ロールフォワード処理で使用
- 完了トランザクションの再実行

**チェックポイント:**
- 定期的にメモリ内容をディスクに書き出し
- 回復処理の起点
- ダーティページのフラッシュ
- アクティブトランザクションリストの記録

**回復手法:**

**ロールバック（後退復帰）:**
- 未完了トランザクションを取り消し
- 更新前ログを使用
- トランザクション障害に対応

**ロールフォワード（前進復帰）:**
- バックアップから最新状態まで再実行
- 更新後ログを使用
- メディア障害に対応

**回復手順:**
1. バックアップからのリストア
2. ログを使ってロールフォワード
3. 未完了トランザクションのロールバック

**バックアップ方式:**

**フルバックアップ:**
- データベース全体をバックアップ
- 回復時間は短いが、バックアップ時間が長い

**差分バックアップ:**
- 前回のフルバックアップからの変更分
- バックアップ時間は短いが、回復は複数回必要

**増分バックアップ:**
- 前回のバックアップからの変更分
- 最もバックアップ時間は短いが、回復が複雑

**ログバックアップ:**
- トランザクションログのバックアップ
- 最小限のデータ損失で回復可能`,
        quiz: {
          question: 'ロールフォワードで使用するログはどれですか？',
          options: ['更新前ログ', '更新後ログ', 'エラーログ', 'アクセスログ'],
          correct: 1,
          explanation: 'ロールフォワード（前進復帰）では、バックアップ時点から障害発生時点まで、完了したトランザクションを再実行するために更新後ログを使用します。'
        }
      },
      {
        title: 'パフォーマンス・チューニング',
        content: `データベースの性能を改善する技術です。

**性能問題の原因:**
- 不適切なSQL文
- インデックスの不備
- テーブル設計の問題
- ハードウェアリソース不足
- 同時実行による競合

**SQL文の最適化:**

**適切なWHERE句の使用:**
\`\`\`sql
-- 悪い例: 関数を使用
SELECT * FROM 社員 WHERE YEAR(入社日) = 2020;

-- 良い例: 範囲指定
SELECT * FROM 社員
WHERE 入社日 >= '2020-01-01'
  AND 入社日 < '2021-01-01';
\`\`\`

**効率的な結合:**
\`\`\`sql
-- 悪い例: 相関副問合せ
SELECT * FROM 社員 s
WHERE EXISTS (
    SELECT 1 FROM 部署 d
    WHERE d.部署ID = s.部署ID AND d.場所 = '東京'
);

-- 良い例: JOIN使用
SELECT s.* FROM 社員 s
INNER JOIN 部署 d ON s.部署ID = d.部署ID
WHERE d.場所 = '東京';
\`\`\`

**実行計画の確認:**
\`\`\`sql
-- PostgreSQL
EXPLAIN ANALYZE SELECT * FROM 社員 WHERE 部署ID = 10;

-- MySQL
EXPLAIN SELECT * FROM 社員 WHERE 部署ID = 10;

-- SQL Server
SET SHOWPLAN_ALL ON;
SELECT * FROM 社員 WHERE 部署ID = 10;
\`\`\`

**統計情報の更新:**
- DBMSが効率的な実行計画を立てるための情報
- テーブルのデータ量や分布情報
- 定期的な更新が必要

**パーティショニング:**
- 大きなテーブルを小さな部分に分割
- 水平パーティショニング: 行で分割
- 垂直パーティショニング: 列で分割
- 検索性能の向上

**デノーマライゼーション:**
- 正規化を意図的に崩す
- 読み取り性能の向上
- 更新性能とのトレードオフ
- レポート用テーブルなどで使用

**キャッシュの活用:**
- バッファプールサイズの調整
- クエリキャッシュの利用
- アプリケーションレベルキャッシュ

**監視とメンテナンス:**
- スロークエリログの分析
- 待機イベントの監視
- インデックスの断片化チェック
- 統計情報の自動更新設定`,
        quiz: {
          question: 'SQL文の性能改善で、WHERE句に関数を使用する場合の問題点は何ですか？',
          options: [
            '結果が正しくない',
            'インデックスが使用されない',
            'メモリ使用量が増える',
            '同時実行性が低下する'
          ],
          correct: 1,
          explanation: 'WHERE句で列に対して関数を使用すると、多くの場合インデックスが使用されず、フルテーブルスキャンが発生してしまい、性能が低下します。'
        }
      },
      {
        title: 'データベースアーキテクチャ',
        content: `データベースの内部アーキテクチャと構成要素について学習します。

**データベースアーキテクチャの層:**

**3層アーキテクチャ:**
- **外部レベル（ビューレベル）**: ユーザーから見たデータ
- **概念レベル（論理レベル）**: データベース全体の論理構造
- **内部レベル（物理レベル）**: データの物理的格納方法

**データ独立性:**
- **論理的独立性**: 概念スキーマの変更が外部スキーマに影響しない
- **物理的独立性**: 内部スキーマの変更が概念スキーマに影響しない

**DBMSの構成要素:**

**クエリプロセッサ:**
- DDLコンパイラ: スキーマ定義の処理
- DMLコンパイラ: クエリの構文解析と最適化
- クエリ評価エンジン: 実行計画の実行

**ストレージマネージャ:**
- バッファマネージャ: メモリ管理
- ファイルマネージャ: ディスクアクセス制御
- 認可マネージャ: アクセス権限の検査

**物理ストレージ構造:**

**ページ（ブロック）:**
- データの最小読み書き単位
- 通常4KB～64KB
- レコードの集合を格納

**ファイル構造:**
- ヒープファイル: 順序なし
- ソートファイル: キーでソート済み
- ハッシュファイル: ハッシュ関数で配置
- クラスタファイル: 関連レコードを近接配置

**インデックス構造:**

**B+木インデックス:**
- バランスツリー構造
- 範囲検索に適している
- リーフノードにのみデータ
- 高さが低く安定した性能

**ハッシュインデックス:**
- 等価検索に特化
- O(1)の検索性能
- 範囲検索は不可
- 動的な拡張が困難

**ビットマップインデックス:**
- 低カーディナリティに適用
- 複数条件の組み合わせに有効
- データウェアハウスで活用
- 更新コストが高い

**バッファ管理:**

**LRU（Least Recently Used）:**
- 最近最も使われていないページを置き換え
- 時間的局所性を利用
- 実装コストが高い

**Clock Algorithm:**
- LRUの簡易版
- ビットによる参照履歴管理
- 実装が簡単

**メモリ階層:**
- CPUキャッシュ
- メインメモリ
- SSD/HDD
- アーカイブストレージ

**分散データベース:**
- データの分散配置
- 透明性の確保
- 分散クエリ処理
- 分散トランザクション管理`,
        quiz: {
          question: 'データベースの3層アーキテクチャで、論理的独立性が保証するのはどれですか？',
          options: [
            '物理的なデータ配置の変更がアプリケーションに影響しない',
            'データベース構造の変更がアプリケーションに影響しない',
            'ハードウェアの変更がデータベースに影響しない',
            'ネットワーク構成の変更がシステムに影響しない'
          ],
          correct: 1,
          explanation: '論理的独立性は、概念レベル（データベース構造）の変更が外部レベル（アプリケーション）に影響を与えないことを保証します。'
        }
      },
      {
        title: 'レプリケーションとシャーディング',
        content: `大規模システムでのデータ分散とレプリケーション技術について学習します。

**レプリケーション:**
データの複製を複数のサーバーに配置する技術

**マスター・スレーブレプリケーション:**
- 1つのマスター（書き込み）
- 複数のスレーブ（読み取り）
- 非同期レプリケーション
- 読み取り性能の向上

**マスター・マスターレプリケーション:**
- 複数のマスター（書き込み可能）
- 競合の解決が必要
- 高可用性を実現
- 複雑な構成管理

**同期レプリケーション vs 非同期レプリケーション:**

**同期レプリケーション:**
- すべてのレプリカで同時更新
- データ一貫性が高い
- 性能オーバーヘッドが大きい
- ネットワーク障害の影響大

**非同期レプリケーション:**
- 遅延してレプリカに反映
- 高い性能を維持
- 一時的な不整合が発生
- 障害時のデータ損失リスク

**シャーディング（水平分割）:**
データを複数のデータベースに分割する技術

**シャーディング戦略:**

**範囲ベースシャーディング:**
- キーの範囲で分割
- 実装が簡単
- ホットスポットが発生しやすい

**ハッシュベースシャーディング:**
- ハッシュ関数で分割
- 均等な分散
- 範囲クエリが困難

**ディレクトリベースシャーディング:**
- ルックアップサービスを使用
- 柔軟な分割
- 単一障害点の問題

**シャーディングの課題:**

**クロスシャードクエリ:**
- 複数シャードにまたがるクエリ
- 性能低下の原因
- アプリケーション側の複雑化

**リバランシング:**
- データ量の偏りの解決
- シャードの分割・統合
- 運用の複雑さ

**分散システムの課題:**

**CAP定理:**
- **Consistency（一貫性）**: すべてのノードで同じデータ
- **Availability（可用性）**: システムが常に利用可能
- **Partition tolerance（分断耐性）**: ネットワーク分断に耐える

**BASE特性:**
- **Basically Available**: 基本的に利用可能
- **Soft state**: 状態が変化する可能性
- **Eventual consistency**: 最終的に一貫性を達成

**実装例:**
\`\`\`sql
-- 読み書き分離の例
-- 書き込み（マスター）
INSERT INTO users (name, email) VALUES ('田中', 'tanaka@example.com');

-- 読み取り（スレーブ）
SELECT * FROM users WHERE status = 'active';

-- シャーディングキーの例
-- ユーザーIDの下位桁で分割
SELECT * FROM users_shard_0 WHERE user_id % 4 = 0;
SELECT * FROM users_shard_1 WHERE user_id % 4 = 1;
\`\`\`

**運用上の考慮事項:**
- 監視とアラート
- バックアップ戦略
- 災害復旧計画
- 自動フェイルオーバー`,
        quiz: {
          question: 'CAP定理に関して正しい説明はどれですか？',
          options: [
            '3つの特性すべてを同時に満たすことができる',
            'ネットワーク分断時は一貫性と可用性のどちらかを選ぶ必要がある',
            'パーティション耐性は必須ではない',
            '一貫性が最も重要な特性である'
          ],
          correct: 1,
          explanation: 'CAP定理では、ネットワーク分断（P）が発生した際は、一貫性（C）と可用性（A）のどちらかを犠牲にする必要があるとされています。'
        }
      }
    ]
  },
  {
    id: 4,
    title: 'NoSQL・Modern Database',
    sections: [
      {
        title: 'NoSQLデータベースの基礎',
        content: `NoSQLデータベースは、従来のリレーショナルデータベースとは異なるデータモデルを採用します。

**NoSQLの特徴:**
- スキーマレス設計
- 水平スケーラビリティ
- 高いパフォーマンス
- 大容量データへの対応
- CAP定理に基づく設計

**NoSQLの利点:**
- 柔軟なデータ構造
- 高速な読み書き
- 分散処理への適性
- クラウド環境での活用
- 開発効率の向上

**NoSQLの課題:**
- ACID特性の制限
- 結合処理の困難さ
- 標準化不足
- 運用ノウハウの蓄積
- データ一貫性の複雑さ

**NoSQLの4つの主要タイプ:**

**1. キー・バリュー型:**
- 最もシンプルな構造
- キーに対して値を格納
- 高速なアクセス
- セッション管理、キャッシュに適用

**代表例:**
- Redis: インメモリKVS
- Amazon DynamoDB: フルマネージド
- Riak: 分散KVS

**2. ドキュメント型:**
- JSON/XMLライクなドキュメント
- ネストした構造が可能
- スキーマの柔軟性
- Webアプリケーションに適用

**代表例:**
- MongoDB: 最も普及
- CouchDB: HTTPベースAPI
- Amazon DocumentDB: MongoDB互換

**3. カラム型（列指向）:**
- 列単位でデータを格納
- 圧縮効率が高い
- 分析処理に適している
- 大量データの集計に有効

**代表例:**
- Cassandra: 分散型
- HBase: Hadoop基盤
- Google Bigtable: クラウド

**4. グラフ型:**
- ノードとエッジでデータ表現
- 関係性の分析に特化
- ソーシャルネットワーク分析
- 推薦システムに活用

**代表例:**
- Neo4j: 最も有名
- Amazon Neptune: マネージド
- ArangoDB: マルチモデル

**NoSQL選択の指針:**
- データ構造の複雑さ
- スケーラビリティ要件
- 一貫性要件
- 開発チームのスキル
- 運用コスト`,
        quiz: {
          question: 'NoSQLデータベースの特徴として最も適切でないものはどれですか？',
          options: [
            'スキーマレス設計',
            '強い一貫性の保証',
            '水平スケーラビリティ',
            '柔軟なデータ構造'
          ],
          correct: 1,
          explanation: 'NoSQLデータベースは一般的に最終的一貫性（Eventual Consistency）を採用し、RDBMSのような強い一貫性は保証されません。これは高いスケーラビリティとパフォーマンスとのトレードオフです。'
        }
      },
      {
        title: 'MongoDBの基本操作',
        content: `MongoDBは最も普及しているドキュメント型NoSQLデータベースです。

**MongoDB の基本概念:**
- **Database**: データベース
- **Collection**: テーブルに相当
- **Document**: レコードに相当（BSON形式）
- **Field**: カラムに相当

**データ型:**
- String: 文字列
- Number: 数値（Integer, Double）
- Boolean: 真偽値
- Date: 日付
- Array: 配列
- Object: 埋め込みドキュメント
- ObjectId: 一意識別子

**基本操作（CRUD）:**

**Create（作成）:**
\`\`\`javascript
// 単一ドキュメントの挿入
db.users.insertOne({
  name: "田中太郎",
  age: 30,
  email: "tanaka@example.com",
  skills: ["JavaScript", "Python", "MongoDB"]
});

// 複数ドキュメントの挿入
db.users.insertMany([
  {name: "佐藤花子", age: 25, department: "営業"},
  {name: "山田次郎", age: 35, department: "開発"}
]);
\`\`\`

**Read（読み取り）:**
\`\`\`javascript
// 全件取得
db.users.find();

// 条件指定
db.users.find({age: {$gte: 30}});

// 特定フィールドのみ取得（Projection）
db.users.find({}, {name: 1, age: 1, _id: 0});

// ソート
db.users.find().sort({age: -1});

// 制限
db.users.find().limit(5);

// 配列の検索
db.users.find({skills: "JavaScript"});
\`\`\`

**Update（更新）:**
\`\`\`javascript
// 単一ドキュメント更新
db.users.updateOne(
  {name: "田中太郎"},
  {$set: {age: 31}}
);

// 複数ドキュメント更新
db.users.updateMany(
  {department: "営業"},
  {$inc: {bonus: 10000}}
);

// 配列への要素追加
db.users.updateOne(
  {name: "田中太郎"},
  {$push: {skills: "React"}}
);
\`\`\`

**Delete（削除）:**
\`\`\`javascript
// 単一ドキュメント削除
db.users.deleteOne({name: "田中太郎"});

// 複数ドキュメント削除
db.users.deleteMany({age: {$lt: 25}});
\`\`\`

**クエリ演算子:**
- $eq: 等しい
- $ne: 等しくない
- $gt/$gte: より大きい/以上
- $lt/$lte: より小さい/以下
- $in/$nin: 配列に含まれる/含まれない
- $and/$or: 論理演算
- $exists: フィールドの存在確認
- $regex: 正規表現

**集約パイプライン:**
\`\`\`javascript
db.users.aggregate([
  {$match: {age: {$gte: 25}}},
  {$group: {
    _id: "$department",
    avgAge: {$avg: "$age"},
    count: {$sum: 1}
  }},
  {$sort: {avgAge: -1}}
]);
\`\`\`

**インデックス:**
\`\`\`javascript
// 単一フィールドインデックス
db.users.createIndex({email: 1});

// 複合インデックス
db.users.createIndex({department: 1, age: -1});

// テキストインデックス
db.users.createIndex({name: "text"});
\`\`\``,
        quiz: {
          question: 'MongoDBでドキュメントを更新する際、配列フィールドに新しい要素を追加するオペレータはどれですか？',
          options: [
            '$set',
            '$push',
            '$inc',
            '$unset'
          ],
          correct: 1,
          explanation: '$pushオペレータは配列フィールドに新しい要素を追加するために使用されます。$setは値の設定、$incは数値の増減、$unsetはフィールドの削除に使用されます。'
        }
      },
      {
        title: 'RedisとKVSの活用',
        content: `Redisはインメモリキー・バリューストアの代表的なデータベースです。

**Redisの特徴:**
- インメモリデータベース
- 高速なアクセス性能
- 豊富なデータ構造
- 永続化オプション
- レプリケーション機能

**Redis のデータ型:**

**String（文字列）:**
\`\`\`
SET user:1000:name "田中太郎"
GET user:1000:name
INCR page_views
EXPIRE session:abc123 3600
\`\`\`

**Hash（ハッシュ）:**
\`\`\`
HSET user:1000 name "田中太郎" age 30 email "tanaka@example.com"
HGET user:1000 name
HGETALL user:1000
HINCRBY user:1000 age 1
\`\`\`

**List（リスト）:**
\`\`\`
LPUSH task_queue "task1" "task2"
RPOP task_queue
LRANGE notifications 0 -1
LTRIM recent_logs 0 99
\`\`\`

**Set（セット）:**
\`\`\`
SADD user:1000:skills "JavaScript" "Python" "Redis"
SMEMBERS user:1000:skills
SINTER user:1000:skills user:2000:skills
SCARD user:1000:skills
\`\`\`

**Sorted Set（ソート済みセット）:**
\`\`\`
ZADD leaderboard 1500 "player1" 1200 "player2"
ZRANGE leaderboard 0 -1 WITHSCORES
ZREVRANK leaderboard "player1"
ZINCRBY leaderboard 100 "player1"
\`\`\`

**主な用途:**

**セッション管理:**
\`\`\`
SET session:abc123 "user_id:1000" EX 1800
GET session:abc123
DEL session:abc123
\`\`\`

**キャッシュ:**
\`\`\`
SET cache:user:1000 '{"name":"田中","age":30}' EX 300
GET cache:user:1000
\`\`\`

**リアルタイム分析:**
\`\`\`
INCR page_views:2023-12-01
HINCRBY site_stats daily_users 1
ZADD popular_pages 1 "/home"
\`\`\`

**メッセージキュー:**
\`\`\`
LPUSH job_queue '{"type":"email","to":"user@example.com"}'
BRPOP job_queue 0
\`\`\`

**永続化オプション:**

**RDB（Redis Database Backup）:**
- ポイントインタイムスナップショット
- 定期的にメモリ内容をディスクに保存
- 復旧時間が短い
- データ損失の可能性

**AOF（Append Only File）:**
- すべての書き込み操作をログ
- データ損失のリスクが低い
- ファイルサイズが大きくなる
- 復旧時間が長い

**レプリケーション:**
- マスター・スレーブ構成
- 自動フェイルオーバー（Redis Sentinel）
- 読み取り性能の向上
- 高可用性の実現

**Redis Cluster:**
- 水平分散（シャーディング）
- 自動フェイルオーバー
- 最大1000ノード
- ハッシュスロットによる分散

**パフォーマンス最適化:**
- メモリ最適化
- パイプライン処理
- 適切な有効期限設定
- モニタリングと調整

**注意事項:**
- メモリ容量の制限
- シングルスレッドの特性
- ネットワーク分断の影響
- データ一貫性の考慮`,
        quiz: {
          question: 'Redisで要素にスコアを付けて順序付きでデータを格納するデータ型はどれですか？',
          options: [
            'List',
            'Set',
            'Sorted Set',
            'Hash'
          ],
          correct: 2,
          explanation: 'Sorted Set（ソート済みセット）は各要素にスコアを付けて自動的にスコア順でソートされる状態で格納します。ランキングやリーダーボードの実装に適しています。'
        }
      },
      {
        title: 'グラフデータベース（Neo4j）',
        content: `グラフデータベースは、ノードとエッジ（関係）でデータを表現するデータベースです。

**グラフデータベースの概念:**
- **Node（ノード）**: エンティティ（人、商品、場所など）
- **Relationship（関係）**: ノード間の関連性
- **Property（プロパティ）**: ノードや関係の属性
- **Label（ラベル）**: ノードの分類

**Neo4jの特徴:**
- 高性能なグラフトラバーサル
- ACID特性をサポート
- Cypherクエリ言語
- 豊富な可視化ツール
- スケーラブルなアーキテクチャ

**Cypherクエリ言語:**

**ノードの作成:**
\`\`\`cypher
// 人ノードの作成
CREATE (p:Person {name: '田中太郎', age: 30, city: '東京'})

// 会社ノードの作成
CREATE (c:Company {name: 'ABC株式会社', industry: 'IT'})
\`\`\`

**関係の作成:**
\`\`\`cypher
// 雇用関係の作成
MATCH (p:Person {name: '田中太郎'})
MATCH (c:Company {name: 'ABC株式会社'})
CREATE (p)-[:WORKS_FOR {since: 2020, position: 'エンジニア'}]->(c)

// 友人関係の作成
MATCH (p1:Person {name: '田中太郎'})
MATCH (p2:Person {name: '佐藤花子'})
CREATE (p1)-[:FRIEND_OF {since: '2015-03-01'}]->(p2)
\`\`\`

**データの検索:**
\`\`\`cypher
// 特定の人を検索
MATCH (p:Person {name: '田中太郎'})
RETURN p

// 関係を含む検索
MATCH (p:Person)-[:WORKS_FOR]->(c:Company)
RETURN p.name, c.name

// パスの検索
MATCH path = (p1:Person)-[:FRIEND_OF*1..3]-(p2:Person)
WHERE p1.name = '田中太郎' AND p2.name = '山田次郎'
RETURN path
\`\`\`

**複雑なクエリ例:**

**共通の友人を探す:**
\`\`\`cypher
MATCH (p1:Person {name: '田中太郎'})-[:FRIEND_OF]-(mutual)-[:FRIEND_OF]-(p2:Person {name: '佐藤花子'})
RETURN mutual.name AS 共通の友人
\`\`\`

**推薦システム:**
\`\`\`cypher
// 友人の友人で、まだ友人でない人を推薦
MATCH (p:Person {name: '田中太郎'})-[:FRIEND_OF]-()-[:FRIEND_OF]-(recommend)
WHERE NOT (p)-[:FRIEND_OF]-(recommend) AND p <> recommend
RETURN recommend.name, COUNT(*) AS 共通友人数
ORDER BY 共通友人数 DESC
\`\`\`

**最短パス:**
\`\`\`cypher
MATCH path = shortestPath(
  (start:Person {name: '田中太郎'})-[*]-(end:Person {name: '山田次郎'})
)
RETURN path, length(path)
\`\`\`

**グラフアルゴリズム:**

**PageRank:**
\`\`\`cypher
CALL gds.pageRank.stream('myGraph')
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name AS name, score
ORDER BY score DESC
\`\`\`

**コミュニティ検出:**
\`\`\`cypher
CALL gds.louvain.stream('myGraph')
YIELD nodeId, communityId
RETURN gds.util.asNode(nodeId).name AS name, communityId
ORDER BY communityId
\`\`\`

**中心性分析:**
\`\`\`cypher
CALL gds.betweenness.stream('myGraph')
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name AS name, score
ORDER BY score DESC
\`\`\`

**実用例:**

**ソーシャルネットワーク:**
- 友人関係の分析
- 影響力のある人の特定
- コミュニティの発見

**推薦エンジン:**
- 協調フィルタリング
- コンテンツベース推薦
- ハイブリッド推薦

**不正検知:**
- 異常なパターンの検出
- リンク分析
- リスク評価

**ナレッジグラフ:**
- 知識の関係性表現
- セマンティック検索
- 質問応答システム

**パフォーマンス最適化:**
- 適切なインデックス設計
- クエリプロファイリング
- メモリ管理
- パーティショニング戦略`,
        quiz: {
          question: 'Neo4jのCypherクエリで、2つのノード間の最短パスを見つけるために使用する関数はどれですか？',
          options: [
            'MATCH path',
            'shortestPath()',
            'FIND_PATH()',
            'MIN_DISTANCE()'
          ],
          correct: 1,
          explanation: 'Neo4jのCypherクエリでは、shortestPath()関数を使用して2つのノード間の最短パスを見つけることができます。この関数はグラフトラバーサルを最適化して効率的にパスを検索します。'
        }
      },
      {
        title: 'NewSQL・分散SQL',
        content: `NewSQLは、RDBMSの利点とNoSQLのスケーラビリティを組み合わせた新世代のデータベースです。

**NewSQLの特徴:**
- SQLインターフェース
- ACID特性の保証
- 水平スケーラビリティ
- 高いパフォーマンス
- 分散アーキテクチャ

**NewSQLの登場背景:**
- ビッグデータの増加
- クラウドコンピューティングの普及
- リアルタイム処理の需要
- 開発者の慣れ親しんだSQL

**主要なNewSQLデータベース:**

**Google Spanner:**
- グローバル分散データベース
- 外部一貫性の保証
- GPS・原子時計による同期
- 水平スケーリング

**CockroachDB:**
- PostgreSQL互換
- 分散SQL処理
- 自動レプリケーション
- 障害時の自動復旧

**TiDB:**
- MySQL互換プロトコル
- HTAP（トランザクション＋分析）
- 水平分散
- オープンソース

**VoltDB:**
- インメモリ処理
- 超高速トランザクション
- ACID保証
- ストリーム処理

**分散SQLの課題と解決:**

**分散ACID:**
- 2相コミット（2PC）
- 3相コミット（3PC）
- Paxos・Raftアルゴリズム
- MVCC（Multi-Version Concurrency Control）

**分散クエリ最適化:**
- クエリプランナー
- コストベース最適化
- ネットワーク転送の最小化
- ローカル処理の最大化

**分散結合処理:**
\`\`\`sql
-- 分散テーブル間の結合
SELECT c.customer_name, o.order_date, oi.product_name
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
WHERE c.region = 'Asia'
AND o.order_date >= '2023-01-01';
\`\`\`

**シャーディング戦略:**

**Range Sharding:**
\`\`\`sql
-- 地域別分散
CREATE TABLE orders (
    order_id INT,
    customer_id INT,
    region VARCHAR(50),
    order_date DATE
) PARTITION BY RANGE (region);
\`\`\`

**Hash Sharding:**
\`\`\`sql
-- ハッシュ値による分散
CREATE TABLE users (
    user_id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
) PARTITION BY HASH(user_id) PARTITIONS 4;
\`\`\`

**分散トランザクション:**
\`\`\`sql
BEGIN;
-- 複数のシャードにまたがる処理
UPDATE accounts SET balance = balance - 1000 WHERE account_id = 'A001';
UPDATE accounts SET balance = balance + 1000 WHERE account_id = 'B002';
-- 原子性を保証してコミット
COMMIT;
\`\`\`

**一貫性レベル:**

**Strong Consistency:**
- すべてのレプリカで同じデータ
- 高いレイテンシ
- 銀行システムなどで必須

**Eventual Consistency:**
- 最終的に一貫性を達成
- 低いレイテンシ
- SNSなどで許容可能

**Causal Consistency:**
- 因果関係のある操作の順序保証
- 中間的な一貫性
- チャットシステムなどに適用

**HTAPアーキテクチャ:**
- **OLTP**: トランザクション処理
- **OLAP**: 分析処理
- 同一データベースで両方をサポート
- リアルタイム分析の実現

**運用上の考慮事項:**
- 自動シャーディング
- 動的スケーリング
- 監視とアラート
- バックアップ戦略
- 災害復旧

**NewSQL選択の指針:**
- 既存SQLスキルの活用
- ACID特性の必要性
- スケーラビリティ要件
- 一貫性要件
- 運用コスト`,
        quiz: {
          question: 'NewSQLデータベースの主な特徴として正しくないものはどれですか？',
          options: [
            'SQLインターフェースの提供',
            'ACID特性の保証',
            '水平スケーラビリティ',
            'スキーマレス設計'
          ],
          correct: 3,
          explanation: 'NewSQLデータベースは基本的にリレーショナルモデルに基づいており、スキーマレス設計ではありません。SQLインターフェース、ACID特性、水平スケーラビリティはNewSQLの主要な特徴です。'
        }
      }
    ]
  },
  {
    id: 5,
    title: 'Data Warehousing・Analytics',
    sections: [
      {
        title: 'データウェアハウスの基礎',
        content: `データウェアハウス（DWH）は、分析を目的とした統合データストアです。

**データウェアハウスの特徴:**
- **主題指向（Subject-Oriented）**: 業務領域別にデータを整理
- **統合（Integrated）**: 複数システムのデータを統合
- **時系列（Time-Variant）**: 時間軸でのデータ管理
- **非揮発性（Non-Volatile）**: データの削除・更新が少ない

**OLTPとOLAPの違い:**

**OLTP（Online Transaction Processing）:**
- 日常業務の処理
- 高頻度の更新
- 正規化されたデータ
- レスポンス重視
- 少量データの処理

**OLAP（Online Analytical Processing）:**
- 分析・レポート処理
- 読み取り中心
- 非正規化されたデータ
- スループット重視
- 大量データの集約

**データウェアハウスアーキテクチャ:**

**従来型（Inmon方式）:**
- トップダウンアプローチ
- 正規化されたデータモデル
- データマートの構築
- 企業全体の統一ビュー

**ディメンショナルモデリング（Kimball方式）:**
- ボトムアップアプローチ
- スタースキーマ設計
- ビジネスプロセス中心
- 段階的な構築

**スタースキーマ:**
\`\`\`sql
-- ファクトテーブル（売上事実）
CREATE TABLE sales_fact (
    sales_id INT PRIMARY KEY,
    product_key INT,
    customer_key INT,
    date_key INT,
    store_key INT,
    quantity INT,
    unit_price DECIMAL(10,2),
    total_amount DECIMAL(12,2)
);

-- ディメンションテーブル（商品次元）
CREATE TABLE product_dim (
    product_key INT PRIMARY KEY,
    product_id VARCHAR(20),
    product_name VARCHAR(100),
    category VARCHAR(50),
    subcategory VARCHAR(50),
    brand VARCHAR(50)
);

-- ディメンションテーブル（日付次元）
CREATE TABLE date_dim (
    date_key INT PRIMARY KEY,
    full_date DATE,
    year INT,
    quarter INT,
    month INT,
    week INT,
    day_of_week VARCHAR(10)
);
\`\`\`

**スノーフレークスキーマ:**
- ディメンションテーブルの正規化
- ストレージ効率の向上
- クエリの複雑化
- 保守性とのトレードオフ

**ETLプロセス:**

**Extract（抽出）:**
\`\`\`sql
-- ソースシステムからのデータ抽出
SELECT order_id, customer_id, product_id, order_date, quantity, price
FROM source_orders
WHERE order_date >= '2023-01-01'
AND updated_at > LAST_ETL_RUN;
\`\`\`

**Transform（変換）:**
\`\`\`sql
-- データクレンジングと変換
SELECT
    o.order_id,
    COALESCE(c.customer_name, 'Unknown') AS customer_name,
    p.product_name,
    TO_DATE(o.order_date, 'YYYY-MM-DD') AS order_date,
    o.quantity,
    o.price,
    o.quantity * o.price AS total_amount,
    CASE
        WHEN o.quantity > 10 THEN 'Bulk'
        ELSE 'Standard'
    END AS order_type
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.customer_id
LEFT JOIN products p ON o.product_id = p.product_id
WHERE o.price > 0 AND o.quantity > 0;
\`\`\`

**Load（ロード）:**
\`\`\`sql
-- データウェアハウスへのロード
INSERT INTO sales_fact (
    product_key, customer_key, date_key,
    quantity, unit_price, total_amount
)
SELECT
    pd.product_key,
    cd.customer_key,
    dd.date_key,
    st.quantity,
    st.unit_price,
    st.total_amount
FROM staging_table st
JOIN product_dim pd ON st.product_id = pd.product_id
JOIN customer_dim cd ON st.customer_id = cd.customer_id
JOIN date_dim dd ON st.order_date = dd.full_date;
\`\`\`

**緩やかに変化する次元（SCD）:**

**Type 1（上書き）:**
\`\`\`sql
-- 顧客の住所変更
UPDATE customer_dim
SET address = '新住所', city = '新都市'
WHERE customer_id = 'C001';
\`\`\`

**Type 2（履歴保持）:**
\`\`\`sql
-- 履歴レコードの無効化
UPDATE customer_dim
SET valid_to = CURRENT_DATE, is_current = FALSE
WHERE customer_id = 'C001' AND is_current = TRUE;

-- 新しいレコードの追加
INSERT INTO customer_dim (
    customer_id, customer_name, address, city,
    valid_from, valid_to, is_current
) VALUES (
    'C001', '田中太郎', '新住所', '新都市',
    CURRENT_DATE, '9999-12-31', TRUE
);
\`\`\`

**Type 3（別カラム）:**
\`\`\`sql
-- 以前の値を保持するカラムを追加
ALTER TABLE customer_dim
ADD COLUMN previous_address VARCHAR(200);

UPDATE customer_dim
SET previous_address = address,
    address = '新住所'
WHERE customer_id = 'C001';
\`\`\`

**データマート:**
- 特定部門向けの小規模DWH
- 迅速な構築・配備
- 部門固有の要件に対応
- 全社DWHのサブセット`,
        quiz: {
          question: 'データウェアハウスの特徴として正しくないものはどれですか？',
          options: [
            '主題指向でデータが整理されている',
            '複数システムのデータが統合されている',
            '高頻度でデータの更新が行われる',
            '時系列でデータが管理されている'
          ],
          correct: 2,
          explanation: 'データウェアハウスは非揮発性（Non-Volatile）が特徴の一つで、データの削除・更新は少なく、主に読み取り中心の処理が行われます。高頻度の更新はOLTPシステムの特徴です。'
        }
      },
      {
        title: 'OLAP・多次元分析',
        content: `OLAP（Online Analytical Processing）は多次元データの分析を効率的に行う技術です。

**OLAPの基本概念:**
- **キューブ**: 多次元データの集合
- **ディメンション**: 分析軸（時間、地域、商品など）
- **メジャー**: 分析対象の数値（売上、数量など）
- **階層**: ディメンション内の詳細レベル

**OLAPの操作:**

**ドリルダウン（Drill-Down）:**
- 上位レベルから下位レベルへ
- 年→四半期→月→日
- より詳細な分析

**ドリルアップ（Drill-Up）:**
- 下位レベルから上位レベルへ
- 詳細から概要へ
- サマリー分析

**スライス（Slice）:**
- 特定の次元で切り出し
- 例: 2023年のデータのみ抽出
- 次元数の削減

**ダイス（Dice）:**
- 複数次元での切り出し
- 例: 2023年かつ東京地区のデータ
- より具体的な分析

**ピボット（Pivot）:**
- 次元の回転・入れ替え
- 行と列の入れ替え
- 異なる視点での分析

**OLAPの実装方式:**

**MOLAP（Multidimensional OLAP）:**
- 専用の多次元データベース
- 事前計算されたキューブ
- 高速なクエリ性能
- ストレージ効率の課題

**ROLAP（Relational OLAP）:**
- リレーショナルDB上に実装
- スタースキーマの活用
- 柔軟なデータ容量
- クエリ時の計算負荷

**HOLAP（Hybrid OLAP）:**
- MOLAPとROLAPの組み合わせ
- 集約データはMOLAP
- 詳細データはROLAP
- バランスの取れた性能

**MDX（Multidimensional Expressions）:**
多次元データ分析用のクエリ言語

\`\`\`mdx
-- 基本的なMDXクエリ
SELECT
    [Measures].[Sales Amount] ON COLUMNS,
    [Product].[Product Category].Members ON ROWS
FROM [Sales Cube]
WHERE [Time].[Year].[2023]

-- ドリルダウンの例
SELECT
    [Measures].[Sales Amount] ON COLUMNS,
    DRILLDOWNMEMBER(
        [Product].[Product Category].Members,
        [Product].[Product Category].[Electronics]
    ) ON ROWS
FROM [Sales Cube]
\`\`\`

**キューブ設計の考慮事項:**

**粒度の決定:**
- 最小単位での保存
- 集約レベルの事前計算
- パフォーマンスとストレージのバランス

**ディメンション設計:**
\`\`\`sql
-- 時間ディメンション階層
CREATE TABLE time_dimension (
    time_key INT PRIMARY KEY,
    date DATE,
    day_of_week VARCHAR(10),
    week_number INT,
    month_number INT,
    quarter_number INT,
    year_number INT,
    fiscal_year INT
);

-- 地域ディメンション階層
CREATE TABLE geography_dimension (
    geography_key INT PRIMARY KEY,
    country VARCHAR(50),
    region VARCHAR(50),
    state VARCHAR(50),
    city VARCHAR(50),
    postal_code VARCHAR(10)
);
\`\`\`

**集約テーブル:**
\`\`\`sql
-- 月次集約テーブル
CREATE TABLE monthly_sales_summary (
    year_month VARCHAR(7),
    product_category VARCHAR(50),
    region VARCHAR(50),
    total_sales DECIMAL(15,2),
    total_quantity INT,
    avg_unit_price DECIMAL(10,2)
);

-- 四半期集約テーブル
CREATE TABLE quarterly_sales_summary (
    year_quarter VARCHAR(6),
    product_line VARCHAR(50),
    total_sales DECIMAL(15,2),
    sales_growth_pct DECIMAL(5,2)
);
\`\`\`

**インクリメンタル処理:**
\`\`\`sql
-- 差分データの処理
INSERT INTO sales_cube
SELECT
    p.product_key,
    c.customer_key,
    d.date_key,
    SUM(f.quantity) AS total_quantity,
    SUM(f.sales_amount) AS total_sales
FROM fact_sales f
JOIN dim_product p ON f.product_id = p.product_id
JOIN dim_customer c ON f.customer_id = c.customer_id
JOIN dim_date d ON f.sales_date = d.date_value
WHERE f.sales_date >= DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY)
GROUP BY p.product_key, c.customer_key, d.date_key;
\`\`\`

**パフォーマンス最適化:**
- 適切なインデックス設計
- パーティショニング
- マテリアライズドビュー
- 集約の事前計算

**OLAPツール:**
- Microsoft Analysis Services
- Oracle OLAP
- IBM Cognos
- SAP BW
- Pentaho
- Apache Kylin

**ビジネス価値:**
- 迅速な意思決定支援
- トレンド分析
- 予測分析
- KPIモニタリング
- セルフサービス分析`,
        quiz: {
          question: 'OLAPの操作で、上位レベルから下位レベルに詳細化する操作はどれですか？',
          options: [
            'ドリルアップ',
            'ドリルダウン',
            'スライス',
            'ピボット'
          ],
          correct: 1,
          explanation: 'ドリルダウンは上位レベルから下位レベルへの詳細化操作です。例えば年→四半期→月のように、より詳細なレベルでデータを分析する際に使用されます。'
        }
      },
      {
        title: 'ビッグデータ・Hadoop',
        content: `ビッグデータ処理のためのHadoopエコシステムについて学習します。

**ビッグデータの特徴（4V）:**
- **Volume（量）**: 大容量データ
- **Velocity（速度）**: 高速なデータ生成
- **Variety（多様性）**: 様々な形式のデータ
- **Veracity（信頼性）**: データの品質・信頼性

**Hadoopの基本構成:**

**HDFS（Hadoop Distributed File System）:**
- 分散ファイルシステム
- 大容量ファイルの分散保存
- 耐障害性（レプリケーション）
- 高いスループット

**HDFS アーキテクチャ:**
- **NameNode**: メタデータ管理
- **DataNode**: 実際のデータ保存
- **Secondary NameNode**: NameNodeのバックアップ

**MapReduce:**
分散並列処理フレームワーク

**Map フェーズ:**
\`\`\`java
// 単語カウントのMap関数例
public class WordCountMapper extends Mapper<LongWritable, Text, Text, IntWritable> {
    private final static IntWritable one = new IntWritable(1);
    private Text word = new Text();

    @Override
    public void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
        StringTokenizer tokenizer = new StringTokenizer(value.toString());
        while (tokenizer.hasMoreTokens()) {
            word.set(tokenizer.nextToken());
            context.write(word, one);
        }
    }
}
\`\`\`

**Reduce フェーズ:**
\`\`\`java
// 単語カウントのReduce関数例
public class WordCountReducer extends Reducer<Text, IntWritable, Text, IntWritable> {
    private IntWritable result = new IntWritable();

    @Override
    public void reduce(Text key, Iterable<IntWritable> values, Context context) throws IOException, InterruptedException {
        int sum = 0;
        for (IntWritable value : values) {
            sum += value.get();
        }
        result.set(sum);
        context.write(key, result);
    }
}
\`\`\`

**YARN（Yet Another Resource Negotiator）:**
- リソース管理フレームワーク
- ResourceManager: クラスタ全体のリソース管理
- NodeManager: ノードレベルのリソース管理
- ApplicationMaster: アプリケーション固有の管理

**Hadoopエコシステム:**

**Apache Hive:**
- SQL ライクなクエリ言語（HiveQL）
- データウェアハウス機能
- バッチ処理に適している

\`\`\`sql
-- Hive テーブルの作成
CREATE TABLE sales_data (
    product_id STRING,
    customer_id STRING,
    sales_date STRING,
    quantity INT,
    price DOUBLE
)
PARTITIONED BY (year INT, month INT)
STORED AS PARQUET;

-- Hive クエリ例
SELECT
    year,
    month,
    SUM(quantity * price) AS total_sales
FROM sales_data
WHERE year = 2023
GROUP BY year, month
ORDER BY month;
\`\`\`

**Apache Pig:**
- データフロー言語（Pig Latin）
- ETL処理に適している
- 高レベルなデータ操作

\`\`\`pig
-- Pig スクリプト例
sales = LOAD 'sales_data.txt' USING PigStorage(',') AS (product_id:chararray, customer_id:chararray, quantity:int, price:double);
grouped_sales = GROUP sales BY product_id;
product_summary = FOREACH grouped_sales GENERATE group AS product_id, SUM(sales.quantity) AS total_quantity;
STORE product_summary INTO 'product_summary';
\`\`\`

**Apache HBase:**
- NoSQL データベース
- ランダムアクセス可能
- リアルタイム処理

\`\`\`java
// HBase Java API例
Configuration config = HBaseConfiguration.create();
HTable table = new HTable(config, "user_data");

Put put = new Put(Bytes.toBytes("user123"));
put.add(Bytes.toBytes("profile"), Bytes.toBytes("name"), Bytes.toBytes("田中太郎"));
put.add(Bytes.toBytes("profile"), Bytes.toBytes("age"), Bytes.toBytes("30"));
table.put(put);

Get get = new Get(Bytes.toBytes("user123"));
Result result = table.get(get);
String name = Bytes.toString(result.getValue(Bytes.toBytes("profile"), Bytes.toBytes("name")));
\`\`\`

**Apache Spark:**
- インメモリ処理
- Hadoopの次世代フレームワーク
- バッチ・ストリーム処理の統合

\`\`\`scala
// Spark Scala例
import org.apache.spark.sql.SparkSession

val spark = SparkSession.builder()
  .appName("SalesAnalysis")
  .getOrCreate()

val salesDF = spark.read
  .option("header", "true")
  .csv("hdfs://sales_data.csv")

salesDF.createOrReplaceTempView("sales")

val result = spark.sql("""
  SELECT product_category, SUM(sales_amount) as total_sales
  FROM sales
  WHERE sales_date >= '2023-01-01'
  GROUP BY product_category
  ORDER BY total_sales DESC
""")

result.show()
\`\`\`

**Apache Kafka:**
- 分散ストリーミングプラットフォーム
- リアルタイムデータパイプライン
- 高いスループットとフォルトトレラント

**データレイク:**
- 構造化・非構造化データの統合保存
- スキーマオンリード
- コスト効率的なストレージ
- 分析の柔軟性

**クラウドでのビッグデータ:**
- Amazon EMR
- Google Dataproc
- Azure HDInsight
- マネージドサービスの活用

**ビッグデータ分析の課題:**
- データ品質の確保
- プライバシー・セキュリティ
- スキル・人材不足
- コスト管理
- リアルタイム処理要件`,
        quiz: {
          question: 'Hadoopのコア コンポーネントでメタデータ管理を行うのはどれですか？',
          options: [
            'DataNode',
            'NameNode',
            'ResourceManager',
            'NodeManager'
          ],
          correct: 1,
          explanation: 'NameNodeはHDFSのマスターサーバーで、ファイルシステムのメタデータ（ファイル名、ディレクトリ構造、ファイルの場所など）を管理します。DataNodeは実際のデータブロックを保存します。'
        }
      },
      {
        title: 'データマイニング・機械学習',
        content: `データベースから有用な知識を発見するデータマイニングと機械学習について学習します。

**データマイニングとは:**
- 大量データからのパターン発見
- 統計学・機械学習の応用
- ビジネス価値の創出
- 予測・分類・関連性の発見

**KDD（Knowledge Discovery in Databases）プロセス:**
1. **選択（Selection）**: 対象データの選択
2. **前処理（Preprocessing）**: データクリーニング
3. **変換（Transformation）**: データ変換
4. **データマイニング**: パターン発見
5. **解釈・評価**: 結果の評価

**データマイニングの手法:**

**分類（Classification）:**
既知のカテゴリにデータを分類

\`\`\`sql
-- 顧客分類のための特徴量抽出
SELECT
    customer_id,
    age,
    gender,
    total_purchases,
    avg_order_value,
    days_since_last_purchase,
    CASE
        WHEN total_purchases >= 10 AND avg_order_value >= 10000 THEN 'Premium'
        WHEN total_purchases >= 5 AND avg_order_value >= 5000 THEN 'Regular'
        ELSE 'Basic'
    END AS customer_segment
FROM customer_summary;
\`\`\`

**回帰（Regression）:**
数値の予測

\`\`\`sql
-- 売上予測のための線形回帰データ準備
SELECT
    month_year,
    advertising_spend,
    seasonal_index,
    competitor_count,
    monthly_sales
FROM sales_monthly
ORDER BY month_year;
\`\`\`

**クラスタリング（Clustering）:**
類似データのグループ化

\`\`\`sql
-- K-meansクラスタリング用データ準備
SELECT
    customer_id,
    recency,  -- 最新購入からの日数
    frequency, -- 購入頻度
    monetary   -- 購入金額
FROM (
    SELECT
        customer_id,
        DATEDIFF(CURRENT_DATE, MAX(order_date)) AS recency,
        COUNT(*) AS frequency,
        SUM(order_amount) AS monetary
    FROM orders
    WHERE order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 2 YEAR)
    GROUP BY customer_id
) rfm_data;
\`\`\`

**アソシエーション分析:**
アイテム間の関連性発見

\`\`\`sql
-- マーケットバスケット分析
SELECT
    a.product_name AS product_a,
    b.product_name AS product_b,
    COUNT(*) AS co_occurrence,
    COUNT(*) * 1.0 / total_transactions AS confidence
FROM order_items oi1
JOIN order_items oi2 ON oi1.order_id = oi2.order_id AND oi1.product_id < oi2.product_id
JOIN products a ON oi1.product_id = a.product_id
JOIN products b ON oi2.product_id = b.product_id
CROSS JOIN (
    SELECT COUNT(DISTINCT order_id) AS total_transactions
    FROM order_items
) t
GROUP BY a.product_name, b.product_name, total_transactions
HAVING COUNT(*) >= 10
ORDER BY confidence DESC;
\`\`\`

**異常検知（Anomaly Detection）:**
正常パターンからの逸脱検知

\`\`\`sql
-- Zスコアによる異常検知
WITH transaction_stats AS (
    SELECT
        AVG(amount) AS mean_amount,
        STDDEV(amount) AS std_amount
    FROM transactions
    WHERE transaction_date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
)
SELECT
    transaction_id,
    customer_id,
    amount,
    (amount - mean_amount) / std_amount AS z_score
FROM transactions t
CROSS JOIN transaction_stats ts
WHERE ABS((amount - mean_amount) / std_amount) > 3
ORDER BY ABS((amount - mean_amount) / std_amount) DESC;
\`\`\`

**機械学習アルゴリズム:**

**決定木（Decision Tree）:**
- 分岐条件による分類
- 解釈しやすい
- 過学習の傾向

\`\`\`sql
-- 決定木用の訓練データ
SELECT
    age,
    income,
    credit_score,
    CASE WHEN default_flag = 1 THEN 'Default' ELSE 'No Default' END AS target
FROM loan_applications
WHERE application_date < '2023-01-01';
\`\`\`

**ランダムフォレスト:**
- 複数の決定木の組み合わせ
- 高い予測精度
- 特徴量重要度の算出

**ニューラルネットワーク:**
- 脳の神経回路を模倣
- 複雑なパターン学習
- 深層学習への発展

**サポートベクターマシン（SVM）:**
- 高次元データの分類
- カーネルトリック
- 汎化性能が高い

**特徴量エンジニアリング:**

\`\`\`sql
-- 特徴量の生成と変換
SELECT
    customer_id,
    -- 基本特徴量
    age,
    income,
    -- 派生特徴量
    CASE
        WHEN age < 25 THEN 'Young'
        WHEN age < 50 THEN 'Middle'
        ELSE 'Senior'
    END AS age_group,
    -- 比率特徴量
    debt_amount / income AS debt_to_income_ratio,
    -- 統計特徴量
    (income - avg_income) / std_income AS income_z_score,
    -- 時系列特徴量
    EXTRACT(MONTH FROM registration_date) AS registration_month,
    DATEDIFF(CURRENT_DATE, last_activity_date) AS days_inactive
FROM customers c
CROSS JOIN (
    SELECT AVG(income) AS avg_income, STDDEV(income) AS std_income
    FROM customers
) stats;
\`\`\`

**モデル評価指標:**

**分類問題:**
- 正解率（Accuracy）
- 適合率（Precision）
- 再現率（Recall）
- F1スコア
- AUC-ROC

**回帰問題:**
- 平均絶対誤差（MAE）
- 平均二乗誤差（MSE）
- 決定係数（R²）

**クロスバリデーション:**
\`\`\`sql
-- 訓練・検証・テストデータの分割
SELECT
    *,
    CASE
        WHEN RAND() < 0.6 THEN 'train'
        WHEN RAND() < 0.8 THEN 'validation'
        ELSE 'test'
    END AS data_split
FROM prepared_dataset;
\`\`\`

**SQLでの機械学習:**
- BigQuery ML
- Amazon Redshift ML
- Azure SQL Database ML
- PostgreSQL MADlib

**実装例（BigQuery ML）:**
\`\`\`sql
-- 線形回帰モデルの作成
CREATE OR REPLACE MODEL \`project.dataset.sales_prediction_model\`
OPTIONS(model_type='linear_reg') AS
SELECT
    advertising_spend,
    seasonal_index,
    competitor_count,
    monthly_sales AS label
FROM \`project.dataset.sales_training_data\`;

-- 予測の実行
SELECT
    predicted_label AS predicted_sales,
    advertising_spend,
    seasonal_index
FROM ML.PREDICT(MODEL \`project.dataset.sales_prediction_model\`,
    (SELECT * FROM \`project.dataset.new_data\`));
\`\`\``,
        quiz: {
          question: 'データマイニングにおけるアソシエーション分析の主な目的は何ですか？',
          options: [
            'データを類似グループに分類すること',
            'アイテム間の関連性を発見すること',
            '数値を予測すること',
            '異常なデータを検知すること'
          ],
          correct: 1,
          explanation: 'アソシエーション分析は、アイテム間の関連性や購買パターンを発見することが主な目的です。「ビールを買う人はポテトチップスも買う」のような関連ルールを見つけるために使用されます。'
        }
      },
      {
        title: 'データガバナンス・セキュリティ',
        content: `企業のデータ資産を適切に管理・保護するためのガバナンスとセキュリティについて学習します。

**データガバナンスとは:**
- データの品質・可用性・セキュリティの確保
- データの一貫した管理方針
- 規制要件への対応
- データの価値最大化

**データガバナンスの要素:**

**データ品質管理:**
- **完全性**: データの欠損がないこと
- **正確性**: データが正しいこと
- **一貫性**: 矛盾がないこと
- **適時性**: 必要な時に利用可能
- **有効性**: ビジネス目的に適している

**データ品質チェック:**
\`\`\`sql
-- データ品質監視クエリ
SELECT
    'customers' AS table_name,
    COUNT(*) AS total_records,
    COUNT(*) - COUNT(customer_name) AS missing_names,
    COUNT(*) - COUNT(email) AS missing_emails,
    COUNT(DISTINCT customer_id) AS unique_customers,
    CASE
        WHEN COUNT(*) = COUNT(DISTINCT customer_id) THEN 'OK'
        ELSE 'DUPLICATE_IDS'
    END AS id_uniqueness_check
FROM customers

UNION ALL

SELECT
    'orders' AS table_name,
    COUNT(*) AS total_records,
    COUNT(*) - COUNT(order_date) AS missing_dates,
    COUNT(*) - COUNT(customer_id) AS missing_customer_ids,
    COUNT(CASE WHEN order_amount <= 0 THEN 1 END) AS invalid_amounts,
    'N/A' AS id_uniqueness_check
FROM orders;
\`\`\`

**データリネージュ（系譜）:**
データの流れと変換履歴の追跡

\`\`\`sql
-- データリネージュトラッキング
CREATE TABLE data_lineage (
    lineage_id INT PRIMARY KEY,
    source_table VARCHAR(100),
    target_table VARCHAR(100),
    transformation_type VARCHAR(50),
    transformation_rule TEXT,
    created_by VARCHAR(50),
    created_date TIMESTAMP
);

INSERT INTO data_lineage VALUES
(1, 'raw_orders', 'dim_customer', 'LOOKUP', 'JOIN with customer master', 'etl_job', NOW()),
(2, 'raw_orders', 'fact_sales', 'AGGREGATION', 'SUM by customer and date', 'etl_job', NOW());
\`\`\`

**メタデータ管理:**
データについてのデータの管理

\`\`\`sql
-- データカタログの例
CREATE TABLE data_catalog (
    table_name VARCHAR(100),
    column_name VARCHAR(100),
    data_type VARCHAR(50),
    description TEXT,
    business_owner VARCHAR(100),
    sensitivity_level VARCHAR(20),
    last_updated TIMESTAMP
);

-- サンプルデータ
INSERT INTO data_catalog VALUES
('customers', 'customer_id', 'INT', '顧客の一意識別子', '営業部', 'LOW', NOW()),
('customers', 'email', 'VARCHAR', '顧客のメールアドレス', '営業部', 'MEDIUM', NOW()),
('customers', 'credit_score', 'INT', '信用スコア', '与信管理部', 'HIGH', NOW());
\`\`\`

**データセキュリティ:**

**アクセス制御（Access Control）:**
\`\`\`sql
-- ロールベースアクセス制御
CREATE ROLE sales_analyst;
CREATE ROLE finance_manager;
CREATE ROLE data_scientist;

-- 権限の付与
GRANT SELECT ON sales_data TO sales_analyst;
GRANT SELECT, INSERT, UPDATE ON financial_data TO finance_manager;
GRANT SELECT ON ALL TABLES IN SCHEMA analytics TO data_scientist;

-- ユーザーへのロール割り当て
GRANT sales_analyst TO user_tanaka;
GRANT finance_manager TO user_suzuki;
\`\`\`

**行レベルセキュリティ:**
\`\`\`sql
-- ポリシーベースの行フィルタリング
CREATE POLICY region_policy ON sales_data
FOR SELECT
TO sales_regional_users
USING (region = current_setting('app.user_region'));

-- ユーザーセッションでの地域設定
SET app.user_region = 'Tokyo';
\`\`\`

**列レベルセキュリティ:**
\`\`\`sql
-- 動的データマスキング
CREATE VIEW customer_view AS
SELECT
    customer_id,
    customer_name,
    CASE
        WHEN current_user IN ('finance_role') THEN email
        ELSE CONCAT(LEFT(email, 3), '***@***.com')
    END AS email,
    CASE
        WHEN current_user IN ('manager_role') THEN salary
        ELSE NULL
    END AS salary
FROM customers;
\`\`\`

**データ暗号化:**

**保存時暗号化（Encryption at Rest）:**
\`\`\`sql
-- 透過的データ暗号化（TDE）
ALTER DATABASE sales_db SET ENCRYPTION ON;

-- 列レベル暗号化
CREATE TABLE sensitive_data (
    id INT PRIMARY KEY,
    customer_name VARCHAR(100),
    credit_card_number VARBINARY(256)  -- 暗号化された形で保存
);

-- データの暗号化挿入
INSERT INTO sensitive_data (id, customer_name, credit_card_number)
VALUES (1, '田中太郎', AES_ENCRYPT('1234-5678-9012-3456', 'encryption_key'));
\`\`\`

**通信時暗号化（Encryption in Transit）:**
- SSL/TLS接続の強制
- VPN接続
- アプリケーションレベル暗号化

**監査とログ:**
\`\`\`sql
-- 監査ログテーブル
CREATE TABLE audit_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(100),
    action VARCHAR(50),
    table_name VARCHAR(100),
    record_id VARCHAR(100),
    old_values JSON,
    new_values JSON,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45)
);

-- 監査トリガーの例
CREATE TRIGGER audit_customer_changes
AFTER UPDATE ON customers
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (user_name, action, table_name, record_id, old_values, new_values)
    VALUES (
        USER(),
        'UPDATE',
        'customers',
        NEW.customer_id,
        JSON_OBJECT('name', OLD.customer_name, 'email', OLD.email),
        JSON_OBJECT('name', NEW.customer_name, 'email', NEW.email)
    );
END;
\`\`\`

**コンプライアンス:**

**GDPR（EU一般データ保護規則）:**
- 個人データの処理規制
- データ主体の権利保護
- 忘れられる権利

\`\`\`sql
-- GDPR対応：個人データの削除
UPDATE customers
SET
    email = 'deleted@example.com',
    phone = NULL,
    address = 'DELETED'
WHERE customer_id = @customer_id_to_delete;

-- 個人データアクセスログ
CREATE TABLE personal_data_access_log (
    access_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    accessed_by VARCHAR(100),
    access_purpose VARCHAR(200),
    access_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

**SOX法対応:**
- 財務データの正確性確保
- 内部統制の強化
- 監査証跡の保持

**データ分類:**
\`\`\`sql
-- データ分類タグ
ALTER TABLE customers ADD COLUMN data_classification VARCHAR(20) DEFAULT 'PUBLIC';

UPDATE customers SET data_classification = 'CONFIDENTIAL'
WHERE column_name IN ('salary', 'credit_score', 'ssn');

UPDATE customers SET data_classification = 'RESTRICTED'
WHERE column_name IN ('medical_info', 'criminal_record');
\`\`\`

**データ保持ポリシー:**
\`\`\`sql
-- データ保持期間の管理
CREATE TABLE data_retention_policy (
    table_name VARCHAR(100),
    retention_period_days INT,
    archive_after_days INT,
    delete_after_days INT
);

-- 自動アーカイブ・削除の実装
CREATE EVENT auto_archive_old_data
ON SCHEDULE EVERY 1 DAY
DO
BEGIN
    -- 古いデータのアーカイブ
    INSERT INTO archived_orders
    SELECT * FROM orders
    WHERE order_date < DATE_SUB(NOW(), INTERVAL 7 YEAR);

    -- 元データの削除
    DELETE FROM orders
    WHERE order_date < DATE_SUB(NOW(), INTERVAL 7 YEAR);
END;
\`\`\`

**ベストプラクティス:**
- 最小権限の原則
- 定期的なアクセス権見直し
- セキュリティ意識向上トレーニング
- インシデント対応計画
- 継続的な監視と改善`,
        quiz: {
          question: 'データガバナンスにおけるデータ品質の要素として適切でないものはどれですか？',
          options: [
            '完全性（欠損がない）',
            '正確性（データが正しい）',
            '可搬性（異なるシステム間で移行可能）',
            '適時性（必要な時に利用可能）'
          ],
          correct: 2,
          explanation: 'データ品質の主要な要素は完全性、正確性、一貫性、適時性、有効性です。可搬性はシステムの特性であり、データ品質の直接的な要素ではありません。'
        }
      }
    ]
  },
  {
    id: 6,
    title: 'Advanced Database Administration',
    sections: [
      {
        title: 'データベース監視とメンテナンス',
        content: `データベースの安定稼働のための監視とメンテナンスについて学習します。

**監視項目:**

**パフォーマンス指標:**
- CPU使用率
- メモリ使用率
- ディスクI/O
- ネットワーク使用率
- クエリ実行時間
- 同時接続数

**容量管理:**
- データベースサイズ
- ログファイルサイズ
- 使用可能領域
- 成長予測

**可用性監視:**
- サービス稼働状況
- レプリケーション遅延
- バックアップ状況
- 接続性テスト

**メンテナンス作業:**

**統計情報の更新:**
\`\`\`sql
-- PostgreSQL
ANALYZE table_name;

-- MySQL
ANALYZE TABLE table_name;

-- SQL Server
UPDATE STATISTICS table_name;

-- Oracle
EXEC DBMS_STATS.GATHER_TABLE_STATS('schema', 'table_name');
\`\`\`

**インデックスの再構築:**
\`\`\`sql
-- SQL Server
ALTER INDEX ALL ON table_name REBUILD;

-- Oracle
ALTER INDEX index_name REBUILD;

-- PostgreSQL
REINDEX INDEX index_name;
\`\`\`

**断片化の解消:**
\`\`\`sql
-- MySQL
OPTIMIZE TABLE table_name;

-- SQL Server
ALTER TABLE table_name REBUILD;
\`\`\`

**ログファイル管理:**
\`\`\`sql
-- トランザクションログのバックアップ
BACKUP LOG database_name TO DISK = 'log_backup.trn';

-- ログファイルの切り詰め
DBCC SHRINKFILE(log_file_name);
\`\`\`

**自動化スクリプト:**
\`\`\`sql
-- 定期メンテナンスジョブ
CREATE EVENT maintenance_job
ON SCHEDULE EVERY 1 WEEK
STARTS '2023-01-01 02:00:00'
DO
BEGIN
    -- 統計情報更新
    CALL UPDATE_TABLE_STATISTICS();

    -- インデックス再構築
    CALL REBUILD_FRAGMENTED_INDEXES();

    -- データベース整合性チェック
    CALL CHECK_DATABASE_INTEGRITY();
END;
\`\`\`

**アラート設定:**
- CPU使用率 > 80%
- ディスク容量 < 10%
- クエリ実行時間 > 30秒
- デッドロック発生
- レプリケーション遅延 > 5分

**監視ツール:**
- データベース固有監視ツール
- システム監視ツール
- アプリケーション監視ツール
- ログ分析ツール`,
        quiz: {
          question: 'データベースのメンテナンスにおいて、統計情報の更新が重要な理由は何ですか？',
          options: [
            'データの整合性を保つため',
            'クエリオプティマイザが適切な実行計画を作成するため',
            'セキュリティを強化するため',
            'データベースサイズを削減するため'
          ],
          correct: 1,
          explanation: '統計情報は、クエリオプティマイザが効率的な実行計画を作成するために使用されます。統計情報が古いと、非効率な実行計画が選択され、性能が劣化する可能性があります。'
        }
      },
      {
        title: 'データベース移行・アップグレード',
        content: `データベースの移行とアップグレードの戦略と手順について学習します。

**移行の種類:**

**同一DBMS内の移行:**
- バージョンアップグレード
- ハードウェア移行
- クラウド移行

**異なるDBMS間の移行:**
- Oracle → PostgreSQL
- MySQL → MariaDB
- SQL Server → MySQL

**移行計画:**

**事前調査:**
- 現行システムの調査
- 移行対象の特定
- 互換性の確認
- 性能要件の分析

**移行戦略の選択:**

**ビッグバン移行:**
- 一度に全システムを移行
- ダウンタイムが必要
- リスクが高いが期間は短い

**段階的移行:**
- 機能ごとに順次移行
- 並行稼働期間
- リスクは低いが複雑

**並行稼働:**
- 新旧システムを同時稼働
- データ同期が必要
- 最も安全だが複雑

**移行手順:**

**1. データスキーマ移行:**
\`\`\`sql
-- DDL変換例（Oracle → PostgreSQL）
-- Oracle
CREATE TABLE employees (
    emp_id NUMBER(10) PRIMARY KEY,
    emp_name VARCHAR2(100),
    hire_date DATE
);

-- PostgreSQL
CREATE TABLE employees (
    emp_id SERIAL PRIMARY KEY,
    emp_name VARCHAR(100),
    hire_date DATE
);
\`\`\`

**2. データ移行:**
\`\`\`sql
-- ETL処理例
INSERT INTO target_table
SELECT
    CASE
        WHEN source_status = 'A' THEN 'Active'
        WHEN source_status = 'I' THEN 'Inactive'
        ELSE 'Unknown'
    END AS status,
    UPPER(TRIM(source_name)) AS name,
    TO_DATE(source_date, 'YYYY-MM-DD') AS created_date
FROM source_table
WHERE source_date >= '2020-01-01';
\`\`\`

**3. アプリケーション移行:**
- SQL文の書き換え
- 接続文字列の変更
- ドライバーの更新
- 設定ファイルの修正

**データ移行ツール:**

**ネイティブツール:**
- Oracle Data Pump
- MySQL Workbench Migration Wizard
- SQL Server Migration Assistant
- PostgreSQL pg_dump/pg_restore

**サードパーティツール:**
- AWS Database Migration Service
- Azure Database Migration Service
- Talend
- Pentaho Data Integration

**移行テスト:**

**機能テスト:**
- データ整合性確認
- アプリケーション動作確認
- パフォーマンステスト
- セキュリティテスト

**性能テスト:**
\`\`\`sql
-- 移行前後の性能比較
EXPLAIN ANALYZE
SELECT c.customer_name, COUNT(o.order_id) as order_count
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE c.registration_date >= '2023-01-01'
GROUP BY c.customer_id, c.customer_name
ORDER BY order_count DESC;
\`\`\`

**ロールバック計画:**
- 移行失敗時の手順
- データ復旧方法
- サービス復旧時間
- 影響範囲の特定

**移行後の作業:**
- 性能監視
- データ整合性チェック
- ユーザーフィードバック収集
- ドキュメント更新

**ベストプラクティス:**
- 十分なテスト期間の確保
- 段階的なアプローチ
- 詳細な移行計画書
- チーム間の連携
- リスク管理`,
        quiz: {
          question: 'データベース移行において「ビッグバン移行」の特徴として正しいものはどれですか？',
          options: [
            '機能ごとに順次移行する',
            '新旧システムを並行稼働させる',
            '一度に全システムを移行する',
            'データ同期を継続的に行う'
          ],
          correct: 2,
          explanation: 'ビッグバン移行は、一度に全システムを新しい環境に移行する手法です。ダウンタイムが必要ですが、移行期間は短く、システム構成がシンプルになります。'
        }
      },
      {
        title: 'クラウドデータベース',
        content: `クラウド環境でのデータベース運用について学習します。

**クラウドデータベースの種類:**

**IaaS（Infrastructure as a Service）:**
- 仮想マシン上にDBMS構築
- 完全な制御権
- 運用負荷が高い
- 例：EC2 + RDS Custom

**PaaS（Platform as a Service）:**
- マネージドデータベース
- 運用作業の自動化
- スケーラビリティ
- 例：Amazon RDS、Azure SQL Database

**SaaS（Software as a Service）:**
- 完全に管理されたサービス
- 設定のみで利用開始
- カスタマイズ制限
- 例：Amazon DynamoDB、Google Firestore

**主要クラウドプロバイダーのサービス:**

**Amazon Web Services (AWS):**
- RDS: リレーショナルDB
- DynamoDB: NoSQL
- Redshift: データウェアハウス
- Aurora: MySQL/PostgreSQL互換

**Microsoft Azure:**
- SQL Database: SQL Server互換
- Cosmos DB: マルチモデルNoSQL
- Synapse Analytics: データウェアハウス
- Database for MySQL/PostgreSQL

**Google Cloud Platform (GCP):**
- Cloud SQL: MySQL/PostgreSQL
- Firestore: ドキュメントDB
- BigQuery: データウェアハウス
- Spanner: 分散SQL

**クラウドデータベースの利点:**

**コスト効率:**
- 初期投資不要
- 使用量課金
- 運用コスト削減
- ライセンス費用削減

**スケーラビリティ:**
- 自動スケーリング
- 読み取りレプリカ
- 容量の動的拡張
- 地理的分散

**可用性:**
- 自動バックアップ
- フェイルオーバー
- 災害復旧
- SLA保証

**運用負荷軽減:**
- パッチ適用自動化
- 監視とアラート
- セキュリティ更新
- メンテナンス作業

**クラウド移行戦略:**

**リフト&シフト:**
- 既存システムをそのまま移行
- 最小限の変更
- 短期間での移行
- クラウドネイティブ機能は未活用

**リファクタリング:**
- アプリケーション最適化
- クラウドサービス活用
- 性能向上とコスト削減
- 開発工数が必要

**設定例（AWS RDS）:**
\`\`\`yaml
# CloudFormation例
RDSInstance:
  Type: AWS::RDS::DBInstance
  Properties:
    DBName: !Ref 'DBName'
    DBInstanceIdentifier: !Ref 'DBInstanceID'
    DBInstanceClass: db.t3.micro
    Engine: mysql
    EngineVersion: '8.0.28'
    MasterUsername: !Ref 'DBUser'
    MasterUserPassword: !Ref 'DBPassword'
    AllocatedStorage: '20'
    StorageType: gp2
    VPCSecurityGroups:
      - !Ref DBSecurityGroup
    MultiAZ: true
    BackupRetentionPeriod: 7
    DeletionProtection: true
\`\`\`

**セキュリティ考慮事項:**

**ネットワークセキュリティ:**
- VPC内配置
- セキュリティグループ
- プライベートサブネット
- VPN/Direct Connect

**データ暗号化:**
- 保存時暗号化
- 通信時暗号化
- キー管理サービス
- 透過的暗号化

**アクセス制御:**
- IAMロール
- データベースユーザー管理
- 最小権限原則
- 監査ログ

**コスト最適化:**

**リザーブドインスタンス:**
- 1年または3年契約
- 大幅な割引
- 予測可能なワークロード

**スポットインスタンス:**
- 開発・テスト環境
- バッチ処理
- 最大90%割引

**自動スケーリング:**
- 需要に応じた調整
- 無駄なリソース削減
- コスト効率の向上

**モニタリングとアラート:**
\`\`\`yaml
# CloudWatch例
DatabaseCPUAlarm:
  Type: AWS::CloudWatch::Alarm
  Properties:
    AlarmDescription: 'Database CPU utilization'
    MetricName: CPUUtilization
    Namespace: AWS/RDS
    Statistic: Average
    Period: 300
    EvaluationPeriods: 2
    Threshold: 80
    ComparisonOperator: GreaterThanThreshold
    AlarmActions:
      - !Ref SNSTopic
\`\`\``,
        quiz: {
          question: 'クラウドデータベースのPaaS型サービスの主な特徴はどれですか？',
          options: [
            '完全に自由にカスタマイズできる',
            '運用作業が自動化されている',
            '初期設定が不要で即座に利用開始できる',
            '物理サーバーを直接管理する'
          ],
          correct: 1,
          explanation: 'PaaS型のマネージドデータベースサービスは、パッチ適用、バックアップ、監視などの運用作業が自動化されており、ユーザーはアプリケーション開発に集中できます。'
        }
      },
      {
        title: 'データベースセキュリティの実装',
        content: `実際のデータベースセキュリティ実装方法について学習します。

**認証システム:**

**データベース認証:**
\`\`\`sql
-- ユーザー作成
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'strong_password';

-- パスワードポリシー設定
ALTER USER 'app_user'@'localhost'
PASSWORD EXPIRE INTERVAL 90 DAY
PASSWORD HISTORY 5
PASSWORD REQUIRE CURRENT;
\`\`\`

**統合認証（LDAP/Active Directory）:**
\`\`\`sql
-- SQL Server例
CREATE LOGIN [DOMAIN\\username] FROM WINDOWS;
CREATE USER [DOMAIN\\username] FOR LOGIN [DOMAIN\\username];
\`\`\`

**多要素認証（MFA）:**
- データベース接続にMFA要求
- 管理者アカウントは必須
- アプリケーションアカウントは検討

**アクセス制御の実装:**

**最小権限の原則:**
\`\`\`sql
-- アプリケーション用ロール
CREATE ROLE app_role;
GRANT SELECT, INSERT, UPDATE ON sales_data TO app_role;
GRANT SELECT ON product_data TO app_role;
-- DELETE権限は付与しない

-- 分析用ロール
CREATE ROLE analyst_role;
GRANT SELECT ON ALL TABLES IN SCHEMA analytics TO analyst_role;
-- 書き込み権限は付与しない
\`\`\`

**時間制限アクセス:**
\`\`\`sql
-- 業務時間のみアクセス可能
CREATE POLICY business_hours_policy ON sensitive_table
FOR ALL
TO business_users
USING (
    EXTRACT(HOUR FROM CURRENT_TIME) BETWEEN 9 AND 17
    AND EXTRACT(DOW FROM CURRENT_DATE) BETWEEN 1 AND 5
);
\`\`\`

**データマスキング:**

**静的データマスキング:**
\`\`\`sql
-- 開発環境用のマスクされたデータ作成
UPDATE customer_dev
SET
    email = CONCAT('user', customer_id, '@example.com'),
    phone = CONCAT('090-xxxx-', RIGHT(phone, 4)),
    credit_card = 'xxxx-xxxx-xxxx-' + RIGHT(credit_card, 4);
\`\`\`

**動的データマスキング:**
\`\`\`sql
-- SQL Server例
ALTER TABLE customers
ALTER COLUMN email ADD MASKED WITH (FUNCTION = 'email()');

ALTER TABLE customers
ALTER COLUMN credit_card ADD MASKED WITH (FUNCTION = 'partial(0,"xxxx-xxxx-xxxx-",4)');
\`\`\`

**SQL インジェクション対策:**

**パラメータ化クエリ:**
\`\`\`sql
-- 悪い例（SQLインジェクション脆弱性あり）
-- SELECT * FROM users WHERE username = '" + username + "'

-- 良い例（プリペアドステートメント）
PREPARE stmt FROM 'SELECT * FROM users WHERE username = ?';
SET @username = 'john_doe';
EXECUTE stmt USING @username;
\`\`\`

**入力値検証:**
\`\`\`sql
-- ストアドプロシージャでの検証
DELIMITER //
CREATE PROCEDURE GetUserById(IN user_id INT)
BEGIN
    -- 入力値検証
    IF user_id IS NULL OR user_id <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid user ID';
    END IF;

    SELECT * FROM users WHERE id = user_id;
END //
DELIMITER ;
\`\`\`

**データ暗号化の実装:**

**列レベル暗号化:**
\`\`\`sql
-- 暗号化関数を使用
CREATE TABLE encrypted_data (
    id INT PRIMARY KEY,
    username VARCHAR(100),
    encrypted_ssn VARBINARY(255)
);

-- データ挿入時に暗号化
INSERT INTO encrypted_data (id, username, encrypted_ssn)
VALUES (1, 'john_doe', AES_ENCRYPT('123-45-6789', 'encryption_key'));

-- データ取得時に復号化
SELECT id, username, AES_DECRYPT(encrypted_ssn, 'encryption_key') as ssn
FROM encrypted_data WHERE id = 1;
\`\`\`

**セキュリティ監査:**

**ログイン監査:**
\`\`\`sql
-- 失敗したログイン試行の記録
CREATE TABLE login_attempts (
    attempt_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100),
    ip_address VARCHAR(45),
    attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN,
    failure_reason VARCHAR(255)
);

-- ログイン試行の記録
INSERT INTO login_attempts (username, ip_address, success, failure_reason)
VALUES ('user123', '192.168.1.100', FALSE, 'Invalid password');
\`\`\`

**データアクセス監査:**
\`\`\`sql
-- データアクセスの追跡
CREATE TABLE data_access_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(100),
    table_name VARCHAR(100),
    operation VARCHAR(10),
    record_count INT,
    access_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    query_hash VARCHAR(64)
);
\`\`\`

**セキュリティイベント監視:**

**異常検知:**
\`\`\`sql
-- 通常と異なるアクセスパターンの検知
SELECT
    user_name,
    COUNT(*) as query_count,
    COUNT(DISTINCT table_name) as tables_accessed
FROM data_access_log
WHERE access_time >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
GROUP BY user_name
HAVING query_count > 1000 OR tables_accessed > 20;
\`\`\`

**リアルタイムアラート:**
- 権限昇格の試行
- 大量データアクセス
- 異常な時間帯のアクセス
- 失敗したログイン試行の連続

**セキュリティ設定のベストプラクティス:**
- デフォルトパスワードの変更
- 不要なサービスの無効化
- 定期的なセキュリティパッチ適用
- ファイアウォール設定
- SSL/TLS証明書の更新`,
        quiz: {
          question: 'SQLインジェクション攻撃を防ぐ最も効果的な方法はどれですか？',
          options: [
            'データベースに接続するアプリケーションを制限する',
            'パラメータ化クエリ（プリペアドステートメント）を使用する',
            'データベースユーザーの権限を制限する',
            'データを暗号化して保存する'
          ],
          correct: 1,
          explanation: 'パラメータ化クエリ（プリペアドステートメント）を使用することで、SQL文とデータを分離し、悪意のあるSQL文の実行を防ぐことができます。これはSQLインジェクション対策の基本です。'
        }
      }
    ]
  },
  {
    title: 'データベース応用技術',
    icon: '🚀',
    sections: [
      {
        title: 'データマイニング・機械学習統合',
        content: `データベースと機械学習を統合した分析手法について学習します。

**データマイニング:**
データベースから有用な知識やパターンを発見する技術

**KDD（Knowledge Discovery in Databases）プロセス:**
1. **データ選択:** 分析対象データの特定
2. **前処理:** データクリーニング・変換
3. **データマイニング:** パターン抽出
4. **解釈・評価:** 結果の検証
5. **知識活用:** ビジネス適用

**代表的なデータマイニング手法:**

**分類（Classification）:**
- 決定木（Decision Tree）
- ランダムフォレスト
- サポートベクターマシン（SVM）
- ナイーブベイズ

**クラスタリング（Clustering）:**
- k-means法
- 階層クラスタリング
- DBSCAN
- ガウス混合モデル

**アソシエーション分析:**
- Aprioriアルゴリズム
- FP-Growth
- マーケットバスケット分析

**時系列分析:**
- ARIMA モデル
- 季節分解
- 異常検知

**データベース内機械学習:**

**SQL/MLステートメント:**
\`\`\`sql
-- BigQuery ML でのモデル作成例
CREATE OR REPLACE MODEL dataset.customer_segmentation_model
OPTIONS(model_type='kmeans', num_clusters=4) AS
SELECT
  customer_age,
  annual_income,
  spending_score
FROM dataset.customer_data;

-- 予測実行
SELECT
  customer_id,
  predicted_cluster_label
FROM ML.PREDICT(MODEL dataset.customer_segmentation_model,
  (SELECT * FROM dataset.new_customers));
\`\`\`

**PostgreSQLでの機械学習拡張:**
\`\`\`sql
-- MADlib を使用した線形回帰
SELECT madlib.linregr_train(
  'housing_data',           -- source table
  'housing_model',          -- model table
  'price',                  -- dependent variable
  'ARRAY[bedrooms, size, age]'  -- independent variables
);

-- 予測
SELECT
  customer_id,
  madlib.linregr_predict(
    ARRAY[bedrooms, size, age],
    m.coef,
    m.intercept
  ) as predicted_price
FROM new_houses, housing_model m;
\`\`\`

**ストリーミング分析:**

**リアルタイム処理アーキテクチャ:**
- Apache Kafka + Kafka Streams
- Apache Storm
- Apache Flink
- AWS Kinesis

**ストリーミングSQL:**
\`\`\`sql
-- Apache Flink SQL での例
CREATE TABLE orders (
  order_id BIGINT,
  user_id BIGINT,
  product_id BIGINT,
  amount DECIMAL(10,2),
  order_time TIMESTAMP(3),
  WATERMARK FOR order_time AS order_time - INTERVAL '5' SECOND
) WITH (
  'connector' = 'kafka',
  'topic' = 'orders',
  'format' = 'json'
);

-- リアルタイム集計
SELECT
  user_id,
  TUMBLE_START(order_time, INTERVAL '1' HOUR) as window_start,
  COUNT(*) as order_count,
  SUM(amount) as total_amount
FROM orders
GROUP BY user_id, TUMBLE(order_time, INTERVAL '1' HOUR);
\`\`\`

**データレイク統合:**

**Delta Lake:**
- ACID特性保証
- スキーマエボリューション
- タイムトラベル
- データバージョニング

**Apache Iceberg:**
- 大規模分析テーブル形式
- Hidden partitioning
- スキーマエボリューション
- ACID操作

**実用例:**

**推薦システム:**
- 協調フィルタリング
- コンテンツベースフィルタリング
- ハイブリッド手法
- ディープラーニング

**不正検知:**
- 異常検知アルゴリズム
- リアルタイム監視
- 機械学習モデル

**顧客分析:**
- RFM分析（Recency, Frequency, Monetary）
- 顧客生涯価値（LTV）
- チャーン予測`,
        quiz: {
          question: 'データマイニングのKDDプロセスで、最初に行う作業はどれですか？',
          options: [
            'データクリーニング',
            'データ選択',
            'パターン抽出',
            '結果の解釈'
          ],
          correct: 1,
          explanation: 'KDD（Knowledge Discovery in Databases）プロセスでは、まず分析対象となるデータを特定・選択することから始まります。これにより分析の方向性と範囲が決まります。'
        }
      },
      {
        title: 'データベース設計パターン',
        content: `効率的なデータベース設計のパターンと手法について学習します。

**設計パターンの分類:**

**構造パターン:**
- Entity-Attribute-Value (EAV)
- Table Inheritance
- Polymorphic Associations
- Audit Trail

**アクセスパターン:**
- Repository Pattern
- Data Access Object (DAO)
- Unit of Work
- Identity Map

**パフォーマンスパターン:**
- Lazy Loading
- Eager Loading
- Connection Pooling
- Query Object

**詳細な設計パターン:**

**1. Entity-Attribute-Value (EAV)パターン:**
動的な属性を持つエンティティの設計

\`\`\`sql
-- EAVテーブル設計
CREATE TABLE entities (
  entity_id INT PRIMARY KEY,
  entity_type VARCHAR(50)
);

CREATE TABLE attributes (
  attribute_id INT PRIMARY KEY,
  attribute_name VARCHAR(100),
  data_type VARCHAR(20)
);

CREATE TABLE entity_attributes (
  entity_id INT,
  attribute_id INT,
  value TEXT,
  FOREIGN KEY (entity_id) REFERENCES entities(entity_id),
  FOREIGN KEY (attribute_id) REFERENCES attributes(attribute_id)
);

-- 使用例：商品の動的属性
INSERT INTO entities VALUES (1, 'product');
INSERT INTO attributes VALUES (1, 'color', 'string');
INSERT INTO attributes VALUES (2, 'weight', 'decimal');
INSERT INTO entity_attributes VALUES (1, 1, 'red');
INSERT INTO entity_attributes VALUES (1, 2, '1.5');
\`\`\`

**2. Table Inheritance（テーブル継承）:**

**単一テーブル継承（STI）:**
\`\`\`sql
CREATE TABLE employees (
  id INT PRIMARY KEY,
  type VARCHAR(20), -- 'manager', 'developer', 'designer'
  name VARCHAR(100),
  salary DECIMAL(10,2),
  -- Manager specific
  department VARCHAR(50),
  -- Developer specific
  programming_language VARCHAR(50),
  -- Designer specific
  design_tool VARCHAR(50)
);
\`\`\`

**クラステーブル継承（CTI）:**
\`\`\`sql
CREATE TABLE employees (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  salary DECIMAL(10,2)
);

CREATE TABLE managers (
  id INT PRIMARY KEY,
  department VARCHAR(50),
  FOREIGN KEY (id) REFERENCES employees(id)
);

CREATE TABLE developers (
  id INT PRIMARY KEY,
  programming_language VARCHAR(50),
  FOREIGN KEY (id) REFERENCES employees(id)
);
\`\`\`

**3. Audit Trail（監査証跡）パターン:**
\`\`\`sql
CREATE TABLE products (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  price DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT
);

CREATE TABLE product_audit_log (
  log_id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT,
  operation_type VARCHAR(10), -- 'INSERT', 'UPDATE', 'DELETE'
  old_values JSON,
  new_values JSON,
  changed_by INT,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- トリガーでの自動監査ログ記録
DELIMITER //
CREATE TRIGGER product_audit_update
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
  INSERT INTO product_audit_log (
    product_id, operation_type, old_values, new_values, changed_by
  ) VALUES (
    NEW.id, 'UPDATE',
    JSON_OBJECT('name', OLD.name, 'price', OLD.price),
    JSON_OBJECT('name', NEW.name, 'price', NEW.price),
    NEW.updated_by
  );
END//
DELIMITER ;
\`\`\`

**4. Polymorphic Associations（多相関連）:**
\`\`\`sql
CREATE TABLE comments (
  id INT PRIMARY KEY,
  commentable_type VARCHAR(50), -- 'Article', 'Video', 'Photo'
  commentable_id INT,
  content TEXT,
  user_id INT,
  created_at TIMESTAMP
);

-- 記事へのコメント
INSERT INTO comments (commentable_type, commentable_id, content, user_id)
VALUES ('Article', 123, 'Great article!', 456);

-- 動画へのコメント
INSERT INTO comments (commentable_type, commentable_id, content, user_id)
VALUES ('Video', 789, 'Amazing video!', 456);
\`\`\`

**5. Soft Delete（論理削除）パターン:**
\`\`\`sql
CREATE TABLE users (
  id INT PRIMARY KEY,
  username VARCHAR(50),
  email VARCHAR(100),
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 論理削除
UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = 123;

-- アクティブユーザーのみ取得
SELECT * FROM users WHERE deleted_at IS NULL;

-- 削除済みユーザーを含む全ユーザー
SELECT * FROM users;
\`\`\`

**パフォーマンス最適化パターン:**

**1. Read Replica パターン:**
- 読み取り専用レプリカの活用
- 読み書き分離
- 負荷分散

**2. Sharding パターン:**
- 水平分割によるスケール
- シャードキーの選択
- クロスシャードクエリの回避

**3. Caching パターン:**
- Cache-aside
- Write-through
- Write-behind
- Refresh-ahead

**アンチパターンの回避:**

**よくある設計ミス:**
- Fear of NULL（NULL値の過剰回避）
- One True Lookup Table（万能参照テーブル）
- Entity-Attribute-Value の乱用
- Magic Numbers（マジックナンバー）
- Poor Man's Search Engine（検索機能の不適切実装）`,
        quiz: {
          question: 'Entity-Attribute-Value (EAV) パターンの主な用途はどれですか？',
          options: [
            '固定的な属性を持つエンティティの管理',
            '動的な属性を持つエンティティの管理',
            'パフォーマンスの最適化',
            'セキュリティの強化'
          ],
          correct: 1,
          explanation: 'EAVパターンは、属性が動的に変化したり、エンティティごとに異なる属性を持つ場合に使用されます。例えば、商品カテゴリごとに異なる仕様項目を持つ商品データベースなどで活用されます。'
        }
      },
      {
        title: 'データベースセキュリティ詳細',
        content: `データベースセキュリティの詳細な対策と実装について学習します。

**セキュリティ脅威の分類:**

**認証・認可の脅威:**
- 不正ログイン
- 権限昇格攻撃
- セッションハイジャック
- ブルートフォース攻撃

**データの脅威:**
- SQLインジェクション
- データ漏洩
- データ改ざん
- 内部者による不正アクセス

**インフラの脅威:**
- DoS/DDoS攻撃
- ネットワーク盗聴
- 中間者攻撃
- 物理的セキュリティ侵害

**詳細なセキュリティ対策:**

**1. 強固な認証・認可システム:**

**多要素認証（MFA）:**
\`\`\`sql
-- PostgreSQLでのロール管理
CREATE ROLE app_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_readonly;

CREATE ROLE app_readwrite;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_readwrite;

-- ユーザー作成と権限割り当て
CREATE USER analyst WITH PASSWORD 'strong_password';
GRANT app_readonly TO analyst;

-- 時間制限付きアクセス
ALTER USER analyst VALID UNTIL '2024-12-31';
\`\`\`

**行レベルセキュリティ（RLS）:**
\`\`\`sql
-- PostgreSQLのRLS設定
CREATE TABLE customer_data (
  id SERIAL PRIMARY KEY,
  customer_id INT,
  data TEXT,
  tenant_id INT
);

-- RLS有効化
ALTER TABLE customer_data ENABLE ROW LEVEL SECURITY;

-- ポリシー作成
CREATE POLICY tenant_isolation ON customer_data
FOR ALL TO app_user
USING (tenant_id = current_setting('app.tenant_id')::INT);

-- アプリケーションでのテナントID設定
SET app.tenant_id = 123;
SELECT * FROM customer_data; -- テナント123のデータのみ表示
\`\`\`

**2. データ暗号化:**

**透過的データ暗号化（TDE）:**
\`\`\`sql
-- SQL Serverでの TDE 設定
-- マスターキー作成
CREATE MASTER KEY ENCRYPTION BY PASSWORD = 'MyStrongPassword123!';

-- 証明書作成
CREATE CERTIFICATE TDECert WITH SUBJECT = 'TDE Certificate';

-- データベース暗号化キー作成
USE CustomerDB;
CREATE DATABASE ENCRYPTION KEY
WITH ALGORITHM = AES_256
ENCRYPTION BY SERVER CERTIFICATE TDECert;

-- TDE有効化
ALTER DATABASE CustomerDB SET ENCRYPTION ON;
\`\`\`

**列レベル暗号化:**
\`\`\`sql
-- Always Encrypted (SQL Server)
CREATE TABLE Customers (
  CustomerID INT IDENTITY(1,1) PRIMARY KEY,
  FirstName NVARCHAR(50),
  LastName NVARCHAR(50),
  SSN CHAR(11) COLLATE Latin1_General_BIN2
    ENCRYPTED WITH (
      COLUMN_ENCRYPTION_KEY = CEK_SSN,
      ENCRYPTION_TYPE = DETERMINISTIC,
      ALGORITHM = 'AEAD_AES_256_CBC_HMAC_SHA_256'
    ),
  CreditCardNumber NVARCHAR(20) COLLATE Latin1_General_BIN2
    ENCRYPTED WITH (
      COLUMN_ENCRYPTION_KEY = CEK_CreditCard,
      ENCRYPTION_TYPE = RANDOMIZED,
      ALGORITHM = 'AEAD_AES_256_CBC_HMAC_SHA_256'
    )
);
\`\`\`

**3. 監査とログ:**

**詳細監査ログ:**
\`\`\`sql
-- PostgreSQLでの監査設定
-- postgresql.conf での設定
-- log_statement = 'all'
-- log_duration = on
-- log_line_prefix = '%t [%p-%l] %q%u@%d '

-- pgAudit拡張の使用
CREATE EXTENSION pgaudit;

-- 監査設定
ALTER SYSTEM SET pgaudit.log = 'write, ddl';
ALTER SYSTEM SET pgaudit.log_catalog = off;
ALTER SYSTEM SET pgaudit.log_parameter = on;

-- セッションレベルでの監査
SET pgaudit.log = 'read';
SELECT * FROM sensitive_table; -- この操作が記録される
\`\`\`

**4. データマスキングと仮名化:**

**動的データマスキング:**
\`\`\`sql
-- SQL Serverでの動的データマスキング
ALTER TABLE Customers
ALTER COLUMN FirstName ADD MASKED WITH (FUNCTION = 'partial(1,"XXX",1)');

ALTER TABLE Customers
ALTER COLUMN CreditCardNumber ADD MASKED WITH (FUNCTION = 'partial(4,"XXXX-XXXX-XXXX-",4)');

-- マスクされていないデータを見る権限
GRANT UNMASK TO DataAnalyst;
\`\`\`

**静的データマスキング:**
\`\`\`sql
-- 本番データから開発環境用データ作成
CREATE TABLE dev_customers AS
SELECT
  customer_id,
  CONCAT('Customer_', customer_id) AS name, -- 名前仮名化
  CONCAT(LEFT(email, 3), '****@example.com') AS email, -- メール仮名化
  '1990-01-01' AS birth_date, -- 生年月日固定値
  address_prefecture, -- 都道府県は残す
  NULL AS phone_number -- 電話番号削除
FROM customers;
\`\`\`

**5. セキュリティベストプラクティス:**

**接続セキュリティ:**
- SSL/TLS暗号化通信
- 証明書検証
- 接続元IP制限
- VPN/Private Link使用

**アプリケーションセキュリティ:**
- パラメータ化クエリ
- 最小権限の原則
- 接続プール設定
- タイムアウト設定

**運用セキュリティ:**
- 定期的なセキュリティパッチ適用
- 脆弱性スキャン
- ペネトレーションテスト
- インシデント対応計画

**コンプライアンス対応:**

**GDPR（EU一般データ保護規則）:**
- データ削除権（Right to be forgotten）
- データポータビリティ
- プライバシー・バイ・デザイン

**個人情報保護法（日本）:**
- 個人データの適切な管理
- 本人同意の取得
- データ移転の制限

**医療・金融業界規制:**
- HIPAA（医療）
- PCI DSS（決済）
- SOX法（財務報告）`,
        quiz: {
          question: '行レベルセキュリティ（RLS）の主な目的はどれですか？',
          options: [
            'データベース全体へのアクセスを制御する',
            'テーブル内の特定の行へのアクセスを制御する',
            '列レベルでのデータ暗号化を行う',
            'SQLインジェクション攻撃を防ぐ'
          ],
          correct: 1,
          explanation: '行レベルセキュリティ（RLS）は、ユーザーやロールに応じてテーブル内の特定の行へのアクセスを制御する仕組みです。マルチテナントアプリケーションでテナント間のデータ分離に使用されます。'
        }
      },
      {
        title: '最新データベース技術',
        content: `最新のデータベース技術とトレンドについて学習します。

**次世代データベース技術:**

**1. ベクトルデータベース:**
AI・機械学習時代の新しいデータベース

**特徴:**
- 高次元ベクトルの効率的格納
- 類似度検索に最適化
- 埋め込み（Embedding）データの管理
- リアルタイム推論サポート

**主要なベクトルデータベース:**
- **Pinecone:** フルマネージドベクトルDB
- **Weaviate:** オープンソース、GraphQL API
- **Milvus:** スケーラブルな分散アーキテクチャ
- **Qdrant:** 高性能検索エンジン

**使用例:**
\`\`\`python
# Pinecone でのベクトル検索例
import pinecone

# 初期化
pinecone.init(api_key="your-api-key", environment="us-east1-gcp")

# インデックス作成
index_name = "product-recommendations"
pinecone.create_index(index_name, dimension=384)
index = pinecone.Index(index_name)

# ベクトル挿入
vectors = [
    ("product-1", [0.1, 0.2, 0.3, ...], {"category": "electronics"}),
    ("product-2", [0.4, 0.5, 0.6, ...], {"category": "books"})
]
index.upsert(vectors)

# 類似度検索
query_vector = [0.15, 0.25, 0.35, ...]
results = index.query(
    vector=query_vector,
    top_k=10,
    include_metadata=True
)
\`\`\`

**2. リアルタイムデータベース:**

**Firebase Realtime Database:**
\`\`\`javascript
// リアルタイム同期の例
import { ref, onValue, push } from 'firebase/database';

// データの監視
const messagesRef = ref(database, 'messages');
onValue(messagesRef, (snapshot) => {
  const data = snapshot.val();
  updateUI(data); // UIをリアルタイム更新
});

// データの追加
const newMessageRef = push(messagesRef);
set(newMessageRef, {
  text: 'Hello World',
  timestamp: Date.now(),
  user: 'alice'
});
\`\`\`

**3. マルチモデルデータベース:**

**Azure Cosmos DB:**
複数のデータモデルをサポート

\`\`\`sql
-- SQL API (DocumentDB)
SELECT c.id, c.productName, c.price
FROM containers c
WHERE c.category = 'electronics'

-- Gremlin API (Graph)
g.V().hasLabel('person').has('name', 'alice')
 .out('knows').hasLabel('person')
 .values('name')

-- Cassandra API
SELECT * FROM products
WHERE category = 'electronics'
AND price > 100
\`\`\`

**4. サーバーレスデータベース:**

**AWS Aurora Serverless:**
\`\`\`yaml
# AWS SAM template例
AuroraServerlessCluster:
  Type: AWS::RDS::DBCluster
  Properties:
    Engine: aurora-mysql
    EngineMode: serverless
    DatabaseName: !Ref DatabaseName
    MasterUsername: !Ref MasterUsername
    MasterUserPassword: !Ref MasterUserPassword
    ScalingConfiguration:
      AutoPause: true
      MaxCapacity: 256
      MinCapacity: 2
      SecondsUntilAutoPause: 300
\`\`\`

**5. エッジデータベース:**

**分散エッジコンピューティング:**
- レイテンシの最小化
- オフライン機能
- データローカライゼーション

**PouchDB/CouchDB:**
\`\`\`javascript
// オフライン対応の同期
const localDB = new PouchDB('local-products');
const remoteDB = new PouchDB('https://myserver.com/products');

// 双方向同期
localDB.sync(remoteDB, {
  live: true,
  retry: true
}).on('change', function (change) {
  console.log('同期完了:', change);
}).on('error', function (err) {
  console.log('同期エラー:', err);
});
\`\`\`

**6. ブロックチェーンデータベース:**

**分散台帳技術との統合:**
- 改ざん不可能なデータ保存
- スマートコントラクト連携
- 分散合意メカニズム

**Hyperledger Fabric 例:**
\`\`\`javascript
// チェーンコード（スマートコントラクト）
async function createProduct(ctx, productId, name, price) {
  const product = {
    productId,
    name,
    price,
    timestamp: new Date().toISOString(),
    owner: ctx.clientIdentity.getID()
  };

  await ctx.stub.putState(productId, Buffer.from(JSON.stringify(product)));
  return JSON.stringify(product);
}
\`\`\`

**7. 量子耐性データベース:**

**ポスト量子暗号:**
- 量子コンピュータ時代への備え
- 新しい暗号アルゴリズム採用
- 長期的データセキュリティ

**8. AIネイティブデータベース:**

**自動最適化機能:**
- 自動インデックス作成
- クエリプラン最適化
- 異常検知・自動修復

**Oracle Autonomous Database:**
\`\`\`sql
-- AI による自動SQL調整
ALTER SYSTEM SET "_optimizer_use_feedback" = TRUE;

-- 自動インデックス管理
EXEC DBMS_AUTO_INDEX.CONFIGURE('AUTO_INDEX_MODE', 'IMPLEMENT');

-- 自動統計収集
EXEC DBMS_STATS.SET_GLOBAL_PREFS('AUTO_STATS_EXTENSIONS', 'ON');
\`\`\`

**9. データメッシュアーキテクチャ:**

**分散データ所有権:**
- ドメイン指向の分散アーキテクチャ
- データプロダクトとしての管理
- セルフサーブ型データインフラ

**実装例:**
\`\`\`yaml
# Data Product 定義
apiVersion: v1
kind: DataProduct
metadata:
  name: customer-analytics
  domain: marketing
spec:
  datasets:
    - name: customer-behavior
      schema: customer_behavior_v1.avro
      quality:
        freshness: 1h
        accuracy: 99.9%
  apis:
    - type: GraphQL
      endpoint: /graphql/customer-analytics
    - type: REST
      endpoint: /api/v1/customers
\`\`\`

**10. 持続可能なデータベース:**

**グリーンコンピューティング:**
- エネルギー効率の最適化
- カーボンフットプリント削減
- 再生可能エネルギー活用

**最適化手法:**
- インテリジェントなデータティアリング
- 使用頻度に基づくストレージ最適化
- AIによる電力消費予測・制御`,
        quiz: {
          question: 'ベクトルデータベースが主に最適化されている処理はどれですか？',
          options: [
            '完全一致検索',
            '範囲検索',
            '類似度検索',
            '集計処理'
          ],
          correct: 2,
          explanation: 'ベクトルデータベースは、AI・機械学習で生成される高次元ベクトルデータの類似度検索に最適化されています。埋め込み（Embedding）データの管理や推薦システムに活用されます。'
        }
      },
      {
        title: 'データベース統合・移行',
        content: `データベースの統合と移行の戦略と実装について学習します。

**移行戦略の種類:**

**1. ビッグバン移行:**
- 一括での完全切り替え
- ダウンタイムあり
- リスクは高いが期間は短い

**2. 段階的移行:**
- 機能・モジュール単位での移行
- ダウンタイム最小化
- 複雑だが安全

**3. パラレル運用:**
- 新旧システム同時稼働
- データ同期が必要
- 最も安全だがコスト高

**移行計画フェーズ:**

**Phase 1: 現状分析・計画立案**

**データベース監査:**
\`\`\`sql
-- MySQL での現状分析
-- テーブル情報取得
SELECT
  TABLE_SCHEMA as 'Database',
  TABLE_NAME as 'Table',
  ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) as 'Size (MB)',
  TABLE_ROWS as 'Rows'
FROM information_schema.TABLES
WHERE TABLE_SCHEMA NOT IN ('information_schema', 'mysql', 'performance_schema')
ORDER BY (DATA_LENGTH + INDEX_LENGTH) DESC;

-- インデックス使用状況
SELECT
  OBJECT_SCHEMA,
  OBJECT_NAME,
  INDEX_NAME,
  COUNT_FETCH,
  COUNT_INSERT,
  COUNT_UPDATE,
  COUNT_DELETE
FROM performance_schema.table_io_waits_summary_by_index_usage
WHERE OBJECT_SCHEMA NOT IN ('mysql', 'performance_schema', 'information_schema')
ORDER BY COUNT_FETCH DESC;
\`\`\`

**依存関係マッピング:**
\`\`\`sql
-- 外部キー制約の確認
SELECT
  CONSTRAINT_NAME,
  TABLE_NAME,
  COLUMN_NAME,
  REFERENCED_TABLE_NAME,
  REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE CONSTRAINT_SCHEMA = 'your_database'
  AND REFERENCED_TABLE_NAME IS NOT NULL;
\`\`\`

**Phase 2: データマッピング・変換**

**スキーマ変換例:**
\`\`\`sql
-- Oracle から PostgreSQL への変換例

-- Oracle
CREATE TABLE employees (
  id NUMBER(10) PRIMARY KEY,
  name VARCHAR2(100),
  hire_date DATE,
  salary NUMBER(10,2)
);

-- PostgreSQL
CREATE TABLE employees (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100),
  hire_date DATE,
  salary DECIMAL(10,2)
);
\`\`\`

**データ型マッピング:**
\`\`\`yaml
# データ型変換マッピング定義
oracle_to_postgresql:
  NUMBER: DECIMAL
  VARCHAR2: VARCHAR
  DATE: DATE
  TIMESTAMP: TIMESTAMP
  CLOB: TEXT
  BLOB: BYTEA
  CHAR: CHAR

sql_server_to_mysql:
  INT: INT
  NVARCHAR: VARCHAR
  DATETIME: DATETIME
  BIT: BOOLEAN
  MONEY: DECIMAL(19,4)
  UNIQUEIDENTIFIER: VARCHAR(36)
\`\`\`

**Phase 3: 移行ツールと手法**

**AWS Database Migration Service (DMS):**
\`\`\`json
{
  "ReplicationInstanceIdentifier": "migration-instance",
  "ReplicationInstanceClass": "dms.t3.large",
  "AllocatedStorage": 100,
  "ReplicationSubnetGroupIdentifier": "migration-subnet-group",
  "VpcSecurityGroupIds": ["sg-12345678"],
  "MultiAZ": true,
  "ReplicationTasks": [
    {
      "ReplicationTaskIdentifier": "full-load-task",
      "SourceEndpointArn": "arn:aws:dms:region:account:endpoint:source",
      "TargetEndpointArn": "arn:aws:dms:region:account:endpoint:target",
      "MigrationType": "full-load-and-cdc",
      "TableMappings": {
        "rules": [
          {
            "rule-type": "selection",
            "rule-id": "1",
            "rule-name": "include-all-tables",
            "object-locator": {
              "schema-name": "public",
              "table-name": "%"
            },
            "rule-action": "include"
          }
        ]
      }
    }
  ]
}
\`\`\`

**Azure Database Migration Service:**
\`\`\`powershell
# Azure DMS プロジェクト作成
az dms project create
  --service-name "MyDMSService"
  --project-name "SQLToPostgreSQL"
  --source-platform "SQL"
  --target-platform "PostgreSQL"
  --resource-group "MyResourceGroup"

# 移行タスク実行
az dms project task create
  --service-name "MyDMSService"
  --project-name "SQLToPostgreSQL"
  --task-name "MigrateDatabase"
  --source-connection-json @source-connection.json
  --target-connection-json @target-connection.json
  --database-options-json @database-options.json
\`\`\`

**Phase 4: データ同期・検証**

**ストリーミングレプリケーション:**
\`\`\`sql
-- PostgreSQL の論理レプリケーション設定
-- パブリッシャー側
CREATE PUBLICATION migration_pub FOR ALL TABLES;

-- サブスクライバー側
CREATE SUBSCRIPTION migration_sub
CONNECTION 'host=source-db port=5432 dbname=mydb user=replica_user'
PUBLICATION migration_pub;

-- レプリケーション状態確認
SELECT * FROM pg_stat_subscription;
SELECT * FROM pg_publication_tables;
\`\`\`

**データ整合性チェック:**
\`\`\`sql
-- レコード数比較
SELECT 'source' as db, COUNT(*) as count FROM source_table
UNION ALL
SELECT 'target' as db, COUNT(*) as count FROM target_table;

-- チェックサム比較
SELECT
  'source' as db,
  MD5(GROUP_CONCAT(id, name, email ORDER BY id)) as checksum
FROM source_users
UNION ALL
SELECT
  'target' as db,
  MD5(GROUP_CONCAT(id, name, email ORDER BY id)) as checksum
FROM target_users;
\`\`\`

**Phase 5: カットオーバー・ロールバック計画**

**カットオーバー手順:**
\`\`\`bash
#!/bin/bash
# カットオーバースクリプト例

echo "Starting cutover process..."

# 1. アプリケーション停止
echo "Stopping application..."
systemctl stop myapp

# 2. 最終データ同期
echo "Final data sync..."
pg_dump --data-only source_db | psql target_db

# 3. DNS切り替え
echo "Switching DNS..."
aws route53 change-resource-record-sets --change-batch file://dns-change.json

# 4. アプリケーション起動（新DB接続）
echo "Starting application with new database..."
systemctl start myapp

# 5. ヘルスチェック
echo "Health check..."
curl -f http://localhost:8080/health || exit 1

echo "Cutover completed successfully!"
\`\`\`

**ロールバック手順:**
\`\`\`bash
#!/bin/bash
# ロールバックスクリプト例

echo "Starting rollback process..."

# 1. アプリケーション停止
systemctl stop myapp

# 2. DNS復旧
aws route53 change-resource-record-sets --change-batch file://dns-rollback.json

# 3. 旧データベースへの差分反映（必要に応じて）
# mysqldump --single-transaction new_db | mysql old_db

# 4. アプリケーション起動（旧DB接続）
systemctl start myapp

echo "Rollback completed!"
\`\`\`

**移行後の運用監視:**

**パフォーマンス比較:**
\`\`\`sql
-- 移行前後のパフォーマンス比較
WITH performance_metrics AS (
  SELECT
    'before_migration' as period,
    AVG(query_time) as avg_query_time,
    MAX(query_time) as max_query_time,
    COUNT(*) as query_count
  FROM migration_performance_before
  UNION ALL
  SELECT
    'after_migration' as period,
    AVG(query_time) as avg_query_time,
    MAX(query_time) as max_query_time,
    COUNT(*) as query_count
  FROM migration_performance_after
)
SELECT * FROM performance_metrics;
\`\`\`

**移行成功の指標:**
- データ整合性: 100%
- アプリケーション可用性: 99.9%+
- パフォーマンス劣化: 10%以下
- 予定ダウンタイム内での完了`,
        quiz: {
          question: 'データベース移行におけるパラレル運用方式の特徴はどれですか？',
          options: [
            '一括での完全切り替えを行う',
            '機能単位で段階的に移行する',
            '新旧システムを同時稼働させる',
            'ダウンタイムを最小化する'
          ],
          correct: 2,
          explanation: 'パラレル運用方式では、新旧システムを同時に稼働させ、データ同期を取りながら徐々に移行を進めます。最も安全な手法ですが、運用コストが高くなります。'
        }
      },
      {
        title: 'データベース性能分析',
        content: `データベースの詳細な性能分析手法について学習します。

**性能分析の階層:**

**1. システムレベル分析:**
- CPU使用率
- メモリ使用量
- ディスクI/O
- ネットワーク帯域

**2. データベースレベル分析:**
- 接続数
- クエリ実行時間
- インデックス効率
- ロック競合

**3. クエリレベル分析:**
- 実行プラン
- カーディナリティ
- 結合効率
- 述語選択性

**詳細な性能監視:**

**PostgreSQL Performance Insights:**
\`\`\`sql
-- 長時間実行クエリの特定
SELECT
  query,
  calls,
  total_time,
  mean_time,
  stddev_time,
  (total_time / sum(total_time) OVER()) * 100 AS percentage
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;

-- 待機イベント分析
SELECT
  wait_event_type,
  wait_event,
  COUNT(*) as wait_count,
  AVG(wait_time_ms) as avg_wait_time
FROM pg_stat_activity
WHERE state = 'active'
GROUP BY wait_event_type, wait_event
ORDER BY wait_count DESC;

-- インデックス使用状況
SELECT
  schemaname,
  tablename,
  indexname,
  idx_tup_read,
  idx_tup_fetch,
  idx_tup_read::float / NULLIF(idx_tup_fetch, 0) as selectivity
FROM pg_stat_user_indexes
ORDER BY idx_tup_read DESC;
\`\`\`

**MySQL Performance Schema:**
\`\`\`sql
-- スロークエリ分析
SELECT
  digest_text,
  count_star,
  avg_timer_wait / 1000000000 as avg_time_sec,
  sum_timer_wait / 1000000000 as total_time_sec
FROM performance_schema.events_statements_summary_by_digest
ORDER BY sum_timer_wait DESC
LIMIT 10;

-- メモリ使用量分析
SELECT
  event_name,
  current_count_used,
  current_size_allocated / 1024 / 1024 as current_mb,
  high_count_used,
  high_size_allocated / 1024 / 1024 as high_mb
FROM performance_schema.memory_summary_global_by_event_name
WHERE current_size_allocated > 0
ORDER BY current_size_allocated DESC;

-- テーブルI/O統計
SELECT
  object_schema,
  object_name,
  count_read,
  count_write,
  count_fetch,
  count_insert,
  count_update,
  count_delete
FROM performance_schema.table_io_waits_summary_by_table
WHERE object_schema NOT IN ('mysql', 'performance_schema', 'information_schema')
ORDER BY count_read + count_write DESC;
\`\`\`

**実行プラン詳細分析:**

**PostgreSQL EXPLAIN ANALYZE:**
\`\`\`sql
-- 詳細実行プラン取得
EXPLAIN (ANALYZE, BUFFERS, VERBOSE, FORMAT JSON)
SELECT c.customer_name, COUNT(o.order_id) as order_count
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE c.created_date >= '2023-01-01'
GROUP BY c.customer_id, c.customer_name
HAVING COUNT(o.order_id) > 5
ORDER BY order_count DESC;

-- バッファ使用状況付き
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM large_table WHERE indexed_column = 'value';
/*
結果例:
Index Scan using idx_indexed_column on large_table
  (cost=0.43..8.45 rows=1 width=100)
  (actual time=0.089..0.091 rows=1 loops=1)
  Index Cond: (indexed_column = 'value'::text)
  Buffers: shared hit=4
Planning Time: 0.123 ms
Execution Time: 0.132 ms
*/
\`\`\`

**カーディナリティ分析:**
\`\`\`sql
-- 列の選択性分析
SELECT
  schemaname,
  tablename,
  attname,
  n_distinct,
  (n_distinct::float / reltuples) * 100 as selectivity_percent
FROM pg_stats s
JOIN pg_class c ON s.tablename = c.relname
WHERE schemaname = 'public'
  AND n_distinct > 1
ORDER BY selectivity_percent DESC;

-- 統計情報の更新
ANALYZE verbose customers;

-- 複合インデックスの効果測定
CREATE INDEX CONCURRENTLY idx_customer_date_status
ON orders (customer_id, order_date, status);

-- インデックス効果の確認
SELECT
  pg_size_pretty(pg_relation_size('idx_customer_date_status')) as index_size,
  pg_size_pretty(pg_relation_size('orders')) as table_size;
\`\`\`

**リソース消費分析:**

**接続プール分析:**
\`\`\`sql
-- PostgreSQL 接続状態
SELECT
  state,
  COUNT(*) as connection_count,
  AVG(EXTRACT(epoch FROM (now() - state_change))) as avg_duration_sec
FROM pg_stat_activity
WHERE state IS NOT NULL
GROUP BY state;

-- アイドル接続の特定
SELECT
  pid,
  usename,
  application_name,
  state,
  state_change,
  query_start,
  query
FROM pg_stat_activity
WHERE state = 'idle in transaction'
  AND state_change < now() - interval '5 minutes';
\`\`\`

**ロック競合分析:**
\`\`\`sql
-- PostgreSQL ロック待ちクエリ
WITH lock_waits AS (
  SELECT
    blocked_locks.pid AS blocked_pid,
    blocked_activity.usename AS blocked_user,
    blocking_locks.pid AS blocking_pid,
    blocking_activity.usename AS blocking_user,
    blocked_activity.query AS blocked_statement,
    blocking_activity.query AS current_statement_in_blocking_process
  FROM pg_catalog.pg_locks blocked_locks
  JOIN pg_catalog.pg_stat_activity blocked_activity
    ON blocked_activity.pid = blocked_locks.pid
  JOIN pg_catalog.pg_locks blocking_locks
    ON blocking_locks.locktype = blocked_locks.locktype
    AND blocking_locks.database IS NOT DISTINCT FROM blocked_locks.database
    AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation
    AND blocking_locks.page IS NOT DISTINCT FROM blocked_locks.page
    AND blocking_locks.tuple IS NOT DISTINCT FROM blocked_locks.tuple
    AND blocking_locks.virtualxid IS NOT DISTINCT FROM blocked_locks.virtualxid
    AND blocking_locks.transactionid IS NOT DISTINCT FROM blocked_locks.transactionid
    AND blocking_locks.classid IS NOT DISTINCT FROM blocked_locks.classid
    AND blocking_locks.objid IS NOT DISTINCT FROM blocked_locks.objid
    AND blocking_locks.objsubid IS NOT DISTINCT FROM blocked_locks.objsubid
    AND blocking_locks.pid != blocked_locks.pid
  JOIN pg_catalog.pg_stat_activity blocking_activity
    ON blocking_activity.pid = blocking_locks.pid
  WHERE NOT blocked_locks.granted
)
SELECT * FROM lock_waits;
\`\`\`

**自動性能チューニング:**

**PostgreSQL auto_explain:**
\`\`\`sql
-- postgresql.confでの設定
-- shared_preload_libraries = 'auto_explain'
-- auto_explain.log_min_duration = 1000  -- 1秒以上のクエリ
-- auto_explain.log_analyze = true
-- auto_explain.log_buffers = true
-- auto_explain.log_timing = true
-- auto_explain.log_nested_statements = true

-- 設定の動的変更（セッション単位）
LOAD 'auto_explain';
SET auto_explain.log_min_duration = 0;
SET auto_explain.log_analyze = true;

-- この後実行されるクエリの実行プランが自動でログ出力される
SELECT * FROM large_table WHERE complex_condition = 'value';
\`\`\`

**性能ベンチマーク:**

**pgbench でのベンチマーク:**
\`\`\`bash
# データベース初期化
pgbench -i -s 10 testdb  # スケール10でテストデータ作成

# ベンチマーク実行
pgbench -c 10 -j 2 -t 1000 testdb
# -c: 同時接続数, -j: スレッド数, -t: トランザクション数

# カスタムシナリオ実行
pgbench -c 10 -j 2 -T 60 -f custom_scenario.sql testdb
\`\`\`

**カスタムベンチマークシナリオ:**
\`\`\`sql
-- custom_scenario.sql
BEGIN;
SELECT * FROM accounts WHERE aid = :aid;
UPDATE accounts SET abalance = abalance + :delta WHERE aid = :aid;
INSERT INTO history (tid, bid, aid, delta, mtime)
VALUES (:tid, :bid, :aid, :delta, CURRENT_TIMESTAMP);
COMMIT;
\`\`\`

**継続的性能監視:**
\`\`\`python
# Python での性能監視自動化例
import psycopg2
import time
import json

def collect_performance_metrics():
    conn = psycopg2.connect("dbname=mydb user=monitor")
    cur = conn.cursor()

    # スロークエリ収集
    cur.execute("""
        SELECT query, calls, total_time, mean_time
        FROM pg_stat_statements
        WHERE mean_time > 1000  -- 1秒以上
        ORDER BY total_time DESC LIMIT 10
    """)

    slow_queries = cur.fetchall()

    # 接続数監視
    cur.execute("SELECT count(*) FROM pg_stat_activity")
    connection_count = cur.fetchone()[0]

    # データベースサイズ
    cur.execute("SELECT pg_database_size(current_database())")
    db_size = cur.fetchone()[0]

    metrics = {
        'timestamp': time.time(),
        'slow_queries': slow_queries,
        'connection_count': connection_count,
        'database_size': db_size
    }

    return metrics

# 定期実行
while True:
    metrics = collect_performance_metrics()
    print(json.dumps(metrics, indent=2))
    time.sleep(300)  # 5分間隔
\`\`\``,
        quiz: {
          question: 'PostgreSQLのpg_stat_statementsビューで確認できる情報はどれですか？',
          options: [
            'テーブルのサイズ情報',
            '実行されたクエリの統計情報',
            'インデックスの使用状況',
            'ユーザーの接続状態'
          ],
          correct: 1,
          explanation: 'pg_stat_statementsビューは、実行されたSQL文の統計情報（実行回数、合計実行時間、平均実行時間など）を提供し、性能分析に重要な情報源となります。'
        }
      },
      {
        title: 'グローバルデータベース',
        content: `グローバル規模でのデータベース運用について学習します。

**グローバルデータベースの課題:**

**1. レイテンシ（遅延）:**
- 地理的距離による通信遅延
- ネットワーク品質の差
- リアルタイム性要件との両立

**2. データ主権・規制:**
- GDPR（EU一般データ保護規則）
- 個人情報保護法（日本）
- データローカライゼーション要件

**3. 一貫性vs可用性:**
- CAP定理の制約
- 結果的一貫性の許容範囲
- 障害時のフェールオーバー

**グローバル分散アーキテクチャ:**

**1. マルチリージョン配置:**

**AWS RDS Global Database:**
\`\`\`yaml
# CloudFormation例
GlobalDatabase:
  Type: AWS::RDS::GlobalCluster
  Properties:
    GlobalClusterIdentifier: my-global-cluster
    Engine: aurora-mysql
    EngineVersion: 5.7.mysql_aurora.2.07.2

PrimaryCluster:
  Type: AWS::RDS::DBCluster
  Properties:
    GlobalClusterIdentifier: !Ref GlobalDatabase
    Engine: aurora-mysql
    MasterUsername: admin
    MasterUserPassword: !Ref DBPassword
    DatabaseName: myapp

SecondaryCluster:
  Type: AWS::RDS::DBCluster
  Properties:
    GlobalClusterIdentifier: !Ref GlobalDatabase
    Engine: aurora-mysql
    SourceRegion: us-east-1  # プライマリリージョン
\`\`\`

**2. Google Cloud Spanner:**
グローバル一貫性を保つ分散データベース

\`\`\`sql
-- インスタンス設定
CREATE INSTANCE my-global-instance
CONFIGURATION regional-us-central1
DISPLAY_NAME "Global Application Database"
NODE_COUNT 3;

-- グローバルテーブル作成
CREATE TABLE Users (
  UserId STRING(36) NOT NULL,
  Email STRING(255),
  Name STRING(100),
  Region STRING(10),
  CreatedAt TIMESTAMP NOT NULL OPTIONS (allow_commit_timestamp=true)
) PRIMARY KEY (UserId);

-- リージョン分散クエリ
SELECT Region, COUNT(*) as UserCount
FROM Users
GROUP BY Region;
\`\`\`

**3. データ分散戦略:**

**地理的シャーディング:**
\`\`\`python
# アプリケーションレベルでの地理的ルーティング
class GeoDatabaseRouter:
    def __init__(self):
        self.regions = {
            'US': 'us-west-2.rds.amazonaws.com',
            'EU': 'eu-west-1.rds.amazonaws.com',
            'APAC': 'ap-northeast-1.rds.amazonaws.com'
        }

    def get_connection(self, user_region):
        db_host = self.regions.get(user_region, self.regions['US'])
        return connect_to_database(db_host)

    def route_query(self, user_location, query):
        # ユーザーの位置情報に基づいてDB選択
        region = self.detect_region(user_location)
        conn = self.get_connection(region)
        return conn.execute(query)
\`\`\`

**データ同期戦略:**

**1. 非同期レプリケーション:**
\`\`\`sql
-- MySQL Binlog レプリケーション設定
-- マスター設定 (my.cnf)
/*
[mysqld]
log-bin=mysql-bin
server-id=1
binlog-format=ROW
gtid-mode=ON
enforce-gtid-consistency=ON
*/

-- スレーブ設定
CHANGE MASTER TO
  MASTER_HOST='master.example.com',
  MASTER_USER='replicator',
  MASTER_PASSWORD='password',
  MASTER_AUTO_POSITION=1;

START SLAVE;

-- レプリケーション遅延監視
SHOW SLAVE STATUS\G
-- Seconds_Behind_Master の値を監視
\`\`\`

**2. クロスリージョン同期:**
\`\`\`javascript
// DynamoDB Global Tables
const AWS = require('aws-sdk');

// 複数リージョンでのDynamoDB設定
const dynamoUS = new AWS.DynamoDB({region: 'us-east-1'});
const dynamoEU = new AWS.DynamoDB({region: 'eu-west-1'});
const dynamoAP = new AWS.DynamoDB({region: 'ap-southeast-1'});

// Global Tables有効化
const params = {
  GlobalTableName: 'Users',
  ReplicationGroup: [
    {RegionName: 'us-east-1'},
    {RegionName: 'eu-west-1'},
    {RegionName: 'ap-southeast-1'}
  ]
};

dynamoUS.createGlobalTable(params, function(err, data) {
  if (err) console.log(err);
  else console.log('Global Table created:', data);
});
\`\`\`

**コンフリクト解決:**

**1. Last-Writer-Wins (LWW):**
\`\`\`sql
-- タイムスタンプベースの競合解決
CREATE TABLE user_profiles (
  user_id BIGINT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  version BIGINT DEFAULT 1
);

-- 更新時のバージョンチェック
UPDATE user_profiles
SET name = 'New Name',
    version = version + 1,
    updated_at = CURRENT_TIMESTAMP
WHERE user_id = 123
  AND version = @expected_version;
\`\`\`

**2. Vector Clocks:**
\`\`\`python
# ベクタークロック実装例
class VectorClock:
    def __init__(self, node_id):
        self.node_id = node_id
        self.clock = {}

    def tick(self):
        self.clock[self.node_id] = self.clock.get(self.node_id, 0) + 1
        return self.clock.copy()

    def update(self, other_clock):
        for node, timestamp in other_clock.items():
            self.clock[node] = max(self.clock.get(node, 0), timestamp)
        self.tick()

    def happens_before(self, other_clock):
        # このクロックが他のクロックより前かチェック
        return (all(self.clock.get(node, 0) <= other_clock.get(node, 0)
                   for node in set(self.clock.keys()) | set(other_clock.keys())) and
                self.clock != other_clock)

# 使用例
node_a = VectorClock('A')
node_b = VectorClock('B')

# ノードAで操作実行
clock_a1 = node_a.tick()  # {'A': 1}

# ノードBで操作実行
clock_b1 = node_b.tick()  # {'B': 1}

# 同期
node_a.update(clock_b1)   # {'A': 2, 'B': 1}
\`\`\`

**災害復旧・事業継続:**

**1. RTO/RPO設計:**
\`\`\`yaml
# 災害復旧要件定義
disaster_recovery:
  rto: 4h  # Recovery Time Objective
  rpo: 15m # Recovery Point Objective

  primary_region: us-east-1
  backup_regions:
    - us-west-2
    - eu-west-1

  backup_strategy:
    - type: continuous_backup
      frequency: real-time
      retention: 35days
    - type: snapshot
      frequency: daily
      retention: 90days
\`\`\`

**2. 自動フェールオーバー:**
\`\`\`python
# ヘルスチェック＆フェールオーバー
import time
import requests

class DatabaseFailover:
    def __init__(self):
        self.primary = 'primary.db.example.com'
        self.secondary = 'secondary.db.example.com'
        self.current = self.primary
        self.health_check_interval = 30

    def health_check(self, endpoint):
        try:
            response = requests.get(f'http://{endpoint}/health', timeout=5)
            return response.status_code == 200
        except:
            return False

    def failover(self):
        if self.current == self.primary:
            print("Failing over to secondary database")
            self.current = self.secondary
            # DNS更新、アプリケーション設定変更等
            self.update_dns_record(self.secondary)
        else:
            print("Already running on secondary")

    def monitor(self):
        while True:
            if not self.health_check(self.current):
                print(f"Health check failed for {self.current}")
                self.failover()
            time.sleep(self.health_check_interval)
\`\`\`

**規制対応・データガバナンス:**

**GDPR対応例:**
\`\`\`sql
-- 忘れられる権利（Right to be forgotten）実装
CREATE TABLE user_deletions (
  user_id BIGINT,
  deletion_requested_at TIMESTAMP,
  deletion_completed_at TIMESTAMP,
  reason TEXT
);

-- 個人データ削除プロシージャ
DELIMITER //
CREATE PROCEDURE DeleteUserData(IN p_user_id BIGINT)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;

  START TRANSACTION;

  -- 削除リクエスト記録
  INSERT INTO user_deletions (user_id, deletion_requested_at, reason)
  VALUES (p_user_id, NOW(), 'GDPR Right to be forgotten');

  -- 関連データ削除
  DELETE FROM user_activities WHERE user_id = p_user_id;
  DELETE FROM user_preferences WHERE user_id = p_user_id;
  DELETE FROM user_profiles WHERE user_id = p_user_id;

  -- 削除完了記録
  UPDATE user_deletions
  SET deletion_completed_at = NOW()
  WHERE user_id = p_user_id AND deletion_completed_at IS NULL;

  COMMIT;
END//
DELIMITER ;
\`\`\`

**データローカライゼーション:**
\`\`\`sql
-- 地域別データ分離
CREATE TABLE user_data_eu (
  user_id BIGINT PRIMARY KEY,
  data JSON,
  created_at TIMESTAMP,
  CONSTRAINT region_check CHECK (JSON_EXTRACT(data, '$.region') = 'EU')
);

CREATE TABLE user_data_us (
  user_id BIGINT PRIMARY KEY,
  data JSON,
  created_at TIMESTAMP,
  CONSTRAINT region_check CHECK (JSON_EXTRACT(data, '$.region') = 'US')
);

-- 統合ビュー（管理用）
CREATE VIEW global_users AS
SELECT user_id, data, created_at, 'EU' as region FROM user_data_eu
UNION ALL
SELECT user_id, data, created_at, 'US' as region FROM user_data_us;
\`\`\``,
        quiz: {
          question: 'CAP定理において、ネットワーク分断（Partition tolerance）が発生した場合に選択する必要があるものは？',
          options: [
            '一貫性（Consistency）と可用性（Availability）',
            '一貫性（Consistency）と分断耐性（Partition tolerance）',
            '可用性（Availability）と分断耐性（Partition tolerance）',
            'すべてを同時に保つ'
          ],
          correct: 0,
          explanation: 'CAP定理では、ネットワーク分断が発生した場合、一貫性（すべてのノードが同じデータを持つ）か可用性（システムが応答し続ける）のどちらかを選択する必要があります。両方を同時に満たすことはできません。'
        }
      },
      {
        title: 'データベース開発手法',
        content: `データベース開発における手法とプロセスについて学習します。

**データベース開発ライフサイクル:**

**1. 要件分析フェーズ:**
- 機能要件の特定
- 非機能要件の定義
- データ量・トランザクション量の予測
- 性能要件の明確化

**2. 概念設計フェーズ:**
- ER図の作成
- エンティティの特定
- 関係性の定義
- 業務ルールの表現

**3. 論理設計フェーズ:**
- テーブル設計
- 正規化の適用
- インデックス設計
- 制約の定義

**4. 物理設計フェーズ:**
- ストレージ設計
- パーティション設計
- パフォーマンスチューニング
- セキュリティ設計

**アジャイル開発におけるデータベース:**

**データベースリファクタリング:**
\`\`\`sql
-- マイグレーション例：列名変更
-- ステップ1: 新しい列を追加
ALTER TABLE customers ADD COLUMN full_name VARCHAR(100);

-- ステップ2: データを移行
UPDATE customers SET full_name = CONCAT(first_name, ' ', last_name);

-- ステップ3: アプリケーション変更をデプロイ

-- ステップ4: 古い列を削除（次のリリースで）
ALTER TABLE customers DROP COLUMN first_name, DROP COLUMN last_name;
\`\`\`

**データベースバージョン管理:**
\`\`\`sql
-- Flyway マイグレーション例
-- V1__Initial_schema.sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- V2__Add_user_profile.sql
CREATE TABLE user_profiles (
  user_id BIGINT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  bio TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- V3__Add_email_verification.sql
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN verification_token VARCHAR(255);
\`\`\`

**テスト駆動データベース開発:**

**単体テスト例:**
\`\`\`sql
-- PostgreSQLでのpgTAP使用例
BEGIN;
SELECT plan(5);

-- テーブルの存在確認
SELECT has_table('public', 'users', 'users table should exist');

-- 列の存在確認
SELECT has_column('public', 'users', 'email', 'users should have email column');

-- 制約の確認
SELECT has_pk('public', 'users', 'users should have primary key');

-- データの確認
INSERT INTO users (username, email) VALUES ('testuser', 'test@example.com');
SELECT is(
  (SELECT count(*) FROM users WHERE username = 'testuser'),
  1::bigint,
  'Should have one test user'
);

-- クリーンアップ
DELETE FROM users WHERE username = 'testuser';

SELECT finish();
ROLLBACK;
\`\`\`

**データベースCICD:**

**GitHub Actions例:**
\`\`\`yaml
# .github/workflows/database.yml
name: Database CI/CD

on:
  push:
    branches: [main]
    paths: ['database/**']

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
    - uses: actions/checkout@v2

    - name: Run migrations
      run: |
        PGPASSWORD=postgres psql -h localhost -U postgres -d postgres -f database/schema.sql

    - name: Run tests
      run: |
        PGPASSWORD=postgres psql -h localhost -U postgres -d postgres -f database/tests.sql

    - name: Run performance tests
      run: |
        python scripts/performance_test.py

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
    - name: Deploy to staging
      run: |
        flyway -url=jdbc:postgresql://staging-db:5432/mydb migrate

    - name: Run smoke tests
      run: |
        python scripts/smoke_test.py staging

    - name: Deploy to production
      run: |
        flyway -url=jdbc:postgresql://prod-db:5432/mydb migrate
\`\`\`

**データモデリング手法:**

**ドメイン駆動設計（DDD）:**
\`\`\`sql
-- 境界付きコンテキストに基づくスキーマ設計
-- ユーザー管理コンテキスト
CREATE SCHEMA user_management;

CREATE TABLE user_management.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 注文管理コンテキスト
CREATE SCHEMA order_management;

CREATE TABLE order_management.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL, -- 外部参照（異なるコンテキスト）
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- イベントストア（コンテキスト間連携）
CREATE SCHEMA event_store;

CREATE TABLE event_store.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aggregate_id UUID NOT NULL,
  aggregate_type VARCHAR(50) NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB NOT NULL,
  version INTEGER NOT NULL,
  occurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

**マイクロサービス向けデータベース設計:**

**Database per Service:**
\`\`\`yaml
# docker-compose.yml
version: '3.8'
services:
  user-service-db:
    image: postgres:14
    environment:
      POSTGRES_DB: user_service
      POSTGRES_USER: user_service
      POSTGRES_PASSWORD: password

  order-service-db:
    image: postgres:14
    environment:
      POSTGRES_DB: order_service
      POSTGRES_USER: order_service
      POSTGRES_PASSWORD: password

  product-service-db:
    image: mongodb:5.0
    environment:
      MONGO_INITDB_DATABASE: product_service

  analytics-service-db:
    image: clickhouse/clickhouse-server:22
    environment:
      CLICKHOUSE_DB: analytics
\`\`\`

**イベントソーシング:**
\`\`\`sql
-- イベントストリーム設計
CREATE TABLE event_streams (
  stream_id UUID NOT NULL,
  version INTEGER NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB NOT NULL,
  metadata JSONB,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (stream_id, version)
);

-- プロジェクション（読み取りモデル）
CREATE TABLE user_projections (
  user_id UUID PRIMARY KEY,
  username VARCHAR(50),
  email VARCHAR(100),
  status VARCHAR(20),
  last_updated TIMESTAMP
);

-- イベントハンドラー例
CREATE OR REPLACE FUNCTION handle_user_events()
RETURNS TRIGGER AS $$
BEGIN
  CASE NEW.event_type
    WHEN 'UserCreated' THEN
      INSERT INTO user_projections (user_id, username, email, status, last_updated)
      VALUES (
        NEW.stream_id,
        NEW.event_data->>'username',
        NEW.event_data->>'email',
        'active',
        NEW.timestamp
      );

    WHEN 'UserDeactivated' THEN
      UPDATE user_projections
      SET status = 'inactive', last_updated = NEW.timestamp
      WHERE user_id = NEW.stream_id;
  END CASE;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_event_trigger
  AFTER INSERT ON event_streams
  FOR EACH ROW
  EXECUTE FUNCTION handle_user_events();
\`\`\`

**データベース設計パターン:**

**CQRS（Command Query Responsibility Segregation）:**
\`\`\`sql
-- コマンド側（書き込み最適化）
CREATE TABLE commands.orders (
  id UUID PRIMARY KEY,
  customer_id UUID NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- クエリ側（読み取り最適化）
CREATE TABLE queries.order_summaries (
  order_id UUID PRIMARY KEY,
  customer_name VARCHAR(100),
  order_date DATE,
  total_amount DECIMAL(10,2),
  item_count INTEGER,
  status VARCHAR(20)
);

-- ビューマテリアライゼーション
CREATE MATERIALIZED VIEW queries.monthly_sales AS
SELECT
  DATE_TRUNC('month', order_date) as month,
  COUNT(*) as order_count,
  SUM(total_amount) as total_sales,
  AVG(total_amount) as avg_order_value
FROM queries.order_summaries
WHERE status = 'completed'
GROUP BY DATE_TRUNC('month', order_date);

-- 定期更新
CREATE OR REPLACE FUNCTION refresh_monthly_sales()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW queries.monthly_sales;
END;
$$ LANGUAGE plpgsql;

-- cron-style スケジューリング（pg_cron拡張使用）
SELECT cron.schedule('refresh-monthly-sales', '0 2 * * *', 'SELECT refresh_monthly_sales();');
\`\`\``,
        quiz: {
          question: 'データベースマイグレーションにおけるバージョン管理ツールFlyway の主な特徴はどれですか？',
          options: [
            'GUIベースの設計ツール',
            'SQLファイルベースのマイグレーション管理',
            'NoSQL専用のツール',
            'データ分析に特化したツール'
          ],
          correct: 1,
          explanation: 'Flywayは、SQLファイルベースでデータベースのマイグレーションを管理するツールです。バージョン番号付きのSQLファイルを実行して、データベーススキーマを段階的に更新できます。'
        }
      },
      {
        title: 'データベース運用監視',
        content: `データベースの運用監視体制と手法について学習します。

**監視の階層:**

**1. インフラストラクチャ監視:**
- CPU、メモリ、ディスク使用率
- ネットワーク帯域・レイテンシ
- ストレージI/O性能
- ハードウェア故障検知

**2. データベース監視:**
- 接続数・セッション状態
- スループット・レスポンス時間
- ロック競合・デッドロック
- バックアップ・レプリケーション状態

**3. アプリケーション監視:**
- クエリパフォーマンス
- エラー率・例外
- ビジネスメトリクス
- ユーザーエクスペリエンス

**監視ツール・システム:**

**Prometheus + Grafana:**
\`\`\`yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']
    scrape_interval: 10s
    metrics_path: /metrics

  - job_name: 'mysql'
    static_configs:
      - targets: ['mysqld-exporter:9104']
    scrape_interval: 10s

rule_files:
  - "database_alerts.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093
\`\`\`

**アラートルール:**
\`\`\`yaml
# database_alerts.yml
groups:
- name: database_alerts
  rules:
  - alert: DatabaseDown
    expr: up{job="postgres"} == 0
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "Database instance down"
      description: "PostgreSQL instance {{ $labels.instance }} has been down for more than 1 minute."

  - alert: HighConnectionCount
    expr: pg_stat_database_numbackends > 80
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High database connection count"
      description: "Database {{ $labels.datname }} has {{ $value }} connections"

  - alert: SlowQueries
    expr: rate(mysql_slow_queries[5m]) > 0.1
    for: 2m
    labels:
      severity: warning
    annotations:
      summary: "Increased slow queries detected"
      description: "Slow query rate is {{ $value }} queries per second"

  - alert: ReplicationLag
    expr: mysql_slave_lag_seconds > 30
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "MySQL replication lag"
      description: "Replication lag is {{ $value }} seconds"
\`\`\`

**カスタムメトリクス収集:**
\`\`\`python
# PostgreSQL カスタムメトリクス例
import psycopg2
import time
from prometheus_client import start_http_server, Gauge, Counter

# メトリクス定義
db_size_gauge = Gauge('postgres_database_size_bytes', 'Database size in bytes', ['database'])
active_connections_gauge = Gauge('postgres_active_connections', 'Number of active connections', ['database'])
query_duration_gauge = Gauge('postgres_avg_query_duration_seconds', 'Average query duration', ['database'])
deadlock_counter = Counter('postgres_deadlocks_total', 'Total deadlocks detected', ['database'])

class DatabaseMonitor:
    def __init__(self, connection_string):
        self.connection_string = connection_string

    def collect_metrics(self):
        try:
            conn = psycopg2.connect(self.connection_string)
            cur = conn.cursor()

            # データベースサイズ
            cur.execute("""
                SELECT datname, pg_database_size(datname)
                FROM pg_database
                WHERE datistemplate = false
            """)
            for db_name, size in cur.fetchall():
                db_size_gauge.labels(database=db_name).set(size)

            # アクティブ接続数
            cur.execute("""
                SELECT datname, count(*)
                FROM pg_stat_activity
                WHERE state = 'active'
                GROUP BY datname
            """)
            for db_name, count in cur.fetchall():
                active_connections_gauge.labels(database=db_name).set(count)

            # 平均クエリ実行時間
            cur.execute("""
                SELECT schemaname, mean_time
                FROM pg_stat_statements
                WHERE calls > 0
            """)
            for schema, mean_time in cur.fetchall():
                query_duration_gauge.labels(database=schema).set(mean_time / 1000)  # ms to seconds

            # デッドロック検出
            cur.execute("SELECT sum(deadlocks) FROM pg_stat_database")
            deadlocks = cur.fetchone()[0] or 0
            deadlock_counter.labels(database='all')._value._value = deadlocks

            conn.close()

        except Exception as e:
            print(f"Error collecting metrics: {e}")

def main():
    monitor = DatabaseMonitor("postgresql://monitor:password@localhost/postgres")

    # Prometheusメトリクスサーバー開始
    start_http_server(8000)

    while True:
        monitor.collect_metrics()
        time.sleep(30)  # 30秒間隔

if __name__ == '__main__':
    main()
\`\`\`

**ログ分析・集約:**

**ELK Stack設定:**
\`\`\`yaml
# docker-compose.yml for ELK
version: '3.8'
services:
  elasticsearch:
    image: elasticsearch:7.14.0
    environment:
      - discovery.type=single-node
    ports:
      - "9200:9200"

  logstash:
    image: logstash:7.14.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    ports:
      - "5044:5044"

  kibana:
    image: kibana:7.14.0
    ports:
      - "5601:5601"
    environment:
      ELASTICSEARCH_HOSTS: http://elasticsearch:9200
\`\`\`

**Logstash設定:**
\`\`\`ruby
# logstash.conf
input {
  beats {
    port => 5044
  }
}

filter {
  if [fields][type] == "postgresql" {
    grok {
      match => {
        "message" => "%{TIMESTAMP_ISO8601:timestamp} \[%{NUMBER:pid}\] %{WORD:level}: %{GREEDYDATA:query}"
      }
    }

    # スロークエリの検出
    if [query] =~ /duration: \d+\.\d+ ms/ {
      grok {
        match => {
          "query" => "duration: %{NUMBER:duration:float} ms"
        }
      }

      if [duration] > 1000 {
        mutate {
          add_tag => ["slow_query"]
        }
      }
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "database-logs-%{+YYYY.MM.dd}"
  }
}
\`\`\`

**自動化された運用タスク:**

**Ansible Playbook例:**
\`\`\`yaml
# database_maintenance.yml
---
- name: Database Maintenance
  hosts: database_servers
  become: yes

  tasks:
    - name: Update database statistics
      postgresql_query:
        db: "{{ item }}"
        query: "ANALYZE VERBOSE;"
      loop: "{{ databases }}"

    - name: Vacuum old data
      postgresql_query:
        db: "{{ item }}"
        query: "VACUUM (ANALYZE, VERBOSE);"
      loop: "{{ databases }}"

    - name: Check replication status
      postgresql_query:
        db: postgres
        query: "SELECT * FROM pg_stat_replication;"
      register: replication_status

    - name: Alert if replication lag
      mail:
        to: dba@company.com
        subject: "Replication Lag Alert"
        body: "Replication lag detected: {{ replication_status.query_result }}"
      when: replication_status.query_result | selectattr('state', 'equalto', 'streaming') | list | length == 0

    - name: Backup database
      postgresql_db:
        name: "{{ item }}"
        state: dump
        target: "/backup/{{ item }}_{{ ansible_date_time.date }}.sql"
      loop: "{{ databases }}"

    - name: Cleanup old backups
      find:
        paths: /backup
        age: 7d
        patterns: "*.sql"
      register: old_backups

    - name: Remove old backup files
      file:
        path: "{{ item.path }}"
        state: absent
      loop: "{{ old_backups.files }}"
\`\`\`

**障害対応手順:**

**ランブック例:**
\`\`\`yaml
# incident_response.yml
procedures:
  database_down:
    severity: critical
    steps:
      1: "Check database process status: ps aux | grep postgres"
      2: "Check system resources: df -h && free -m"
      3: "Review database logs: tail -f /var/log/postgresql/postgresql.log"
      4: "Attempt restart: systemctl restart postgresql"
      5: "If restart fails, escalate to DBA team"
      6: "Document incident in ticketing system"

  slow_performance:
    severity: high
    steps:
      1: "Identify slow queries: SELECT * FROM pg_stat_activity WHERE state = 'active' AND query_start < now() - interval '30 seconds'"
      2: "Check for blocking queries: SELECT * FROM pg_locks WHERE NOT granted"
      3: "Review recent query changes in application logs"
      4: "Consider query termination: SELECT pg_terminate_backend(pid)"
      5: "Update query statistics: ANALYZE"

  high_connections:
    severity: medium
    steps:
      1: "Check current connections: SELECT count(*) FROM pg_stat_activity"
      2: "Identify connection sources: SELECT client_addr, count(*) FROM pg_stat_activity GROUP BY client_addr"
      3: "Review application connection pooling configuration"
      4: "Consider increasing max_connections if appropriate"
      5: "Monitor for connection leaks in application"
\`\`\`

**パフォーマンス最適化の自動化:**
\`\`\`python
# 自動インデックス推奨システム
import psycopg2
import json

class IndexRecommendationEngine:
    def __init__(self, connection_string):
        self.conn = psycopg2.connect(connection_string)

    def analyze_slow_queries(self):
        """スロークエリからインデックス推奨を生成"""
        cur = self.conn.cursor()

        # スロークエリ取得
        cur.execute("""
            SELECT query, mean_time, calls
            FROM pg_stat_statements
            WHERE mean_time > 1000  -- 1秒以上
            ORDER BY mean_time DESC
            LIMIT 10
        """)

        slow_queries = cur.fetchall()
        recommendations = []

        for query, mean_time, calls in slow_queries:
            # クエリ解析（簡単な例）
            if 'WHERE' in query and 'JOIN' in query:
                # JOINとWHEREを含むクエリにインデックス推奨
                recommendations.append({
                    'query': query,
                    'mean_time': mean_time,
                    'calls': calls,
                    'recommendation': 'Consider adding composite index on JOIN and WHERE columns',
                    'priority': 'high' if mean_time > 5000 else 'medium'
                })

        return recommendations

    def check_unused_indexes(self):
        """未使用インデックスの検出"""
        cur = self.conn.cursor()

        cur.execute("""
            SELECT
                schemaname,
                tablename,
                indexname,
                idx_tup_read,
                idx_tup_fetch
            FROM pg_stat_user_indexes
            WHERE idx_tup_read = 0
            AND indexname NOT LIKE '%_pkey'  -- 主キーは除外
        """)

        unused_indexes = cur.fetchall()
        return [
            {
                'schema': schema,
                'table': table,
                'index': index,
                'recommendation': f'Consider dropping unused index {index}',
                'impact': 'Reduced storage and faster writes'
            }
            for schema, table, index, _, _ in unused_indexes
        ]

    def generate_report(self):
        """最適化レポート生成"""
        report = {
            'timestamp': time.time(),
            'index_recommendations': self.analyze_slow_queries(),
            'unused_indexes': self.check_unused_indexes()
        }

        return json.dumps(report, indent=2)

# 定期実行
engine = IndexRecommendationEngine("postgresql://user:pass@localhost/db")
report = engine.generate_report()
print(report)
\`\`\``,
        quiz: {
          question: 'データベース監視において、レプリケーション遅延を検知するために確認すべき主な指標はどれですか？',
          options: [
            'CPU使用率',
            'ディスク容量',
            'スレーブの遅延秒数',
            '接続数'
          ],
          correct: 2,
          explanation: 'レプリケーション遅延の監視では、スレーブ（レプリカ）がマスターからどれだけ遅れているかを示す「遅延秒数」が重要な指標です。MySQLでは Seconds_Behind_Master、PostgreSQLでは pg_stat_replication で確認できます。'
        }
      },
      {
        title: 'データベース容量設計',
        content: `データベースの容量設計と容量管理について学習します。

**容量設計の要素:**

**1. データ容量予測:**
- レコード数の成長予測
- 1レコードあたりのサイズ
- インデックスサイズ
- 一時領域の使用量

**2. I/O要件:**
- 読み取りIOPS
- 書き込みIOPS
- スループット要件
- レスポンス時間要件

**3. 成長予測:**
- ビジネス成長率
- データ保存期間
- アーカイブ戦略
- 容量増加パターン

**容量計算手法:**

**テーブルサイズ計算:**
\`\`\`sql
-- PostgreSQL でのテーブルサイズ計算
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as table_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as data_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as index_size,
    pg_stat_get_tuples_inserted(oid) as inserts,
    pg_stat_get_tuples_updated(oid) as updates,
    pg_stat_get_tuples_deleted(oid) as deletes
FROM pg_tables pt
JOIN pg_class pc ON pt.tablename = pc.relname
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- 成長率分析
WITH monthly_growth AS (
    SELECT
        date_trunc('month', created_at) as month,
        count(*) as new_records,
        avg(octet_length(data_column::text)) as avg_record_size
    FROM large_table
    WHERE created_at >= current_date - interval '12 months'
    GROUP BY date_trunc('month', created_at)
    ORDER BY month
)
SELECT
    month,
    new_records,
    avg_record_size,
    new_records * avg_record_size as monthly_data_size,
    sum(new_records * avg_record_size) OVER (ORDER BY month) as cumulative_size
FROM monthly_growth;
\`\`\`

**容量予測モデル:**
\`\`\`python
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta

class DatabaseCapacityPlanner:
    def __init__(self):
        self.models = {}

    def analyze_growth_pattern(self, historical_data):
        """過去データから成長パターンを分析"""
        df = pd.DataFrame(historical_data)
        df['date'] = pd.to_datetime(df['date'])
        df['days_since_start'] = (df['date'] - df['date'].min()).dt.days

        # 線形回帰モデル
        X = df[['days_since_start']].values
        y = df['total_size_gb'].values

        model = LinearRegression()
        model.fit(X, y)

        self.models['linear'] = model

        # 成長率計算
        daily_growth = model.coef_[0]
        monthly_growth = daily_growth * 30
        yearly_growth = daily_growth * 365

        return {
            'daily_growth_gb': daily_growth,
            'monthly_growth_gb': monthly_growth,
            'yearly_growth_gb': yearly_growth,
            'r_squared': model.score(X, y)
        }

    def predict_capacity(self, days_ahead):
        """将来の容量を予測"""
        if 'linear' not in self.models:
            raise ValueError("Growth pattern not analyzed yet")

        model = self.models['linear']
        current_day = 0  # 最新日を0とする
        future_day = current_day + days_ahead

        predicted_size = model.predict([[future_day]])[0]
        return max(0, predicted_size)  # 負の値は0にクリップ

    def capacity_planning_report(self, current_capacity_gb, threshold_percent=80):
        """容量計画レポート生成"""
        threshold_capacity = current_capacity_gb * threshold_percent / 100

        # 閾値到達予測
        days_to_threshold = 0
        for days in range(1, 1825):  # 5年間チェック
            predicted_size = self.predict_capacity(days)
            if predicted_size >= threshold_capacity:
                days_to_threshold = days
                break

        report = {
            'current_capacity_gb': current_capacity_gb,
            'threshold_capacity_gb': threshold_capacity,
            'days_to_threshold': days_to_threshold,
            'date_to_threshold': datetime.now() + timedelta(days=days_to_threshold),
            'predictions': {
                '30_days': self.predict_capacity(30),
                '90_days': self.predict_capacity(90),
                '1_year': self.predict_capacity(365),
                '3_years': self.predict_capacity(1095)
            }
        }

        return report

# 使用例
planner = DatabaseCapacityPlanner()

# 過去12ヶ月のデータ例
historical_data = [
    {'date': '2023-01-01', 'total_size_gb': 100},
    {'date': '2023-02-01', 'total_size_gb': 105},
    {'date': '2023-03-01', 'total_size_gb': 112},
    {'date': '2023-04-01', 'total_size_gb': 118},
    {'date': '2023-05-01', 'total_size_gb': 125},
    {'date': '2023-06-01', 'total_size_gb': 133},
    {'date': '2023-07-01', 'total_size_gb': 140},
    {'date': '2023-08-01', 'total_size_gb': 148},
    {'date': '2023-09-01', 'total_size_gb': 156},
    {'date': '2023-10-01', 'total_size_gb': 165},
    {'date': '2023-11-01', 'total_size_gb': 174},
    {'date': '2023-12-01', 'total_size_gb': 183}
]

growth_analysis = planner.analyze_growth_pattern(historical_data)
capacity_report = planner.capacity_planning_report(current_capacity_gb=500)

print(f"Monthly growth: {growth_analysis['monthly_growth_gb']:.2f} GB")
print(f"Threshold reached in: {capacity_report['days_to_threshold']} days")
\`\`\`

**ストレージ階層化:**

**データティアリング戦略:**
\`\`\`sql
-- PostgreSQL での tablespace を使用した階層化
-- 高速SSD領域
CREATE TABLESPACE fast_ssd LOCATION '/data/ssd';

-- 標準SSD領域
CREATE TABLESPACE standard_ssd LOCATION '/data/standard';

-- 低速HDD領域（アーカイブ用）
CREATE TABLESPACE archive_hdd LOCATION '/data/archive';

-- テーブル作成時に階層指定
-- ホット data（頻繁にアクセス）
CREATE TABLE current_orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER,
    order_date DATE DEFAULT CURRENT_DATE,
    total_amount DECIMAL(10,2)
) TABLESPACE fast_ssd;

-- ウォーム data（中程度のアクセス）
CREATE TABLE order_history (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER,
    order_date DATE,
    total_amount DECIMAL(10,2)
) TABLESPACE standard_ssd;

-- コールド data（稀にアクセス）
CREATE TABLE archived_orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER,
    order_date DATE,
    total_amount DECIMAL(10,2)
) TABLESPACE archive_hdd;

-- 自動アーカイブプロシージャ
CREATE OR REPLACE FUNCTION archive_old_orders()
RETURNS void AS $$
BEGIN
    -- 1年以上前のオーダーをアーカイブに移動
    INSERT INTO archived_orders
    SELECT * FROM current_orders
    WHERE order_date < CURRENT_DATE - INTERVAL '1 year';

    DELETE FROM current_orders
    WHERE order_date < CURRENT_DATE - INTERVAL '1 year';

    -- 統計情報更新
    ANALYZE archived_orders;
    ANALYZE current_orders;
END;
$$ LANGUAGE plpgsql;

-- 定期実行設定（pg_cron使用）
SELECT cron.schedule('archive-orders', '0 2 1 * *', 'SELECT archive_old_orders();');
\`\`\`

**パーティション戦略:**
\`\`\`sql
-- 時系列データのパーティション（PostgreSQL 11+）
CREATE TABLE measurements (
    id SERIAL,
    measured_at TIMESTAMP NOT NULL,
    device_id INTEGER,
    temperature DECIMAL(5,2),
    humidity DECIMAL(5,2)
) PARTITION BY RANGE (measured_at);

-- 月別パーティション作成
CREATE TABLE measurements_2023_01 PARTITION OF measurements
FOR VALUES FROM ('2023-01-01') TO ('2023-02-01');

CREATE TABLE measurements_2023_02 PARTITION OF measurements
FOR VALUES FROM ('2023-02-01') TO ('2023-03-01');

-- 自動パーティション作成
CREATE OR REPLACE FUNCTION create_monthly_partition(table_name TEXT, start_date DATE)
RETURNS void AS $$
DECLARE
    partition_name TEXT;
    end_date DATE;
BEGIN
    partition_name := table_name || '_' || to_char(start_date, 'YYYY_MM');
    end_date := start_date + INTERVAL '1 month';

    EXECUTE format('CREATE TABLE %I PARTITION OF %I FOR VALUES FROM (%L) TO (%L)',
                   partition_name, table_name, start_date, end_date);

    -- インデックス作成
    EXECUTE format('CREATE INDEX %I ON %I (device_id, measured_at)',
                   partition_name || '_device_time_idx', partition_name);
END;
$$ LANGUAGE plpgsql;

-- 将来のパーティション事前作成
DO $$
DECLARE
    i INTEGER;
    current_month DATE := date_trunc('month', CURRENT_DATE);
BEGIN
    FOR i IN 0..11 LOOP  -- 次の12ヶ月分
        PERFORM create_monthly_partition('measurements', current_month + (i || ' months')::INTERVAL);
    END LOOP;
END;
$$;
\`\`\`

**圧縮・最適化:**
\`\`\`sql
-- PostgreSQL での圧縮設定
-- テーブル圧縮（TOAST設定）
ALTER TABLE large_text_table ALTER COLUMN content SET STORAGE EXTERNAL;

-- 列圧縮設定（PostgreSQL 14+）
ALTER TABLE analytics_data ALTER COLUMN json_data SET COMPRESSION lz4;

-- MySQL でのテーブル圧縮
CREATE TABLE compressed_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    log_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;

-- SQL Server での ページ圧縮
ALTER TABLE large_fact_table REBUILD WITH (DATA_COMPRESSION = PAGE);

-- Oracle での Advanced Compression
ALTER TABLE transaction_history COMPRESS FOR OLTP;
\`\`\`

**容量アラート設定:**
\`\`\`yaml
# Prometheus アラート設定（容量監視）
groups:
- name: database_capacity
  rules:
  - alert: DatabaseDiskSpaceHigh
    expr: (1 - (node_filesystem_avail_bytes{mountpoint="/var/lib/postgresql"} / node_filesystem_size_bytes{mountpoint="/var/lib/postgresql"})) * 100 > 80
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "Database disk space usage high"
      description: "Database disk usage is {{ $value }}% on {{ $labels.instance }}"

  - alert: DatabaseDiskSpaceCritical
    expr: (1 - (node_filesystem_avail_bytes{mountpoint="/var/lib/postgresql"} / node_filesystem_size_bytes{mountpoint="/var/lib/postgresql"})) * 100 > 90
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "Database disk space critically low"
      description: "Database disk usage is {{ $value }}% on {{ $labels.instance }}"

  - alert: DatabaseGrowthRate
    expr: predict_linear(node_filesystem_avail_bytes{mountpoint="/var/lib/postgresql"}[1w], 4*7*24*3600) < 0
    for: 10m
    labels:
      severity: warning
    annotations:
      summary: "Database will run out of space"
      description: "Database on {{ $labels.instance }} is predicted to run out of space in 4 weeks"
\`\`\``,
        quiz: {
          question: 'データベースの容量設計において、データティアリング戦略の主な目的はどれですか？',
          options: [
            'データのセキュリティ向上',
            'アクセス頻度に応じたストレージ最適化',
            'バックアップ時間の短縮',
            'レプリケーション性能の向上'
          ],
          correct: 1,
          explanation: 'データティアリング戦略は、アクセス頻度や重要度に応じてデータを異なるストレージ階層（高速SSD、標準SSD、低速HDDなど）に配置することで、コストと性能のバランスを最適化する手法です。'
        }
      },
      {
        title: 'データベースバックアップ戦略',
        content: `企業レベルのデータベースバックアップ戦略について学習します。

**バックアップ戦略の設計:**

**1. RTO/RPO要件:**
- RTO (Recovery Time Objective): 復旧目標時間
- RPO (Recovery Point Objective): 復旧目標時点
- ビジネス影響度分析
- コスト対効果分析

**2. バックアップタイプ:**
- 完全バックアップ（Full Backup）
- 増分バックアップ（Incremental Backup）
- 差分バックアップ（Differential Backup）
- ログバックアップ（Transaction Log Backup）

**3. バックアップ方式:**
- 物理バックアップ vs 論理バックアップ
- オンラインバックアップ vs オフラインバックアップ
- ホットバックアップ vs コールドバックアップ

**PostgreSQL バックアップ戦略:**

**pg_dump/pg_dumpall（論理バックアップ）:**
\`\`\`bash
#!/bin/bash
# logical_backup.sh

# 設定
DB_HOST="localhost"
DB_PORT="5432"
BACKUP_DIR="/backup/logical"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)

# データベースリスト取得
DATABASES=$(psql -h $DB_HOST -p $DB_PORT -t -c "SELECT datname FROM pg_database WHERE datistemplate = false AND datname != 'postgres';" | xargs)

# 各データベースをバックアップ
for DB in $DATABASES; do
    echo "Backing up database: $DB"

    # カスタム形式でバックアップ（圧縮・並列復元可能）
    pg_dump -h $DB_HOST -p $DB_PORT -U backup_user -Fc -Z 6 \
            --verbose --no-password \
            --file="$BACKUP_DIR/${DB}_${DATE}.backup" \
            $DB

    if [ $? -eq 0 ]; then
        echo "Backup successful for $DB"

        # バックアップファイルの検証
        pg_restore --list "$BACKUP_DIR/${DB}_${DATE}.backup" > /dev/null
        if [ $? -eq 0 ]; then
            echo "Backup verification successful for $DB"
        else
            echo "ERROR: Backup verification failed for $DB"
            exit 1
        fi
    else
        echo "ERROR: Backup failed for $DB"
        exit 1
    fi
done

# 古いバックアップの削除
find $BACKUP_DIR -name "*.backup" -mtime +$RETENTION_DAYS -delete

# バックアップサイズレポート
echo "Backup Summary:"
ls -lh $BACKUP_DIR/*_${DATE}.backup | awk '{print $9, $5}'
\`\`\`

**WALアーカイブ（継続バックアップ）:**
\`\`\`bash
# postgresql.conf設定
# wal_level = replica
# archive_mode = on
# archive_command = '/opt/postgresql/scripts/archive_wal.sh %p %f'
# max_wal_senders = 3
# wal_keep_segments = 32

#!/bin/bash
# archive_wal.sh
WAL_PATH=$1
WAL_FILE=$2
ARCHIVE_DIR="/backup/wal_archive"

# WALファイルをアーカイブディレクトリにコピー
cp "$WAL_PATH" "$ARCHIVE_DIR/$WAL_FILE"

# 結果を確認
if [ $? -eq 0 ]; then
    # S3にもバックアップ（オプション）
    aws s3 cp "$ARCHIVE_DIR/$WAL_FILE" s3://my-db-backup/wal/ --storage-class STANDARD_IA
    exit 0
else
    exit 1
fi
\`\`\`

**物理バックアップ（pg_basebackup）:**
\`\`\`bash
#!/bin/bash
# physical_backup.sh

BACKUP_DIR="/backup/physical"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="$BACKUP_DIR/base_backup_$DATE"

# ベースバックアップ作成
pg_basebackup -h localhost -U replication_user \
              -D "$BACKUP_PATH" \
              -Ft -z -P -v \
              --wal-method=include

if [ $? -eq 0 ]; then
    echo "Physical backup completed: $BACKUP_PATH"

    # バックアップの整合性チェック
    tar -tf "$BACKUP_PATH/base.tar.gz" > /dev/null
    if [ $? -eq 0 ]; then
        echo "Backup integrity check passed"
    else
        echo "ERROR: Backup integrity check failed"
        rm -rf "$BACKUP_PATH"
        exit 1
    fi
else
    echo "ERROR: Physical backup failed"
    exit 1
fi

# 古いバックアップの削除（7日以上古い）
find $BACKUP_DIR -name "base_backup_*" -mtime +7 -exec rm -rf {} \;
\`\`\`

**MySQL バックアップ戦略:**

**mysqldump（論理バックアップ）:**
\`\`\`bash
#!/bin/bash
# mysql_logical_backup.sh

# 設定
MYSQL_USER="backup_user"
MYSQL_PASSWORD="backup_password"
MYSQL_HOST="localhost"
BACKUP_DIR="/backup/mysql/logical"
DATE=$(date +%Y%m%d_%H%M%S)

# 全データベースバックアップ
mysqldump --user=$MYSQL_USER --password=$MYSQL_PASSWORD \
          --host=$MYSQL_HOST \
          --single-transaction \
          --routines \
          --triggers \
          --events \
          --all-databases \
          --result-file="$BACKUP_DIR/all_databases_$DATE.sql"

# 圧縮
gzip "$BACKUP_DIR/all_databases_$DATE.sql"

# 個別データベースバックアップ
DATABASES=$(mysql --user=$MYSQL_USER --password=$MYSQL_PASSWORD \
            --host=$MYSQL_HOST \
            -e "SHOW DATABASES;" | grep -Ev "(Database|information_schema|performance_schema|mysql|sys)")

for DB in $DATABASES; do
    echo "Backing up database: $DB"

    mysqldump --user=$MYSQL_USER --password=$MYSQL_PASSWORD \
              --host=$MYSQL_HOST \
              --single-transaction \
              --routines \
              --triggers \
              --events \
              --databases $DB \
              --result-file="$BACKUP_DIR/${DB}_$DATE.sql"

    gzip "$BACKUP_DIR/${DB}_$DATE.sql"
done

echo "MySQL logical backup completed"
\`\`\`

**XtraBackup（物理バックアップ）:**
\`\`\`bash
#!/bin/bash
# mysql_physical_backup.sh

BACKUP_DIR="/backup/mysql/physical"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="$BACKUP_DIR/xtrabackup_$DATE"

# 完全バックアップ
xtrabackup --backup \
           --target-dir="$BACKUP_PATH" \
           --user=backup_user \
           --password=backup_password \
           --compress \
           --compress-threads=4 \
           --parallel=4

if [ $? -eq 0 ]; then
    echo "XtraBackup completed: $BACKUP_PATH"

    # バックアップ準備（Apply log）
    xtrabackup --prepare \
               --target-dir="$BACKUP_PATH"

    if [ $? -eq 0 ]; then
        echo "Backup preparation completed"

        # メタデータファイル作成
        echo "Backup Date: $(date)" > "$BACKUP_PATH/backup_info.txt"
        echo "MySQL Version: $(mysql --version)" >> "$BACKUP_PATH/backup_info.txt"
        echo "Backup Size: $(du -sh $BACKUP_PATH | cut -f1)" >> "$BACKUP_PATH/backup_info.txt"
    else
        echo "ERROR: Backup preparation failed"
        rm -rf "$BACKUP_PATH"
        exit 1
    fi
else
    echo "ERROR: XtraBackup failed"
    exit 1
fi

# 古いバックアップ削除
find $BACKUP_DIR -name "xtrabackup_*" -mtime +7 -exec rm -rf {} \;
\`\`\`

**クラウドバックアップ統合:**

**AWS RDS自動バックアップ:**
\`\`\`bash
#!/bin/bash
# rds_snapshot_management.sh

# RDSインスタンス設定
RDS_INSTANCE="production-database"
REGION="us-east-1"

# スナップショット作成
SNAPSHOT_ID="${RDS_INSTANCE}-manual-$(date +%Y%m%d-%H%M%S)"

aws rds create-db-snapshot \
    --region $REGION \
    --db-instance-identifier $RDS_INSTANCE \
    --db-snapshot-identifier $SNAPSHOT_ID

# スナップショット作成完了まで待機
aws rds wait db-snapshot-completed \
    --region $REGION \
    --db-snapshot-identifier $SNAPSHOT_ID

if [ $? -eq 0 ]; then
    echo "RDS snapshot created: $SNAPSHOT_ID"

    # クロスリージョンコピー
    aws rds copy-db-snapshot \
        --region us-west-2 \
        --source-region $REGION \
        --source-db-snapshot-identifier $SNAPSHOT_ID \
        --target-db-snapshot-identifier "${SNAPSHOT_ID}-west"

    echo "Cross-region copy initiated"
else
    echo "ERROR: RDS snapshot creation failed"
    exit 1
fi

# 古いスナップショット削除（30日以上）
OLD_SNAPSHOTS=$(aws rds describe-db-snapshots \
                --region $REGION \
                --db-instance-identifier $RDS_INSTANCE \
                --snapshot-type manual \
                --query "DBSnapshots[?SnapshotCreateTime<='$(date -d '30 days ago' --iso-8601)'].DBSnapshotIdentifier" \
                --output text)

for SNAPSHOT in $OLD_SNAPSHOTS; do
    echo "Deleting old snapshot: $SNAPSHOT"
    aws rds delete-db-snapshot \
        --region $REGION \
        --db-snapshot-identifier $SNAPSHOT
done
\`\`\`

**復旧テスト自動化:**
\`\`\`python
#!/usr/bin/env python3
# backup_validation.py

import subprocess
import tempfile
import os
import logging
from datetime import datetime

class BackupValidator:
    def __init__(self, backup_path, test_db_config):
        self.backup_path = backup_path
        self.test_db_config = test_db_config
        self.logger = logging.getLogger(__name__)

    def validate_postgresql_backup(self):
        """PostgreSQLバックアップの検証"""
        try:
            # 一時的なテストDBに復元
            test_db = f"backup_test_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

            # テストDB作成
            subprocess.run([
                'createdb', '-h', self.test_db_config['host'],
                '-U', self.test_db_config['user'], test_db
            ], check=True)

            # バックアップ復元
            subprocess.run([
                'pg_restore', '-h', self.test_db_config['host'],
                '-U', self.test_db_config['user'],
                '-d', test_db, self.backup_path
            ], check=True)

            # 基本的な整合性チェック
            result = subprocess.run([
                'psql', '-h', self.test_db_config['host'],
                '-U', self.test_db_config['user'],
                '-d', test_db, '-t',
                '-c', 'SELECT count(*) FROM pg_tables WHERE schemaname = \'public\';'
            ], capture_output=True, text=True, check=True)

            table_count = int(result.stdout.strip())

            if table_count > 0:
                self.logger.info(f"Backup validation successful. Tables found: {table_count}")
                validation_result = True
            else:
                self.logger.error("No tables found in restored database")
                validation_result = False

            # テストDB削除
            subprocess.run([
                'dropdb', '-h', self.test_db_config['host'],
                '-U', self.test_db_config['user'], test_db
            ], check=True)

            return validation_result

        except subprocess.CalledProcessError as e:
            self.logger.error(f"Backup validation failed: {e}")
            return False

    def generate_validation_report(self):
        """検証レポート生成"""
        report = {
            'timestamp': datetime.now().isoformat(),
            'backup_path': self.backup_path,
            'validation_result': self.validate_postgresql_backup(),
            'backup_size': os.path.getsize(self.backup_path),
            'test_duration': None  # 実装で計測
        }

        return report

# 使用例
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)

    test_config = {
        'host': 'localhost',
        'user': 'postgres'
    }

    validator = BackupValidator('/backup/mydb_20231201.backup', test_config)
    report = validator.generate_validation_report()

    print(f"Validation result: {report['validation_result']}")
\`\`\``,
        quiz: {
          question: 'PostgreSQLのWAL（Write-Ahead Logging）アーカイブの主な目的はどれですか？',
          options: [
            'データベースの性能向上',
            'ポイントインタイム復旧の実現',
            'ディスク容量の削減',
            'レプリケーションの設定'
          ],
          correct: 1,
          explanation: 'WALアーカイブは、トランザクションログを継続的に保存することで、任意の時点（ポイントインタイム）への復旧を可能にします。これにより、障害発生直前の状態まで復旧することができます。'
        }
      },
      {
        title: 'データベース高可用性',
        content: `データベースの高可用性設計と実装について学習します。

**高可用性の要素:**

**1. 可用性指標:**
- SLA (Service Level Agreement)
- アップタイム目標（99.9%, 99.99%, 99.999%）
- MTBF (Mean Time Between Failures)
- MTTR (Mean Time To Recovery)

**2. 障害の種類:**
- ハードウェア障害
- ソフトウェア障害
- ネットワーク障害
- 人的ミス
- 災害・環境障害

**3. 高可用性アーキテクチャパターン:**
- アクティブ/パッシブ構成
- アクティブ/アクティブ構成
- マルチマスター構成
- 分散クラスター構成

**PostgreSQL高可用性構成:**

**ストリーミングレプリケーション:**
\`\`\`bash
# プライマリサーバー設定 (postgresql.conf)
wal_level = replica
max_wal_senders = 3
wal_keep_segments = 64
synchronous_standby_names = 'standby1,standby2'
synchronous_commit = on

# pg_hba.conf (レプリケーション用)
host replication replicator 192.168.1.0/24 md5
\`\`\`

\`\`\`bash
# スタンバイサーバー設定
# recovery.conf (PostgreSQL 11以前) または postgresql.conf (12以降)
standby_mode = 'on'
primary_conninfo = 'host=192.168.1.10 port=5432 user=replicator password=password'
trigger_file = '/tmp/postgresql.trigger'
restore_command = 'cp /archive/%f %p'

# ベースバックアップからスタンバイ構築
pg_basebackup -h 192.168.1.10 -D /var/lib/postgresql/data -U replicator -P -v -R -W
\`\`\`

**自動フェイルオーバー（Patroni）:**
\`\`\`yaml
# patroni.yml
scope: postgres-cluster
namespace: /postgresql-cluster/
name: postgres-node1

restapi:
  listen: 0.0.0.0:8008
  connect_address: 192.168.1.11:8008

etcd:
  hosts: 192.168.1.20:2379,192.168.1.21:2379,192.168.1.22:2379

bootstrap:
  dcs:
    ttl: 30
    loop_wait: 10
    retry_timeout: 30
    maximum_lag_on_failover: 1048576
    postgresql:
      use_pg_rewind: true
      use_slots: true
      parameters:
        wal_level: replica
        hot_standby: "on"
        wal_keep_segments: 8
        max_wal_senders: 10
        max_replication_slots: 10
        wal_log_hints: "on"

  initdb:
    - encoding: UTF8
    - data-checksums

postgresql:
  listen: 0.0.0.0:5432
  connect_address: 192.168.1.11:5432
  data_dir: /var/lib/postgresql/data
  pgpass: /tmp/pgpass
  authentication:
    replication:
      username: replicator
      password: repl_password
    superuser:
      username: postgres
      password: postgres_password

watchdog:
  mode: required
  device: /dev/watchdog
  safety_margin: 5

tags:
  nofailover: false
  noloadbalance: false
  clonefrom: false
  nosync: false
\`\`\`

**HAProxy負荷分散設定:**
\`\`\`
# haproxy.cfg
global
    log stdout local0
    maxconn 4096

defaults
    mode tcp
    timeout connect 5s
    timeout client 30s
    timeout server 30s
    log global

frontend postgres_frontend
    bind *:5000
    default_backend postgres_backend

backend postgres_backend
    balance leastconn
    option tcp-check
    tcp-check expect string "is_master:t"

    server postgres-1 192.168.1.11:5432 check port 8008 httpchk GET /master
    server postgres-2 192.168.1.12:5432 check port 8008 httpchk GET /master backup
    server postgres-3 192.168.1.13:5432 check port 8008 httpchk GET /master backup

frontend postgres_readonly
    bind *:5001
    default_backend postgres_readonly_backend

backend postgres_readonly_backend
    balance roundrobin
    option tcp-check
    tcp-check expect string "is_running:t"

    server postgres-1 192.168.1.11:5432 check port 8008 httpchk GET /replica
    server postgres-2 192.168.1.12:5432 check port 8008 httpchk GET /replica
    server postgres-3 192.168.1.13:5432 check port 8008 httpchk GET /replica
\`\`\`

**MySQL高可用性構成:**

**MySQL InnoDB Cluster:**
\`\`\`javascript
// MySQL Shell でのクラスター構築
// 各ノードでの準備
dba.configureInstance('root@mysql-node1:3306')
dba.configureInstance('root@mysql-node2:3306')
dba.configureInstance('root@mysql-node3:3306')

// クラスター作成
var cluster = dba.createCluster('productionCluster')

// ノード追加
cluster.addInstance('root@mysql-node2:3306')
cluster.addInstance('root@mysql-node3:3306')

// クラスター状態確認
cluster.status()

// MySQL Router設定
mysqlrouter --bootstrap root@mysql-node1:3306 --directory /opt/mysqlrouter --user mysqlrouter
\`\`\`

**Galera Cluster（MariaDB/MySQL）:**
\`\`\`ini
# galera.cnf
[galera]
wsrep_on=ON
wsrep_provider=/usr/lib/galera/libgalera_smm.so
wsrep_cluster_name="galera_cluster"
wsrep_cluster_address="gcomm://192.168.1.11,192.168.1.12,192.168.1.13"
wsrep_node_name="node1"
wsrep_node_address="192.168.1.11"
wsrep_sst_method=rsync

binlog_format=row
default_storage_engine=InnoDB
innodb_autoinc_lock_mode=2
innodb_doublewrite=1
query_cache_size=0
query_cache_type=0

# ブートストラップ（初回のみ）
galera_new_cluster

# 他ノードの起動
systemctl start mariadb
\`\`\`

**Redis高可用性（Sentinel）:**
\`\`\`bash
# redis.conf (マスター)
bind 0.0.0.0
port 6379
save 900 1
save 300 10
save 60 10000

# redis.conf (スレーブ)
bind 0.0.0.0
port 6379
slaveof 192.168.1.11 6379
slave-read-only yes

# sentinel.conf
bind 0.0.0.0
port 26379
sentinel monitor mymaster 192.168.1.11 6379 2
sentinel auth-pass mymaster password
sentinel down-after-milliseconds mymaster 5000
sentinel parallel-syncs mymaster 1
sentinel failover-timeout mymaster 10000
\`\`\`

**クラウド高可用性サービス:**

**AWS RDS Multi-AZ:**
\`\`\`yaml
# CloudFormation テンプレート
Resources:
  DatabaseInstance:
    Type: AWS::RDS::DBInstance
    Properties:
      DBInstanceIdentifier: production-db
      Engine: postgres
      EngineVersion: 13.7
      DBInstanceClass: db.r5.xlarge
      AllocatedStorage: 100
      StorageType: gp2
      StorageEncrypted: true

      # Multi-AZ設定
      MultiAZ: true

      # バックアップ設定
      BackupRetentionPeriod: 7
      PreferredBackupWindow: "03:00-04:00"
      PreferredMaintenanceWindow: "sun:04:00-sun:05:00"

      # 監視
      MonitoringInterval: 60
      MonitoringRoleArn: !GetAtt MonitoringRole.Arn
      EnablePerformanceInsights: true

      # セキュリティ
      VPCSecurityGroups:
        - !Ref DatabaseSecurityGroup
      DBSubnetGroupName: !Ref DBSubnetGroup

      DeletionProtection: true

  # Read Replica
  DatabaseReadReplica:
    Type: AWS::RDS::DBInstance
    Properties:
      SourceDBInstanceIdentifier: !Ref DatabaseInstance
      DBInstanceClass: db.r5.large
      PubliclyAccessible: false
      Tags:
        - Key: Name
          Value: production-db-read-replica
\`\`\`

**障害検知・自動復旧:**
\`\`\`python
#!/usr/bin/env python3
# database_health_monitor.py

import time
import psycopg2
import smtplib
import subprocess
from datetime import datetime

class DatabaseHealthMonitor:
    def __init__(self, config):
        self.config = config
        self.last_check = None
        self.consecutive_failures = 0

    def check_database_health(self):
        """データベースヘルスチェック"""
        try:
            conn = psycopg2.connect(
                host=self.config['host'],
                port=self.config['port'],
                database=self.config['database'],
                user=self.config['user'],
                password=self.config['password'],
                connect_timeout=5
            )

            cur = conn.cursor()

            # 基本接続チェック
            cur.execute("SELECT 1")

            # レプリケーション状態チェック
            cur.execute("""
                SELECT client_addr, state, sync_state
                FROM pg_stat_replication
            """)
            replication_status = cur.fetchall()

            # 長時間実行クエリチェック
            cur.execute("""
                SELECT count(*)
                FROM pg_stat_activity
                WHERE state = 'active'
                AND query_start < now() - interval '5 minutes'
                AND query NOT LIKE '%pg_stat_activity%'
            """)
            long_queries = cur.fetchone()[0]

            # ディスク容量チェック
            cur.execute("""
                SELECT pg_size_pretty(pg_database_size(current_database())) as db_size
            """)
            db_size = cur.fetchone()[0]

            conn.close()

            health_status = {
                'timestamp': datetime.now(),
                'status': 'healthy',
                'replication_nodes': len(replication_status),
                'long_running_queries': long_queries,
                'database_size': db_size
            }

            self.consecutive_failures = 0
            return health_status

        except Exception as e:
            self.consecutive_failures += 1

            health_status = {
                'timestamp': datetime.now(),
                'status': 'unhealthy',
                'error': str(e),
                'consecutive_failures': self.consecutive_failures
            }

            return health_status

    def handle_failure(self, health_status):
        """障害対応処理"""
        if self.consecutive_failures >= 3:
            self.send_alert(health_status)

            if self.consecutive_failures >= 5:
                self.trigger_failover()

    def send_alert(self, health_status):
        """アラート送信"""
        message = f"""
        Database Health Alert

        Status: {health_status['status']}
        Time: {health_status['timestamp']}
        Error: {health_status.get('error', 'N/A')}
        Consecutive Failures: {health_status['consecutive_failures']}

        Please investigate immediately.
        """

        # メール送信（実装省略）
        print(f"ALERT: {message}")

    def trigger_failover(self):
        """フェイルオーバー実行"""
        try:
            # Patroni経由でフェイルオーバー実行
            result = subprocess.run([
                'patronictl', 'failover', 'postgres-cluster',
                '--candidate', 'postgres-node2'
            ], capture_output=True, text=True, timeout=30)

            if result.returncode == 0:
                print("Failover executed successfully")
                self.send_alert({
                    'status': 'failover_completed',
                    'timestamp': datetime.now(),
                    'details': result.stdout
                })
            else:
                print(f"Failover failed: {result.stderr}")

        except Exception as e:
            print(f"Error during failover: {e}")

    def run_monitoring(self):
        """継続監視実行"""
        while True:
            health_status = self.check_database_health()

            if health_status['status'] == 'unhealthy':
                self.handle_failure(health_status)
            else:
                print(f"Database healthy at {health_status['timestamp']}")

            time.sleep(30)  # 30秒間隔

# 設定
config = {
    'host': 'localhost',
    'port': 5432,
    'database': 'postgres',
    'user': 'monitor',
    'password': 'monitor_password'
}

# 監視開始
monitor = DatabaseHealthMonitor(config)
monitor.run_monitoring()
\`\`\``,
        quiz: {
          question: 'データベースの高可用性において、同期レプリケーションと非同期レプリケーションの主な違いはどれですか？',
          options: [
            'レプリケーションの方向性',
            'データ整合性とパフォーマンスのトレードオフ',
            'サポートするデータベースエンジンの種類',
            'ネットワーク帯域の使用量'
          ],
          correct: 1,
          explanation: '同期レプリケーションは全てのレプリカへの書き込み完了を待つためデータ整合性が高いが性能は低く、非同期レプリケーションは待機せずに応答するため性能は高いがデータ整合性にわずかなリスクがあります。'
        }
      },
      {
        title: 'データベース法規制対応',
        content: `データベースに関わる法規制と コンプライアンス対応について学習します。

**主要な法規制:**

**1. 個人情報保護法（日本）:**
- 個人情報の定義・分類
- 取得・利用・提供の制限
- 安全管理措置
- 本人の権利保護

**2. GDPR（EU一般データ保護規則）:**
- 個人データの処理原則
- 適法性・透明性・目的制限
- データ最小化・正確性
- 保存制限・完全性・機密性

**3. SOX法（Sarbanes-Oxley Act）:**
- 財務報告の内部統制
- データの完全性・可用性
- 監査証跡の保持
- 変更管理プロセス

**4. PCI DSS（Payment Card Industry Data Security Standard）:**
- カード会員データの保護
- 暗号化要件
- アクセス制御
- 脆弱性管理

**GDPR対応実装:**

**データ分類・ラベリング:**
\`\`\`sql
-- データ分類テーブル
CREATE TABLE data_classification (
    table_name VARCHAR(100),
    column_name VARCHAR(100),
    classification VARCHAR(20), -- 'public', 'internal', 'confidential', 'personal'
    sensitivity_level INTEGER,  -- 1-5 (低-高)
    data_subject_type VARCHAR(50), -- 'customer', 'employee', 'vendor'
    legal_basis VARCHAR(100),   -- GDPR第6条の適法根拠
    retention_period INTERVAL,
    deletion_rule TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- データ分類の登録例
INSERT INTO data_classification VALUES
('customers', 'email', 'personal', 4, 'customer', 'consent', INTERVAL '7 years', 'Delete after contract termination + retention period'),
('customers', 'phone', 'personal', 3, 'customer', 'legitimate_interest', INTERVAL '3 years', 'Delete when no longer needed for business purpose'),
('employees', 'salary', 'confidential', 5, 'employee', 'contract', INTERVAL '10 years', 'Delete after employment + legal retention period');

-- 個人データ検索機能
CREATE OR REPLACE FUNCTION find_personal_data(subject_id TEXT, subject_type TEXT)
RETURNS TABLE (
    table_name TEXT,
    column_name TEXT,
    data_value TEXT,
    classification TEXT
) AS $$
DECLARE
    rec RECORD;
    query_text TEXT;
BEGIN
    FOR rec IN
        SELECT dc.table_name, dc.column_name, dc.classification
        FROM data_classification dc
        WHERE dc.data_subject_type = subject_type
        AND dc.classification = 'personal'
    LOOP
        query_text := format('SELECT %L, %L, %I::TEXT, %L FROM %I WHERE id = %L',
                           rec.table_name, rec.column_name, rec.column_name, rec.classification, rec.table_name, subject_id);

        RETURN QUERY EXECUTE query_text;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
\`\`\`

**忘れられる権利（Right to be forgotten）実装:**
\`\`\`sql
-- データ削除要求管理
CREATE TABLE data_deletion_requests (
    request_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_subject_id VARCHAR(100) NOT NULL,
    data_subject_type VARCHAR(50) NOT NULL,
    requester_email VARCHAR(255),
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, rejected
    processed_date TIMESTAMP,
    processed_by VARCHAR(100),
    deletion_log JSONB,
    legal_review_notes TEXT
);

-- 削除プロシージャ
CREATE OR REPLACE FUNCTION process_deletion_request(request_uuid UUID)
RETURNS JSONB AS $$
DECLARE
    request_rec RECORD;
    deletion_log JSONB := '{}';
    table_rec RECORD;
    affected_rows INTEGER;
    query_text TEXT;
BEGIN
    -- 削除要求取得
    SELECT * INTO request_rec
    FROM data_deletion_requests
    WHERE request_id = request_uuid;

    IF NOT FOUND THEN
        RETURN '{"error": "Request not found"}';
    END IF;

    -- ステータス更新
    UPDATE data_deletion_requests
    SET status = 'processing', processed_date = CURRENT_TIMESTAMP
    WHERE request_id = request_uuid;

    -- 関連テーブルからデータ削除
    FOR table_rec IN
        SELECT DISTINCT dc.table_name
        FROM data_classification dc
        WHERE dc.data_subject_type = request_rec.data_subject_type
        AND dc.classification = 'personal'
    LOOP
        -- データ削除実行
        query_text := format('DELETE FROM %I WHERE %s = %L',
                           table_rec.table_name,
                           CASE request_rec.data_subject_type
                               WHEN 'customer' THEN 'customer_id'
                               WHEN 'employee' THEN 'employee_id'
                               ELSE 'id'
                           END,
                           request_rec.data_subject_id);

        EXECUTE query_text;
        GET DIAGNOSTICS affected_rows = ROW_COUNT;

        deletion_log := deletion_log || jsonb_build_object(
            table_rec.table_name,
            jsonb_build_object(
                'deleted_rows', affected_rows,
                'timestamp', CURRENT_TIMESTAMP
            )
        );
    END LOOP;

    -- 完了ステータス更新
    UPDATE data_deletion_requests
    SET status = 'completed', deletion_log = deletion_log
    WHERE request_id = request_uuid;

    RETURN deletion_log;
END;
$$ LANGUAGE plpgsql;
\`\`\`

**データポータビリティ（Data Portability）実装:**
\`\`\`sql
-- データエクスポート機能
CREATE OR REPLACE FUNCTION export_personal_data(subject_id TEXT, subject_type TEXT)
RETURNS JSONB AS $$
DECLARE
    export_data JSONB := '{}';
    table_rec RECORD;
    data_rec RECORD;
    query_text TEXT;
BEGIN
    FOR table_rec IN
        SELECT DISTINCT dc.table_name
        FROM data_classification dc
        WHERE dc.data_subject_type = subject_type
        AND dc.classification IN ('personal', 'confidential')
    LOOP
        -- テーブルデータ取得
        query_text := format('SELECT row_to_json(t) FROM %I t WHERE %s = %L',
                           table_rec.table_name,
                           CASE subject_type
                               WHEN 'customer' THEN 'customer_id'
                               WHEN 'employee' THEN 'employee_id'
                               ELSE 'id'
                           END,
                           subject_id);

        FOR data_rec IN EXECUTE query_text LOOP
            export_data := export_data || jsonb_build_object(
                table_rec.table_name,
                COALESCE(export_data->table_rec.table_name, '[]'::jsonb) || data_rec.row_to_json
            );
        END LOOP;
    END LOOP;

    -- エクスポートログ記録
    INSERT INTO data_export_log (subject_id, subject_type, export_timestamp, data_size)
    VALUES (subject_id, subject_type, CURRENT_TIMESTAMP, length(export_data::text));

    RETURN export_data;
END;
$$ LANGUAGE plpgsql;
\`\`\`

**監査証跡システム:**
\`\`\`sql
-- 監査ログテーブル
CREATE TABLE audit_log (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    operation_type VARCHAR(10) NOT NULL, -- INSERT, UPDATE, DELETE
    record_id VARCHAR(100),
    old_values JSONB,
    new_values JSONB,
    user_id VARCHAR(100),
    session_id VARCHAR(100),
    client_ip INET,
    application VARCHAR(100),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    compliance_tags TEXT[] -- 法規制タグ
);

-- 汎用監査トリガー関数
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    old_data JSONB;
    new_data JSONB;
    user_info RECORD;
BEGIN
    -- ユーザー情報取得
    SELECT
        current_setting('audit.user_id', true) as user_id,
        current_setting('audit.session_id', true) as session_id,
        current_setting('audit.client_ip', true) as client_ip,
        current_setting('audit.application', true) as application
    INTO user_info;

    IF TG_OP = 'DELETE' THEN
        old_data := row_to_json(OLD);
        new_data := NULL;
    ELSIF TG_OP = 'UPDATE' THEN
        old_data := row_to_json(OLD);
        new_data := row_to_json(NEW);
    ELSIF TG_OP = 'INSERT' THEN
        old_data := NULL;
        new_data := row_to_json(NEW);
    END IF;

    INSERT INTO audit_log (
        table_name, operation_type, record_id,
        old_values, new_values,
        user_id, session_id, client_ip, application,
        compliance_tags
    ) VALUES (
        TG_TABLE_NAME, TG_OP,
        COALESCE(NEW.id::TEXT, OLD.id::TEXT),
        old_data, new_data,
        user_info.user_id, user_info.session_id,
        user_info.client_ip::INET, user_info.application,
        ARRAY['gdpr', 'sox'] -- テーブルに応じて設定
    );

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 監査トリガー設定例
CREATE TRIGGER customers_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON customers
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
\`\`\`

**データ保存期間管理:**
\`\`\`sql
-- データ保存期間ポリシー
CREATE TABLE retention_policies (
    policy_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100),
    retention_period INTERVAL,
    deletion_criteria JSONB, -- 削除条件のJSON
    legal_basis TEXT,
    active BOOLEAN DEFAULT true,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ポリシー例
INSERT INTO retention_policies (table_name, retention_period, deletion_criteria, legal_basis)
VALUES
('customer_activities', INTERVAL '2 years', '{"condition": "last_activity_date < :cutoff_date"}', 'GDPR Article 5(1)(e) - storage limitation'),
('audit_log', INTERVAL '7 years', '{"condition": "timestamp < :cutoff_date"}', 'SOX compliance requirement'),
('session_logs', INTERVAL '90 days', '{"condition": "created_at < :cutoff_date"}', 'Business operational requirement');

-- 自動削除プロシージャ
CREATE OR REPLACE FUNCTION apply_retention_policies()
RETURNS TABLE (
    policy_id UUID,
    table_name TEXT,
    deleted_count INTEGER,
    execution_time TIMESTAMP
) AS $$
DECLARE
    policy_rec RECORD;
    delete_query TEXT;
    cutoff_date TIMESTAMP;
    affected_rows INTEGER;
BEGIN
    FOR policy_rec IN
        SELECT * FROM retention_policies WHERE active = true
    LOOP
        cutoff_date := CURRENT_TIMESTAMP - policy_rec.retention_period;

        -- 削除クエリ構築
        delete_query := format('DELETE FROM %I WHERE %s',
                             policy_rec.table_name,
                             replace(policy_rec.deletion_criteria->>'condition', ':cutoff_date', quote_literal(cutoff_date)));

        EXECUTE delete_query;
        GET DIAGNOSTICS affected_rows = ROW_COUNT;

        -- 結果返却
        policy_id := policy_rec.policy_id;
        table_name := policy_rec.table_name;
        deleted_count := affected_rows;
        execution_time := CURRENT_TIMESTAMP;

        RETURN NEXT;

        -- 削除ログ記録
        INSERT INTO retention_execution_log (policy_id, table_name, deleted_count, execution_time)
        VALUES (policy_rec.policy_id, policy_rec.table_name, affected_rows, CURRENT_TIMESTAMP);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 定期実行設定
SELECT cron.schedule('retention-cleanup', '0 2 * * *', 'SELECT apply_retention_policies();');
\`\`\`

**コンプライアンス レポート:**
\`\`\`python
#!/usr/bin/env python3
# compliance_reporter.py

import psycopg2
import json
from datetime import datetime, timedelta

class ComplianceReporter:
    def __init__(self, db_config):
        self.db_config = db_config

    def generate_gdpr_report(self, start_date, end_date):
        """GDPR コンプライアンス レポート生成"""
        conn = psycopg2.connect(**self.db_config)
        cur = conn.cursor()

        # データ削除要求統計
        cur.execute("""
            SELECT
                status,
                COUNT(*) as count,
                AVG(EXTRACT(epoch FROM (processed_date - request_date))/3600) as avg_processing_hours
            FROM data_deletion_requests
            WHERE request_date BETWEEN %s AND %s
            GROUP BY status
        """, (start_date, end_date))

        deletion_stats = cur.fetchall()

        # データ違反インシデント
        cur.execute("""
            SELECT
                incident_type,
                COUNT(*) as incident_count,
                SUM(affected_records) as total_affected_records
            FROM data_breach_incidents
            WHERE incident_date BETWEEN %s AND %s
            GROUP BY incident_type
        """, (start_date, end_date))

        breach_stats = cur.fetchall()

        # 監査ログ統計
        cur.execute("""
            SELECT
                table_name,
                operation_type,
                COUNT(*) as operation_count
            FROM audit_log
            WHERE timestamp BETWEEN %s AND %s
            AND 'gdpr' = ANY(compliance_tags)
            GROUP BY table_name, operation_type
            ORDER BY table_name, operation_type
        """, (start_date, end_date))

        audit_stats = cur.fetchall()

        report = {
            'report_type': 'GDPR Compliance',
            'period': {'start': start_date.isoformat(), 'end': end_date.isoformat()},
            'generated_at': datetime.now().isoformat(),
            'deletion_requests': [
                {'status': status, 'count': count, 'avg_processing_hours': hours}
                for status, count, hours in deletion_stats
            ],
            'data_breaches': [
                {'type': incident_type, 'count': count, 'affected_records': records}
                for incident_type, count, records in breach_stats
            ],
            'audit_activity': [
                {'table': table, 'operation': op, 'count': count}
                for table, op, count in audit_stats
            ]
        }

        conn.close()
        return report

    def check_compliance_status(self):
        """コンプライアンス状況チェック"""
        conn = psycopg2.connect(**self.db_config)
        cur = conn.cursor()

        issues = []

        # 期限切れ削除要求チェック
        cur.execute("""
            SELECT COUNT(*)
            FROM data_deletion_requests
            WHERE status = 'pending'
            AND request_date < CURRENT_TIMESTAMP - INTERVAL '30 days'
        """)

        overdue_deletions = cur.fetchone()[0]
        if overdue_deletions > 0:
            issues.append({
                'type': 'overdue_deletion_requests',
                'count': overdue_deletions,
                'severity': 'high',
                'description': 'Deletion requests pending for more than 30 days'
            })

        # 保存期間違反チェック
        cur.execute("""
            SELECT rp.table_name, COUNT(*) as violation_count
            FROM retention_policies rp
            JOIN LATERAL (
                SELECT 1 FROM information_schema.tables t
                WHERE t.table_name = rp.table_name
            ) t ON true
            WHERE rp.active = true
            AND EXISTS (
                SELECT 1 FROM information_schema.columns c
                WHERE c.table_name = rp.table_name
                AND c.column_name = 'created_at'
            )
            GROUP BY rp.table_name
        """)

        retention_violations = cur.fetchall()
        for table_name, count in retention_violations:
            if count > 0:
                issues.append({
                    'type': 'retention_policy_violation',
                    'table': table_name,
                    'count': count,
                    'severity': 'medium',
                    'description': f'Records exceeding retention period in {table_name}'
                })

        conn.close()

        return {
            'check_timestamp': datetime.now().isoformat(),
            'compliant': len(issues) == 0,
            'issues': issues
        }

# 使用例
if __name__ == "__main__":
    db_config = {
        'host': 'localhost',
        'database': 'production',
        'user': 'compliance_user',
        'password': 'password'
    }

    reporter = ComplianceReporter(db_config)

    # 月次レポート生成
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)

    gdpr_report = reporter.generate_gdpr_report(start_date, end_date)
    compliance_status = reporter.check_compliance_status()

    print("GDPR Report:", json.dumps(gdpr_report, indent=2))
    print("Compliance Status:", json.dumps(compliance_status, indent=2))
\`\`\``,
        quiz: {
          question: 'GDPR（EU一般データ保護規則）における「忘れられる権利」の実装で最も重要な技術的要件はどれですか？',
          options: [
            'データの暗号化',
            '個人データの完全な削除と削除証跡の記録',
            'アクセスログの詳細化',
            'データのバックアップ頻度向上'
          ],
          correct: 1,
          explanation: 'GDPRの忘れられる権利（Right to be forgotten）では、個人データを完全に削除し、その削除作業の証跡を適切に記録することが技術的に最も重要な要件です。単なる論理削除では不十分で、物理的な削除とその証明が必要です。'
        }
      }
    ]
  },
  {
    id: 8,
    title: 'データベース総合演習',
    sections: [
      {
        title: '分散データベースアーキテクチャ',
        content: `分散データベースシステムの設計と実装について学習します。

**分散データベースの特徴:**
- **分散透明性**: ユーザーにとって単一のデータベースとして見える
- **複製透明性**: データのコピーの存在を隠蔽
- **断片化透明性**: データの分割を隠蔽
- **位置透明性**: データの物理的位置を隠蔽

**分散データベースのアーキテクチャ:**
- **クライアント/サーバー型**: 集中管理
- **ピアツーピア型**: 各ノードが対等
- **マルチマスター型**: 複数の書き込み可能ノード

**分散アルゴリズム:**
- **2フェーズコミット**: 分散トランザクション制御
- **Paxos**: 分散合意アルゴリズム
- **Raft**: 分散レプリケーション
- **PBFT**: ビザンチン障害耐性`,
        quiz: {
          question: '分散データベースにおける2フェーズコミットの主な目的は何ですか？',
          options: [
            'データの圧縮効率を向上させる',
            '分散トランザクションの原子性を保証する',
            'クエリの実行速度を向上させる',
            'ネットワーク帯域を削減する'
          ],
          correct: 1,
          explanation: '2フェーズコミット（2PC）は、分散環境において複数のノードにまたがるトランザクションの原子性（すべて成功するか、すべて失敗するか）を保証するためのプロトコルです。'
        }
      },
      {
        title: 'データベースベンチマーキング',
        content: `データベースシステムの性能評価とベンチマーキング手法について学習します。

**主要なベンチマーク:**
- **TPC-C**: OLTP性能測定
- **TPC-H**: OLAP性能測定
- **TPC-E**: 株式取引システム
- **YCSB**: NoSQLデータベース評価

**性能指標:**
- **スループット**: 単位時間あたりの処理量（TPS）
- **レスポンス時間**: 処理完了までの時間
- **レイテンシ**: 処理開始から完了までの遅延
- **可用性**: システムの稼働率

**負荷テスト手法:**
- **段階的負荷増加**: 徐々に負荷を上げる
- **ピーク負荷テスト**: 最大負荷での評価
- **持続負荷テスト**: 長時間の安定性評価
- **ストレステスト**: 限界を超えた負荷での評価`,
        quiz: {
          question: 'TPC-Cベンチマークが主に測定するデータベース性能は何ですか？',
          options: [
            'OLAP（分析処理）性能',
            'OLTP（トランザクション処理）性能',
            'バックアップ処理性能',
            'データマイニング性能'
          ],
          correct: 1,
          explanation: 'TPC-C（Transaction Processing Performance Council-C）は、OLTP（Online Transaction Processing）環境でのデータベース性能を測定する標準的なベンチマークです。'
        }
      },
      {
        title: 'データベース仮想化技術',
        content: `データベースの仮想化技術とコンテナ化について学習します。

**データベース仮想化の利点:**
- **リソース利用効率**: ハードウェアの有効活用
- **分離性**: 異なるデータベース間の独立性
- **可搬性**: 環境間での移植が容易
- **スケーラビリティ**: 動的なリソース調整

**コンテナ化技術:**
- **Docker**: 軽量なコンテナ技術
- **Kubernetes**: コンテナオーケストレーション
- **Persistent Volume**: 永続化ストレージ
- **StatefulSet**: ステートフルアプリケーション管理

**マイクロサービスアーキテクチャ:**
- **Database per Service**: サービス毎のデータベース
- **Event Sourcing**: イベントベースのデータ管理
- **CQRS**: コマンドとクエリの分離
- **Saga Pattern**: 分散トランザクション管理`,
        quiz: {
          question: 'マイクロサービスアーキテクチャにおける「Database per Service」パターンの主な利点は何ですか？',
          options: [
            'データの重複を完全に排除できる',
            'サービス間の疎結合を実現できる',
            'トランザクション管理が簡単になる',
            'データの一貫性が自動的に保証される'
          ],
          correct: 1,
          explanation: 'Database per Serviceパターンでは、各マイクロサービスが独自のデータベースを持つことで、サービス間の疎結合を実現し、独立したデプロイメントと進化を可能にします。'
        }
      },
      {
        title: 'データベースDevOps',
        content: `データベース開発運用（DevOps）の実践について学習します。

**データベースDevOpsの課題:**
- **スキーマ変更管理**: バージョン管理と適用
- **データマイグレーション**: 既存データの移行
- **テスト自動化**: 品質保証の自動化
- **継続的デプロイメント**: 安全な本番反映

**ツールとプラクティス:**
- **Flyway/Liquibase**: スキーママイグレーション
- **Database as Code**: インフラストラクチャコード化
- **CI/CD Pipeline**: 継続的インテグレーション
- **Blue-Green Deployment**: ゼロダウンタイムデプロイ

**品質管理:**
- **単体テスト**: 個別機能のテスト
- **統合テスト**: システム間連携テスト
- **パフォーマンステスト**: 性能評価
- **カオスエンジニアリング**: 障害耐性テスト`,
        quiz: {
          question: 'データベースのスキーママイグレーションツールの主な目的は何ですか？',
          options: [
            'データベースの性能を最適化する',
            'スキーマ変更を安全にバージョン管理する',
            'データのバックアップを自動化する',
            'SQLクエリを高速化する'
          ],
          correct: 1,
          explanation: 'FlywayやLiquibaseなどのスキーママイグレーションツールは、データベーススキーマの変更を安全にバージョン管理し、開発・テスト・本番環境間で一貫した適用を可能にします。'
        }
      },
      {
        title: 'エッジコンピューティングとデータベース',
        content: `エッジコンピューティング環境でのデータベース技術について学習します。

**エッジデータベースの特徴:**
- **低レイテンシ**: 処理の高速化
- **オフライン動作**: ネットワーク断絶時の継続動作
- **軽量性**: リソース制約環境での動作
- **自律性**: 中央管理なしでの動作

**エッジデータベース技術:**
- **SQLite**: 組み込みデータベース
- **RocksDB**: 高性能キー・バリューストア
- **LevelDB**: Google開発の軽量DB
- **TinyDB**: Python軽量データベース

**データ同期:**
- **Event-driven Sync**: イベントベース同期
- **Conflict Resolution**: 競合解決
- **Eventually Consistent**: 結果整合性
- **CRDT**: 競合フリーデータ型`,
        quiz: {
          question: 'エッジコンピューティング環境でのデータベースに最も重要な特性は何ですか？',
          options: [
            '大容量データの格納能力',
            '複雑なJOIN処理能力',
            '低レイテンシとオフライン動作',
            '高度な分析機能'
          ],
          correct: 2,
          explanation: 'エッジコンピューティング環境では、中央サーバーとの通信に制約があるため、低レイテンシでの処理とネットワーク断絶時のオフライン動作能力が最も重要です。'
        }
      },
      {
        title: 'データベースガバナンス',
        content: `企業レベルでのデータベースガバナンスの実践について学習します。

**データガバナンスの要素:**
- **データ品質管理**: 正確性、完全性、一貫性
- **データ分類**: 機密レベルの設定
- **アクセス制御**: 適切な権限管理
- **監査証跡**: 操作ログの記録

**コンプライアンス要件:**
- **GDPR**: EU一般データ保護規則
- **SOX法**: 企業会計改革法
- **PCI DSS**: カード業界セキュリティ基準
- **HIPAA**: 医療保険の相互運用性法

**データライフサイクル管理:**
- **データ生成**: 作成時の品質確保
- **データ利用**: 適切な利用制御
- **データ保管**: 長期保存戦略
- **データ廃棄**: 安全な削除**リスク管理:**
- **データ漏洩対策**: 暗号化と監視
- **障害対策**: BCP/DR計画
- **変更管理**: 影響度評価とテスト
- **インシデント対応**: 迅速な対応体制`,
        quiz: {
          question: 'データガバナンスにおける「データ分類」の主な目的は何ですか？',
          options: [
            'データの検索速度を向上させる',
            'ストレージ容量を削減する',
            '機密レベルに応じた適切な保護措置を適用する',
            'データの圧縮率を向上させる'
          ],
          correct: 2,
          explanation: 'データ分類は、データの機密レベルや重要度に応じて適切な保護措置（暗号化、アクセス制御、保管期間など）を適用するために行います。'
        }
      },
      {
        title: 'データベースオブザーバビリティ',
        content: `データベースシステムの可観測性（オブザーバビリティ）について学習します。

**オブザーバビリティの3本柱:**
- **メトリクス**: 数値データによる性能指標
- **ログ**: 詳細な操作記録
- **トレース**: 処理の流れの追跡

**監視対象:**
- **パフォーマンス**: レスポンス時間、スループット
- **リソース使用率**: CPU、メモリ、ディスク、ネットワーク
- **エラー率**: 失敗したクエリの割合
- **可用性**: システムの稼働状況

**監視ツール:**
- **Prometheus**: メトリクス収集とアラート
- **Grafana**: 可視化ダッシュボード
- **ELK Stack**: ログ分析基盤
- **Jaeger**: 分散トレーシング

**アラート戦略:**
- **SLI/SLO**: サービスレベル指標/目標
- **エラーバジェット**: 許容可能な障害レベル
- **段階的エスカレーション**: 重要度に応じた通知
- **ノイズ削減**: 不要なアラートの抑制`,
        quiz: {
          question: 'データベースオブザーバビリティの「3本柱」に含まれないものはどれですか？',
          options: [
            'メトリクス（指標）',
            'ログ（記録）',
            'バックアップ（複製）',
            'トレース（追跡）'
          ],
          correct: 2,
          explanation: 'オブザーバビリティの3本柱は、メトリクス（数値指標）、ログ（詳細記録）、トレース（処理追跡）です。バックアップは可用性の確保に重要ですが、オブザーバビリティの要素ではありません。'
        }
      },
      {
        title: 'データベースAI/ML統合',
        content: `データベースと機械学習の統合技術について学習します。

**AI/ML統合アプローチ:**
- **In-Database ML**: データベース内でのML実行
- **Feature Store**: 機械学習特徴量の管理
- **Model Serving**: 学習済みモデルの配信
- **AutoML**: 機械学習の自動化

**主要なML対応データベース:**
- **PostgreSQL**: MADlib拡張
- **Oracle**: Oracle Machine Learning
- **SQL Server**: ML Services
- **BigQuery**: BigQuery ML

**特徴量エンジニアリング:**
- **データ前処理**: クリーニングと変換
- **特徴量選択**: 重要な変数の選択
- **次元削減**: PCA、t-SNE
- **特徴量生成**: 新しい変数の作成

**MLOps（機械学習運用）:**
- **バージョン管理**: モデルとデータの管理
- **A/Bテスト**: モデル性能の比較
- **監視**: モデルドリフトの検出
- **自動再学習**: 継続的なモデル更新`,
        quiz: {
          question: 'Feature Store（特徴量ストア）の主な目的は何ですか？',
          options: [
            'データベースの性能を向上させる',
            '機械学習の特徴量を一元管理し再利用可能にする',
            'SQLクエリを自動生成する',
            'データの暗号化を強化する'
          ],
          correct: 1,
          explanation: 'Feature Storeは、機械学習で使用する特徴量（特徴ベクトル）を一元的に管理し、複数のMLプロジェクト間で再利用可能にするシステムです。データの一貫性と開発効率を向上させます。'
        }
      },
      {
        title: 'グラフデータベース応用',
        content: `グラフデータベースの高度な応用について学習します。

**グラフアルゴリズム:**
- **最短経路**: Dijkstra、A*アルゴリズム
- **中心性**: PageRank、Betweenness Centrality
- **コミュニティ検出**: Louvain、Label Propagation
- **類似性**: Jaccard、Cosine Similarity

**応用分野:**
- **ソーシャルネットワーク分析**: 影響力の分析
- **推薦システム**: 関係性ベースの推薦
- **不正検知**: 異常なパターンの検出
- **知識グラフ**: 知識の構造化と推論

**グラフクエリ最適化:**
- **インデックス戦略**: ノード・エッジの効率的検索
- **パーティショニング**: グラフの分割
- **キャッシュ戦略**: 頻繁アクセスデータの保持
- **並列処理**: 大規模グラフの高速処理

**Neo4j高度機能:**
- **APOC**: 拡張プロシージャライブラリ
- **Graph Data Science**: 機械学習統合
- **Causal Clustering**: 高可用性クラスタ
- **Bloom**: グラフ可視化ツール`,
        quiz: {
          question: 'グラフデータベースにおけるPageRankアルゴリズムの主な用途は何ですか？',
          options: [
            'グラフの最短経路を見つける',
            'ノードの重要度や影響力を計算する',
            'グラフのコミュニティを検出する',
            'グラフの類似性を計算する'
          ],
          correct: 1,
          explanation: 'PageRankは、グラフ内のノードの重要度や影響力を計算するアルゴリズムです。もともとGoogleの検索エンジンで使用され、現在はソーシャルネットワーク分析や推薦システムでも活用されています。'
        }
      },
      {
        title: 'ストリーミングデータベース',
        content: `リアルタイムストリーミングデータ処理について学習します。

**ストリーミング処理の特徴:**
- **リアルタイム性**: 低遅延での処理
- **継続性**: 終わりのないデータストリーム
- **イベント時間**: データ生成時刻の考慮
- **ウィンドウ処理**: 時間やイベント数による区切り

**ストリーミングプラットフォーム:**
- **Apache Kafka**: 分散ストリーミング基盤
- **Apache Pulsar**: 次世代メッセージング
- **Amazon Kinesis**: AWSストリーミングサービス
- **Azure Event Hubs**: Azureストリーミングサービス

**ストリーム処理エンジン:**
- **Apache Flink**: 低遅延ストリーム処理
- **Apache Spark Streaming**: バッチとストリームの統合
- **Apache Storm**: リアルタイム処理
- **ksqlDB**: SQLベースストリーム処理

**ウィンドウ関数:**
- **Tumbling Window**: 重複しない固定時間窓
- **Sliding Window**: 重複する移動時間窓
- **Session Window**: アクティビティベース窓
- **Global Window**: 全データを対象とする窓`,
        quiz: {
          question: 'ストリーミングデータ処理における「Tumbling Window」の特徴は何ですか？',
          options: [
            '重複する時間窓で継続的に処理する',
            '重複しない固定時間窓で処理する',
            'ユーザーのアクティビティに基づいて窓を決める',
            '全てのデータを一つの窓として処理する'
          ],
          correct: 1,
          explanation: 'Tumbling Window（タンブリングウィンドウ）は、重複しない固定サイズの時間窓で、例えば1分間隔で区切られた独立した処理単位です。各ウィンドウは一度だけ処理されます。'
        }
      },
      {
        title: 'データベースパフォーマンス最適化',
        content: `高度なデータベース性能最適化技術について学習します。

**クエリ最適化高度技法:**
- **統計情報の更新**: 正確なコスト見積もり
- **ヒント句の活用**: オプティマイザへの指示
- **実行計画の固定**: 安定した性能確保
- **パラレル実行**: 並列処理による高速化

**インデックス戦略:**
- **複合インデックス**: 複数カラムの効率的検索
- **部分インデックス**: 条件付きインデックス
- **関数インデックス**: 計算結果のインデックス
- **ビットマップインデックス**: 低カーディナリティ対応

**ストレージ最適化:**
- **パーティション戦略**: 水平分割による性能向上
- **圧縮技術**: ストレージ効率化
- **SSDとHDD**: 適材適所の配置
- **NUMA考慮**: CPUとメモリの最適配置

**メモリ管理:**
- **バッファプール**: データページキャッシュ
- **プランキャッシュ**: 実行計画の再利用
- **ソート領域**: 大量データソート最適化
- **ワーキングセット**: アクティブデータセット`,
        quiz: {
          question: 'データベースの「複合インデックス」で最も重要な設計原則は何ですか？',
          options: [
            'カラムを昇順で並べる',
            '選択性の高いカラムを先頭に配置する',
            '文字列カラムを最後に配置する',
            '数値カラムのみを使用する'
          ],
          correct: 1,
          explanation: '複合インデックスでは、選択性（カーディナリティ）の高いカラム、つまりより多くの異なる値を持つカラムを先頭に配置することで、検索効率を最大化できます。'
        }
      },
      {
        title: 'データベースセキュリティ高度技法',
        content: `高度なデータベースセキュリティ技術について学習します。

**高度な暗号化技術:**
- **Transparent Data Encryption (TDE)**: 透過的データ暗号化
- **Always Encrypted**: クライアント側暗号化
- **Deterministic vs Randomized**: 決定的暗号化と確率的暗号化
- **Key Management**: 暗号キーのライフサイクル管理

**行レベルセキュリティ:**
- **Virtual Private Database**: 仮想プライベートデータベース
- **Fine-grained Access Control**: きめ細かいアクセス制御
- **Context-aware Security**: コンテキスト対応セキュリティ
- **Dynamic Data Masking**: 動的データマスキング

**監査とコンプライアンス:**
- **Database Activity Monitoring**: データベース活動監視
- **Data Loss Prevention**: データ損失防止
- **Compliance Reporting**: コンプライアンス報告
- **Forensic Analysis**: フォレンジック分析

**ゼロトラスト アーキテクチャ:**
- **Identity-based Access**: アイデンティティベースアクセス
- **Network Segmentation**: ネットワーク分離
- **Continuous Verification**: 継続的検証
- **Principle of Least Privilege**: 最小権限の原則`,
        quiz: {
          question: 'データベースの「Always Encrypted」技術の主な特徴は何ですか？',
          options: [
            'サーバー側でのみデータを暗号化する',
            'クライアント側で暗号化し、サーバーでは暗号化されたまま処理する',
            'ネットワーク通信のみを暗号化する',
            'ログファイルのみを暗号化する'
          ],
          correct: 1,
          explanation: 'Always Encryptedは、クライアント側でデータを暗号化し、データベースサーバー上では暗号化されたまま格納・処理される技術です。データベース管理者でも平文データにアクセスできません。'
        }
      },
      {
        title: 'データレイクとデータメッシュ',
        content: `現代的なデータアーキテクチャについて学習します。

**データレイクの概念:**
- **スキーマオンリード**: 読み取り時にスキーマ適用
- **多様なデータ形式**: 構造化・半構造化・非構造化
- **スケーラブルストレージ**: オブジェクトストレージ活用
- **メタデータ管理**: データカタログの重要性

**データレイクハウス:**
- **Delta Lake**: ACID特性をデータレイクに追加
- **Apache Iceberg**: 大規模分析テーブル形式
- **Apache Hudi**: 増分データ処理
- **Lakehouse Architecture**: データレイクとDWHの融合

**データメッシュアーキテクチャ:**
- **Domain-oriented**: ドメイン指向の分散
- **Data as a Product**: データの製品化
- **Self-serve Platform**: セルフサービス基盤
- **Federated Governance**: 連合ガバナンス

**データ仮想化:**
- **Logical Data Warehouse**: 論理的データウェアハウス
- **Data Virtualization**: データソース統合
- **Real-time Integration**: リアルタイム統合
- **Query Federation**: クエリ連合`,
        quiz: {
          question: 'データメッシュアーキテクチャの基本原則に含まれないものはどれですか？',
          options: [
            'ドメイン指向の分散データ所有権',
            'データの製品としての扱い',
            '中央集権的なデータ管理',
            'セルフサービスデータ基盤'
          ],
          correct: 2,
          explanation: 'データメッシュアーキテクチャは、中央集権的な管理ではなく、ドメインごとの分散データ所有権、データの製品化、セルフサービス基盤、連合ガバナンスを基本原則とします。'
        }
      },
      {
        title: 'データベース自動化と運用',
        content: `データベース運用の自動化技術について学習します。

**自動化領域:**
- **プロビジョニング**: 環境構築の自動化
- **バックアップ**: 定期バックアップとリストア
- **メンテナンス**: 統計情報更新、インデックス再構築
- **スケーリング**: 負荷に応じた自動拡張

**Infrastructure as Code:**
- **Terraform**: インフラストラクチャ定義
- **Ansible**: 設定管理自動化
- **CloudFormation**: AWS専用テンプレート
- **ARM Templates**: Azure専用テンプレート

**データベース自動チューニング:**
- **Automatic Workload Repository**: 作業負荷分析
- **SQL Tuning Advisor**: SQL最適化支援
- **Automatic Database Diagnostic Monitor**: 自動診断
- **Memory Advisor**: メモリ設定最適化

**運用監視自動化:**
- **Health Checks**: 健全性自動監視
- **Alerting**: 自動アラート生成
- **Log Analysis**: ログ自動解析
- **Capacity Planning**: 容量計画支援`,
        quiz: {
          question: 'Infrastructure as Code（IaC）をデータベース運用で使用する主な利点は何ですか？',
          options: [
            'データベースの処理速度が向上する',
            'インフラストラクチャ構成の再現性と一貫性が確保される',
            'データの圧縮率が向上する',
            'SQLクエリが自動最適化される'
          ],
          correct: 1,
          explanation: 'Infrastructure as Code（IaC）により、データベース環境の構成をコードとして管理することで、環境構築の再現性と一貫性が確保され、手作業による設定ミスを防げます。'
        }
      },
      {
        title: 'エンタープライズデータ戦略',
        content: `企業レベルでのデータ戦略と意思決定について学習します。

**データ戦略の要素:**
- **データビジョン**: 組織のデータ活用目標
- **データアーキテクチャ**: 技術基盤の設計
- **データ組織**: 人材と責任体制
- **データプロセス**: 業務プロセスの定義

**データ成熟度モデル:**
- **Initial**: 個別最適化段階
- **Managed**: 部門レベル管理
- **Defined**: 全社標準化
- **Quantitatively Managed**: 定量的管理
- **Optimizing**: 継続的最適化

**データ投資対効果:**
- **ROI計算**: 投資収益率分析
- **TCO分析**: 総所有コスト評価
- **Value Assessment**: 価値評価モデル
- **Risk Analysis**: リスク分析

**データドリブン文化:**
- **データリテラシー**: データ活用能力向上
- **Change Management**: 変革管理
- **Training Program**: 教育プログラム
- **Success Metrics**: 成功指標設定`,
        quiz: {
          question: 'データ成熟度モデルにおける「Quantitatively Managed」段階の特徴は何ですか？',
          options: [
            '個別部門での最適化が行われている',
            '全社での標準化が完了している',
            'データを定量的に測定・管理している',
            '継続的な最適化が行われている'
          ],
          correct: 2,
          explanation: 'Quantitatively Managed段階では、データの品質、利用状況、成果などを定量的に測定し、メトリクスベースでデータ管理を行う段階です。'
        }
      },
      {
        title: 'データベース災害復旧とBCP',
        content: `データベースの災害復旧と事業継続計画について学習します。

**災害復旧戦略:**
- **Recovery Time Objective (RTO)**: 目標復旧時間
- **Recovery Point Objective (RPO)**: 目標復旧時点
- **Maximum Tolerable Downtime (MTD)**: 最大許容停止時間
- **Work Recovery Time (WRT)**: 業務復旧時間

**バックアップ戦略:**
- **Full Backup**: 完全バックアップ
- **Incremental Backup**: 増分バックアップ
- **Differential Backup**: 差分バックアップ
- **Continuous Data Protection**: 継続的データ保護

**地理的分散:**
- **Multi-Region Deployment**: 複数地域展開
- **Cross-Region Replication**: 地域間レプリケーション
- **Disaster Recovery Site**: 災害復旧サイト
- **Cold/Warm/Hot Standby**: 待機系の種類

**BCP（事業継続計画）:**
- **Business Impact Analysis**: 事業影響度分析
- **Risk Assessment**: リスク評価
- **Recovery Procedures**: 復旧手順書
- **Testing and Training**: テストと訓練`,
        quiz: {
          question: 'RPO（Recovery Point Objective）とRTO（Recovery Time Objective）の関係で正しいものはどれですか？',
          options: [
            'RPOとRTOは常に同じ値になる',
            'RPOは許容データ損失量、RTOは許容復旧時間を表す',
            'RPOが短いほどRTOも短くなる',
            'RPOとRTOは相互に無関係である'
          ],
          correct: 1,
          explanation: 'RPO（Recovery Point Objective）は災害発生時に許容できるデータ損失量（時間）を表し、RTO（Recovery Time Objective）は許容できる復旧時間を表します。両者は独立した指標です。'
        }
      },
      {
        title: 'データベース技術の未来展望',
        content: `データベース技術の将来動向について学習します。

**新興技術トレンド:**
- **Quantum Databases**: 量子データベース
- **DNA Storage**: DNA記憶装置
- **Brain-Computer Interface**: 脳コンピュータインターフェース
- **Neuromorphic Computing**: ニューロモーフィック計算

**AI統合の進化:**
- **Autonomous Database**: 自律データベース
- **AI-Powered Query Optimization**: AI駆動クエリ最適化
- **Intelligent Data Management**: インテリジェントデータ管理
- **Predictive Maintenance**: 予測保守

**エッジとIoTの拡大:**
- **Edge-Native Databases**: エッジネイティブDB
- **IoT Data Management**: IoTデータ管理
- **Real-time Analytics**: リアルタイム分析
- **5G Integration**: 5G統合

**持続可能性:**
- **Green Computing**: グリーンコンピューティング
- **Energy-Efficient Databases**: 省エネルギーDB
- **Carbon Footprint Reduction**: 炭素排出量削減
- **Sustainable Data Centers**: 持続可能なデータセンター

**次世代インターフェース:**
- **Natural Language Queries**: 自然言語クエリ
- **Voice-Activated Databases**: 音声制御DB
- **Augmented Reality Integration**: AR統合
- **Conversational AI**: 対話型AI`,
        quiz: {
          question: '「Autonomous Database」の最も重要な特徴は何ですか？',
          options: [
            'データを自動的に削除する',
            'AIによる自動管理・最適化・セキュリティ確保',
            'クラウドでのみ動作する',
            'SQLを使用しない'
          ],
          correct: 1,
          explanation: 'Autonomous Database（自律データベース）は、AI技術を活用してデータベースの管理、最適化、セキュリティ確保を自動的に行う次世代データベースシステムです。人的介入を最小限に抑えます。'
        }
      },
      {
        title: '総合演習：データベース設計実践',
        content: `実際のビジネス要件に基づくデータベース設計の総合演習です。

**要件分析プロセス:**
- **ビジネス要件定義**: 業務要求の明確化
- **機能要件定義**: システム機能の特定
- **非機能要件定義**: 性能・可用性・セキュリティ
- **制約条件整理**: 技術的・予算的制約

**設計プロセス:**
- **概念設計**: ERモデル作成
- **論理設計**: 正規化とリレーション定義
- **物理設計**: インデックス・パーティション設計
- **実装設計**: DDL・DML作成

**設計検証:**
- **設計レビュー**: 複数の視点での検証
- **プロトタイピング**: 概念実証
- **性能検証**: 負荷テスト
- **セキュリティ監査**: 脆弱性評価

**実装後評価:**
- **性能監視**: 継続的パフォーマンス監視
- **利用状況分析**: 実際の使用パターン分析
- **改善提案**: 最適化機会の特定
- **進化計画**: 将来拡張の計画`,
        quiz: {
          question: 'データベース設計における概念設計フェーズの主な成果物は何ですか？',
          options: [
            'DDL（Data Definition Language）スクリプト',
            'ER（Entity-Relationship）モデル',
            'インデックス設計書',
            'パフォーマンステスト結果'
          ],
          correct: 1,
          explanation: '概念設計フェーズでは、ビジネス要件を分析してエンティティとその関係を明確にし、ER（Entity-Relationship）モデルを作成します。これが論理設計・物理設計の基盤となります。'
        }
      },
      {
        title: '最終総括：データベース技術者の道',
        content: `データベース技術者としてのキャリア形成について学習します。

**技術スキルの発展:**
- **基礎技術習得**: SQL、データモデリング
- **専門分野特化**: OLTP、OLAP、NoSQL、クラウド
- **新技術対応**: AI/ML、エッジ、量子技術
- **アーキテクチャ設計**: システム全体設計能力

**ビジネススキル:**
- **要件定義**: ビジネス要求の理解
- **プロジェクト管理**: 計画・実行・監視
- **コミュニケーション**: ステークホルダーとの対話
- **コスト意識**: ROI・TCO分析能力

**継続学習:**
- **技術トレンド追跡**: 最新技術情報収集
- **実践経験蓄積**: プロジェクト経験
- **コミュニティ参加**: 技術者ネットワーク
- **認定資格取得**: 専門性の証明

**キャリアパス:**
- **データベース管理者**: 運用・保守専門
- **データアーキテクト**: 設計・戦略専門
- **データサイエンティスト**: 分析・洞察専門
- **CTOやテクニカルリーダー**: 技術責任者

**社会への貢献:**
- **デジタル変革支援**: DX推進
- **データ活用促進**: ビジネス価値創出
- **技術標準化**: 業界標準貢献
- **次世代育成**: 技術者教育`,
        quiz: {
          question: 'データベース技術者として最も重要な継続学習の要素は何ですか？',
          options: [
            '最新の製品機能のみを学習する',
            '特定のベンダー技術に特化する',
            '基礎理論と新技術動向の両方をバランス良く学習する',
            '認定資格のみに集中する'
          ],
          correct: 2,
          explanation: 'データベース技術者には、不変の基礎理論（リレーショナル理論、トランザクション理論など）の深い理解と、AI、クラウド、エッジなどの新技術動向への対応の両方が重要です。バランスの取れた継続学習が成功の鍵となります。'
        }
      },
      {
        title: 'データベースアーキテクチャ設計演習',
        content: `実践的なデータベースアーキテクチャ設計の総合演習です。

**設計要求分析:**
- **スケーラビリティ要件**: 将来の成長に対応
- **可用性要件**: ダウンタイム許容度
- **性能要件**: レスポンス時間とスループット
- **セキュリティ要件**: データ保護レベル

**アーキテクチャパターン:**
- **単一データベース**: シンプルな構成
- **マスター・スレーブ**: 読み取り性能向上
- **シャーディング**: 水平分散
- **マイクロサービス**: サービス分離

**技術選択:**
- **RDBMS vs NoSQL**: 用途に応じた選択
- **オンプレミス vs クラウド**: 運用モデル
- **同期 vs 非同期**: 整合性とパフォーマンス
- **リアルタイム vs バッチ**: 処理方式

**設計文書化:**
- **システム構成図**: 全体アーキテクチャ
- **データフロー図**: データの流れ
- **ER図**: データモデル
- **非機能要件仕様**: 性能・可用性・セキュリティ`,
        quiz: {
          question: 'データベースアーキテクチャ設計で最初に決定すべき最も重要な要素は何ですか？',
          options: [
            '使用するデータベース製品',
            '非機能要件（性能・可用性・拡張性）',
            'ハードウェアの仕様',
            'プログラミング言語'
          ],
          correct: 1,
          explanation: 'データベースアーキテクチャ設計では、まず非機能要件（性能、可用性、拡張性、セキュリティなど）を明確にすることが最重要です。これらがアーキテクチャ選択の基準となります。'
        }
      },
      {
        title: 'データベース技術総合まとめ',
        content: `データベース技術の総合的な理解を深めるまとめです。

**技術の進化:**
- **1970年代**: リレーショナルモデルの提唱
- **1980-1990年代**: 商用RDBMSの普及
- **2000年代**: オープンソース化、Web対応
- **2010年代**: NoSQL、ビッグデータ、クラウド
- **2020年代**: AI統合、自律型、エッジ対応

**現在の主要技術:**
- **リレーショナルDB**: 確立された信頼性
- **NoSQLデータベース**: 特定用途への最適化
- **NewSQL**: RDBMSの進化形
- **クラウドデータベース**: 運用の簡素化

**将来展望:**
- **AI統合**: 自動最適化、自然言語インターフェース
- **量子技術**: 暗号化とコンピューティング
- **エッジコンピューティング**: 分散処理の拡大
- **持続可能性**: 省エネルギー技術

**学習継続のポイント:**
- **基礎理論の習得**: 普遍的な原理の理解
- **実践経験の蓄積**: プロジェクトでの実装
- **新技術への対応**: 継続的な学習
- **コミュニティ参加**: 知識の共有と拡大`,
        quiz: {
          question: 'データベース技術者として今後最も重要になる能力は何ですか？',
          options: [
            '特定のデータベース製品の深い知識',
            '基礎理論の理解と新技術への適応力',
            'プログラミングスキルのみ',
            '運用ツールの操作技能'
          ],
          correct: 1,
          explanation: 'データベース技術者には、変わらない基礎理論（正規化、ACID特性、トランザクション理論など）の深い理解と、AI、クラウド、エッジなど急速に進化する新技術への適応力の両方が重要です。'
        }
      }
    ]
  }
];

export default function DatabasePage() {
  const [activeModule, setActiveModule] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<{[key: string]: number}>({});
  const [showQuizResult, setShowQuizResult] = useState<{[key: string]: boolean}>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 進捗管理Hook
  const {
    progress,
    stats,
    loading,
    saveProgress,
    resetProgress
  } = useLearningProgress('database');

  const currentModule = learningModules[activeModule];
  const currentSection = currentModule.sections[activeSection];
  const sectionKey = `${activeModule}-${activeSection}`;

  // 進捗データをローカルステートに同期
  useEffect(() => {
    if (progress.length > 0) {
      const completedSet = new Set<string>();
      const answersMap: {[key: string]: number} = {};
      const resultsMap: {[key: string]: boolean} = {};

      progress.forEach(p => {
        if (p.is_completed) {
          completedSet.add(p.section_key);
          // 正解した問題の答えを復元（正解の選択肢番号を設定）
          const moduleIndex = parseInt(p.section_key.split('-')[0]);
          const sectionIndex = parseInt(p.section_key.split('-')[1]);
          if (learningModules[moduleIndex] && learningModules[moduleIndex].sections[sectionIndex]) {
            answersMap[p.section_key] = learningModules[moduleIndex].sections[sectionIndex].quiz.correct;
          }
          resultsMap[p.section_key] = true;
        }
      });

      setCompletedSections(completedSet);
      setQuizAnswers(answersMap);
      setShowQuizResult(resultsMap);
    }
  }, [progress]);

  const handleQuizAnswer = async (answer: number) => {
    setQuizAnswers({...quizAnswers, [sectionKey]: answer});
    setShowQuizResult({...showQuizResult, [sectionKey]: true});

    const isCorrect = answer === currentSection.quiz.correct;
    const isCompleted = isCorrect;

    if (isCorrect) {
      setCompletedSections(new Set([...completedSections, sectionKey]));
    }

    // データベースに進捗を保存
    try {
      await saveProgress(sectionKey, isCompleted, isCorrect);
    } catch (error) {
      console.error('Failed to save progress:', error);
      // エラーハンドリング（必要に応じてユーザーに通知）
    }
  };

  const nextSection = () => {
    if (activeSection < currentModule.sections.length - 1) {
      setActiveSection(activeSection + 1);
    } else if (activeModule < learningModules.length - 1) {
      setActiveModule(activeModule + 1);
      setActiveSection(0);
    }
    setSidebarOpen(false);
  };

  const previousSection = () => {
    if (activeSection > 0) {
      setActiveSection(activeSection - 1);
    } else if (activeModule > 0) {
      setActiveModule(activeModule - 1);
      setActiveSection(learningModules[activeModule - 1].sections.length - 1);
    }
    setSidebarOpen(false);
  };

  const totalSections = learningModules.reduce((acc, m) => acc + m.sections.length, 0);
  const localProgress = (completedSections.size / totalSections) * 100;

  // 進捗リセット処理
  const handleResetProgress = async () => {
    if (window.confirm('データベースモジュールの学習進捗をリセットしますか？この操作は元に戻せません。')) {
      try {
        await resetProgress('database');
        setCompletedSections(new Set());
        setQuizAnswers({});
        setShowQuizResult({});
        alert('進捗をリセットしました。');
      } catch (error) {
        console.error('Failed to reset progress:', error);
        alert('進捗のリセットに失敗しました。');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/modules/it-fundamentals"
              className="inline-flex items-center text-green-600 hover:text-green-800 mr-4"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                <Database className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">データベース</h1>
                <p className="text-xs text-gray-600">{Math.round(localProgress)}% 完了</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Header */}
        <div className="hidden lg:block w-80 bg-white shadow-sm border-r min-h-screen">
          <div className="p-6">
            <Link
              href="/modules/it-fundamentals"
              className="inline-flex items-center text-green-600 hover:text-green-800 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              IT基礎に戻る
            </Link>

            <div className="mb-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mr-4">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">データベース</h1>
                  <p className="text-gray-600">データベース基礎とSQL</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">学習進捗</span>
                  <span className="text-gray-900 font-medium">{Math.round(localProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${localProgress}%` }}
                  />
                </div>
                {stats && (
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex justify-between">
                      <span>完了問題数:</span>
                      <span>{stats.moduleStats.database?.completed || 0} / {stats.moduleStats.database?.total || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>正答率:</span>
                      <span>{stats.correctRate || 0}%</span>
                    </div>
                  </div>
                )}
                <button
                  onClick={handleResetProgress}
                  className="mt-2 flex items-center text-xs text-red-600 hover:text-red-800 transition-colors"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  進捗をリセット
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-gray-900">学習モジュール</h3>
              <nav className="space-y-2">
                {learningModules.map((module, moduleIndex) => (
                  <div key={module.id}>
                    <button
                      onClick={() => {
                        setActiveModule(moduleIndex);
                        setActiveSection(0);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        activeModule === moduleIndex
                          ? 'bg-green-50 text-green-600'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="font-medium text-sm">{module.title}</div>
                    </button>
                    {activeModule === moduleIndex && (
                      <div className="ml-3 mt-1 space-y-1 max-h-80 overflow-y-auto">
                        {module.sections.map((section, sectionIndex) => (
                          <button
                            key={sectionIndex}
                            onClick={() => setActiveSection(sectionIndex)}
                            className={`w-full text-left px-3 py-1.5 rounded text-sm flex items-center ${
                              activeSection === sectionIndex
                                ? 'bg-green-100 text-green-700'
                                : 'hover:bg-gray-50 text-gray-600'
                            }`}
                          >
                            {completedSections.has(`${moduleIndex}-${sectionIndex}`) ? (
                              <CheckCircle className="w-3 h-3 mr-2 text-green-500 flex-shrink-0" />
                            ) : (
                              <Circle className="w-3 h-3 mr-2 flex-shrink-0" />
                            )}
                            <span className="truncate">{section.title}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* 統計情報 */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">学習統計</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">総問題数</span>
                    <span className="font-medium">{totalSections}問</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">完了済み</span>
                    <span className="font-medium text-green-600">{completedSections.size}問</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">正答率</span>
                    <span className="font-medium">{completedSections.size > 0 ? Math.round(localProgress) : 0}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setSidebarOpen(false)}></div>
            <div className="relative bg-white w-80 p-6 shadow-xl overflow-y-auto">
              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">学習進捗</span>
                    <span className="text-gray-900 font-medium">{Math.round(localProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${localProgress}%` }}
                    />
                  </div>
                  {stats && (
                    <div className="text-xs text-gray-500 space-y-1">
                      <div className="flex justify-between">
                        <span>完了:</span>
                        <span>{stats.moduleStats.database?.completed || 0}/{stats.moduleStats.database?.total || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>正答率:</span>
                        <span>{stats.correctRate || 0}%</span>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={handleResetProgress}
                    className="mt-2 flex items-center text-xs text-red-600 hover:text-red-800 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    リセット
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-gray-900">学習モジュール</h3>
                <nav className="space-y-2">
                  {learningModules.map((module, moduleIndex) => (
                    <div key={module.id}>
                      <button
                        onClick={() => {
                          setActiveModule(moduleIndex);
                          setActiveSection(0);
                          setSidebarOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          activeModule === moduleIndex
                            ? 'bg-green-50 text-green-600'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="font-medium text-sm">{module.title}</div>
                      </button>
                      {activeModule === moduleIndex && (
                        <div className="ml-3 mt-1 space-y-1 max-h-60 overflow-y-auto">
                          {module.sections.map((section, sectionIndex) => (
                            <button
                              key={sectionIndex}
                              onClick={() => {
                                setActiveSection(sectionIndex);
                                setSidebarOpen(false);
                              }}
                              className={`w-full text-left px-3 py-1.5 rounded text-sm flex items-center ${
                                activeSection === sectionIndex
                                  ? 'bg-green-100 text-green-700'
                                  : 'hover:bg-gray-50 text-gray-600'
                              }`}
                            >
                              {completedSections.has(`${moduleIndex}-${sectionIndex}`) ? (
                                <CheckCircle className="w-3 h-3 mr-2 text-green-500 flex-shrink-0" />
                              ) : (
                                <Circle className="w-3 h-3 mr-2 flex-shrink-0" />
                              )}
                              <span className="truncate">{section.title}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>

                {/* 統計情報 (モバイル) */}
                <div className="mt-6 pt-6 border-t">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">学習統計</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">総問題数</span>
                      <span className="font-medium">{totalSections}問</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">完了済み</span>
                      <span className="font-medium text-green-600">{completedSections.size}問</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">正答率</span>
                      <span className="font-medium">{completedSections.size > 0 ? Math.round(localProgress) : 0}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 lg:p-8 p-4">
          <div className="max-w-4xl mx-auto">
            {/* Desktop Header Info */}
            <div className="hidden lg:block mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <BookOpen className="w-5 h-5 text-green-500 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-900">{currentSection.title}</h2>
                </div>
                <div className="text-sm text-gray-600">
                  {currentModule.title} • セクション {activeSection + 1} / {currentModule.sections.length}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                {/* Mobile Section Title */}
                <div className="lg:hidden mb-6">
                  <div className="flex items-center mb-2">
                    <BookOpen className="w-5 h-5 text-green-500 mr-2" />
                    <h2 className="text-xl font-bold text-gray-900">{currentSection.title}</h2>
                  </div>
                  <div className="text-sm text-gray-600">
                    {currentModule.title} • {activeSection + 1} / {currentModule.sections.length}
                  </div>
                </div>

                <div className="prose max-w-none mb-8">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {currentSection.content}
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="text-xl mr-2">🎯</span>
                    理解度チェック
                  </h3>
                  <p className="text-gray-700 mb-4">{currentSection.quiz.question}</p>
                  <div className="space-y-2">
                    {currentSection.quiz.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuizAnswer(index)}
                        disabled={showQuizResult[sectionKey]}
                        className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                          showQuizResult[sectionKey]
                            ? index === currentSection.quiz.correct
                              ? 'bg-green-50 border-green-300 text-green-700'
                              : quizAnswers[sectionKey] === index
                              ? 'bg-red-50 border-red-300 text-red-700'
                              : 'bg-gray-50 border-gray-200 text-gray-500'
                            : 'hover:bg-gray-50 border-gray-200 text-gray-700'
                        }`}
                      >
                        {option}
                        {showQuizResult[sectionKey] && index === currentSection.quiz.correct && (
                          <span className="ml-2">✓</span>
                        )}
                        {showQuizResult[sectionKey] && quizAnswers[sectionKey] === index && index !== currentSection.quiz.correct && (
                          <span className="ml-2">✗</span>
                        )}
                      </button>
                    ))}
                  </div>
                  {showQuizResult[sectionKey] && (
                    <div className={`mt-4 p-3 rounded-lg ${
                      quizAnswers[sectionKey] === currentSection.quiz.correct
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {quizAnswers[sectionKey] === currentSection.quiz.correct
                        ? '✅ 正解です！'
                        : '❌ 不正解です。'}
                      <div className="mt-2 text-sm">
                        <strong>解説:</strong> {currentSection.quiz.explanation}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={previousSection}
                    disabled={activeModule === 0 && activeSection === 0}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← 前のセクション
                  </button>
                  <div className="text-sm text-gray-500">
                    {completedSections.size} / {totalSections} セクション完了
                    {loading && <span className="ml-2 text-blue-500">同期中...</span>}
                  </div>
                  <button
                    onClick={nextSection}
                    disabled={activeModule === learningModules.length - 1 && activeSection === currentModule.sections.length - 1}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    次のセクション
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DebugPanel />
    </div>
  );
}