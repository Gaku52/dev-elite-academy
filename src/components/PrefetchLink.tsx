'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { mutate } from 'swr';

interface PrefetchLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  prefetchData?: () => Promise<void>;
}

/**
 * データをプリフェッチするLinkコンポーネント
 * マウスオーバー時にデータを事前取得してSWRキャッシュに保存
 */
export default function PrefetchLink({ href, children, className, prefetchData }: PrefetchLinkProps) {
  const [isPrefetched, setIsPrefetched] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleMouseEnter = () => {
    // 既にプリフェッチ済みなら何もしない
    if (isPrefetched) return;

    // 100ms後にプリフェッチ開始（誤クリック防止）
    timeoutRef.current = setTimeout(async () => {
      if (prefetchData) {
        try {
          await prefetchData();
          setIsPrefetched(true);
        } catch (error) {
          console.error('Prefetch error:', error);
        }
      }
    }, 100);
  };

  const handleMouseLeave = () => {
    // タイムアウトをクリア
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Link
      href={href}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      prefetch={true} // Next.jsのプリフェッチも有効化
    >
      {children}
    </Link>
  );
}

/**
 * ユーザーIDを取得してSWRキーを生成するヘルパー
 */
export async function createPrefetchFn(userId: string, url: string) {
  return async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      // SWRキャッシュに保存
      mutate(url, data, false);
    } catch (error) {
      console.error('Prefetch failed:', error);
    }
  };
}
