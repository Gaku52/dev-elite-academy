/**
 * 環境変数の検証ユーティリティ
 * アプリケーション起動時に必要な環境変数が設定されているかチェックする
 */

export function validateEnvironmentVariables() {
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ] as const;

  const productionOnlyVars = [
    'SUPABASE_SERVICE_KEY'
  ] as const;

  // 基本的な環境変数のチェック
  const missing = requiredVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));

    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing critical environment variables: ${missing.join(', ')}`);
    }
  }

  // 本番環境でのみ必要な環境変数のチェック
  if (process.env.NODE_ENV === 'production') {
    const missingProdVars = productionOnlyVars.filter(varName => !process.env[varName]);

    if (missingProdVars.length > 0) {
      console.error('❌ Missing production environment variables:', missingProdVars.join(', '));
      throw new Error(`Missing production environment variables: ${missingProdVars.join(', ')}`);
    }
  }

  // セキュリティチェック: Service Keyが誤ってpublicに露出していないか
  if (process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY) {
    console.error('🚨 SECURITY WARNING: Service Key should not be public! Remove NEXT_PUBLIC_ prefix.');

    if (process.env.NODE_ENV === 'production') {
      throw new Error('Security violation: Service Key exposed as public environment variable');
    }
  }

  // URL形式の検証
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl && !supabaseUrl.startsWith('https://')) {
    console.warn('⚠️ Warning: Supabase URL should use HTTPS in production');

    if (process.env.NODE_ENV === 'production' && !supabaseUrl.startsWith('https://')) {
      throw new Error('Supabase URL must use HTTPS in production');
    }
  }

  // 開発環境での情報表示
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ Environment variables validated successfully');
    console.log('📍 Supabase URL:', supabaseUrl?.substring(0, 30) + '...');
  }
}

/**
 * 環境変数の基本的な型安全性を提供
 */
export const env = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
  NODE_ENV: process.env.NODE_ENV as 'development' | 'production' | 'test',
  IS_PRODUCTION: process.env.NODE_ENV === 'production'
} as const;