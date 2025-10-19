import { createClient } from '@supabase/supabase-js';
import { diagnosticEnvironmentCheck } from './diagnostic-logger';

// 診断ログ実行 - エラーを投げない安全なチェック
const diagnosticResult = diagnosticEnvironmentCheck();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 既存の警告表示は保持（エラーを投げない）
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your-supabase-url' || supabaseAnonKey === 'your-supabase-anon-key') {
  console.error('❌ Supabase環境変数が正しく設定されていません！');
  console.error('📝 .env.localファイルに実際のSupabaseの値を設定してください。');
  console.error('');
  console.error('1. Supabaseダッシュボード (https://app.supabase.com) にアクセス');
  console.error('2. Settings → API から以下をコピー:');
  console.error('   - Project URL → NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - anon public → NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.error('');
  console.error('現在の設定:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl || '未設定');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : '未設定');
}

// 追加の安全性チェック（本番環境でのみ実行、エラーは投げない）
if (process.env.NODE_ENV === 'production') {
  console.log('🏭 本番環境での追加セキュリティチェック:');

  if (diagnosticResult.hasValidUrl && diagnosticResult.isSecure) {
    console.log('✅ Supabase URL: HTTPS接続で安全です');
  } else {
    console.warn('⚠️ Supabase URL: セキュリティ上の懸念があります');
  }

  if (diagnosticResult.hasValidKey) {
    console.log('✅ Supabase Key: 設定されています');
  } else {
    console.warn('⚠️ Supabase Key: 設定に問題があります');
  }
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// 型定義
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  user: User;
  access_token: string;
  refresh_token: string;
}

// 認証関連の関数
export const auth = {
  // ユーザー登録
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: typeof window !== 'undefined'
          ? `${window.location.origin}/auth/callback`
          : undefined,
      }
    });
    return { data, error };
  },

  // ログイン
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // ログアウト
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // パスワード変更
  async updatePassword(password: string) {
    const { data, error } = await supabase.auth.updateUser({
      password,
    });
    return { data, error };
  },

  // パスワードリセット
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  },

  // 現在のセッション取得
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    return { data, error };
  },

  // 現在のユーザー取得
  async getUser() {
    const { data, error } = await supabase.auth.getUser();
    return { data, error };
  }
};