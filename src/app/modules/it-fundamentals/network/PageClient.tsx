'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, CheckCircle, Circle, ChevronRight, Wifi, AlertCircle, Trophy } from 'lucide-react';
import { useLearningProgress } from '@/hooks/useLearningProgress';

interface Quiz {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface Section {
  title: string;
  content: string;
  quizzes: Quiz[];
}

interface Module {
  id: number;
  title: string;
  sections: Section[];
}

const learningModules: Module[] = [
  {
    id: 1,
    title: 'ネットワークの基礎',
    sections: [
      {
        title: 'OSI参照モデル',
        content: `OSI参照モデルは、ネットワーク通信を7つの階層に分けて定義したものです：

**7層構造:**

1. **物理層（Physical Layer）**
   - ビット列の伝送、電気信号の変換
   - ケーブル、コネクタ、ハブ、リピータ
   - 伝送媒体の規格（イーサネット、無線LAN）

2. **データリンク層（Data Link Layer）**
   - 隣接ノード間のデータ転送
   - MACアドレスによる識別
   - スイッチ、ブリッジ、ARP

3. **ネットワーク層（Network Layer）**
   - エンドツーエンドの経路制御
   - IPアドレスによるルーティング
   - ルータ、L3スイッチ、ICMP

4. **トランスポート層（Transport Layer）**
   - 信頼性のあるデータ転送
   - TCP（信頼性重視）、UDP（速度重視）
   - ポート番号による識別

5. **セッション層（Session Layer）**
   - 通信の開始・維持・終了
   - セッション管理、同期制御
   - SQL、RPC、NetBIOS

6. **プレゼンテーション層（Presentation Layer）**
   - データ形式の変換
   - 文字コード変換、暗号化、圧縮
   - JPEG、MPEG、SSL/TLS

7. **アプリケーション層（Application Layer）**
   - アプリケーション固有のプロトコル
   - HTTP、FTP、SMTP、DNS
   - ユーザーインターフェース`,
        quizzes: [
          {
            question: 'OSI参照モデルで、IPアドレスを扱う層はどれか？',
            options: ['物理層', 'データリンク層', 'ネットワーク層', 'トランスポート層'],
            correct: 2,
            explanation: 'ネットワーク層（第3層）はIPアドレスを使用してパケットのルーティングを行います。エンドツーエンドの通信経路を確立します。'
          },
          {
            question: 'TCPが動作するOSI参照モデルの層はどれか？',
            options: ['ネットワーク層', 'トランスポート層', 'セッション層', 'アプリケーション層'],
            correct: 1,
            explanation: 'TCPはトランスポート層（第4層）のプロトコルで、信頼性のあるデータ転送、フロー制御、輻輳制御を提供します。'
          },
          {
            question: 'MACアドレスを使用してフレームの転送を行う装置はどれか？',
            options: ['リピータ', 'ブリッジ', 'ルータ', 'ゲートウェイ'],
            correct: 1,
            explanation: 'ブリッジはデータリンク層（第2層）で動作し、MACアドレスを学習してフレームを転送します。スイッチも同様の機能を持ちます。'
          },
          {
            question: 'HTTPSで使用される暗号化は、OSI参照モデルのどの層で実装されるか？',
            options: ['トランスポート層', 'セッション層', 'プレゼンテーション層', 'アプリケーション層'],
            correct: 2,
            explanation: 'SSL/TLSによる暗号化はプレゼンテーション層（第6層）で実装されます。データの暗号化・復号化を担当します。'
          },
          {
            question: '異なるネットワーク間でパケットの中継を行う装置はどれか？',
            options: ['ハブ', 'スイッチ', 'ルータ', 'リピータ'],
            correct: 2,
            explanation: 'ルータはネットワーク層（第3層）で動作し、IPアドレスを基に異なるネットワーク間でパケットをルーティングします。'
          }
        ]
      },
      {
        title: 'TCP/IPプロトコル',
        content: `TCP/IPは、インターネットで標準的に使用される通信プロトコルです：

**TCP/IP階層モデル:**

1. **ネットワークインターフェース層**
   - イーサネット、Wi-Fi、PPP
   - 物理的な通信媒体とのインターフェース
   - フレームの送受信

2. **インターネット層**
   - IP（Internet Protocol）: パケット配送
   - ICMP: エラー通知、診断（ping）
   - ARP: IPアドレスとMACアドレスの変換
   - ルーティングプロトコル（RIP、OSPF、BGP）

3. **トランスポート層**
   - TCP: コネクション型、信頼性保証
     * 3ウェイハンドシェイク
     * シーケンス番号による順序制御
     * 再送制御、フロー制御
   - UDP: コネクションレス型、高速
     * ベストエフォート型
     * リアルタイム通信向き

4. **アプリケーション層**
   - HTTP/HTTPS: Web通信
   - FTP/SFTP: ファイル転送
   - SMTP/POP3/IMAP: メール
   - DNS: 名前解決
   - DHCP: IPアドレス自動割当

**IPアドレス:**
- IPv4: 32ビット（例: 192.168.1.1）
- IPv6: 128ビット（例: 2001:db8::1）
- サブネットマスク: ネットワーク部とホスト部の識別
- CIDR表記: 192.168.1.0/24`,
        quizzes: [
          {
            question: 'TCPの3ウェイハンドシェイクで使用されるフラグの正しい順序はどれか？',
            options: ['SYN → ACK → SYN', 'SYN → SYN/ACK → ACK', 'ACK → SYN → ACK', 'SYN → ACK → FIN'],
            correct: 1,
            explanation: 'TCPの3ウェイハンドシェイクは、1)クライアントがSYN送信、2)サーバがSYN/ACK返信、3)クライアントがACK送信の順序で行われます。'
          },
          {
            question: 'プライベートIPアドレスの範囲として正しいものはどれか？',
            options: ['10.0.0.0～10.255.255.255', '127.0.0.0～127.255.255.255', '169.254.0.0～169.254.255.255', '224.0.0.0～239.255.255.255'],
            correct: 0,
            explanation: '10.0.0.0/8、172.16.0.0/12、192.168.0.0/16がプライベートIPアドレスの範囲です。127.0.0.0/8はループバック、169.254.0.0/16はリンクローカル、224.0.0.0/4はマルチキャストです。'
          },
          {
            question: 'DNSが使用するポート番号はどれか？',
            options: ['20', '25', '53', '80'],
            correct: 2,
            explanation: 'DNSは53番ポートを使用します（TCP/UDP両方）。20はFTPデータ、25はSMTP、80はHTTPのポート番号です。'
          },
          {
            question: 'サブネットマスク255.255.255.192のネットワークで利用可能なホスト数はいくつか？',
            options: ['62', '64', '126', '128'],
            correct: 0,
            explanation: '255.255.255.192は/26（26ビットマスク）で、ホスト部は6ビット。2^6-2=62台（ネットワークアドレスとブロードキャストアドレスを除く）。'
          },
          {
            question: 'UDPの特徴として適切でないものはどれか？',
            options: ['コネクションレス型である', '再送制御を行う', 'ヘッダサイズが小さい', 'ストリーミングに適している'],
            correct: 1,
            explanation: 'UDPは再送制御を行いません。信頼性よりも速度を重視し、パケットロスの可能性がありますが、リアルタイム性が求められる通信に適しています。'
          }
        ]
      },
      {
        title: 'ルーティングとスイッチング',
        content: `ネットワーク機器による経路制御とデータ転送の仕組み：

**スイッチング技術:**

1. **レイヤ2スイッチング**
   - MACアドレステーブルの学習
   - ブロードキャストドメイン
   - VLAN（Virtual LAN）による論理分割
   - スパニングツリープロトコル（STP）

2. **レイヤ3スイッチング**
   - IPアドレスによる高速転送
   - ハードウェアルーティング
   - VLAN間ルーティング

**ルーティング:**

1. **静的ルーティング**
   - 管理者が手動設定
   - 小規模ネットワーク向き
   - 障害時の自動切替なし

2. **動的ルーティング**
   - RIP（Routing Information Protocol）
     * ホップ数でメトリック計算
     * 最大15ホップ
   - OSPF（Open Shortest Path First）
     * リンクステート型
     * コスト計算による最短経路
   - BGP（Border Gateway Protocol）
     * AS間ルーティング
     * インターネットの基幹プロトコル

**NAT/NAPT:**
- Network Address Translation
- プライベート⇔グローバルIP変換
- IPマスカレード（NAPT）: ポート番号も変換

**QoS（Quality of Service）:**
- 帯域制御、優先制御
- 音声・動画の品質保証
- DiffServ、IntServ`,
        quizzes: [
          {
            question: 'VLANの主な目的として適切なものはどれか？',
            options: ['通信速度の向上', 'ブロードキャストドメインの分割', 'IPアドレスの節約', 'インターネット接続の実現'],
            correct: 1,
            explanation: 'VLANは物理的な接続に依存せずに論理的にネットワークを分割し、ブロードキャストドメインを制限することでネットワークの効率とセキュリティを向上させます。'
          },
          {
            question: 'RIPの最大ホップ数はいくつか？',
            options: ['7', '15', '31', '255'],
            correct: 1,
            explanation: 'RIPの最大ホップ数は15です。16ホップは到達不可能を意味します。この制限により大規模ネットワークには不向きです。'
          },
          {
            question: 'OSPFの特徴として正しいものはどれか？',
            options: ['ディスタンスベクター型である', 'ホップ数でメトリックを計算する', 'リンクステート型である', 'AS間ルーティングに使用される'],
            correct: 2,
            explanation: 'OSPFはリンクステート型ルーティングプロトコルで、ネットワーク全体のトポロジ情報を基に最短経路を計算します。'
          },
          {
            question: 'NAPTで変換される情報の組み合わせとして正しいものはどれか？',
            options: ['IPアドレスのみ', 'ポート番号のみ', 'IPアドレスとポート番号', 'MACアドレスとIPアドレス'],
            correct: 2,
            explanation: 'NAPT（IPマスカレード）は送信元IPアドレスとポート番号の両方を変換し、複数の内部ホストが1つのグローバルIPアドレスを共有できるようにします。'
          },
          {
            question: 'スパニングツリープロトコル（STP）の目的は何か？',
            options: ['通信速度の向上', 'ループの防止', 'セキュリティの強化', 'IPアドレスの自動割当'],
            correct: 1,
            explanation: 'STPはレイヤ2ネットワークでループを検出し、冗長パスをブロックすることでブロードキャストストームを防止します。'
          }
        ]
      },
      {
        title: '無線LANとモバイル通信',
        content: `無線通信技術の規格と仕組み：

**無線LAN（Wi-Fi）:**

1. **IEEE 802.11規格**
   - 802.11a: 5GHz帯、54Mbps
   - 802.11b: 2.4GHz帯、11Mbps
   - 802.11g: 2.4GHz帯、54Mbps
   - 802.11n: 2.4/5GHz、600Mbps（MIMO）
   - 802.11ac: 5GHz、6.9Gbps（Wave2）
   - 802.11ax（Wi-Fi 6）: 2.4/5GHz、9.6Gbps

2. **無線LANのセキュリティ**
   - WEP: 脆弱（使用非推奨）
   - WPA: TKIP使用
   - WPA2: AES使用（現在の標準）
   - WPA3: 最新規格、SAE認証

3. **アクセス制御**
   - SSID: ネットワーク識別子
   - MACアドレスフィルタリング
   - ステルスSSID
   - 認証方式（PSK、Enterprise）

**モバイル通信:**

1. **世代別技術**
   - 3G: CDMA2000、W-CDMA
   - 4G/LTE: OFDMA、MIMO
   - 5G: 超高速、超低遅延、多数同時接続

2. **通信方式**
   - CSMA/CA: 衝突回避
   - OFDM: 直交周波数分割多重
   - MIMO: 複数アンテナによる高速化

**Bluetooth:**
- 近距離無線通信（約10m）
- ペアリング、プロファイル
- BLE（Bluetooth Low Energy）`,
        quizzes: [
          {
            question: '無線LANで使用される衝突回避方式はどれか？',
            options: ['CSMA/CD', 'CSMA/CA', 'TDMA', 'FDMA'],
            correct: 1,
            explanation: '無線LANではCSMA/CA（Carrier Sense Multiple Access with Collision Avoidance）を使用します。有線LANのCSMA/CDと異なり、衝突を事前に回避します。'
          },
          {
            question: 'WPA2で使用される暗号化方式はどれか？',
            options: ['WEP', 'TKIP', 'AES', 'DES'],
            correct: 2,
            explanation: 'WPA2ではAES（Advanced Encryption Standard）を使用します。WEPは脆弱、TKIPはWPA、DESは古い暗号化方式です。'
          },
          {
            question: 'IEEE 802.11acの特徴として正しいものはどれか？',
            options: ['2.4GHz帯のみ使用', '5GHz帯のみ使用', '最大11Mbps', 'MIMO非対応'],
            correct: 1,
            explanation: '802.11acは5GHz帯のみを使用し、最大6.9Gbpsの高速通信が可能です。MU-MIMO技術により複数端末との同時通信も可能です。'
          },
          {
            question: '5G通信の特徴として適切でないものはどれか？',
            options: ['超高速通信', '超低遅延', '多数同時接続', '消費電力の増大'],
            correct: 3,
            explanation: '5Gは超高速・超低遅延・多数同時接続を実現しながら、ネットワークスライシングやエッジコンピューティングにより効率的な電力管理も可能です。'
          },
          {
            question: 'Bluetoothの特徴として正しいものはどれか？',
            options: ['長距離通信（100m以上）', '高速通信（1Gbps以上）', '近距離無線通信', '有線接続が必要'],
            correct: 2,
            explanation: 'Bluetoothは約10m程度の近距離無線通信技術で、ペアリングにより機器同士を接続します。省電力のBLEも広く利用されています。'
          }
        ]
      },
      {
        title: 'ネットワーク管理とトラブルシューティング',
        content: `ネットワークの監視、管理、問題解決の手法：

**ネットワーク管理プロトコル:**

1. **SNMP（Simple Network Management Protocol）**
   - MIB（Management Information Base）
   - トラップによる異常通知
   - ポーリングによる定期監視
   - バージョン（v1、v2c、v3）

2. **監視ツール**
   - MRTG: トラフィック監視
   - Nagios: 統合監視
   - Wireshark: パケットキャプチャ
   - NetFlow: フロー解析

**診断コマンド:**

1. **接続確認**
   - ping: ICMP疎通確認
   - traceroute/tracert: 経路確認
   - pathping: 経路品質測定

2. **名前解決**
   - nslookup: DNS問い合わせ
   - dig: 詳細なDNS診断
   - host: 簡易DNS確認

3. **ネットワーク状態**
   - netstat: 接続状態表示
   - ss: ソケット統計
   - arp: ARPテーブル表示
   - route: ルーティングテーブル

**トラブルシューティング:**

1. **一般的な問題**
   - IPアドレス競合
   - DNSの名前解決失敗
   - ルーティング設定ミス
   - MTUサイズ不整合

2. **性能問題**
   - 帯域不足、輻輳
   - パケットロス
   - 遅延（レイテンシ）
   - ジッタ（遅延のばらつき）

3. **セキュリティ問題**
   - 不正アクセス
   - DDoS攻撃
   - ARPスプーフィング
   - DNSキャッシュポイズニング`,
        quizzes: [
          {
            question: 'SNMPで管理情報を格納するデータベースは何か？',
            options: ['SIB', 'MIB', 'RIB', 'FIB'],
            correct: 1,
            explanation: 'MIB（Management Information Base）は、SNMPで管理される機器の情報を階層的に格納するデータベースです。'
          },
          {
            question: 'pingコマンドが使用するプロトコルはどれか？',
            options: ['TCP', 'UDP', 'ICMP', 'ARP'],
            correct: 2,
            explanation: 'pingはICMP（Internet Control Message Protocol）のEcho RequestとEcho Replyを使用してネットワークの疎通確認を行います。'
          },
          {
            question: 'tracerouteコマンドの目的は何か？',
            options: ['通信速度の測定', 'パケットの経路確認', 'DNSの名前解決', 'ARPテーブルの表示'],
            correct: 1,
            explanation: 'tracerouteは宛先までのパケットが通過するルータの経路を確認するコマンドです。各ホップのIPアドレスと応答時間を表示します。'
          },
          {
            question: 'MTUのデフォルト値（イーサネット）はいくつか？',
            options: ['576バイト', '1500バイト', '4096バイト', '9000バイト'],
            correct: 1,
            explanation: 'イーサネットのMTU（Maximum Transmission Unit）のデフォルト値は1500バイトです。ジャンボフレームでは9000バイトも使用されます。'
          },
          {
            question: 'ARPスプーフィングの攻撃手法として正しいものはどれか？',
            options: ['偽のDNS応答を返す', '偽のARPパケットでMACアドレスを詐称', '大量のパケットを送信', 'パスワードを推測'],
            correct: 1,
            explanation: 'ARPスプーフィングは偽のARPパケットを送信してMACアドレスを詐称し、通信を傍受・改ざんする中間者攻撃の手法です。'
          }
        ]
      }
    ]
  }
];

export default function NetworkLearningPage() {
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [quizHistory, setQuizHistory] = useState<boolean[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completedQuizzes, setCompletedQuizzes] = useState<Set<string>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<{[key: string]: number}>({});
  const [showQuizResults, setShowQuizResults] = useState<{[key: string]: boolean}>({});
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());

