/**
 * Database table and column names
 */

export const DB_TABLES = {
  // User related tables
  USERS: 'users',
  USER_PROGRESS: 'user_progress',
  USER_LEARNING_PROGRESS: 'user_learning_progress',
  SECTION_PROGRESS: 'section_progress',

  // Content tables
  LEARNING_CATEGORIES: 'learning_categories',
  LEARNING_CONTENTS: 'learning_contents',

  // Admin tables
  ADMINS: 'admins'
} as const;

export const DB_COLUMNS = {
  // Common columns
  ID: 'id',
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at',

  // User columns
  USER_ID: 'user_id',
  USER_EMAIL: 'user_email',
  USER_NAME: 'user_name',

  // Progress columns
  CONTENT_ID: 'content_id',
  MODULE_NAME: 'module_name',
  SECTION_NUMBER: 'section_number',
  SECTION_TYPE: 'section_type',
  PROGRESS_PERCENTAGE: 'progress_percentage',
  STATUS: 'status',
  IS_COMPLETED: 'is_completed',
  COMPLETED_AT: 'completed_at',
  STARTED_AT: 'started_at',
  LAST_ACCESSED_AT: 'last_accessed_at'
} as const;