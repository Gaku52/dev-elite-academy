'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import MarkdownViewer from '@/components/MarkdownViewer';

interface FileItem {
  name: string;
  path: string;
  downloadUrl: string;
  displayName: string;
}

export default function FEExamPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/fe-exam/files');
      if (!response.ok) throw new Error('Failed to fetch files');

      const data = await response.json();
      setFiles(data.files);
      setError('');
    } catch (err) {
      setError('ファイル一覧の取得に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFileContent = async (file: FileItem) => {
    try {
      setContentLoading(true);
      setSelectedFile(file);

      const response = await fetch(
        `/api/fe-exam/content?path=${encodeURIComponent(file.path)}`
      );
      if (!response.ok) throw new Error('Failed to fetch content');

      const data = await response.json();
      setContent(data.content);
      setError('');
    } catch (err) {
      setError('ファイル内容の取得に失敗しました');
      console.error(err);
    } finally {
      setContentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-[#8E9C78] hover:text-[#7a8a6a] mb-6 sm:mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          ダッシュボードに戻る
        </Link>

        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 sm:mb-6 bg-[#4A90E2] rounded-2xl shadow-sm">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-black mb-3 sm:mb-4">
            基本情報技術者試験 学習資料
          </h1>
          <p className="text-lg sm:text-xl text-[#6F6F6F] max-w-2xl mx-auto px-4">
            GitHubリポジトリから最新の学習資料を表示
          </p>
        </div>

        {error && (
          <div className="mb-6 sm:mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm sm:text-base">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* File List */}
          <div className="lg:col-span-1">
            <div className="card-modern p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4 text-black">
                学習資料一覧
              </h2>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-[#8E9C78] animate-spin" />
                </div>
              ) : files.length === 0 ? (
                <p className="text-[#6F6F6F] text-center py-8">
                  資料が見つかりませんでした
                </p>
              ) : (
                <div className="space-y-2">
                  {files.map((file) => (
                    <button
                      key={file.path}
                      onClick={() => fetchFileContent(file)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedFile?.path === file.path
                          ? 'bg-[#8E9C78] text-white'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-medium truncate">
                          {file.displayName}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Content Viewer */}
          <div className="lg:col-span-3">
            <div className="card-modern p-4 sm:p-6 lg:p-8">
              {!selectedFile ? (
                <div className="text-center py-12 sm:py-20 text-[#6F6F6F]">
                  <FileText className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-base sm:text-lg">左側から資料を選択してください</p>
                </div>
              ) : contentLoading ? (
                <div className="flex items-center justify-center py-12 sm:py-20">
                  <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-[#8E9C78] animate-spin" />
                </div>
              ) : (
                <div>
                  <div className="mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200">
                    <h2 className="text-xl sm:text-2xl font-bold text-black">
                      {selectedFile.displayName}
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    <MarkdownViewer content={content} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
