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
          },
          {
            question: 'OSI参照モデルの物理層で定義される内容として適切なものはどれか？',
            options: ['フレームの形式', 'ビット伝送の電気的特性', 'IPアドレスの構造', 'アプリケーションプロトコル'],
            correct: 1,
            explanation: '物理層はビット列の電気信号への変換、ケーブルの特性、コネクタの仕様など、物理的な伝送媒体に関する定義を行います。'
          },
          {
            question: 'データリンク層で使用されるアドレスはどれか？',
            options: ['IPアドレス', 'MACアドレス', 'ポート番号', 'ドメイン名'],
            correct: 1,
            explanation: 'データリンク層では物理的に隣接するノード間の通信にMACアドレス（物理アドレス）を使用します。'
          },
          {
            question: 'セッション層の主な機能はどれか？',
            options: ['パケットのルーティング', 'データの暗号化', '通信セッションの管理', 'フレームのスイッチング'],
            correct: 2,
            explanation: 'セッション層は通信の開始、維持、終了を管理し、同期制御やチェックポイント機能を提供します。'
          },
          {
            question: 'プレゼンテーション層で実行される処理として適切なものはどれか？',
            options: ['パケットの転送', 'データの圧縮・暗号化', 'ルーティングテーブルの更新', 'ARPテーブルの管理'],
            correct: 1,
            explanation: 'プレゼンテーション層はデータの表現形式を管理し、圧縮、暗号化、文字コード変換などを行います。'
          },
          {
            question: 'アプリケーション層で動作するプロトコルはどれか？',
            options: ['IP', 'TCP', 'ARP', 'HTTP'],
            correct: 3,
            explanation: 'HTTPはアプリケーション層のプロトコルで、WebブラウザとWebサーバ間の通信に使用されます。'
          },
          {
            question: 'OSI参照モデルでフロー制御を行う層はどれか？',
            options: ['物理層', 'データリンク層', 'ネットワーク層', 'トランスポート層'],
            correct: 3,
            explanation: 'トランスポート層ではTCPによるフロー制御が行われ、送信者と受信者間のデータ流量を調整します。'
          },
          {
            question: 'ハブが動作するOSI参照モデルの層はどれか？',
            options: ['物理層', 'データリンク層', 'ネットワーク層', 'トランスポート層'],
            correct: 0,
            explanation: 'ハブは物理層で動作し、受信した電気信号をすべてのポートに転送するリピータ機能を持ちます。'
          },
          {
            question: 'L3スイッチが動作する層の組み合わせとして正しいものはどれか？',
            options: ['物理層のみ', 'データリンク層のみ', 'ネットワーク層のみ', 'データリンク層とネットワーク層'],
            correct: 3,
            explanation: 'L3スイッチはデータリンク層のスイッチング機能とネットワーク層のルーティング機能を併せ持ちます。'
          },
          {
            question: 'カプセル化の過程で、トランスポート層で追加されるヘッダ情報はどれか？',
            options: ['MACアドレス', 'IPアドレス', 'ポート番号', 'フレームチェックシーケンス'],
            correct: 2,
            explanation: 'トランスポート層ではポート番号を含むTCPまたはUDPヘッダが追加され、アプリケーションを識別します。'
          },
          {
            question: 'OSI参照モデルとTCP/IPモデルの対応として正しいものはどれか？',
            options: ['OSI 7層 = TCP/IP 4層', 'OSI物理層 = TCP/IPネットワークインターフェース層', 'OSIネットワーク層 = TCP/IPアプリケーション層', 'OSIセッション層 = TCP/IPトランスポート層'],
            correct: 1,
            explanation: 'OSI参照モデルの物理層とデータリンク層は、TCP/IPモデルのネットワークインターフェース層に対応します。'
          },
          {
            question: 'ゲートウェイが主に動作するOSI参照モデルの層はどれか？',
            options: ['物理層', 'データリンク層', 'ネットワーク層', 'アプリケーション層'],
            correct: 3,
            explanation: 'アプリケーションゲートウェイは異なるプロトコル間の変換を行い、主にアプリケーション層で動作します。'
          },
          {
            question: 'データのデカプセル化の過程で最初に処理される層はどれか？',
            options: ['アプリケーション層', 'トランスポート層', 'ネットワーク層', '物理層'],
            correct: 3,
            explanation: 'データの受信時は物理層から開始し、各層でヘッダを取り除きながら上位層へデータを渡していきます。'
          },
          {
            question: '各層が独立して機能する利点として適切なものはどれか？',
            options: ['通信速度の向上', '消費電力の削減', 'プロトコルの変更が他層に影響しない', 'ネットワーク容量の拡大'],
            correct: 2,
            explanation: '階層化により各層が独立して機能するため、一つの層のプロトコル変更が他層に影響を与えません。'
          },
          {
            question: 'コネクション型通信を提供するOSI参照モデルの層はどれか？',
            options: ['データリンク層', 'ネットワーク層', 'トランスポート層', 'セッション層'],
            correct: 2,
            explanation: 'トランスポート層のTCPがコネクション型通信を提供し、信頼性のあるデータ転送を実現します。'
          },
          {
            question: 'エラー検出・訂正機能を持つOSI参照モデルの層はどれか？',
            options: ['物理層のみ', 'データリンク層のみ', 'トランスポート層のみ', 'データリンク層とトランスポート層'],
            correct: 3,
            explanation: 'データリンク層ではフレームレベル、トランスポート層ではセグメントレベルでエラー検出・訂正機能を提供します。'
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
          },
          {
            question: 'IPv4アドレスのクラスAの特徴として正しいものはどれか？',
            options: ['最初のオクテットが128～191', 'デフォルトサブネットマスクが255.255.0.0', 'ネットワーク部が8ビット', 'マルチキャスト用途'],
            correct: 2,
            explanation: 'クラスAは最初のオクテットが1～126で、ネットワーク部が8ビット、ホスト部が24ビットです。デフォルトサブネットマスクは255.0.0.0です。'
          },
          {
            question: 'IPv6アドレスの表記法として正しいものはどれか？',
            options: ['192.168.1.1', '2001:db8::1', 'FF:FF:FF:FF:FF:FF', '255.255.255.0'],
            correct: 1,
            explanation: 'IPv6は128ビットアドレスを16進数で表記し、コロン（:）で区切ります。2001:db8::1は有効なIPv6表記です。'
          },
          {
            question: 'ARPの機能として正しいものはどれか？',
            options: ['IPアドレスからMACアドレスを取得', 'MACアドレスからIPアドレスを取得', 'ドメイン名からIPアドレスを取得', 'IPアドレスからポート番号を取得'],
            correct: 0,
            explanation: 'ARP（Address Resolution Protocol）は既知のIPアドレスから対応するMACアドレスを取得するプロトコルです。'
          },
          {
            question: 'ICMPの用途として適切なものはどれか？',
            options: ['ファイル転送', 'メール送信', 'エラー通知と診断', 'Webページ閲覧'],
            correct: 2,
            explanation: 'ICMP（Internet Control Message Protocol）はネットワーク上のエラー通知や診断情報の通信に使用されます。pingやtracerouteで利用されます。'
          },
          {
            question: 'TCPヘッダのウィンドウサイズフィールドの目的は何か？',
            options: ['パケットの暗号化', 'フロー制御', 'ルーティング', 'アドレス変換'],
            correct: 1,
            explanation: 'ウィンドウサイズはTCPのフロー制御で使用され、受信側が処理可能なデータ量を送信側に通知します。'
          },
          {
            question: 'DHCPで自動割り当てされる情報として適切でないものはどれか？',
            options: ['IPアドレス', 'サブネットマスク', 'デフォルトゲートウェイ', 'MACアドレス'],
            correct: 3,
            explanation: 'DHCPはIPアドレス、サブネットマスク、デフォルトゲートウェイ、DNSサーバなどを自動割り当てしますが、MACアドレスは物理的に固定されています。'
          },
          {
            question: 'FTPのパッシブモードの特徴として正しいものはどれか？',
            options: ['サーバからクライアントへデータ接続を開始', 'クライアントからサーバへデータ接続を開始', 'ポート20のみ使用', '暗号化通信を強制'],
            correct: 1,
            explanation: 'パッシブモードではクライアントがサーバへデータ接続を開始するため、ファイアウォール越えが容易になります。'
          },
          {
            question: 'SMTPが使用するデフォルトポート番号はどれか？',
            options: ['21', '25', '53', '110'],
            correct: 1,
            explanation: 'SMTPは25番ポートを使用します。21はFTP、53はDNS、110はPOP3のポート番号です。'
          },
          {
            question: 'IPv4のマルチキャストアドレス範囲はどれか？',
            options: ['192.168.0.0～192.168.255.255', '172.16.0.0～172.31.255.255', '224.0.0.0～239.255.255.255', '240.0.0.0～255.255.255.255'],
            correct: 2,
            explanation: 'IPv4のマルチキャストはクラスDアドレス（224.0.0.0～239.255.255.255）が使用されます。'
          },
          {
            question: 'TCPの輻輳制御で使用されるアルゴリズムはどれか？',
            options: ['スロースタート', 'ファストスタート', 'クイックスタート', 'インスタントスタート'],
            correct: 0,
            explanation: 'TCPの輻輳制御では、スロースタート、輻輳回避、ファストリトランスミット、ファストリカバリなどのアルゴリズムが使用されます。'
          },
          {
            question: 'HTTPSが使用するデフォルトポート番号はどれか？',
            options: ['80', '443', '8080', '8443'],
            correct: 1,
            explanation: 'HTTPSは443番ポートを使用します。80はHTTP、8080と8443は代替ポート番号として使用されることがあります。'
          },
          {
            question: 'IPv6のリンクローカルアドレスのプレフィックスはどれか？',
            options: ['2001:db8::/32', 'fc00::/7', 'fe80::/10', 'ff00::/8'],
            correct: 2,
            explanation: 'IPv6のリンクローカルアドレスはfe80::/10プレフィックスを使用し、同一リンク内でのみ有効です。'
          },
          {
            question: 'TCPの4ウェイハンドシェイク（切断）で最初に送信されるフラグはどれか？',
            options: ['SYN', 'ACK', 'FIN', 'RST'],
            correct: 2,
            explanation: 'TCP接続の正常な切断では、まずFINフラグが送信され、4ウェイハンドシェイクが開始されます。'
          },
          {
            question: 'NATの主な目的として最も適切なものはどれか？',
            options: ['通信速度の向上', 'IPv4アドレスの節約', 'データの暗号化', 'パケットの圧縮'],
            correct: 1,
            explanation: 'NAT（Network Address Translation）の主目的は、プライベートIPアドレスを使用してグローバルIPアドレスの使用量を削減することです。'
          },
          {
            question: 'TCP/IPモデルでアプリケーション層に対応するプロトコルはどれか？',
            options: ['IP', 'TCP', 'HTTP', 'ARP'],
            correct: 2,
            explanation: 'HTTP、FTP、SMTP、DNSなどがTCP/IPモデルのアプリケーション層プロトコルです。'
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
          },
          {
            question: 'BGPの特徴として正しいものはどれか？',
            options: ['AS内ルーティングプロトコル', 'ディスタンスベクター型', 'パスベクター型', 'リンクステート型'],
            correct: 2,
            explanation: 'BGPはパスベクター型のルーティングプロトコルで、AS間のルーティングに使用されます。パス情報を基にルーティング決定を行います。'
          },
          {
            question: 'スイッチのMACアドレステーブルの学習方法として正しいものはどれか？',
            options: ['送信元MACアドレスを学習', '宛先MACアドレスを学習', '両方を同時に学習', 'IPアドレスから推測'],
            correct: 0,
            explanation: 'スイッチは受信フレームの送信元MACアドレスと受信ポートの組み合わせを学習し、MACアドレステーブルを構築します。'
          },
          {
            question: 'VLANトランクポートで使用されるプロトコルはどれか？',
            options: ['STP', 'VTP', 'IEEE 802.1Q', 'LACP'],
            correct: 2,
            explanation: 'IEEE 802.1Qは複数のVLANトラフィックを1つの物理リンクで伝送するためのタギング仕様です。'
          },
          {
            question: 'ルーティングテーブルのメトリック値が最も小さい経路の意味は何か？',
            options: ['最も遠い経路', '最も近い経路', '最も混雑した経路', '最も安全な経路'],
            correct: 1,
            explanation: 'メトリック値はルーティングプロトコルが経路の優先度を決定するための値で、通常は値が小さいほど優先度が高くなります。'
          },
          {
            question: 'VLANの利点として適切でないものはどれか？',
            options: ['セキュリティの向上', 'ブロードキャストドメインの分割', 'トラフィックの分離', '物理ケーブル数の削減'],
            correct: 3,
            explanation: 'VLANは論理的なネットワーク分割技術であり、物理ケーブル数には直接影響しません。物理的な配線は変わりません。'
          },
          {
            question: 'RSTPの改善点として正しいものはどれか？',
            options: ['ループ検出の高速化', '収束時間の短縮', 'セキュリティの強化', '設定の簡素化'],
            correct: 1,
            explanation: 'RSTP（Rapid Spanning Tree Protocol）は従来のSTPと比較して収束時間を大幅に短縮した改良版です。'
          },
          {
            question: 'ロードバランシングの手法として適切なものはどれか？',
            options: ['ラウンドロビン', 'フラッディング', 'ブロードキャスト', 'ユニキャスト'],
            correct: 0,
            explanation: 'ロードバランシングの手法には、ラウンドロビン、重み付き、最小接続数、レスポンス時間などがあります。'
          },
          {
            question: 'EIGRP（Enhanced IGRP）の特徴として正しいものはどれか？',
            options: ['オープンスタンダード', 'シスコ独自プロトコル', 'リンクステート型', 'ホップ数のみでメトリック計算'],
            correct: 1,
            explanation: 'EIGRPはシスコ独自のルーティングプロトコルで、帯域幅、遅延、信頼性、負荷などを組み合わせてメトリックを計算します。'
          },
          {
            question: 'レイヤ3スイッチの利点として適切なものはどれか？',
            options: ['設定の簡素化', 'ハードウェアによる高速ルーティング', 'コストの削減', '互換性の向上'],
            correct: 1,
            explanation: 'レイヤ3スイッチはASICを使用してハードウェアレベルでルーティング処理を行うため、ソフトウェアルーティングより高速です。'
          },
          {
            question: '動的ルーティングの利点として適切なものはどれか？',
            options: ['設定の簡素化', '自動的な経路変更', 'セキュリティの向上', 'コストの削減'],
            correct: 1,
            explanation: '動的ルーティングはネットワーク障害時に自動的に代替経路を発見し、ルーティングテーブルを更新します。'
          },
          {
            question: 'VLANタグヘッダのサイズは何バイトか？',
            options: ['2バイト', '4バイト', '6バイト', '8バイト'],
            correct: 1,
            explanation: 'IEEE 802.1QのVLANタグヘッダは4バイト（32ビット）で、VLAN IDを含む様々な情報が格納されます。'
          },
          {
            question: 'コンバージェンス時間とは何か？',
            options: ['パケット転送時間', 'ルーティングテーブル更新時間', 'ネットワーク障害復旧時間', '全ルータが一貫した経路情報を持つまでの時間'],
            correct: 3,
            explanation: 'コンバージェンス時間は、ネットワーク変更後にすべてのルータが一貫した経路情報を持つまでにかかる時間です。'
          },
          {
            question: 'VTPの役割として正しいものはどれか？',
            options: ['VLAN情報の一元管理', 'トランクポートの設定', 'STPの設定', 'ルーティング情報の管理'],
            correct: 0,
            explanation: 'VTP（VLAN Trunking Protocol）はスイッチ間でVLAN設定情報を同期し、一元管理を可能にします。'
          },
          {
            question: 'ルートブリッジの選出基準として正しいものはどれか？',
            options: ['最大のブリッジID', '最小のブリッジID', '最高の処理能力', '最多のポート数'],
            correct: 1,
            explanation: 'STPでは最小のブリッジIDを持つスイッチがルートブリッジとして選出されます。ブリッジIDは優先度とMACアドレスから構成されます。'
          },
          {
            question: 'HSRP（Hot Standby Router Protocol）の目的は何か？',
            options: ['ロードバランシング', 'ゲートウェイの冗長化', 'VLANの管理', 'QoSの実装'],
            correct: 1,
            explanation: 'HSRPは複数のルータで仮想的な一つのルータを構成し、デフォルトゲートウェイの冗長化を実現します。'
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
          },
          {
            question: 'IEEE 802.11nで導入された技術はどれか？',
            options: ['OFDM', 'MIMO', 'WPA2', '5GHz帯'],
            correct: 1,
            explanation: '802.11nではMIMO（Multiple Input Multiple Output）技術が導入され、複数のアンテナを使用して通信速度と信頼性を向上させました。'
          },
          {
            question: 'WPA3の主な改善点はどれか？',
            options: ['暗号化速度の向上', 'SAE認証の導入', '消費電力の削減', '通信距離の延長'],
            correct: 1,
            explanation: 'WPA3ではSAE（Simultaneous Authentication of Equals）認証が導入され、辞書攻撃に対する耐性が向上しました。'
          },
          {
            question: '2.4GHz帯の無線LANで重複しないチャネル数はいくつか？',
            options: ['1つ', '3つ', '11つ', '14つ'],
            correct: 1,
            explanation: '2.4GHz帯では1、6、11チャネルの3つが重複せずに使用できます。他のチャネルは隣接チャネルと干渉します。'
          },
          {
            question: 'Wi-Fi 6（802.11ax）の主な特徴はどれか？',
            options: ['OFDM採用', 'OFDMA採用', '2.4GHz専用', 'MIMO非対応'],
            correct: 1,
            explanation: 'Wi-Fi 6ではOFDMA（Orthogonal Frequency Division Multiple Access）を採用し、複数端末の同時効率的通信を実現しています。'
          },
          {
            question: '無線LANのビーコンフレームの役割は何か？',
            options: ['データ転送', 'エラー検出', 'ネットワーク情報の通知', '暗号化'],
            correct: 2,
            explanation: 'ビーコンフレームはアクセスポイントが定期的に送信し、SSID、対応規格、暗号化方式などのネットワーク情報を端末に通知します。'
          },
          {
            question: 'Bluetooth Low Energy（BLE）の特徴として正しいものはどれか？',
            options: ['高速データ転送', '省電力動作', '長距離通信', '高い処理能力要求'],
            correct: 1,
            explanation: 'BLEは従来のBluetoothと比較して大幅に消費電力を削減し、IoTデバイスなどで広く使用されています。'
          },
          {
            question: 'LTE（4G）で使用される多重化方式はどれか？',
            options: ['CDMA', 'TDMA', 'OFDMA', 'FDMA'],
            correct: 2,
            explanation: 'LTEでは下りリンクでOFDMA、上りリンクでSC-FDMAを使用し、高速データ通信を実現しています。'
          },
          {
            question: '5Gのネットワークスライシングの目的は何か？',
            options: ['通信速度の向上', '用途別ネットワークの仮想分割', '基地局数の削減', '消費電力の削減'],
            correct: 1,
            explanation: 'ネットワークスライシングにより、自動運転、IoT、VRなど異なる用途に最適化された仮想ネットワークを同一物理ネットワーク上に構築できます。'
          },
          {
            question: '無線LANのローミングで重要な要素はどれか？',
            options: ['同一SSID', '同一チャネル', '同一暗号化方式', '同一BSSID'],
            correct: 0,
            explanation: 'ローミングでは複数のアクセスポイントが同一SSIDと暗号化設定を持つことで、端末が自動的にアクセスポイント間を移動できます。'
          },
          {
            question: 'mmWave（ミリ波）の特徴として正しいものはどれか？',
            options: ['長距離伝搬', '障害物透過性が高い', '高速データ転送', '低周波数'],
            correct: 2,
            explanation: 'ミリ波は30-300GHzの高周波数帯で、5Gの高速通信に使用されますが、直進性が強く障害物の影響を受けやすい特徴があります。'
          },
          {
            question: 'Wi-Fiの認証方式でエンタープライズ環境に適しているものはどれか？',
            options: ['WPA2-PSK', 'WPA2-Enterprise', 'WEP', 'オープン認証'],
            correct: 1,
            explanation: 'WPA2-EnterpriseはRADIUSサーバと連携した802.1X認証を使用し、個別のユーザー認証とセキュリティ管理が可能です。'
          },
          {
            question: 'MIMOの利点として適切なものはどれか？',
            options: ['消費電力の削減', 'スループットの向上', '通信距離の延長', '設定の簡素化'],
            correct: 1,
            explanation: 'MIMOは複数のアンテナを使用して空間多重化を行い、スループットの向上と通信品質の改善を実現します。'
          },
          {
            question: 'NFCの通信距離はどの程度か？',
            options: ['約4cm', '約10m', '約100m', '約1km'],
            correct: 0,
            explanation: 'NFC（Near Field Communication）は約4cm以内の極近距離通信技術で、決済システムやアクセス制御に使用されます。'
          },
          {
            question: '無線LANのハンドオーバーとローミングの違いは何か？',
            options: ['技術的に同じ', 'ハンドオーバーは同一事業者内', 'ローミングは異なる事業者間', 'ローミングは無線LAN専用'],
            correct: 2,
            explanation: 'ハンドオーバーは同一ネットワーク内での基地局切り替え、ローミングは異なる事業者やネットワーク間での接続継続を指します。'
          },
          {
            question: 'Wi-Fi Directの特徴として正しいものはどれか？',
            options: ['アクセスポイント必須', '機器間直接通信', 'インターネット接続必須', '有線接続併用'],
            correct: 1,
            explanation: 'Wi-Fi Directはアクセスポイントを介さずに、Wi-Fi対応機器同士が直接通信できる技術です。'
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
          },
          {
            question: 'SNMPのバージョン3（v3）の主な改善点は何か？',
            options: ['通信速度の向上', 'セキュリティの強化', 'MIBの拡張', '互換性の向上'],
            correct: 1,
            explanation: 'SNMPv3では認証と暗号化機能が追加され、セキュアなネットワーク管理が可能になりました。'
          },
          {
            question: 'syslogの機能として正しいものはどれか？',
            options: ['パケットキャプチャ', 'ログメッセージの収集', 'トラフィック制御', 'ルーティング計算'],
            correct: 1,
            explanation: 'syslogは各種ネットワーク機器やサーバからのログメッセージを一元的に収集・管理するシステムです。'
          },
          {
            question: 'NetFlowの用途として適切なものはどれか？',
            options: ['パケットフィルタリング', 'トラフィック解析', 'ルート計算', 'DNS解決'],
            correct: 1,
            explanation: 'NetFlowはネットワークトラフィックの統計情報を収集し、フロー解析による帯域使用状況や通信パターンの分析に使用されます。'
          },
          {
            question: 'nslookupコマンドの機能は何か？',
            options: ['ルーティングテーブル表示', 'ARPテーブル表示', 'DNS問い合わせ', 'ポート状態確認'],
            correct: 2,
            explanation: 'nslookupはDNSサーバに対してドメイン名やIPアドレスの問い合わせを行い、名前解決の動作を確認するコマンドです。'
          },
          {
            question: 'ネットワーク遅延の原因として適切でないものはどれか？',
            options: ['伝搬遅延', '処理遅延', 'キューイング遅延', 'フラグメンテーション遅延'],
            correct: 3,
            explanation: 'ネットワーク遅延の主要因は伝搬遅延、処理遅延、キューイング遅延、伝送遅延です。フラグメンテーション遅延は直接的な遅延要因ではありません。'
          },
          {
            question: 'MRTG（Multi Router Traffic Grapher）の目的は何か？',
            options: ['ルーティング設定', 'トラフィック監視', 'セキュリティ管理', 'DNS管理'],
            correct: 1,
            explanation: 'MRTGはSNMPを使用してネットワーク機器のトラフィック情報を定期的に収集し、グラフ化してトラフィック推移を監視します。'
          },
          {
            question: 'パケットロス率の計算方法として正しいものはどれか？',
            options: ['(送信パケット数 - 受信パケット数) ÷ 送信パケット数', '受信パケット数 ÷ 送信パケット数', '送信パケット数 ÷ 受信パケット数', '(受信パケット数 - 送信パケット数) ÷ 受信パケット数'],
            correct: 0,
            explanation: 'パケットロス率は、送信したパケット数から受信されたパケット数を引いた値を送信パケット数で割って計算します。'
          },
          {
            question: 'QoSの実装方式として適切なものはどれか？',
            options: ['DiffServ', 'BGP', 'OSPF', 'STP'],
            correct: 0,
            explanation: 'DiffServ（Differentiated Services）はパケットにマーキングを行い、ネットワーク機器で優先制御を実現するQoS実装方式です。'
          },
          {
            question: 'ジッタ（Jitter）とは何か？',
            options: ['平均遅延時間', '遅延の変動', 'パケットロス率', 'スループット'],
            correct: 1,
            explanation: 'ジッタは遅延時間の変動のことで、音声やビデオ通信の品質に大きな影響を与えます。'
          },
          {
            question: 'TCPダンプの機能として正しいものはどれか？',
            options: ['TCP接続の確立', 'パケットキャプチャ', 'TCP設定の変更', 'TCPポートのスキャン'],
            correct: 1,
            explanation: 'TCPダンプはネットワークインターフェースを流れるパケットをキャプチャし、解析するためのツールです。'
          },
          {
            question: 'DNS逆引きの目的は何か？',
            options: ['ドメイン名からIPアドレスを取得', 'IPアドレスからドメイン名を取得', 'MXレコードの取得', 'NSレコードの取得'],
            correct: 1,
            explanation: 'DNS逆引きはIPアドレスから対応するドメイン名（PTRレコード）を取得する名前解決です。'
          },
          {
            question: 'ネットワーク機器の冗長化で一般的に使用される技術はどれか？',
            options: ['VRRP', 'SNMP', 'DHCP', 'DNS'],
            correct: 0,
            explanation: 'VRRP（Virtual Router Redundancy Protocol）は複数のルータで仮想ルータを構成し、ゲートウェイの冗長化を実現します。'
          },
          {
            question: 'BandwidthとThroughputの違いは何か？',
            options: ['同じ意味', 'Bandwidthは理論値、Throughputは実測値', 'Bandwidthは実測値、Throughputは理論値', '測定単位が異なる'],
            correct: 1,
            explanation: 'Bandwidth（帯域幅）は理論的な最大転送能力、Throughput（スループット）は実際に達成される転送速度を指します。'
          },
          {
            question: 'ネットワーク監視でSLAを測定する主な指標として適切でないものはどれか？',
            options: ['可用性', '応答時間', 'スループット', 'CPU使用率'],
            correct: 3,
            explanation: 'SLA（Service Level Agreement）では可用性、応答時間、スループットなどのネットワークサービス品質が重要で、CPU使用率は間接的な指標です。'
          },
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

  const totalQuizzes = learningModules.reduce((acc, module) =>
    acc + module.sections.reduce((sectionAcc, section) =>
      sectionAcc + section.quizzes.length, 0), 0);

  const quizProgress = (completedQuizzes.size / totalQuizzes) * 100;
  const progressPercentage = Math.round(quizProgress);

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

              {/* 統計情報 */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">学習統計</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">総問題数</span>
                    <span className="font-medium">{totalQuizzes}問</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">完了済み</span>
                    <span className="font-medium text-green-600">{completedQuizzes.size}問</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">正答率</span>
                    <span className="font-medium">{completedQuizzes.size > 0 ? Math.round(quizProgress) : 0}%</span>
                  </div>
                </div>
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