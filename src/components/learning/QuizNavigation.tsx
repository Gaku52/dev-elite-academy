interface QuizNavigationProps {
  currentQuizIndex: number;
  totalQuizzes: number;
  onPrevious: () => void;
  onNext: () => void;
}

export default function QuizNavigation({
  currentQuizIndex,
  totalQuizzes,
  onPrevious,
  onNext
}: QuizNavigationProps) {
  const canGoPrevious = currentQuizIndex > 0;
  const canGoNext = currentQuizIndex < totalQuizzes - 1;

  return (
    <div className="flex justify-between mt-6">
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
      >
        ← 前の問題
      </button>
      <button
        onClick={onNext}
        disabled={!canGoNext}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
      >
        次の問題 →
      </button>
    </div>
  );
}