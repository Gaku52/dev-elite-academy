'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  UserPlus, 
  LogIn,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const { signIn, signUp, user } = useAuth();
  const router = useRouter();

  // ログイン済みならダッシュボードにリダイレクト
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // 入力値をトリムして余分な空白を削除
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    try {
      if (isLogin) {
        // ログイン処理
        const { data, error } = await signIn(trimmedEmail, trimmedPassword);
        
        if (error) {
          setMessage({ type: 'error', text: error.message });
        } else if (data?.user) {
          setMessage({ type: 'success', text: 'ログインしました！' });
          router.push('/dashboard');
        }
      } else {
        // 登録処理
        console.log('Registration attempt:', { 
          original_password: password, 
          original_confirmPassword: confirmPassword,
          trimmed_password: trimmedPassword,
          trimmed_confirmPassword: trimmedConfirmPassword,
          passwordLength: trimmedPassword.length,
          confirmPasswordLength: trimmedConfirmPassword.length,
          areEqual: trimmedPassword === trimmedConfirmPassword 
        });
        
        if (trimmedPassword !== trimmedConfirmPassword) {
          setMessage({ type: 'error', text: `パスワードが一致しません (入力: ${trimmedPassword.length}文字, 確認: ${trimmedConfirmPassword.length}文字)` });
          setLoading(false);
          return;
        }
        
        if (trimmedPassword.length < 6) {
          setMessage({ type: 'error', text: 'パスワードは6文字以上で入力してください' });
          setLoading(false);
          return;
        }

        console.log('Page: Starting signup process...');
        const { data, error } = await signUp(trimmedEmail, trimmedPassword);
        console.log('Page: Signup completed with:', { 
          hasUser: !!data?.user, 
          hasError: !!error,
          errorMessage: error?.message 
        });
        
        if (error) {
          console.error('SignUp Error:', error);
          let errorMessage = 'アカウント作成に失敗しました。';
          
          if (error.message.includes('Email signups are disabled')) {
            errorMessage = 'メール認証が無効になっています。Supabaseダッシュボードで有効にしてください。';
          } else if (error.message.includes('User already registered')) {
            errorMessage = 'このメールアドレスは既に登録されています。';
          } else if (error.message.includes('Invalid email')) {
            errorMessage = '有効なメールアドレスを入力してください。';
          } else if (error.message.includes('Password should be at least')) {
            errorMessage = 'パスワードは6文字以上で設定してください。';
          } else if (error.message.includes('Database error')) {
            errorMessage = 'データベースエラー: Supabaseダッシュボードの「Confirm email」設定を確認してください。';
          } else {
            errorMessage = error.message;
          }
          
          setMessage({ type: 'error', text: errorMessage });
        } else if (data?.user) {
          setMessage({ 
            type: 'success', 
            text: 'アカウントが作成されました！確認メールをチェックしてください。' 
          });
          // 登録後はログインモードに切り替え
          setIsLogin(true);
          setPassword('');
          setConfirmPassword('');
        } else {
          setMessage({ 
            type: 'error', 
            text: 'アカウント作成に失敗しました。環境設定を確認してください。' 
          });
        }
      }
    } catch {
      setMessage({ type: 'error', text: '予期しないエラーが発生しました' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Dev Elite Academy
            </h1>
          </Link>
          <p className="text-gray-300 mt-2">
            {isLogin ? 'アカウントにログイン' : '新規アカウント作成'}
          </p>
        </div>

        {/* 認証フォーム */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 rounded-lg p-8 border border-slate-600/30">
          {/* タブ切り替え */}
          <div className="flex mb-6">
            <button
              onClick={() => {
                setIsLogin(true);
                setMessage(null);
                setPassword('');
                setConfirmPassword('');
              }}
              className={`flex-1 py-2 px-4 text-center rounded-l-lg transition-colors ${
                isLogin 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              <LogIn className="w-4 h-4 inline mr-2" />
              ログイン
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setMessage(null);
                setPassword('');
                setConfirmPassword('');
              }}
              className={`flex-1 py-2 px-4 text-center rounded-r-lg transition-colors ${
                !isLogin 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              <UserPlus className="w-4 h-4 inline mr-2" />
              新規登録
            </button>
          </div>

          {/* メッセージ表示 */}
          {message && (
            <div className={`p-3 rounded-lg mb-4 flex items-center ${
              message.type === 'success' 
                ? 'bg-green-800/30 border border-green-700/50 text-green-300'
                : 'bg-red-800/30 border border-red-700/50 text-red-300'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2" />
              )}
              {message.text}
            </div>
          )}

          {/* フォーム */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* メールアドレス */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                メールアドレス
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* パスワード */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                パスワード
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* パスワード確認（新規登録時のみ） */}
            {!isLogin && (
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  パスワード確認
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            )}

            {/* 送信ボタン */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  処理中...
                </>
              ) : (
                <>
                  {isLogin ? (
                    <>
                      <LogIn className="w-5 h-5 mr-2" />
                      ログイン
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5 mr-2" />
                      アカウント作成
                    </>
                  )}
                </>
              )}
            </button>
          </form>

          {/* パスワードリセット */}
          {isLogin && (
            <div className="mt-4 text-center">
              <Link 
                href="/auth/reset-password"
                className="text-purple-400 hover:text-purple-300 text-sm"
              >
                パスワードをお忘れですか？
              </Link>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="text-center mt-6">
          <Link 
            href="/"
            className="text-gray-400 hover:text-gray-300 text-sm"
          >
            ← ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}