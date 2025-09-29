import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // セキュリティ強化: 本番環境でconsole.logを自動除去 (一時的に無効化)
  // compiler: {
  //   removeConsole: process.env.NODE_ENV === 'production' ? {
  //     exclude: ['error', 'warn'] // エラーと警告ログは残す
  //   } : false,
  // },

  // セキュリティヘッダーの追加
  async headers() {
    return [
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
          }
        ]
      }
    ];
  }
};

export default nextConfig;
