'use client';

import { useState } from 'react';
import { ArrowLeft, BookOpen, List, ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { SpecificationDocument } from '@/types/specifications';
import Header from '@/components/Header';

interface PageClientProps {
  document: SpecificationDocument;
}

export default function PageClient({ document }: PageClientProps) {
  const [activeSection, setActiveSection] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentSection = document.sections[activeSection];

  const nextSection = () => {
    if (activeSection < document.sections.length - 1) {
      setActiveSection(activeSection + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const previousSection = () => {
    if (activeSection > 0) {
      setActiveSection(activeSection - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const canGoNext = activeSection < document.sections.length - 1;
  const canGoPrevious = activeSection > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* モバイルヘッダー */}
      <div className="lg:hidden bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/specifications"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-3"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            仕様書一覧に戻る
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-foreground">{document.title}</h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-accent rounded-lg"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* モバイルセクション選択 */}
        {sidebarOpen && (
          <div className="border-t border-border bg-background">
            <div className="max-h-[60vh] overflow-y-auto">
              {document.sections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveSection(index);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 border-b border-border transition-colors ${
                    activeSection === index
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  }`}
                >
                  <div className="text-sm font-medium">{section.title}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-4 lg:py-8">
        {/* デスクトップヘッダー */}
        <div className="hidden lg:block mb-8">
          <Link
            href="/specifications"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            仕様書一覧に戻る
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {document.title}
              </h1>
              <p className="text-muted-foreground">{document.description}</p>
            </div>
            <div className="text-sm text-muted-foreground">
              <div>最終更新: {document.updatedAt}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* サイドバー - デスクトップ */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-4">
              <div className="bg-card rounded-lg border border-border shadow-sm">
                <div className="p-4 border-b border-border">
                  <h2 className="font-bold text-foreground flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    目次
                  </h2>
                </div>
                <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                  {document.sections.map((section, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveSection(index)}
                      className={`w-full text-left px-4 py-3 border-b border-border transition-colors text-sm ${
                        activeSection === index
                          ? 'bg-primary text-primary-foreground font-medium'
                          : 'hover:bg-accent text-foreground'
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* メインコンテンツ */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-lg shadow-sm border border-border">
              <div className="p-6 lg:p-8">
                {/* セクションヘッダー */}
                <div className="mb-6 pb-4 border-b border-border">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <span>セクション {activeSection + 1} / {document.sections.length}</span>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                    {currentSection.title}
                  </h2>
                </div>

                {/* マークダウンコンテンツ */}
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({ ...props }) => (
                        <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground" {...props} />
                      ),
                      h2: ({ ...props }) => (
                        <h2 className="text-2xl font-bold mt-6 mb-3 text-foreground" {...props} />
                      ),
                      h3: ({ ...props }) => (
                        <h3 className="text-xl font-bold mt-4 mb-2 text-foreground" {...props} />
                      ),
                      p: ({ ...props }) => (
                        <p className="mb-4 leading-relaxed text-foreground" {...props} />
                      ),
                      ul: ({ ...props }) => (
                        <ul className="list-disc list-inside mb-4 space-y-1 text-foreground" {...props} />
                      ),
                      ol: ({ ...props }) => (
                        <ol className="list-decimal list-inside mb-4 space-y-1 text-foreground" {...props} />
                      ),
                      code: (props) => {
                        const { inline } = props as { inline?: boolean };
                        return inline ? (
                          <code
                            className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground"
                            {...props}
                          />
                        ) : (
                          <code
                            className="block bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono text-foreground"
                            {...props}
                          />
                        );
                      },
                      pre: ({ ...props }) => (
                        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4" {...props} />
                      ),
                      blockquote: ({ ...props }) => (
                        <blockquote
                          className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground"
                          {...props}
                        />
                      ),
                      a: ({ ...props }) => (
                        <a
                          className="text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {currentSection.content}
                  </ReactMarkdown>
                </div>

                {/* セクションナビゲーション */}
                <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
                  <button
                    onClick={previousSection}
                    disabled={!canGoPrevious}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                      canGoPrevious
                        ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4 mr-2 rotate-90" />
                    前のセクション
                  </button>

                  <span className="text-sm text-muted-foreground">
                    {activeSection + 1} / {document.sections.length}
                  </span>

                  <button
                    onClick={nextSection}
                    disabled={!canGoNext}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                      canGoNext
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}
                  >
                    次のセクション
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
