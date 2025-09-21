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
CREATE OR REPLACE MODEL `project.dataset.sales_prediction_model`
OPTIONS(model_type='linear_reg') AS
SELECT
    advertising_spend,
    seasonal_index,
    competitor_count,
    monthly_sales AS label
FROM `project.dataset.sales_training_data`;

-- 予測の実行
SELECT
    predicted_label AS predicted_sales,
    advertising_spend,
    seasonal_index
FROM ML.PREDICT(MODEL `project.dataset.sales_prediction_model`,
    (SELECT * FROM `project.dataset.new_data`));
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