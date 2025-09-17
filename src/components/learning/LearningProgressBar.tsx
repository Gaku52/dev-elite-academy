interface LearningProgressBarProps {
  progress: number;
  completedCount: number;
  totalCount: number;
  size?: 'small' | 'large';
  showPercentage?: boolean;
  className?: string;
}

export default function LearningProgressBar({
  progress,
  completedCount,
  totalCount,
  size = 'large',
  showPercentage = true,
  className = ''
}: LearningProgressBarProps) {
  const isSmall = size === 'small';
  const barHeight = isSmall ? 'h-2' : 'h-3';

  return (
    <div className={className}>
      {showPercentage && (
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">
            {isSmall ? '進捗' : '学習進捗'}
          </span>
          <span className="text-gray-900 font-medium">
            {Math.round(progress)}%
          </span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${barHeight}`}>
        <div
          className={`bg-purple-500 ${barHeight} rounded-full transition-all duration-300`}
          style={{ width: `${progress}%` }}
        />
      </div>
      {!isSmall && (
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>{completedCount}問完了</span>
          <span>全{totalCount}問</span>
        </div>
      )}
    </div>
  );
}