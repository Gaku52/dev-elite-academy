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
    <header className="bg-black/40 backdrop-blur-sm border-b border-purple-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ロゴ */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Dev Elite Academy</span>
          </Link>

          {/* ナビゲーション */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="flex items-center text-gray-300 hover:text-white transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              ホーム
            </Link>
            <Link 
              href="/dashboard" 
              className="flex items-center text-gray-300 hover:text-white transition-colors"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              学習ダッシュボード
            </Link>
            <Link 
              href="/specifications" 
              className="flex items-center text-gray-300 hover:text-white transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" />
              仕様書・設計書
            </Link>
            <Link 
              href="/usage" 
              className="flex items-center text-gray-300 hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4 mr-2" />
              使用状況
            </Link>
          </nav>

          {/* ユーザーメニュー */}
          <div className="relative">
            {loading ? (
              <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
            ) : user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={handleMenuToggle}
                  className="flex items-center space-x-2 text-white hover:text-purple-300 transition-colors"
                  aria-label="ユーザーメニュー"
                  type="button"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium max-w-[150px] truncate">
                    {user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-lg shadow-xl border border-slate-700 overflow-hidden" 
                       style={{ 
                         zIndex: 9999, 
                         pointerEvents: 'auto',
                         position: 'absolute',
                         top: '100%',
                         right: '0'
                       }}>
                    <div className="p-4 border-b border-slate-700 bg-gradient-to-r from-purple-600/10 to-pink-600/10">
                      <p className="text-white text-sm font-medium truncate" title={user.email || ''}>
                        {user.email}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">学習者</p>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/dashboard"
                        className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <BarChart3 className="w-4 h-4 inline mr-2" />
                        学習ダッシュボード
                      </Link>
                      <Link
                        href="/usage"
                        className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 inline mr-2" />
                        使用状況
                      </Link>
                      <div className="border-t border-slate-700 my-2"></div>
                      <Link
                        href="/admin/categories"
                        className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <FolderOpen className="w-4 h-4 inline mr-2" />
                        カテゴリ管理
                      </Link>
                      <Link
                        href="/admin/contents"
                        className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Database className="w-4 h-4 inline mr-2" />
                        コンテンツ管理
                      </Link>
                      <div className="border-t border-slate-700 my-2"></div>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-white hover:bg-red-600/20 rounded-md flex items-center transition-colors group cursor-pointer"
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
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <LogIn className="w-4 h-4" />
                <span>ログイン</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-purple-800/30">
        <div className="px-4 py-3 space-y-1">
          <Link 
            href="/" 
            className="flex items-center text-gray-300 hover:text-white transition-colors py-2"
          >
            <Home className="w-4 h-4 mr-3" />
            ホーム
          </Link>
          <Link 
            href="/dashboard" 
            className="flex items-center text-gray-300 hover:text-white transition-colors py-2"
          >
            <BarChart3 className="w-4 h-4 mr-3" />
            学習ダッシュボード
          </Link>
          <Link 
            href="/specifications" 
            className="flex items-center text-gray-300 hover:text-white transition-colors py-2"
          >
            <FileText className="w-4 h-4 mr-3" />
            仕様書・設計書
          </Link>
          <Link 
            href="/usage" 
            className="flex items-center text-gray-300 hover:text-white transition-colors py-2"
          >
            <Settings className="w-4 h-4 mr-3" />
            使用状況
          </Link>
          <Link 
            href="/admin/categories" 
            className="flex items-center text-gray-300 hover:text-white transition-colors py-2"
          >
            <FolderOpen className="w-4 h-4 mr-3" />
            カテゴリ管理
          </Link>
          <Link 
            href="/admin/contents" 
            className="flex items-center text-gray-300 hover:text-white transition-colors py-2"
          >
            <Database className="w-4 h-4 mr-3" />
            コンテンツ管理
          </Link>
        </div>
      </div>
    </header>
  );
}