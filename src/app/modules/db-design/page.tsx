import Link from 'next/link';
import { Database, ArrowLeft } from 'lucide-react';

export default function DBDesignPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-modern py-12">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-primary hover:text-primary/80 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          ダッシュボードに戻る
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-[#000000] dark:bg-[#1a1a1a] rounded-2xl shadow-sm">
            <Database className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            DB設計
          </h1>
          <p className="text-xl text-muted max-w-3xl mx-auto">
            データベース設計の基礎と実践
          </p>
        </div>

        <div className="card-modern p-8 text-center">
          <p className="text-muted">このコンテンツは準備中です</p>
        </div>
      </div>
    </div>
  );
}