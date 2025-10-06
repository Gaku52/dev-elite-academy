'use client';

import { useState } from 'react';
import { Clock, BookOpen, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { SubjectBQuestion, UserAnswer, SubQuestion } from '@/types/subject-b';

interface QuestionViewerProps {
  question: SubjectBQuestion;
  onComplete?: (answers: UserAnswer[], score: number, timeSpent: number) => void;
}

export default function QuestionViewer({ question, onComplete }: QuestionViewerProps) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [startTime] = useState(Date.now());
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  const handleAnswerChange = (subQuestionId: string, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [subQuestionId]: answer
    }));
  };

  const handleSubmit = () => {
    const newResults: Record<string, boolean> = {};
    let correctCount = 0;

    question.subQuestions.forEach(subQ => {
      const userAnswer = answers[subQ.id];
      const isCorrect = checkAnswer(subQ, userAnswer);
      newResults[subQ.id] = isCorrect;
      if (isCorrect) correctCount++;
    });

    setResults(newResults);
    setSubmitted(true);

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const userAnswers: UserAnswer[] = question.subQuestions.map(subQ => ({
      questionId: question.id,
      subQuestionId: subQ.id,
      answer: answers[subQ.id] || '',
      isCorrect: newResults[subQ.id],
      attemptedAt: new Date().toISOString()
    }));

    onComplete?.(userAnswers, correctCount, timeSpent);
  };

  const checkAnswer = (subQuestion: SubQuestion, userAnswer: string | string[]): boolean => {
    if (!userAnswer) return false;

    if (subQuestion.type === 'fill-in-blank' && subQuestion.fillInBlanks) {
      const userAnswers = typeof userAnswer === 'string' ? JSON.parse(userAnswer) : userAnswer;
      return subQuestion.fillInBlanks.every(blank =>
        userAnswers[blank.id] === blank.correctAnswer
      );
    }

    if (Array.isArray(subQuestion.correctAnswer)) {
      const userAnswers = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
      return JSON.stringify(userAnswers.sort()) === JSON.stringify(subQuestion.correctAnswer.sort());
    }

    return userAnswer === subQuestion.correctAnswer;
  };

  const toggleExplanation = (subQuestionId: string) => {
    setShowExplanation(prev => ({
      ...prev,
      [subQuestionId]: !prev[subQuestionId]
    }));
  };

  const score = Object.values(results).filter(Boolean).length;
  const maxScore = question.subQuestions.length;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-black">{question.title}</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-[#6F6F6F]">
              <Clock className="w-5 h-5" />
              <span>目安時間: {question.timeEstimate}分</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
              question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {question.difficulty === 'easy' ? '易' :
               question.difficulty === 'medium' ? '中' : '難'}
            </span>
          </div>
        </div>

        <p className="text-lg text-[#6F6F6F] mb-4">{question.description}</p>

        {submitted && (
          <div className={`p-4 rounded-lg ${
            score === maxScore ? 'bg-green-50 border-2 border-green-200' :
            score >= maxScore * 0.6 ? 'bg-yellow-50 border-2 border-yellow-200' :
            'bg-red-50 border-2 border-red-200'
          }`}>
            <div className="flex items-center space-x-3">
              {score === maxScore ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              )}
              <div>
                <p className="font-bold text-lg">
                  正解数: {score} / {maxScore}
                </p>
                <p className="text-sm text-[#6F6F6F]">
                  得点率: {Math.round((score / maxScore) * 100)}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 問題文 */}
      <div className="card-modern p-6 mb-8">
        <div className="mb-6">
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: question.problemStatement }} />
        </div>

        {/* 擬似コード */}
        {question.pseudoCode && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-bold mb-3 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              プログラム（擬似言語）
            </h3>
            <div className="font-mono text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto">
              {question.pseudoCode.map((block, index) => (
                <div key={index} className={`${block.highlight ? 'bg-yellow-100' : ''}`}>
                  {block.lineNumber && (
                    <span className="text-gray-400 mr-4 select-none">
                      {block.lineNumber.toString().padStart(2, '0')}
                    </span>
                  )}
                  <span style={{ whiteSpace: 'pre' }}>{block.code}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 補足情報 */}
        {question.additionalInfo && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: question.additionalInfo }} />
          </div>
        )}
      </div>

      {/* 設問 */}
      {question.subQuestions.map((subQ) => (
        <div key={subQ.id} className="card-modern p-6 mb-6">
          <div className="flex items-start space-x-3 mb-4">
            <span className="inline-block bg-[#8E9C78] text-white px-3 py-1 rounded-full font-bold">
              {subQ.questionNumber}
            </span>
            {submitted && (
              results[subQ.id] ? (
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              )
            )}
          </div>

          <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: subQ.text }} />

          {/* 空欄補充問題 */}
          {subQ.type === 'fill-in-blank' && subQ.fillInBlanks && (
            <div className="space-y-4">
              {subQ.fillInBlanks.map(blank => (
                <div key={blank.id} className="border border-gray-200 rounded-lg p-4">
                  <label className="block font-bold mb-2 text-lg">
                    空欄 {blank.label}
                  </label>
                  <select
                    value={
                      typeof answers[subQ.id] === 'string'
                        ? JSON.parse(answers[subQ.id] as string || '{}')[blank.id] || ''
                        : ''
                    }
                    onChange={(e) => {
                      const currentAnswers = typeof answers[subQ.id] === 'string'
                        ? JSON.parse(answers[subQ.id] as string || '{}')
                        : {};
                      currentAnswers[blank.id] = e.target.value;
                      handleAnswerChange(subQ.id, JSON.stringify(currentAnswers));
                    }}
                    disabled={submitted}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8E9C78] focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">選択してください</option>
                    {blank.options.map(option => (
                      <option key={option.id} value={option.id}>
                        {option.text}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          {/* 選択問題 */}
          {subQ.type === 'multiple-choice' && subQ.choices && (
            <div className="space-y-3">
              {subQ.choices.map(choice => (
                <label
                  key={choice.id}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    answers[subQ.id] === choice.id
                      ? 'border-[#8E9C78] bg-[#8E9C78]/10'
                      : 'border-gray-200 hover:border-[#8E9C78]/50'
                  } ${submitted ? 'cursor-not-allowed' : ''}`}
                >
                  <input
                    type="radio"
                    name={subQ.id}
                    value={choice.id}
                    checked={answers[subQ.id] === choice.id}
                    onChange={(e) => handleAnswerChange(subQ.id, e.target.value)}
                    disabled={submitted}
                    className="mr-3"
                  />
                  <span>{choice.text}</span>
                </label>
              ))}
            </div>
          )}

          {/* 解説表示 */}
          {submitted && (
            <div className="mt-6">
              <button
                onClick={() => toggleExplanation(subQ.id)}
                className="btn-secondary w-full mb-3"
              >
                {showExplanation[subQ.id] ? '解説を閉じる' : '解説を見る'}
              </button>

              {showExplanation[subQ.id] && (
                <div className="bg-gray-50 border-l-4 border-[#8E9C78] p-4 rounded">
                  <h4 className="font-bold mb-2 text-lg">解説</h4>
                  <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: subQ.explanation }} />
                  {subQ.detailedExplanation && (
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <h5 className="font-bold mb-2">詳細解説</h5>
                      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: subQ.detailedExplanation }} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* 送信ボタン */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          className="btn-modern w-full py-4 text-lg"
        >
          解答を提出する
        </button>
      )}

      {/* 全体の解説 */}
      {submitted && question.overallExplanation && (
        <div className="card-modern p-6 mb-6 bg-blue-50">
          <h3 className="text-xl font-bold mb-4">全体の解説</h3>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: question.overallExplanation }} />
        </div>
      )}

      {/* 学習ポイント */}
      {submitted && question.learningPoints && question.learningPoints.length > 0 && (
        <div className="card-modern p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">この問題で学べること</h3>
          <ul className="space-y-2">
            {question.learningPoints.map((point, index) => (
              <li key={index} className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-[#8E9C78] flex-shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* キーワード */}
      {question.keywords && question.keywords.length > 0 && (
        <div className="card-modern p-6">
          <h3 className="text-xl font-bold mb-4">関連キーワード</h3>
          <div className="flex flex-wrap gap-2">
            {question.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-[#6F6F6F] rounded-full text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
