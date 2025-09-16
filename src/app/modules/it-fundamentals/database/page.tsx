'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle, Circle, ChevronRight, Database, Table, Key } from 'lucide-react';

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
          correct: 1
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
          correct: 1
        }
      },
      {
        title: '正規化',
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
- 記憶容量の節約`,
        quiz: {
          question: '第2正規形の条件として正しいものはどれですか？',
          options: ['推移的関数従属の排除', '部分関数従属の排除', '繰り返し項目の排除', 'NULL値の排除'],
          correct: 1
        }
      }
    ]
  },
  {
    id: 2,
    title: 'SQL基礎',
    sections: [
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
    入社日 DATE
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
- CHECK: 条件制約`,
        quiz: {
          question: 'PRIMARY KEY制約の特徴として誤っているものはどれですか？',
          options: ['値の重複を許可しない', 'NULLを許可しない', '1テーブルに複数設定できる', 'レコードを一意に識別する'],
          correct: 2
        }
      },
      {
        title: 'データ操作言語（DML）',
        content: `DMLはデータの検索・追加・更新・削除を行うSQL文です。

**SELECT（検索）:**
\`\`\`sql
-- 基本形
SELECT 列名 FROM テーブル名 WHERE 条件;

-- 全件取得
SELECT * FROM 社員;

-- 条件付き検索
SELECT 氏名, 給与 FROM 社員 WHERE 部署ID = 10;

-- 並び替え
SELECT * FROM 社員 ORDER BY 給与 DESC;

-- グループ化と集計
SELECT 部署ID, COUNT(*), AVG(給与)
FROM 社員
GROUP BY 部署ID
HAVING COUNT(*) >= 3;
\`\`\`

**INSERT（追加）:**
\`\`\`sql
INSERT INTO 社員 (社員ID, 氏名, 部署ID, 入社日)
VALUES (004, '山田', 30, '2022-04-01');
\`\`\`

**UPDATE（更新）:**
\`\`\`sql
UPDATE 社員 SET 給与 = 給与 * 1.1 WHERE 部署ID = 10;
\`\`\`

**DELETE（削除）:**
\`\`\`sql
DELETE FROM 社員 WHERE 入社日 < '2020-01-01';
\`\`\``,
        quiz: {
          question: 'GROUP BY句と一緒に使用する条件指定の句はどれですか？',
          options: ['WHERE', 'HAVING', 'ORDER BY', 'LIMIT'],
          correct: 1
        }
      },
      {
        title: '結合と副問合せ',
        content: `複数のテーブルからデータを取得する方法です。

**内部結合（INNER JOIN）:**
\`\`\`sql
-- 両方のテーブルに存在するデータのみ
SELECT s.氏名, d.部署名
FROM 社員 s
INNER JOIN 部署 d ON s.部署ID = d.部署ID;
\`\`\`

**外部結合（OUTER JOIN）:**
\`\`\`sql
-- 左外部結合: 左側のテーブルは全件表示
SELECT s.氏名, d.部署名
FROM 社員 s
LEFT OUTER JOIN 部署 d ON s.部署ID = d.部署ID;

-- 右外部結合: 右側のテーブルは全件表示
SELECT s.氏名, d.部署名
FROM 社員 s
RIGHT OUTER JOIN 部署 d ON s.部署ID = d.部署ID;
\`\`\`

**副問合せ（サブクエリ）:**
\`\`\`sql
-- WHERE句での使用
SELECT 氏名 FROM 社員
WHERE 給与 > (SELECT AVG(給与) FROM 社員);

-- FROM句での使用
SELECT * FROM
(SELECT 部署ID, AVG(給与) as 平均給与 FROM 社員 GROUP BY 部署ID) t
WHERE 平均給与 > 300000;

-- IN演算子との組み合わせ
SELECT 氏名 FROM 社員
WHERE 部署ID IN (SELECT 部署ID FROM 部署 WHERE 場所 = '東京');
\`\`\``,
        quiz: {
          question: 'LEFT OUTER JOINの特徴として正しいものはどれですか？',
          options: ['右側のテーブルは全件表示される', '左側のテーブルは全件表示される', '両方のテーブルに存在するデータのみ表示', '結合条件を指定できない'],
          correct: 1
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

**C: Consistency（一貫性）:**
- トランザクション前後でデータの整合性を保つ
- 制約違反を起こさない

**I: Isolation（独立性）:**
- 複数のトランザクションが干渉しない
- 同時実行しても単独実行と同じ結果

**D: Durability（永続性）:**
- コミット後のデータは永続的に保存
- システム障害が起きても失われない

**トランザクション制御:**
\`\`\`sql
BEGIN TRANSACTION;  -- 開始
UPDATE 口座 SET 残高 = 残高 - 10000 WHERE 口座ID = 'A';
UPDATE 口座 SET 残高 = 残高 + 10000 WHERE 口座ID = 'B';
COMMIT;  -- 確定

-- エラー時
ROLLBACK;  -- 取り消し
\`\`\``,
        quiz: {
          question: 'ACID特性のうち、「すべて成功するか、すべて失敗するか」を表すものはどれですか？',
          options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
          correct: 0
        }
      },
      {
        title: '同時実行制御',
        content: `複数のトランザクションを同時に実行する際の制御方法です。

**問題となる現象:**

**ダーティリード:**
- 未コミットのデータを読む
- トランザクションAの未確定データをBが読む

**ファントムリード:**
- 同じ検索で異なる結果
- 他のトランザクションの挿入・削除の影響

**非再現リード:**
- 同じデータを2回読んで異なる値
- 他のトランザクションの更新の影響

**ロストアップデート:**
- 更新が失われる
- 同時更新で後の更新が前の更新を上書き

**ロック方式:**
- **共有ロック（Sロック）**: 読み込み用、複数可
- **排他ロック（Xロック）**: 書き込み用、単独のみ

**2相ロッキングプロトコル:**
1. 成長相: ロックの取得のみ
2. 縮小相: ロックの解放のみ

**デッドロック:**
- 複数のトランザクションが互いのロック解放を待つ
- タイムアウトやデッドロック検出で対処`,
        quiz: {
          question: '共有ロック（Sロック）の特徴として正しいものはどれですか？',
          options: ['書き込み専用である', '複数のトランザクションが同時に取得できる', '1つのトランザクションのみ取得可能', 'データの削除時に使用'],
          correct: 1
        }
      },
      {
        title: '障害回復',
        content: `データベースの障害から回復する仕組みです。

**障害の種類:**
- **トランザクション障害**: プログラムエラー、デッドロック
- **システム障害**: OS、DBMSの異常終了
- **メディア障害**: ディスクの物理的故障

**ログファイル:**
- トランザクションの更新履歴を記録
- 更新前ログ（UNDO）: ロールバック用
- 更新後ログ（REDO）: ロールフォワード用

**チェックポイント:**
- 定期的にメモリ内容をディスクに書き出し
- 回復処理の起点となる

**回復手法:**

**ロールバック（後退復帰）:**
- 未完了トランザクションを取り消し
- 更新前ログを使用

**ロールフォワード（前進復帰）:**
- バックアップから最新状態まで再実行
- 更新後ログを使用

**回復手順:**
1. バックアップのリストア
2. ログを使ってロールフォワード
3. 未完了トランザクションのロールバック

**バックアップ方式:**
- フルバックアップ: 全データ
- 差分バックアップ: 前回のフルバックアップからの差分
- 増分バックアップ: 前回のバックアップからの差分`,
        quiz: {
          question: 'ロールフォワードで使用するログはどれですか？',
          options: ['更新前ログ', '更新後ログ', 'エラーログ', 'アクセスログ'],
          correct: 1
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

  const currentModule = learningModules[activeModule];
  const currentSection = currentModule.sections[activeSection];
  const sectionKey = `${activeModule}-${activeSection}`;

  const handleQuizAnswer = (answer: number) => {
    setQuizAnswers({...quizAnswers, [sectionKey]: answer});
    setShowQuizResult({...showQuizResult, [sectionKey]: true});

    if (answer === currentSection.quiz.correct) {
      setCompletedSections(new Set([...completedSections, sectionKey]));
    }
  };

  const nextSection = () => {
    if (activeSection < currentModule.sections.length - 1) {
      setActiveSection(activeSection + 1);
    } else if (activeModule < learningModules.length - 1) {
      setActiveModule(activeModule + 1);
      setActiveSection(0);
    }
  };

  const previousSection = () => {
    if (activeSection > 0) {
      setActiveSection(activeSection - 1);
    } else if (activeModule > 0) {
      setActiveModule(activeModule - 1);
      setActiveSection(learningModules[activeModule - 1].sections.length - 1);
    }
  };

  const progress = (completedSections.size / learningModules.reduce((acc, m) => acc + m.sections.length, 0)) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <Link
          href="/modules/it-fundamentals"
          className="inline-flex items-center text-green-600 hover:text-green-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          IT基礎に戻る
        </Link>

        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mr-4">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">データベース</h1>
              <p className="text-gray-600">データベースの基本概念とSQL</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">学習進捗</span>
              <span className="text-gray-900 font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
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
                      <div className="ml-3 mt-1 space-y-1">
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
                              <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                            ) : (
                              <Circle className="w-3 h-3 mr-2" />
                            )}
                            {section.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <BookOpen className="w-5 h-5 text-green-500 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-900">{currentSection.title}</h2>
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
                        ? '正解です！次のセクションに進みましょう。'
                        : '不正解です。もう一度内容を確認してみましょう。'}
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={previousSection}
                    disabled={activeModule === 0 && activeSection === 0}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← 前のセクション
                  </button>
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
    </div>
  );
}