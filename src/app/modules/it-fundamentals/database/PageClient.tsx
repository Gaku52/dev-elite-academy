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