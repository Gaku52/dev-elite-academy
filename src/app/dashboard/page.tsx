'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Book, 
  Clock, 
  Target, 
  TrendingUp,
  PlayCircle,
  CheckCircle,
  BookOpen,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { getCategories, getLearningContents, Category, LearningContent } from '@/lib/supabase';

const difficultyColors = {
  EASY: 'bg-green-100 text-green-800 border-green-200',
  MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
  HARD: 'bg-red-100 text-red-800 border-red-200'
};

const contentTypeIcons = {
  ARTICLE: <BookOpen className="w-4 h-4" />,
  VIDEO: <PlayCircle className="w-4 h-4" />,
  QUIZ: <Target className="w-4 h-4" />,
  EXERCISE: <Book className="w-4 h-4" />,
  FLASHCARD: <Award className="w-4 h-4" />
};

export default function Dashboard() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [learningContents, setLearningContents] = useState<LearningContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [categoriesData, contentsData] = await Promise.all([
          getCategories(),
          getLearningContents()
        ]);
        setCategories(categoriesData);
        setLearningContents(contentsData);
      } catch (err) {
        setError('データの取得に失敗しました');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
          <p className="text-white mt-4">学習データを読み込んでいます...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-purple-800/30 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-400 mr-3" />
              <h1 className="text-xl font-semibold text-white">学習ダッシュボード</h1>
            </div>
            <Link
              href="/"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              ← ホームに戻る
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            🚀 学習の旅を始めましょう
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            体系的な学習で、エンジニアとしてのスキルを効率的に向上させましょう
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 rounded-lg p-6 border border-purple-700/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">利用可能コンテンツ</p>
                <p className="text-2xl font-bold text-white">{learningContents.length}</p>
              </div>
              <Book className="w-8 h-8 text-purple-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-800/30 to-cyan-800/30 rounded-lg p-6 border border-blue-700/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm">学習カテゴリー</p>
                <p className="text-2xl font-bold text-white">{categories.length}</p>
              </div>
              <Target className="w-8 h-8 text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-800/30 to-emerald-800/30 rounded-lg p-6 border border-green-700/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm">学習時間（予想）</p>
                <p className="text-2xl font-bold text-white">
                  {Math.round(learningContents.reduce((total, content) => total + content.estimated_time, 0) / 60)}時間
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-yellow-800/30 to-orange-800/30 rounded-lg p-6 border border-yellow-700/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-300 text-sm">完了率</p>
                <p className="text-2xl font-bold text-white">0%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-yellow-400" />
            </div>
          </motion.div>
        </div>

        {/* Categories Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-white mb-6">📚 学習カテゴリー</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 rounded-lg p-6 border border-slate-600/30 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
                    {category.icon}
                  </span>
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color || '#8B5CF6' }}
                  ></div>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {category.name}
                </h4>
                <p className="text-gray-400 text-sm">
                  {category.description}
                </p>
                <div className="mt-4 text-xs text-purple-400">
                  {learningContents.filter(content => content.category_id === category.id).length} コンテンツ
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-2xl font-bold text-white mb-6">🆕 最新の学習コンテンツ</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningContents.slice(0, 6).map((content, index) => (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 rounded-lg p-6 border border-slate-600/30 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {contentTypeIcons[content.content_type]}
                    <span className="text-purple-400 text-sm capitalize">
                      {content.content_type}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs border ${difficultyColors[content.difficulty]}`}>
                    {content.difficulty}
                  </span>
                </div>
                
                <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {content.title}
                </h4>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {content.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{content.estimated_time}分</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {content.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-purple-800/30 text-purple-300 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-12 text-center bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-8 border border-purple-500/30"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            🎯 今すぐ学習を開始しよう！
          </h3>
          <p className="text-gray-300 mb-6">
            体系的な学習で、確実にスキルアップを図りましょう
          </p>
          <Link
            href="/modules/ai-ml"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <PlayCircle className="w-5 h-5 mr-2" />
            Claude Code学習を始める
          </Link>
        </motion.div>
      </div>
    </div>
  );
}