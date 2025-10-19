'use client';
import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { useLearningProgress } from '@/hooks/useLearningProgress';
import { moduleQuizCounts } from '@/lib/moduleQuizCounts';
import { learningModules } from '@/data/modules/it-fundamentals/system-development';
import {
  LearningHeader,
  ModuleSidebar,
  MobileNavigation,
  QuizComponent,
  QuizIndicator,
  QuizNavigation,
  SectionNavigation
} from '@/components/learning';


export default function SystemDevelopmentPage() {
  const [activeModule, setActiveModule] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [completedQuizzes, setCompletedQuizzes] = useState<Set<string>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<{[key: string]: number}>({});
  const [showQuizResults, setShowQuizResults] = useState<{[key: string]: boolean}>({});
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);

  const { progress, saveProgress } = useLearningProgress('system-development');

  useEffect(() => {
    if (progress.length > 0) {
      console.log('🔄 Restoring system-development progress state...');
      const completedSet = new Set<string>();
      const answersMap: {[key: string]: number} = {};
      const resultsMap: {[key: string]: boolean} = {};

      progress.forEach((p: { section_key: string; is_completed: boolean }) => {
        const sectionKey = p.section_key;
        if (p.is_completed) {
          completedSet.add(sectionKey);
          resultsMap[sectionKey] = true;

          const parts = sectionKey.split('-');
          if (parts.length >= 3) {
            const moduleIndex = parseInt(parts[0]);
            const sectionIndex = parseInt(parts[1]);
            const quizIndex = parseInt(parts[2]);

            if (!isNaN(moduleIndex) && !isNaN(sectionIndex) && !isNaN(quizIndex)) {
              const learningModule = learningModules[moduleIndex];
              if (learningModule && learningModule.sections[sectionIndex] && learningModule.sections[sectionIndex].quizzes[quizIndex]) {
                const correctAnswer = learningModule.sections[sectionIndex].quizzes[quizIndex].correct;
                answersMap[sectionKey] = correctAnswer;
              }
            }
          }
        }
      });

      setCompletedQuizzes(completedSet);
      setQuizAnswers(answersMap);
      setShowQuizResults(resultsMap);
      console.log('✅ System-development progress restored:', { completed: completedSet.size, answers: Object.keys(answersMap).length });
    }
  }, [progress]);

  const currentModule = learningModules[activeModule];
  const currentSection = currentModule.sections[activeSection];
  const currentQuiz = currentSection.quizzes[currentQuizIndex];
  const quizKey = `${activeModule}-${activeSection}-${currentQuizIndex}`;

  const handleQuizAnswer = async (answer: number) => {
    setQuizAnswers({...quizAnswers, [quizKey]: answer});
    setShowQuizResults({...showQuizResults, [quizKey]: true});

    const isCorrect = answer === currentQuiz.correct;
    if (isCorrect) {
      setCompletedQuizzes(new Set([...completedQuizzes, quizKey]));
    }

    try {
      await saveProgress(quizKey, true, isCorrect);
      console.log('✅ System-development progress saved:', { section: quizKey, correct: isCorrect });
    } catch (error) {
      console.error('❌ Failed to save system-development progress:', error);
    }
  };

  const nextQuiz = () => {
    if (currentQuizIndex < currentSection.quizzes.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    }
  };

  const previousQuiz = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(currentQuizIndex - 1);
    }
  };

  const nextSection = () => {
    if (activeSection < currentModule.sections.length - 1) {
      setActiveSection(activeSection + 1);
      setCurrentQuizIndex(0);
    } else if (activeModule < learningModules.length - 1) {
      setActiveModule(activeModule + 1);
      setActiveSection(0);
      setCurrentQuizIndex(0);
    }
  };

  const previousSection = () => {
    if (activeSection > 0) {
      setActiveSection(activeSection - 1);
      setCurrentQuizIndex(0);
    } else if (activeModule > 0) {
      setActiveModule(activeModule - 1);
      setActiveSection(learningModules[activeModule - 1].sections.length - 1);
      setCurrentQuizIndex(0);
    }
  };

  // メインページと同じ値を使用
  const totalQuizzes = moduleQuizCounts['system-development'] || 0;

  // データベースの進捗データを使用して正確な進捗率を計算
  // 重複を排除してユニークなsection_keyのみをカウント
  const uniqueCompletedSections = new Set(
    progress.filter((p: { is_completed: boolean }) => p.is_completed).map((p: { section_key: string }) => p.section_key)
  );
  const dbCompletedCount = uniqueCompletedSections.size;
  const quizProgress = totalQuizzes > 0 ? Math.floor((dbCompletedCount / totalQuizzes) * 100) : 0;
  const sectionQuizProgress = currentSection.quizzes.filter((_, index) =>
    completedQuizzes.has(`${activeModule}-${activeSection}-${index}`)).length;

  return (
    <div className="min-h-screen bg-background">
      {/* モバイルヘッダー */}
      <LearningHeader
        title="システム開発"
        backLink="/modules/it-fundamentals"
        backLinkText="戻る"
        completedCount={completedQuizzes.size}
        totalCount={totalQuizzes}
        progress={quizProgress}
        isMobile={true}
      />

      <div className="container max-w-7xl mx-auto px-4 py-4 lg:py-8">
        {/* デスクトップヘッダー */}
        <LearningHeader
          title="システム開発"
          description="基本情報技術者試験レベルの総合学習"
          backLink="/modules/it-fundamentals"
          backLinkText="IT基礎に戻る"
          completedCount={completedQuizzes.size}
          totalCount={totalQuizzes}
          progress={quizProgress}
          isMobile={false}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* サイドバー - デスクトップ */}
          <div className="hidden lg:block lg:col-span-1">
            <ModuleSidebar
              modules={learningModules}
              activeModule={activeModule}
              activeSection={activeSection}
              completedQuizzes={completedQuizzes}
              totalQuizzes={totalQuizzes}
              onModuleSelect={(moduleIndex, sectionIndex) => {
                setActiveModule(moduleIndex);
                setActiveSection(sectionIndex);
                setCurrentQuizIndex(0);
              }}
              onSectionSelect={(sectionIndex) => {
                setActiveSection(sectionIndex);
                setCurrentQuizIndex(0);
              }}
            />
          </div>

          {/* モバイルナビゲーション */}
          <MobileNavigation
            modules={learningModules}
            activeModule={activeModule}
            activeSection={activeSection}
            onChange={(moduleIndex, sectionIndex) => {
              setActiveModule(moduleIndex);
              setActiveSection(sectionIndex);
              setCurrentQuizIndex(0);
            }}
          />

          {/* メインコンテンツ */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-lg shadow-sm border border-border">
              <div className="p-4 lg:p-6">
                {/* セクションヘッダー */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                  <div className="flex items-center mb-4 lg:mb-0">
                    <BookOpen className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-2" />
                    <h2 className="text-xl lg:text-2xl font-bold text-foreground">{currentSection.title}</h2>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-900 dark:text-purple-200 rounded-full border border-purple-200 dark:border-purple-700">
                      {currentModule.title}
                    </span>
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 rounded-full border border-slate-200 dark:border-slate-700">
                      {sectionQuizProgress}/{currentSection.quizzes.length} 問完了
                    </span>
                  </div>
                </div>

                {/* 学習コンテンツ */}
                <div className="mb-8">
                  <div className="prose prose-sm lg:prose dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-foreground leading-relaxed text-sm lg:text-base">
                      {currentSection.content}
                    </div>
                  </div>
                </div>

                {/* 問題エリア */}
                <div className="border-t border-border pt-6">
                  <div className="bg-slate-50 dark:bg-slate-500 rounded-lg p-4 lg:p-6 mb-6 border border-purple-200 dark:border-purple-700">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground flex items-center text-lg mb-2 lg:mb-0">
                        <span className="text-2xl mr-2">🎯</span>
                        理解度チェック
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">問題</span>
                        <span className="px-2 py-1 bg-white dark:bg-slate-800 rounded-lg text-sm font-medium text-foreground border border-border">
                          {currentQuizIndex + 1} / {currentSection.quizzes.length}
                        </span>
                      </div>
                    </div>

                    {/* 問題インジケーター */}
                    <QuizIndicator
                      totalQuizzes={currentSection.quizzes.length}
                      currentQuizIndex={currentQuizIndex}
                      completedQuizzes={completedQuizzes}
                      quizAnswers={quizAnswers}
                      activeModule={activeModule}
                      activeSection={activeSection}
                      onQuizSelect={setCurrentQuizIndex}
                    />

                    <QuizComponent
                      quiz={currentQuiz}
                      selectedAnswer={quizAnswers[quizKey]}
                      showResult={showQuizResults[quizKey]}
                      onAnswerSelect={handleQuizAnswer}
                    />

                    {/* 問題ナビゲーション */}
                    <QuizNavigation
                      currentQuizIndex={currentQuizIndex}
                      totalQuizzes={currentSection.quizzes.length}
                      onPrevious={previousQuiz}
                      onNext={nextQuiz}
                    />
                  </div>
                </div>

                {/* セクションナビゲーション */}
                <SectionNavigation
                  onPrevious={previousSection}
                  onNext={nextSection}
                  canGoPrevious={!(activeModule === 0 && activeSection === 0)}
                  canGoNext={!(activeModule === learningModules.length - 1 && activeSection === currentModule.sections.length - 1)}
                  isCompleted={sectionQuizProgress === currentSection.quizzes.length}
                />
              </div>
            </div>

            {/* モバイル用固定フッター */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
              <div className="flex justify-between text-sm">
                <div>
                  <span className="text-muted-foreground">現在の問題: </span>
                  <span className="font-medium text-foreground">{currentQuizIndex + 1}/{currentSection.quizzes.length}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">セクション完了: </span>
                  <span className="font-medium text-green-700 dark:text-green-400">{sectionQuizProgress}/{currentSection.quizzes.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}