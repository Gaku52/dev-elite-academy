'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, CheckCircle, Circle, ChevronRight, Calculator, AlertCircle, Trophy } from 'lucide-react';
import { useLearningProgress } from '@/hooks/useLearningProgress';

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
    title: 'コンピュータの基本構成',
    sections: [
      {
        title: '五大装置',
        content: `コンピュータは以下の5つの基本装置で構成されています：

1. **入力装置**: キーボード、マウス、スキャナ、タッチパネル、音声認識装置など
   - データや命令をコンピュータに入力
   - ユーザーインターフェースの重要な部分

2. **出力装置**: ディスプレイ、プリンタ、スピーカー、プロジェクターなど
   - 処理結果を人間が理解できる形で出力
   - 視覚的・聴覚的な情報提示

3. **記憶装置**: RAM、ROM、HDD、SSD、光学ディスクなど
   - プログラムやデータを保存
   - 主記憶装置と補助記憶装置に分類

4. **演算装置（ALU）**: 算術論理演算装置
   - 四則演算、論理演算、比較演算を実行
   - CPUの中核的な構成要素

5. **制御装置**: プログラムカウンタ、命令レジスタ、デコーダなど
   - プログラムの実行制御
   - 各装置間の連携調整

これらが連携してフォン・ノイマン型コンピュータを構成し、プログラム内蔵方式により柔軟な処理を実現します。`,
        quizzes: [
          {
            question: 'CPUに含まれる装置はどれですか？',
            options: ['入力装置と出力装置', '演算装置と制御装置', '記憶装置と入力装置', '出力装置と記憶装置'],
            correct: 1,
            explanation: 'CPUは演算装置（ALU）と制御装置を中心に構成されます。これにレジスタやキャッシュメモリを加えて中央処理装置として機能します。'
          },
          {
            question: 'フォン・ノイマン型コンピュータの特徴として正しいものはどれか？',
            options: ['プログラムを外部から読み込む方式', 'プログラムを主記憶装置に格納して実行する方式', 'プログラムを補助記憶装置から直接実行する方式', 'プログラムをROMに固定する方式'],
            correct: 1,
            explanation: 'フォン・ノイマン型コンピュータは、プログラム内蔵方式を採用し、プログラムとデータを主記憶装置に格納して逐次実行します。'
          },
          {
            question: '次のうち、入力装置に分類されないものはどれか？',
            options: ['バーコードリーダー', 'デジタイザ', 'プロッタ', 'OCR装置'],
            correct: 2,
            explanation: 'プロッタは図形や文字を紙に描画する出力装置です。バーコードリーダー、デジタイザ、OCR装置はすべて入力装置です。'
          },
          {
            question: '五大装置のうち、データの一時的な保持を行うのはどれか？',
            options: ['入力装置', '出力装置', '記憶装置', '演算装置'],
            correct: 2,
            explanation: '記憶装置はデータやプログラムを一時的または永続的に保持します。特に主記憶装置（RAM）は一時的な保持を行います。'
          },
          {
            question: 'ALU（算術論理演算装置）が実行しない演算はどれか？',
            options: ['加算', '論理積（AND）', 'データ転送', '比較演算'],
            correct: 2,
            explanation: 'データ転送は制御装置が管理する処理です。ALUは算術演算（加減乗除）、論理演算（AND、OR、NOT等）、比較演算を実行します。'
          }
        ]
      },
      {
        title: 'CPU（中央処理装置）',
        content: `CPUはコンピュータの頭脳として機能し、以下の要素で構成されます：

**主な構成要素:**

1. **制御装置（Control Unit）**
   - プログラムカウンタ（PC）: 次に実行する命令のアドレスを保持
   - 命令レジスタ（IR）: 現在実行中の命令を保持
   - 命令デコーダ: 命令を解読して制御信号を生成
   - タイミング制御回路: 各処理のタイミングを調整

2. **演算装置（ALU: Arithmetic Logic Unit）**
   - 算術演算: 加減乗除、インクリメント、デクリメント
   - 論理演算: AND、OR、NOT、XOR、シフト演算
   - 比較演算: 大小比較、等値判定

3. **レジスタ群**
   - 汎用レジスタ: データの一時保存用
   - 特殊レジスタ: PC、SP（スタックポインタ）、PSW（プログラム状態語）
   - インデックスレジスタ: アドレス計算用
   - ベースレジスタ: 基準アドレス保持用

4. **キャッシュメモリ**
   - L1キャッシュ: 最も高速、容量小（数十KB）
   - L2キャッシュ: 中速、中容量（数百KB〜数MB）
   - L3キャッシュ: 低速、大容量（数MB〜数十MB）

**性能指標:**
- クロック周波数: 1秒間の動作回数（GHz）
- IPC（Instructions Per Cycle）: 1サイクルで実行できる命令数
- コア数: 並列処理能力
- スレッド数: 同時実行可能なスレッド数
- TDP（Thermal Design Power）: 熱設計電力`,
        quizzes: [
          {
            question: 'CPUの性能を表す指標として適切でないものはどれか？',
            options: ['クロック周波数', 'コア数', 'キャッシュサイズ', 'ハードディスク容量'],
            correct: 3,
            explanation: 'ハードディスク容量は補助記憶装置の指標であり、CPU性能とは直接関係ありません。'
          },
          {
            question: 'プログラムカウンタ（PC）の役割として正しいものはどれか？',
            options: ['現在実行中の命令を保持', '次に実行する命令のアドレスを保持', '演算結果を一時保存', 'スタックの先頭アドレスを保持'],
            correct: 1,
            explanation: 'プログラムカウンタは次に実行する命令のメモリアドレスを保持します。現在実行中の命令は命令レジスタが保持します。'
          },
          {
            question: 'キャッシュメモリについて誤っているものはどれか？',
            options: ['L1キャッシュが最も高速である', 'L3キャッシュは複数のコアで共有される場合がある', 'キャッシュメモリは揮発性メモリである', 'キャッシュサイズが大きいほど必ず性能が向上する'],
            correct: 3,
            explanation: 'キャッシュサイズが大きすぎると、検索時間が増加して逆に性能が低下する場合があります。適切なサイズとアルゴリズムが重要です。'
          },
          {
            question: 'RISC型CPUの特徴として正しいものはどれか？',
            options: ['命令の種類が多い', '命令長が可変', '単純な命令セット', '1命令の実行サイクルが不定'],
            correct: 2,
            explanation: 'RISC（Reduced Instruction Set Computer）は単純な命令セット、固定長命令、1サイクル実行を特徴とします。'
          },
          {
            question: 'マルチコアCPUの利点として適切でないものはどれか？',
            options: ['並列処理による性能向上', '消費電力効率の改善', 'すべてのプログラムが自動的に高速化', '複数タスクの同時実行'],
            correct: 2,
            explanation: 'マルチコアCPUを活用するには、プログラムが並列処理に対応している必要があります。単一スレッドのプログラムは自動的に高速化されません。'
          },
          {
            question: 'パイプライン処理の説明として正しいものはどれか？',
            options: ['複数の命令を同時に実行する', '命令を複数段階に分けて並列実行する', '命令を圧縮して実行する', '命令をキャッシュに保存して実行する'],
            correct: 1,
            explanation: 'パイプライン処理は命令実行を複数段階（フェッチ、デコード、実行、メモリアクセス、ライトバック）に分け、各段階を並列実行します。'
          },
          {
            question: 'スーパースカラ方式の説明として正しいものはどれか？',
            options: ['クロック周波数を上げる技術', '複数の演算器で同時に複数命令を実行', 'メモリアクセスを高速化する技術', 'キャッシュメモリを増やす技術'],
            correct: 1,
            explanation: 'スーパースカラは複数の演算器を持ち、1サイクルで複数の命令を同時実行する方式です。'
          },
          {
            question: 'CPUの割り込み処理について正しいものはどれか？',
            options: ['現在の処理を破棄して割り込み処理を実行', '現在の状態を保存してから割り込み処理を実行', '割り込みは無視される', '割り込み処理後はシステムを再起動'],
            correct: 1,
            explanation: '割り込み発生時は、現在の状態（レジスタ値等）を保存してから割り込み処理を実行し、終了後に元の処理を再開します。'
          }
        ]
      },
      {
        title: '命令実行サイクル',
        content: `CPUは命令を以下のサイクルで実行します：

**基本的な命令実行サイクル:**

1. **フェッチ（Fetch）段階**
   - プログラムカウンタが示すアドレスから命令を読み出し
   - 命令を命令レジスタに格納
   - プログラムカウンタを次の命令アドレスに更新

2. **デコード（Decode）段階**
   - 命令デコーダが命令を解読
   - 必要なオペランドを特定
   - 制御信号を生成

3. **実行（Execute）段階**
   - ALUで演算を実行
   - アドレス計算
   - 分岐判定

4. **メモリアクセス（Memory Access）段階**
   - 必要に応じてメモリの読み書き
   - キャッシュメモリの活用

5. **ライトバック（Write Back）段階**
   - 演算結果をレジスタに書き戻し
   - フラグレジスタの更新

**高速化技術:**
- パイプライン処理: 各段階を並列実行
- スーパーパイプライン: パイプラインをさらに細分化
- 分岐予測: 条件分岐の結果を予測して投機実行
- アウトオブオーダー実行: 依存関係のない命令を順序変更して実行`,
        quizzes: [
          {
            question: '命令実行サイクルの正しい順序はどれか？',
            options: ['実行→フェッチ→デコード→メモリアクセス→ライトバック', 'フェッチ→デコード→実行→メモリアクセス→ライトバック', 'デコード→フェッチ→実行→ライトバック→メモリアクセス', 'フェッチ→実行→デコード→ライトバック→メモリアクセス'],
            correct: 1,
            explanation: '命令実行の基本サイクルは、フェッチ→デコード→実行→メモリアクセス→ライトバックの順序で行われます。'
          },
          {
            question: 'パイプラインハザードの種類でないものはどれか？',
            options: ['構造ハザード', 'データハザード', '制御ハザード', 'メモリハザード'],
            correct: 3,
            explanation: 'パイプラインハザードには構造ハザード（資源競合）、データハザード（データ依存）、制御ハザード（分岐）の3種類があります。'
          },
          {
            question: '分岐予測の目的として正しいものはどれか？',
            options: ['メモリアクセスを削減する', 'パイプラインストールを削減する', 'レジスタ数を増やす', 'キャッシュサイズを最適化する'],
            correct: 1,
            explanation: '分岐予測は条件分岐の結果を予測することで、パイプラインストール（停止）を削減し、処理効率を向上させます。'
          },
          {
            question: 'CPI（Cycles Per Instruction）が2.0のCPUが100個の命令を実行するのに必要なサイクル数は？',
            options: ['50サイクル', '100サイクル', '200サイクル', '400サイクル'],
            correct: 2,
            explanation: 'CPI=2.0は1命令あたり平均2サイクル必要という意味。100個の命令では100×2=200サイクル必要です。'
          },
          {
            question: 'アウトオブオーダー実行の利点はどれか？',
            options: ['プログラムの記述が簡単になる', 'データ依存による待機時間を削減できる', 'メモリ使用量を削減できる', 'プログラムサイズを小さくできる'],
            correct: 1,
            explanation: 'アウトオブオーダー実行は、データ依存のない命令を先に実行することで、CPUの遊休時間を削減します。'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'メモリと記憶装置',
    sections: [
      {
        title: '主記憶装置（メインメモリ）',
        content: `主記憶装置はCPUが直接アクセスできる記憶装置です：

**RAM（Random Access Memory）- 揮発性メモリ:**

1. **DRAM（Dynamic RAM）**
   - コンデンサに電荷を蓄えて記憶
   - 定期的なリフレッシュ（再充電）が必要
   - 安価で大容量化が容易
   - アクセス速度: 数十ナノ秒

   種類:
   - SDRAM: クロックに同期して動作
   - DDR SDRAM: データ転送をクロックの立ち上がり/立ち下がりで実行
   - DDR2/3/4/5: 転送速度を段階的に向上

2. **SRAM（Static RAM）**
   - フリップフロップ回路で記憶
   - リフレッシュ不要で高速
   - 高価で集積度が低い
   - キャッシュメモリに使用
   - アクセス速度: 数ナノ秒

**ROM（Read Only Memory）- 不揮発性メモリ:**

1. **マスクROM**: 製造時に内容を固定
2. **PROM**: 一度だけプログラム可能
3. **EPROM**: 紫外線で消去可能
4. **EEPROM**: 電気的に消去・書き込み可能
5. **フラッシュメモリ**: EEPROMの発展型、ブロック単位で消去

**メモリの階層構造:**
レジスタ → L1キャッシュ → L2キャッシュ → L3キャッシュ → 主記憶 → 補助記憶
（高速・小容量・高価） ← → （低速・大容量・安価）`,
        quizzes: [
          {
            question: 'DRAMの特徴として正しいものはどれか？',
            options: ['不揮発性メモリである', '定期的なリフレッシュが必要', '読み込み専用である', 'SRAMより高速である'],
            correct: 1,
            explanation: 'DRAMはコンデンサの電荷で記憶するため、定期的なリフレッシュ（再充電）が必要です。'
          },
          {
            question: 'キャッシュメモリに主に使用される記憶素子はどれか？',
            options: ['DRAM', 'SRAM', 'マスクROM', 'フラッシュメモリ'],
            correct: 1,
            explanation: 'SRAMは高速アクセスが可能なため、キャッシュメモリに使用されます。'
          },
          {
            question: 'DDR4-3200の「3200」が示すものは何か？',
            options: ['動作周波数（MHz）', 'データ転送レート（MT/s）', 'メモリ容量（MB）', 'レイテンシ（ns）'],
            correct: 1,
            explanation: 'DDR4-3200の3200はデータ転送レート3200MT/s（Mega Transfers per second）を示します。'
          },
          {
            question: '不揮発性メモリはどれか？',
            options: ['DRAM', 'SRAM', 'フラッシュメモリ', 'レジスタ'],
            correct: 2,
            explanation: 'フラッシュメモリは電源を切ってもデータが保持される不揮発性メモリです。'
          },
          {
            question: 'メモリインターリーブの目的は何か？',
            options: ['メモリ容量の増加', 'メモリアクセスの高速化', 'メモリの省電力化', 'メモリエラーの検出'],
            correct: 1,
            explanation: 'メモリインターリーブは複数のメモリバンクに並列アクセスすることで、実効的なアクセス速度を向上させます。'
          },
          {
            question: 'ECC（Error Correcting Code）メモリの特徴は？',
            options: ['アクセス速度が通常のメモリより速い', '1ビットエラーを訂正、2ビットエラーを検出できる', 'メモリ容量が2倍になる', '消費電力が半分になる'],
            correct: 1,
            explanation: 'ECCメモリは1ビットエラーの自動訂正と2ビットエラーの検出が可能で、信頼性が求められるサーバー等で使用されます。'
          },
          {
            question: '仮想記憶で使用される単位はどれか？',
            options: ['セクタ', 'ページ', 'クラスタ', 'シリンダ'],
            correct: 1,
            explanation: '仮想記憶では、メモリをページという固定サイズの単位で管理します。'
          },
          {
            question: 'キャッシュメモリのヒット率が90%の時、平均アクセス時間を求める式は？（キャッシュ:10ns、主記憶:100ns）',
            options: ['10×0.9 + 100×0.1 = 19ns', '10×0.9 + 110×0.1 = 20ns', '10 + 100×0.1 = 20ns', '100×0.9 + 10×0.1 = 91ns'],
            correct: 1,
            explanation: 'ミス時はキャッシュと主記憶の両方にアクセスするため、10×0.9 + (10+100)×0.1 = 20nsが正解です。'
          }
        ]
      },
      {
        title: '補助記憶装置',
        content: `補助記憶装置は大容量のデータを永続的に保存します：

**HDD（Hard Disk Drive）- 磁気ディスク装置:**

構造と動作:
- プラッタ（磁気ディスク）: データ記録面
- 磁気ヘッド: データの読み書き
- アクチュエータ: ヘッドの移動制御
- スピンドルモーター: ディスクの回転

性能指標:
- 容量: 数TB〜数十TB
- 回転数: 5400rpm、7200rpm、10000rpm、15000rpm
- シーク時間: 平均8-12ms
- 転送速度: 100-200MB/s（SATA）
- インターフェース: SATA、SAS、IDE（旧式）

**SSD（Solid State Drive）- フラッシュメモリ装置:**

種類と特性:
- NAND型フラッシュメモリを使用
- SLC（1bit/cell）: 高速・高耐久・高価
- MLC（2bit/cell）: 中速・中耐久・中価格
- TLC（3bit/cell）: 低速・低耐久・安価
- QLC（4bit/cell）: 大容量・低価格

性能と特徴:
- アクセス時間: 0.1ms以下
- 転送速度: 500MB/s（SATA）、3500MB/s以上（NVMe）
- 静音・低消費電力・耐衝撃性
- ウェアレベリング: 書き込み回数の均等化
- TRIM: 削除済みデータの物理削除

**光学ディスク:**
- CD: 700MB、レーザー波長780nm（赤外線）
- DVD: 4.7GB（片面1層）、650nm（赤色）
- Blu-ray: 25GB（1層）、405nm（青紫色）

**テープ装置:**
- LTO（Linear Tape-Open）: 最大12TB（非圧縮）
- 長期アーカイブ用途
- シーケンシャルアクセスのみ`,
        quizzes: [
          {
            question: 'SSDの特徴として誤っているものはどれか？',
            options: ['フラッシュメモリを使用', '機械的動作部分がない', 'HDDより安価', '高速アクセスが可能'],
            correct: 2,
            explanation: 'SSDは一般的にHDDより高価です（容量単価）。ただし価格差は縮小傾向にあります。'
          },
          {
            question: 'HDDのシーク時間とは何か？',
            options: ['ディスクが1回転する時間', 'ヘッドが目的トラックに移動する時間', 'データを転送する時間', '電源投入から使用可能になる時間'],
            correct: 1,
            explanation: 'シーク時間は磁気ヘッドが目的のトラックまで移動する時間です。'
          },
          {
            question: 'RAID 5の特徴として正しいものはどれか？',
            options: ['ミラーリングによる冗長化', 'パリティによる冗長化で1台故障まで復旧可能', 'ストライピングのみで冗長性なし', '2台同時故障まで復旧可能'],
            correct: 1,
            explanation: 'RAID 5はパリティ情報を分散保存し、1台のディスク故障までデータ復旧が可能です。'
          },
          {
            question: 'NVMe SSDの接続インターフェースは？',
            options: ['SATA', 'IDE', 'PCIe', 'SCSI'],
            correct: 2,
            explanation: 'NVMe（Non-Volatile Memory Express）はPCIeインターフェースを使用し、高速データ転送を実現します。'
          },
          {
            question: 'Blu-rayディスクの記録に使用するレーザーの波長は？',
            options: ['780nm', '650nm', '405nm', '350nm'],
            correct: 2,
            explanation: 'Blu-rayは405nm（青紫色）のレーザーを使用し、高密度記録を実現します。'
          },
          {
            question: 'SSDのウェアレベリングの目的は？',
            options: ['アクセス速度の向上', '書き込み回数の均等化による寿命延長', 'データ圧縮による容量節約', 'エラー訂正の実行'],
            correct: 1,
            explanation: 'ウェアレベリングは全セルの書き込み回数を均等化し、特定セルの劣化を防いでSSD全体の寿命を延ばします。'
          },
          {
            question: 'RAID 0の特徴は？',
            options: ['ミラーリングによる冗長化', 'ストライピングによる高速化、冗長性なし', 'パリティによる冗長化', 'ホットスペアの自動切り替え'],
            correct: 1,
            explanation: 'RAID 0はストライピングでデータを分散し高速化しますが、冗長性がないため1台故障でデータを失います。'
          },
          {
            question: 'M.2 SSDの形状規格「2280」の意味は？',
            options: ['転送速度2280MB/s', '容量2280GB', '幅22mm、長さ80mm', '消費電力22.80W'],
            correct: 2,
            explanation: 'M.2の規格表記は幅と長さを示します。2280は幅22mm、長さ80mmを意味します。'
          },
          {
            question: 'HDDの記録密度を向上させる技術はどれか？',
            options: ['垂直磁気記録（PMR）', 'ウェアレベリング', 'TRIM', 'デフラグメンテーション'],
            correct: 0,
            explanation: '垂直磁気記録（PMR）は磁性体を垂直方向に配列することで、従来の水平磁気記録より高密度化を実現します。'
          },
          {
            question: 'テープ装置の利点として適切でないものは？',
            options: ['大容量データの保存', '長期保存の信頼性', 'ランダムアクセスの高速性', '容量単価の安さ'],
            correct: 2,
            explanation: 'テープ装置はシーケンシャルアクセスのため、ランダムアクセスは非常に遅いです。'
          }
        ]
      },
      {
        title: 'メモリ管理技術',
        content: `効率的なメモリ利用のための各種技術：

**仮想記憶（Virtual Memory）:**
- 物理メモリより大きなアドレス空間を提供
- ページング: 固定サイズのページ単位で管理
- セグメンテーション: 可変サイズのセグメント単位で管理
- スワッピング: メモリ-ディスク間のページ交換

**ページング方式:**
- ページサイズ: 通常4KB（x86/x64）
- ページテーブル: 仮想→物理アドレス変換
- TLB（Translation Lookaside Buffer）: アドレス変換の高速化
- デマンドページング: 必要時にページをロード
- ページ置換アルゴリズム:
  - FIFO: 最も古いページを置換
  - LRU: 最も長く未使用のページを置換
  - LFU: 最も使用頻度の低いページを置換

**メモリ保護機構:**
- メモリ保護キー
- 実行禁止ビット（NXビット）
- アドレス空間配置のランダム化（ASLR）

**キャッシュメモリ管理:**
- 直接マッピング: 1対1対応
- 完全連想マッピング: 任意の場所に格納
- セット連想マッピング: 折衷方式
- ライトスルー: 同時に主記憶に書き込み
- ライトバック: キャッシュ追い出し時に書き込み`,
        quizzes: [
          {
            question: 'ページフォルトが発生する原因は？',
            options: ['キャッシュミス', 'アクセスしたページが物理メモリに存在しない', 'CPUの故障', 'ハードディスクの故障'],
            correct: 1,
            explanation: 'ページフォルトは、アクセスしようとしたページが物理メモリに存在しない時に発生します。'
          },
          {
            question: 'TLB（Translation Lookaside Buffer）の役割は？',
            options: ['エラー訂正', 'アドレス変換の高速化', 'データ圧縮', 'メモリの冗長化'],
            correct: 1,
            explanation: 'TLBは仮想アドレスから物理アドレスへの変換情報をキャッシュし、アドレス変換を高速化します。'
          },
          {
            question: 'スラッシングとは何か？',
            options: ['メモリの物理的破壊', 'ページの入れ替えが頻発して処理が進まない状態', 'キャッシュのヒット率100%', 'メモリリークの発生'],
            correct: 1,
            explanation: 'スラッシングは過度なページングにより、ページの入れ替えに時間を費やし実際の処理が進まない状態です。'
          },
          {
            question: 'LRUページ置換アルゴリズムの動作は？',
            options: ['ランダムにページを選択', '最も古くロードされたページを置換', '最も長く使われていないページを置換', '最も頻繁に使われるページを置換'],
            correct: 2,
            explanation: 'LRU（Least Recently Used）は最も長い間参照されていないページを置換対象とします。'
          },
          {
            question: 'キャッシュのライトスルー方式の特徴は？',
            options: ['書き込み時、キャッシュと主記憶に同時書き込み', 'キャッシュのみに書き込み', '主記憶のみに書き込み', 'キャッシュ追い出し時に主記憶に書き込み'],
            correct: 0,
            explanation: 'ライトスルーは書き込み時にキャッシュと主記憶の両方を更新し、データの一貫性を保ちます。'
          },
          {
            question: 'セット連想マッピングの特徴は？',
            options: ['完全にランダムな配置', '1対1の固定配置', '複数の候補位置から選択可能', 'キャッシュを使用しない'],
            correct: 2,
            explanation: 'セット連想マッピングは、各データが格納可能な複数の位置（セット）を持ち、その中から選択します。'
          },
          {
            question: 'ワーキングセットとは？',
            options: ['CPUの動作周波数', 'プロセスが頻繁にアクセスするページの集合', 'ハードディスクの作業領域', 'ネットワークの帯域幅'],
            correct: 1,
            explanation: 'ワーキングセットは、ある期間にプロセスが頻繁にアクセスするページの集合で、必要最小限のメモリ量の指標となります。'
          },
          {
            question: 'メモリリークの説明として正しいものは？',
            options: ['メモリの物理的な液漏れ', '確保したメモリを解放せず使用可能メモリが減少', 'メモリアクセス速度の低下', 'メモリ容量の自動増加'],
            correct: 1,
            explanation: 'メモリリークは、プログラムが確保したメモリを適切に解放しないことで、使用可能メモリが徐々に減少する現象です。'
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'オペレーティングシステム',
    sections: [
      {
        title: 'OSの役割と機能',
        content: `オペレーティングシステム（OS）はハードウェアとアプリケーションの仲介役です：

**OSの主要機能:**

1. **プロセス管理**
   - プロセスの生成・終了
   - CPU時間の割り当て（スケジューリング）
   - プロセス間通信（IPC）
   - 同期・排他制御
   - デッドロック対策

2. **メモリ管理**
   - メモリ空間の割り当て・解放
   - 仮想記憶の実現
   - メモリ保護
   - ガベージコレクション（一部のOS）

3. **ファイルシステム管理**
   - ファイル・ディレクトリの管理
   - アクセス権限の制御
   - ファイルの圧縮・暗号化
   - ジャーナリング機能

4. **デバイス管理**
   - デバイスドライバの管理
   - I/O制御
   - プラグアンドプレイ
   - 電源管理

5. **ユーザーインターフェース**
   - GUI（Graphical User Interface）
   - CLI（Command Line Interface）
   - API（Application Programming Interface）

**OSの種類と特徴:**

汎用OS:
- Windows: Microsoft、デスクトップ市場で最大シェア
- macOS: Apple、UNIX系、Mac専用
- Linux: オープンソース、サーバーで広く使用
- UNIX: 商用、高い信頼性と安定性

モバイルOS:
- iOS: Apple、iPhone/iPad用
- Android: Google、Linux kernel base

組み込みOS:
- RTOS（Real-Time OS）: リアルタイム処理
- TRON: 国産規格、家電等で使用`,
        quizzes: [
          {
            question: 'OSの基本機能に含まれないものはどれか？',
            options: ['プロセス管理', 'メモリ管理', '表計算処理', 'デバイス管理'],
            correct: 2,
            explanation: '表計算処理はアプリケーションソフトウェアの機能であり、OSの基本機能ではありません。'
          },
          {
            question: 'カーネルの役割として正しいものは？',
            options: ['ユーザーインターフェースの提供', 'OSの中核となる基本機能の提供', 'ウイルス対策の実行', 'ファイルの圧縮'],
            correct: 1,
            explanation: 'カーネルはOSの中核部分で、プロセス管理、メモリ管理、デバイス制御などの基本機能を提供します。'
          },
          {
            question: 'マイクロカーネル方式の特徴は？',
            options: ['すべての機能をカーネルに含む', '最小限の機能のみカーネルに含む', 'カーネルを使用しない', 'カーネルを複数持つ'],
            correct: 1,
            explanation: 'マイクロカーネルは最小限の機能（プロセス管理、メモリ管理等）のみを含み、他はユーザー空間で実行します。'
          },
          {
            question: 'システムコールとは何か？',
            options: ['電話による技術サポート', 'アプリケーションからOSの機能を呼び出す仕組み', 'システムの起動処理', 'エラー発生時の通知'],
            correct: 1,
            explanation: 'システムコールは、アプリケーションがOSの機能（ファイル操作、プロセス制御等）を利用するためのインターフェースです。'
          },
          {
            question: 'リアルタイムOSの特徴は？',
            options: ['処理速度が最も速い', '決められた時間内に処理を完了する', '最新の機能を持つ', 'グラフィック処理に特化'],
            correct: 1,
            explanation: 'リアルタイムOS（RTOS）は、定められた時間制約内で確実に処理を完了することを保証します。'
          },
          {
            question: 'プリエンプティブマルチタスクの説明として正しいものは？',
            options: ['タスクが自発的にCPUを解放', 'OSが強制的にタスク切り替え', 'シングルタスクのみ実行', 'タスクの優先度が同一'],
            correct: 1,
            explanation: 'プリエンプティブマルチタスクでは、OSがタイマー割り込み等で強制的にタスクを切り替えます。'
          },
          {
            question: 'デバイスドライバの役割は？',
            options: ['デバイスの物理的な駆動', 'OSとハードウェアの仲介', 'デバイスの電源管理のみ', 'ユーザー認証'],
            correct: 1,
            explanation: 'デバイスドライバは、OSと特定のハードウェアデバイスの間で通信を仲介するソフトウェアです。'
          },
          {
            question: 'ブートローダーの役割は？',
            options: ['ファイルの読み込み', 'OSの起動', 'アプリケーションの実行', 'ネットワーク接続'],
            correct: 1,
            explanation: 'ブートローダーは、コンピュータ起動時にOSをメモリにロードして起動する役割を持ちます。'
          },
          {
            question: 'APIの説明として適切なものは？',
            options: ['ハードウェアの仕様', 'アプリケーションがOSやライブラリの機能を利用するためのインターフェース', 'ネットワークプロトコル', 'ファイルフォーマット'],
            correct: 1,
            explanation: 'API（Application Programming Interface）は、プログラムが他のソフトウェアの機能を利用するための規約です。'
          },
          {
            question: '64ビットOSの利点として誤っているものは？',
            options: ['4GB以上のメモリを扱える', 'すべての32ビットアプリケーションが高速化する', '大きな数値計算が可能', 'より多くのレジスタを使用可能'],
            correct: 1,
            explanation: '32ビットアプリケーションは64ビットOS上でも32ビットモードで動作し、自動的に高速化はされません。'
          }
        ]
      },
      {
        title: 'プロセス管理',
        content: `OSはプロセス（実行中のプログラム）を効率的に管理します：

**プロセスとスレッド:**

プロセス:
- 独立したメモリ空間を持つ
- プロセス制御ブロック（PCB）で管理
- プロセス間通信にはIPCが必要
- 切り替えコストが大きい

スレッド:
- プロセス内で実行される軽量な処理単位
- メモリ空間を共有
- スレッド間でデータ共有が容易
- 切り替えコストが小さい

**プロセスの状態遷移:**
1. 生成状態: プロセスが作成された直後
2. 実行可能状態: CPU割り当て待ち
3. 実行状態: CPUを使用中
4. 待機状態: I/O完了等を待機
5. 終了状態: 処理完了

**スケジューリング方式:**

非プリエンプティブ:
- FCFS（First Come First Served）: 到着順
- SJF（Shortest Job First）: 処理時間が短い順
- 優先度順: 優先度の高い順

プリエンプティブ:
- ラウンドロビン: タイムスライス単位で順番に実行
- 多段フィードバック: 複数のキューを使用
- SRT（Shortest Remaining Time）: 残り時間が短い順

**プロセス間通信（IPC）:**
- パイプ: 単方向通信
- 名前付きパイプ: 双方向通信可能
- メッセージキュー: メッセージ単位の通信
- 共有メモリ: 高速なデータ共有
- ソケット: ネットワーク通信も可能
- セマフォ: 同期制御`,
        quizzes: [
          {
            question: 'ラウンドロビン方式の説明として正しいものは？',
            options: ['処理時間が短いジョブを優先', '各プロセスに順番に一定時間を割り当て', '優先度の高いプロセスを先に実行', '先着順で最後まで処理'],
            correct: 1,
            explanation: 'ラウンドロビンは各プロセスにタイムスライス（時間片）を順番に割り当てる方式です。'
          },
          {
            question: 'プロセスとスレッドの違いとして正しいものは？',
            options: ['プロセスはメモリを共有する', 'スレッドは独立したメモリ空間を持つ', 'スレッドはプロセス内でメモリを共有する', 'プロセスの方が切り替えコストが小さい'],
            correct: 2,
            explanation: 'スレッドは同一プロセス内でメモリ空間を共有するため、データ共有が容易で切り替えコストも小さいです。'
          },
          {
            question: 'プロセスが実行状態から待機状態に遷移する原因は？',
            options: ['タイムスライスの終了', 'I/O要求の発生', 'CPU割り当ての取得', 'プロセスの終了'],
            correct: 1,
            explanation: 'I/O要求が発生すると、プロセスは実行状態から待機状態に遷移し、I/O完了を待ちます。'
          },
          {
            question: 'デッドロックの発生条件でないものは？',
            options: ['相互排除', '占有と待機', '横取り可能', '循環待機'],
            correct: 2,
            explanation: 'デッドロックは「横取り不可」が条件の一つです。横取り可能ならデッドロックは発生しません。'
          },
          {
            question: 'コンテキストスイッチとは何か？',
            options: ['プロセスの新規作成', 'CPUの実行コンテキストの切り替え', 'メモリの解放', 'ファイルの切り替え'],
            correct: 1,
            explanation: 'コンテキストスイッチは、実行中のプロセスの状態を保存し、別のプロセスの状態を復元してCPUの実行を切り替える処理です。'
          },
          {
            question: 'セマフォの用途として適切なものは？',
            options: ['ファイル転送', 'プロセス間の同期制御', 'メモリの圧縮', 'ネットワーク通信'],
            correct: 1,
            explanation: 'セマフォは、複数のプロセス間で共有資源へのアクセスを制御する同期機構です。'
          },
          {
            question: 'タイムスライスが短すぎる場合の問題は？',
            options: ['応答性が悪化する', 'コンテキストスイッチのオーバーヘッドが増大', 'デッドロックが発生する', 'メモリ使用量が増加する'],
            correct: 1,
            explanation: 'タイムスライスが短すぎると、コンテキストスイッチが頻繁に発生し、オーバーヘッドが増大します。'
          },
          {
            question: 'プロセスの優先度逆転現象とは？',
            options: ['優先度が自動的に上がる', '低優先度プロセスが高優先度プロセスの実行を妨げる', '優先度が固定される', 'すべてのプロセスが同じ優先度になる'],
            correct: 1,
            explanation: '優先度逆転は、低優先度プロセスが資源を占有し、それを待つ高優先度プロセスが実行できない現象です。'
          },
          {
            question: 'フォークシステムコールの動作は？',
            options: ['プロセスを終了する', '子プロセスを生成する', 'ファイルを分割する', 'メモリを解放する'],
            correct: 1,
            explanation: 'fork()システムコールは、呼び出し元プロセスのコピーとなる子プロセスを生成します。'
          },
          {
            question: 'スレッドプールの利点は？',
            options: ['メモリ使用量の削減', 'スレッド生成・破棄のオーバーヘッド削減', 'CPUクロックの向上', 'ディスクアクセスの高速化'],
            correct: 1,
            explanation: 'スレッドプールは事前に生成したスレッドを再利用することで、生成・破棄のオーバーヘッドを削減します。'
          }
        ]
      },
      {
        title: 'ファイルシステム',
        content: `ファイルシステムはデータの永続的な保存と管理を行います：

**ファイルシステムの種類:**

Windows:
- FAT32: 古い規格、4GBファイルサイズ制限
- NTFS: Windows標準、大容量対応、アクセス権限、暗号化
- exFAT: FAT32の拡張、大容量対応、シンプル
- ReFS: 新しい規格、高信頼性

Linux/UNIX:
- ext4: Linux標準、ジャーナリング機能
- XFS: 高性能、大規模システム向け
- Btrfs: スナップショット、圧縮機能
- ZFS: 高信頼性、データ整合性重視

macOS:
- HFS+: 従来のMac標準
- APFS: 新しいMac標準、SSD最適化、暗号化

**ファイル管理機能:**

ディレクトリ構造:
- 階層型（ツリー構造）: 一般的
- フラット型: 単一階層
- ネットワーク型: 複数の親を持つ

ファイル属性:
- 名前、サイズ、作成日時、更新日時
- アクセス権限（読み取り、書き込み、実行）
- 所有者、グループ
- 隠し属性、システム属性

アクセス制御:
- DAC（Discretionary Access Control）: 任意アクセス制御
- MAC（Mandatory Access Control）: 強制アクセス制御
- ACL（Access Control List）: アクセス制御リスト

**ファイルの物理配置:**
- 連続配置: 高速だが断片化しやすい
- リンク配置: 柔軟だがオーバーヘッド大
- インデックス配置: iノード等を使用、UNIX系で採用`,
        quizzes: [
          {
            question: 'NTFS の特徴として誤っているものは？',
            options: ['ファイル単位の暗号化が可能', 'ファイルサイズは最大4GBまで', 'アクセス権限の設定が可能', 'ジャーナリング機能を持つ'],
            correct: 1,
            explanation: 'NTFSは非常に大きなファイル（理論上16EB）まで扱えます。4GB制限があるのはFAT32です。'
          },
          {
            question: 'ジャーナリングファイルシステムの利点は？',
            options: ['ファイルアクセスの高速化', 'システムクラッシュ後の高速復旧', 'ファイル圧縮率の向上', 'メモリ使用量の削減'],
            correct: 1,
            explanation: 'ジャーナリングは変更履歴を記録し、システムクラッシュ後のファイルシステムの整合性確認と復旧を高速化します。'
          },
          {
            question: 'iノードに含まれない情報は？',
            options: ['ファイルサイズ', 'ファイル名', 'アクセス権限', '作成日時'],
            correct: 1,
            explanation: 'iノードはファイルのメタデータを格納しますが、ファイル名はディレクトリエントリに保存されます。'
          },
          {
            question: 'シンボリックリンクの特徴は？',
            options: ['ファイルの実体をコピーする', 'パス名を記録する', 'ハードリンクと同じ', 'ディレクトリには作成できない'],
            correct: 1,
            explanation: 'シンボリックリンク（ソフトリンク）はパス名を記録し、ファイルやディレクトリを参照します。'
          },
          {
            question: 'ファイルシステムの断片化（フラグメンテーション）の影響は？',
            options: ['ファイルが削除される', 'アクセス速度が低下する', 'ファイルサイズが増加する', 'セキュリティが低下する'],
            correct: 1,
            explanation: '断片化によりファイルが不連続に配置されると、読み取り時のシーク回数が増えてアクセス速度が低下します。'
          },
          {
            question: 'RAID技術のファイルシステムレベルでの実装として適切なものは？',
            options: ['ソフトウェアRAID', 'ハードウェアRAID', 'ファームウェアRAID', 'ネットワークRAID'],
            correct: 0,
            explanation: 'ソフトウェアRAIDはOSのファイルシステムレベルで実装され、特別なハードウェアを必要としません。'
          },
          {
            question: 'クォータ（quota）機能の目的は？',
            options: ['ファイルの暗号化', 'ユーザーごとのディスク使用量制限', 'ファイルの圧縮', 'アクセス速度の向上'],
            correct: 1,
            explanation: 'クォータはユーザーまたはグループごとにディスク使用量を制限し、リソースの公平な配分を実現します。'
          },
          {
            question: 'スナップショット機能の説明として正しいものは？',
            options: ['画面の撮影', 'ある時点のファイルシステムの状態を保存', 'ファイルの圧縮', 'メモリの内容を保存'],
            correct: 1,
            explanation: 'スナップショットはファイルシステムのある時点の状態を保存し、バックアップや復元に使用されます。'
          },
          {
            question: 'Copy-on-Write（CoW）の仕組みは？',
            options: ['即座にデータをコピーする', '変更時にのみデータをコピーする', 'データを圧縮してコピーする', 'ネットワーク経由でコピーする'],
            correct: 1,
            explanation: 'Copy-on-Writeは、データが実際に変更されるまでコピーを遅延させ、効率的なスナップショットを実現します。'
          },
          {
            question: 'ファイルシステムのマウントとは？',
            options: ['ファイルの暗号化', 'ファイルシステムをディレクトリツリーに組み込む', 'ファイルの圧縮', 'ファイルの削除'],
            correct: 1,
            explanation: 'マウントは、ファイルシステムを既存のディレクトリツリーの特定位置（マウントポイント）に接続する操作です。'
          }
        ]
      }
    ]
  },
  {
    id: 4,
    title: 'システムの構成と性能',
    sections: [
      {
        title: 'システム構成技術',
        content: `高性能・高信頼性システムを実現する各種技術：

**クラスタシステム:**
- 複数のコンピュータを連携させて一つのシステムとして動作
- 種類:
  - HAクラスタ: 高可用性（フェイルオーバー）
  - 負荷分散クラスタ: 処理を分散
  - HPCクラスタ: 高性能計算

**グリッドコンピューティング:**
- 地理的に分散したコンピュータ資源を統合
- 大規模科学計算や解析に利用
- ボランティアコンピューティング（SETI@home等）

**仮想化技術:**
- サーバー仮想化: 1台の物理サーバーで複数の仮想サーバー
- デスクトップ仮想化（VDI）: 仮想デスクトップ環境
- アプリケーション仮想化: アプリを仮想環境で実行
- ネットワーク仮想化（SDN）: ソフトウェアでネットワーク制御

**クラウドコンピューティング:**
サービスモデル:
- IaaS: インフラの提供（仮想マシン、ストレージ）
- PaaS: プラットフォームの提供（開発環境）
- SaaS: ソフトウェアの提供（Webアプリ）

デプロイメントモデル:
- パブリッククラウド: 一般公開
- プライベートクラウド: 組織専用
- ハイブリッドクラウド: 両者の組み合わせ

**エッジコンピューティング:**
- データ発生源の近くで処理
- 低遅延、帯域幅節約
- IoTデバイスとの連携`,
        quizzes: [
          {
            question: 'HAクラスタの目的は？',
            options: ['処理性能の向上', 'システムの可用性向上', 'ストレージ容量の増加', 'ネットワーク帯域の拡大'],
            correct: 1,
            explanation: 'HA（High Availability）クラスタは、障害時のフェイルオーバーによりシステムの可用性を向上させます。'
          },
          {
            question: 'IaaSで提供されるものは？',
            options: ['アプリケーションソフトウェア', '仮想マシンやストレージなどのインフラ', '開発ツールやデータベース', 'ビジネスアプリケーション'],
            correct: 1,
            explanation: 'IaaS（Infrastructure as a Service）は、仮想マシン、ストレージ、ネットワークなどのインフラを提供します。'
          },
          {
            question: 'ハイパーバイザの役割は？',
            options: ['ネットワーク管理', '仮想マシンの管理と制御', 'データベース管理', 'ファイル圧縮'],
            correct: 1,
            explanation: 'ハイパーバイザは物理ハードウェア上で複数の仮想マシンを管理・制御するソフトウェアです。'
          },
          {
            question: 'エッジコンピューティングの利点でないものは？',
            options: ['低遅延の実現', 'ネットワーク帯域の節約', '集中管理の容易さ', 'リアルタイム処理'],
            correct: 2,
            explanation: 'エッジコンピューティングは分散処理のため、集中管理は複雑になる傾向があります。'
          },
          {
            question: 'コンテナ仮想化の特徴は？',
            options: ['OSカーネルを共有する', '各コンテナが独自のOSを持つ', 'ハードウェアを仮想化する', 'ネットワークのみを仮想化する'],
            correct: 0,
            explanation: 'コンテナはホストOSのカーネルを共有し、軽量で高速な仮想化を実現します。'
          },
          {
            question: 'ライブマイグレーションとは？',
            options: ['データの暗号化', '稼働中の仮想マシンを別の物理サーバーに移動', 'ファイルの圧縮転送', 'ネットワークの切り替え'],
            correct: 1,
            explanation: 'ライブマイグレーションは、仮想マシンを停止せずに別の物理サーバーに移動する技術です。'
          },
          {
            question: 'SDN（Software-Defined Networking）の特徴は？',
            options: ['ハードウェアでネットワークを制御', 'ソフトウェアでネットワークを集中制御', '無線LANの高速化', 'ファイアウォールの強化'],
            correct: 1,
            explanation: 'SDNは、ネットワークの制御をソフトウェアで集中的に行い、柔軟な構成変更を可能にします。'
          },
          {
            question: 'フォグコンピューティングの位置づけは？',
            options: ['クラウドより遠い', 'エッジとクラウドの中間', 'エッジより近い', 'クラウドと同じ'],
            correct: 1,
            explanation: 'フォグコンピューティングは、エッジデバイスとクラウドの中間に位置し、両者を橋渡しします。'
          },
          {
            question: 'マルチテナント方式の説明として正しいものは？',
            options: ['各顧客が専用のシステムを持つ', '複数の顧客が同一のシステムを共有', '単一顧客のみ利用可能', 'オンプレミスのみで使用'],
            correct: 1,
            explanation: 'マルチテナントは、複数の顧客（テナント）が同一のシステムインスタンスを共有する方式です。'
          },
          {
            question: 'オートスケーリングの目的は？',
            options: ['手動でのサーバー追加', '負荷に応じた自動的なリソース調整', 'データの自動バックアップ', 'セキュリティの自動更新'],
            correct: 1,
            explanation: 'オートスケーリングは、システム負荷に応じて自動的にリソースを増減させ、適切な性能を維持します。'
          }
        ]
      },
      {
        title: 'システムの性能評価',
        content: `システムの性能を測定・評価する指標と手法：

**性能指標:**

処理性能:
- MIPS（Million Instructions Per Second）: 1秒間の命令実行数（百万単位）
- FLOPS（Floating point Operations Per Second）: 1秒間の浮動小数点演算数
- スループット: 単位時間あたりの処理量
- レスポンスタイム: 要求から応答までの時間
- ターンアラウンドタイム: ジョブ投入から完了までの時間

**ベンチマークテスト:**
- SPECint/SPECfp: CPU性能
- TPC-C/TPC-H: データベース性能
- LINPACK: スーパーコンピュータ性能
- 3DMark: グラフィック性能
- CrystalDiskMark: ストレージ性能

**性能評価の法則:**

アムダールの法則:
- 並列化による性能向上の限界を示す
- 速度向上率 = 1 / ((1-P) + P/N)
  - P: 並列化可能な部分の割合
  - N: プロセッサ数

グスタフソンの法則:
- 問題サイズを拡大すれば並列化の効果が高まる
- アムダールの法則の悲観的な見方を修正

**待ち行列理論:**
- M/M/1: 到着がポアソン分布、サービス時間が指数分布、窓口1つ
- 利用率ρ = λ/μ（λ:到着率、μ:サービス率）
- 平均待ち時間 = ρ/(μ(1-ρ))

**キャパシティプランニング:**
- 将来の需要を予測してシステム容量を計画
- サイジング: 適切な規模の決定
- スケーリング: 垂直（スケールアップ）vs 水平（スケールアウト）`,
        quizzes: [
          {
            question: '100MIPSのCPUが1秒間に実行できる命令数は？',
            options: ['100個', '10万個', '1000万個', '1億個'],
            correct: 3,
            explanation: 'MIPS（Million Instructions Per Second）は百万命令/秒なので、100MIPSは1億命令/秒です。'
          },
          {
            question: 'アムダールの法則で、並列化可能部分が80%、4プロセッサ使用時の速度向上率は？',
            options: ['約1.7倍', '約2.5倍', '約3.2倍', '4倍'],
            correct: 1,
            explanation: '1/((1-0.8) + 0.8/4) = 1/(0.2 + 0.2) = 1/0.4 = 2.5倍となります。'
          },
          {
            question: 'スループットとレスポンスタイムの関係として正しいものは？',
            options: ['常に反比例する', '常に比例する', '必ずしも反比例しない', '無関係'],
            correct: 2,
            explanation: '並列処理等により、スループットを上げながらレスポンスタイムも改善できる場合があります。'
          },
          {
            question: 'M/M/1待ち行列で利用率が0.8の時、システムが不安定になる理由は？',
            options: ['利用率が低すぎる', '待ち時間が急激に増加する', 'サービスが停止する', 'エラーが発生する'],
            correct: 1,
            explanation: '利用率が1に近づくと、待ち時間が急激に増加し、実質的にシステムが機能しなくなります。'
          },
          {
            question: 'スケールアウトの説明として正しいものは？',
            options: ['CPUを高性能なものに交換', 'メモリを増設', 'サーバー台数を増やす', 'ディスク容量を増やす'],
            correct: 2,
            explanation: 'スケールアウトは、サーバーの台数を増やして処理能力を向上させる水平拡張です。'
          },
          {
            question: 'ベンチマークテストの注意点として適切でないものは？',
            options: ['実際の使用環境を考慮する', '複数の指標で評価する', '単一のベンチマークで全てを判断する', 'テスト条件を明確にする'],
            correct: 2,
            explanation: '単一のベンチマークでは特定の側面しか評価できないため、複数の指標で総合的に判断すべきです。'
          },
          {
            question: 'レスポンスタイムに含まれないものは？',
            options: ['CPUの処理時間', 'I/O待ち時間', 'ネットワーク遅延', 'ユーザーの思考時間'],
            correct: 3,
            explanation: 'レスポンスタイムは要求を出してから応答を得るまでの時間で、ユーザーの思考時間は含まれません。'
          },
          {
            question: 'ボトルネックの特定方法として適切でないものは？',
            options: ['リソース使用率の監視', '処理時間の分析', 'ランダムに推測', 'プロファイリングツールの使用'],
            correct: 2,
            explanation: 'ボトルネックは測定・分析により科学的に特定すべきで、推測では正確な改善ができません。'
          },
          {
            question: '性能チューニングの順序として適切なものは？',
            options: ['改善→測定→分析', '測定→分析→改善', '改善→分析→測定', '分析→改善→測定'],
            correct: 1,
            explanation: '性能チューニングは「測定→分析→改善」のサイクルを繰り返して行います。'
          },
          {
            question: 'キャッシング戦略で「時間的局所性」を利用するものは？',
            options: ['空間的プリフェッチ', 'LRU置換アルゴリズム', 'ランダム置換', 'ライトスルー'],
            correct: 1,
            explanation: 'LRU（Least Recently Used）は、最近使われたデータは再び使われる可能性が高いという時間的局所性を利用します。'
          }
        ]
      },
      {
        title: 'システムの信頼性',
        content: `システムの信頼性を確保するための概念と技術：

**信頼性指標:**

基本指標:
- MTBF（Mean Time Between Failures）: 平均故障間隔
- MTTR（Mean Time To Repair）: 平均修復時間
- MTTF（Mean Time To Failure）: 平均故障時間
- 稼働率 = MTBF / (MTBF + MTTR)

信頼性計算:
- 直列システム: R = R1 × R2 × ... × Rn
- 並列システム: R = 1 - (1-R1) × (1-R2) × ... × (1-Rn)

**冗長化技術:**

ハードウェア冗長:
- ホットスタンバイ: 待機系も稼働状態
- コールドスタンバイ: 待機系は停止状態
- ウォームスタンバイ: 待機系は部分稼働
- デュプレックス: 2系統で相互バックアップ
- デュアル: 2系統で同時処理、結果照合

RAID（Redundant Array of Independent Disks）:
- RAID 0: ストライピング、冗長性なし
- RAID 1: ミラーリング
- RAID 5: 分散パリティ
- RAID 6: 二重分散パリティ
- RAID 10: RAID 1 + RAID 0

**フォールトトレラント:**
- フェイルセーフ: 故障時に安全側に動作
- フェイルソフト: 機能縮退して動作継続
- フェイルオーバー: 待機系への自動切り替え
- フェイルバック: 復旧後に主系に戻す

**バックアップとリカバリ:**

バックアップ方式:
- フルバックアップ: 全データ
- 差分バックアップ: フルバックアップからの差分
- 増分バックアップ: 前回バックアップからの差分

RPO（Recovery Point Objective）: 許容できるデータ損失量
RTO（Recovery Time Objective）: 許容できる復旧時間`,
        quizzes: [
          {
            question: 'MTBF=1000時間、MTTR=10時間のシステムの稼働率は？',
            options: ['約90%', '約95%', '約99%', '約99.9%'],
            correct: 2,
            explanation: '稼働率 = 1000/(1000+10) = 1000/1010 ≈ 0.99 = 99%'
          },
          {
            question: '信頼性0.9の装置3台の直列システムの全体信頼性は？',
            options: ['0.999', '0.9', '0.81', '0.729'],
            correct: 3,
            explanation: '直列システムの信頼性 = 0.9 × 0.9 × 0.9 = 0.729'
          },
          {
            question: 'フェイルセーフの例として適切なものは？',
            options: ['信号機故障時に赤信号で停止', 'エレベーター故障時に最寄り階で停止', 'サーバー故障時に予備機に切り替え', 'プリンタ故障時に別のプリンタを使用'],
            correct: 0,
            explanation: 'フェイルセーフは故障時に安全側（この場合は赤信号で停止）に動作する設計です。'
          },
          {
            question: 'RAID 5で4台のディスク使用時、実効容量は？',
            options: ['1台分', '2台分', '3台分', '4台分'],
            correct: 2,
            explanation: 'RAID 5では1台分がパリティに使用されるため、実効容量は(n-1)台分 = 3台分です。'
          },
          {
            question: 'ホットスタンバイの特徴は？',
            options: ['待機系は電源OFF', '待機系も稼働状態で即座に切り替え可能', '待機系は部分的に稼働', '待機系は存在しない'],
            correct: 1,
            explanation: 'ホットスタンバイでは待機系も稼働状態を維持し、障害時に即座に切り替えが可能です。'
          },
          {
            question: '増分バックアップの利点は？',
            options: ['復旧が最も速い', 'バックアップ時間とストレージを節約', '管理が簡単', '圧縮率が高い'],
            correct: 1,
            explanation: '増分バックアップは前回からの差分のみを保存するため、時間とストレージを節約できます。'
          },
          {
            question: 'N版管理（多数決システム）で最小構成は何台？',
            options: ['2台', '3台', '4台', '5台'],
            correct: 1,
            explanation: '多数決を行うには最低3台必要です（2対1で判定可能）。'
          },
          {
            question: 'チェックポイントリスタートの目的は？',
            options: ['処理の高速化', '障害時の処理再開点の設定', 'メモリの節約', 'ネットワークの最適化'],
            correct: 1,
            explanation: 'チェックポイントリスタートは、定期的に処理状態を保存し、障害時にその時点から再開できるようにします。'
          },
          {
            question: 'デュアルシステムの特徴は？',
            options: ['1台のみが処理', '2台が交互に処理', '2台が同じ処理を行い結果を照合', '2台が異なる処理を並行実行'],
            correct: 2,
            explanation: 'デュアルシステムは2台が同じ処理を行い、結果を照合することで高信頼性を実現します。'
          },
          {
            question: 'RPO=1時間の要求を満たすバックアップ方式は？',
            options: ['週次フルバックアップ', '日次フルバックアップ', '1時間ごとの差分バックアップ', '月次フルバックアップ'],
            correct: 2,
            explanation: 'RPO（Recovery Point Objective）1時間は、最大1時間分のデータ損失が許容されることを意味し、1時間ごとのバックアップが必要です。'
          }
        ]
      }
    ]
  }
];

export default function ComputerSystemsPage() {
  const [activeModule, setActiveModule] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [completedQuizzes, setCompletedQuizzes] = useState<Set<string>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<{[key: string]: number}>({});
  const [showQuizResults, setShowQuizResults] = useState<{[key: string]: boolean}>({});
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);

  const { progress, saveProgress } = useLearningProgress('computer-systems');

  useEffect(() => {
    if (progress.length > 0) {
      console.log('🔄 Restoring computer-systems progress state...');
      const completedSet = new Set<string>();
      const answersMap: {[key: string]: number} = {};
      const resultsMap: {[key: string]: boolean} = {};

      progress.forEach((p) => {
        const sectionKey = p.section_key;
        if (p.is_completed) {
          completedSet.add(sectionKey);
          resultsMap[sectionKey] = true;

          const parts = sectionKey.split('-');
          if (parts.length >= 3) {
            const moduleIndex = parseInt(parts[0]);
            const sectionIndex = parseInt(parts[1]);
            const quizIndex = parseInt(parts[2]);

            if (!isNaN(moduleIndex) && !isNaN(sectionIndex) && !isNaN(quizIndex)) {
              const learningModule = learningModules[moduleIndex];
              if (learningModule && learningModule.sections[sectionIndex] && learningModule.sections[sectionIndex].quizzes[quizIndex]) {
                const correctAnswer = learningModule.sections[sectionIndex].quizzes[quizIndex].correct;
                answersMap[sectionKey] = correctAnswer;
              }
            }
          }
        }
      });

      setCompletedQuizzes(completedSet);
      setQuizAnswers(answersMap);
      setShowQuizResults(resultsMap);
      console.log('✅ Computer-systems progress restored:', { completed: completedSet.size, answers: Object.keys(answersMap).length });
    }
  }, [progress]);

  const currentModule = learningModules[activeModule];
  const currentSection = currentModule.sections[activeSection];
  const currentQuiz = currentSection.quizzes[currentQuizIndex];
  const quizKey = `${activeModule}-${activeSection}-${currentQuizIndex}`;

  const handleQuizAnswer = async (answer: number) => {
    setQuizAnswers({...quizAnswers, [quizKey]: answer});
    setShowQuizResults({...showQuizResults, [quizKey]: true});

    const isCorrect = answer === currentQuiz.correct;
    if (isCorrect) {
      setCompletedQuizzes(new Set([...completedQuizzes, quizKey]));
    }

    try {
      await saveProgress(quizKey, isCorrect, isCorrect);
      console.log('✅ Computer-systems progress saved:', { section: quizKey, correct: isCorrect });
    } catch (error) {
      console.error('❌ Failed to save computer-systems progress:', error);
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

  const quizProgress = (completedQuizzes.size / totalQuizzes) * 100;
  const sectionQuizProgress = currentSection.quizzes.filter((_, index) =>
    completedQuizzes.has(`${activeModule}-${activeSection}-${index}`)).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* モバイルヘッダー */}
      <div className="lg:hidden bg-white border-b sticky top-0 z-10">
        <div className="p-4">
          <Link
            href="/modules/it-fundamentals"
            className="inline-flex items-center text-blue-600 text-sm mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            戻る
          </Link>
          <h1 className="text-xl font-bold text-gray-900">コンピュータシステム</h1>
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">全体進捗</span>
              <span className="text-gray-900 font-medium">{Math.round(quizProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${quizProgress}%` }}
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
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            IT基礎に戻る
          </Link>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">コンピュータシステム</h1>
                <p className="text-gray-600">基本情報技術者試験レベルの総合学習</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{completedQuizzes.size}/{totalQuizzes}</div>
                <div className="text-sm text-gray-600">問題完了</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">学習進捗</span>
                <span className="text-gray-900 font-medium">{Math.round(quizProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${quizProgress}%` }}
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
                          ? 'bg-blue-50 text-blue-600 font-medium'
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
                                  ? 'bg-blue-100 text-blue-700'
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
                    <span className="font-medium">{completedQuizzes.size > 0 ? Math.round(quizProgress) : 0}%</span>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <BookOpen className="w-5 h-5 text-blue-500 mr-2" />
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900">{currentSection.title}</h2>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
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
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 lg:p-6 mb-6">
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
                                ? 'bg-blue-600 text-white shadow-lg scale-110'
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
                                ? 'bg-blue-50 border-blue-400 text-blue-700'
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
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
                      >
                        次の問題 →
                      </button>
                    </div>
                  </div>
                </div>

                {/* セクションナビゲーション */}
                <div className="flex flex-col lg:flex-row justify-between gap-4 mt-8 mb-20 lg:mb-8">
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
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-sm lg:text-base"
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