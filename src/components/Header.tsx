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
  FileText,
  Menu,
  X
} from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';

export default function Header() {
  const { user, signOut, loading } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    
    // 即座にメニューを閉じる
    setUserMenuOpen(false);
    
    try {
      await signOut();
      // Sign out successful
    } catch {
      // Sign out error - silently handled
    }
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setUserMenuOpen(prev => !prev);
  };

  return (
    <header className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container-modern">
        <div className="flex items-center justify-between h-20">
          {/* ロゴ */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-sm">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Dev Elite Academy</span>
          </Link>

          {/* ナビゲーション */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="flex items-center text-muted hover:text-primary transition-colors font-medium"
            >
              <Home className="w-4 h-4 mr-2" />
              ホーム
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center text-muted hover:text-primary transition-colors font-medium"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              学習ダッシュボード
            </Link>
            <Link
              href="/specifications"
              className="flex items-center text-muted hover:text-primary transition-colors font-medium"
            >
              <FileText className="w-4 h-4 mr-2" />
              仕様書・設計書
            </Link>
            <Link
              href="/usage"
              className="flex items-center text-muted hover:text-primary transition-colors font-medium"
            >
              <Settings className="w-4 h-4 mr-2" />
              使用状況
            </Link>
          </nav>

          {/* モバイルメニューとユーザーメニュー */}
          <div className="flex items-center gap-4">
            {/* ダークモードトグル */}
            <DarkModeToggle />

            {/* モバイルメニューボタン */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-muted hover:text-primary transition-colors"
              aria-label="メニュー"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* ユーザーメニュー */}
            <div className="relative">
              {loading ? (
                <div className="w-10 h-10 bg-border rounded-2xl animate-pulse"></div>
              ) : user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={handleMenuToggle}
                  className="flex items-center space-x-3 text-foreground hover:text-primary transition-colors bg-card dark:bg-card rounded-2xl px-4 py-2 border border-border hover:border-primary"
                  aria-label="ユーザーメニュー"
                  type="button"
                >
                  <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium max-w-[150px] truncate">
                    {user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-card rounded-2xl shadow-lg border border-border overflow-hidden"
                       style={{
                         zIndex: 9999,
                         pointerEvents: 'auto',
                         position: 'absolute',
                         top: '100%',
                         right: '0'
                       }}>
                    <div className="p-4 border-b border-border bg-card dark:bg-card">
                      <p className="text-foreground text-sm font-medium truncate" title={user.email || ''}>
                        {user.email}
                      </p>
                      <p className="text-muted text-xs mt-1">学習者</p>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/dashboard"
                        className="block px-3 py-2 text-sm text-muted hover:text-primary hover:bg-card rounded-xl transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <BarChart3 className="w-4 h-4 inline mr-2" />
                        学習ダッシュボード
                      </Link>
                      <Link
                        href="/usage"
                        className="block px-3 py-2 text-sm text-muted hover:text-primary hover:bg-card rounded-xl transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 inline mr-2" />
                        使用状況
                      </Link>
                      <div className="border-t border-border my-2"></div>
                      <Link
                        href="/admin/categories"
                        className="block px-3 py-2 text-sm text-muted hover:text-primary hover:bg-card rounded-xl transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <FolderOpen className="w-4 h-4 inline mr-2" />
                        カテゴリ管理
                      </Link>
                      <Link
                        href="/admin/contents"
                        className="block px-3 py-2 text-sm text-muted hover:text-primary hover:bg-card rounded-xl transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Database className="w-4 h-4 inline mr-2" />
                        コンテンツ管理
                      </Link>
                      <div className="border-t border-border my-2"></div>
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
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
        <div className="container-modern py-4 space-y-2">
          <Link
            href="/"
            className="flex items-center text-muted hover:text-primary transition-colors py-3 px-4 rounded-xl hover:bg-card"
          >
            <Home className="w-5 h-5 mr-3" />
            ホーム
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center text-muted hover:text-primary transition-colors py-3 px-4 rounded-xl hover:bg-card"
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            学習ダッシュボード
          </Link>
          <Link
            href="/specifications"
            className="flex items-center text-muted hover:text-primary transition-colors py-3 px-4 rounded-xl hover:bg-card"
          >
            <FileText className="w-5 h-5 mr-3" />
            仕様書・設計書
          </Link>
          <Link
            href="/usage"
            className="flex items-center text-muted hover:text-primary transition-colors py-3 px-4 rounded-xl hover:bg-card"
          >
            <Settings className="w-5 h-5 mr-3" />
            使用状況
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center text-muted hover:text-primary transition-colors py-3 px-4 rounded-xl hover:bg-card"
          >
            <FolderOpen className="w-5 h-5 mr-3" />
            カテゴリ管理
          </Link>
          <Link
            href="/admin/contents"
            className="flex items-center text-muted hover:text-primary transition-colors py-3 px-4 rounded-xl hover:bg-card"
          >
            <Database className="w-5 h-5 mr-3" />
            コンテンツ管理
          </Link>
        </div>
      </div>
      )}
    </header>
  );
}