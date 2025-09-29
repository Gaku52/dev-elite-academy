// セキュリティ関連の型定義

export interface AuthResult {
  authenticated: boolean;
  user?: unknown;
  response?: Response;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface DiagnosticResult<T> {
  success: boolean;
  result: T | null;
  error: Error | null;
}