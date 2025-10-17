'use client';

import Link from 'next/link';
import { memo } from 'react';
import type { LucideIcon } from 'lucide-react';

interface ModuleCardProps {
  id: number;
  title: string;
  description: string;
  category: string;
  icon: LucideIcon;
  topics: string[];
  color: string;
  progress: number;
  href: string;
}

/**
 * モジュールカードコンポーネント（メモ化済み）
 * propsが変更されない限り再レンダリングされない
 */
function ModuleCard({
  id,
  title,
  description,
  category,
  icon: Icon,
  topics,
  color,
  progress,
  href
}: ModuleCardProps) {
  return (
    <div key={id} className="card-modern p-6 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex items-start mb-4">
        <div className={`inline-flex items-center justify-center w-12 h-12 ${color} rounded-xl mr-4`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {title}
          </h3>
          <p className="text-sm text-muted mb-1">
            {description}
          </p>
          <div className="text-xs text-muted bg-card px-2 py-1 rounded-full inline-block">
            {category}
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {topics.map((item, index) => (
          <div key={index} className="flex items-center text-sm">
            <span className="w-2 h-2 bg-border rounded-full mr-2"></span>
            <span className="text-muted">{item}</span>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted">進捗</span>
          <span className="text-muted">{progress}%</span>
        </div>
        <div className="w-full bg-border rounded-full h-2">
          <div
            className={`${color} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <Link href={href || '#'} className="mt-4 w-full block" prefetch={true}>
        <button className="w-full py-2 px-4 bg-card hover:bg-card/80 text-foreground rounded-lg transition-colors text-sm font-medium">
          学習を開始 ({category})
        </button>
      </Link>
    </div>
  );
}

export default memo(ModuleCard);
