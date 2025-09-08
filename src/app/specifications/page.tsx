'use client';

import { useState, useEffect } from 'react';
import { FileText, ExternalLink, FileCode } from 'lucide-react';
import Header from '@/components/Header';

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
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="text-[#6F6F6F]">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container-modern py-16">
          <div className="card-modern p-6 border-red-200 bg-red-50">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <section className="py-20">
        <div className="container-modern">
          <div className="mb-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              仕様書・設計書
            </h1>
            <p className="text-xl text-[#6F6F6F] max-w-2xl mx-auto">
              プロジェクトの仕様書と設計書の一覧です。各ドキュメントをクリックして詳細を確認できます。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {specifications.map((spec) => (
              <div
                key={spec.path}
                className="card-modern p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-[#8E9C78]/10 rounded-2xl group-hover:bg-[#8E9C78]/20 transition-colors">
                    <FileText className="w-6 h-6 text-[#8E9C78]" />
                  </div>
                  <span className="text-xs text-[#6F6F6F] bg-gray-100 px-2 py-1 rounded-full">
                    {formatFileSize(spec.size)}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-black mb-4 line-clamp-2">
                  {spec.displayName}
                </h3>
                
                <div className="flex flex-col gap-3 mt-6">
                  <a
                    href={spec.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-modern flex items-center justify-center gap-2 text-sm py-3"
                  >
                    <FileCode size={16} />
                    <span>HTMLで表示</span>
                  </a>
                  <a
                    href={spec.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex items-center justify-center gap-2 text-sm py-3"
                  >
                    <ExternalLink size={16} />
                    <span>GitHubで表示</span>
                  </a>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-[#6F6F6F]">
                    <FileText size={12} />
                    <span>{spec.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {specifications.length === 0 && !error && (
        <div className="container-modern">
          <div className="card-modern p-12 text-center">
            <FileText className="w-16 h-16 text-[#6F6F6F] mx-auto mb-4" />
            <p className="text-[#6F6F6F] text-lg">仕様書・設計書がまだありません</p>
          </div>
        </div>
      )}
    </div>
  );
}