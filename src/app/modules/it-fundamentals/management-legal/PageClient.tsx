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
    question: '職能ごとに部門を編成する組織形態は？',
    options: ['事業部制組織', '機能別組織', 'マトリックス組織', 'カンパニー制'],
    correct: 1,
    explanation: '機能別組織は、営業、製造、人事などの職能ごとに部門を編成する組織形態で、専門性を高めやすいという特徴があります。'
  },
  {
    question: 'SWOT分析の「O」は何を表すか？',
    options: ['Organization（組織）', 'Operation（運営）', 'Opportunities（機会）', 'Objectives（目標）'],
    correct: 2,
    explanation: 'SWOT分析の「O」はOpportunities（機会）を表し、外部環境の好機を分析します。'
  },
  {
    question: '貸借対照表の基本等式として正しいものは？',
    options: ['資産 = 負債 - 純資産', '資産 = 負債 + 純資産', '負債 = 資産 + 純資産', '純資産 = 資産 + 負債'],
    correct: 1,
    explanation: '貸借対照表の基本等式は「資産 = 負債 + 純資産」で、企業の財政状態を表します。'
  },
  {
    question: '特許権の保護期間は出願から何年か？',
    options: ['10年', '15年', '20年', '25年'],
    correct: 2,
    explanation: '特許権は出願から20年間、発明を独占的に実施する権利を保護します。'
  },
  {
    question: 'PDCAサイクルのCは何を表すか？',
    options: ['Create（創造）', 'Check（評価）', 'Control（管理）', 'Collaborate（協働）'],
    correct: 1,
    explanation: 'PDCAサイクルのCはCheck（評価）で、実施した結果を測定・評価し、目標との差異を確認します。'
  },
  {
    question: 'プロジェクト型業務に適した組織形態はどれか？',
    options: ['機能別組織', '事業部制組織', 'マトリックス組織', 'ホールディングカンパニー制'],
    correct: 2,
    explanation: 'マトリックス組織は、機能別と事業別の2つの指揮系統を持ち、プロジェクト型業務に適した柔軟な組織形態です。'
  },
  {
    question: 'PPMで高成長・高シェアの事業を何と呼ぶか？',
    options: ['金のなる木', '花形', '問題児', '負け犬'],
    correct: 1,
    explanation: '花形（Star）は、市場成長率が高く市場シェアも高い事業で、将来の主力事業として期待されます。'
  },
  {
    question: 'ROEを計算する式は？',
    options: ['当期純利益 ÷ 総資産', '当期純利益 ÷ 自己資本', '売上高 ÷ 総資産', '営業利益 ÷ 売上高'],
    correct: 1,
    explanation: 'ROE（Return on Equity：自己資本利益率）は、当期純利益を自己資本で割った指標で、株主資本の収益性を測ります。'
  },
  {
    question: 'プログラムが保護される知的財産権は？',
    options: ['特許権', '実用新案権', '意匠権', '著作権'],
    correct: 3,
    explanation: 'コンピュータプログラムは著作権法で保護される著作物として扱われます。'
  },
  {
    question: 'ISO 9001が対象とするマネジメントシステムは？',
    options: ['環境マネジメント', '品質マネジメント', '情報セキュリティマネジメント', 'ITサービスマネジメント'],
    correct: 1,
    explanation: 'ISO 9001は品質マネジメントシステムの国際規格で、組織の品質管理体制を規定しています。'
  }
];

export default function ManagementLegalModule() {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizData.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<boolean[]>(new Array(quizData.length).fill(false));

  const { progress, saveProgress } = useLearningProgress('management-legal');

  useEffect(() => {
    if (progress.length > 0) {
      console.log('📚 Management Legal progress loaded:', progress.length, 'items');
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
      const quizKey = `management-legal-quiz-${currentQuizIndex}`;

      try {
        saveProgress(quizKey, true, isCorrect);
        console.log('✅ Management Legal progress saved:', { quiz: currentQuizIndex, correct: isCorrect });
      } catch (error) {
        console.error('❌ Failed to save management legal progress:', error);
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
              <h2 className="text-3xl font-bold text-gray-800 mb-2">経営・法務 完了！</h2>
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">経営・法務</h1>
          <p className="text-gray-600 mb-4">企業活動、経営管理、法務知識を体系的に学習します</p>
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