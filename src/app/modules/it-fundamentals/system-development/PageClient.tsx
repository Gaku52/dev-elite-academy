'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, CheckCircle, Circle, ChevronRight, AlertCircle, Trophy } from 'lucide-react';
import { useLearningProgress } from '@/hooks/useLearningProgress';

interface Quiz {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const quizData: Quiz[] = [
  {
    question: 'ウォーターフォールモデルの特徴として誤っているものはどれか？',
    options: ['各フェーズを順番に進める', '変更に柔軟に対応できる', 'ドキュメント重視', '計画的で管理しやすい'],
    correct: 1,
    explanation: 'ウォーターフォールモデルは変更に対して柔軟性が低いのが特徴です。一度フェーズを完了すると後戻りが困難です。'
  },
  {
    question: 'Scrumはどの開発モデルの手法の一つか？',
    options: ['ウォーターフォールモデル', 'アジャイル開発', 'プロトタイプモデル', 'スパイラルモデル'],
    correct: 1,
    explanation: 'Scrumはアジャイル開発の代表的なフレームワークの一つで、スプリントと呼ばれる短い期間で反復的に開発を行います。'
  },
  {
    question: 'システム開発ライフサイクルの最初のフェーズは何ですか？',
    options: ['設計', '要件定義', '実装', 'テスト'],
    correct: 1,
    explanation: '要件定義は、システム開発の最初のフェーズで、ユーザーのニーズを明確にし、システムの機能要件と非機能要件を定義します。'
  },
  {
    question: 'プロジェクト管理でWBS（Work Breakdown Structure）は何の管理で使用される技法か？',
    options: ['スケジュール管理', 'スコープ管理', 'コスト管理', 'リスク管理'],
    correct: 1,
    explanation: 'WBSはスコープ管理で使用され、プロジェクトの成果物を階層的に分解して、作業範囲を明確にする技法です。'
  },
  {
    question: 'ホワイトボックステストの網羅基準で、すべての命令を少なくとも1回実行する基準は？',
    options: ['C0（命令網羅）', 'C1（分岐網羅）', 'C2（条件網羅）', '複合条件網羅'],
    correct: 0,
    explanation: 'C0（命令網羅）は、プログラムのすべての命令を少なくとも1回実行することを目指す最も基本的な網羅基準です。'
  },
  {
    question: 'Gitはどのような種類のバージョン管理システムか？',
    options: ['集中型', '分散型', 'ローカル型', 'クラウド型'],
    correct: 1,
    explanation: 'Gitは分散型バージョン管理システムで、各開発者が完全なリポジトリのコピーを持ち、オフラインでも作業できます。'
  },
  {
    question: 'SOLID原則の「S」が表す原則は何か？',
    options: ['セキュア原則', 'シンプル原則', '単一責任の原則', 'ステート原則'],
    correct: 2,
    explanation: 'Single Responsibility Principle（単一責任の原則）は、クラスは単一の責任のみを持つべきという原則です。'
  },
  {
    question: 'MVCアーキテクチャのControllerの役割は何か？',
    options: ['データの永続化', 'ユーザーインターフェースの表示', 'ModelとViewの仲介', 'ビジネスロジックの実行'],
    correct: 2,
    explanation: 'ControllerはModelとViewの間を仲介し、ユーザーの入力を処理してModelを更新し、Viewに反映させます。'
  },
  {
    question: 'ISO/IEC 25010で定義される製品品質特性でないものは？',
    options: ['機能適合性', '性能効率性', 'プロジェクト管理性', '信頼性'],
    correct: 2,
    explanation: 'プロジェクト管理性はISO/IEC 25010の製品品質特性には含まれません。8つの主特性は機能適合性、性能効率性、互換性、使用性、信頼性、セキュリティ、保守性、移植性です。'
  },
  {
    question: 'PDCAサイクルのCは何を表すか？',
    options: ['Create（創造）', 'Check（評価）', 'Control（管理）', 'Collaborate（協働）'],
    correct: 1,
    explanation: 'PDCAサイクルのCはCheck（評価）で、実施した結果を測定・評価し、目標との差異を確認します。'
  }
];

export default function SystemDevelopmentModule() {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizData.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<boolean[]>(new Array(quizData.length).fill(false));

  const { progress, saveProgress } = useLearningProgress('system-development');

  useEffect(() => {
    if (progress.length > 0) {
      console.log('📚 System Development progress loaded:', progress.length, 'items');
    }
  }, [progress]);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuizIndex] = answerIndex;
    setSelectedAnswers(newAnswers);

