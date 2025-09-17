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
      <p className="text-gray-700 mb-6 text-sm lg:text-base font-medium">
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

      {showResult && (
        <div className={`mt-6 p-4 rounded-lg ${
          selectedAnswer === quiz.correct
            ? 'bg-green-100 text-green-800 border border-green-300'
            : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
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