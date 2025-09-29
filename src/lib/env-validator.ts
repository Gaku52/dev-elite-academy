/**
 * セキュアな環境変数検証
 * Vercel「All Environments」設定に対応した安全版
 */

export function validateEnvironmentVariables() {
  console.log('🔒 Environment validation starting...');

  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_KEY'
  ] as const;

  // 1. 基本的な存在チェック
  const missing = requiredVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));

    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing critical environment variables: ${missing.join(', ')}`);
    } else {
      console.warn('⚠️ Development mode: continuing despite missing vars');
      return;
    }
  }

  // 2. 形式検証（セキュリティ強化）
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (url && !url.startsWith('https://')) {
    console.error('❌ Supabase URL must use HTTPS');
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Supabase URL must use HTTPS in production');
    }
  }

  // 3. キーの長さ検証
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;

  if (anonKey && anonKey.length < 20) {
    console.warn('⚠️ ANON_KEY seems too short');
  }

  if (serviceKey && serviceKey.length < 20) {
    console.warn('⚠️ SERVICE_KEY seems too short');
  }

  // 4. セキュリティチェック
  if (process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY) {
    console.error('🚨 SECURITY WARNING: Service Key should not be public!');
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Security violation: Service Key exposed as public');
    }
  }

  console.log('✅ All environment variables validated successfully');
}