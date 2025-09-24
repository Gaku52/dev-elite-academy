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
      // 新しいAPIエンドポイントで進捗を取得
      const response = await fetch(`/api/progress/update?contentId=${contentId}`, {
        headers: {
          'Authorization': `Bearer ${user.id}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data && result.data.length > 0) {
          const progressData = result.data[0];
          // 進捗データから完了済みセクションを復元
          // scoreが25%刻みで各セクションの完了状態を表す
          const score = progressData.score || 0;
          const completedCount = Math.floor(score / 25);
          const completedIds = [];
          for (let i = 1; i <= completedCount; i++) {
            completedIds.push(i);
          }
          setCompletedSections(completedIds);
        }
      } else if (response.status === 401) {
        // 認証エラーの場合、ローカルストレージから読み込み
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center space-x-3 text-black">
          <Loader2 className="w-8 h-8 animate-spin text-[#8E9C78]" />
          <span>読み込み中...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-black mb-4">ログインが必要です</h1>
          <Link 
            href="/auth"
            className="btn-modern inline-block px-6 py-3"
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
  const handleSectionComplete = async (sectionId: number) => {
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
      
      const response = await fetch('/api/progress/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`
        },
        body: JSON.stringify({
          contentId: contentId,
          status: newCompletedSections.length === learningSections.length ? 'COMPLETED' : 'IN_PROGRESS',
          score: Math.round((newCompletedSections.length / learningSections.length) * 100),
          timeSpent: sessionDuration,
          attempts: 1
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container-modern">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-[#8E9C78] hover:text-[#7a8a6a] transition-colors flex items-center"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                ダッシュボードに戻る
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container-modern py-8 pb-32 md:pb-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* メインコンテンツエリア */}
          <div className="lg:col-span-2">
            {/* コンテンツヘッダー */}
            <div className="card-modern p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">{content.categories?.icon || '📚'}</span>
                    <span className="text-[#8E9C78] text-sm">{content.categories?.name}</span>
                  </div>
                  <h1 className="text-2xl font-bold text-black mb-2">{content.title}</h1>
                  <p className="text-[#6F6F6F]">{content.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  content.difficulty === 'beginner' 
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : content.difficulty === 'intermediate'
                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {content.difficulty === 'beginner' ? '初級' : 
                   content.difficulty === 'intermediate' ? '中級' : '上級'}
                </span>
              </div>

              {/* 進捗バー */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-[#6F6F6F] mb-2">
                  <span>学習進捗</span>
                  <span>{progressPercentage.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-[#8E9C78] to-[#7a8a6a] transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm text-[#6F6F6F]">
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
                  className="card-modern p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                        section.completed 
                          ? 'bg-green-100 text-green-600 border border-green-200'
                          : 'bg-[#8E9C78]/10 text-[#8E9C78] border border-[#8E9C78]/20'
                      }`}>
                        {section.completed ? <CheckCircle className="w-5 h-5" /> : section.icon}
                      </div>
                      <div>
                        <h3 className="text-black font-semibold group-hover:text-[#8E9C78] transition-colors">
                          セクション {index + 1}: {section.title}
                        </h3>
                        <p className="text-[#6F6F6F] text-sm">
                          推定時間: {section.duration}分
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleSectionComplete(section.id)}
                      disabled={updatingSection === section.id}
                      className={`px-4 py-2 rounded-2xl transition-colors text-sm font-medium flex items-center ${
                        updatingSection === section.id
                          ? 'bg-gray-200 cursor-not-allowed text-[#6F6F6F]'
                          : 'btn-modern'
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
            <div className="mt-8 mb-48 md:mb-8 flex justify-between">
              <button className="btn-secondary px-6 py-3">
                前のコンテンツ
              </button>
              <button className="btn-modern px-6 py-3 flex items-center">
                次のコンテンツ
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>

          {/* サイドバー */}
          <div className="lg:col-span-1">
            {/* 学習のヒント */}
            <div className="card-modern p-6 mb-6 bg-[#8E9C78]/10 border-[#8E9C78]/20">
              <h3 className="text-black font-semibold mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-500" />
                学習のヒント
              </h3>
              <ul className="space-y-2 text-sm text-[#6F6F6F]">
                <li>• 各セクションを順番に進めましょう</li>
                <li>• コード演習は実際に手を動かすことが重要</li>
                <li>• 分からない部分はメモを取りながら学習</li>
                <li>• 理解度チェックで80%以上を目指そう</li>
              </ul>
            </div>

            {/* 関連スキル */}
            <div className="card-modern p-6">
              <h3 className="text-black font-semibold mb-4">関連スキル</h3>
              <div className="flex flex-wrap gap-2">
                {(content.tags || []).map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-[#8E9C78]/10 text-[#8E9C78] rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* モバイル用固定進捗表示 */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-900/95 to-purple-900/95 backdrop-blur-sm border-t border-purple-800/30 p-4 md:hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="text-white text-sm font-medium">
              問題 {completedCount}/{learningSections.length}
            </div>
            <div className="text-purple-300 text-sm">
              セクション完了 {completedCount}/{learningSections.length}
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}