  const currentModule = learningModules[currentModuleIndex];
  const currentSection = currentModule.sections[currentSectionIndex];
  const currentQuiz = currentSection.quizzes[currentQuizIndex];

  const { progress, saveProgress } = useLearningProgress('network');

  useEffect(() => {
    if (progress.length > 0) {
      console.log('🔄 Restoring network progress state...');
      const completedSet = new Set<string>();
      const answersMap: {[key: string]: number} = {};
      const resultsMap: {[key: string]: boolean} = {};

      progress.forEach((p) => {
        const sectionKey = p.section_key;
        if (p.is_completed) {
          completedSet.add(sectionKey);
          resultsMap[sectionKey] = true;

          const parts = sectionKey.split('-');
          if (parts.length >= 3) {
            const moduleIndex = parseInt(parts[0]);
            const sectionIndex = parseInt(parts[1]);
            const quizIndex = parseInt(parts[2]);

            if (!isNaN(moduleIndex) && !isNaN(sectionIndex) && !isNaN(quizIndex)) {
              const learningModule = learningModules[moduleIndex];
              if (learningModule && learningModule.sections[sectionIndex] && learningModule.sections[sectionIndex].quizzes[quizIndex]) {
                const correctAnswer = learningModule.sections[sectionIndex].quizzes[quizIndex].correct;
                answersMap[sectionKey] = correctAnswer;
              }
            }
          }
        }
      });

      setCompletedQuizzes(completedSet);
      setQuizAnswers(answersMap);
      setShowQuizResults(resultsMap);
      console.log('✅ Network progress restored:', { completed: completedSet.size, answers: Object.keys(answersMap).length });
    }
  }, [progress]);

