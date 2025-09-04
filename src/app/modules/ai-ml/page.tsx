'use client';

import { motion } from 'framer-motion';
import { 
  Brain, 
  Terminal, 
  FileCode,
  GitBranch,
  Sparkles,
  Command,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Zap,
  Shield,
  GitPullRequest,
  Bug,
  RefreshCw
} from 'lucide-react';
import { useState, ReactElement } from 'react';
import Link from 'next/link';

interface IntroContent {
  description: string;
  features: string[];
}

interface SetupStep {
  title: string;
  command: string;
  description: string;
}

interface SetupContent {
  steps: SetupStep[];
}

interface Command {
  name: string;
  description: string;
  usage: string;
}

interface CommandsContent {
  commands: Command[];
}

interface Example {
  title: string;
  description: string;
  prompt: string;
  result: string;
}

interface ExamplesContent {
  examples: Example[];
}

interface Workflow {
  title: string;
  steps: string[];
}

interface WorkflowContent {
  workflows: Workflow[];
}

interface Tip {
  title: string;
  description: string;
  example: string;
}

interface TipsContent {
  tips: Tip[];
}

type SectionContent = IntroContent | SetupContent | CommandsContent | ExamplesContent | WorkflowContent | TipsContent;

interface ClaudeCodeSection {
  id: string;
  title: string;
  icon: ReactElement;
  content: SectionContent;
}

const claudeCodeSections: ClaudeCodeSection[] = [
  {
    id: 'intro',
    title: 'Claude Codeとは',
    icon: <Brain className="w-6 h-6" />,
    content: {
      description: 'Claude CodeはAnthropicが提供する最先端のAIペアプログラミングツールです。自然言語での指示により、コードの生成、修正、デバッグ、リファクタリングを効率的に行えます。',
      features: [
        'コンテキストを理解した高精度なコード生成',
        '複数ファイルの同時編集とプロジェクト全体の理解',
        'バグの検出と修正提案',
        'コードレビューとベストプラクティスの提案',
        '自然言語によるコマンド実行'
      ]
    } as IntroContent
  },
  {
    id: 'setup',
    title: 'セットアップ',
    icon: <Terminal className="w-6 h-6" />,
    content: {
      steps: [
        {
          title: 'インストール',
          command: 'npm install -g claude-code',
          description: 'Claude Code CLIをグローバルインストール'
        },
        {
          title: '初期設定',
          command: 'claude-code init',
          description: 'プロジェクトディレクトリで初期化'
        },
        {
          title: 'API設定',
          command: 'claude-code config --api-key YOUR_API_KEY',
          description: 'APIキーを設定（環境変数推奨）'
        }
      ]
    } as SetupContent
  },
  {
    id: 'commands',
    title: '基本コマンド',
    icon: <Command className="w-6 h-6" />,
    content: {
      commands: [
        {
          name: '/help',
          description: 'ヘルプとコマンド一覧を表示',
          usage: 'Claude Codeの使い方を確認'
        },
        {
          name: '/new',
          description: '新規ファイルやコンポーネントを作成',
          usage: '/new component UserProfile.tsx'
        },
        {
          name: '/edit',
          description: '既存ファイルを編集',
          usage: '/edit src/app/page.tsx "ダークモード対応を追加"'
        },
        {
          name: '/fix',
          description: 'エラーやバグを修正',
          usage: '/fix "TypeScriptのエラーを解決"'
        },
        {
          name: '/review',
          description: 'コードレビューを実行',
          usage: '/review src/components/*.tsx'
        },
        {
          name: '/test',
          description: 'テストコードを生成・実行',
          usage: '/test "UserServiceのunit testを作成"'
        },
        {
          name: '/docs',
          description: 'ドキュメントを生成',
          usage: '/docs generate README.md'
        }
      ]
    } as CommandsContent
  },
  {
    id: 'practical',
    title: '実践的な使用例',
    icon: <Sparkles className="w-6 h-6" />,
    content: {
      examples: [
        {
          title: 'React コンポーネント作成',
          description: 'TypeScript対応のReactコンポーネントを瞬時に生成',
          prompt: '"ユーザープロフィールカードコンポーネントを作成。画像、名前、役職、SNSリンクを含む"',
          result: '完全なTypeScript型定義付きコンポーネント'
        },
        {
          title: 'API エンドポイント実装',
          description: 'RESTful APIやGraphQLエンドポイントの実装',
          prompt: '"CRUD操作に対応したUser APIエンドポイントを作成。認証とバリデーション付き"',
          result: 'セキュアで型安全なAPIエンドポイント'
        },
        {
          title: 'バグ修正とリファクタリング',
          description: 'コードの問題を検出し、最適化',
          prompt: '"このコンポーネントのパフォーマンスを最適化して、不要な再レンダリングを防ぐ"',
          result: 'React.memo、useMemo、useCallbackを適切に使用'
        },
        {
          title: 'データベース設計',
          description: 'Prismaスキーマやマイグレーション作成',
          prompt: '"ブログシステムのデータベーススキーマを設計。投稿、ユーザー、コメント、タグ機能"',
          result: '正規化された効率的なDBスキーマ'
        },
        {
          title: 'CI/CD パイプライン構築',
          description: 'GitHub Actionsの設定ファイル生成',
          prompt: '"Next.jsアプリのCI/CDパイプラインを設定。テスト、ビルド、Vercelへの自動デプロイ"',
          result: '完全なGitHub Actionsワークフロー'
        }
      ]
    } as ExamplesContent
  },
  {
    id: 'workflow',
    title: 'ワークフロー最適化',
    icon: <GitBranch className="w-6 h-6" />,
    content: {
      workflows: [
        {
          title: 'Feature開発フロー',
          steps: [
            'ブランチ作成: /git checkout -b feature/user-auth',
            '実装: /new "認証機能を実装"',
            'テスト作成: /test "認証機能のテスト"',
            'コードレビュー: /review',
            'PR作成: /git create-pr "認証機能の追加"'
          ]
        },
        {
          title: 'バグ修正フロー',
          steps: [
            'エラー解析: /analyze error.log',
            'バグ特定: /debug "ユーザー登録でエラー"',
            '修正実装: /fix',
            '回帰テスト: /test regression',
            'デプロイ: /deploy production'
          ]
        },
        {
          title: 'リファクタリングフロー',
          steps: [
            'コード分析: /analyze performance',
            '改善提案: /suggest improvements',
            'リファクタリング: /refactor "クリーンアーキテクチャに変更"',
            'テスト確認: /test all',
            'ドキュメント更新: /docs update'
          ]
        } as Workflow
      ]
    } as WorkflowContent
  },
  {
    id: 'tips',
    title: 'プロのTips',
    icon: <Lightbulb className="w-6 h-6" />,
    content: {
      tips: [
        {
          title: 'コンテキストを明確に',
          description: '使用する技術スタック、フレームワーク、ライブラリを明示的に指定',
          example: '"Next.js 14 App Router、TypeScript、Tailwind CSSを使用して..."'
        },
        {
          title: '段階的な実装',
          description: '大きなタスクは小さなステップに分割して指示',
          example: '"まずAPIのスキーマを定義" → "次にエンドポイントを実装" → "最後にフロントエンドと連携"'
        },
        {
          title: 'エラーハンドリング重視',
          description: '常にエラー処理とバリデーションを含めるよう指示',
          example: '"適切なエラーハンドリングと入力バリデーション付きで実装"'
        },
        {
          title: 'テスト駆動開発',
          description: 'テストファーストアプローチの活用',
          example: '"/test create" → 実装 → "/test run"のサイクル'
        },
        {
          title: 'セキュリティ考慮',
          description: 'セキュリティ要件を明示的に含める',
          example: '"XSS、CSRF対策を含む安全な実装で..."'
        }
      ]
    } as TipsContent
  }
];

