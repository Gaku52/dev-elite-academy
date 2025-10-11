'use client';

import { ArrowRight, Clock, BookOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { sampleAlgorithmQuestion } from '@/data/subject-b/sample-algorithm-question';
import { binarySearchQuestion } from '@/data/subject-b/binary-search-question';
import { stackQuestion } from '@/data/subject-b/stack-question';
import { recursionQuestion } from '@/data/subject-b/recursion-question';
import { queueQuestion } from '@/data/subject-b/queue-question';

export default function SubjectBPage() {
  // TODO: 将来的には全問題をAPIから取得
  const questions = [
    sampleAlgorithmQuestion,
    binarySearchQuestion,
    stackQuestion,
    recursionQuestion,
    queueQuestion
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <section className="py-12">
        <div className="container-modern">
          <Link
            href="/modules/it-fundamentals"
            className="inline-flex items-center text-primary hover:text-primary-hover mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            基本情報技術者試験に戻る
          </Link>

          <div className="mb-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-primary rounded-2xl shadow-sm">
              <BookOpen className="w-8 h-8 text-white dark:text-gray-900" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              科目B 過去問題
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              基本情報技術者試験 科目Bの過去問題集です。アルゴリズムとプログラミングの理解を深めましょう。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {questions.map((question) => (
              <Link
                key={question.id}
                href={`/subject-b/questions/${question.id}`}
                className="card-modern p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    question.difficulty === 'easy' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                    question.difficulty === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}>
                    {question.difficulty === 'easy' ? '易' :
                     question.difficulty === 'medium' ? '中' : '難'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {question.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {question.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{question.timeEstimate}分</span>
                  </div>
                  <div className="flex items-center space-x-2 text-primary font-medium group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
                    <span>問題を解く</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {question.keywords?.slice(0, 3).map((keyword, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {questions.length === 0 && (
            <div className="card-modern p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">問題がまだありません</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
