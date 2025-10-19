# 実行環境による分類

アプリケーションが動作する環境に基づいた基本的な分類です。

## 一覧表

| 分類 | プロ用語 | 説明 | 開発技術例 | 初期セットアップ速度 |
|------|----------|------|------------|---------------------|
| **Webアプリ** | Web Application | ブラウザで動作するアプリ。インストール不要 | React/Vue/Next.js, Django, Rails | ⚡⚡⚡ 最速 |
| **モバイルアプリ** | Native Mobile App | iOS/Android端末にインストールして使用 | Swift/Kotlin, React Native, Flutter | ⚡⚡ 中速 |
| **デスクトップアプリ** | Desktop Application | PC（Windows/Mac/Linux）にインストール | Electron, Tauri, .NET, Qt | ⚡⚡ 中速 |
| **PWA** | Progressive Web App | Webとネイティブの中間。オフライン対応可 | Next.js+PWA, Workbox | ⚡⚡⚡ 最速 |
| **ハイブリッドアプリ** | Hybrid App | 1つのコードでWeb/モバイル/デスクトップ対応 | Ionic, Capacitor, Flutter | ⚡⚡ 中速 |
| **CLI ツール** | Command Line Interface | ターミナルから使用するツール | Go, Rust, Node.js, Python | ⚡⚡⚡ 最速 |

---

## Webアプリケーション

### 概要
ブラウザ上で動作するアプリケーション。インストール不要でURLアクセスのみで利用可能。

### メリット
- ✅ インストール不要、即座にアクセス可能
- ✅ クロスプラットフォーム（どのOSでも動作）
- ✅ 更新が容易（サーバー側のみ）
- ✅ 開発・デプロイが最速

### デメリット
- ❌ オフライン機能が限定的（PWA除く）
- ❌ デバイス機能へのアクセスが制限される
- ❌ ブラウザ依存の挙動差異

### 推奨技術スタック

#### フロントエンド主体
```bash
# Next.js (React)
npx create-next-app@latest my-app --typescript --tailwind

# Nuxt.js (Vue)
npx nuxi@latest init my-app

# SvelteKit
npm create svelte@latest my-app
```

#### フルスタック
```bash
# Remix
npx create-remix@latest

# Astro
npm create astro@latest
```

### 適用シーン
- SaaSプロダクト
- 管理画面・ダッシュボード
- ECサイト
- ブログ・メディアサイト
- ランディングページ

---

## モバイルアプリケーション

### 概要
スマートフォン・タブレット向けのネイティブアプリケーション。

### メリット
- ✅ デバイス機能のフル活用（カメラ、GPS、通知等）
- ✅ オフライン動作
- ✅ 優れたパフォーマンス
- ✅ App Store/Google Playでの配信

### デメリット
- ❌ プラットフォーム別開発が必要（クロスプラットフォーム除く）
- ❌ 審査プロセスが必要
- ❌ 更新配信に時間がかかる

### 推奨技術スタック

#### クロスプラットフォーム（推奨）
```bash
# React Native (Expo)
npx create-expo-app@latest my-app

# Flutter
flutter create my_app
```

#### ネイティブ
- **iOS**: Swift + SwiftUI
- **Android**: Kotlin + Jetpack Compose

### 適用シーン
- コンシューマー向けアプリ
- 位置情報・カメラを使うアプリ
- オフライン必須のアプリ
- プッシュ通知が重要なアプリ

---

## デスクトップアプリケーション

### 概要
Windows、Mac、Linux向けのデスクトップアプリ。

### メリット
- ✅ システムリソースへのフルアクセス
- ✅ 高度なファイル操作
- ✅ オフライン完結
- ✅ 企業向けツールに適している

### デメリット
- ❌ OS別のビルドが必要
- ❌ 配布・更新の仕組みが複雑
- ❌ セットアップに時間がかかる

### 推奨技術スタック

```bash
# Tauri (軽量、Rust製)
npm create tauri-app

# Electron (シェア大、Node.js)
npm init electron-app@latest my-app
```

### 適用シーン
- 開発者ツール
- クリエイティブツール（動画編集等）
- 業務システム
- ローカルデータ処理ツール

---

## PWA（Progressive Web App）

### 概要
Webアプリでありながら、ネイティブアプリのような体験を提供。

### メリット
- ✅ Webアプリのメリット + ネイティブ風の体験
- ✅ オフライン対応
- ✅ ホーム画面追加可能
- ✅ プッシュ通知（Web Push）

### デメリット
- ❌ iOSでの機能制限が多い
- ❌ App Storeに配信できない

### 推奨技術スタック

```bash
# Next.js + next-pwa
npx create-next-app@latest
npm install next-pwa
```

### 適用シーン
- モバイルファーストWebアプリ
- オフライン対応が必要なWebアプリ
- App Store審査を避けたいアプリ

---

## ハイブリッドアプリ

### 概要
1つのコードベースで複数プラットフォームに対応。

### メリット
- ✅ コード共有率が高い
- ✅ 開発効率が良い
- ✅ Web版も同時展開可能

### デメリット
- ❌ ネイティブに比べるとパフォーマンスで劣る場合がある
- ❌ プラットフォーム固有機能への対応が遅れる

### 推奨技術スタック

```bash
# Ionic + Capacitor
npm install -g @ionic/cli
ionic start my-app

# Flutter (Web + Mobile + Desktop)
flutter create my_app
flutter run -d chrome  # Web
flutter run -d macos   # Desktop
```

### 適用シーン
- マルチプラットフォーム展開が必須
- 開発リソースが限られている
- MVP開発

---

## CLI ツール

### 概要
コマンドラインから実行するツール。

### メリット
- ✅ 開発が非常に高速
- ✅ 自動化・スクリプト化しやすい
- ✅ 軽量
- ✅ CI/CDに組み込みやすい

### デメリット
- ❌ GUI がない
- ❌ 非エンジニアには使いづらい

### 推奨技術スタック

```bash
# Go (バイナリ配布に最適)
go mod init my-cli

# Node.js (npm配布に最適)
npm init
npm install commander inquirer chalk

# Rust (高性能)
cargo new my-cli

# Python (スクリプトに最適)
pip install click typer
```

### 適用シーン
- 開発者ツール
- ビルド・デプロイツール
- データ処理スクリプト
- システム管理ツール

---

## 選択基準

| 優先事項 | 推奨分類 |
|---------|---------|
| 最速開発 | Webアプリ or CLI |
| マルチプラットフォーム | ハイブリッドアプリ or PWA |
| 高パフォーマンス | ネイティブモバイル or デスクトップ |
| オフライン必須 | ネイティブ or PWA |
| エンタープライズ | デスクトップ or Webアプリ |
