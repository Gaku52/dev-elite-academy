/**
 * 実験用：最小限の環境変数検証
 * 原因特定のための安全なバージョン
 */

export function validateEnvironmentVariables() {
  console.log('🔍 Environment validation starting...');

  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ] as const;

  // 基本的な環境変数のチェック
  const missing = requiredVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.log('📍 Current NODE_ENV:', process.env.NODE_ENV);
    console.log('📍 Available env vars:', Object.keys(process.env).filter(k => k.includes('SUPABASE')));

    if (process.env.NODE_ENV === 'production') {
      console.error('🚨 This will throw an error in production');
      throw new Error(`Missing critical environment variables: ${missing.join(', ')}`);
    } else {
      console.warn('⚠️ Development mode: continuing despite missing vars');
    }
  } else {
    console.log('✅ All required environment variables present');
  }

  console.log('🔍 Environment validation completed');
}