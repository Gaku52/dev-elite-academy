'use client';

import { useEffect, useState } from 'react';

interface CategoryContentCountProps {
  categoryName: string;
  fallbackCount: number;
}

interface ModuleContentData {
  categoryName: string;
  implementedModules?: number;
  contentCount?: number;
}

export default function CategoryContentCount({ categoryName, fallbackCount }: CategoryContentCountProps) {
  const [contentData, setContentData] = useState<ModuleContentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContentCount = async () => {
      try {
        const response = await fetch(`/api/learning-module-contents?categoryName=${encodeURIComponent(categoryName)}`);
        if (response.ok) {
          const data = await response.json();
          setContentData(data);
        } else {
          console.warn(`Failed to fetch content count for ${categoryName}`);
        }
      } catch (error) {
        console.error(`Error fetching content count for ${categoryName}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchContentCount();
  }, [categoryName]);

  // データ取得中で、キャッシュデータもなく、fallbackCountも0の場合のみローディング表示
  if (loading && !contentData && fallbackCount === 0) {
    return <span className="text-xs text-olive-600 dark:text-olive-400 animate-pulse">読込中...</span>;
  }

  // データがない場合はfallbackCountを表示（0でない値があればそれを表示）
  if (!contentData) {
    // fallbackCountが0の場合は表示しない
    if (fallbackCount === 0) {
      return null;
    }
    return <span className="text-xs text-olive-600 dark:text-olive-400">{fallbackCount} コンテンツ</span>;
  }

  // 基本情報技術者試験の場合は実装済みモジュール数を表示
  if (categoryName === '基本情報技術者試験' && contentData.implementedModules !== undefined) {
    return (
      <span className="text-xs text-olive-600 dark:text-olive-400">
        {contentData.implementedModules} コンテンツ
      </span>
    );
  }

  // 他のカテゴリの場合はコンテンツ数を表示
  return (
    <span className="text-xs text-olive-600 dark:text-olive-400">
      {contentData.contentCount || fallbackCount} コンテンツ
    </span>
  );
}