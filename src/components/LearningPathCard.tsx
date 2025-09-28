'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Pin } from 'lucide-react';
import { usePinnedPaths } from '@/hooks/usePinnedPaths';
import { getLearningPathUrl } from '@/lib/learning-paths';
import CategoryContentCount from './CategoryContentCount';

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  color?: string;
}

interface LearningPathCardProps {
  category: Category;
  isPinned?: boolean;
}

const LearningPathCard: React.FC<LearningPathCardProps> = ({
  category,
  isPinned = false,
}) => {
  const { pinPath, unpinPath, isPathPinned } = usePinnedPaths();
  const [isToggling, setIsToggling] = useState(false);

  const pathUrl = getLearningPathUrl(category.name);
  const pinned = isPathPinned(category.name);

  const handlePinToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isToggling) return;

    setIsToggling(true);
    try {
      if (pinned) {
        await unpinPath(category.name);
      } else {
        await pinPath(category.name);
      }
    } catch (error) {
      console.error('Error toggling pin:', error);
    } finally {
      setIsToggling(false);
    }
  };

  const cardContent = (
    <div
      className={`card-modern p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1 relative h-32 flex flex-col ${
        isPinned || pinned
          ? 'border-2 border-[#8E9C78] bg-gradient-to-br from-[#8E9C78]/5 to-transparent'
          : ''
      }`}
    >
      {/* ピンボタン */}
      <button
        onClick={handlePinToggle}
        disabled={isToggling}
        className={`absolute top-2 right-2 p-1 rounded-full transition-all duration-300 z-10 ${
          pinned
            ? 'bg-[#8E9C78] text-white shadow-md'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-[#8E9C78]'
        } ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={pinned ? 'ピン固定を解除' : 'ピン固定'}
      >
        <Pin
          className={`w-3 h-3 transition-transform duration-300 ${
            pinned ? 'fill-current rotate-12' : ''
          }`}
        />
      </button>

      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">
          {category.icon}
        </span>
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: category.color || '#8E9C78' }}
        ></div>
      </div>

      <h4 className={`text-sm font-semibold mb-1 group-hover:text-[#8E9C78] transition-colors ${
        isPinned || pinned ? 'text-[#8E9C78]' : 'text-black'
      }`}>
        {category.name}
        {(isPinned || pinned) && (
          <Pin className="inline-block w-3 h-3 ml-1 fill-current" />
        )}
      </h4>

      <p className="text-[#6F6F6F] text-xs flex-1 line-clamp-2">
        {category.description}
      </p>

      <div className="mt-auto pt-2">
        <CategoryContentCount
          categoryName={category.name}
          fallbackCount={0}
        />
      </div>
    </div>
  );

  if (pathUrl) {
    return (
      <Link href={pathUrl} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default LearningPathCard;