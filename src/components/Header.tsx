'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { 
  User, 
  LogOut, 
  LogIn, 
  ChevronDown,
  BookOpen,
  Home,
  BarChart3,
  Settings,
  Database,
  FolderOpen,
  FileText
} from 'lucide-react';

export default function Header() {
  const { user, signOut, loading } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // コンポーネントマウント後にイベント処理を有効化
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // クリック外でメニューを閉じる（マウント後のみ）
  useEffect(() => {
    if (!isMounted || !userMenuOpen) return;

    const handleClickOutside = (event: Event) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    // より長い遅延でイベントリスナーを追加（本番環境対応）
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside, { passive: false });
      document.addEventListener('touchstart', handleClickOutside, { passive: false });
    }, 200);
    
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [userMenuOpen, isMounted]);

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🔥 Logout button clicked!'); // デバッグ用
    
    // 即座にメニューを閉じる
    setUserMenuOpen(false);
    
    try {
      await signOut();
      console.log('✅ Sign out successful');
    } catch (error) {
      console.error('❌ Sign out error:', error);
    }
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🎯 Menu toggle clicked!'); // デバッグ用
    
    setUserMenuOpen(prev => {
      const newState = !prev;
      console.log('📋 Menu state:', prev, '->', newState);
      return newState;
    });
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="container-modern">
        <div className="flex items-center justify-between h-20">
          {/* ロゴ */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#8E9C78] rounded-2xl flex items-center justify-center shadow-sm">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-black tracking-tight">Dev Elite Academy</span>
          </Link>

          {/* ナビゲーション */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="flex items-center text-[#6F6F6F] hover:text-[#8E9C78] transition-colors font-medium"
            >
              <Home className="w-4 h-4 mr-2" />
              ホーム
            </Link>
            <Link 
              href="/dashboard" 
              className="flex items-center text-[#6F6F6F] hover:text-[#8E9C78] transition-colors font-medium"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              学習ダッシュボード
            </Link>
            <Link 
              href="/specifications" 
              className="flex items-center text-[#6F6F6F] hover:text-[#8E9C78] transition-colors font-medium"
            >
              <FileText className="w-4 h-4 mr-2" />
              仕様書・設計書
            </Link>
            <Link 
              href="/usage" 
              className="flex items-center text-[#6F6F6F] hover:text-[#8E9C78] transition-colors font-medium"
            >
              <Settings className="w-4 h-4 mr-2" />
              使用状況
            </Link>
          </nav>

          {/* ユーザーメニュー */}
          <div className="relative">
            {loading ? (
              <div className="w-10 h-10 bg-gray-200 rounded-2xl animate-pulse"></div>
            ) : user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={handleMenuToggle}
                  className="flex items-center space-x-3 text-black hover:text-[#8E9C78] transition-colors bg-gray-50 rounded-2xl px-4 py-2 border border-gray-200 hover:border-[#8E9C78]"
                  aria-label="ユーザーメニュー"
                  type="button"
                >
                  <div className="w-8 h-8 bg-[#8E9C78] rounded-xl flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium max-w-[150px] truncate">
                    {user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden" 
                       style={{ 
                         zIndex: 9999, 
                         pointerEvents: 'auto',
                         position: 'absolute',
                         top: '100%',
                         right: '0'
                       }}>
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                      <p className="text-black text-sm font-medium truncate" title={user.email || ''}>
                        {user.email}
                      </p>
                      <p className="text-[#6F6F6F] text-xs mt-1">学習者</p>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/dashboard"
                        className="block px-3 py-2 text-sm text-[#6F6F6F] hover:text-[#8E9C78] hover:bg-gray-50 rounded-xl transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <BarChart3 className="w-4 h-4 inline mr-2" />
                        学習ダッシュボード
                      </Link>
                      <Link
                        href="/usage"
                        className="block px-3 py-2 text-sm text-[#6F6F6F] hover:text-[#8E9C78] hover:bg-gray-50 rounded-xl transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 inline mr-2" />
                        使用状況
                      </Link>
                      <div className="border-t border-gray-100 my-2"></div>
                      <Link
                        href="/admin/categories"
                        className="block px-3 py-2 text-sm text-[#6F6F6F] hover:text-[#8E9C78] hover:bg-gray-50 rounded-xl transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <FolderOpen className="w-4 h-4 inline mr-2" />
                        カテゴリ管理
                      </Link>
                      <Link
                        href="/admin/contents"
                        className="block px-3 py-2 text-sm text-[#6F6F6F] hover:text-[#8E9C78] hover:bg-gray-50 rounded-xl transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Database className="w-4 h-4 inline mr-2" />
                        コンテンツ管理
                      </Link>
                      <div className="border-t border-gray-100 my-2"></div>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-3 py-2 text-sm text-red-500 hover:text-white hover:bg-red-500 rounded-xl flex items-center transition-colors group cursor-pointer"
                        type="button"
                        style={{ 
                          pointerEvents: 'auto',
                          zIndex: 10000,
                          position: 'relative',
                          userSelect: 'none',
                          WebkitUserSelect: 'none'
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                        ログアウト
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth"
                className="btn-modern flex items-center space-x-2 whitespace-nowrap"
              >
                <LogIn className="w-4 h-4" />
                <span>ログイン</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-100 bg-white">
        <div className="container-modern py-4 space-y-2">
          <Link 
            href="/" 
            className="flex items-center text-[#6F6F6F] hover:text-[#8E9C78] transition-colors py-3 px-4 rounded-xl hover:bg-gray-50"
          >
            <Home className="w-5 h-5 mr-3" />
            ホーム
          </Link>
          <Link 
            href="/dashboard" 
            className="flex items-center text-[#6F6F6F] hover:text-[#8E9C78] transition-colors py-3 px-4 rounded-xl hover:bg-gray-50"
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            学習ダッシュボード
          </Link>
          <Link 
            href="/specifications" 
            className="flex items-center text-[#6F6F6F] hover:text-[#8E9C78] transition-colors py-3 px-4 rounded-xl hover:bg-gray-50"
          >
            <FileText className="w-5 h-5 mr-3" />
            仕様書・設計書
          </Link>
          <Link 
            href="/usage" 
            className="flex items-center text-[#6F6F6F] hover:text-[#8E9C78] transition-colors py-3 px-4 rounded-xl hover:bg-gray-50"
          >
            <Settings className="w-5 h-5 mr-3" />
            使用状況
          </Link>
          <Link 
            href="/admin/categories" 
            className="flex items-center text-[#6F6F6F] hover:text-[#8E9C78] transition-colors py-3 px-4 rounded-xl hover:bg-gray-50"
          >
            <FolderOpen className="w-5 h-5 mr-3" />
            カテゴリ管理
          </Link>
          <Link 
            href="/admin/contents" 
            className="flex items-center text-[#6F6F6F] hover:text-[#8E9C78] transition-colors py-3 px-4 rounded-xl hover:bg-gray-50"
          >
            <Database className="w-5 h-5 mr-3" />
            コンテンツ管理
          </Link>
        </div>
      </div>
    </header>
  );
}