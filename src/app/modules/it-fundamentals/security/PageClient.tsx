'use client';
import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { useLearningProgress } from '@/hooks/useLearningProgress';
import { learningModules } from '@/data/modules/it-fundamentals/security';
import {
  LearningHeader,
  ModuleSidebar,
  MobileNavigation,
  QuizComponent,
  QuizIndicator,
  QuizNavigation,
  SectionNavigation
} from '@/components/learning';

export default function SecurityPage() {
  const [activeModule, setActiveModule] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [completedQuizzes, setCompletedQuizzes] = useState<Set<string>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<{[key: string]: number}>({});
  const [showQuizResults, setShowQuizResults] = useState<{[key: string]: boolean}>({});
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);

  const { progress, saveProgress } = useLearningProgress('security');

  useEffect(() => {
    if (progress.length > 0) {
      console.log('🔄 Restoring security progress state...');
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
      console.log('✅ Security progress restored:', { completed: completedSet.size, answers: Object.keys(answersMap).length });
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
      await saveProgress(quizKey, isCorrect, isCorrect);
      console.log('✅ Security progress saved:', { section: quizKey, correct: isCorrect });
    } catch (error) {
      console.error('❌ Failed to save security progress:', error);
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

  const totalQuizzes = learningModules.reduce((total, module) =>
    total + module.sections.reduce((sectionTotal, section) =>
      sectionTotal + section.quizzes.length, 0), 0);
  const completedTotal = completedQuizzes.size;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <LearningHeader
        title="セキュリティ"
        description="情報セキュリティの基本概念と対策"
        backLink="/modules/it-fundamentals"
        backLinkText="IT基礎一覧に戻る"
        completedCount={completedTotal}
        totalCount={totalQuizzes}
        progress={totalQuizzes > 0 ? Math.round((completedTotal / totalQuizzes) * 100) : 0}
        icon={<BookOpen className="w-6 h-6 text-white" />}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* サイドバー */}
          <ModuleSidebar
            modules={learningModules}
            activeModule={activeModule}
            activeSection={activeSection}
            completedQuizzes={completedQuizzes}
            totalQuizzes={totalQuizzes}
            onModuleSelect={handleNavigate}
            onSectionSelect={(sectionIndex) => setActiveSection(sectionIndex)}
          />

          {/* メインコンテンツ */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* モバイルナビゲーション */}
              <MobileNavigation
                modules={learningModules}
                activeModule={activeModule}
                activeSection={activeSection}
                onChange={handleNavigate}
              />

              {/* 学習コンテンツ */}
              <div className="prose max-w-none mb-8">
                <h2 className="text-2xl font-bold text-purple-900 mb-4">
                  {currentSection.title}
                </h2>
                <div className="whitespace-pre-wrap text-gray-700">
                  {currentSection.content}
                </div>
              </div>

              {/* クイズインジケーター */}
              <QuizIndicator
                currentQuizIndex={currentQuizIndex}
                totalQuizzes={currentSection.quizzes.length}
                completedQuizzes={completedQuizzes}
                quizAnswers={quizAnswers}
                activeModule={activeModule}
                activeSection={activeSection}
                onQuizSelect={(index) => setCurrentQuizIndex(index)}
              />

              {/* クイズコンポーネント */}
              <QuizComponent
                quiz={currentQuiz}
                selectedAnswer={quizAnswers[quizKey]}
                showResult={showQuizResults[quizKey]}
                onAnswerSelect={handleQuizAnswer}
              />

              {/* クイズナビゲーション */}
              <QuizNavigation
                currentQuizIndex={currentQuizIndex}
                totalQuizzes={currentSection.quizzes.length}
                onPrevious={previousQuiz}
                onNext={nextQuiz}
              />

              {/* セクションナビゲーション */}
              <SectionNavigation
                onPrevious={previousSection}
                onNext={nextSection}
                canGoPrevious={canGoPrevious}
                canGoNext={canGoNext}
                isCompleted={currentSection.quizzes.every((_, index) => completedQuizzes.has(`${activeModule}-${activeSection}-${index}`))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}