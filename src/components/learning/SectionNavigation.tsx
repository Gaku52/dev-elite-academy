import { ChevronRight, Trophy } from 'lucide-react';

interface SectionNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isCompleted: boolean;
}

export default function SectionNavigation({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  isCompleted
}: SectionNavigationProps) {
  return (
    <div className="flex flex-col lg:flex-row justify-between gap-4 mt-8">
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className="px-6 py-3 border border-gray-300 dark:border-dark-border text-gray-700 dark:text-dark-primary rounded-lg hover:bg-gray-50 dark:hover:bg-dark-card disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm lg:text-base"
      >
        ← 前のセクション
      </button>

      {/* 達成度表示 */}
      {isCompleted && (
        <div className="flex items-center justify-center px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg">
          <Trophy className="w-5 h-5 mr-2" />
          <span className="font-medium">セクション完了！</span>
        </div>
      )}

      <button
        onClick={onNext}
        disabled={!canGoNext}
        className="px-6 py-3 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-sm lg:text-base"
      >
        次のセクション
        <ChevronRight className="w-4 h-4 ml-1" />
      </button>
    </div>
  );
}