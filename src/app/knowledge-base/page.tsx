'use client';

import { useState, useEffect } from 'react';
import { BookOpen, ChevronRight, FileText, Folder } from 'lucide-react';
import Header from '@/components/Header';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

const knowledgeBaseStructure: FileNode[] = [
  {
    name: 'アプリケーションタイプ',
    path: 'application-types',
    type: 'folder',
    children: [
      { name: '概要', path: 'application-types/index', type: 'file' },
      { name: '実行環境別分類', path: 'application-types/execution-environment', type: 'file' },
      { name: 'サービスモデル', path: 'application-types/service-models', type: 'file' },
      { name: 'アーキテクチャパターン', path: 'application-types/architecture-patterns', type: 'file' },
      { name: 'クイックスタートマトリックス', path: 'application-types/quick-start-matrix', type: 'file' },
    ],
  },
  {
    name: '技術スタック',
    path: 'tech-stacks',
    type: 'folder',
    children: [
      { name: 'フロントエンド', path: 'tech-stacks/frontend', type: 'file' },
      { name: 'バックエンド', path: 'tech-stacks/backend', type: 'file' },
    ],
  },
  {
    name: 'インフラストラクチャ',
    path: 'infrastructure',
    type: 'folder',
    children: [
      { name: 'クラウドプロバイダー比較', path: 'infrastructure/cloud-providers', type: 'file' },
    ],
  },
  {
    name: 'テンプレート',
    path: 'templates',
    type: 'folder',
    children: [
      { name: 'SaaS MVP', path: 'templates/saas-mvp', type: 'file' },
    ],
  },
  {
    name: 'ベストプラクティス',
    path: 'best-practices',
    type: 'folder',
    children: [
      { name: 'コーディング規約', path: 'best-practices/coding-standards', type: 'file' },
      { name: 'プロジェクト構成', path: 'best-practices/project-structure', type: 'file' },
    ],
  },
  {
    name: 'キャリア戦略',
    path: 'career-strategy',
    type: 'folder',
    children: [
      { name: 'IT資格', path: 'career-strategy/certifications', type: 'file' },
      { name: '副業戦略', path: 'career-strategy/side-business', type: 'file' },
    ],
  },
];

export default function KnowledgeBasePage() {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['application-types']));

  useEffect(() => {
    // Load README.md by default
    loadMarkdown('README');
  }, []);

  const loadMarkdown = async (path: string) => {
    setIsLoading(true);
    setSelectedDoc(path);

    try {
      const response = await fetch(`/api/knowledge-base?path=${encodeURIComponent(path)}`);
      if (!response.ok) {
        throw new Error('Failed to load markdown');
      }
      const data = await response.json();
      setMarkdownContent(data.content);
    } catch (error) {
      console.error('Error loading markdown:', error);
      setMarkdownContent('# エラー\n\nMarkdownファイルの読み込みに失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const renderFileTree = (nodes: FileNode[], level = 0) => {
    return nodes.map((node) => (
      <div key={node.path} style={{ marginLeft: `${level * 1}rem` }}>
        {node.type === 'folder' ? (
          <>
            <button
              onClick={() => toggleFolder(node.path)}
              className="flex items-center w-full text-left py-2 px-3 hover:bg-card rounded-lg transition-colors group"
            >
              <ChevronRight
                className={`w-4 h-4 mr-2 transition-transform ${
                  expandedFolders.has(node.path) ? 'rotate-90' : ''
                }`}
              />
              <Folder className="w-4 h-4 mr-2 text-blue-500" />
              <span className="font-medium text-foreground group-hover:text-primary">
                {node.name}
              </span>
            </button>
            {expandedFolders.has(node.path) && node.children && (
              <div className="ml-2">
                {renderFileTree(node.children, level + 1)}
              </div>
            )}
          </>
        ) : (
          <button
            onClick={() => loadMarkdown(node.path)}
            className={`flex items-center w-full text-left py-2 px-3 hover:bg-card rounded-lg transition-colors ${
              selectedDoc === node.path ? 'bg-card border-l-2 border-primary' : ''
            }`}
          >
            <FileText className="w-4 h-4 mr-2 ml-6 text-muted" />
            <span className={`text-sm ${selectedDoc === node.path ? 'text-primary font-medium' : 'text-muted'}`}>
              {node.name}
            </span>
          </button>
        )}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">開発ナレッジベース</h1>
          </div>
          <p className="text-muted ml-15">
            アプリケーション開発のための総合的なドキュメントとベストプラクティス
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-4 sticky top-24">
              <h2 className="text-lg font-semibold text-foreground mb-4">目次</h2>
              <nav className="space-y-1">
                <button
                  onClick={() => loadMarkdown('README')}
                  className={`flex items-center w-full text-left py-2 px-3 hover:bg-card rounded-lg transition-colors ${
                    selectedDoc === 'README' ? 'bg-card border-l-2 border-primary' : ''
                  }`}
                >
                  <BookOpen className="w-4 h-4 mr-2 text-primary" />
                  <span className={`text-sm font-medium ${selectedDoc === 'README' ? 'text-primary' : 'text-foreground'}`}>
                    ホーム
                  </span>
                </button>
                {renderFileTree(knowledgeBaseStructure)}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-card border border-border rounded-2xl p-8">
              {isLoading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <MarkdownRenderer content={markdownContent} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div
      className="markdown-body"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
