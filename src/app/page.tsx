'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import { useState, useEffect } from 'react';
import { getLearningPathUrl } from '@/lib/learning-paths';
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
  Database,
  Pin
} from 'lucide-react';
import { usePinnedPaths } from '@/hooks/usePinnedPaths';

const skillCategories = [
  {
    icon: <Cloud className="w-8 h-8" />,
    title: "DevOps & AWS",
    description: "クラウドインフラとCI/CDパイプラインの構築・運用",
    skills: ["AWS", "Docker", "Kubernetes", "Terraform"],
    color: "from-[#8E9C78] to-[#7a8a6a]"
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: "AI & 機械学習",
    description: "機械学習とLLMを活用した実践的開発",
    skills: ["Python", "TensorFlow", "OpenAI API", "PyTorch"],
    color: "from-[#8E9C78] to-[#7a8a6a]"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "セキュリティ",
    description: "ペネトレーションテストと脆弱性診断の実践",
    skills: ["OWASP", "WAF", "SSL/TLS", "監査"],
    color: "from-[#8E9C78] to-[#7a8a6a]"
  },
  {
    icon: <Database className="w-8 h-8" />,
    title: "システム設計",
    description: "スケーラブルなアーキテクチャ設計と実装",
    skills: ["マイクロサービス", "分散システム", "API設計", "DB設計"],
    color: "from-[#8E9C78] to-[#7a8a6a]"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "リーダーシップ",
    description: "チームマネジメントとプロジェクト推進力",
    skills: ["アジャイル", "スクラム", "技術選定", "ROI計算"],
    color: "from-[#8E9C78] to-[#7a8a6a]"
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "キャリア戦略",
    description: "年収向上と市場価値を高める転職戦略",
    skills: ["面接対策", "給与交渉", "技術ブログ", "OSS貢献"],
    color: "from-[#8E9C78] to-[#7a8a6a]"
  }
];

const stats = [
  { number: "800万+", label: "目標年収", icon: <TrendingUp className="w-5 h-5" /> },
  { number: "50+", label: "実践プロジェクト", icon: <Code className="w-5 h-5" /> },
  { number: "100+", label: "学習モジュール", icon: <Brain className="w-5 h-5" /> },
  { number: "∞", label: "キャリア可能性", icon: <Award className="w-5 h-5" /> }
];

// 型定義
interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  color?: string;
}


