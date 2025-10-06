'use client';

import { useState, useEffect } from 'react';
import DocumentViewer from '@/components/documents/DocumentViewer';
import { subjectBConfig } from '@/config/documents';

interface SubjectBViewerProps {
  params: Promise<{ id: string }>;
}

export default function SubjectBViewerPage({ params }: SubjectBViewerProps) {
  const [questionId, setQuestionId] = useState<string>('');

  useEffect(() => {
    params.then(resolved => {
      setQuestionId(resolved.id);
    });
  }, [params]);

  if (!questionId) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="text-[#6F6F6F]">読み込み中...</div>
      </div>
    );
  }

  return <DocumentViewer documentId={questionId} config={subjectBConfig} />;
}
