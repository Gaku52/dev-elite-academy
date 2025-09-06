'use client';

import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Clock, 
  CheckCircle, 
  PlayCircle, 
  BookOpen,
  Code,
  Target,
  ChevronLeft,
  ChevronRight,
  Award,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface LearnPageProps {
  params: Promise<{ id: string }>;
}

export default function LearnPage({ params }: LearnPageProps) {
  const [content, setContent] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [loading, setLoading] = useState(true);
  const [contentId, setContentId] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  const [userProgress] = useState<any>(null);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [sessionStart] = useState<Date>(new Date());
  const [updatingSection, setUpdatingSection] = useState<number | null>(null);
  
  const { user } = useAuth();
  const router = useRouter();

  // ユーザー進捗取得（フォールバック付き）
  const fetchUserProgress = useCallback(async () => {
    if (!user || !contentId) return;

    try {
      const response = await fetch(`/api/learning/progress?userId=${user.id}&contentId=${contentId}`);
      if (response.ok) {
        const progressData = await response.json();
        if (progressData.length > 0) {
          // setUserProgress(progressData[0]);
        }
      }

      // セクション別進捗も取得
      const sectionsResponse = await fetch(`/api/learning/sections?userId=${user.id}&contentId=${contentId}`);
      if (sectionsResponse.ok) {
        const sectionsData = await sectionsResponse.json();
        const completedIds = sectionsData
          .filter((section: any) => section.is_completed) // eslint-disable-line @typescript-eslint/no-explicit-any
          .map((section: any) => section.section_number); // eslint-disable-line @typescript-eslint/no-explicit-any
        setCompletedSections(completedIds);
      } else {
        // データベーステーブルが存在しない場合、ローカルストレージから読み込み
        const localProgressKey = `progress_${user.id}_${contentId}`;
        const localProgress = localStorage.getItem(localProgressKey);
        if (localProgress) {
          const completedIds = JSON.parse(localProgress);
          setCompletedSections(completedIds);
        }
      }
    } catch (error) {
      console.error('Failed to fetch user progress:', error);
      // フォールバック：ローカルストレージから読み込み
      const localProgressKey = `progress_${user.id}_${contentId}`;
      const localProgress = localStorage.getItem(localProgressKey);
      if (localProgress) {
        const completedIds = JSON.parse(localProgress);
        setCompletedSections(completedIds);
      }
    }
  }, [user, contentId]);

  // パラメータ解決
  useEffect(() => {
    params.then(resolved => {
      setContentId(resolved.id);
    });
  }, [params]);

  // 認証チェック
  useEffect(() => {
    if (!user && !loading) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  // コンテンツ取得
  useEffect(() => {
    if (!contentId) return;

    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('learning_contents')
          .select(`
            *,
            categories (
              id,
              name,
              icon,
              color
            )
          `)
          .eq('id', contentId)
          .single();

        if (error || !data) {
          notFound();
          return;
        }

        setContent(data);
        
        // ユーザーの進捗も取得
        if (user) {
          fetchUserProgress();
        }
      } catch (err) {
        console.error('Error fetching content:', err);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [contentId, user, fetchUserProgress]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-white">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span>読み込み中...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">ログインが必要です</h1>
          <Link 
            href="/auth"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            ログインページへ
          </Link>
        </div>
      </div>
    );
  }

  if (!content) {
    return notFound();
  }

  // セクション完了処理（改良版）
  const handleSectionComplete = async (sectionId: number, sectionType: string) => {
    if (!user || updatingSection === sectionId) return;

    setUpdatingSection(sectionId);
    
    const isCompleted = completedSections.includes(sectionId);
    const newCompletedSections = isCompleted 
      ? completedSections.filter(id => id !== sectionId)
      : [...completedSections, sectionId];

    // まずUIを更新（確実に反映）
    setCompletedSections(newCompletedSections);

    // ローカルストレージに即座に保存（フォールバック）
    const localProgressKey = `progress_${user.id}_${contentId}`;
    localStorage.setItem(localProgressKey, JSON.stringify(newCompletedSections));

    try {
      const sessionDuration = Math.round((new Date().getTime() - sessionStart.getTime()) / 60000);
      
      const response = await fetch('/api/learning/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          contentId: contentId,
          sessionDurationMinutes: sessionDuration,
          completedSections: [{
            type: sectionType,
            number: sectionId,
            completed: !isCompleted,
            duration: 0
          }],
          progressPercentage: Math.round((newCompletedSections.length / learningSections.length) * 100),
          status: newCompletedSections.length === learningSections.length ? 'completed' : 'in_progress'
        }),
      });

      if (response.ok) {
        console.log('✅ Progress saved to database');
        // データベース保存成功時は最新データを取得
        await fetchUserProgress();
      } else {
        console.log('⚠️ Database save failed, using local storage fallback');
        // データベース保存失敗でも、ローカルストレージに保存済みなので状態は維持
      }
    } catch (error) {
      console.error('Database save error (using local storage):', error);
      // エラーでもローカルストレージに保存済みなので、状態は戻さない
    } finally {
      setUpdatingSection(null);
    }
  };

  // 学習セクション（実際のコンテンツに応じて動的に生成）
  const learningSections = [
    {
      id: 1,
      type: 'video',
      title: '概要動画',
      duration: 10,
      icon: <PlayCircle className="w-5 h-5" />,
      completed: completedSections.includes(1)
    },
    {
      id: 2,
      type: 'reading',
      title: '基礎知識',
      duration: 15,
      icon: <BookOpen className="w-5 h-5" />,
      completed: completedSections.includes(2)
    },
    {
      id: 3,
      type: 'code',
      title: 'ハンズオン演習',
      duration: 30,
      icon: <Code className="w-5 h-5" />,
      completed: completedSections.includes(3)
    },
    {
      id: 4,
      type: 'quiz',
      title: '理解度チェック',
      duration: 5,
      icon: <Target className="w-5 h-5" />,
      completed: completedSections.includes(4)
    }
  ];

  const totalDuration = learningSections.reduce((sum, section) => sum + section.duration, 0);
  const completedCount = learningSections.filter(s => s.completed).length;
  const progressPercentage = (completedCount / learningSections.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-purple-800/30 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-purple-400 hover:text-purple-300 transition-colors flex items-center"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                ダッシュボードに戻る
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* メインコンテンツエリア */}
          <div className="lg:col-span-2">
            {/* コンテンツヘッダー */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 rounded-lg p-6 border border-slate-600/30 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">{content.categories?.icon || '📚'}</span>
                    <span className="text-purple-400 text-sm">{content.categories?.name}</span>
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-2">{content.title}</h1>
                  <p className="text-gray-300">{content.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  content.difficulty === 'beginner' 
                    ? 'bg-green-800/50 text-green-300 border border-green-700/50'
                    : content.difficulty === 'intermediate'
                    ? 'bg-yellow-800/50 text-yellow-300 border border-yellow-700/50'
                    : 'bg-red-800/50 text-red-300 border border-red-700/50'
                }`}>
                  {content.difficulty === 'beginner' ? '初級' : 
                   content.difficulty === 'intermediate' ? '中級' : '上級'}
                </span>
              </div>

              {/* 進捗バー */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>学習進捗</span>
                  <span>{progressPercentage.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>推定時間: {totalDuration}分</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span>完了: {completedCount}/{learningSections.length}</span>
                </div>
              </div>
            </div>

            {/* 学習セクションリスト */}
            <div className="space-y-4">
              {learningSections.map((section, index) => (
                <div
                  key={section.id}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 rounded-lg p-6 border border-slate-600/30 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        section.completed 
                          ? 'bg-green-800/30 text-green-400 border border-green-700/50'
                          : 'bg-purple-800/30 text-purple-400 border border-purple-700/50'
                      }`}>
                        {section.completed ? <CheckCircle className="w-5 h-5" /> : section.icon}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold group-hover:text-purple-300 transition-colors">
                          セクション {index + 1}: {section.title}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          推定時間: {section.duration}分
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleSectionComplete(section.id, section.type)}
                      disabled={updatingSection === section.id}
                      className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center ${
                        updatingSection === section.id
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      {updatingSection === section.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          更新中...
                        </>
                      ) : (
                        section.completed ? '完了を取り消す' : '完了にする'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* アクションボタン */}
            <div className="mt-8 flex justify-between">
              <button className="px-6 py-3 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-colors">
                前のコンテンツ
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 flex items-center">
                次のコンテンツ
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>

          {/* サイドバー */}
          <div className="lg:col-span-1">
            {/* 学習のヒント */}
            <div className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 rounded-lg p-6 border border-purple-700/30 mb-6">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-400" />
                学習のヒント
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• 各セクションを順番に進めましょう</li>
                <li>• コード演習は実際に手を動かすことが重要</li>
                <li>• 分からない部分はメモを取りながら学習</li>
                <li>• 理解度チェックで80%以上を目指そう</li>
              </ul>
            </div>

            {/* 関連スキル */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 rounded-lg p-6 border border-slate-600/30">
              <h3 className="text-white font-semibold mb-4">関連スキル</h3>
              <div className="flex flex-wrap gap-2">
                {(content.tags || []).map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-purple-800/30 text-purple-300 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}