    if (!answered[currentQuizIndex]) {
      const newAnswered = [...answered];
      newAnswered[currentQuizIndex] = true;
      setAnswered(newAnswered);

      // 即座に進捗を保存
      const quiz = quizData[currentQuizIndex];
      const isCorrect = answerIndex === quiz.correct;
      const quizKey = `system-development-quiz-${currentQuizIndex}`;

      try {
        saveProgress(quizKey, true, isCorrect);
        console.log('✅ System Development progress saved:', { quiz: currentQuizIndex, correct: isCorrect });
      } catch (error) {
        console.error('❌ Failed to save system development progress:', error);
      }
    }
  };

  const handleNext = () => {
    if (currentQuizIndex < quizData.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    } else {
      calculateFinalScore();
    }
  };

  const handlePrevious = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(currentQuizIndex - 1);
    }
  };

  const calculateFinalScore = () => {
    let correctCount = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === quizData[index].correct) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswers(new Array(quizData.length).fill(null));
    setAnswered(new Array(quizData.length).fill(false));
    setShowResults(false);
    setScore(0);
  };

  const currentQuiz = quizData[currentQuizIndex];
  const progressPercentage = ((currentQuizIndex + 1) / quizData.length) * 100;
  const answeredCount = answered.filter(a => a).length;
  const completedQuizzes = progress.filter(p => p.is_completed).length;

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="text-center mb-8">
              <Trophy className="mx-auto text-yellow-500 mb-4" size={64} />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">システム開発 完了！</h2>
              <p className="text-xl text-gray-600">
                最終スコア: {score} / {quizData.length}
                <span className="ml-2">
                  ({Math.round((score / quizData.length) * 100)}%)
                </span>
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {quizData.map((quiz, index) => {
                const userAnswer = selectedAnswers[index];
                const isCorrect = userAnswer === quiz.correct;
                return (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start gap-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle className="text-green-500 mt-1" size={20} />
                      ) : (
                        <AlertCircle className="text-red-500 mt-1" size={20} />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 mb-2">{quiz.question}</p>
                        <p className="text-sm text-gray-600 mb-1">
                          あなたの回答: {userAnswer !== null ? quiz.options[userAnswer] : '未回答'}
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-green-600 mb-2">
                            正解: {quiz.options[quiz.correct]}
                          </p>
                        )}
                        <p className="text-sm text-gray-500 bg-blue-50 p-2 rounded">
                          {quiz.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={resetQuiz}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
              >
                もう一度挑戦
              </button>
              <Link
                href="/modules/it-fundamentals"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700"
              >
                モジュール一覧に戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/modules/it-fundamentals" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="mr-2" size={20} />
          IT基礎知識に戻る
        </Link>

        <div className="bg-white rounded-xl shadow-xl p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">システム開発</h1>
          <p className="text-gray-600 mb-4">システム開発の基礎から実践まで体系的に学習します</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <BookOpen size={16} />
              {quizData.length} 問
            </span>
            <span className="flex items-center gap-1">
              <Trophy size={16} />
              完了: {completedQuizzes} / {quizData.length}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-gray-800">問題 {currentQuizIndex + 1}</h2>
              <span className="text-sm text-gray-600">
                {currentQuizIndex + 1} / {quizData.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">{currentQuiz.question}</h3>
            <div className="space-y-3">
              {currentQuiz.options.map((option, index) => {
                const isSelected = selectedAnswers[currentQuizIndex] === index;
                const isDisabled = answered[currentQuizIndex];
                const isCorrect = index === currentQuiz.correct;
                const isWrong = isDisabled && isSelected && !isCorrect;

                return (
                  <button
                    key={index}
                    onClick={() => !isDisabled && handleAnswer(index)}
                    disabled={isDisabled}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                      isDisabled
                        ? isCorrect
                          ? 'border-green-500 bg-green-50'
                          : isWrong
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 bg-gray-50'
                        : isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                        isDisabled
                          ? isCorrect
                            ? 'border-green-500 bg-green-500'
                            : isWrong
                            ? 'border-red-500 bg-red-500'
                            : 'border-gray-300'
                          : isSelected
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {((isDisabled && isCorrect) || (isSelected && !isDisabled)) && (
                          <div className="w-full h-full rounded-full bg-white scale-50" />
                        )}
                      </div>
                      <span className="text-gray-700">{option}</span>
                      {isDisabled && isCorrect && (
                        <CheckCircle className="ml-auto text-green-500" size={20} />
                      )}
                      {isWrong && (
                        <AlertCircle className="ml-auto text-red-500" size={20} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {answered[currentQuizIndex] && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 font-medium">解説:</p>
                <p className="text-blue-700">{currentQuiz.explanation}</p>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuizIndex === 0}
              className={`px-6 py-2 rounded-lg font-medium ${
                currentQuizIndex === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              前の問題
            </button>
            <button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuizIndex] === null}
              className={`px-6 py-2 rounded-lg font-medium ${
                selectedAnswers[currentQuizIndex] === null
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700'
              }`}
            >
              {currentQuizIndex === quizData.length - 1 ? '結果を見る' : '次の問題'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}