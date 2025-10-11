'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import QuestionViewer from '@/components/subject-b/QuestionViewer';
import type { SubjectBQuestion, UserAnswer } from '@/types/subject-b';
import { sampleAlgorithmQuestion } from '@/data/subject-b/sample-algorithm-question';
import { binarySearchQuestion } from '@/data/subject-b/binary-search-question';
import { stackQuestion } from '@/data/subject-b/stack-question';
import { recursionQuestion } from '@/data/subject-b/recursion-question';
import { queueQuestion } from '@/data/subject-b/queue-question';

interface SubjectBQuestionPageProps {
  params: Promise<{ id: string }>;
}

export default function SubjectBQuestionPage({ params }: SubjectBQuestionPageProps) {
  const [questionId, setQuestionId] = useState<string>('');
  const [question, setQuestion] = useState<SubjectBQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    params.then(resolved => {
      setQuestionId(resolved.id);
    });
  }, [params]);

  useEffect(() => {
    if (!questionId) return;

    // TODO: 将来的にはAPIから問題を取得
    // 現在は静的データから取得
    const allQuestions = [
      sampleAlgorithmQuestion,
      binarySearchQuestion,
      stackQuestion,
      recursionQuestion,
      queueQuestion
    ];

    const foundQuestion = allQuestions.find(q => q.id === questionId);
    setQuestion(foundQuestion || null);
    setLoading(false);
  }, [questionId]);

  const handleComplete = async (answers: UserAnswer[], score: number, timeSpent: number) => {
    console.log('問題完了:', { answers, score, timeSpent });

    // TODO: APIに結果を送信して進捗を保存
    try {
      // const response = await fetch('/api/subject-b/progress', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     questionId: question?.id,
      //     answers,
      //     score,
      //     timeSpent
      //   })
      // });

      console.log('結果を保存しました（実装予定）');
    } catch (error) {
      console.error('結果の保存に失敗:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-modern py-16">
          <div className="card-modern p-6 border-destructive/20 bg-destructive/10">
            <h2 className="text-xl font-bold text-destructive mb-4">問題が見つかりません</h2>
            <p className="text-destructive/80 mb-4">指定された問題は存在しないか、まだ公開されていません。</p>
            <button
              onClick={() => router.push('/subject-b')}
              className="btn-secondary flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>問題一覧に戻る</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* ナビゲーションヘッダー */}
      <div className="bg-secondary border-b border-border sticky top-0 z-40">
        <div className="container-modern py-4">
          <button
            onClick={() => router.push('/subject-b')}
            className="flex items-center space-x-2 text-foreground hover:text-muted-foreground transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>問題一覧に戻る</span>
          </button>
        </div>
      </div>

      {/* 問題コンテンツ */}
      <QuestionViewer question={question} onComplete={handleComplete} />
    </div>
  );
}
