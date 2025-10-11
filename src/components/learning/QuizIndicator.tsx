interface QuizIndicatorProps {
  totalQuizzes: number;
  currentQuizIndex: number;
  completedQuizzes: Set<string>;
  quizAnswers: { [key: string]: number };
  activeModule: number;
  activeSection: number;
  onQuizSelect: (index: number) => void;
}

export default function QuizIndicator({
  totalQuizzes,
  currentQuizIndex,
  completedQuizzes,
  quizAnswers,
  activeModule,
  activeSection,
  onQuizSelect
}: QuizIndicatorProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
      {Array.from({ length: totalQuizzes }, (_, index) => {
        const isCompleted = completedQuizzes.has(`${activeModule}-${activeSection}-${index}`);
        const isCurrent = index === currentQuizIndex;
        const hasAnswer = quizAnswers[`${activeModule}-${activeSection}-${index}`] !== undefined;

        return (
          <button
            key={index}
            onClick={() => onQuizSelect(index)}
            className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
              isCurrent
                ? 'bg-purple-600 dark:bg-purple-700 text-white shadow-lg scale-110'
                : isCompleted
                ? 'bg-green-600 dark:bg-green-700 text-white'
                : hasAnswer
                ? 'bg-yellow-600 dark:bg-yellow-700 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600'
            }`}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
}