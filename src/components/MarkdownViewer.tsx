'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github.css';

interface MarkdownViewerProps {
  content: string;
}

export default function MarkdownViewer({ content }: MarkdownViewerProps) {
  return (
    <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-800 prose-strong:text-gray-900 prose-code:text-blue-600 prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200 prose-a:text-blue-600 prose-li:text-gray-800 prose-blockquote:text-gray-700 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-table:text-gray-800">
      <style jsx global>{`
        .prose code {
          background-color: #f3f4f6;
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-size: 0.9em;
        }
        .prose pre code {
          background-color: transparent;
          padding: 0;
        }
        .prose pre {
          background-color: #f9fafb !important;
          border: 1px solid #e5e7eb !important;
          color: #1f2937 !important;
        }
        .prose table {
          border-collapse: collapse;
          width: 100%;
        }
        .prose th {
          background-color: #f3f4f6;
          color: #111827;
          font-weight: 600;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
        }
        .prose td {
          color: #374151;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
        }
        .prose tr:nth-child(even) {
          background-color: #f9fafb;
        }
      `}</style>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
