import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // セキュリティ強化: 本番環境でconsole.logを自動除去 (一時的に無効化)
  // compiler: {
  //   removeConsole: process.env.NODE_ENV === 'production' ? {
  //     exclude: ['error', 'warn'] // エラーと警告ログは残す
  //   } : false,
  // },

  // セキュリティヘッダーの追加（診断付き）
  async headers() {
    try {
      console.log('🔒 セキュリティ機能テスト開始: セキュリティヘッダー設定');
      console.log('🛡️ セキュリティヘッダー設定開始');

      const securityHeaders = [
        {
          source: '/:path*',
          headers: [
            {
              key: 'X-Frame-Options',
              value: 'DENY'
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff'
            },
            {
              key: 'X-XSS-Protection',
              value: '1; mode=block'
            },
            {
              key: 'Referrer-Policy',
              value: 'strict-origin-when-cross-origin'
            },
            {
              key: 'Content-Security-Policy',
              value: (() => {
                const csp = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co https://api.github.com; frame-ancestors 'none';";
                console.log('🔒 CSP (Content Security Policy) 設定:', csp);
                return csp;
              })()
            }
          ]
        }
      ];

      console.log('📋 設定されるセキュリティヘッダー:');
      securityHeaders[0].headers.forEach(header => {
        console.log(`  - ${header.key}: ${header.value}`);
      });

      console.log('✅ セキュリティヘッダー設定完了');
      return securityHeaders;
    } catch (error) {
      console.error('🚨 セキュリティヘッダー設定でエラーが発生しました!');
      console.error('🔥 エラー詳細:', error);
      console.error('⚠️ この情報をClaudeに報告してください');
      return [];
    }
  }
};

export default nextConfig;
