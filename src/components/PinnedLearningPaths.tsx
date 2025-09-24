'use client';

import React from 'react';
import Link from 'next/link';
import { Pin, ChevronRight } from 'lucide-react';
import { usePinnedPaths } from '@/hooks/usePinnedPaths';
import LearningPathCard from './LearningPathCard';

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

interface PinnedLearningPathsProps {
  categories: Category[];
}

const PinnedLearningPaths: React.FC<PinnedLearningPathsProps> = ({ categories }) => {
  const { pinnedPaths, loading } = usePinnedPaths();

  // ピン固定された学習パスに対応するカテゴリを取得
  const pinnedCategories = React.useMemo(() => {
    if (!pinnedPaths.length) return [];

    return categories.filter(category =>
      pinnedPaths.some(pin => pin.learning_path_name === category.name)
    );
  }, [categories, pinnedPaths]);

  if (loading || pinnedCategories.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-black flex items-center">
          <Pin className="w-6 h-6 mr-3 text-[#8E9C78]" />
          ピン固定された学習パス
        </h3>
        <Link
          href="/learn"
          className="text-[#8E9C78] hover:text-[#7a8a6a] transition-colors flex items-center text-sm"
        >
          すべて見る <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {pinnedCategories.map((category) => (
          <LearningPathCard
            key={`pinned-${category.id}`}
            category={category}
            isPinned={true}
          />
        ))}
      </div>
    </div>
  );
};

export default PinnedLearningPaths;