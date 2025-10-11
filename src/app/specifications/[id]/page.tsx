'use client';

import { useState, useEffect } from 'react';
import DocumentViewer from '@/components/documents/DocumentViewer';
import { specificationsConfig } from '@/config/documents';

interface SpecificationViewerProps {
  params: Promise<{ id: string }>;
}

export default function SpecificationViewerPage({ params }: SpecificationViewerProps) {
  const [specId, setSpecId] = useState<string>('');

  useEffect(() => {
    params.then(resolved => {
      setSpecId(resolved.id);
    });
  }, [params]);

  if (!specId) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        <div className="text-muted-foreground">読み込み中...</div>
      </div>
    );
  }

  return <DocumentViewer documentId={specId} config={specificationsConfig} />;
}