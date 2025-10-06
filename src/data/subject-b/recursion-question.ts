import type { SubjectBQuestion } from '@/types/subject-b';

export const recursionQuestion: SubjectBQuestion = {
  id: 'algo-004-recursion',
  title: '再帰を用いた階乗の計算',
  description: '関数が自分自身を呼び出す再帰処理を理解し、階乗計算のアルゴリズムを学ぶ問題です。',
  category: 'algorithm',
  difficulty: 'hard',
  timeEstimate: 20,

  problemStatement: `
    <p>次のプログラムは、再帰（関数が自分自身を呼び出す手法）を用いて、整数nの階乗（n!）を計算するものである。</p>
    <p>階乗とは、1からnまでのすべての整数の積である。例えば、5! = 5 × 4 × 3 × 2 × 1 = 120 である。</p>
    <p>再帰処理では、問題を小さな部分問題に分割し、同じ処理を繰り返し適用することで解決する。</p>
  `,

  pseudoCode: [
    { lineNumber: 1, code: '○整数型: n' },
    { lineNumber: 2, code: '' },
    { lineNumber: 3, code: '/* nの階乗を計算する関数 */' },
    { lineNumber: 4, code: '関数 factorial(n):' },
    { lineNumber: 5, code: '    /* 基底条件：再帰を終了する条件 */' },
    { lineNumber: 6, code: '    もし ａ ならば:', highlight: true },
    { lineNumber: 7, code: '        1を返す' },
    { lineNumber: 8, code: '    もしの終わり' },
    { lineNumber: 9, code: '    ' },
    { lineNumber: 10, code: '    /* 再帰呼び出し：問題を小さくして自分自身を呼ぶ */' },
    { lineNumber: 11, code: '    ｂ を返す', highlight: true },
    { lineNumber: 12, code: '関数の終わり' },
  ],

  additionalInfo: `
    <h4>再帰の基本構造</h4>
    <p>再帰処理には必ず以下の2つの要素が必要です：</p>
    <ul>
      <li><strong>基底条件（Base Case）</strong>：再帰を終了する条件。これがないと無限ループになる</li>
      <li><strong>再帰呼び出し（Recursive Call）</strong>：問題を小さくして自分自身を呼び出す</li>
    </ul>

    <h4>階乗の定義</h4>
    <p>数学的には以下のように定義されます：</p>
    <ul>
      <li>0! = 1（定義）</li>
      <li>n! = n × (n-1)!（n > 0 の場合）</li>
    </ul>

    <h4>factorial(5)の呼び出しイメージ</h4>
    <pre style="background-color: #f5f5f5; padding: 10px; border-radius: 5px;">
factorial(5)
  → 5 × factorial(4)
      → 4 × factorial(3)
          → 3 × factorial(2)
              → 2 × factorial(1)
                  → 1 × factorial(0)
                      → 1（基底条件）
                  ← 1
              ← 2 × 1 = 2
          ← 3 × 2 = 6
      ← 4 × 6 = 24
  ← 5 × 24 = 120
    </pre>
  `,

  subQuestions: [
    {
      id: 'q1',
      questionNumber: '設問1',
      text: `
        <p>プログラム中の空欄 <strong>ａ</strong> に入る適切な条件式を選択してください。</p>
        <p>再帰を終了するための基底条件を考えましょう。</p>
      `,
      type: 'fill-in-blank',
      fillInBlanks: [
        {
          id: 'a',
          label: 'ａ',
          options: [
            { id: 'opt1', text: 'n = 0' },
            { id: 'opt2', text: 'n = 1' },
            { id: 'opt3', text: 'n ≦ 0' },
            { id: 'opt4', text: 'n ≦ 1' },
            { id: 'opt5', text: 'n > 0' },
          ],
          correctAnswer: 'opt4'
        }
      ],
      explanation: `
        <p><strong>正解：n ≦ 1</strong></p>
        <p>階乗の定義より：</p>
        <ul>
          <li>0! = 1</li>
          <li>1! = 1</li>
        </ul>
        <p>したがって、nが0または1のとき、再帰を終了して1を返すべきです。</p>
        <p><code>n ≦ 1</code> は、<code>n = 0</code> と <code>n = 1</code> の両方を含むため、最も適切です。</p>
      `,
      detailedExplanation: `
        <h4>基底条件の重要性</h4>
        <p>基底条件がないと、再帰は永遠に続き、スタックオーバーフローが発生します。</p>

        <h5>各選択肢の検証</h5>
        <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 8px;">条件</th>
            <th style="border: 1px solid #ddd; padding: 8px;">factorial(0)の結果</th>
            <th style="border: 1px solid #ddd; padding: 8px;">factorial(1)の結果</th>
            <th style="border: 1px solid #ddd; padding: 8px;">評価</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">n = 0</td>
            <td style="border: 1px solid #ddd; padding: 8px;">1（正しい）</td>
            <td style="border: 1px solid #ddd; padding: 8px;">1×factorial(0)=1（正しいが冗長）</td>
            <td style="border: 1px solid #ddd; padding: 8px;">△ 動作するが非効率</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">n = 1</td>
            <td style="border: 1px solid #ddd; padding: 8px;">0×factorial(-1)→エラー</td>
            <td style="border: 1px solid #ddd; padding: 8px;">1（正しい）</td>
            <td style="border: 1px solid #ddd; padding: 8px;">× factorial(0)で問題発生</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">n ≦ 0</td>
            <td style="border: 1px solid #ddd; padding: 8px;">1（正しい）</td>
            <td style="border: 1px solid #ddd; padding: 8px;">1×factorial(0)=1（正しいが冗長）</td>
            <td style="border: 1px solid #ddd; padding: 8px;">△ 負数も含むので広すぎる</td>
          </tr>
          <tr style="background-color: #d4edda;">
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>n ≦ 1</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>1（正しい）</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>1（正しい）</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>○ 最適</strong></td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">n > 0</td>
            <td style="border: 1px solid #ddd; padding: 8px;">無限再帰→エラー</td>
            <td style="border: 1px solid #ddd; padding: 8px;">無限再帰→エラー</td>
            <td style="border: 1px solid #ddd; padding: 8px;">× 再帰が終了しない</td>
          </tr>
        </table>

        <h4>なぜ n ≦ 1 が最適なのか</h4>
        <ol>
          <li><strong>0!と1!の両方に対応</strong>：0! = 1 と 1! = 1 の両方を直接返せる</li>
          <li><strong>効率的</strong>：factorial(1)の場合、不要な再帰呼び出しを避けられる</li>
          <li><strong>安全</strong>：負の数に対しても1を返す（エラー防止）</li>
        </ol>

        <h4>再帰のトレース例：factorial(3)</h4>
        <pre style="background-color: #f5f5f5; padding: 10px; border-radius: 5px;">
呼び出し:
factorial(3)
  n=3 は 3≦1? No → 再帰
  3 × factorial(2)
      n=2 は 2≦1? No → 再帰
      2 × factorial(1)
          n=1 は 1≦1? Yes → 1を返す
      ← 2 × 1 = 2
  ← 3 × 2 = 6
結果: 6
        </pre>
      `
    },
    {
      id: 'q2',
      questionNumber: '設問2',
      text: `
        <p>プログラム中の空欄 <strong>ｂ</strong> に入る適切な式を選択してください。</p>
        <p>階乗の定義 n! = n × (n-1)! を再帰で表現します。</p>
      `,
      type: 'fill-in-blank',
      fillInBlanks: [
        {
          id: 'b',
          label: 'ｂ',
          options: [
            { id: 'opt1', text: 'n * factorial(n)' },
            { id: 'opt2', text: 'n * factorial(n - 1)' },
            { id: 'opt3', text: 'n * factorial(n + 1)' },
            { id: 'opt4', text: 'factorial(n - 1)' },
            { id: 'opt5', text: 'n + factorial(n - 1)' },
          ],
          correctAnswer: 'opt2'
        }
      ],
      explanation: `
        <p><strong>正解：n * factorial(n - 1)</strong></p>
        <p>階乗の定義に従います：</p>
        <ul>
          <li>n! = n × (n-1)!</li>
          <li>例：5! = 5 × 4!</li>
        </ul>
        <p>これをプログラムで表現すると <code>n * factorial(n - 1)</code> になります。</p>
      `,
      detailedExplanation: `
        <h4>再帰式の構造</h4>
        <p>階乗の計算は、元の問題を「1つ小さい問題」に帰着させることができます。</p>

        <h5>数学的定義</h5>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          <p style="margin: 5px 0;"><strong>n! = n × (n-1)!</strong></p>
          <p style="margin: 5px 0;">例：</p>
          <ul style="margin: 5px 0;">
            <li>5! = 5 × 4! = 5 × 24 = 120</li>
            <li>4! = 4 × 3! = 4 × 6 = 24</li>
            <li>3! = 3 × 2! = 3 × 2 = 6</li>
            <li>2! = 2 × 1! = 2 × 1 = 2</li>
            <li>1! = 1（基底条件）</li>
          </ul>
        </div>

        <h4>誤答選択肢の解説</h4>
        <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 8px;">式</th>
            <th style="border: 1px solid #ddd; padding: 8px;">問題点</th>
            <th style="border: 1px solid #ddd; padding: 8px;">結果</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">n * factorial(n)</td>
            <td style="border: 1px solid #ddd; padding: 8px;">自分自身を呼び出す（問題が小さくならない）</td>
            <td style="border: 1px solid #ddd; padding: 8px;">無限再帰</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">n * factorial(n + 1)</td>
            <td style="border: 1px solid #ddd; padding: 8px;">問題が大きくなる（逆方向）</td>
            <td style="border: 1px solid #ddd; padding: 8px;">無限再帰</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">factorial(n - 1)</td>
            <td style="border: 1px solid #ddd; padding: 8px;">nを掛けていない</td>
            <td style="border: 1px solid #ddd; padding: 8px;">(n-1)!の値（誤り）</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">n + factorial(n - 1)</td>
            <td style="border: 1px solid #ddd; padding: 8px;">加算になっている</td>
            <td style="border: 1px solid #ddd; padding: 8px;">間違った値</td>
          </tr>
        </table>

        <h4>再帰呼び出しの流れ（factorial(4)の例）</h4>
        <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 8px;">呼び出し</th>
            <th style="border: 1px solid #ddd; padding: 8px;">計算式</th>
            <th style="border: 1px solid #ddd; padding: 8px;">状態</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">factorial(4)</td>
            <td style="border: 1px solid #ddd; padding: 8px;">4 × factorial(3)</td>
            <td style="border: 1px solid #ddd; padding: 8px;">待機中...</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">factorial(3)</td>
            <td style="border: 1px solid #ddd; padding: 8px;">3 × factorial(2)</td>
            <td style="border: 1px solid #ddd; padding: 8px;">待機中...</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">factorial(2)</td>
            <td style="border: 1px solid #ddd; padding: 8px;">2 × factorial(1)</td>
            <td style="border: 1px solid #ddd; padding: 8px;">待機中...</td>
          </tr>
          <tr style="background-color: #fffacd;">
            <td style="border: 1px solid #ddd; padding: 8px;">factorial(1)</td>
            <td style="border: 1px solid #ddd; padding: 8px;">1（基底条件）</td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>返却：1</strong></td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">factorial(2)</td>
            <td style="border: 1px solid #ddd; padding: 8px;">2 × 1</td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>返却：2</strong></td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">factorial(3)</td>
            <td style="border: 1px solid #ddd; padding: 8px;">3 × 2</td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>返却：6</strong></td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">factorial(4)</td>
            <td style="border: 1px solid #ddd; padding: 8px;">4 × 6</td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>返却：24</strong></td>
          </tr>
        </table>
      `
    },
    {
      id: 'q3',
      questionNumber: '設問3',
      text: `
        <p>factorial(5)を実行したとき、factorial関数は何回呼び出されるか（最初の呼び出しを含む）。</p>
      `,
      type: 'multiple-choice',
      choices: [
        { id: 'choice1', text: '4回' },
        { id: 'choice2', text: '5回' },
        { id: 'choice3', text: '6回' },
        { id: 'choice4', text: '7回' },
      ],
      correctAnswer: 'choice3',
      explanation: `
        <p><strong>正解：6回</strong></p>
        <p>factorial(5)の呼び出しチェーン：</p>
        <ol>
          <li>factorial(5) - 1回目</li>
          <li>factorial(4) - 2回目</li>
          <li>factorial(3) - 3回目</li>
          <li>factorial(2) - 4回目</li>
          <li>factorial(1) - 5回目</li>
          <li>factorial(0) - 6回目（基底条件で終了）</li>
        </ol>
        <p>※基底条件が<code>n ≦ 1</code>の場合、factorial(1)で終了するため5回ですが、
        <code>n = 0</code>のみの場合は6回になります。</p>
      `,
      detailedExplanation: `
        <h4>完全トレース：factorial(5)</h4>
        <p>基底条件を <code>n ≦ 1</code> とした場合：</p>

        <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 8px;">回数</th>
            <th style="border: 1px solid #ddd; padding: 8px;">呼び出し</th>
            <th style="border: 1px solid #ddd; padding: 8px;">条件チェック</th>
            <th style="border: 1px solid #ddd; padding: 8px;">動作</th>
            <th style="border: 1px solid #ddd; padding: 8px;">返り値</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">1</td>
            <td style="border: 1px solid #ddd; padding: 8px;">factorial(5)</td>
            <td style="border: 1px solid #ddd; padding: 8px;">5 ≦ 1? No</td>
            <td style="border: 1px solid #ddd; padding: 8px;">5 × factorial(4)を計算</td>
            <td style="border: 1px solid #ddd; padding: 8px;">120</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">2</td>
            <td style="border: 1px solid #ddd; padding: 8px;">factorial(4)</td>
            <td style="border: 1px solid #ddd; padding: 8px;">4 ≦ 1? No</td>
            <td style="border: 1px solid #ddd; padding: 8px;">4 × factorial(3)を計算</td>
            <td style="border: 1px solid #ddd; padding: 8px;">24</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">3</td>
            <td style="border: 1px solid #ddd; padding: 8px;">factorial(3)</td>
            <td style="border: 1px solid #ddd; padding: 8px;">3 ≦ 1? No</td>
            <td style="border: 1px solid #ddd; padding: 8px;">3 × factorial(2)を計算</td>
            <td style="border: 1px solid #ddd; padding: 8px;">6</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">4</td>
            <td style="border: 1px solid #ddd; padding: 8px;">factorial(2)</td>
            <td style="border: 1px solid #ddd; padding: 8px;">2 ≦ 1? No</td>
            <td style="border: 1px solid #ddd; padding: 8px;">2 × factorial(1)を計算</td>
            <td style="border: 1px solid #ddd; padding: 8px;">2</td>
          </tr>
          <tr style="background-color: #d4edda;">
            <td style="border: 1px solid #ddd; padding: 8px;">5</td>
            <td style="border: 1px solid #ddd; padding: 8px;">factorial(1)</td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>1 ≦ 1? Yes</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>基底条件</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>1</strong></td>
          </tr>
        </table>

        <p><strong>結論</strong>：基底条件が <code>n ≦ 1</code> の場合、5回の呼び出しで終了します。</p>
        <p>もし基底条件が <code>n = 0</code> のみの場合は、factorial(0)まで続くため6回になります。</p>

        <h4>再帰の深さとメモリ</h4>
        <p>再帰呼び出しは、各呼び出しごとにスタックメモリを消費します。</p>
        <ul>
          <li>factorial(5)の場合：最大5つの関数呼び出しが同時にスタック上に存在</li>
          <li>factorial(1000)の場合：最大1000個（スタックオーバーフローの危険）</li>
        </ul>

        <h4>再帰 vs 反復</h4>
        <p>階乗はループ（反復）でも実装できます：</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
          <p><strong>反復版（ループ）</strong></p>
          <pre>result ← 1
i を 1 から n まで繰り返す:
    result ← result * i
resultを返す</pre>
        </div>
        <p>反復版の方がメモリ効率が良いですが、再帰の方が直感的で理解しやすい場合もあります。</p>
      `
    }
  ],

  overallExplanation: `
    <h3>再帰処理の全体像</h3>
    <p>再帰は、問題を小さな部分問題に分割し、同じ処理を繰り返し適用する強力なプログラミング技法です。</p>

    <h4>再帰の必須要素</h4>
    <ol>
      <li><strong>基底条件（Base Case）</strong>：再帰を終了する条件</li>
      <li><strong>再帰呼び出し（Recursive Case）</strong>：問題を小さくして自分自身を呼び出す</li>
    </ol>

    <h4>再帰が適している問題</h4>
    <ul>
      <li><strong>数学的定義</strong>：階乗、フィボナッチ数列など</li>
      <li><strong>木構造の走査</strong>：ディレクトリ探索、HTMLのDOM操作など</li>
      <li><strong>分割統治法</strong>：クイックソート、マージソート、二分探索など</li>
      <li><strong>バックトラッキング</strong>：迷路の探索、8クイーン問題など</li>
    </ul>

    <h4>再帰のメリットとデメリット</h4>
    <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
      <tr style="background-color: #f0f0f0;">
        <th style="border: 1px solid #ddd; padding: 8px;">メリット</th>
        <th style="border: 1px solid #ddd; padding: 8px;">デメリット</th>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">
          <ul style="margin: 0;">
            <li>コードがシンプルで直感的</li>
            <li>数学的定義に忠実</li>
            <li>複雑な問題を簡潔に表現</li>
          </ul>
        </td>
        <td style="border: 1px solid #ddd; padding: 8px;">
          <ul style="margin: 0;">
            <li>メモリ消費が大きい（スタック）</li>
            <li>実行速度が遅い場合がある</li>
            <li>スタックオーバーフローのリスク</li>
          </ul>
        </td>
      </tr>
    </table>

    <h4>再帰の最適化技法</h4>
    <ul>
      <li><strong>末尾再帰（Tail Recursion）</strong>：コンパイラが最適化しやすい形式</li>
      <li><strong>メモ化（Memoization）</strong>：計算結果をキャッシュして重複計算を避ける</li>
      <li><strong>反復への変換</strong>：必要に応じてループで実装し直す</li>
    </ul>

    <h4>実用例</h4>
    <ul>
      <li>ファイルシステムの再帰的探索</li>
      <li>JSONやXMLのパース</li>
      <li>グラフの深さ優先探索（DFS）</li>
      <li>正規表現のマッチング</li>
      <li>関数型プログラミング言語（Haskell、Lispなど）での標準的な処理</li>
    </ul>
  `,

  learningPoints: [
    '再帰の基本構造（基底条件と再帰呼び出し）',
    '問題を小さな部分問題に分割する考え方',
    '再帰呼び出しのトレース方法',
    'スタックの動作と関数呼び出しの関係',
    '再帰と反復の違いと使い分け',
    '無限再帰を避けるための基底条件の重要性',
  ],

  keywords: [
    '再帰',
    '再帰関数',
    '基底条件',
    '再帰呼び出し',
    '階乗',
    'スタック',
    '分割統治法',
    '自己参照',
  ],
};