// PinnedLearning コンポーネント
function PinnedLearning() {
  const { pinnedPaths, loading } = usePinnedPaths();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // カテゴリデータを取得
        const { createClient } = await import('@supabase/supabase-js');
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseAnonKey) {
          const supabase = createClient(supabaseUrl, supabaseAnonKey);
          const { data: categoriesData } = await supabase
            .from('categories')
            .select('*')
            .eq('is_active', true)
            .order('sort_order');

          setCategories(categoriesData || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading || categoriesLoading) {
    return (
      <section className="py-12 bg-gradient-to-r from-[#8E9C78]/10 to-[#7a8a6a]/10 dark:from-[#a8b899]/20 dark:to-[#a8b899]/15">
        <div className="container-modern">
          <div className="text-center text-foreground">読み込み中...</div>
        </div>
      </section>
    );
  }

  if (pinnedPaths.length === 0) {
    return null;
  }

  // ピン固定された学習パスに対応するカテゴリを取得
  const pinnedCategories = categories.filter(category =>
    pinnedPaths.some(pin => pin.learning_path_name === category.name)
  );

  return (
    <section className="py-12 bg-gradient-to-r from-[#8E9C78]/10 to-[#7a8a6a]/10 dark:from-[#a8b899]/20 dark:to-[#a8b899]/15">
      <div className="container-modern">
        <div className="text-center mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold text-foreground flex items-center justify-center mb-4"
          >
            <Pin className="w-8 h-8 mr-3 text-primary" />
            今取り組んでいる学習
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-muted max-w-2xl mx-auto"
          >
            ピン留めした学習項目から、継続して取り組みましょう
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ピン留めした学習パスを表示 */}
          {pinnedCategories.map((category, index) => {
            const pathUrl = getLearningPathUrl(category.name);

            if (pathUrl) {
              return (
                <motion.div
                  key={`category-${category.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative group"
                >
                  <Link
                    href={pathUrl}
                    className="card-modern p-6 hover:shadow-lg border-2 border-primary/30 hover:border-primary/50 transition-all duration-300 block hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-3xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
                        {category.icon}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Pin className="w-4 h-4 text-primary fill-current" />
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color || '#8E9C78' }}
                        ></div>
                      </div>
                    </div>

                    <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h4>

                    <p className="text-muted text-sm mb-4">
                      {category.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
                        学習パス
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            }

            // パスが見つからない場合はクリック不可のカード
            return (
              <motion.div
                key={`category-${category.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="card-modern p-6 hover:shadow-lg border-2 border-primary/30 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
                      {category.icon}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Pin className="w-4 h-4 text-primary fill-current" />
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color || '#8E9C78' }}
                      ></div>
                    </div>
                  </div>

                  <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h4>

                  <p className="text-muted text-sm mb-4">
                    {category.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
                      学習パス
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-24 md:pb-32">
        <div className="container-modern">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight tracking-tight">
                  Dev Elite{' '}
                  <span className="text-gradient">
                    Academy
                  </span>
                </h1>

                <p className="text-base sm:text-lg md:text-xl text-muted leading-relaxed max-w-xl">
                  エンジニア3年目から高年収エンジニアへ。DevOps、AI/ML、セキュリティ、アーキテクチャ設計まで、将来性のある技術スキルを実践的に習得し、年収800万円以上を目指す統合学習プラットフォーム。
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              >
                <Link
                  href="/dashboard"
                  className="btn-modern inline-flex items-center justify-center space-x-2 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
                >
                  <span>📊 ダッシュボード</span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/learn"
                  className="btn-secondary inline-flex items-center justify-center space-x-2 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
                >
                  <span>📚 学習を始める</span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              >
                <Link
                  href="/specifications"
                  className="btn-secondary inline-flex items-center justify-center space-x-2"
                >
                  <span>📋 仕様書・設計書</span>
                </Link>
                <a
                  href="https://github.com/Gaku52/dev-elite-academy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary inline-flex items-center justify-center space-x-2"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative"
            >
              <div className="card-modern p-8 bg-gradient-to-br from-[#8E9C78]/10 to-[#8E9C78]/5 dark:from-[#a8b899]/20 dark:to-[#a8b899]/10">
                <h3 className="text-2xl font-bold text-foreground mb-6">統計</h3>
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat) => (
                    <div key={stat.label} className="text-center space-y-2">
                      <div className="flex justify-center text-primary">
                        {stat.icon}
                      </div>
                      <div className="text-3xl font-bold text-foreground">{stat.number}</div>
                      <div className="text-sm text-muted">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pinned Learning Section */}
      <PinnedLearning />

      {/* Skills Categories Section */}
      <section className="py-16 sm:py-24 md:py-32 bg-gray-50 dark:bg-card">
        <div className="container-modern">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                高年収エンジニアへの道のり
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted max-w-2xl mx-auto">
                実際の業務で必要とされる技術スキルを体系的に習得し、市場価値の高いエンジニアを目指します。
              </p>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {skillCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-modern p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-r ${category.color} rounded-2xl text-white`}>
                  {category.icon}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">{category.title}</h3>
                <p className="text-muted mb-6 leading-relaxed">{category.description}</p>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 md:py-32 bg-primary dark:bg-primary/90">
        <div className="container-modern text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                今すぐスキルアップを開始
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                実践的なプロジェクトと体系化された学習パスで、確実にスキルアップできます。
              </p>
            </div>

            <button className="bg-white dark:bg-gray-100 text-primary px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg hover:bg-gray-50 dark:hover:bg-gray-200 transition-colors inline-flex items-center space-x-2">
              <span>無料で始める</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-black dark:bg-background text-white dark:text-foreground border-t dark:border-border">
        <div className="container-modern">
          <div className="flex justify-center space-x-6 mb-8">
            <a
              href="https://github.com/Gaku52/dev-elite-academy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-foreground transition-colors duration-300"
            >
              <Github className="h-6 w-6" />
            </a>
            <a
              href="#"
              className="text-muted hover:text-foreground transition-colors duration-300"
            >
              <Globe className="h-6 w-6" />
            </a>
          </div>
          <p className="text-center text-muted">
            &copy; 2025 Dev Elite Academy. Built with Next.js 15, TypeScript, and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}