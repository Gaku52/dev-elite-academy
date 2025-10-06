import type { SubjectBQuestion } from '@/types/subject-b';

export const stackQuestion: SubjectBQuestion = {
  id: 'algo-003-stack',
  title: 'スタックを用いた逆ポーランド記法の計算',
  description: 'スタック（後入れ先出し）データ構造を使って、逆ポーランド記法の式を計算する問題です。',
  category: 'algorithm',
  difficulty: 'medium',
  timeEstimate: 18,

  problemStatement: `
    <p>次のプログラムは、逆ポーランド記法（RPN: Reverse Polish Notation）で表された式を、スタックを用いて計算するものである。</p>
    <p>逆ポーランド記法では、演算子を被演算数の後ろに記述する。例えば、通常の式 <code>3 + 4</code> は、逆ポーランド記法では <code>3 4 +</code> と表記される。</p>
    <p>スタックは「後入れ先出し（LIFO: Last In First Out）」のデータ構造で、最後に入れたデータが最初に取り出される。</p>
  `,

  pseudoCode: [
    { lineNumber: 1, code: '○スタック: stack（整数を格納）' },
    { lineNumber: 2, code: '○文字列の配列: tokens' },
    { lineNumber: 3, code: '○整数型: i, a, b, result' },
    { lineNumber: 4, code: '' },
    { lineNumber: 5, code: '/* tokensは逆ポーランド記法の式を空白で分割したもの */' },
    { lineNumber: 6, code: '/* 例: "3 4 + 2 *" → ["3", "4", "+", "2", "*"] */' },
    { lineNumber: 7, code: '' },
    { lineNumber: 8, code: 'i を 0 から tokensの要素数 - 1 まで 1 ずつ増やしながら繰り返す:' },
    { lineNumber: 9, code: '    もし tokens[i] が数値ならば:' },
    { lineNumber: 10, code: '        /* 数値の場合はスタックにプッシュ */' },
    { lineNumber: 11, code: '        tokens[i]を整数に変換してstackにプッシュ' },
    { lineNumber: 12, code: '    そうでなければ:' },
    { lineNumber: 13, code: '        /* 演算子の場合 */' },
    { lineNumber: 14, code: '        b ← ａ', highlight: true },
    { lineNumber: 15, code: '        a ← stackからポップ' },
    { lineNumber: 16, code: '        ' },
    { lineNumber: 17, code: '        もし tokens[i] = "+" ならば:' },
    { lineNumber: 18, code: '            result ← a + b' },
    { lineNumber: 19, code: '        そうでなくもし tokens[i] = "-" ならば:' },
    { lineNumber: 20, code: '            result ← ｂ', highlight: true },
    { lineNumber: 21, code: '        そうでなくもし tokens[i] = "*" ならば:' },
    { lineNumber: 22, code: '            result ← a * b' },
    { lineNumber: 23, code: '        そうでなくもし tokens[i] = "/" ならば:' },
    { lineNumber: 24, code: '            result ← a / b' },
    { lineNumber: 25, code: '        もしの終わり' },
    { lineNumber: 26, code: '        ' },
    { lineNumber: 27, code: '        resultをstackにプッシュ' },
    { lineNumber: 28, code: '    もしの終わり' },
    { lineNumber: 29, code: 'ループの終わり' },
    { lineNumber: 30, code: '' },
    { lineNumber: 31, code: '/* 最終結果はスタックの最上位 */' },
    { lineNumber: 32, code: 'stackからポップして返す' },
  ],

  additionalInfo: `
    <h4>スタックの基本操作</h4>
    <ul>
      <li><strong>プッシュ（push）</strong>：スタックの最上位にデータを追加</li>
      <li><strong>ポップ（pop）</strong>：スタックの最上位からデータを取り出して削除</li>
    </ul>

    <h4>逆ポーランド記法の計算例</h4>
    <p>式：<code>3 4 + 2 *</code>（通常の記法では <code>(3 + 4) * 2</code>）</p>
    <ol>
      <li>"3" を読む → スタックにプッシュ：[3]</li>
      <li>"4" を読む → スタックにプッシュ：[3, 4]</li>
      <li>"+" を読む → 4と3をポップ、3+4=7を計算、7をプッシュ：[7]</li>
      <li>"2" を読む → スタックにプッシュ：[7, 2]</li>
      <li>"*" を読む → 2と7をポップ、7*2=14を計算、14をプッシュ：[14]</li>
      <li>結果：14</li>
    </ol>
  `,

  subQuestions: [
    {
      id: 'q1',
      questionNumber: '設問1',
      text: `
        <p>プログラム中の空欄 <strong>ａ</strong> に入る適切な操作を選択してください。</p>
        <p>演算子に遭遇したとき、スタックから2つの数値を取り出す必要があります。</p>
      `,
      type: 'fill-in-blank',
      fillInBlanks: [
        {
          id: 'a',
          label: 'ａ',
          options: [
            { id: 'opt1', text: 'stackからポップ' },
            { id: 'opt2', text: 'stackにプッシュ' },
            { id: 'opt3', text: 'stackの最上位を参照（取り出さない）' },
            { id: 'opt4', text: 'stackをクリア' },
            { id: 'opt5', text: 'stackのサイズを取得' },
          ],
          correctAnswer: 'opt1'
        }
      ],
      explanation: `
        <p><strong>正解：stackからポップ</strong></p>
        <p>演算子を処理する際、スタックから2つの数値を取り出す必要があります。</p>
        <ul>
          <li>最初にポップした値を変数bに格納</li>
          <li>次にポップした値を変数aに格納</li>
          <li>これにより、正しい順序で演算ができます</li>
        </ul>
        <p><strong>重要</strong>：ポップの順序に注意！後から取り出した値がaになります。</p>
      `,
      detailedExplanation: `
        <h4>なぜポップの順序が重要なのか</h4>
        <p>減算や除算など、演算の順序が結果に影響する場合、ポップの順序が重要です。</p>

        <h5>具体例：5 3 - を計算</h5>
        <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 8px;">ステップ</th>
            <th style="border: 1px solid #ddd; padding: 8px;">操作</th>
            <th style="border: 1px solid #ddd; padding: 8px;">スタックの状態</th>
            <th style="border: 1px solid #ddd; padding: 8px;">変数</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">1</td>
            <td style="border: 1px solid #ddd; padding: 8px;">5 をプッシュ</td>
            <td style="border: 1px solid #ddd; padding: 8px;">[5]</td>
            <td style="border: 1px solid #ddd; padding: 8px;">-</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">2</td>
            <td style="border: 1px solid #ddd; padding: 8px;">3 をプッシュ</td>
            <td style="border: 1px solid #ddd; padding: 8px;">[5, 3]</td>
            <td style="border: 1px solid #ddd; padding: 8px;">-</td>
          </tr>
          <tr style="background-color: #fffacd;">
            <td style="border: 1px solid #ddd; padding: 8px;">3</td>
            <td style="border: 1px solid #ddd; padding: 8px;">"-" を処理：1回目のポップ</td>
            <td style="border: 1px solid #ddd; padding: 8px;">[5]</td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>b = 3</strong></td>
          </tr>
          <tr style="background-color: #fffacd;">
            <td style="border: 1px solid #ddd; padding: 8px;">4</td>
            <td style="border: 1px solid #ddd; padding: 8px;">2回目のポップ</td>
            <td style="border: 1px solid #ddd; padding: 8px;">[]</td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>a = 5</strong></td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">5</td>
            <td style="border: 1px solid #ddd; padding: 8px;">計算：a - b = 5 - 3</td>
            <td style="border: 1px solid #ddd; padding: 8px;">[]</td>
            <td style="border: 1px solid #ddd; padding: 8px;">result = 2</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">6</td>
            <td style="border: 1px solid #ddd; padding: 8px;">結果をプッシュ</td>
            <td style="border: 1px solid #ddd; padding: 8px;">[2]</td>
            <td style="border: 1px solid #ddd; padding: 8px;">-</td>
          </tr>
        </table>

        <h4>スタックの LIFO 原則</h4>
        <p>スタックは「Last In, First Out」（後入れ先出し）のデータ構造です。</p>
        <ul>
          <li>最後に入れたデータが最初に取り出される</li>
          <li>本の積み重ねや、皿の重ねと同じイメージ</li>
          <li>プッシュとポップは常にスタックの「上（top）」で行われる</li>
        </ul>
      `
    },
    {
      id: 'q2',
      questionNumber: '設問2',
      text: `
        <p>プログラム中の空欄 <strong>ｂ</strong> に入る適切な式を選択してください。</p>
        <p>減算の場合、正しい順序で計算する必要があります。</p>
      `,
      type: 'fill-in-blank',
      fillInBlanks: [
        {
          id: 'b',
          label: 'ｂ',
          options: [
            { id: 'opt1', text: 'a - b' },
            { id: 'opt2', text: 'b - a' },
            { id: 'opt3', text: 'a + b' },
            { id: 'opt4', text: 'b + a' },
            { id: 'opt5', text: '-(a + b)' },
          ],
          correctAnswer: 'opt1'
        }
      ],
      explanation: `
        <p><strong>正解：a - b</strong></p>
        <p>変数aとbに格納された値の意味を理解しましょう：</p>
        <ul>
          <li><strong>b</strong>：最初にポップした値（スタックの最上位だった）</li>
          <li><strong>a</strong>：2回目にポップした値（スタックの2番目だった）</li>
        </ul>
        <p>逆ポーランド記法 <code>5 3 -</code> は <code>5 - 3</code> を意味するため、<code>a - b</code> が正解です。</p>
      `,
      detailedExplanation: `
        <h4>なぜ a - b なのか</h4>
        <p>逆ポーランド記法では、演算子の前に2つの被演算数が来ます。</p>

        <h5>通常の記法と逆ポーランド記法の対応</h5>
        <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 8px;">通常の記法</th>
            <th style="border: 1px solid #ddd; padding: 8px;">逆ポーランド記法</th>
            <th style="border: 1px solid #ddd; padding: 8px;">スタックでの処理</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">5 - 3</td>
            <td style="border: 1px solid #ddd; padding: 8px;">5 3 -</td>
            <td style="border: 1px solid #ddd; padding: 8px;">プッシュ5 → プッシュ3 → ポップb=3, ポップa=5 → a-b</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">10 / 2</td>
            <td style="border: 1px solid #ddd; padding: 8px;">10 2 /</td>
            <td style="border: 1px solid #ddd; padding: 8px;">プッシュ10 → プッシュ2 → ポップb=2, ポップa=10 → a/b</td>
          </tr>
        </table>

        <h4>間違えやすいポイント</h4>
        <p><code>b - a</code> としてしまうと：</p>
        <ul>
          <li><code>5 3 -</code> が <code>3 - 5 = -2</code> になってしまう（誤り）</li>
          <li>正しくは <code>5 - 3 = 2</code></li>
        </ul>

        <h4>演算子による違い</h4>
        <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 8px;">演算子</th>
            <th style="border: 1px solid #ddd; padding: 8px;">交換法則</th>
            <th style="border: 1px solid #ddd; padding: 8px;">順序の重要性</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">+ (加算)</td>
            <td style="border: 1px solid #ddd; padding: 8px;">あり（a+b = b+a）</td>
            <td style="border: 1px solid #ddd; padding: 8px;">低い</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">* (乗算)</td>
            <td style="border: 1px solid #ddd; padding: 8px;">あり（a*b = b*a）</td>
            <td style="border: 1px solid #ddd; padding: 8px;">低い</td>
          </tr>
          <tr style="background-color: #fffacd;">
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>- (減算)</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>なし（a-b ≠ b-a）</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>高い</strong></td>
          </tr>
          <tr style="background-color: #fffacd;">
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>/ (除算)</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>なし（a/b ≠ b/a）</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>高い</strong></td>
          </tr>
        </table>
      `
    },
    {
      id: 'q3',
      questionNumber: '設問3',
      text: `
        <p>逆ポーランド記法の式 <code>8 5 2 - * 3 +</code> を計算したとき、結果はいくつになるか。</p>
      `,
      type: 'multiple-choice',
      choices: [
        { id: 'choice1', text: '21' },
        { id: 'choice2', text: '24' },
        { id: 'choice3', text: '27' },
        { id: 'choice4', text: '30' },
      ],
      correctAnswer: 'choice3',
      explanation: `
        <p><strong>正解：27</strong></p>
        <p>計算手順：</p>
        <ol>
          <li>8, 5, 2 をスタックにプッシュ：[8, 5, 2]</li>
          <li>"-" → 2と5をポップ、5-2=3、3をプッシュ：[8, 3]</li>
          <li>"*" → 3と8をポップ、8*3=24、24をプッシュ：[24]</li>
          <li>3 をプッシュ：[24, 3]</li>
          <li>"+" → 3と24をポップ、24+3=27、27をプッシュ：[27]</li>
          <li>結果：27</li>
        </ol>
        <p>通常の記法では：<code>8 * (5 - 2) + 3 = 8 * 3 + 3 = 24 + 3 = 27</code></p>
      `,
      detailedExplanation: `
        <h4>完全トレース</h4>
        <p>式：<code>8 5 2 - * 3 +</code></p>

        <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 8px;">ステップ</th>
            <th style="border: 1px solid #ddd; padding: 8px;">読んだトークン</th>
            <th style="border: 1px solid #ddd; padding: 8px;">操作</th>
            <th style="border: 1px solid #ddd; padding: 8px;">スタックの状態</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">1</td>
            <td style="border: 1px solid #ddd; padding: 8px;">8</td>
            <td style="border: 1px solid #ddd; padding: 8px;">プッシュ 8</td>
            <td style="border: 1px solid #ddd; padding: 8px;">[8]</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">2</td>
            <td style="border: 1px solid #ddd; padding: 8px;">5</td>
            <td style="border: 1px solid #ddd; padding: 8px;">プッシュ 5</td>
            <td style="border: 1px solid #ddd; padding: 8px;">[8, 5]</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">3</td>
            <td style="border: 1px solid #ddd; padding: 8px;">2</td>
            <td style="border: 1px solid #ddd; padding: 8px;">プッシュ 2</td>
            <td style="border: 1px solid #ddd; padding: 8px;">[8, 5, 2]</td>
          </tr>
          <tr style="background-color: #fffacd;">
            <td style="border: 1px solid #ddd; padding: 8px;">4</td>
            <td style="border: 1px solid #ddd; padding: 8px;">-</td>
            <td style="border: 1px solid #ddd; padding: 8px;">ポップ b=2, a=5<br>計算 5-2=3<br>プッシュ 3</td>
            <td style="border: 1px solid #ddd; padding: 8px;">[8, 3]</td>
          </tr>
          <tr style="background-color: #fffacd;">
            <td style="border: 1px solid #ddd; padding: 8px;">5</td>
            <td style="border: 1px solid #ddd; padding: 8px;">*</td>
            <td style="border: 1px solid #ddd; padding: 8px;">ポップ b=3, a=8<br>計算 8*3=24<br>プッシュ 24</td>
            <td style="border: 1px solid #ddd; padding: 8px;">[24]</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">6</td>
            <td style="border: 1px solid #ddd; padding: 8px;">3</td>
            <td style="border: 1px solid #ddd; padding: 8px;">プッシュ 3</td>
            <td style="border: 1px solid #ddd; padding: 8px;">[24, 3]</td>
          </tr>
          <tr style="background-color: #fffacd;">
            <td style="border: 1px solid #ddd; padding: 8px;">7</td>
            <td style="border: 1px solid #ddd; padding: 8px;">+</td>
            <td style="border: 1px solid #ddd; padding: 8px;">ポップ b=3, a=24<br>計算 24+3=27<br>プッシュ 27</td>
            <td style="border: 1px solid #ddd; padding: 8px;">[27]</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">8</td>
            <td style="border: 1px solid #ddd; padding: 8px;">-</td>
            <td style="border: 1px solid #ddd; padding: 8px;">終了</td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>結果: 27</strong></td>
          </tr>
        </table>

        <h4>逆ポーランド記法の利点</h4>
        <ul>
          <li><strong>括弧が不要</strong>：演算の優先順位が自然に表現される</li>
          <li><strong>計算が簡単</strong>：スタックを使えば機械的に計算できる</li>
          <li><strong>処理が高速</strong>：パースが簡単で、実装も単純</li>
        </ul>

        <h4>実用例</h4>
        <ul>
          <li>電卓（HP社の関数電卓など）</li>
          <li>プログラミング言語の中間表現（コンパイラ内部）</li>
          <li>PostScriptやForthなどのプログラミング言語</li>
        </ul>
      `
    }
  ],

  overallExplanation: `
    <h3>スタックと逆ポーランド記法</h3>
    <p>この問題では、スタックというデータ構造と、その応用例である逆ポーランド記法の計算を学びました。</p>

    <h4>スタックの特徴</h4>
    <ul>
      <li><strong>LIFO（Last In First Out）</strong>：後入れ先出し</li>
      <li><strong>基本操作</strong>：プッシュ（追加）とポップ（取り出し）</li>
      <li><strong>時間計算量</strong>：プッシュもポップもO(1)で高速</li>
    </ul>

    <h4>スタックの実用例</h4>
    <ul>
      <li><strong>関数呼び出し</strong>：コールスタック（関数の戻り先を管理）</li>
      <li><strong>Undo機能</strong>：操作履歴の管理</li>
      <li><strong>括弧の対応チェック</strong>：プログラムの構文解析</li>
      <li><strong>ブラウザの戻るボタン</strong>：ページ履歴の管理</li>
      <li><strong>式の評価</strong>：逆ポーランド記法の計算</li>
    </ul>

    <h4>逆ポーランド記法（RPN）</h4>
    <p>演算子を被演算数の後ろに記述する記法で、以下の特徴があります：</p>
    <ul>
      <li>括弧が不要</li>
      <li>演算の優先順位が明確</li>
      <li>コンピュータでの処理が簡単</li>
    </ul>

    <h4>通常の記法からRPNへの変換例</h4>
    <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
      <tr style="background-color: #f0f0f0;">
        <th style="border: 1px solid #ddd; padding: 8px;">通常の記法（中置記法）</th>
        <th style="border: 1px solid #ddd; padding: 8px;">逆ポーランド記法（後置記法）</th>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">3 + 4</td>
        <td style="border: 1px solid #ddd; padding: 8px;">3 4 +</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">(3 + 4) * 5</td>
        <td style="border: 1px solid #ddd; padding: 8px;">3 4 + 5 *</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">3 * (4 + 5)</td>
        <td style="border: 1px solid #ddd; padding: 8px;">3 4 5 + *</td>
      </tr>
    </table>
  `,

  learningPoints: [
    'スタックのLIFO（後入れ先出し）の原理',
    'プッシュとポップの基本操作',
    '逆ポーランド記法の読み方と計算方法',
    'スタックを使ったアルゴリズムの実装',
    '演算子の順序と交換法則の理解',
    'スタックの実用例（関数呼び出し、Undoなど）',
  ],

  keywords: [
    'スタック',
    'LIFO',
    '後入れ先出し',
    'プッシュ',
    'ポップ',
    '逆ポーランド記法',
    'RPN',
    '後置記法',
    'データ構造',
  ],
};
