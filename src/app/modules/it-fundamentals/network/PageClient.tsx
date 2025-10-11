'use client';
import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { useLearningProgress } from '@/hooks/useLearningProgress';
import { moduleQuizCounts } from '@/lib/moduleQuizCounts';
import { learningModules } from '@/data/modules/it-fundamentals/network';
import {
  LearningHeader,
  ModuleSidebar,
  MobileNavigation,
  QuizComponent,
  QuizIndicator,
  QuizNavigation,
  SectionNavigation
} from '@/components/learning';

export default function NetworkPage() {
  const [activeModule, setActiveModule] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [completedQuizzes, setCompletedQuizzes] = useState<Set<string>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<{[key: string]: number}>({});
  const [showQuizResults, setShowQuizResults] = useState<{[key: string]: boolean}>({});
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);

  const { progress, saveProgress } = useLearningProgress('network');

  useEffect(() => {
    if (progress.length > 0) {
      console.log('🔄 Restoring network progress state...');
      const completedSet = new Set<string>();
      const answersMap: {[key: string]: number} = {};
      const resultsMap: {[key: string]: boolean} = {};

      progress.forEach((p) => {
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
      console.log('✅ Network progress restored:', { completed: completedSet.size, answers: Object.keys(answersMap).length });
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
      console.log('✅ Network progress saved:', { section: quizKey, correct: isCorrect });
    } catch (error) {
      console.error('❌ Failed to save network progress:', error);
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
      const prevModule = learningModules[activeModule - 1];
      setActiveModule(activeModule - 1);
      setActiveSection(prevModule.sections.length - 1);
      setCurrentQuizIndex(0);
    }
  };

  const canGoNext = activeSection < currentModule.sections.length - 1 || activeModule < learningModules.length - 1;
  const canGoPrevious = activeSection > 0 || activeModule > 0;

  const handleNavigate = (moduleIndex: number, sectionIndex: number) => {
    setActiveModule(moduleIndex);
    setActiveSection(sectionIndex);
    setCurrentQuizIndex(0);
  };

  // メインページと同じ値を使用
  const totalQuizzes = moduleQuizCounts['network'] || 0;
  // データベースの進捗データを使用して正確な進捗率を計算
  // 重複を排除してユニークなsection_keyのみをカウント
  const uniqueCompletedSections = new Set(
    progress.filter(p => p.is_completed).map(p => p.section_key)
  );
  const dbCompletedCount = uniqueCompletedSections.size;
  const quizProgress = totalQuizzes > 0 ? Math.floor((dbCompletedCount / totalQuizzes) * 100) : 0;
  const sectionQuizProgress = currentSection.quizzes.filter((_, index) =>
    completedQuizzes.has(`${activeModule}-${activeSection}-${index}`)).length;

  return (
    <div className="min-h-screen bg-background">
      {/* モバイルヘッダー */}
      <LearningHeader
        title="ネットワーク"
        backLink="/modules/it-fundamentals"
        backLinkText="戻る"
        completedCount={dbCompletedCount}
        totalCount={totalQuizzes}
        progress={quizProgress}
        isMobile={true}
      />

      <div className="container max-w-7xl mx-auto px-4 py-4 lg:py-8">
        {/* デスクトップヘッダー */}
        <LearningHeader
          title="ネットワーク"
          description="ネットワーク技術とプロトコルの基礎を体系的に学習"
          backLink="/modules/it-fundamentals"
          backLinkText="IT基礎に戻る"
          completedCount={dbCompletedCount}
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
              onModuleSelect={handleNavigate}
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
                    <BookOpen className="w-5 h-5 text-purple-500 dark:text-purple-400 mr-2" />
                    <h2 className="text-xl lg:text-2xl font-bold text-foreground">{currentSection.title}</h2>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-200 rounded-full border border-purple-200 dark:border-purple-700">
                      {currentModule.title}
                    </span>
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full border border-slate-200 dark:border-slate-700">
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
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/60 dark:to-indigo-900/60 rounded-lg p-4 lg:p-6 mb-6 border border-purple-200 dark:border-purple-700">
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

                  {/* セクションナビゲーション */}
                  <SectionNavigation
                    onPrevious={previousSection}
                    onNext={nextSection}
                    canGoPrevious={canGoPrevious}
                    canGoNext={canGoNext}
                    isCompleted={currentSection.quizzes.every((_, index) =>
                      completedQuizzes.has(`${activeModule}-${activeSection}-${index}`))}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}