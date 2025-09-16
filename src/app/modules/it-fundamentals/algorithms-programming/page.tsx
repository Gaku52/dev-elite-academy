'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle, Circle, ChevronRight, Code, GitBranch, Layers } from 'lucide-react';

const learningModules = [
  {
    id: 1,
    title: '基本的なデータ構造',
    sections: [
      {
        title: '配列とリスト',
        content: `データ構造は、データを効率的に格納・操作するための仕組みです。

**配列（Array）:**
- 同じ型のデータを連続したメモリ領域に格納
- インデックスによる高速アクセス（O(1)）
- サイズが固定（静的配列）または可変（動的配列）
- 挿入・削除は遅い（O(n)）

**リスト（List）:**
- **連結リスト**: ノードがポインタで接続
  - 挿入・削除が高速（O(1)）
  - ランダムアクセスは遅い（O(n)）
  - メモリ使用が柔軟

**使い分けの指針:**
- ランダムアクセスが多い → 配列
- 頻繁な挿入・削除 → リスト`,
        quiz: {
          question: '配列の特徴として正しいものはどれですか？',
          options: ['挿入・削除が常にO(1)で実行できる', 'インデックスによるアクセスがO(1)で実行できる', 'メモリ上で不連続に配置される', 'サイズが必ず固定である'],
          correct: 1
        }
      },
      {
        title: 'スタックとキュー',
        content: `特定の順序でデータを扱うデータ構造です。

**スタック（Stack）- LIFO:**
Last In First Out（後入れ先出し）
- push: 要素を追加（トップに）
- pop: 要素を取り出し（トップから）
- peek: トップ要素を参照

用途: 関数呼び出し、括弧の対応チェック、Undo機能

**キュー（Queue）- FIFO:**
First In First Out（先入れ先出し）
- enqueue: 要素を追加（末尾に）
- dequeue: 要素を取り出し（先頭から）

用途: タスク管理、印刷ジョブ、BFS（幅優先探索）

**実装例（擬似コード）:**
\`\`\`
Stack:
  push(x): top = top + 1; array[top] = x
  pop(): x = array[top]; top = top - 1; return x

Queue:
  enqueue(x): rear = rear + 1; array[rear] = x
  dequeue(): x = array[front]; front = front + 1; return x
\`\`\``,
        quiz: {
          question: 'スタックの用途として適切なものはどれですか？',
          options: ['印刷ジョブの管理', '関数呼び出しの管理', 'タスクの順番待ち', 'ネットワークパケットの処理'],
          correct: 1
        }
      },
      {
        title: '木構造',
        content: `階層的な関係を表現するデータ構造です。

**二分木（Binary Tree）:**
各ノードが最大2つの子を持つ木構造
- ルート: 最上位のノード
- リーフ: 子を持たないノード
- 深さ: ルートからの距離

**二分探索木（BST）:**
- 左の子 < 親 < 右の子の関係
- 探索・挿入・削除: 平均O(log n)
- 最悪の場合（偏った木）: O(n)

**平衡二分探索木:**
- AVL木: 各ノードの左右の高さの差が1以下
- 赤黒木: ノードに色を付けてバランスを保つ

**ヒープ（Heap）:**
- 完全二分木
- 親 ≥ 子（最大ヒープ）または 親 ≤ 子（最小ヒープ）
- 優先度付きキューの実装に使用`,
        quiz: {
          question: '二分探索木の特徴として正しいものはどれですか？',
          options: ['すべてのノードが必ず2つの子を持つ', '左の子 < 親 < 右の子の関係がある', 'リーフノードのみにデータを格納する', '挿入は常にO(1)で実行できる'],
          correct: 1
        }
      }
    ]
  },
  {
    id: 2,
    title: '基本アルゴリズム',
    sections: [
      {
        title: '探索アルゴリズム',
        content: `データの中から目的の要素を見つけるアルゴリズムです。

**線形探索（Linear Search）:**
- 先頭から順番に探索
- 時間計算量: O(n)
- ソートされていないデータに使用

\`\`\`
function linearSearch(array, target):
    for i = 0 to array.length - 1:
        if array[i] == target:
            return i
    return -1
\`\`\`

**二分探索（Binary Search）:**
- ソート済み配列で使用
- 中央値と比較して探索範囲を半分に絞る
- 時間計算量: O(log n)

\`\`\`
function binarySearch(array, target):
    left = 0
    right = array.length - 1
    while left <= right:
        mid = (left + right) / 2
        if array[mid] == target:
            return mid
        else if array[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
\`\`\``,
        quiz: {
          question: '二分探索を使用するための前提条件は何ですか？',
          options: ['配列のサイズが偶数である', 'データがソートされている', 'データが重複していない', 'データが整数である'],
          correct: 1
        }
      },
      {
        title: 'ソートアルゴリズム',
        content: `データを特定の順序に並び替えるアルゴリズムです。

**バブルソート:**
- 隣接要素を比較して交換
- 時間計算量: O(n²)
- 安定ソート

**選択ソート:**
- 最小値を選んで先頭と交換
- 時間計算量: O(n²)
- 不安定ソート

**挿入ソート:**
- 適切な位置に挿入
- 時間計算量: O(n²)、ほぼソート済みならO(n)
- 安定ソート

**クイックソート:**
- 分割統治法を使用
- 平均: O(n log n)、最悪: O(n²)
- 不安定ソート

**マージソート:**
- 分割統治法を使用
- 時間計算量: O(n log n)
- 安定ソート
- 追加メモリが必要

**ヒープソート:**
- ヒープを使用
- 時間計算量: O(n log n)
- 不安定ソート`,
        quiz: {
          question: '安定ソートの特徴として正しいものはどれですか？',
          options: ['必ずO(n log n)で実行できる', '同じ値の要素の順序が保たれる', '追加メモリが不要', '最悪計算量が最も小さい'],
          correct: 1
        }
      },
      {
        title: '再帰アルゴリズム',
        content: `自分自身を呼び出すアルゴリズムです。

**再帰の基本構造:**
1. 基底条件（終了条件）
2. 再帰呼び出し（問題を小さくして呼び出す）

**階乗の計算:**
\`\`\`
function factorial(n):
    if n <= 1:          // 基底条件
        return 1
    else:
        return n * factorial(n - 1)  // 再帰呼び出し
\`\`\`

**フィボナッチ数列:**
\`\`\`
function fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)
\`\`\`

**メリット:**
- コードがシンプルで理解しやすい
- 分割統治法との相性が良い

**デメリット:**
- スタックオーバーフローの可能性
- 重複計算による効率の悪さ（メモ化で改善可能）

**応用例:**
- 木構造の走査
- バックトラック法
- 動的計画法`,
        quiz: {
          question: '再帰アルゴリズムの必須要素はどれですか？',
          options: ['ループ処理', '基底条件', '配列の使用', 'ソート処理'],
          correct: 1
        }
      }
    ]
  },
  {
    id: 3,
    title: 'プログラミングの基礎',
    sections: [
      {
        title: '変数とデータ型',
        content: `プログラミングの基本要素である変数とデータ型について学びます。

**基本データ型:**
- **整数型（Integer）**: 1, -5, 100
- **浮動小数点型（Float/Double）**: 3.14, -0.5
- **文字型（Character）**: 'A', 'あ'
- **文字列型（String）**: "Hello", "こんにちは"
- **論理型（Boolean）**: true, false

**変数の宣言と代入:**
\`\`\`
int age = 20;           // 整数型
double height = 170.5;  // 浮動小数点型
string name = "田中";    // 文字列型
boolean isStudent = true; // 論理型
\`\`\`

**型変換:**
- 暗黙的型変換: 自動的に行われる
- 明示的型変換（キャスト）: プログラマが指定

**スコープ:**
- グローバル変数: プログラム全体で使用可能
- ローカル変数: 特定のブロック内でのみ使用可能`,
        quiz: {
          question: '変数のスコープに関して正しい説明はどれですか？',
          options: ['すべての変数はグローバルである', 'ローカル変数は特定のブロック内でのみ使用可能', 'グローバル変数は関数内でのみ使用可能', 'スコープは実行時に決定される'],
          correct: 1
        }
      },
      {
        title: '制御構造',
        content: `プログラムの実行順序を制御する構造です。

**条件分岐:**
\`\`\`
// if文
if (score >= 60) {
    print("合格")
} else {
    print("不合格")
}

// switch文
switch (grade) {
    case 'A': print("優秀"); break;
    case 'B': print("良好"); break;
    case 'C': print("可"); break;
    default: print("不可");
}
\`\`\`

**繰り返し処理:**
\`\`\`
// for文
for (i = 0; i < 10; i++) {
    print(i)
}

// while文
while (count < 10) {
    count = count + 1
}

// do-while文
do {
    input = getUserInput()
} while (input != "quit")
\`\`\`

**制御の移動:**
- break: ループを抜ける
- continue: 次の繰り返しへ
- return: 関数から戻る`,
        quiz: {
          question: 'do-while文の特徴として正しいものはどれですか？',
          options: ['条件を満たさなくても必ず1回は実行される', '条件を先に評価してから実行する', 'breakを使用できない', 'カウンタ変数が必須である'],
          correct: 0
        }
      },
      {
        title: '関数とモジュール',
        content: `コードの再利用性と保守性を高める仕組みです。

**関数の定義:**
\`\`\`
function calculateArea(width, height) {
    return width * height
}

// 関数の呼び出し
area = calculateArea(10, 20)
\`\`\`

**引数と戻り値:**
- 値渡し: 値のコピーを渡す
- 参照渡し: メモリアドレスを渡す
- デフォルト引数: 引数の既定値を設定

**関数の種類:**
- void関数: 戻り値なし
- 純粋関数: 副作用がなく、同じ入力に対して同じ出力
- 再帰関数: 自分自身を呼び出す

**モジュール化:**
- コードの分割と整理
- 名前空間の分離
- インポート/エクスポート

**メリット:**
- コードの再利用
- 保守性の向上
- テストの容易さ
- チーム開発の効率化`,
        quiz: {
          question: '純粋関数の特徴として正しいものはどれですか？',
          options: ['必ず引数を持つ', '副作用がなく、同じ入力に対して同じ出力を返す', '戻り値を持たない', 'グローバル変数を変更する'],
          correct: 1
        }
      }
    ]
  }
];

export default function AlgorithmsProgrammingPage() {
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
          className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          IT基礎に戻る
        </Link>

        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mr-4">
              <Code className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">アルゴリズムとプログラミング</h1>
              <p className="text-gray-600">データ構造、アルゴリズム、プログラミングの基礎</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">学習進捗</span>
              <span className="text-gray-900 font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
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
                          ? 'bg-purple-50 text-purple-600'
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
                                ? 'bg-purple-100 text-purple-700'
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
                  <BookOpen className="w-5 h-5 text-purple-500 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-900">{currentSection.title}</h2>
                </div>

                <div className="prose max-w-none mb-8">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {currentSection.content}
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-6 mb-6">
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
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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