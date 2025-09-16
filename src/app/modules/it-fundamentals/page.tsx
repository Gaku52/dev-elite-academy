import Link from 'next/link';
import { BookOpen, ArrowLeft, Code, Database, Network, Shield, Calculator, Users, FileText, TrendingUp } from 'lucide-react';

const fundamentalTopics = [
  {
    id: 1,
    title: 'コンピュータシステム',
    description: 'ハードウェア、ソフトウェア、システム構成の基礎知識',
    icon: Calculator,
    topics: ['CPU・メモリ・入出力装置', 'オペレーティングシステム', 'システムの構成と方式'],
    color: 'bg-blue-500',
    progress: 0
  },
  {
    id: 2,
    title: 'アルゴリズムとプログラミング',
    description: 'プログラミング言語、データ構造、アルゴリズムの基本',
    icon: Code,
    topics: ['基本アルゴリズム', 'データ構造', 'プログラミング言語の基礎'],
    color: 'bg-purple-500',
    progress: 0
  },
  {
    id: 3,
    title: 'データベース',
    description: 'データベースの基本概念とSQL',
    icon: Database,
    topics: ['関係データベース', 'SQL基礎', '正規化', 'トランザクション処理'],
    color: 'bg-green-500',
    progress: 0
  },
  {
    id: 4,
    title: 'ネットワーク',
    description: 'ネットワーク技術とプロトコルの基礎',
    icon: Network,
    topics: ['OSI参照モデル', 'TCP/IP', 'LAN・WAN', 'インターネット技術'],
    color: 'bg-orange-500',
    progress: 0
  },
  {
    id: 5,
    title: 'セキュリティ',
    description: '情報セキュリティの基本概念と対策',
    icon: Shield,
    topics: ['暗号技術', '認証技術', 'セキュリティ対策', 'リスクマネジメント'],
    color: 'bg-red-500',
    progress: 0
  },
  {
    id: 6,
    title: 'システム開発',
    description: 'システム開発手法とプロジェクトマネジメント',
    icon: Users,
    topics: ['開発手法', 'テスト技法', 'プロジェクト管理', 'サービスマネジメント'],
    color: 'bg-indigo-500',
    progress: 0
  },
  {
    id: 7,
    title: '経営・法務',
    description: '企業活動と法務の基礎知識',
    icon: FileText,
    topics: ['経営戦略', '企業会計', '法務・標準化', 'OR・IE'],
    color: 'bg-teal-500',
    progress: 0
  },
  {
    id: 8,
    title: 'ストラテジ',
    description: 'システム戦略と経営戦略',
    icon: TrendingUp,
    topics: ['システム戦略', '経営戦略マネジメント', '技術戦略マネジメント'],
    color: 'bg-pink-500',
    progress: 0
  }
];

export default function ITFundamentalsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container-modern py-12">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-[#8E9C78] hover:text-[#7a8a6a] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          ダッシュボードに戻る
        </Link>
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-[#4A90E2] rounded-2xl shadow-sm">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">
            基本情報技術者試験
          </h1>
          <p className="text-xl text-[#6F6F6F] max-w-3xl mx-auto">
            IT基礎知識を体系的に学習
          </p>
        </div>

        <div className="mb-8">
          <div className="card-modern p-6">
            <h2 className="text-xl font-semibold mb-4">学習の概要</h2>
            <p className="text-[#6F6F6F] mb-4">
              基本情報技術者試験は、ITエンジニアとしての基礎的な知識・技能を評価する国家試験です。
              以下の分野を体系的に学習していきます。
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                テクノロジ系
              </span>
              <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm">
                マネジメント系
              </span>
              <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm">
                ストラテジ系
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fundamentalTopics.map((topic) => {
            const Icon = topic.icon;
            return (
              <div key={topic.id} className="card-modern p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start mb-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${topic.color} rounded-xl mr-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-black mb-1">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-[#6F6F6F]">
                      {topic.description}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  {topic.topics.map((item, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-gray-300 rounded-full mr-2"></span>
                      <span className="text-[#6F6F6F]">{item}</span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6F6F6F]">進捗</span>
                    <span className="text-[#6F6F6F]">{topic.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${topic.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${topic.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <button className="mt-4 w-full py-2 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors text-sm font-medium">
                  学習を開始
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-12 card-modern p-6">
          <h2 className="text-xl font-semibold mb-4">学習のポイント</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <span className="text-2xl mr-3">📚</span>
              <div>
                <h3 className="font-medium mb-1">体系的な学習</h3>
                <p className="text-sm text-[#6F6F6F]">
                  各分野を順序立てて学習し、知識を確実に定着させます
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">🎯</span>
              <div>
                <h3 className="font-medium mb-1">実践的な演習</h3>
                <p className="text-sm text-[#6F6F6F]">
                  過去問題や演習問題で実力を確認しながら進めます
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">📊</span>
              <div>
                <h3 className="font-medium mb-1">進捗管理</h3>
                <p className="text-sm text-[#6F6F6F]">
                  学習の進捗を可視化し、効率的な学習計画を立てられます
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">💡</span>
              <div>
                <h3 className="font-medium mb-1">重要ポイント解説</h3>
                <p className="text-sm text-[#6F6F6F]">
                  試験によく出る重要なポイントを詳しく解説します
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}