'use client';

import { useState, useEffect } from 'react';
import { FileText, ExternalLink, Calendar, FileCode } from 'lucide-react';
import Header from '@/components/Header';
import Link from 'next/link';

interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
}

interface Specification {
  name: string;
  displayName: string;
  path: string;
  size: number;
  downloadUrl: string;
  htmlUrl: string;
  lastModified?: string;
}

export default function SpecificationsPage() {
  const [specifications, setSpecifications] = useState<Specification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSpecifications();
  }, []);

  const fetchSpecifications = async () => {
    try {
      const response = await fetch('/api/specifications');
      if (!response.ok) {
        throw new Error('Failed to fetch specifications');
      }
      const data = await response.json();
      setSpecifications(data);
    } catch (error) {
      console.error('Error fetching specifications:', error);
      setError('仕様書の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDisplayName = (name: string) => {
    return name
      .replace('.html', '')
      .replace(/-/g, ' ')
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex justify-center items-center">
        <div className="text-white">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-900/20 backdrop-blur-sm p-6 rounded-lg border border-red-800/30">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
            仕様書・設計書
          </h1>
          <p className="text-gray-300">
            プロジェクトの仕様書と設計書の一覧です。各ドキュメントをクリックして詳細を確認できます。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specifications.map((spec) => (
            <div
              key={spec.path}
              className="bg-black/40 backdrop-blur-sm rounded-lg border border-purple-800/30 hover:border-purple-600/50 transition-all duration-300 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-purple-900/30 rounded-lg group-hover:bg-purple-800/40 transition-colors">
                    <FileText className="w-6 h-6 text-purple-400" />
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatFileSize(spec.size)}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                  {spec.displayName}
                </h3>
                
                <div className="flex items-center gap-4 mt-4">
                  <a
                    href={spec.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <FileCode size={16} />
                    <span>HTMLで表示</span>
                  </a>
                  <a
                    href={spec.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    <ExternalLink size={16} />
                    <span>GitHubで表示</span>
                  </a>
                </div>
              </div>
              
              <div className="px-6 py-3 bg-purple-900/20 border-t border-purple-800/30">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <FileText size={14} />
                  <span>{spec.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {specifications.length === 0 && !error && (
          <div className="bg-black/40 backdrop-blur-sm p-8 rounded-lg border border-purple-800/30 text-center">
            <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">仕様書・設計書がまだありません</p>
          </div>
        )}
      </div>
    </div>
  );
}