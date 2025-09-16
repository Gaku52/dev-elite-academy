import Link from 'next/link';
import { Code, ArrowLeft } from 'lucide-react';

export default function ProgrammingBasicsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container-modern py-12">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-[#8E9C78] hover:text-[#7a8a6a] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          ダッシュボードに戻る
        </Link>
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-[#5E72E4] rounded-2xl shadow-sm">
            <Code className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">
            プログラミング基礎
          </h1>
          <p className="text-xl text-[#6F6F6F] max-w-3xl mx-auto">
            プログラミング言語の基礎
          </p>
        </div>
        
        <div className="card-modern p-8 text-center">
          <p className="text-[#6F6F6F]">このコンテンツは準備中です</p>
        </div>
      </div>
    </div>
  );
}