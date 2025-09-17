import { NextResponse } from 'next/server';

export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

interface ErrorResponse {
  error: string;
  code?: string;
  details?: unknown;
}

/**
 * Standardized API error handler
 * Logs errors and returns consistent error responses
 */
export function handleAPIError(error: unknown): NextResponse<ErrorResponse> {
  // Handle known API errors
  if (error instanceof APIError) {
    console.error(`API Error [${error.code || 'UNKNOWN'}]:`, error.message);
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        details: process.env.NODE_ENV === 'development' ? error.details : undefined
      },
      { status: error.statusCode }
    );
  }

  // Handle Supabase errors
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message: string }).message;
    console.error('Database Error:', message);
    return NextResponse.json(
      { error: 'Database operation failed', code: 'DB_ERROR' },
      { status: 500 }
    );
  }

  // Handle unknown errors
  console.error('Unexpected error:', error);
  return NextResponse.json(
    {
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    },
    { status: 500 }
  );
}

/**
 * Helper to create standardized success response
 */
export function successResponse<T>(data: T, status = 200): NextResponse<T> {
  return NextResponse.json(data, { status });
}

/**
 * Helper to validate required fields
 */
export function validateRequired(
  data: Record<string, unknown>,
  fields: string[]
): void {
  const missing = fields.filter(field => !data[field]);
  if (missing.length > 0) {
    throw new APIError(
      400,
      `Missing required fields: ${missing.join(', ')}`,
      'VALIDATION_ERROR'
    );
  }
}