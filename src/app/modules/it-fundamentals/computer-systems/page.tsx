'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle, Circle, ChevronRight, Calculator, Cpu, HardDrive, Monitor } from 'lucide-react';

const learningModules = [
  {
    id: 1,
    title: 'コンピュータの基本構成',
    sections: [
      {
        title: '五大装置',
        content: `コンピュータは以下の5つの基本装置で構成されています：

1. **入力装置**: キーボード、マウス、スキャナなど
2. **出力装置**: ディスプレイ、プリンタ、スピーカーなど
3. **記憶装置**: RAM、HDD、SSDなど
4. **演算装置**: ALU（算術論理演算装置）
5. **制御装置**: CPU内の制御部

これらが連携してデータの入力、処理、出力を行います。`,
        quiz: {
          question: 'CPUに含まれる装置はどれですか？',
          options: ['入力装置と出力装置', '演算装置と制御装置', '記憶装置と入力装置', '出力装置と記憶装置'],
          correct: 1
        }
      },
      {
        title: 'CPU（中央処理装置）',
        content: `CPUはコンピュータの頭脳として機能します：

**主な構成要素:**
- **制御装置**: プログラムの命令を解読し、各装置を制御
- **演算装置（ALU）**: 算術演算や論理演算を実行
- **レジスタ**: 高速な一時記憶領域
- **キャッシュメモリ**: 頻繁に使用するデータを高速に取り出すための記憶装置

**性能指標:**
- クロック周波数: 処理速度を表す（単位: Hz）
- コア数: 並列処理能力
- キャッシュサイズ: データアクセスの高速化`,
        quiz: {
          question: 'CPUの性能を表す指標として適切でないものはどれですか？',
          options: ['クロック周波数', 'コア数', 'キャッシュサイズ', 'ハードディスク容量'],
          correct: 3
        }
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

**RAM（Random Access Memory）:**
- 揮発性メモリ（電源を切るとデータが消える）
- 読み書き可能
- DRAM: 安価で大容量、定期的なリフレッシュが必要
- SRAM: 高速だが高価、キャッシュメモリに使用

**ROM（Read Only Memory）:**
- 不揮発性メモリ（電源を切ってもデータが保持される）
- 基本的に読み込み専用
- BIOS/UEFIなどのファームウェアを格納`,
        quiz: {
          question: 'DRAMの特徴として正しいものはどれですか？',
          options: ['不揮発性メモリである', '定期的なリフレッシュが必要', '読み込み専用である', 'SRAMより高速である'],
          correct: 1
        }
      },
      {
        title: '補助記憶装置',
        content: `補助記憶装置は大容量のデータを永続的に保存します：

**HDD（Hard Disk Drive）:**
- 磁気ディスクを使用
- 大容量で安価
- 機械的動作のため比較的低速
- 衝撃に弱い

**SSD（Solid State Drive）:**
- フラッシュメモリを使用
- 高速アクセス
- 静音・低消費電力
- HDDより高価だが価格は下がりつつある

**光学ディスク:**
- CD、DVD、Blu-ray
- 読み取り専用または書き込み可能
- データの長期保存に適している`,
        quiz: {
          question: 'SSDの特徴として誤っているものはどれですか？',
          options: ['フラッシュメモリを使用', '機械的動作部分がない', 'HDDより安価', '高速アクセスが可能'],
          correct: 2
        }
      }
    ]
  },
  {
    id: 3,
    title: 'オペレーティングシステム',
    sections: [
      {
        title: 'OSの役割',
        content: `オペレーティングシステム（OS）はハードウェアとアプリケーションの仲介役です：

**主な機能:**
1. **プロセス管理**: プログラムの実行管理
2. **メモリ管理**: メモリの割り当てと解放
3. **ファイル管理**: ファイルシステムの管理
4. **デバイス管理**: 周辺機器の制御
5. **ユーザーインターフェース**: GUI/CLIの提供

**代表的なOS:**
- Windows: Microsoft社、最も普及しているデスクトップOS
- macOS: Apple社、Mac専用OS
- Linux: オープンソース、サーバーで広く使用
- iOS/Android: モバイル向けOS`,
        quiz: {
          question: 'OSの基本機能に含まれないものはどれですか？',
          options: ['プロセス管理', 'メモリ管理', '表計算処理', 'デバイス管理'],
          correct: 2
        }
      },
      {
        title: 'プロセス管理',
        content: `OSはプロセス（実行中のプログラム）を効率的に管理します：

**プロセスの状態:**
- **実行状態**: CPUを使用中
- **実行可能状態**: CPUの割り当て待ち
- **待機状態**: I/O完了などを待機中

**スケジューリング方式:**
- **ラウンドロビン**: 各プロセスに順番に一定時間割り当て
- **優先度付き**: 重要度に応じて優先的に実行
- **FIFO**: 先着順で処理
- **SJF**: 処理時間が短いジョブを優先

**マルチタスク:**
複数のプロセスを同時に実行しているように見せる技術`,
        quiz: {
          question: 'ラウンドロビン方式の説明として正しいものはどれですか？',
          options: ['処理時間が短いジョブを優先', '各プロセスに順番に一定時間を割り当て', '優先度の高いプロセスを先に実行', '先着順で最後まで処理'],
          correct: 1
        }
      }
    ]
  }
];

export default function ComputerSystemsPage() {
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
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          IT基礎に戻る
        </Link>

        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">コンピュータシステム</h1>
              <p className="text-gray-600">ハードウェア、ソフトウェア、システム構成の基礎知識</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">学習進捗</span>
              <span className="text-gray-900 font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
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
                          ? 'bg-blue-50 text-blue-600'
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
                                ? 'bg-blue-100 text-blue-700'
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
                  <BookOpen className="w-5 h-5 text-blue-500 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-900">{currentSection.title}</h2>
                </div>

                <div className="prose max-w-none mb-8">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {currentSection.content}
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6 mb-6">
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
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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