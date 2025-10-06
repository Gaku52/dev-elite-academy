import type { SubjectBQuestion } from '@/types/subject-b';

export const queueQuestion: SubjectBQuestion = {
  id: 'algo-005-queue',
  title: 'キューを用いた待ち行列の管理',
  description: 'キュー（先入れ先出し）データ構造を使って、タスクの待ち行列を管理する問題です。',
  category: 'algorithm',
  difficulty: 'easy',
  timeEstimate: 15,

  problemStatement: `
    <p>次のプログラムは、キュー（待ち行列）を用いて、プリンタの印刷ジョブを管理するものである。</p>
    <p>キューは「先入れ先出し（FIFO: First In First Out）」のデータ構造で、最初に入れたデータが最初に取り出される。</p>
    <p>銀行の窓口やスーパーのレジのように、先に並んだ人が先に処理されるイメージです。</p>
  `,

  pseudoCode: [
    { lineNumber: 1, code: '○キュー: queue（整数を格納）' },
    { lineNumber: 2, code: '○整数型の配列: jobs' },
    { lineNumber: 3, code: '○整数型: i, currentJob, processedCount' },
    { lineNumber: 4, code: '' },
    { lineNumber: 5, code: '/* jobsは処理待ちのジョブID配列 */' },
    { lineNumber: 6, code: '/* 例: [101, 102, 103, 104] */' },
    { lineNumber: 7, code: '' },
    { lineNumber: 8, code: '/* ステップ1: すべてのジョブをキューに追加 */' },
    { lineNumber: 9, code: 'i を 0 から jobsの要素数 - 1 まで 1 ずつ増やしながら繰り返す:' },
    { lineNumber: 10, code: '    jobs[i]を ａ', highlight: true },
    { lineNumber: 11, code: 'ループの終わり' },
    { lineNumber: 12, code: '' },
    { lineNumber: 13, code: '/* ステップ2: キューからジョブを取り出して処理 */' },
    { lineNumber: 14, code: 'processedCount ← 0' },
    { lineNumber: 15, code: 'queueが空でない間、繰り返す:' },
    { lineNumber: 16, code: '    currentJob ← ｂ', highlight: true },
    { lineNumber: 17, code: '    currentJobを処理する' },
    { lineNumber: 18, code: '    processedCount ← processedCount + 1' },
    { lineNumber: 19, code: 'ループの終わり' },
    { lineNumber: 20, code: '' },
    { lineNumber: 21, code: '/* 処理したジョブ数を返す */' },
    { lineNumber: 22, code: 'processedCountを返す' },
  ],

  additionalInfo: `
    <h4>キューの基本操作</h4>
    <ul>
      <li><strong>エンキュー（enqueue）</strong>：キューの末尾にデータを追加</li>
      <li><strong>デキュー（dequeue）</strong>：キューの先頭からデータを取り出して削除</li>
    </ul>

    <h4>キューの動作例</h4>
    <p>印刷ジョブ [101, 102, 103] の処理：</p>
    <ol>
      <li>101をエンキュー → キュー: [101]</li>
      <li>102をエンキュー → キュー: [101, 102]</li>
      <li>103をエンキュー → キュー: [101, 102, 103]</li>
      <li>デキュー → 101を取得、キュー: [102, 103]</li>
      <li>デキュー → 102を取得、キュー: [103]</li>
      <li>デキュー → 103を取得、キュー: []（空）</li>
    </ol>
    <p>※先に追加したものが先に取り出されます（FIFO）</p>
  `,

  subQuestions: [
    {
      id: 'q1',
      questionNumber: '設問1',
      text: `
        <p>プログラム中の空欄 <strong>ａ</strong> に入る適切な操作を選択してください。</p>
        <p>ジョブをキューに追加する操作です。</p>
      `,
      type: 'fill-in-blank',
      fillInBlanks: [
        {
          id: 'a',
          label: 'ａ',
          options: [
            { id: 'opt1', text: 'queueにエンキュー' },
            { id: 'opt2', text: 'queueからデキュー' },
            { id: 'opt3', text: 'queueにプッシュ' },
            { id: 'opt4', text: 'queueからポップ' },
            { id: 'opt5', text: 'queueに挿入' },
          ],
          correctAnswer: 'opt1'
        }
      ],
      explanation: `
        <p><strong>正解：queueにエンキュー</strong></p>
        <p>キューにデータを追加する操作を「エンキュー（enqueue）」と呼びます。</p>
        <ul>
          <li>エンキューは常にキューの<strong>末尾</strong>に追加</li>
          <li>FIFO（先入れ先出し）の原則に従う</li>
          <li>銀行の窓口で、新しい客が列の最後に並ぶイメージ</li>
        </ul>
      `,
      detailedExplanation: `
        <h4>キューとスタックの用語の違い</h4>
        <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 8px;">データ構造</th>
            <th style="border: 1px solid #ddd; padding: 8px;">追加操作</th>
            <th style="border: 1px solid #ddd; padding: 8px;">取り出し操作</th>
            <th style="border: 1px solid #ddd; padding: 8px;">原則</th>
          </tr>
          <tr style="background-color: #d4edda;">
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>キュー（Queue）</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>エンキュー</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>デキュー</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">FIFO（先入れ先出し）</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">スタック（Stack）</td>
            <td style="border: 1px solid #ddd; padding: 8px;">プッシュ</td>
            <td style="border: 1px solid #ddd; padding: 8px;">ポップ</td>
            <td style="border: 1px solid #ddd; padding: 8px;">LIFO（後入れ先出し）</td>
          </tr>
        </table>

        <h4>エンキューの動作</h4>
        <p>jobs = [101, 102, 103] を順にエンキューする場合：</p>
        <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 8px;">ステップ</th>
            <th style="border: 1px solid #ddd; padding: 8px;">操作</th>
            <th style="border: 1px solid #ddd; padding: 8px;">キューの状態</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">初期</td>
            <td style="border: 1px solid #ddd; padding: 8px;">-</td>
            <td style="border: 1px solid #ddd; padding: 8px;">[]（空）</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">1</td>
            <td style="border: 1px solid #ddd; padding: 8px;">101をエンキュー</td>
            <td style="border: 1px solid #ddd; padding: 8px;">[101] ← 先頭</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">2</td>
            <td style="border: 1px solid #ddd; padding: 8px;">102をエンキュー</td>
            <td style="border: 1px solid #ddd; padding: 8px;">[101, 102] ← 末尾</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">3</td>
            <td style="border: 1px solid #ddd; padding: 8px;">103をエンキュー</td>
            <td style="border: 1px solid #ddd; padding: 8px;">[101, 102, 103] ← 末尾</td>
          </tr>
        </table>

        <p><strong>ポイント</strong>：</p>
        <ul>
          <li>101が<strong>先頭</strong>（最初に取り出される）</li>
          <li>103が<strong>末尾</strong>（最後に取り出される）</li>
          <li>エンキューは常に末尾に追加</li>
        </ul>
      `
    },
    {
      id: 'q2',
      questionNumber: '設問2',
      text: `
        <p>プログラム中の空欄 <strong>ｂ</strong> に入る適切な操作を選択してください。</p>
        <p>キューからジョブを取り出す操作です。</p>
      `,
      type: 'fill-in-blank',
      fillInBlanks: [
        {
          id: 'b',
          label: 'ｂ',
          options: [
            { id: 'opt1', text: 'queueからデキュー' },
            { id: 'opt2', text: 'queueにエンキュー' },
            { id: 'opt3', text: 'queueからポップ' },
            { id: 'opt4', text: 'queueの先頭を参照（取り出さない）' },
            { id: 'opt5', text: 'queueの末尾を取得' },
          ],
          correctAnswer: 'opt1'
        }
      ],
      explanation: `
        <p><strong>正解：queueからデキュー</strong></p>
        <p>キューからデータを取り出す操作を「デキュー（dequeue）」と呼びます。</p>
        <ul>
          <li>デキューは常にキューの<strong>先頭</strong>から取り出す</li>
          <li>取り出されたデータはキューから削除される</li>
          <li>銀行の窓口で、先頭の客が処理されて列から抜けるイメージ</li>
        </ul>
      `,
      detailedExplanation: `
        <h4>デキューの動作</h4>
        <p>キュー [101, 102, 103] から順にデキューする場合：</p>

        <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 8px;">ステップ</th>
            <th style="border: 1px solid #ddd; padding: 8px;">操作</th>
            <th style="border: 1px solid #ddd; padding: 8px;">取得値</th>
            <th style="border: 1px solid #ddd; padding: 8px;">キューの状態</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">初期</td>
            <td style="border: 1px solid #ddd; padding: 8px;">-</td>
            <td style="border: 1px solid #ddd; padding: 8px;">-</td>
            <td style="border: 1px solid #ddd; padding: 8px;">[101, 102, 103]</td>
          </tr>
          <tr style="background-color: #fffacd;">
            <td style="border: 1px solid #ddd; padding: 8px;">1</td>
            <td style="border: 1px solid #ddd; padding: 8px;">デキュー</td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>101</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">[102, 103]</td>
          </tr>
          <tr style="background-color: #fffacd;">
            <td style="border: 1px solid #ddd; padding: 8px;">2</td>
            <td style="border: 1px solid #ddd; padding: 8px;">デキュー</td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>102</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">[103]</td>
          </tr>
          <tr style="background-color: #fffacd;">
            <td style="border: 1px solid #ddd; padding: 8px;">3</td>
            <td style="border: 1px solid #ddd; padding: 8px;">デキュー</td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>103</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">[]（空）</td>
          </tr>
        </table>

        <h4>キューとスタックの違い（視覚的比較）</h4>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          <p><strong>キュー（FIFO）</strong></p>
          <pre>
追加 →  [101] [102] [103]  → 取り出し
末尾    ←               先頭
          </pre>
          <p>101を追加 → 101が最初に取り出される</p>
        </div>

        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          <p><strong>スタック（LIFO）</strong></p>
          <pre>
      ↓ 追加・取り出し
     [103]
     [102]
     [101]
          </pre>
          <p>101を追加 → 103が最初に取り出される</p>
        </div>

        <h4>実世界の例</h4>
        <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 8px;">キュー（FIFO）の例</th>
            <th style="border: 1px solid #ddd; padding: 8px;">スタック（LIFO）の例</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">
              <ul style="margin: 0;">
                <li>銀行の待ち行列</li>
                <li>スーパーのレジ</li>
                <li>プリンタの印刷待ち</li>
                <li>コールセンターの電話待ち</li>
              </ul>
            </td>
            <td style="border: 1px solid #ddd; padding: 8px;">
              <ul style="margin: 0;">
                <li>本や皿の積み重ね</li>
                <li>ブラウザの戻るボタン</li>
                <li>関数の呼び出し</li>
                <li>Undoバッファ</li>
              </ul>
            </td>
          </tr>
        </table>
      `
    },
    {
      id: 'q3',
      questionNumber: '設問3',
      text: `
        <p>印刷ジョブの配列 [201, 202, 203, 204, 205] をキューに追加し、
        3つのジョブを処理した後、新たに2つのジョブ [206, 207] をキューに追加した。
        この時点でキューの先頭にあるジョブIDはどれか。</p>
      `,
      type: 'multiple-choice',
      choices: [
        { id: 'choice1', text: '203' },
        { id: 'choice2', text: '204' },
        { id: 'choice3', text: '205' },
        { id: 'choice4', text: '206' },
      ],
      correctAnswer: 'choice2',
      explanation: `
        <p><strong>正解：204</strong></p>
        <p>操作の流れ：</p>
        <ol>
          <li>初期キュー：[201, 202, 203, 204, 205]</li>
          <li>3つ処理（デキュー）：201, 202, 203を削除 → [204, 205]</li>
          <li>新規追加（エンキュー）：206, 207を追加 → [204, 205, 206, 207]</li>
          <li>先頭は<strong>204</strong></li>
        </ol>
      `,
      detailedExplanation: `
        <h4>完全トレース</h4>

        <h5>フェーズ1：初期状態（全ジョブをエンキュー）</h5>
        <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 8px;">操作</th>
            <th style="border: 1px solid #ddd; padding: 8px;">キューの状態</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">201をエンキュー</td>
            <td style="border: 1px solid #ddd; padding: 8px;">[201]</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">202をエンキュー</td>
            <td style="border: 1px solid #ddd; padding: 8px;">[201, 202]</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">203をエンキュー</td>
            <td style="border: 1px solid #ddd; padding: 8px;">[201, 202, 203]</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">204をエンキュー</td>
            <td style="border: 1px solid #ddd; padding: 8px;">[201, 202, 203, 204]</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">205をエンキュー</td>
            <td style="border: 1px solid #ddd; padding: 8px;">[201, 202, 203, 204, 205]</td>
          </tr>
        </table>

        <h5>フェーズ2：3つのジョブを処理（デキュー）</h5>
        <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 8px;">操作</th>
            <th style="border: 1px solid #ddd; padding: 8px;">取得値</th>
            <th style="border: 1px solid #ddd; padding: 8px;">キューの状態</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">デキュー（1回目）</td>
            <td style="border: 1px solid #ddd; padding: 8px;">201</td>
            <td style="border: 1px solid #ddd; padding: 8px;">[202, 203, 204, 205]</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">デキュー（2回目）</td>
            <td style="border: 1px solid #ddd; padding: 8px;">202</td>
            <td style="border: 1px solid #ddd; padding: 8px;">[203, 204, 205]</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">デキュー（3回目）</td>
            <td style="border: 1px solid #ddd; padding: 8px;">203</td>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>[204, 205]</strong></td>
          </tr>
        </table>

        <h5>フェーズ3：新しいジョブを追加（エンキュー）</h5>
        <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 8px;">操作</th>
            <th style="border: 1px solid #ddd; padding: 8px;">キューの状態</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">206をエンキュー</td>
            <td style="border: 1px solid #ddd; padding: 8px;">[204, 205, 206]</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">207をエンキュー</td>
            <td style="border: 1px solid #ddd; padding: 8px;">[204, 205, 206, 207]</td>
          </tr>
        </table>

        <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 10px 0; border-left: 4px solid #28a745;">
          <p><strong>最終状態</strong></p>
          <p>キュー: [<strong style="font-size: 1.2em; color: #28a745;">204</strong>, 205, 206, 207]</p>
          <p>先頭（次に処理されるジョブ）: <strong>204</strong></p>
        </div>

        <h4>重要なポイント</h4>
        <ul>
          <li>デキューは<strong>先頭</strong>から取り出す（201→202→203の順）</li>
          <li>エンキューは<strong>末尾</strong>に追加する（206, 207は最後に追加）</li>
          <li>FIFOの原則：先に並んだものが先に処理される</li>
        </ul>
      `
    }
  ],

  overallExplanation: `
    <h3>キューの全体像</h3>
    <p>キューは、日常生活の「待ち行列」をそのままデータ構造にしたもので、FIFO（先入れ先出し）の原則に従います。</p>

    <h4>キューの特徴</h4>
    <ul>
      <li><strong>FIFO（First In First Out）</strong>：先入れ先出し</li>
      <li><strong>基本操作</strong>：エンキュー（追加）とデキュー（取り出し）</li>
      <li><strong>時間計算量</strong>：エンキューもデキューもO(1)で高速</li>
    </ul>

    <h4>キューの実用例</h4>
    <ul>
      <li><strong>タスク管理</strong>：プリンタの印刷待ち、CPUのタスクスケジューリング</li>
      <li><strong>メッセージキュー</strong>：メールサーバー、チャットアプリ</li>
      <li><strong>幅優先探索（BFS）</strong>：グラフアルゴリズムの探索順序管理</li>
      <li><strong>バッファ</strong>：データの一時保存（ストリーミング、通信など）</li>
      <li><strong>待機リスト</strong>：オンラインゲームのマッチング、コールセンターの電話待ち</li>
    </ul>

    <h4>キューの実装方法</h4>
    <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
      <tr style="background-color: #f0f0f0;">
        <th style="border: 1px solid #ddd; padding: 8px;">実装方法</th>
        <th style="border: 1px solid #ddd; padding: 8px;">メリット</th>
        <th style="border: 1px solid #ddd; padding: 8px;">デメリット</th>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">配列</td>
        <td style="border: 1px solid #ddd; padding: 8px;">実装が簡単</td>
        <td style="border: 1px solid #ddd; padding: 8px;">デキューがO(n)になる可能性</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">連結リスト</td>
        <td style="border: 1px solid #ddd; padding: 8px;">すべての操作がO(1)</td>
        <td style="border: 1px solid #ddd; padding: 8px;">ポインタ管理が必要</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">環状配列</td>
        <td style="border: 1px solid #ddd; padding: 8px;">メモリ効率が良い</td>
        <td style="border: 1px solid #ddd; padding: 8px;">サイズ制限がある</td>
      </tr>
    </table>

    <h4>キューとスタックの使い分け</h4>
    <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
      <tr style="background-color: #f0f0f0;">
        <th style="border: 1px solid #ddd; padding: 8px;">状況</th>
        <th style="border: 1px solid #ddd; padding: 8px;">適切なデータ構造</th>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">順番を守りたい（公平性）</td>
        <td style="border: 1px solid #ddd; padding: 8px;"><strong>キュー</strong></td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">最新のものを優先したい</td>
        <td style="border: 1px solid #ddd; padding: 8px;"><strong>スタック</strong></td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">幅優先探索（BFS）</td>
        <td style="border: 1px solid #ddd; padding: 8px;"><strong>キュー</strong></td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">深さ優先探索（DFS）</td>
        <td style="border: 1px solid #ddd; padding: 8px;"><strong>スタック</strong></td>
      </tr>
    </table>

    <h4>発展：優先度付きキュー</h4>
    <p>通常のキューは到着順に処理しますが、優先度付きキュー（Priority Queue）では、
    各要素に優先度を付けて、優先度の高いものから処理します。</p>
    <ul>
      <li>病院の救急外来（重症者を優先）</li>
      <li>タスクスケジューラ（重要度の高いタスクを優先）</li>
      <li>ダイクストラ法などのアルゴリズム</li>
    </ul>
  `,

  learningPoints: [
    'キューのFIFO（先入れ先出し）の原理',
    'エンキューとデキューの基本操作',
    'スタックとキューの違いと使い分け',
    'キューの実用例（タスク管理、メッセージキューなど）',
    'データ構造の選択がアルゴリズムに与える影響',
    '待ち行列の公平性と効率性',
  ],

  keywords: [
    'キュー',
    'FIFO',
    '先入れ先出し',
    'エンキュー',
    'デキュー',
    '待ち行列',
    'データ構造',
    'バッファ',
  ],
};
