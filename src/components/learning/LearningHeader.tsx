import Link from 'next/link';
import { ArrowLeft, Code } from 'lucide-react';
import LearningProgressBar from './LearningProgressBar';

interface LearningHeaderProps {
  title: string;
  description?: string;
  backLink: string;
  backLinkText: string;
  completedCount: number;
  totalCount: number;
  progress: number;
  icon?: React.ReactNode;
  isMobile?: boolean;
}

export default function LearningHeader({
  title,
  description,
  backLink,
  backLinkText,
  completedCount,
  totalCount,
  progress,
  icon = <Code className="w-6 h-6 text-white" />,
  isMobile = false
}: LearningHeaderProps) {
  if (isMobile) {
    return (
      <div className="lg:hidden bg-surface border-b border-border sticky top-0 z-10">
        <div className="p-4">
          <Link
            href={backLink}
            className="inline-flex items-center text-primary text-sm mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            戻る
          </Link>
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
          <div className="mt-2">
            <LearningProgressBar
              progress={progress}
              completedCount={completedCount}
              totalCount={totalCount}
              size="small"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden lg:block mb-6">
      <Link
        href={backLink}
        className="inline-flex items-center text-primary hover:text-primary/80 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {backLinkText}
      </Link>

      <div className="bg-surface rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mr-4">
            {icon}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {completedCount}/{totalCount}
            </div>
            <div className="text-sm text-muted-foreground">問題完了</div>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <LearningProgressBar
            progress={progress}
            completedCount={completedCount}
            totalCount={totalCount}
            size="large"
            showPercentage={true}
          />
        </div>
      </div>
    </div>
  );
}