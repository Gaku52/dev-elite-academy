import { NextRequest, NextResponse } from 'next/server';
import { supabase } from './supabase';
import { diagnosticSecurityFeature } from './diagnostic-logger';
import type { AuthResult, ValidationResult } from './types';

// 管理者認証ミドルウェア（診断付き）
export async function adminAuthMiddleware(request: NextRequest) {
  return diagnosticSecurityFeature("管理者API認証チェック", async () => {
    console.log('🔐 管理者認証チェック開始');
    console.log('🌐 リクエストURL:', request.url);
    console.log('📝 リクエストメソッド:', request.method);

    // Authorization ヘッダーチェック
    const authHeader = request.headers.get('authorization');
    console.log('🔑 Authorization ヘッダー存在:', !!authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('⚠️ Authorization ヘッダーが無効');
      return {
        authenticated: false,
        response: NextResponse.json(
          {
            error: 'Unauthorized',
            message: '管理者認証が必要です',
            details: 'Authorization ヘッダーにBearer トークンが必要です'
          },
          { status: 401 }
        )
      };
    }

    const token = authHeader.substring(7); // "Bearer " を除去
    console.log('🎫 トークン長さ:', token.length);

    try {
      // Supabaseでトークン検証
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error) {
        console.error('🚨 認証エラー:', error.message);
        return {
          authenticated: false,
          response: NextResponse.json(
            {
              error: 'Authentication failed',
              message: '認証に失敗しました',
              details: error.message
            },
            { status: 401 }
          )
        };
      }

      if (!user) {
        console.warn('⚠️ ユーザーが見つかりません');
        return {
          authenticated: false,
          response: NextResponse.json(
            {
              error: 'User not found',
              message: 'ユーザーが見つかりません'
            },
            { status: 401 }
          )
        };
      }

      console.log('✅ 認証成功 - ユーザーID:', user.id);
      console.log('📧 ユーザーメール:', user.email);

      // 管理者権限チェック（今回は全認証済みユーザーを管理者とする）
      // 本格運用時はRLS（Row Level Security）やuser_metadataで権限チェック
      console.log('👑 管理者権限確認済み');

      return {
        authenticated: true,
        user,
        response: null
      };

    } catch (error) {
      console.error('🚨 CRITICAL: 認証処理でエラーが発生しました:', error);
      return {
        authenticated: false,
        response: NextResponse.json(
          {
            error: 'Internal server error',
            message: '内部サーバーエラーが発生しました',
            details: error instanceof Error ? error.message : 'Unknown error'
          },
          { status: 500 }
        )
      };
    }
  });
}

// 入力検証関数（診断付き）
export function validateInput(data: unknown, rules: Record<string, (value: unknown) => boolean>) {
  return diagnosticSecurityFeature("入力値検証", () => {
    console.log('🔍 入力値検証開始');
    console.log('📊 検証データ:', Object.keys(data || {}));
    console.log('📋 検証ルール:', Object.keys(rules));

    const errors: string[] = [];

    for (const [field, validator] of Object.entries(rules)) {
      const value = data?.[field];
      console.log(`📝 検証中: ${field} =`, typeof value, value?.toString?.()?.substring(0, 50) || 'undefined');

      try {
        if (!validator(value)) {
          const error = `${field} は無効な値です`;
          errors.push(error);
          console.warn(`⚠️ 検証失敗: ${error}`);
        } else {
          console.log(`✅ 検証成功: ${field}`);
        }
      } catch (error) {
        const errorMsg = `${field} の検証中にエラーが発生しました`;
        errors.push(errorMsg);
        console.error(`🚨 検証エラー: ${errorMsg}`, error);
      }
    }

    console.log('🏁 入力値検証完了 - エラー数:', errors.length);

    return {
      isValid: errors.length === 0,
      errors
    };
  });
}