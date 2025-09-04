'use client';

import { motion } from 'framer-motion';
import { 
  Code, 
  Target, 
  TrendingUp, 
  Shield, 
  Cloud, 
  Brain,
  Users,
  Award,
  ChevronRight,
  Github,
  Globe,
  Database
} from 'lucide-react';

const skillCategories = [
  {
    icon: <Cloud className="w-8 h-8" />,
    title: "DevOps & AWS",
    description: "クラウドインフラ、CI/CD、コンテナ化、監視システム",
    skills: ["AWS", "Docker", "Kubernetes", "Terraform", "GitHub Actions"],
    color: "from-orange-500 to-red-500"
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: "AI & 機械学習",
    description: "機械学習、LLM活用、データサイエンス、MLOps",
    skills: ["Python", "TensorFlow", "OpenAI API", "PyTorch", "RAG"],
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "セキュリティ",
    description: "ペネトレーションテスト、脆弱性診断、セキュリティ運用",
    skills: ["OWASP", "WAF", "SSL/TLS", "監査", "インシデント対応"],
    color: "from-green-500 to-teal-500"
  },
  {
    icon: <Database className="w-8 h-8" />,
    title: "システム設計",
    description: "アーキテクチャ設計、スケーラビリティ、パフォーマンス",
    skills: ["マイクロサービス", "分散システム", "API設計", "DB設計", "負荷分散"],
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "リーダーシップ",
    description: "チームマネジメント、プロジェクト管理、ビジネススキル",
    skills: ["アジャイル", "スクラム", "ステークホルダー管理", "ROI計算", "技術選定"],
    color: "from-indigo-500 to-purple-500"
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "キャリア戦略",
    description: "年収向上、ポートフォリオ構築、転職戦略、市場価値分析",
    skills: ["面接対策", "給与交渉", "技術ブログ", "OSS貢献", "ネットワーキング"],
    color: "from-yellow-500 to-orange-500"
  }
];

const stats = [
  { number: "800万+", label: "目標年収", icon: <TrendingUp className="w-5 h-5" /> },
  { number: "50+", label: "実践プロジェクト", icon: <Code className="w-5 h-5" /> },
  { number: "100+", label: "学習モジュール", icon: <Brain className="w-5 h-5" /> },
  { number: "∞", label: "キャリア可能性", icon: <Award className="w-5 h-5" /> }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl"
                >
                  <span className="block xl:inline">Dev Elite</span>{' '}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 xl:inline">
                    Academy
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                >
                  エンジニア3年目から高年収エンジニアへ。DevOps、AI/ML、セキュリティ、アーキテクチャ設計まで、
                  将来性のある技術スキルを実践的に習得し、年収800万円以上を目指す統合学習プラットフォーム。
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start"
                >
                  <div className="rounded-md shadow">
                    <a
                      href="/modules/ai-ml"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 md:py-4 md:text-lg md:px-10 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      🤖 Claude Codeを学ぶ
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </a>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <a
                      href="https://github.com/Gaku52/dev-elite-academy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-purple-100 bg-purple-800/50 hover:bg-purple-700/50 md:py-4 md:text-lg md:px-10 transition-all duration-300"
                    >
                      <Github className="mr-2 w-5 h-5" />
                      GitHub で見る
                    </a>
                  </div>
                </motion.div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-to-br from-purple-600 to-pink-600 sm:h-72 md:h-96 lg:w-full lg:h-full opacity-20" />
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <div className="text-white">{stat.icon}</div>
                </div>
                <div className="text-3xl font-bold text-white">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Categories Section */}
      <div id="skills" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-base text-purple-400 font-semibold tracking-wide uppercase"
            >
              学習カテゴリー
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl"
            >
              高年収エンジニアへの道のり
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-4 max-w-2xl text-xl text-gray-300 lg:mx-auto"
            >
              実際の業務で必要とされる技術スキルを体系的に習得し、市場価値の高いエンジニアを目指します。
            </motion.p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
            {skillCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                <div className="relative p-6 bg-black/40 backdrop-blur-sm rounded-lg leading-none">
                  <div className={`flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-r ${category.color} rounded-lg text-white`}>
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{category.title}</h3>
                  <p className="text-gray-300 mb-4">{category.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-purple-800/50 text-purple-100 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-800 to-pink-800">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-extrabold text-white sm:text-4xl"
          >
            <span className="block">今すぐスキルアップを開始</span>
            <span className="block">高年収エンジニアへの第一歩</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 text-lg leading-6 text-purple-100"
          >
            実践的なプロジェクトと体系化された学習パスで、確実にスキルアップできます。
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8"
          >
            <a
              href="#"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-purple-600 bg-white hover:bg-purple-50 transition-all duration-300 transform hover:scale-105"
            >
              無料で始める
              <ChevronRight className="ml-2 w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/40">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-6">
            <a
              href="https://github.com/Gaku52/dev-elite-academy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-300 transition-colors duration-300"
            >
              <Github className="h-6 w-6" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-gray-300 transition-colors duration-300"
            >
              <Globe className="h-6 w-6" />
            </a>
          </div>
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; 2025 Dev Elite Academy. Built with Next.js, TypeScript, and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}