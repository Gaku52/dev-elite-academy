// 診断専用ログ機能 - エラーを投げずに詳細な情報を収集
export function diagnosticEnvironmentCheck() {
  console.log('🔍 診断開始: 環境変数チェック');
  console.log('🕐 実行時刻:', new Date().toISOString());
  console.log('🌍 実行環境:', typeof window !== 'undefined' ? 'クライアント' : 'サーバー');
  console.log('⚙️ NODE_ENV:', process.env.NODE_ENV);

  // 基本環境情報
  console.log('📊 基本環境情報:');
  console.log('  - process.env 存在:', typeof process !== 'undefined' && typeof process.env !== 'undefined');
  console.log('  - process.env.NODE_ENV:', process.env.NODE_ENV);
  console.log('  - process.env キー数:', Object.keys(process.env || {}).length);

  // Supabase環境変数の詳細チェック
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('🔐 Supabase環境変数詳細:');
  console.log('  - NEXT_PUBLIC_SUPABASE_URL 存在:', !!supabaseUrl);
  console.log('  - NEXT_PUBLIC_SUPABASE_URL 型:', typeof supabaseUrl);
  console.log('  - NEXT_PUBLIC_SUPABASE_URL 長さ:', supabaseUrl?.length || 0);
  console.log('  - NEXT_PUBLIC_SUPABASE_URL プレフィックス:', supabaseUrl?.substring(0, 20) || 'undefined');

  console.log('  - NEXT_PUBLIC_SUPABASE_ANON_KEY 存在:', !!supabaseKey);
  console.log('  - NEXT_PUBLIC_SUPABASE_ANON_KEY 型:', typeof supabaseKey);
  console.log('  - NEXT_PUBLIC_SUPABASE_ANON_KEY 長さ:', supabaseKey?.length || 0);
  console.log('  - NEXT_PUBLIC_SUPABASE_ANON_KEY プレフィックス:', supabaseKey?.substring(0, 20) || 'undefined');

  // デフォルト値チェック
  console.log('🚨 デフォルト値チェック:');
  console.log('  - URL がデフォルト値:', supabaseUrl === 'your-supabase-url');
  console.log('  - KEY がデフォルト値:', supabaseKey === 'your-supabase-anon-key');

  // HTTPS チェック（URLが存在する場合のみ）
  if (supabaseUrl && typeof supabaseUrl === 'string') {
    console.log('🔒 HTTPS チェック:');
    console.log('  - HTTPS プロトコル:', supabaseUrl.startsWith('https://'));
    console.log('  - URL形式正常:', supabaseUrl.includes('supabase.co'));
  }

  // その他の環境変数
  console.log('🔧 その他の重要な環境変数:');
  console.log('  - VERCEL 環境:', process.env.VERCEL);
  console.log('  - VERCEL_ENV:', process.env.VERCEL_ENV);
  console.log('  - NEXT_RUNTIME:', process.env.NEXT_RUNTIME);

  // 全環境変数のプレフィックス一覧（機密情報を除く）
  const envKeys = Object.keys(process.env || {});
  const publicKeys = envKeys.filter(key => key.startsWith('NEXT_PUBLIC_'));
  console.log('📋 NEXT_PUBLIC_ 環境変数一覧:', publicKeys);

  console.log('✅ 診断完了 - エラーなし');

  return {
    supabaseUrl,
    supabaseKey,
    hasValidUrl: !!supabaseUrl && supabaseUrl !== 'your-supabase-url',
    hasValidKey: !!supabaseKey && supabaseKey !== 'your-supabase-anon-key',
    isSecure: supabaseUrl?.startsWith('https://') || false
  };
}