  const handleAnswerSelect = async (answerIndex: number) => {
    if (showResult) return;

    const quizKey = `${currentModuleIndex}-${currentSectionIndex}-${currentQuizIndex}`;

    setSelectedAnswer(answerIndex);
    setQuizAnswers({...quizAnswers, [quizKey]: answerIndex});
    setShowResult(true);
    setShowExplanation(true);
    setShowQuizResults({...showQuizResults, [quizKey]: true});

    const isCorrect = answerIndex === currentQuiz.correct;
    setQuizHistory([...quizHistory, isCorrect]);

    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
      setCompletedQuizzes(new Set([...completedQuizzes, quizKey]));
    }
    setTotalQuestions(totalQuestions + 1);

    // Save progress to database
    try {
      await saveProgress(quizKey, isCorrect, isCorrect);
      console.log('✅ Network progress saved:', { section: quizKey, correct: isCorrect });
    } catch (error) {
      console.error('❌ Failed to save network progress:', error);
    }
  };

  const handleNextQuiz = () => {
    if (currentQuizIndex < currentSection.quizzes.length - 1) {
      const nextQuizIndex = currentQuizIndex + 1;
      const nextQuizKey = `${currentModuleIndex}-${currentSectionIndex}-${nextQuizIndex}`;
      setCurrentQuizIndex(nextQuizIndex);
      setSelectedAnswer(quizAnswers[nextQuizKey] ?? null);
      setShowResult(showQuizResults[nextQuizKey] ?? false);
      setShowExplanation(showQuizResults[nextQuizKey] ?? false);
    } else {
      const sectionKey = `${currentModuleIndex}-${currentSectionIndex}`;
      setCompletedSections(new Set([...completedSections, sectionKey]));

      if (currentSectionIndex < currentModule.sections.length - 1) {
        const nextSectionIndex = currentSectionIndex + 1;
        const nextQuizKey = `${currentModuleIndex}-${nextSectionIndex}-0`;
        setCurrentSectionIndex(nextSectionIndex);
        setCurrentQuizIndex(0);
        setSelectedAnswer(quizAnswers[nextQuizKey] ?? null);
        setShowResult(showQuizResults[nextQuizKey] ?? false);
        setShowExplanation(showQuizResults[nextQuizKey] ?? false);
        setQuizHistory([]);
      } else if (currentModuleIndex < learningModules.length - 1) {
        const nextModuleIndex = currentModuleIndex + 1;
        const nextQuizKey = `${nextModuleIndex}-0-0`;
        setCurrentModuleIndex(nextModuleIndex);
        setCurrentSectionIndex(0);
        setCurrentQuizIndex(0);
        setSelectedAnswer(quizAnswers[nextQuizKey] ?? null);
        setShowResult(showQuizResults[nextQuizKey] ?? false);
        setShowExplanation(showQuizResults[nextQuizKey] ?? false);
        setQuizHistory([]);
      }
    }
  };

  const handlePreviousQuiz = () => {
    if (currentQuizIndex > 0) {
      const prevQuizIndex = currentQuizIndex - 1;
      const prevQuizKey = `${currentModuleIndex}-${currentSectionIndex}-${prevQuizIndex}`;
      setCurrentQuizIndex(prevQuizIndex);
      setSelectedAnswer(quizAnswers[prevQuizKey] ?? null);
      setShowResult(showQuizResults[prevQuizKey] ?? false);
      setShowExplanation(showQuizResults[prevQuizKey] ?? false);
      const newHistory = [...quizHistory];
      newHistory.pop();
      setQuizHistory(newHistory);
    }
  };

  const handleSectionSelect = (moduleIndex: number, sectionIndex: number) => {
    const quizKey = `${moduleIndex}-${sectionIndex}-0`;
    setCurrentModuleIndex(moduleIndex);
    setCurrentSectionIndex(sectionIndex);
    setCurrentQuizIndex(0);
    setSelectedAnswer(quizAnswers[quizKey] ?? null);
    setShowResult(showQuizResults[quizKey] ?? false);
    setShowExplanation(showQuizResults[quizKey] ?? false);
    setQuizHistory([]);
  };

  const progressPercentage = Math.round((completedSections.size /
    learningModules.reduce((acc, module) => acc + module.sections.length, 0)) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/modules/it-fundamentals" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            基本情報技術者試験対策に戻る
          </Link>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Wifi className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">ネットワーク</h1>
                  <p className="text-gray-600 mt-1">通信技術とプロトコルの基礎知識</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">{progressPercentage}%</div>
                <p className="text-sm text-gray-600">完了</p>
              </div>
            </div>

            <div className="relative pt-1">
              <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-200">
                <div
                  style={{ width: `${progressPercentage}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                学習内容
              </h2>

              <div className="space-y-3">
                {learningModules.map((module, moduleIndex) => (
                  <div key={module.id}>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">{module.title}</h3>
                    <div className="space-y-1">
                      {module.sections.map((section, sectionIndex) => {
                        const sectionKey = `${moduleIndex}-${sectionIndex}`;
                        const isCompleted = completedSections.has(sectionKey);
                        const isCurrent = moduleIndex === currentModuleIndex && sectionIndex === currentSectionIndex;

                        return (
                          <button
                            key={sectionIndex}
                            onClick={() => handleSectionSelect(moduleIndex, sectionIndex)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between transition-colors ${
                              isCurrent
                                ? 'bg-blue-50 text-blue-700 font-medium'
                                : isCompleted
                                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                : 'hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            <span className="flex items-center">
                              {isCompleted ? (
                                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                              ) : (
                                <Circle className="w-4 h-4 mr-2 text-gray-400" />
                              )}
                              {section.title}
                            </span>
                            {isCurrent && <ChevronRight className="w-4 h-4" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md">
              <div className="border-b px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{currentSection.title}</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {currentModule.title} - 問題 {currentQuizIndex + 1} / {currentSection.quizzes.length}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="font-semibold">{correctAnswers} / {totalQuestions}</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <div className="prose max-w-none mb-8">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <h3 className="text-lg font-semibold text-blue-900 mb-3">学習内容</h3>
                      <div className="text-gray-700 whitespace-pre-line">{currentSection.content}</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-start">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-semibold mr-3 flex-shrink-0">
                        {currentQuizIndex + 1}
                      </span>
                      <p className="text-gray-900 font-medium text-lg">{currentQuiz.question}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {currentQuiz.options.map((option, index) => {
                      const isSelected = selectedAnswer === index;
                      const isCorrect = index === currentQuiz.correct;

                      let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-all ";

                      if (showResult) {
                        if (isCorrect) {
                          buttonClass += "border-green-500 bg-green-50 ";
                        } else if (isSelected && !isCorrect) {
                          buttonClass += "border-red-500 bg-red-50 ";
                        } else {
                          buttonClass += "border-gray-200 bg-white ";
                        }
                      } else {
                        buttonClass += isSelected
                          ? "border-blue-500 bg-blue-50 "
                          : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 cursor-pointer ";
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          disabled={showResult}
                          className={buttonClass}
                        >
                          <div className="flex items-start">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border-2 mr-3 mt-0.5 flex-shrink-0">
                              {showResult && isCorrect ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : showResult && isSelected && !isCorrect ? (
                                <AlertCircle className="w-5 h-5 text-red-600" />
                              ) : (
                                <span className="text-sm">{String.fromCharCode(65 + index)}</span>
                              )}
                            </span>
                            <span className={`${showResult && isCorrect ? 'font-semibold' : ''}`}>
                              {option}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {showExplanation && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">解説</h4>
                      <p className="text-gray-700">{currentQuiz.explanation}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <button
                    onClick={handlePreviousQuiz}
                    disabled={currentQuizIndex === 0}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    前の問題へ
                  </button>

                  <div className="flex space-x-1">
                    {currentSection.quizzes.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentQuizIndex
                            ? 'bg-blue-600'
                            : index < currentQuizIndex
                            ? quizHistory[index] ? 'bg-green-500' : 'bg-red-500'
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  {showResult && (
                    <button
                      onClick={handleNextQuiz}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {currentQuizIndex < currentSection.quizzes.length - 1
                        ? '次の問題へ'
                        : currentSectionIndex < currentModule.sections.length - 1
                        ? '次のセクションへ'
                        : currentModuleIndex < learningModules.length - 1
                        ? '次のモジュールへ'
                        : '完了'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}