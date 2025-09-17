/**
 * Shared type definitions for learning modules
 */

export interface Quiz {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface Section {
  title: string;
  content: string;
  quizzes: Quiz[];
}

export interface Module {
  id: number;
  title: string;
  sections: Section[];
}

export interface ModuleProgress {
  moduleId: number;
  completedSections: number[];
  currentSection: number;
  quizScores: Record<string, number>;
}

export interface LearningStats {
  totalModules: number;
  completedModules: number;
  totalSections: number;
  completedSections: number;
  averageQuizScore: number;
}