const advancedFeatures = [
  {
    icon: <Bug className="w-8 h-8" />,
    title: 'スマートデバッグ',
    description: 'エラーメッセージから問題を自動診断し、修正案を提示'
  },
  {
    icon: <RefreshCw className="w-8 h-8" />,
    title: 'リアルタイム補完',
    description: 'コーディング中に文脈を理解した提案をリアルタイムで表示'
  },
  {
    icon: <GitPullRequest className="w-8 h-8" />,
    title: 'PR自動生成',
    description: '変更内容を分析し、詳細なPR説明文を自動生成'
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'セキュリティ監査',
    description: '潜在的な脆弱性を検出し、修正方法を提案'
  }
];

export default function AIMachineLearningPage() {
  const [activeSection, setActiveSection] = useState('intro');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-purple-800/30 bg-black/20 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Brain className="w-8 h-8 text-purple-400 mr-3" />
              <h1 className="text-xl font-semibold text-white">AI & 機械学習</h1>
            </div>
            <Link
              href="/"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              ← ホームに戻る
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center relative"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4"
            >
              <span className="text-6xl">🤖</span>
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Claude Code
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                マスターガイド
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              AIペアプログラミングで開発効率を
              <span className="text-2xl font-bold text-purple-400 mx-1">10倍</span>
              に。
              <br />
              Claude Codeを使いこなして、高品質なコードを高速に実装する方法を学びます。
            </p>
            <div className="mt-8 flex justify-center gap-4 flex-wrap">
              <span className="px-4 py-2 bg-purple-800/30 rounded-full text-purple-300 border border-purple-700">
                🚀 初心者歓迎
              </span>
              <span className="px-4 py-2 bg-pink-800/30 rounded-full text-pink-300 border border-pink-700">
                ✨ 即戦力スキル
              </span>
              <span className="px-4 py-2 bg-blue-800/30 rounded-full text-blue-300 border border-blue-700">
                🎯 実践的
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-16 z-10 bg-black/40 backdrop-blur-sm border-b border-purple-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto py-4">
            {claudeCodeSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                  activeSection === section.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-purple-800/30 hover:text-white'
                }`}
              >
                {section.icon}
                <span>{section.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction Section */}
        {activeSection === 'intro' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-purple-800/30">
              <h3 className="text-2xl font-bold text-white mb-4">Claude Codeとは</h3>
              <p className="text-gray-300 mb-6">
                {(claudeCodeSections[0].content as IntroContent).description}
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {(claudeCodeSections[0].content as IntroContent).features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Advanced Features */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {advancedFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-purple-800/20 to-pink-800/20 rounded-lg p-6 border border-purple-700/30"
                >
                  <div className="text-purple-400 mb-4">{feature.icon}</div>
                  <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Setup Section */}
        {activeSection === 'setup' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-purple-800/30">
              <h3 className="text-2xl font-bold text-white mb-6">セットアップ手順</h3>
              {(claudeCodeSections[1].content as SetupContent).steps.map((step, index) => (
                <div key={index} className="mb-8 last:mb-0">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      {index + 1}
                    </div>
                    <h4 className="text-lg font-semibold text-white">{step.title}</h4>
                  </div>
                  <div className="ml-11">
                    <div className="bg-slate-800 rounded-lg p-4 mb-2">
                      <code className="text-green-400">{step.command}</code>
                    </div>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Commands Section */}
        {activeSection === 'commands' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-purple-800/30">
              <h3 className="text-2xl font-bold text-white mb-6">基本コマンド一覧</h3>
              <div className="space-y-4">
                {(claudeCodeSections[2].content as CommandsContent).commands.map((cmd, index) => (
                  <div key={index} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <code className="text-purple-400 font-semibold text-lg">{cmd.name}</code>
                        </div>
                        <p className="text-gray-300 mb-2">{cmd.description}</p>
                        <div className="bg-slate-900 rounded p-2">
                          <code className="text-green-400 text-sm">{cmd.usage}</code>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Practical Examples Section */}
        {activeSection === 'practical' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-purple-800/30">
              <h3 className="text-2xl font-bold text-white mb-6">実践的な使用例</h3>
              <div className="grid gap-6">
                {(claudeCodeSections[3].content as ExamplesContent).examples.map((example, index) => (
                  <div key={index} className="bg-gradient-to-r from-purple-800/20 to-pink-800/20 rounded-lg p-6 border border-purple-700/30">
                    <h4 className="text-xl font-semibold text-white mb-2">{example.title}</h4>
                    <p className="text-gray-300 mb-4">{example.description}</p>
                    <div className="space-y-3">
                      <div>
                        <span className="text-purple-400 text-sm font-semibold">プロンプト:</span>
                        <div className="bg-slate-800 rounded p-3 mt-1">
                          <code className="text-blue-300">{example.prompt}</code>
                        </div>
                      </div>
                      <div>
                        <span className="text-green-400 text-sm font-semibold">結果:</span>
                        <p className="text-gray-300 mt-1">{example.result}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Workflow Section */}
        {activeSection === 'workflow' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-purple-800/30">
              <h3 className="text-2xl font-bold text-white mb-6">ワークフロー最適化</h3>
              <div className="grid gap-8">
                {(claudeCodeSections[4].content as WorkflowContent).workflows.map((workflow, index) => (
                  <div key={index} className="bg-slate-800/30 rounded-lg p-6">
                    <h4 className="text-xl font-semibold text-white mb-4">{workflow.title}</h4>
                    <div className="space-y-3">
                      {workflow.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-center">
                          <div className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center mr-3">
                            <span className="text-purple-400 text-sm">{stepIndex + 1}</span>
                          </div>
                          <code className="text-gray-300 bg-slate-900 px-3 py-1 rounded">{step}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Tips Section */}
        {activeSection === 'tips' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-purple-800/30">
              <h3 className="text-2xl font-bold text-white mb-6">プロのTips</h3>
              <div className="grid gap-6">
                {(claudeCodeSections[5].content as TipsContent).tips.map((tip, index) => (
                  <div key={index} className="bg-gradient-to-r from-slate-800/50 to-slate-700/30 rounded-lg p-6 border border-slate-600/30">
                    <div className="flex items-start">
                      <Zap className="w-6 h-6 text-yellow-400 mr-3 mt-1" />
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white mb-2">{tip.title}</h4>
                        <p className="text-gray-300 mb-3">{tip.description}</p>
                        <div className="bg-slate-900 rounded p-3">
                          <code className="text-green-400 text-sm">{tip.example}</code>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            今すぐClaude Codeを始めよう
          </h3>
          <p className="text-purple-100 mb-6">
            AIペアプログラミングで、あなたの開発効率を劇的に向上させましょう
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="https://claude.ai/code"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors"
            >
              Claude Codeを試す
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
            <a
              href="https://docs.anthropic.com/claude"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-purple-800 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
            >
              ドキュメントを読む
              <FileCode className="ml-2 w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}