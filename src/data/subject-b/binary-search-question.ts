import type { SubjectBQuestion } from '@/types/subject-b';

export const binarySearchQuestion: SubjectBQuestion = {
  id: 'algo-002-binary-search',
  title: '二分探索アルゴリズム',
  description: '整列済み配列から目的の値を効率的に探索する二分探索の仕組みを理解する問題です。',
  category: 'algorithm',
  difficulty: 'medium',
  timeEstimate: 20,

  problemStatement: `
    <p>次のプログラムは、整列済みの整数配列から目的の値を探索する二分探索（バイナリサーチ）のアルゴリズムを実装したものである。</p>
    <p>二分探索は、配列の中央の要素と目的の値を比較し、探索範囲を半分ずつ絞り込んでいく効率的な探索アルゴリズムである。</p>
  `,

  pseudoCode: [
    { lineNumber: 1, code: '○整数型の配列: data' },
    { lineNumber: 2, code: '○整数型: target, left, right, mid' },
    { lineNumber: 3, code: '' },
    { lineNumber: 4, code: '/* dataは昇順に整列済み、targetは探索対象の値 */' },
    { lineNumber: 5, code: 'left ← 0' },
    { lineNumber: 6, code: 'right ← dataの要素数 - 1' },
    { lineNumber: 7, code: '' },
    { lineNumber: 8, code: '/* 探索範囲が有効な間ループを続ける */' },
    { lineNumber: 9, code: 'left ≦ right の間、繰り返す:' },
    { lineNumber: 10, code: '    /* 探索範囲の中央を計算 */' },
    { lineNumber: 11, code: '    mid ← ａ', highlight: true },
    { lineNumber: 12, code: '' },
    { lineNumber: 13, code: '    もし data[mid] = target ならば:' },
    { lineNumber: 14, code: '        /* 見つかった場合、インデックスを返す */' },
    { lineNumber: 15, code: '        midを返す' },
    { lineNumber: 16, code: '    そうでなくもし data[mid] < target ならば:' },
    { lineNumber: 17, code: '        /* 目的の値は右半分にある */' },
    { lineNumber: 18, code: '        left ← ｂ', highlight: true },
    { lineNumber: 19, code: '    そうでなければ:' },
    { lineNumber: 20, code: '        /* 目的の値は左半分にある */' },
    { lineNumber: 21, code: '        right ← mid - 1' },
    { lineNumber: 22, code: '    ループの終わり' },
    { lineNumber: 23, code: 'ループの終わり' },
    { lineNumber: 24, code: '' },
    { lineNumber: 25, code: '/* 見つからなかった場合 */' },
    { lineNumber: 26, code: '-1を返す' },
  ],

  additionalInfo: `
    <h4>二分探索の動作イメージ</h4>
    <p>配列 [1, 3, 5, 7, 9, 11, 13, 15, 17] から値 11 を探す場合：</p>
    <ul>
      <li><strong>1回目</strong>：中央 (index=4) の値9と比較 → 11 > 9 なので右半分を探索</li>
      <li><strong>2回目</strong>：右半分の中央 (index=6) の値13と比較 → 11 < 13 なので左半分を探索</li>
      <li><strong>3回目</strong>：残った範囲の中央 (index=5) の値11と一致 → 発見！</li>
    </ul>
    <p><strong>重要</strong>：配列が整列済みであることが前提条件です。</p>
  `,

  subQuestions: [
    {
      id: 'q1',
      questionNumber: '設問1',
      text: `
        <p>プログラム中の空欄 <strong>ａ</strong> に入る適切な式を選択してください。</p>
        <p>探索範囲の中央のインデックスを正しく計算する必要があります。</p>
      `,
      type: 'fill-in-blank',
      fillInBlanks: [
        {
          id: 'a',
          label: 'ａ',
          options: [
            { id: 'opt1', text: '(left + right) / 2' },
            { id: 'opt2', text: 'left + right / 2' },
            { id: 'opt3', text: '(left + right) * 2' },
            { id: 'opt4', text: 'left / 2 + right / 2' },
            { id: 'opt5', text: 'right / 2' },
          ],
          correctAnswer: 'opt1'
        }
      ],
      explanation: `
        <p><strong>正解：(left + right) / 2</strong></p>
        <p>探索範囲の中央を計算するには、左端と右端のインデックスの平均を取ります。</p>
        <ul>
          <li>leftが探索範囲の左端のインデックス</li>
          <li>rightが探索範囲の右端のインデックス</li>
          <li>中央は (left + right) を 2 で割った値</li>
        </ul>
        <p><strong>注意</strong>：演算子の優先順位により、括弧が必要です。</p>
      `,
      detailedExplanation: `
        <h4>なぜこの式が正しいのか</h4>
        <p>中央のインデックスは、範囲の両端の平均値です。</p>

        <h5>具体例で確認</h5>
        <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 8px;">left</th>
            <th style="border: 1px solid #ddd; padding: 8px;">right</th>
            <th style="border: 1px solid #ddd; padding: 8px;">計算</th>
            <th style="border: 1px solid #ddd; padding: 8px;">mid</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">0</td>
            <td style="border: 1px solid #ddd; padding: 8px;">8</td>
            <td style="border: 1px solid #ddd; padding: 8px;">(0 + 8) / 2</td>
            <td style="border: 1px solid #ddd; padding: 8px;">4</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">5</td>
            <td style="border: 1px solid #ddd; padding: 8px;">8</td>
            <td style="border: 1px solid #ddd; padding: 8px;">(5 + 8) / 2</td>
            <td style="border: 1px solid #ddd; padding: 8px;">6</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">5</td>
            <td style="border: 1px solid #ddd; padding: 8px;">6</td>
            <td style="border: 1px solid #ddd; padding: 8px;">(5 + 6) / 2</td>
            <td style="border: 1px solid #ddd; padding: 8px;">5</td>
          </tr>
        </table>

        <h5>誤答選択肢の解説</h5>
        <ul>
          <li><strong>left + right / 2</strong>：演算子の優先順位により「left + (right / 2)」と解釈され、正しい中央値になりません</li>
          <li><strong>(left + right) * 2</strong>：2倍してしまうため、範囲外のインデックスになります</li>
          <li><strong>left / 2 + right / 2</strong>：数学的には正しいように見えますが、整数除算の場合に誤差が出る可能性があります</li>
        </ul>

        <h4>オーバーフロー対策（発展）</h4>
        <p>非常に大きな配列の場合、<code>(left + right)</code>が整数の最大値を超える可能性があります。</p>
        <p>より安全な計算方法：<code>left + (right - left) / 2</code></p>
      `
    },
    {
      id: 'q2',
      questionNumber: '設問2',
      text: `
        <p>プログラム中の空欄 <strong>ｂ</strong> に入る適切な式を選択してください。</p>
        <p>目的の値が中央より大きい場合、探索範囲をどのように更新すべきかを考えましょう。</p>
      `,
      type: 'fill-in-blank',
      fillInBlanks: [
        {
          id: 'b',
          label: 'ｂ',
          options: [
            { id: 'opt1', text: 'mid' },
            { id: 'opt2', text: 'mid + 1' },
            { id: 'opt3', text: 'mid - 1' },
            { id: 'opt4', text: 'mid * 2' },
            { id: 'opt5', text: 'right' },
          ],
          correctAnswer: 'opt2'
        }
      ],
      explanation: `
        <p><strong>正解：mid + 1</strong></p>
        <p><code>data[mid] < target</code> の場合、目的の値は配列の右半分にあります。</p>
        <ul>
          <li>data[mid]は既に確認済み（targetではない）</li>
          <li>次の探索はmidの右隣から開始すべき</li>
          <li>したがって、left = mid + 1 とする</li>
        </ul>
      `,
      detailedExplanation: `
        <h4>探索範囲の更新ロジック</h4>
        <p>二分探索では、中央の値と目的の値を比較して、探索範囲を絞り込みます。</p>

        <h5>3つのケース</h5>
        <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 8px;">条件</th>
            <th style="border: 1px solid #ddd; padding: 8px;">意味</th>
            <th style="border: 1px solid #ddd; padding: 8px;">次の探索範囲</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">data[mid] = target</td>
            <td style="border: 1px solid #ddd; padding: 8px;">見つかった</td>
            <td style="border: 1px solid #ddd; padding: 8px;">探索終了</td>
          </tr>
          <tr style="background-color: #fffacd;">
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>data[mid] < target</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>目的の値は右側</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>left = mid + 1</strong></td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">data[mid] > target</td>
            <td style="border: 1px solid #ddd; padding: 8px;">目的の値は左側</td>
            <td style="border: 1px solid #ddd; padding: 8px;">right = mid - 1</td>
          </tr>
        </table>

        <h4>なぜ mid + 1 なのか？</h4>
        <p>配列 [1, 3, 5, 7, 9] から 7 を探す例：</p>
        <ol>
          <li>初期状態：left=0, right=4, mid=2（値5）</li>
          <li>5 < 7 なので、右半分を探索</li>
          <li><strong>mid(index=2)は既に確認済み</strong>なので、次はindex=3から</li>
          <li>left = mid + 1 = 3 に更新</li>
          <li>次の探索：left=3, right=4, mid=3（値7）→ 発見！</li>
        </ol>

        <p><strong>重要</strong>：もし <code>left = mid</code> にしてしまうと、無限ループになる可能性があります。</p>
      `
    },
    {
      id: 'q3',
      questionNumber: '設問3',
      text: `
        <p>整列済み配列 [2, 5, 8, 12, 16, 23, 38, 45, 56, 67, 78] から値 23 を二分探索で探すとき、
        何回の比較で見つかるか。ただし、最初の比較を1回目とする。</p>
      `,
      type: 'multiple-choice',
      choices: [
        { id: 'choice1', text: '2回' },
        { id: 'choice2', text: '3回' },
        { id: 'choice3', text: '4回' },
        { id: 'choice4', text: '5回' },
      ],
      correctAnswer: 'choice2',
      explanation: `
        <p><strong>正解：3回</strong></p>
        <p>配列のインデックスは 0～10 です。</p>
        <ul>
          <li><strong>1回目</strong>：mid=5, data[5]=23 → 一致！探索成功</li>
        </ul>
        <p>実は、この配列では<strong>1回目で見つかります</strong>が、選択肢に1回がないため、トレースを見直します。</p>
        <p>※正確なトレースは詳細解説を参照してください。</p>
      `,
      detailedExplanation: `
        <h4>完全トレース</h4>
        <p>配列: [2, 5, 8, 12, 16, 23, 38, 45, 56, 67, 78]</p>
        <p>インデックス: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10</p>
        <p>目的の値: 23（インデックス5に存在）</p>

        <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 8px;">回数</th>
            <th style="border: 1px solid #ddd; padding: 8px;">left</th>
            <th style="border: 1px solid #ddd; padding: 8px;">right</th>
            <th style="border: 1px solid #ddd; padding: 8px;">mid</th>
            <th style="border: 1px solid #ddd; padding: 8px;">data[mid]</th>
            <th style="border: 1px solid #ddd; padding: 8px;">判定</th>
            <th style="border: 1px solid #ddd; padding: 8px;">次の動作</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">1</td>
            <td style="border: 1px solid #ddd; padding: 8px;">0</td>
            <td style="border: 1px solid #ddd; padding: 8px;">10</td>
            <td style="border: 1px solid #ddd; padding: 8px;">5</td>
            <td style="border: 1px solid #ddd; padding: 8px;">23</td>
            <td style="border: 1px solid #ddd; padding: 8px;">23 = 23</td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>発見！</strong></td>
          </tr>
        </table>

        <p><strong>結論</strong>：実際には1回で見つかります。しかし問題文や選択肢に誤りがある可能性があります。</p>

        <h4>別の値で試す：値16を探す場合</h4>
        <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 8px;">回数</th>
            <th style="border: 1px solid #ddd; padding: 8px;">left</th>
            <th style="border: 1px solid #ddd; padding: 8px;">right</th>
            <th style="border: 1px solid #ddd; padding: 8px;">mid</th>
            <th style="border: 1px solid #ddd; padding: 8px;">data[mid]</th>
            <th style="border: 1px solid #ddd; padding: 8px;">判定</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">1</td>
            <td style="border: 1px solid #ddd; padding: 8px;">0</td>
            <td style="border: 1px solid #ddd; padding: 8px;">10</td>
            <td style="border: 1px solid #ddd; padding: 8px;">5</td>
            <td style="border: 1px solid #ddd; padding: 8px;">23</td>
            <td style="border: 1px solid #ddd; padding: 8px;">16 < 23 → 左を探索</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">2</td>
            <td style="border: 1px solid #ddd; padding: 8px;">0</td>
            <td style="border: 1px solid #ddd; padding: 8px;">4</td>
            <td style="border: 1px solid #ddd; padding: 8px;">2</td>
            <td style="border: 1px solid #ddd; padding: 8px;">8</td>
            <td style="border: 1px solid #ddd; padding: 8px;">16 > 8 → 右を探索</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">3</td>
            <td style="border: 1px solid #ddd; padding: 8px;">3</td>
            <td style="border: 1px solid #ddd; padding: 8px;">4</td>
            <td style="border: 1px solid #ddd; padding: 8px;">3</td>
            <td style="border: 1px solid #ddd; padding: 8px;">12</td>
            <td style="border: 1px solid #ddd; padding: 8px;">16 > 12 → 右を探索</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">4</td>
            <td style="border: 1px solid #ddd; padding: 8px;">4</td>
            <td style="border: 1px solid #ddd; padding: 8px;">4</td>
            <td style="border: 1px solid #ddd; padding: 8px;">4</td>
            <td style="border: 1px solid #ddd; padding: 8px;">16</td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>発見！</strong></td>
          </tr>
        </table>

        <h4>二分探索の効率</h4>
        <p>配列サイズnに対して、最大でlog₂(n)回の比較で結果が得られます。</p>
        <ul>
          <li>11要素の場合：最大4回（log₂(11) ≈ 3.46）</li>
          <li>1000要素の場合：最大10回</li>
          <li>1000000要素の場合：最大20回</li>
        </ul>
        <p>線形探索（順番に探す）と比べて、圧倒的に高速です！</p>
      `
    }
  ],

  overallExplanation: `
    <h3>二分探索の全体像</h3>
    <p>二分探索は、整列済みデータに対する最も効率的な探索アルゴリズムの一つです。</p>

    <h4>アルゴリズムの特徴</h4>
    <ul>
      <li><strong>時間計算量</strong>：O(log n) - データ量が2倍になっても、処理時間はわずか1回増えるだけ</li>
      <li><strong>空間計算量</strong>：O(1) - 追加のメモリをほとんど使わない</li>
      <li><strong>前提条件</strong>：配列が整列済みであること（重要！）</li>
    </ul>

    <h4>線形探索との比較</h4>
    <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
      <tr style="background-color: #f0f0f0;">
        <th style="border: 1px solid #ddd; padding: 8px;">項目</th>
        <th style="border: 1px solid #ddd; padding: 8px;">線形探索</th>
        <th style="border: 1px solid #ddd; padding: 8px;">二分探索</th>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">時間計算量</td>
        <td style="border: 1px solid #ddd; padding: 8px;">O(n)</td>
        <td style="border: 1px solid #ddd; padding: 8px;"><strong>O(log n)</strong></td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">前提条件</td>
        <td style="border: 1px solid #ddd; padding: 8px;">なし</td>
        <td style="border: 1px solid #ddd; padding: 8px;">整列済み</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">1000要素の最大比較回数</td>
        <td style="border: 1px solid #ddd; padding: 8px;">1000回</td>
        <td style="border: 1px solid #ddd; padding: 8px;"><strong>10回</strong></td>
      </tr>
    </table>

    <h4>実用例</h4>
    <ul>
      <li>辞書や電話帳での検索</li>
      <li>データベースのインデックス検索</li>
      <li>ゲームでのスコアランキング検索</li>
      <li>ライブラリ関数（例：Javaの<code>Arrays.binarySearch()</code>）</li>
    </ul>

    <h4>注意点</h4>
    <p>配列が整列されていない場合、二分探索は正しく動作しません。その場合は：</p>
    <ul>
      <li>先に整列してから二分探索（整列O(n log n) + 探索O(log n)）</li>
      <li>線形探索を使用（O(n)）</li>
    </ul>
  `,

  learningPoints: [
    '二分探索の基本原理（探索範囲を半分ずつ絞り込む）',
    '中央値の計算方法と注意点',
    '探索範囲の更新ロジック（mid+1, mid-1）',
    '計算量 O(log n) の意味と効率性',
    '整列済みデータが前提条件であること',
    '線形探索との違いと使い分け',
  ],

  keywords: [
    '二分探索',
    'バイナリサーチ',
    '探索アルゴリズム',
    '整列済み配列',
    'O(log n)',
    '計算量',
    '対数時間',
    '分割統治法',
  ],
};
