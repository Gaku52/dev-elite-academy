/**
 * Learning related constants
 */

export const LEARNING_CONFIG = {
  // Default number of sections per module
  DEFAULT_SECTIONS_COUNT: 4,

  // Progress thresholds
  PROGRESS_COMPLETE_THRESHOLD: 100,
  PROGRESS_IN_PROGRESS_MIN: 1,

  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // Status values
  STATUS: {
    NOT_STARTED: 'not_started',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed'
  } as const,

  // Section types
  SECTION_TYPES: {
    LECTURE: 'lecture',
    QUIZ: 'quiz',
    EXERCISE: 'exercise',
    PROJECT: 'project'
  } as const
} as const;

export type LearningStatus = typeof LEARNING_CONFIG.STATUS[keyof typeof LEARNING_CONFIG.STATUS];
export type SectionType = typeof LEARNING_CONFIG.SECTION_TYPES[keyof typeof LEARNING_CONFIG.SECTION_TYPES];