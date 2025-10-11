import { CheckCircle, AlertCircle } from 'lucide-react';
import { Quiz } from '@/types/learning';

interface QuizComponentProps {
  quiz: Quiz;
  selectedAnswer?: number;
  showResult: boolean;
  onAnswerSelect: (answer: number) => void;
}

export default function QuizComponent({
  quiz,
  selectedAnswer,
  showResult,
  onAnswerSelect
}: QuizComponentProps) {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-dark-secondary mb-6 text-sm lg:text-base font-medium">
        {quiz.question}
      </p>

      <div className="space-y-3">
        {quiz.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === quiz.correct;

          return (
            <button
              key={index}
              onClick={() => onAnswerSelect(index)}
              disabled={showResult}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all text-sm lg:text-base ${
                showResult
                  ? isCorrect
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600 text-green-700 dark:text-green-300'
                    : isSelected
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-600 text-red-700 dark:text-red-300'
                    : 'bg-gray-50 dark:bg-dark-card border-gray-200 dark:border-dark-border text-gray-500 dark:text-dark-secondary'
                  : isSelected
                  ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-400 dark:border-purple-600 text-purple-700 dark:text-purple-300'
                  : 'hover:bg-gray-50 dark:hover:bg-dark-card border-gray-200 dark:border-dark-border text-gray-700 dark:text-dark-primary hover:border-gray-300 dark:hover:border-dark-border'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {showResult && (
                  <span className="ml-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : isSelected ? (
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    ) : null}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className={`mt-6 p-4 rounded-lg ${
          selectedAnswer === quiz.correct
            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-700'
            : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700'
        }`}>
          <div className="flex items-start">
            <span className="text-xl mr-2">
              {selectedAnswer === quiz.correct ? '✅' : '💡'}
            </span>
            <div>
              <p className="font-semibold mb-1">
                {selectedAnswer === quiz.correct ? '正解です！' : '解説'}
              </p>
              <p className="text-sm">{quiz.explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}