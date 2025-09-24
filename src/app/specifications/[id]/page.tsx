'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink, FileText, Loader2 } from 'lucide-react';
import Header from '@/components/Header';

interface SpecificationViewerProps {
  params: Promise<{ id: string }>;
}

export default function SpecificationViewer({ params }: SpecificationViewerProps) {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [specId, setSpecId] = useState<string>('');
  const [specInfo, setSpecInfo] = useState<{ name: string; displayName: string } | null>(null);

  const router = useRouter();

  useEffect(() => {
    params.then(resolved => {
      setSpecId(resolved.id);
    });
  }, [params]);

  useEffect(() => {
    if (!specId) return;

    const fetchSpecification = async () => {
      try {
        // 仕様書情報を取得
        const specResponse = await fetch('/api/specifications');
        if (!specResponse.ok) {
          throw new Error('Failed to fetch specifications list');
        }
        const specifications = await specResponse.json();
        const spec = specifications.find((s: { name: string; displayName: string }) => s.name.replace('.html', '') === specId);

        if (!spec) {
          throw new Error('Specification not found');
        }

        setSpecInfo({
          name: spec.name,
          displayName: spec.displayName
        });

        // HTMLコンテンツを取得
        const contentResponse = await fetch(`/api/specifications/${specId}/content`);
        if (!contentResponse.ok) {
          throw new Error('Failed to fetch specification content');
        }

        const content = await contentResponse.text();
        setHtmlContent(content);
      } catch (err) {
        console.error('Error fetching specification:', err);
        setError(err instanceof Error ? err.message : '仕様書の読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchSpecification();
  }, [specId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="flex items-center space-x-3 text-[#6F6F6F]">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>仕様書を読み込んでいます...</span>
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
              <h2 className="text-xl font-bold text-red-700">仕様書の読み込みエラー</h2>
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => router.push('/specifications')}
              className="btn-secondary flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>仕様書一覧に戻る</span>
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
                onClick={() => router.push('/specifications')}
                className="flex items-center space-x-2 text-black hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>仕様書一覧に戻る</span>
              </button>
              {specInfo && (
                <div className="flex items-center space-x-2 text-black">
                  <span>｜</span>
                  <FileText className="w-4 h-4" />
                  <span>{specInfo.displayName}</span>
                </div>
              )}
            </div>

            <a
              href={`https://github.com/Gaku52/dev-elite-academy/blob/main/project-docs/specifications/${specInfo?.name}`}
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

      {/* 仕様書コンテンツ */}
      <div className="specification-viewer">
        <div
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          className="specification-content"
        />
      </div>

      <style jsx global>{`
        .specification-viewer {
          /* 仕様書のスタイルを調整 */
        }

        .specification-content {
          /* HTMLコンテンツ内のスタイルをオーバーライドしない */
        }

        /* 仕様書内のリンクスタイルを調整 */
        .specification-content a {
          color: #667eea;
          text-decoration: underline;
        }

        .specification-content a:hover {
          color: #764ba2;
        }
      `}</style>
    </div>
  );
}