'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle, Circle, ChevronRight, Code, AlertCircle, Trophy } from 'lucide-react';

interface Quiz {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface Section {
  title: string;
  content: string;
  quizzes: Quiz[];
}

interface Module {
  id: number;
  title: string;
  sections: Section[];
}

const learningModules: Module[] = [
  {
    id: 1,
    title: '基本的なデータ構造',
    sections: [
      {
        title: '配列とリスト',
        content: `データ構造は、データを効率的に格納・操作するための仕組みです。

**配列（Array）:**
- 同じ型のデータを連続したメモリ領域に格納
- インデックス（添字）による高速アクセス: O(1)
- 特徴:
  - 静的配列: サイズが固定、コンパイル時に決定
  - 動的配列: サイズが可変、実行時に変更可能
  - メモリ効率が良い（データのみ格納）
  - 挿入・削除は遅い: O(n)（要素の移動が必要）

**リスト（List）:**
- **配列リスト（ArrayList）**: 動的配列の実装
  - 内部で配列を使用、容量が不足すると拡張
  - ランダムアクセス: O(1)
  - 末尾への追加: 平均O(1)、最悪O(n)

- **連結リスト（Linked List）**: ノードがポインタで接続
  - 各ノードはデータと次のノードへのポインタを保持
  - 挿入・削除が高速: O(1)（位置が分かっている場合）
  - ランダムアクセスは遅い: O(n)
  - メモリ使用量が多い（ポインタ分のオーバーヘッド）

**連結リストの種類:**
- 単方向リスト: 次のノードへのポインタのみ
- 双方向リスト: 前後両方向へのポインタ
- 循環リスト: 最後のノードが最初のノードを指す

**使い分けの指針:**
- ランダムアクセスが多い → 配列
- 頻繁な挿入・削除 → 連結リスト
- サイズが変動する → 動的配列
- メモリ効率重視 → 配列`,
        quizzes: [
          {
            question: '配列の特徴として正しいものはどれか？',
            options: ['挿入・削除が常にO(1)で実行できる', 'インデックスによるアクセスがO(1)で実行できる', 'メモリ上で不連続に配置される', 'サイズが必ず固定である'],
            correct: 1,
            explanation: '配列は連続したメモリ領域に格納されるため、インデックスを使った直接アクセスがO(1)で可能です。'
          },
          {
            question: '連結リストの利点として正しいものはどれか？',
            options: ['ランダムアクセスが高速', 'メモリ使用量が配列より少ない', '挿入・削除が高速', 'キャッシュ効率が良い'],
            correct: 2,
            explanation: '連結リストは、リストの任意の位置での挿入・削除がO(1)で実行できます（ノードの位置が分かっている場合）。'
          },
          {
            question: '配列でn番目の要素の挿入に必要な時間計算量は？',
            options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
            correct: 2,
            explanation: '配列の中間に要素を挿入する場合、それより後ろの要素をすべて1つずつ後ろにずらす必要があるため、O(n)の時間がかかります。'
          },
          {
            question: '動的配列（ArrayList）の容量拡張について正しいものはどれか？',
            options: ['常に1つずつ要素を追加', '通常は現在の容量の2倍に拡張', '容量は変更できない', '必要な分だけ正確に拡張'],
            correct: 1,
            explanation: '動的配列は通常、容量不足時に現在の容量の2倍（または1.5倍）に拡張することで、頻繁な拡張操作を避けています。'
          },
          {
            question: '双方向連結リストの特徴として誤っているものはどれか？',
            options: ['前後両方向に移動可能', '各ノードが2つのポインタを持つ', '単方向リストより高速なランダムアクセス', '逆順の走査が可能'],
            correct: 2,
            explanation: '双方向連結リストでもランダムアクセスはO(n)で、単方向リストと同じです。前後への移動が可能になるだけです。'
          },
          {
            question: 'n個の要素を持つ配列で、すべての要素を2倍にする処理の時間計算量は？',
            options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
            correct: 2,
            explanation: 'すべての要素にアクセスして操作するため、要素数に比例したO(n)の時間がかかります。'
          },
          {
            question: '連結リストで特定の値を検索する時間計算量は？',
            options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
            correct: 2,
            explanation: '連結リストでは先頭から順番に要素を確認する必要があるため、最悪の場合O(n)の時間がかかります。'
          },
          {
            question: '配列のメモリ局所性について正しいものはどれか？',
            options: ['連結リストより局所性が悪い', '要素が連続配置されキャッシュ効率が良い', 'ランダムアクセスできない', 'メモリ使用量が多い'],
            correct: 1,
            explanation: '配列は要素が連続したメモリ領域に配置されるため、CPUキャッシュの局所性を活用でき、アクセス効率が良くなります。'
          }
        ]
      },
      {
        title: 'スタックとキュー',
        content: `特定の順序でデータを扱う重要なデータ構造です。

**スタック（Stack）- LIFO（Last In First Out）:**
後入れ先出しの原理で動作

基本操作:
- push(x): 要素xをスタックのトップに追加
- pop(): スタックのトップから要素を取り出して返す
- peek()/top(): トップ要素を削除せずに参照
- isEmpty(): スタックが空かどうか判定
- size(): スタック内の要素数を返す

実装方法:
- 配列ベース: 配列とトップインデックスで実装
- 連結リストベース: 単方向リストの先頭を使用

時間計算量: すべての基本操作がO(1)

**応用例:**
- 関数呼び出しスタック（コールスタック）
- 括弧の対応チェック: ((()))の検証
- 数式の後置記法への変換
- Undo機能の実装
- バックトラッキングアルゴリズム
- 深さ優先探索（DFS）

**キュー（Queue）- FIFO（First In First Out）:**
先入れ先出しの原理で動作

基本操作:
- enqueue(x): 要素xをキューの末尾に追加
- dequeue(): キューの先頭から要素を取り出して返す
- front(): 先頭要素を削除せずに参照
- rear(): 末尾要素を削除せずに参照
- isEmpty(): キューが空かどうか判定

実装方法:
- 配列ベース: 循環配列（リングバッファ）を使用
- 連結リストベース: 先頭と末尾のポインタを保持

**キューの種類:**
- 単純キュー: 基本的なFIFO
- 循環キュー: 配列の末尾と先頭を接続
- 優先度付きキュー: 優先度順に取り出し
- 両端キュー（Deque）: 両端での挿入・削除が可能

**応用例:**
- プロセススケジューリング
- 印刷ジョブの管理
- 幅優先探索（BFS）
- バッファリング処理
- シミュレーション（待ち行列理論）`,
        quizzes: [
          {
            question: 'スタックの用途として適切なものはどれか？',
            options: ['印刷ジョブの管理', '関数呼び出しの管理', 'タスクの順番待ち', 'ネットワークパケットの処理'],
            correct: 1,
            explanation: 'スタックのLIFO特性は、関数の呼び出しと復帰の管理に最適です。最後に呼び出された関数が最初に終了します。'
          },
          {
            question: 'キューを配列で実装する際の問題点と解決策は？',
            options: ['メモリ不足→動的確保', '線形探索→バイナリサーチ', '偽のオーバーフロー→循環配列', 'データ重複→ハッシュ化'],
            correct: 2,
            explanation: '配列でキューを実装すると、dequeue操作により配列の前方に空きができ、実際には空きがあるのにenqueueできなくなります。循環配列で解決できます。'
          },
          {
            question: '括弧の対応チェック "{[()()]}" をスタックで処理する手順は？',
            options: ['開き括弧をpush、閉じ括弧でpopして対応確認', '全括弧をpushしてから順次pop', '開き括弧と閉じ括弧を別々のスタックで管理', '括弧をカウントするだけ'],
            correct: 0,
            explanation: '開き括弧をスタックにpushし、閉じ括弧が来たらpopして対応する開き括弧かチェック。最後にスタックが空なら正しい対応です。'
          },
          {
            question: '後置記法（RPN）"3 4 + 2 *" をスタックで計算する結果は？',
            options: ['14', '11', '10', '24'],
            correct: 0,
            explanation: '3をpush、4をpush、+で7、2をpush、*で14。スタックを使った後置記法計算の基本パターンです。'
          },
          {
            question: '優先度付きキューの実装に適したデータ構造は？',
            options: ['配列', '連結リスト', 'ヒープ', 'ハッシュテーブル'],
            correct: 2,
            explanation: 'ヒープは優先度付きキューの効率的な実装に最適で、挿入・削除ともにO(log n)で実行できます。'
          },
          {
            question: 'スタックオーバーフローが発生する主な原因は？',
            options: ['メモリリーク', '無限再帰', 'NULL参照', '配列の境界越え'],
            correct: 1,
            explanation: '無限再帰や深すぎる再帰呼び出しにより、コールスタックのメモリが枯渇してスタックオーバーフローが発生します。'
          },
          {
            question: '両端キュー（Deque）で可能な操作はどれか？',
            options: ['先頭からのみ挿入・削除', '末尾からのみ挿入・削除', '両端での挿入・削除', '中央での挿入・削除'],
            correct: 2,
            explanation: 'Deque（Double-ended queue）は両端（先頭と末尾）での挿入・削除が可能なデータ構造です。'
          },
          {
            question: 'キューを2つのスタックで実装する場合の時間計算量は？',
            options: ['enqueue: O(1), dequeue: O(1)', 'enqueue: O(1), dequeue: 平均O(1)', 'enqueue: O(n), dequeue: O(1)', 'enqueue: O(n), dequeue: O(n)'],
            correct: 1,
            explanation: 'enqueueは一方のスタックにpushするだけなので常にO(1)。dequeueは平均的にはO(1)ですが、時々O(n)のコストがかかります。'
          },
          {
            question: '幅優先探索（BFS）でキューが使われる理由は？',
            options: ['メモリ効率が良い', '深さを制限できる', '同レベルのノードを順序通り処理', '高速な検索が可能'],
            correct: 2,
            explanation: 'BFSでは同じ階層のノードを先に処理する必要があり、FIFO特性のキューにより正しい順序での探索が実現できます。'
          },
          {
            question: 'スタックとキューの組み合わせで実現できる操作は？',
            options: ['要素のソート', '逆順の並び替えのみ', '順序の保持のみ', '要素の順序を任意に変更'],
            correct: 3,
            explanation: 'スタック（LIFO）とキュー（FIFO）を組み合わせることで、要素の順序を様々に変更できます。例えば、一部をスタックで逆順にしてからキューに移すなど。'
          }
        ]
      },
      {
        title: '木構造',
        content: `階層的な関係を表現する重要なデータ構造です。

**木構造の基本概念:**
- ノード（節点）: データを格納する要素
- エッジ（辺）: ノード間の接続
- ルート: 最上位のノード（1つのみ）
- リーフ（葉）: 子を持たないノード
- 高さ: ルートから最も遠いリーフまでの距離
- 深さ: ルートから特定ノードまでの距離
- 部分木: 任意のノードを根とする木

**二分木（Binary Tree）:**
各ノードが最大2つの子を持つ木構造

種類:
- 完全二分木: すべてのレベルが完全に埋まっている（最下位除く）
- 満二分木: すべてのノードが0個または2個の子を持つ
- 平衡二分木: 左右の部分木の高さの差が1以下

**二分探索木（BST: Binary Search Tree）:**
- 左の子 < 親 < 右の子 の関係が成り立つ
- 操作の時間計算量:
  - 探索・挿入・削除: 平均O(log n)、最悪O(n)
  - 最悪ケース: 一本道になった場合（連結リストと同等）

**平衡二分探索木:**
自動的にバランスを保つ工夫がされた二分探索木

AVL木:
- 各ノードで左右の部分木の高さの差が1以下
- 挿入・削除後に回転操作でバランス調整
- すべての操作がO(log n)を保証

赤黒木:
- 各ノードに色（赤または黒）を付与
- 特定の色規則によりバランスを保つ
- AVL木より挿入・削除の回転回数が少ない

**ヒープ（Heap）:**
完全二分木の構造を持つデータ構造

最大ヒープ:
- 親 ≥ 子 の関係
- ルートが最大値

最小ヒープ:
- 親 ≤ 子 の関係
- ルートが最小値

用途:
- 優先度付きキューの実装
- ヒープソートアルゴリズム
- ダイクストラ法などのグラフアルゴリズム

**木の走査（Tree Traversal）:**
- 前順（Pre-order）: 根→左→右
- 中順（In-order）: 左→根→右（BSTでソート順）
- 後順（Post-order）: 左→右→根
- レベル順（Level-order）: 幅優先探索`,
        quizzes: [
          {
            question: '二分探索木の特徴として正しいものはどれか？',
            options: ['すべてのノードが必ず2つの子を持つ', '左の子 < 親 < 右の子の関係がある', 'リーフノードのみにデータを格納する', '挿入は常にO(1)で実行できる'],
            correct: 1,
            explanation: '二分探索木では、すべてのノードについて「左の子 < 親 < 右の子」の関係が成り立ちます。これにより効率的な探索が可能になります。'
          },
          {
            question: '完全二分木でn個のノードがある場合の高さは？',
            options: ['⌊log₂ n⌋', '⌊log₂ n⌋ + 1', '⌈log₂ n⌉', '⌈log₂(n+1)⌉'],
            correct: 1,
            explanation: '完全二分木の高さは⌊log₂ n⌋（床関数）です。これは最下位レベルを除くすべてのレベルが満たされているためです。'
          },
          {
            question: 'ヒープの性質について正しいものはどれか？',
            options: ['必ず二分探索木である', '完全二分木の構造を持つ', '中順走査でソート順になる', '左右の子の大小関係が規定される'],
            correct: 1,
            explanation: 'ヒープは完全二分木の構造を持ち、親子間の大小関係（最大ヒープなら親≥子）が規定されますが、左右の子の大小関係は規定されません。'
          },
          {
            question: 'AVL木の特徴として正しいものはどれか？',
            options: ['すべてのノードが赤または黒', '各ノードの左右部分木の高さ差が1以下', '完全二分木である', '中順走査の必要がない'],
            correct: 1,
            explanation: 'AVL木は平衡二分探索木の一種で、各ノードにおいて左右の部分木の高さの差が1以下に保たれます。'
          },
          {
            question: '二分探索木で中順走査（In-order）を行うと？',
            options: ['ランダムな順序', '挿入順序', 'ソート順（昇順）', '逆順（降順）'],
            correct: 2,
            explanation: '二分探索木を中順走査（左→根→右）すると、昇順にソートされた順序で要素を取得できます。'
          },
          {
            question: '高さhの完全二分木の最大ノード数は？',
            options: ['2^h', '2^h - 1', '2^(h+1) - 1', '2^(h-1)'],
            correct: 2,
            explanation: '高さhの完全二分木の最大ノード数は2^(h+1) - 1です。各レベルで2^k個のノードがあり、総和は2^(h+1) - 1になります。'
          },
          {
            question: 'ヒープソートの時間計算量は？',
            options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2^n)'],
            correct: 1,
            explanation: 'ヒープソートは、ヒープ構築にO(n)、各要素の削除にO(log n)×n回でO(n log n)の時間計算量です。'
          },
          {
            question: '赤黒木で赤ノードの制約として正しいものは？',
            options: ['赤ノードは根になれない', '赤ノードの子は必ず黒', '赤ノードは葉になれない', '赤ノードの親は必ず赤'],
            correct: 1,
            explanation: '赤黒木では、赤ノードの子は必ず黒ノードでなければなりません。これにより木のバランスが保たれます。'
          },
          {
            question: '木構造で根から葉までのパスの長さがすべて等しい木は？',
            options: ['二分探索木', '平衡木', '完全木', '満木'],
            correct: 2,
            explanation: '完全木（perfect binary tree）では、すべての葉が同じレベルにあり、根から葉までのパスの長さがすべて等しくなります。'
          },
          {
            question: 'B木の特徴として正しいものはどれか？',
            options: ['各ノードは最大2つの子を持つ', '自己平衡多分木', 'ヒープの一種', '中順走査でソートされない'],
            correct: 1,
            explanation: 'B木は自己平衡多分木（各ノードが2つ以上の子を持てる）で、データベースやファイルシステムのインデックスによく使用されます。'
          }
        ]
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

**線形探索（Linear Search / Sequential Search）:**
データを先頭から順番に調べる最も基本的な探索方法

特徴:
- 時間計算量: O(n)
- 空間計算量: O(1)
- データがソートされている必要がない
- 最悪の場合、全要素を調べる必要がある
- 実装が簡単

擬似コード:
\`\`\`
function linearSearch(array, target):
    for i = 0 to array.length - 1:
        if array[i] == target:
            return i
    return -1  // 見つからなかった場合
\`\`\`

**二分探索（Binary Search）:**
ソート済み配列で効率的に探索する方法

特徴:
- 時間計算量: O(log n)
- 空間計算量: O(1)（反復版）、O(log n)（再帰版）
- データが事前にソートされている必要がある
- 中央値と比較して探索範囲を半分に絞る
- 分割統治法の典型例

擬似コード:
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

    return -1  // 見つからなかった場合
\`\`\`

**応用的な探索:**

**補間探索（Interpolation Search）:**
- 均等分布データで二分探索を改良
- 中央値の代わりに比例計算で位置を推定
- 平均O(log log n)、最悪O(n)

**指数探索（Exponential Search）:**
- 無限配列や範囲が不明な場合に使用
- 2^k で範囲を拡大してから二分探索

**三分探索（Ternary Search）:**
- 単峰関数の最大値・最小値を求める
- 範囲を3等分して絞り込み

**ハッシュ探索:**
- ハッシュ関数でキーから位置を直接計算
- 平均O(1)、最悪O(n)
- 領域効率とのトレードオフ

**実用的な考慮事項:**
- データサイズ: 小さなデータでは線形探索が有効
- ソートコスト: 探索回数とソートコストの比較
- メモリアクセス: キャッシュ効率の考慮
- 更新頻度: 動的データでの索引維持コスト`,
        quizzes: [
          {
            question: '二分探索を使用するための前提条件は？',
            options: ['配列のサイズが偶数である', 'データがソートされている', 'データが重複していない', 'データが整数である'],
            correct: 1,
            explanation: '二分探索は中央値との比較で探索範囲を絞り込むため、データが事前にソートされている必要があります。'
          },
          {
            question: '1,000,000個の要素で二分探索する場合の最大比較回数は？',
            options: ['10回', '20回', '1000回', '500,000回'],
            correct: 1,
            explanation: '2^20 = 1,048,576 > 1,000,000 なので、最大20回の比較で探索が完了します。log₂(1,000,000) ≈ 20。'
          },
          {
            question: '線形探索の利点として適切でないものはどれか？',
            options: ['ソート済みデータが不要', '実装が簡単', 'どんなデータ構造でも使用可能', '大量データで高速'],
            correct: 3,
            explanation: '線形探索は大量データに対してはO(n)で動作するため高速ではありません。二分探索のO(log n)の方が高速です。'
          },
          {
            question: '補間探索が効果的なデータの特徴は？',
            options: ['完全にランダム', '均等に分布', '逆順にソート', '重複が多い'],
            correct: 1,
            explanation: '補間探索は、データが均等に分布している場合に、比例計算により効率的に目標位置を推定できます。'
          },
          {
            question: 'ハッシュ探索の平均時間計算量は？',
            options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
            correct: 0,
            explanation: 'ハッシュ探索は、適切なハッシュ関数と十分なハッシュテーブルサイズがあれば、平均O(1)でアクセスできます。'
          },
          {
            question: '再帰版二分探索の空間計算量は？',
            options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
            correct: 1,
            explanation: '再帰版二分探索は、最大O(log n)回の再帰呼び出しが発生するため、コールスタックによりO(log n)の空間が必要です。'
          },
          {
            question: '三分探索の用途として正しいものは？',
            options: ['任意の値の探索', '単峰関数の最適値探索', 'データの並び替え', 'グラフの最短経路'],
            correct: 1,
            explanation: '三分探索は、単峰関数（1つの山または谷を持つ関数）の最大値または最小値を効率的に見つけるために使用されます。'
          },
          {
            question: '探索効率を向上させる前処理として適切なものは？',
            options: ['データの圧縮', 'データのソート', 'データの暗号化', 'データの分散'],
            correct: 1,
            explanation: 'データを事前にソートすることで、二分探索などの効率的なアルゴリズムが使用可能になります。'
          },
          {
            question: '100個の要素を線形探索する場合の平均比較回数は？',
            options: ['25回', '50回', '75回', '100回'],
            correct: 1,
            explanation: '線形探索では、要素が均等に分布していると仮定すると、平均的に配列の半分（n/2）の位置で見つかります。'
          },
          {
            question: '二分探索で整数オーバーフローを避ける中央値計算は？',
            options: ['(left + right) / 2', 'left + (right - left) / 2', '(left * right) / 2', 'right - (right - left) / 2'],
            correct: 1,
            explanation: 'left + (right - left) / 2 という計算により、left + rightの加算でのオーバーフローを避けることができます。'
          }
        ]
      },
      {
        title: 'ソートアルゴリズム',
        content: `データを特定の順序に並び替える重要なアルゴリズム群です。

**基本的なソートアルゴリズム:**

**バブルソート（Bubble Sort）:**
- 隣接する要素を比較して交換を繰り返す
- 時間計算量: O(n²)、空間計算量: O(1)
- 安定ソート、実装が簡単
- 実用性は低いが教育的価値が高い

**選択ソート（Selection Sort）:**
- 未ソート部分から最小値を選んで先頭と交換
- 時間計算量: O(n²)、空間計算量: O(1)
- 不安定ソート、交換回数が少ない
- 比較回数は常にn(n-1)/2回

**挿入ソート（Insertion Sort）:**
- 各要素を適切な位置に挿入
- 時間計算量: O(n²)、最良O(n)、空間計算量: O(1)
- 安定ソート、小さなデータに効率的
- ほぼソート済みのデータに高速

**効率的なソートアルゴリズム:**

**クイックソート（Quick Sort）:**
- 分割統治法、ピボット要素で分割
- 平均O(n log n)、最悪O(n²)、空間O(log n)
- 不安定ソート、実用的に高速
- ピボット選択が性能に大きく影響

**マージソート（Merge Sort）:**
- 分割統治法、分割してからマージ
- 時間計算量: O(n log n)、空間計算量: O(n)
- 安定ソート、最悪ケースでも性能保証
- 外部ソートにも適用可能

**ヒープソート（Heap Sort）:**
- ヒープデータ構造を利用
- 時間計算量: O(n log n)、空間計算量: O(1)
- 不安定ソート、最悪ケースでも性能保証
- インプレースソート（追加メモリ不要）

**特殊なソートアルゴリズム:**

**カウンティングソート（Counting Sort）:**
- 要素の出現回数をカウント
- 時間計算量: O(n + k)、kは値の範囲
- 安定ソート、値の範囲が小さい場合に効率的

**基数ソート（Radix Sort）:**
- 桁ごとにソート（LSD/MSD）
- 時間計算量: O(d(n + k))、dは桁数
- 安定ソート、整数や文字列に効果的

**バケットソート（Bucket Sort）:**
- 値の範囲をバケットに分割
- 平均O(n + k)、最悪O(n²)
- 入力が均等分布の場合に効率的

**ソートアルゴリズムの比較:**
- 安定性: 同じ値の要素の順序が保たれるか
- インプレース: 追加メモリをどの程度使用するか
- 最悪ケース性能: 最も悪い場合の時間計算量
- 実装の複雑さ: アルゴリズムの理解と実装の難易度`,
        quizzes: [
          {
            question: '安定ソートの特徴として正しいものはどれか？',
            options: ['必ずO(n log n)で実行できる', '同じ値の要素の順序が保たれる', '追加メモリが不要', '最悪計算量が最も小さい'],
            correct: 1,
            explanation: '安定ソートは、同じ値を持つ要素の相対的な順序がソート後も保持される特性です。これは特定の用途で重要な性質です。'
          },
          {
            question: 'クイックソートの最悪ケース時間計算量は？',
            options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2^n)'],
            correct: 2,
            explanation: 'クイックソートは、既にソート済みのデータで不適切なピボットを選ぶと、毎回1つずつしか分割されずO(n²)になります。'
          },
          {
            question: 'マージソートの特徴として誤っているものは？',
            options: ['分割統治法を使用', '安定ソート', 'O(n log n)の時間計算量', 'インプレースソート'],
            correct: 3,
            explanation: 'マージソートは、マージ処理のために入力と同じサイズの追加メモリが必要なため、インプレースソートではありません。'
          },
          {
            question: 'ヒープソートの利点として正しいものは？',
            options: ['安定ソート', '最良ケースがO(n)', 'インプレースソート', 'キャッシュ効率が良い'],
            correct: 2,
            explanation: 'ヒープソートは、ヒープを入力配列内で構築するため、O(1)の追加メモリで実行できるインプレースソートです。'
          },
          {
            question: '挿入ソートが効率的な場面はどれか？',
            options: ['大量の乱数データ', '逆順データ', 'ほぼソート済みデータ', '完全に重複データ'],
            correct: 2,
            explanation: '挿入ソートは、ほぼソート済みのデータに対して最良O(n)で動作し、小さな移動だけで済むため効率的です。'
          },
          {
            question: 'カウンティングソートが適用できる条件は？',
            options: ['データがランダム', 'データが文字列', '値の範囲が小さい', 'データサイズが大きい'],
            correct: 2,
            explanation: 'カウンティングソートは、値の範囲kが小さい場合（通常k=O(n)以下）に効率的なO(n+k)で実行できます。'
          },
          {
            question: '基数ソート（Radix Sort）の基本原理は？',
            options: ['比較による交換', '桁ごとの安定ソート', 'ランダムな分割', '近似による配置'],
            correct: 1,
            explanation: '基数ソートは、下位桁（LSD）または上位桁（MSD）から順番に安定ソートを繰り返して全体をソートします。'
          },
          {
            question: 'in-placeソートアルゴリズムはどれか？',
            options: ['マージソート', 'カウンティングソート', 'ヒープソート', '基数ソート'],
            correct: 2,
            explanation: 'ヒープソートは、入力配列内でヒープを構築し、追加の配列を使わずにソートできるin-placeアルゴリズムです。'
          },
          {
            question: 'クイックソートの性能を改善する手法として適切でないものは？',
            options: ['ランダムピボット選択', '3点ピボット選択', '小さい部分配列で挿入ソート', 'すべての要素を比較'],
            correct: 3,
            explanation: 'クイックソートの改善には適切なピボット選択や小さい配列での別アルゴリズム使用が有効ですが、全要素比較は意味がありません。'
          },
          {
            question: 'ソートアルゴリズムの下界（理論的最小計算量）は？',
            options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(n³)'],
            correct: 1,
            explanation: '比較ベースのソートアルゴリズムの理論的下界はO(n log n)です。これは決定木の分析により証明されています。'
          }
        ]
      },
      {
        title: '再帰アルゴリズム',
        content: `自分自身を呼び出すアルゴリズムの設計手法です。

**再帰の基本構造:**
すべての再帰アルゴリズムには以下の要素が必要です：

1. **基底条件（Base Case）**: 再帰を終了する条件
2. **再帰関係式（Recursive Case）**: 問題を小さくして自分自身を呼び出す
3. **進行条件**: 基底条件に向かって問題が小さくなることを保証

**基本的な再帰例:**

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
    if n <= 1:          // 基底条件
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)
\`\`\`

**高度な再帰アルゴリズム:**

**ユークリッドの互除法:**
\`\`\`
function gcd(a, b):
    if b == 0:
        return a
    else:
        return gcd(b, a % b)
\`\`\`

**累乗の高速計算:**
\`\`\`
function power(base, exp):
    if exp == 0:
        return 1
    else if exp % 2 == 0:
        half = power(base, exp / 2)
        return half * half
    else:
        return base * power(base, exp - 1)
\`\`\`

**分割統治法（Divide and Conquer）:**
大きな問題を小さな部分問題に分割して解決

特徴:
- 分割（Divide）: 問題を小さな部分問題に分ける
- 統治（Conquer）: 部分問題を再帰的に解く
- 結合（Combine）: 部分問題の解を組み合わせる

例:
- マージソート
- クイックソート
- 二分探索
- 最大部分配列問題

**動的計画法との関係:**
- 重複する部分問題がある場合はメモ化が効果的
- フィボナッチ数列の単純な再帰はO(2^n)
- メモ化によりO(n)に改善可能

**再帰の利点:**
- コードが直感的で理解しやすい
- 数学的定義に直接対応
- 複雑な問題を簡潔に表現
- 分割統治法との相性が良い

**再帰の欠点:**
- スタックオーバーフローの可能性
- 重複計算による効率の悪さ
- 反復版より実行速度が遅い場合がある
- デバッグが困難な場合がある

**最適化手法:**
- メモ化（Memoization）
- 末尾再帰最適化
- 反復版への変換
- 適切な基底条件の設定

**末尾再帰（Tail Recursion）:**
再帰呼び出しが関数の最後の処理である形式
コンパイラによる最適化が可能

\`\`\`
function factorialTail(n, acc = 1):
    if n <= 1:
        return acc
    else:
        return factorialTail(n - 1, n * acc)
\`\`\``,
        quizzes: [
          {
            question: '再帰アルゴリズムの必須要素はどれか？',
            options: ['ループ処理', '基底条件', '配列の使用', 'ソート処理'],
            correct: 1,
            explanation: '再帰アルゴリズムには、再帰を終了させるための基底条件（終了条件）が必須です。これがないと無限再帰になります。'
          },
          {
            question: '単純なフィボナッチ再帰の時間計算量は？',
            options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2^n)'],
            correct: 3,
            explanation: '単純なフィボナッチ再帰は、同じ値を何度も計算するため指数時間O(2^n)かかります。メモ化により線形時間に改善可能です。'
          },
          {
            question: '末尾再帰の特徴として正しいものは？',
            options: ['再帰呼び出しが関数の最後の処理', '必ず高速になる', 'スタックを使わない', 'ループに変換できない'],
            correct: 0,
            explanation: '末尾再帰は、再帰呼び出しが関数の最後の処理である形式で、コンパイラによる最適化が可能になります。'
          },
          {
            question: 'ユークリッドの互除法gcd(48, 18)の実行過程は？',
            options: ['gcd(48,18)→gcd(18,12)→gcd(12,6)→6', 'gcd(48,18)→gcd(30,18)→gcd(12,6)→6', 'gcd(48,18)→gcd(18,0)→18', 'gcd(48,18)→gcd(6,0)→6'],
            correct: 0,
            explanation: 'gcd(48,18)→gcd(18,48%18)→gcd(18,12)→gcd(12,6)→gcd(6,0)→6 の順序で実行されます。'
          },
          {
            question: '分割統治法の3つのステップとして正しいものは？',
            options: ['分析・設計・実装', '分割・統治・結合', '入力・処理・出力', '探索・比較・交換'],
            correct: 1,
            explanation: '分割統治法は、分割（Divide）、統治（Conquer）、結合（Combine）の3つのステップで構成されます。'
          },
          {
            question: '再帰の深さがnの時のスタック使用量は？',
            options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
            correct: 2,
            explanation: '再帰呼び出しの各レベルでスタックフレームが作成されるため、深さnの再帰ではO(n)のスタック領域が必要です。'
          },
          {
            question: 'メモ化（Memoization）の効果として正しいものは？',
            options: ['メモリ使用量の削減', '重複計算の回避', 'コードの簡略化', 'エラーの防止'],
            correct: 1,
            explanation: 'メモ化は、一度計算した結果を保存して再利用することで、同じ計算の重複を避け、実行時間を大幅に短縮します。'
          },
          {
            question: '再帰で累乗power(2, 10)を効率的に計算する場合の呼び出し回数は？',
            options: ['約4回', '約10回', '約20回', '約100回'],
            correct: 0,
            explanation: '二分累乗法により、power(2,10)→power(2,5)→power(2,2)→power(2,1)→power(2,0) のように約4回の呼び出しで計算できます。'
          },
          {
            question: '再帰アルゴリズムを反復アルゴリズムに変換する利点は？',
            options: ['コードが簡潔になる', 'スタックオーバーフローを回避', '理解しやすくなる', '必ず高速になる'],
            correct: 1,
            explanation: '反復アルゴリズムはスタックの使用量が一定のため、深い再帰によるスタックオーバーフローを回避できます。'
          },
          {
            question: 'ハノイの塔でn枚の円盤を移動する最小手数は？',
            options: ['n', '2n', '2^n - 1', 'n²'],
            correct: 2,
            explanation: 'ハノイの塔の最小手数は2^n - 1回です。これは再帰関係式T(n) = 2T(n-1) + 1の解です。'
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'プログラミングの基礎',
    sections: [
      {
        title: '変数とデータ型',
        content: `プログラミングの基本要素である変数とデータ型について詳しく学びます。

**変数（Variable）:**
データを格納するためのメモリ領域に付けられた名前

特徴:
- 値を保存し、後から参照・変更が可能
- 型によってメモリサイズと操作が決まる
- スコープ（有効範囲）がある
- ライフタイム（生存期間）がある

**基本データ型:**

**整数型（Integer Types）:**
- char: 1バイト（-128〜127 または 0〜255）
- short: 2バイト（-32,768〜32,767）
- int: 4バイト（-2,147,483,648〜2,147,483,647）
- long: 8バイト（より大きな範囲）
- unsigned: 符号なし（0以上の値のみ）

**浮動小数点型（Floating Point Types）:**
- float: 単精度（32ビット）、有効桁数約7桁
- double: 倍精度（64ビット）、有効桁数約15桁
- IEEE 754標準に準拠
- 精度の限界による誤差に注意

**文字型（Character Types）:**
- char: 1つの文字（ASCIIまたはUnicode）
- 内部的には整数として扱われる
- エスケープシーケンス: \\n, \\t, \\\\, \\"

**論理型（Boolean Type）:**
- true または false の2値
- 条件式の結果を表現
- 1バイトまたは1ビットで実装

**複合データ型:**

**文字列型（String）:**
- 文字の配列または文字列クラス
- null終端（C言語）または長さ情報付き
- 文字列操作: 連結、比較、検索、分割

**配列型（Array）:**
- 同じ型の要素の集合
- 固定長または可変長
- 多次元配列も可能

**レコード/構造体型（Record/Struct）:**
- 異なる型のデータをまとめる
- フィールド（メンバ）でアクセス

**型変換（Type Conversion）:**

**暗黙的型変換（Implicit Conversion）:**
- 自動的に行われる型変換
- より大きな型への変換（昇格）
- データ損失が発生しない場合

**明示的型変換（Explicit Conversion/Cast）:**
- プログラマが明示的に指定
- データ損失の可能性がある
- キャスト演算子を使用

**変数のスコープ:**
- **グローバルスコープ**: プログラム全体で有効
- **関数スコープ**: 関数内でのみ有効
- **ブロックスコープ**: {}内でのみ有効
- **静的変数**: 関数終了後も値が保持

**メモリ管理:**
- **スタック**: 自動変数、高速、サイズ制限
- **ヒープ**: 動的割り当て、柔軟、管理が必要
- **静的領域**: グローバル変数、プログラム実行中保持`,
        quizzes: [
          {
            question: '変数のスコープに関して正しい説明はどれか？',
            options: ['すべての変数はグローバルである', 'ローカル変数は特定のブロック内でのみ使用可能', 'グローバル変数は関数内でのみ使用可能', 'スコープは実行時に決定される'],
            correct: 1,
            explanation: 'ローカル変数は宣言されたブロック（関数やループなど）内でのみアクセス可能で、ブロックを出ると自動的に破棄されます。'
          },
          {
            question: '32ビット符号付き整数の表現範囲は？',
            options: ['0 〜 4,294,967,295', '-2,147,483,648 〜 2,147,483,647', '-32,768 〜 32,767', '-128 〜 127'],
            correct: 1,
            explanation: '32ビット符号付き整数は、2の補数表現で-2^31から2^31-1までの値を表現できます。'
          },
          {
            question: '浮動小数点数の特徴として正しいものはどれか？',
            options: ['すべての実数を正確に表現できる', '整数演算より常に高速', 'IEEE 754標準に基づく', '小数点以下の桁数は無制限'],
            correct: 2,
            explanation: '現代のほとんどのシステムでは、IEEE 754標準に基づいた浮動小数点数表現を使用しています。'
          },
          {
            question: '暗黙的型変換が発生する例はどれか？',
            options: ['int型をfloat型に代入', 'float型をint型に代入', 'char型をstring型に代入', 'boolean型をint型に代入'],
            correct: 0,
            explanation: 'int型からfloat型への変換は、データ損失が発生しないため、多くの言語で暗黙的に行われます。'
          },
          {
            question: 'char型データの内部表現について正しいものは？',
            options: ['常に2バイトで格納', '文字コード（ASCII/Unicode）の数値', '文字列として格納', 'ポインタとして格納'],
            correct: 1,
            explanation: 'char型は文字を文字コード（ASCIIやUnicodeなど）の数値として内部的に表現し、整数として扱うことも可能です。'
          },
          {
            question: '動的メモリ割り当ての特徴として正しいものはどれか？',
            options: ['コンパイル時にサイズが決定', '自動的にメモリが解放される', 'プログラマが明示的に管理', 'スタック領域を使用'],
            correct: 2,
            explanation: '動的メモリ割り当て（ヒープ使用）では、プログラマがmalloc/freeやnew/deleteなどで明示的にメモリを管理する必要があります。'
          },
          {
            question: '配列のインデックスが通常0から始まる理由は？',
            options: ['プログラムの慣習', 'ポインタ演算との整合性', 'メモリ効率の向上', '処理速度の向上'],
            correct: 1,
            explanation: '配列の要素アクセスは「配列の先頭アドレス + インデックス × 要素サイズ」で計算されるため、0ベースが自然です。'
          },
          {
            question: 'static変数の特徴として正しいものはどれか？',
            options: ['関数呼び出しごとに初期化される', '関数終了時に値がリセットされる', '初期化は1回のみ実行される', 'グローバル変数と同じスコープ'],
            correct: 2,
            explanation: 'static変数は最初に関数が呼ばれた時に1回だけ初期化され、その後は値が保持されます。'
          },
          {
            question: 'unsigned int型を使用する利点はどれか？',
            options: ['負の値も表現できる', '計算速度が向上する', '表現範囲が2倍になる', 'メモリ使用量が半分になる'],
            correct: 2,
            explanation: 'unsigned int型は符号ビットを値の表現に使用するため、同じビット数で正の値の表現範囲が約2倍になります。'
          },
          {
            question: 'const修飾子の効果として正しいものはどれか？',
            options: ['変数の値を変更不可にする', '実行速度を向上させる', 'メモリ使用量を削減する', '自動的に初期化する'],
            correct: 0,
            explanation: 'const修飾子は変数を読み取り専用にし、プログラムの安全性を向上させます。また、コンパイラによる最適化の手がかりにもなります。'
          }
        ]
      },
      {
        title: '制御構造',
        content: `プログラムの実行順序を制御する重要な構造です。

**順次構造（Sequential Structure）:**
文が上から下へ順番に実行される基本的な構造

**条件分岐（Conditional Branch）:**

**if文:**
\`\`\`
if (条件式) {
    // 条件が真の場合の処理
} else if (条件式2) {
    // 条件2が真の場合の処理
} else {
    // すべての条件が偽の場合の処理
}
\`\`\`

特徴:
- 条件式は論理型（boolean）の値を返す
- 比較演算子: ==, !=, <, >, <=, >=
- 論理演算子: &&(AND), ||(OR), !(NOT)
- 短絡評価: &&や||の左側が確定すると右側を評価しない

**switch文:**
\`\`\`
switch (式) {
    case 値1:
        // 処理1
        break;
    case 値2:
        // 処理2
        break;
    default:
        // デフォルト処理
        break;
}
\`\`\`

特徴:
- 整数や文字の値による分岐
- break文がないとfall-throughが発生
- default句は省略可能
- 複数のcase値で同じ処理も可能

**繰り返し処理（Loop）:**

**for文:**
\`\`\`
for (初期化; 継続条件; 更新) {
    // 繰り返し処理
}
\`\`\`

用途:
- 繰り返し回数が決まっている場合
- 配列の全要素を処理
- カウンタを使った制御

**while文:**
\`\`\`
while (継続条件) {
    // 繰り返し処理
}
\`\`\`

特徴:
- 条件を最初に評価（前判定ループ）
- 条件が偽なら1回も実行されない可能性
- 繰り返し回数が不明な場合に使用

**do-while文:**
\`\`\`
do {
    // 繰り返し処理
} while (継続条件);
\`\`\`

特徴:
- 条件を最後に評価（後判定ループ）
- 必ず1回は実行される
- ユーザー入力の検証などに使用

**制御の移動:**

**break文:**
- ループや switch文から抜ける
- 最も内側のループのみ終了
- ラベル付きbreakで特定のループを指定可能（Java等）

**continue文:**
- 現在の繰り返しをスキップして次の繰り返しへ
- for文では更新部分が実行される
- while文では条件判定に戻る

**return文:**
- 関数から呼び出し元に戻る
- 戻り値がある場合は値も返す
- 関数内のどこからでも使用可能

**ネストした制御構造:**
- 制御構造は入れ子にできる
- 適切なインデントで可読性を向上
- 深いネストは避ける（リファクタリング対象）

**goto文（非推奨）:**
- 任意のラベルにジャンプ
- 構造化プログラミングに反する
- 例外処理やエラーハンドリングでのみ限定使用

**例外処理（Exception Handling）:**
\`\`\`
try {
    // 例外が発生する可能性のある処理
} catch (例外型 e) {
    // 例外処理
} finally {
    // 必ず実行される処理
}
\`\`\``,
        quizzes: [
          {
            question: 'do-while文の特徴として正しいものはどれか？',
            options: ['条件を満たさなくても必ず1回は実行される', '条件を先に評価してから実行する', 'breakを使用できない', 'カウンタ変数が必須である'],
            correct: 0,
            explanation: 'do-while文は後判定ループで、条件評価の前に処理を実行するため、条件が最初から偽でも必ず1回は実行されます。'
          },
          {
            question: '短絡評価について正しい説明はどれか？',
            options: ['すべての条件を必ず評価する', '左側の条件で結果が確定すると右側を評価しない', '処理速度が遅くなる', 'エラーが発生しやすくなる'],
            correct: 1,
            explanation: '短絡評価により、&&演算で左側が偽なら右側は評価されず、||演算で左側が真なら右側は評価されません。これにより効率性と安全性が向上します。'
          },
          {
            question: 'switch文でbreak文を省略した場合の動作は？',
            options: ['エラーが発生する', 'そのcaseのみ実行される', '次のcaseも実行される（fall-through）', 'default節にジャンプする'],
            correct: 2,
            explanation: 'switch文でbreak文を省略すると、一致したcaseから次のbreak文まで（または文末まで）すべてのcaseが実行されます。これをfall-throughと呼びます。'
          },
          {
            question: 'for文で無限ループを作る正しい書き方はどれか？',
            options: ['for(;;)', 'for(1)', 'for(true)', 'for(infinite)'],
            correct: 0,
            explanation: 'for(;;)は初期化、条件、更新をすべて省略した形で、条件部が空の場合は真として扱われるため無限ループになります。'
          },
          {
            question: 'continue文の動作について正しいものはどれか？',
            options: ['ループを完全に終了する', '現在の繰り返しをスキップして次の繰り返しへ', '関数から戻る', 'プログラムを終了する'],
            correct: 1,
            explanation: 'continue文は現在の繰り返し処理の残りをスキップし、次の繰り返し（for文なら更新処理→条件判定、while文なら条件判定）に進みます。'
          },
          {
            question: 'ネストした制御構造で内側のbreakが影響する範囲は？',
            options: ['すべてのループを終了', '最も外側のループを終了', '最も内側のループを終了', '関数を終了'],
            correct: 2,
            explanation: 'break文は最も内側のループまたはswitch文のみを終了します。外側のループを終了するには、ラベル付きbreakやフラグ変数を使用します。'
          },
          {
            question: '条件式で使用できない演算子はどれか？',
            options: ['比較演算子（==, !=）', '論理演算子（&&, ||）', '代入演算子（=）', 'すべて使用可能'],
            correct: 3,
            explanation: '条件式では比較演算子、論理演算子に加えて、代入演算子も使用できます（ただし代入の結果値が条件として評価される）。ただし、==と=の混同に注意が必要です。'
          },
          {
            question: 'while(true)ループから抜け出す方法として適切でないものは？',
            options: ['break文を使用', 'return文を使用', 'continue文を使用', '条件付きbreak文を使用'],
            correct: 2,
            explanation: 'continue文は現在の繰り返しをスキップするだけで、ループから抜け出すことはできません。while(true)から抜けるにはbreak、return、例外などが必要です。'
          },
          {
            question: 'switch文の条件式に使用できないデータ型はどれか？',
            options: ['int型', 'char型', 'enum型', 'double型'],
            correct: 3,
            explanation: 'switch文の条件式には整数型（int、char、enum等）は使用できますが、浮動小数点型（float、double）は通常使用できません。文字列は言語によって異なります。'
          },
          {
            question: 'for文の実行順序として正しいものはどれか？',
            options: ['初期化→条件判定→処理→更新', '条件判定→初期化→処理→更新', '初期化→処理→条件判定→更新', '処理→初期化→条件判定→更新'],
            correct: 0,
            explanation: 'for文は「初期化→条件判定→処理→更新→条件判定→...」の順序で実行されます。条件が偽になるとループを終了します。'
          }
        ]
      },
      {
        title: '関数とモジュール',
        content: `コードの再利用性と保守性を高める重要な概念です。

**関数（Function）の基本概念:**
特定の処理をまとめて名前を付けた、再利用可能なコードブロック

**関数の構成要素:**
- 関数名: 関数を識別する名前
- 引数（パラメータ）: 関数に渡すデータ
- 戻り値: 関数が返すデータ
- 関数本体: 実際の処理内容

**関数の定義と呼び出し:**
\`\`\`
// 関数定義
function calculateArea(width, height) {
    return width * height;
}

// 関数呼び出し
area = calculateArea(10, 20);  // 結果: 200
\`\`\`

**引数の渡し方:**

**値渡し（Pass by Value）:**
- 引数の値のコピーを関数に渡す
- 関数内での変更は呼び出し元に影響しない
- 基本データ型で使用
- メモリ効率は良くないが安全

**参照渡し（Pass by Reference）:**
- 引数のメモリアドレスを渡す
- 関数内での変更が呼び出し元に影響する
- 配列やオブジェクトで使用
- メモリ効率が良いが注意が必要

**ポインタ渡し（Pass by Pointer）:**
- 変数のアドレスを明示的に渡す
- C言語などで使用
- 関数内でポインタを操作して値を変更

**関数の種類:**

**void関数:**
- 戻り値がない関数
- 処理のみを実行（副作用のための関数）
- procedureとも呼ばれる

**純粋関数（Pure Function）:**
- 同じ入力に対して常に同じ出力
- 副作用がない（外部状態を変更しない）
- 関数型プログラミングの基本概念
- テストしやすく、バグが少ない

**再帰関数（Recursive Function）:**
- 自分自身を呼び出す関数
- 基底条件と再帰関係が必要
- 数学的定義に対応しやすい

**高階関数（Higher-Order Function）:**
- 関数を引数として受け取る
- 関数を戻り値として返す
- map、filter、reduceなど

**関数の詳細概念:**

**デフォルト引数:**
\`\`\`
function greet(name, message = "Hello") {
    return message + ", " + name;
}
\`\`\`

**可変長引数:**
\`\`\`
function sum(...numbers) {
    return numbers.reduce((a, b) => a + b, 0);
}
\`\`\`

**オーバーロード:**
- 同じ名前で引数の型や数が異なる関数を定義
- 静的型付け言語で使用
- 動的型付け言語では通常使用できない

**スコープとクロージャ:**
- ローカルスコープ: 関数内でのみ有効
- グローバルスコープ: プログラム全体で有効
- クロージャ: 関数が定義時の環境を記憶

**モジュール（Module）:**
関連する関数や変数をまとめた単位

**モジュールの利点:**
- 名前空間の分離
- コードの再利用性向上
- 保守性の向上
- チーム開発の効率化
- テストの容易さ

**モジュール化の手法:**
- ファイル分割
- 名前空間の使用
- パッケージ管理
- インポート/エクスポート機能

**ライブラリとフレームワーク:**
- ライブラリ: 再利用可能な関数群
- フレームワーク: アプリケーション構造の雛形
- API: プログラム間のインターフェース`,
        quizzes: [
          {
            question: '純粋関数の特徴として正しいものはどれか？',
            options: ['必ず引数を持つ', '副作用がなく、同じ入力に対して同じ出力を返す', '戻り値を持たない', 'グローバル変数を変更する'],
            correct: 1,
            explanation: '純粋関数は副作用（外部状態の変更）がなく、同じ入力に対して常に同じ出力を返す関数です。これによりテストやデバッグが容易になります。'
          },
          {
            question: '値渡しと参照渡しの違いについて正しいものはどれか？',
            options: ['値渡しは遅く、参照渡しは速い', '値渡しは値のコピー、参照渡しはアドレスを渡す', '値渡しは配列専用、参照渡しは基本型専用', '値渡しと参照渡しは同じ'],
            correct: 1,
            explanation: '値渡しは引数の値をコピーして渡すため呼び出し元に影響しませんが、参照渡しはメモリアドレスを渡すため関数内の変更が呼び出し元に影響します。'
          },
          {
            question: '再帰関数の必要条件として誤っているものはどれか？',
            options: ['基底条件（終了条件）', '問題を小さくする処理', 'ループ処理', '自分自身の呼び出し'],
            correct: 2,
            explanation: '再帰関数にはループ処理は必要ありません。基底条件、問題を小さくする処理、自分自身の呼び出しが必要な要素です。'
          },
          {
            question: '高階関数の特徴として正しいものはどれか？',
            options: ['実行速度が常に高速', '関数を引数として受け取る、または戻り値として返す', '必ず再帰処理を含む', 'メモリ使用量が少ない'],
            correct: 1,
            explanation: '高階関数は、関数を引数として受け取ったり、関数を戻り値として返したりする関数です。関数型プログラミングの重要な概念です。'
          },
          {
            question: 'void関数の特徴として正しいものはどれか？',
            options: ['引数を持てない', '戻り値がない', '再帰呼び出しできない', 'グローバル変数にアクセスできない'],
            correct: 1,
            explanation: 'void関数は戻り値を持たない関数で、主に副作用（画面出力、ファイル書き込み、グローバル変数の変更など）のために使用されます。'
          },
          {
            question: 'デフォルト引数の利点として適切でないものはどれか？',
            options: ['関数呼び出しの簡略化', '後方互換性の維持', '実行速度の向上', 'API設計の柔軟性'],
            correct: 2,
            explanation: 'デフォルト引数は関数呼び出しの簡略化や柔軟なAPI設計には有効ですが、実行速度の向上には直接的には寄与しません。'
          },
          {
            question: 'モジュール化の主な目的として適切でないものはどれか？',
            options: ['名前空間の分離', 'コードの再利用性向上', '実行速度の高速化', '保守性の向上'],
            correct: 2,
            explanation: 'モジュール化の主な目的は、名前空間の分離、再利用性向上、保守性向上であり、実行速度の高速化は主目的ではありません。'
          },
          {
            question: '関数のオーバーロードが可能な言語の条件は？',
            options: ['動的型付け言語', '静的型付け言語', 'インタープリタ言語', 'コンパイラ言語'],
            correct: 1,
            explanation: '関数のオーバーロードは、コンパイル時に引数の型や数で呼び出す関数を決定する必要があるため、静的型付け言語で可能です。'
          },
          {
            question: 'クロージャの特徴として正しいものはどれか？',
            options: ['関数が定義時の環境を記憶する', '必ずグローバル変数を使用する', '再帰処理専用の機能', 'C言語の標準機能'],
            correct: 0,
            explanation: 'クロージャは、関数が定義された時点での環境（変数の状態など）を記憶し、後でその環境にアクセスできる機能です。'
          },
          {
            question: '関数型プログラミングで推奨される関数の特徴は？',
            options: ['グローバル変数を多用する', '副作用を持つ', '純粋関数を使用する', 'オブジェクト指向を重視する'],
            correct: 2,
            explanation: '関数型プログラミングでは、副作用のない純粋関数の使用が推奨されます。これにより、予測可能で テストしやすいコードになります。'
          }
        ]
      }
    ]
  }
];

export default function AlgorithmsProgrammingPage() {
  const [activeModule, setActiveModule] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [completedQuizzes, setCompletedQuizzes] = useState<Set<string>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<{[key: string]: number}>({});
  const [showQuizResults, setShowQuizResults] = useState<{[key: string]: boolean}>({});
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);

  const currentModule = learningModules[activeModule];
  const currentSection = currentModule.sections[activeSection];
  const currentQuiz = currentSection.quizzes[currentQuizIndex];
  const quizKey = `${activeModule}-${activeSection}-${currentQuizIndex}`;

  const handleQuizAnswer = (answer: number) => {
    setQuizAnswers({...quizAnswers, [quizKey]: answer});
    setShowQuizResults({...showQuizResults, [quizKey]: true});

    if (answer === currentQuiz.correct) {
      setCompletedQuizzes(new Set([...completedQuizzes, quizKey]));
    }
  };

  const nextQuiz = () => {
    if (currentQuizIndex < currentSection.quizzes.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    }
  };

  const previousQuiz = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(currentQuizIndex - 1);
    }
  };

  const nextSection = () => {
    if (activeSection < currentModule.sections.length - 1) {
      setActiveSection(activeSection + 1);
      setCurrentQuizIndex(0);
    } else if (activeModule < learningModules.length - 1) {
      setActiveModule(activeModule + 1);
      setActiveSection(0);
      setCurrentQuizIndex(0);
    }
  };

  const previousSection = () => {
    if (activeSection > 0) {
      setActiveSection(activeSection - 1);
      setCurrentQuizIndex(0);
    } else if (activeModule > 0) {
      setActiveModule(activeModule - 1);
      setActiveSection(learningModules[activeModule - 1].sections.length - 1);
      setCurrentQuizIndex(0);
    }
  };

  const totalQuizzes = learningModules.reduce((acc, module) =>
    acc + module.sections.reduce((sectionAcc, section) =>
      sectionAcc + section.quizzes.length, 0), 0);

  const progress = (completedQuizzes.size / totalQuizzes) * 100;
  const sectionQuizProgress = currentSection.quizzes.filter((_, index) =>
    completedQuizzes.has(`${activeModule}-${activeSection}-${index}`)).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* モバイルヘッダー */}
      <div className="lg:hidden bg-white border-b sticky top-0 z-10">
        <div className="p-4">
          <Link
            href="/modules/it-fundamentals"
            className="inline-flex items-center text-purple-600 text-sm mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            戻る
          </Link>
          <h1 className="text-xl font-bold text-gray-900">アルゴリズムとプログラミング</h1>
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">全体進捗</span>
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
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-4 lg:py-8">
        {/* デスクトップヘッダー */}
        <div className="hidden lg:block mb-6">
          <Link
            href="/modules/it-fundamentals"
            className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            IT基礎に戻る
          </Link>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mr-4">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">アルゴリズムとプログラミング</h1>
                <p className="text-gray-600">基本情報技術者試験レベルの総合学習</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">{completedQuizzes.size}/{totalQuizzes}</div>
                <div className="text-sm text-gray-600">問題完了</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">学習進捗</span>
                <span className="text-gray-900 font-medium">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-purple-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* サイドバー - デスクトップ */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <h3 className="font-semibold mb-4 text-gray-900">学習モジュール</h3>
              <nav className="space-y-2">
                {learningModules.map((module, moduleIndex) => (
                  <div key={module.id}>
                    <button
                      onClick={() => {
                        setActiveModule(moduleIndex);
                        setActiveSection(0);
                        setCurrentQuizIndex(0);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                        activeModule === moduleIndex
                          ? 'bg-purple-50 text-purple-600 font-medium'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {module.title}
                    </button>
                    {activeModule === moduleIndex && (
                      <div className="ml-3 mt-1 space-y-1">
                        {module.sections.map((section, sectionIndex) => {
                          const sectionCompletedCount = section.quizzes.filter((_, qIndex) =>
                            completedQuizzes.has(`${moduleIndex}-${sectionIndex}-${qIndex}`)
                          ).length;

                          return (
                            <button
                              key={sectionIndex}
                              onClick={() => {
                                setActiveSection(sectionIndex);
                                setCurrentQuizIndex(0);
                              }}
                              className={`w-full text-left px-3 py-1.5 rounded text-xs flex items-center justify-between ${
                                activeSection === sectionIndex
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'hover:bg-gray-50 text-gray-600'
                              }`}
                            >
                              <span className="flex items-center">
                                {sectionCompletedCount === section.quizzes.length ? (
                                  <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                                ) : (
                                  <Circle className="w-3 h-3 mr-2" />
                                )}
                                {section.title}
                              </span>
                              <span className="text-xs">
                                {sectionCompletedCount}/{section.quizzes.length}
                              </span>
                            </button>
                          );
                        })}
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
                    <span className="font-medium">{totalQuizzes}問</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">完了済み</span>
                    <span className="font-medium text-green-600">{completedQuizzes.size}問</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">正答率</span>
                    <span className="font-medium">{completedQuizzes.size > 0 ? Math.round(progress) : 0}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* モバイルナビゲーション */}
          <div className="lg:hidden bg-white rounded-lg shadow-sm p-4 mb-4">
            <select
              value={`${activeModule}-${activeSection}`}
              onChange={(e) => {
                const [moduleIndex, sectionIndex] = e.target.value.split('-').map(Number);
                setActiveModule(moduleIndex);
                setActiveSection(sectionIndex);
                setCurrentQuizIndex(0);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {learningModules.map((module, moduleIndex) => (
                <optgroup key={module.id} label={module.title}>
                  {module.sections.map((section, sectionIndex) => (
                    <option key={sectionIndex} value={`${moduleIndex}-${sectionIndex}`}>
                      {section.title}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* メインコンテンツ */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 lg:p-6">
                {/* セクションヘッダー */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                  <div className="flex items-center mb-4 lg:mb-0">
                    <BookOpen className="w-5 h-5 text-purple-500 mr-2" />
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900">{currentSection.title}</h2>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                      {currentModule.title}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                      {sectionQuizProgress}/{currentSection.quizzes.length} 問完了
                    </span>
                  </div>
                </div>

                {/* 学習コンテンツ */}
                <div className="mb-8">
                  <div className="prose prose-sm lg:prose max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm lg:text-base">
                      {currentSection.content}
                    </div>
                  </div>
                </div>

                {/* 問題エリア */}
                <div className="border-t pt-6">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 lg:p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 flex items-center text-lg mb-2 lg:mb-0">
                        <span className="text-2xl mr-2">🎯</span>
                        理解度チェック
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">問題</span>
                        <span className="px-2 py-1 bg-white rounded-lg text-sm font-medium">
                          {currentQuizIndex + 1} / {currentSection.quizzes.length}
                        </span>
                      </div>
                    </div>

                    {/* 問題インジケーター */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {currentSection.quizzes.map((_, index) => {
                        const isCompleted = completedQuizzes.has(`${activeModule}-${activeSection}-${index}`);
                        const isCurrent = index === currentQuizIndex;
                        const hasAnswer = quizAnswers[`${activeModule}-${activeSection}-${index}`] !== undefined;

                        return (
                          <button
                            key={index}
                            onClick={() => setCurrentQuizIndex(index)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                              isCurrent
                                ? 'bg-purple-600 text-white shadow-lg scale-110'
                                : isCompleted
                                ? 'bg-green-500 text-white'
                                : hasAnswer
                                ? 'bg-yellow-500 text-white'
                                : 'bg-white text-gray-600 border border-gray-300'
                            }`}
                          >
                            {index + 1}
                          </button>
                        );
                      })}
                    </div>

                    <p className="text-gray-700 mb-6 text-sm lg:text-base font-medium">
                      {currentQuiz.question}
                    </p>

                    <div className="space-y-3">
                      {currentQuiz.options.map((option, index) => {
                        const isSelected = quizAnswers[quizKey] === index;
                        const isCorrect = index === currentQuiz.correct;
                        const showResult = showQuizResults[quizKey];

                        return (
                          <button
                            key={index}
                            onClick={() => handleQuizAnswer(index)}
                            disabled={showResult}
                            className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all text-sm lg:text-base ${
                              showResult
                                ? isCorrect
                                  ? 'bg-green-50 border-green-400 text-green-700'
                                  : isSelected
                                  ? 'bg-red-50 border-red-400 text-red-700'
                                  : 'bg-gray-50 border-gray-200 text-gray-500'
                                : isSelected
                                ? 'bg-purple-50 border-purple-400 text-purple-700'
                                : 'hover:bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option}</span>
                              {showResult && (
                                <span className="ml-2">
                                  {isCorrect ? (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                  ) : isSelected ? (
                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                  ) : null}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {showQuizResults[quizKey] && (
                      <div className={`mt-6 p-4 rounded-lg ${
                        quizAnswers[quizKey] === currentQuiz.correct
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                      }`}>
                        <div className="flex items-start">
                          <span className="text-xl mr-2">
                            {quizAnswers[quizKey] === currentQuiz.correct ? '✅' : '💡'}
                          </span>
                          <div>
                            <p className="font-semibold mb-1">
                              {quizAnswers[quizKey] === currentQuiz.correct ? '正解です！' : '解説'}
                            </p>
                            <p className="text-sm">{currentQuiz.explanation}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 問題ナビゲーション */}
                    <div className="flex justify-between mt-6">
                      <button
                        onClick={previousQuiz}
                        disabled={currentQuizIndex === 0}
                        className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
                      >
                        ← 前の問題
                      </button>
                      <button
                        onClick={nextQuiz}
                        disabled={currentQuizIndex === currentSection.quizzes.length - 1}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
                      >
                        次の問題 →
                      </button>
                    </div>
                  </div>
                </div>

                {/* セクションナビゲーション */}
                <div className="flex flex-col lg:flex-row justify-between gap-4 mt-8">
                  <button
                    onClick={previousSection}
                    disabled={activeModule === 0 && activeSection === 0}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm lg:text-base"
                  >
                    ← 前のセクション
                  </button>

                  {/* 達成度表示 */}
                  {sectionQuizProgress === currentSection.quizzes.length && (
                    <div className="flex items-center justify-center px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                      <Trophy className="w-5 h-5 mr-2" />
                      <span className="font-medium">セクション完了！</span>
                    </div>
                  )}

                  <button
                    onClick={nextSection}
                    disabled={activeModule === learningModules.length - 1 && activeSection === currentModule.sections.length - 1}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-sm lg:text-base"
                  >
                    次のセクション
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>

            {/* モバイル用固定フッター */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4">
              <div className="flex justify-between text-sm">
                <div>
                  <span className="text-gray-600">現在の問題: </span>
                  <span className="font-medium">{currentQuizIndex + 1}/{currentSection.quizzes.length}</span>
                </div>
                <div>
                  <span className="text-gray-600">セクション完了: </span>
                  <span className="font-medium text-green-600">{sectionQuizProgress}/{currentSection.quizzes.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}