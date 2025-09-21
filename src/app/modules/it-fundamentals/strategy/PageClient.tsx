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
    question: 'IT戦略策定プロセスで最初に行うべきことは？',
    options: ['ビジネス要求の分析', '現状分析', '実行計画の作成', '評価と改善'],
    correct: 1,
    explanation: 'IT戦略策定では、まず現状のIT資産やシステム構成を把握する現状分析から始める必要があります。'
  },
  {
    question: 'DXの段階で、ビジネスモデルの変革を伴うのは？',
    options: ['デジタイゼーション', 'デジタライゼーション', 'デジタルトランスフォーメーション', 'デジタルマーケティング'],
    correct: 2,
    explanation: 'デジタルトランスフォーメーションは、デジタル技術を活用してビジネスモデル自体を変革する最も高次の段階です。'
  },
  {
    question: 'システム企画段階で最初に行うべき活動は？',
    options: ['解決策の検討', '課題の明確化', '企画書の作成', '予算の確保'],
    correct: 1,
    explanation: 'システム企画では、まず現状を分析し、問題点を抽出して課題を明確にすることから始める必要があります。'
  },
  {
    question: 'ITILのサービスライフサイクルに含まれないものは？',
    options: ['サービスストラテジ', 'サービスデザイン', 'サービストランジション', 'サービスマーケティング'],
    correct: 3,
    explanation: 'ITILの5つのライフサイクルは、戦略、設計、移行、運用、継続的改善です。マーケティングは含まれません。'
  },
  {
    question: 'システム監査の主要な目的でないものは？',
    options: ['リスク管理', 'コンプライアンス確保', '売上向上', '改善提案'],
    correct: 2,
    explanation: 'システム監査の目的は、リスク管理、コンプライアンス確保、改善提案などで、直接的な売上向上は目的ではありません。'
  },
  {
    question: 'グローバル化の最初の段階は？',
    options: ['国際化段階', '輸出段階', '多国籍化段階', 'グローバル化段階'],
    correct: 1,
    explanation: '輸出段階は、国内で生産した製品を海外に販売する最初のグローバル化段階です。'
  },
  {
    question: 'SCMで全体最適を目指す際の重要な要素は？',
    options: ['個別最適', '部分最適', '情報共有', '競争関係'],
    correct: 2,
    explanation: 'SCMでは、サプライチェーン全体の情報共有により連携を強化し、全体最適を実現します。'
  },
  {
    question: 'プロダクトアウトの起点となるのは？',
    options: ['市場ニーズ', '顧客要求', '企業の技術力', '競合他社'],
    correct: 2,
    explanation: 'プロダクトアウトは、企業の技術力や生産能力を起点として製品開発を行う考え方です。'
  },
  {
    question: 'ビジネスエコシステムの特徴でないものは？',
    options: ['多様なプレイヤー', '相互依存関係', '単独での価値創造', 'イノベーションの促進'],
    correct: 2,
    explanation: 'ビジネスエコシステムは複数企業の協業による価値共創が特徴で、単独での価値創造とは対照的です。'
  },
  {
    question: 'ESGの「E」は何を表すか？',
    options: ['Economy', 'Environment', 'Ethics', 'Education'],
    correct: 1,
    explanation: 'ESGのEはEnvironment（環境）を表し、気候変動対策や資源効率などの環境課題への取り組みを指します。'
  }
];

export default function StrategyModule() {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizData.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<boolean[]>(new Array(quizData.length).fill(false));

  const { progress, saveProgress } = useLearningProgress('strategy');

  useEffect(() => {
    if (progress.length > 0) {
      console.log('📚 Strategy progress loaded:', progress.length, 'items');
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
      const quizKey = `strategy-quiz-${currentQuizIndex}`;

      try {
        saveProgress(quizKey, true, isCorrect);
        console.log('✅ Strategy progress saved:', { quiz: currentQuizIndex, correct: isCorrect });
      } catch (error) {
        console.error('❌ Failed to save strategy progress:', error);
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
              <h2 className="text-3xl font-bold text-gray-800 mb-2">ストラテジ 完了！</h2>
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ストラテジ</h1>
          <p className="text-gray-600 mb-4">企業戦略、IT戦略、マーケティングを体系的に学習します</p>
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