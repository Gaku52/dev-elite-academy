/**
 * API related constants
 */

export const API_ROUTES = {
  // Progress APIs
  PROGRESS: '/api/progress',
  USER_PROGRESS: '/api/user/progress',
  LEARNING_PROGRESS: '/api/learning-progress',
  SECTION_PROGRESS: '/api/progress/update',

  // Admin APIs
  ADMIN_CATEGORIES: '/api/admin/categories',
  ADMIN_CONTENTS: '/api/admin/contents',

  // Learning APIs
  LEARNING_SECTIONS: '/api/learning/sections',

  // Setup APIs
  SETUP_TABLES: '/api/setup-tables',
  CHECK_TABLES_STATUS: '/api/check-tables-status'
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const;

export const ERROR_CODES = {
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',

  // Auth errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',

  // Database errors
  DB_ERROR: 'DB_ERROR',
  DB_CONNECTION_ERROR: 'DB_CONNECTION_ERROR',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',

  // General errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  NOT_FOUND: 'NOT_FOUND'
} as const;