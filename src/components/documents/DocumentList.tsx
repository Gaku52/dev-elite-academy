'use client';

import { useState, useEffect } from 'react';
import { FileText, ExternalLink, FileCode, Eye } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import type { DocumentItem, DocumentConfig } from '@/types/documents';

interface DocumentListProps {
  config: DocumentConfig;
}

export default function DocumentList({ config }: DocumentListProps) {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(config.apiPath);
        if (!response.ok) {
          throw new Error('Failed to fetch documents');
        }
        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        console.error('Error fetching documents:', error);
        setError('ドキュメントの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [config.apiPath]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
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
              {config.pageTitle}
            </h1>
            <p className="text-xl text-[#6F6F6F] max-w-2xl mx-auto">
              {config.pageDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {documents.map((doc) => (
              <div
                key={doc.path}
                className="card-modern p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-[#8E9C78]/10 rounded-2xl group-hover:bg-[#8E9C78]/20 transition-colors">
                    <FileText className="w-6 h-6 text-[#8E9C78]" />
                  </div>
                  <span className="text-xs text-[#6F6F6F] bg-gray-100 px-2 py-1 rounded-full">
                    {formatFileSize(doc.size)}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-black mb-4 line-clamp-2">
                  {doc.displayName}
                </h3>

                <div className="flex flex-col gap-3 mt-6">
                  <Link
                    href={`${config.apiPath}/${doc.name.replace('.html', '')}`}
                    className="btn-modern flex items-center justify-center gap-2 text-sm py-3"
                  >
                    <Eye size={16} />
                    <span>{config.viewButtonText}</span>
                  </Link>
                  <a
                    href={doc.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex items-center justify-center gap-2 text-sm py-3"
                  >
                    <FileCode size={16} />
                    <span>RAWで表示</span>
                  </a>
                  <a
                    href={doc.htmlUrl}
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
                    <span>{doc.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {documents.length === 0 && !error && (
        <div className="container-modern">
          <div className="card-modern p-12 text-center">
            <FileText className="w-16 h-16 text-[#6F6F6F] mx-auto mb-4" />
            <p className="text-[#6F6F6F] text-lg">{config.emptyMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
