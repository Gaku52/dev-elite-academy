'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink, FileText, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import type { DocumentConfig } from '@/types/documents';

interface DocumentViewerProps {
  documentId: string;
  config: DocumentConfig;
}

export default function DocumentViewer({ documentId, config }: DocumentViewerProps) {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [docInfo, setDocInfo] = useState<{ name: string; displayName: string } | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        // ドキュメント情報を取得
        const listResponse = await fetch(config.apiPath);
        if (!listResponse.ok) {
          throw new Error('Failed to fetch document list');
        }
        const documents = await listResponse.json();
        const doc = documents.find(
          (d: { name: string; displayName: string }) =>
            d.name.replace('.html', '') === documentId
        );

        if (!doc) {
          throw new Error('Document not found');
        }

        setDocInfo({
          name: doc.name,
          displayName: doc.displayName
        });

        // HTMLコンテンツを取得
        const contentResponse = await fetch(`${config.apiPath}/${documentId}/content`);
        if (!contentResponse.ok) {
          throw new Error('Failed to fetch document content');
        }

        const content = await contentResponse.text();
        setHtmlContent(content);
      } catch (err) {
        console.error('Error fetching document:', err);
        setError(err instanceof Error ? err.message : 'ドキュメントの読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [documentId, config.apiPath]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="flex items-center space-x-3 text-[#6F6F6F]">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>読み込んでいます...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container-modern py-16">
          <div className="card-modern p-6 border-red-200 bg-red-50 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-bold text-red-700">読み込みエラー</h2>
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => router.push(config.apiPath)}
              className="btn-secondary flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{config.backButtonText}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ナビゲーションヘッダー */}
      <div className="bg-gray-50 border-b border-gray-200 sticky top-0 z-40">
        <div className="container-modern py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push(config.apiPath)}
                className="flex items-center space-x-2 text-gray-900 hover:text-gray-600 transition-colors font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{config.backButtonText}</span>
              </button>
              {docInfo && (
                <div className="flex items-center space-x-2 text-gray-900 font-medium">
                  <span>｜</span>
                  <FileText className="w-4 h-4" />
                  <span>{docInfo.displayName}</span>
                </div>
              )}
            </div>

            <a
              href={`${config.githubRepoUrl}/${config.githubPath}/${docInfo?.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center space-x-2 text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              <span>GitHubで編集</span>
            </a>
          </div>
        </div>
      </div>

      {/* ドキュメントコンテンツ */}
      <div className="document-viewer">
        <div
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          className="document-content"
        />
      </div>

      <style jsx global>{`
        .document-viewer {
          /* ドキュメントのスタイルを調整 */
        }

        .document-content {
          /* HTMLコンテンツ内のスタイルをオーバーライドしない */
        }

        /* ドキュメント内のリンクスタイルを調整 */
        .document-content a {
          color: #667eea;
          text-decoration: underline;
        }

        .document-content a:hover {
          color: #764ba2;
        }
      `}</style>
    </div>
  );
}
