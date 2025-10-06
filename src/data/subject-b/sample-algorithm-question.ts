import type { SubjectBQuestion } from '@/types/subject-b';

export const sampleAlgorithmQuestion: SubjectBQuestion = {
  id: 'algo-001-bubble-sort',
  title: '配列の整列アルゴリズム',
  description: 'バブルソートのアルゴリズムを理解し、プログラムの空欄を埋める問題です。',
  category: 'algorithm',
  difficulty: 'medium',
  timeEstimate: 15,

  problemStatement: `
    <p>次のプログラムは、整数の配列を昇順に整列するバブルソートのアルゴリズムを実装したものである。</p>
    <p>バブルソートは、隣接する要素を比較し、順序が逆であれば交換する操作を繰り返すことで、配列全体を整列させるアルゴリズムである。</p>
  `,

  pseudoCode: [
    { lineNumber: 1, code: '○整数型の配列: data' },
    { lineNumber: 2, code: '○整数型: n, i, j, temp' },
    { lineNumber: 3, code: '' },
    { lineNumber: 4, code: '/* dataは整列対象の配列、nは配列の要素数 */' },
    { lineNumber: 5, code: 'n ← dataの要素数' },
    { lineNumber: 6, code: '' },
    { lineNumber: 7, code: '/* 外側のループ：未整列部分を1要素ずつ減らす */' },
    { lineNumber: 8, code: 'i を 0 から n - 2 まで 1 ずつ増やしながら繰り返す:' },
    { lineNumber: 9, code: '    /* 内側のループ：隣接要素を比較して交換 */' },
    { lineNumber: 10, code: '    j を 0 から ａ まで 1 ずつ増やしながら繰り返す:', highlight: true },
    { lineNumber: 11, code: '        もし data[j] ＞ data[j + 1] ならば:' },
    { lineNumber: 12, code: '            /* 要素を交換 */' },
    { lineNumber: 13, code: '            temp ← data[j]' },
    { lineNumber: 14, code: '            data[j] ← ｂ', highlight: true },
    { lineNumber: 15, code: '            data[j + 1] ← temp' },
    { lineNumber: 16, code: '        ループの終わり' },
    { lineNumber: 17, code: '    ループの終わり' },
    { lineNumber: 18, code: 'ループの終わり' },
  ],

  additionalInfo: `
    <h4>バブルソートの動作例</h4>
    <p>配列 [5, 2, 4, 1, 3] を整列する場合：</p>
    <ul>
      <li><strong>1回目の外側ループ（i=0）</strong>：最大値5が最後尾に移動</li>
      <li><strong>2回目の外側ループ（i=1）</strong>：次に大きい4が後ろから2番目に移動</li>
      <li>これを繰り返し、最終的に [1, 2, 3, 4, 5] に整列される</li>
    </ul>
    <p><strong>ポイント</strong>：各パスで最大値が「浮き上がる（bubble up）」ように最後尾に移動することから、「バブルソート」と呼ばれます。</p>
  `,

  subQuestions: [
    {
      id: 'q1',
      questionNumber: '設問1',
      text: `
        <p>プログラム中の空欄 <strong>ａ</strong> に入る適切な式を選択してください。</p>
        <p>内側のループでは、隣接する要素を比較していくため、配列の範囲を超えないように上限を設定する必要があります。</p>
      `,
      type: 'fill-in-blank',
      fillInBlanks: [
        {
          id: 'a',
          label: 'ａ',
          options: [
            { id: 'opt1', text: 'n - 1' },
            { id: 'opt2', text: 'n - 2' },
            { id: 'opt3', text: 'n - i - 1' },
            { id: 'opt4', text: 'n - i - 2' },
            { id: 'opt5', text: 'i' },
          ],
          correctAnswer: 'opt3'
        }
      ],
      explanation: `
        <p><strong>正解：n - i - 1</strong></p>
        <p>内側のループ（j）では、data[j]とdata[j+1]を比較するため、jはdata[j+1]が配列の範囲内に収まる必要があります。</p>
        <ul>
          <li>配列の最後の要素のインデックスは <code>n - 1</code></li>
          <li>data[j+1]にアクセスするため、jの最大値は <code>n - 2</code></li>
          <li>ただし、外側のループ（i）が進むにつれて、配列の後ろ側はすでに整列済み</li>
          <li>iパス目では、後ろからi個の要素は整列済みなので、比較不要</li>
          <li>したがって、jの上限は <code>n - i - 2</code> でよい（<code>n - i - 1</code>まで繰り返すと、jは0からn-i-2になる）</li>
        </ul>
      `,
      detailedExplanation: `
        <h4>詳しい解説</h4>
        <p><strong>なぜ n - i - 1 なのか？</strong></p>
        <ol>
          <li><strong>基本の範囲</strong>：data[j]とdata[j+1]を比較するため、jは0からn-2まで</li>
          <li><strong>最適化</strong>：iパス目が終わると、最後のi個の要素は正しい位置にある</li>
          <li><strong>計算</strong>：
            <ul>
              <li>i=0のとき：j は 0 から n-1-1 = n-2 まで（全体を比較）</li>
              <li>i=1のとき：j は 0 から n-2-1 = n-3 まで（最後の1つは整列済み）</li>
              <li>i=2のとき：j は 0 から n-3-1 = n-4 まで（最後の2つは整列済み）</li>
            </ul>
          </li>
        </ol>

        <h4>トレース例（n=5の場合）</h4>
        <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 8px;">i</th>
            <th style="border: 1px solid #ddd; padding: 8px;">jの範囲</th>
            <th style="border: 1px solid #ddd; padding: 8px;">理由</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">0</td>
            <td style="border: 1px solid #ddd; padding: 8px;">0 ～ 3</td>
            <td style="border: 1px solid #ddd; padding: 8px;">5-0-1=4、0から3まで繰り返す</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">1</td>
            <td style="border: 1px solid #ddd; padding: 8px;">0 ～ 2</td>
            <td style="border: 1px solid #ddd; padding: 8px;">5-1-1=3、0から2まで繰り返す</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">2</td>
            <td style="border: 1px solid #ddd; padding: 8px;">0 ～ 1</td>
            <td style="border: 1px solid #ddd; padding: 8px;">5-2-1=2、0から1まで繰り返す</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">3</td>
            <td style="border: 1px solid #ddd; padding: 8px;">0 ～ 0</td>
            <td style="border: 1px solid #ddd; padding: 8px;">5-3-1=1、0から0まで繰り返す</td>
          </tr>
        </table>
      `
    },
    {
      id: 'q2',
      questionNumber: '設問2',
      text: `
        <p>プログラム中の空欄 <strong>ｂ</strong> に入る適切な式を選択してください。</p>
        <p>この部分は、2つの要素を交換する処理です。tempを使った交換の基本パターンを思い出しましょう。</p>
      `,
      type: 'fill-in-blank',
      fillInBlanks: [
        {
          id: 'b',
          label: 'ｂ',
          options: [
            { id: 'opt1', text: 'data[j]' },
            { id: 'opt2', text: 'data[j + 1]' },
            { id: 'opt3', text: 'temp' },
            { id: 'opt4', text: 'data[i]' },
            { id: 'opt5', text: 'data[i + 1]' },
          ],
          correctAnswer: 'opt2'
        }
      ],
      explanation: `
        <p><strong>正解：data[j + 1]</strong></p>
        <p>この部分は、data[j]とdata[j+1]を交換する処理です。</p>
        <p><strong>交換の手順</strong>：</p>
        <ol>
          <li>temp ← data[j]（data[j]の値を一時保存）</li>
          <li>data[j] ← data[j + 1]（data[j+1]の値をdata[j]にコピー）</li>
          <li>data[j + 1] ← temp（保存しておいたdata[j]の値をdata[j+1]に代入）</li>
        </ol>
        <p>この3ステップで、2つの要素の値が入れ替わります。</p>
      `,
      detailedExplanation: `
        <h4>2つの変数を交換する基本パターン</h4>
        <p>プログラミングで2つの変数AとBを交換するには、必ず「一時変数」が必要です。</p>

        <div style="background-color: #f9f9f9; padding: 15px; margin: 10px 0; border-left: 4px solid #8E9C78;">
          <h5>間違った交換方法（一時変数なし）</h5>
          <pre style="background-color: #fff; padding: 10px; border-radius: 5px;">
A ← B  // Aの元の値が失われる！
B ← A  // この時点でAもBも同じ値になってしまう
          </pre>
        </div>

        <div style="background-color: #f9f9f9; padding: 15px; margin: 10px 0; border-left: 4px solid #8E9C78;">
          <h5>正しい交換方法（一時変数あり）</h5>
          <pre style="background-color: #fff; padding: 10px; border-radius: 5px;">
temp ← A  // Aの値を退避
A ← B     // BをAにコピー
B ← temp  // 退避したAの値をBに代入
          </pre>
        </div>

        <h4>具体例（data[2]=5, data[3]=2の場合）</h4>
        <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 8px;">ステップ</th>
            <th style="border: 1px solid #ddd; padding: 8px;">コード</th>
            <th style="border: 1px solid #ddd; padding: 8px;">data[2]</th>
            <th style="border: 1px solid #ddd; padding: 8px;">data[3]</th>
            <th style="border: 1px solid #ddd; padding: 8px;">temp</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">開始</td>
            <td style="border: 1px solid #ddd; padding: 8px;">-</td>
            <td style="border: 1px solid #ddd; padding: 8px;">5</td>
            <td style="border: 1px solid #ddd; padding: 8px;">2</td>
            <td style="border: 1px solid #ddd; padding: 8px;">-</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">1</td>
            <td style="border: 1px solid #ddd; padding: 8px;">temp ← data[j]</td>
            <td style="border: 1px solid #ddd; padding: 8px;">5</td>
            <td style="border: 1px solid #ddd; padding: 8px;">2</td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>5</strong></td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">2</td>
            <td style="border: 1px solid #ddd; padding: 8px;">data[j] ← data[j+1]</td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>2</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">2</td>
            <td style="border: 1px solid #ddd; padding: 8px;">5</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">3</td>
            <td style="border: 1px solid #ddd; padding: 8px;">data[j+1] ← temp</td>
            <td style="border: 1px solid #ddd; padding: 8px;">2</td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>5</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">5</td>
          </tr>
        </table>
        <p style="margin-top: 10px;"><strong>結果</strong>：data[2]とdata[3]が正しく交換されました！</p>
      `
    },
    {
      id: 'q3',
      questionNumber: '設問3',
      text: `
        <p>配列 [3, 1, 4, 2] に対してこのバブルソートを実行したとき、外側のループの1回目（i=0）が終了した時点での配列の状態はどれか。</p>
      `,
      type: 'multiple-choice',
      choices: [
        { id: 'choice1', text: '[1, 2, 3, 4]' },
        { id: 'choice2', text: '[1, 3, 2, 4]' },
        { id: 'choice3', text: '[1, 3, 4, 2]' },
        { id: 'choice4', text: '[3, 1, 2, 4]' },
      ],
      correctAnswer: 'choice2',
      explanation: `
        <p><strong>正解：[1, 3, 2, 4]</strong></p>
        <p>バブルソートの1パス目では、最大値が配列の最後に移動します。</p>
        <p><strong>実行トレース</strong>：</p>
        <ul>
          <li>初期状態：[3, 1, 4, 2]</li>
          <li>j=0: 3と1を比較 → 3>1なので交換 → [1, 3, 4, 2]</li>
          <li>j=1: 3と4を比較 → 3<4なので交換しない → [1, 3, 4, 2]</li>
          <li>j=2: 4と2を比較 → 4>2なので交換 → [1, 3, 2, 4]</li>
        </ul>
        <p>1パス目終了時：<strong>[1, 3, 2, 4]</strong>（最大値4が最後尾に確定）</p>
      `,
      detailedExplanation: `
        <h4>バブルソート1パス目の完全トレース</h4>
        <p>配列：[3, 1, 4, 2]、n=4、i=0のとき</p>

        <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 8px;">j</th>
            <th style="border: 1px solid #ddd; padding: 8px;">比較</th>
            <th style="border: 1px solid #ddd; padding: 8px;">判定</th>
            <th style="border: 1px solid #ddd; padding: 8px;">操作</th>
            <th style="border: 1px solid #ddd; padding: 8px;">配列の状態</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">-</td>
            <td style="border: 1px solid #ddd; padding: 8px;">-</td>
            <td style="border: 1px solid #ddd; padding: 8px;">-</td>
            <td style="border: 1px solid #ddd; padding: 8px;">開始</td>
            <td style="border: 1px solid #ddd; padding: 8px;">[3, 1, 4, 2]</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">0</td>
            <td style="border: 1px solid #ddd; padding: 8px;">data[0] vs data[1]</td>
            <td style="border: 1px solid #ddd; padding: 8px;">3 > 1</td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>交換する</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">[<strong>1, 3</strong>, 4, 2]</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">1</td>
            <td style="border: 1px solid #ddd; padding: 8px;">data[1] vs data[2]</td>
            <td style="border: 1px solid #ddd; padding: 8px;">3 < 4</td>
            <td style="border: 1px solid #ddd; padding: 8px;">交換しない</td>
            <td style="border: 1px solid #ddd; padding: 8px;">[1, 3, 4, 2]</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">2</td>
            <td style="border: 1px solid #ddd; padding: 8px;">data[2] vs data[3]</td>
            <td style="border: 1px solid #ddd; padding: 8px;">4 > 2</td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>交換する</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">[1, 3, <strong>2, 4</strong>]</td>
          </tr>
        </table>

        <p style="margin-top: 15px;"><strong>重要なポイント</strong>：</p>
        <ul>
          <li>jは0から2まで（n-i-1 = 4-0-1 = 3、つまり0から2まで）</li>
          <li>最大値の4が「泡のように浮き上がって」最後尾に到達</li>
          <li>1パス目だけでは完全には整列しない（さらに2パス、3パスが必要）</li>
        </ul>

        <h4>全パスの流れ（参考）</h4>
        <ul>
          <li>初期：[3, 1, 4, 2]</li>
          <li>1パス後（i=0）：[1, 3, 2, <span style="color: #8E9C78; font-weight: bold;">4</span>]</li>
          <li>2パス後（i=1）：[1, 2, <span style="color: #8E9C78; font-weight: bold;">3, 4</span>]</li>
          <li>3パス後（i=2）：[<span style="color: #8E9C78; font-weight: bold;">1, 2, 3, 4</span>] ← 整列完了</li>
        </ul>
      `
    }
  ],

  overallExplanation: `
    <h3>バブルソートの全体像</h3>
    <p>バブルソートは、最もシンプルな整列アルゴリズムの一つですが、その仕組みを理解することで、アルゴリズムの基本的な考え方を学ぶことができます。</p>

    <h4>アルゴリズムの特徴</h4>
    <ul>
      <li><strong>時間計算量</strong>：O(n²) - 要素数が2倍になると、処理時間は4倍になる</li>
      <li><strong>空間計算量</strong>：O(1) - 追加のメモリをほとんど使わない（in-place）</li>
      <li><strong>安定性</strong>：安定 - 同じ値の要素の順序が保たれる</li>
    </ul>

    <h4>実用性について</h4>
    <p>バブルソートは学習用には優れていますが、実務ではあまり使われません。理由は：</p>
    <ul>
      <li>大量のデータに対して非効率（O(n²)の計算量）</li>
      <li>より高速なアルゴリズムが存在（クイックソート、マージソートなど）</li>
    </ul>
    <p>ただし、<strong>ほぼ整列済み</strong>のデータや<strong>データ量が少ない</strong>場合は、実装の簡潔さから採用されることもあります。</p>

    <h4>改善版：最適化バブルソート</h4>
    <p>1パスで交換が1回も発生しなければ、配列はすでに整列済みです。この性質を利用して早期終了することで、最良ケースの計算量をO(n)に改善できます。</p>
  `,

  learningPoints: [
    '二重ループの仕組みと配列のインデックス操作',
    '一時変数を使った2つの要素の交換パターン',
    'ループ範囲の最適化（すでに整列済みの部分は処理しない）',
    'アルゴリズムのトレース方法（変数の値の変化を追う）',
    '計算量O(n²)の意味とその影響',
  ],

  keywords: [
    'バブルソート',
    '整列アルゴリズム',
    '二重ループ',
    '配列',
    '交換',
    '計算量',
    'O(n²)',
    'in-place',
    '安定ソート',
  ],
};
