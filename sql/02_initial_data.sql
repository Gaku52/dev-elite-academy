-- Dev Elite Academy 初期データ投入
-- カテゴリー、サンプルコンテンツの作成

-- 学習カテゴリーの初期データ
INSERT INTO categories (name, description, icon, color, sort_order) VALUES
('基本情報技術者試験', '情報技術の基礎知識を体系的に学習', '📚', '#3B82F6', 1),
('応用情報技術者試験', '情報技術の応用知識とマネジメント', '🎓', '#10B981', 2),
('AWS認定', 'Amazon Web Servicesのクラウドサービス', '☁️', '#FF6B35', 3),
('Azure認定', 'Microsoft Azureのクラウドプラットフォーム', '🔵', '#0078D4', 4),
('GCP認定', 'Google Cloud Platformの認定資格', '🌟', '#4285F4', 5),
('ネットワークスペシャリスト', 'ネットワーク技術の専門知識', '🌐', '#8B5CF6', 6),
('情報セキュリティスペシャリスト', 'セキュリティ技術と管理', '🔒', '#EF4444', 7),
('データベーススペシャリスト', 'データベース設計と管理', '🗄️', '#059669', 8),
('AI・機械学習', '人工知能と機械学習の基礎', '🤖', '#F59E0B', 9),
('プログラミング基礎', 'プログラミング言語の基礎', '💻', '#6366F1', 10);

-- 基本情報技術者試験のサンプルコンテンツ
INSERT INTO learning_contents (category_id, title, description, content_type, content_body, difficulty, estimated_time, tags, is_published) VALUES
(1, 'コンピュータの基礎知識', 'コンピュータの仕組みと基本的な動作原理', 'ARTICLE', 
'{"sections": [{"title": "CPUの役割", "content": "中央処理装置（CPU）はコンピュータの頭脳として..."}, {"title": "メモリの種類", "content": "主記憶装置と補助記憶装置の違いについて..."}]}', 
'EASY', 30, ARRAY['CPU', 'メモリ', '基礎'], true),

(1, '2進数と論理演算', '数値表現と基本的な論理演算', 'QUIZ', 
'{"questions": [{"question": "10進数の25を2進数で表すと？", "options": ["11001", "10101", "11010", "10011"], "correct": 0, "explanation": "25 = 16 + 8 + 1 = 2^4 + 2^3 + 2^0 = 11001"}]}', 
'MEDIUM', 45, ARRAY['2進数', '論理演算'], true),

(1, 'データ構造の基礎', '配列、スタック、キューの概念', 'VIDEO', 
'{"video_url": "https://example.com/data-structures", "transcript": "データ構造は...", "key_points": ["配列の特徴", "スタックのLIFO", "キューのFIFO"]}', 
'MEDIUM', 60, ARRAY['データ構造', 'アルゴリズム'], true),

-- AWS認定のサンプルコンテンツ
(3, 'AWS基礎概念', 'AWSクラウドサービスの基本概念', 'ARTICLE', 
'{"sections": [{"title": "リージョンとアベイラビリティゾーン", "content": "AWSは世界中にリージョンを配置..."}, {"title": "主要サービス概要", "content": "EC2, S3, RDSなどの基本サービス..."}]}', 
'EASY', 40, ARRAY['AWS', 'クラウド', '基礎'], true),

(3, 'EC2インスタンス管理', 'EC2インスタンスの作成と管理', 'EXERCISE', 
'{"steps": [{"step": 1, "instruction": "AWS管理コンソールにログイン", "expected_outcome": "ダッシュボードが表示される"}, {"step": 2, "instruction": "EC2サービスを選択", "expected_outcome": "EC2ダッシュボードが表示される"}]}', 
'MEDIUM', 90, ARRAY['EC2', '実習'], true),

-- AI・機械学習のサンプルコンテンツ
(9, 'Claude Codeの基本操作', 'Claude Codeを使った効率的な開発手法', 'ARTICLE', 
'{"sections": [{"title": "Claude Codeとは", "content": "AIペアプログラミングツール..."}, {"title": "基本コマンド", "content": "/help, /new, /edit, /fix などの使い方..."}]}', 
'EASY', 20, ARRAY['Claude Code', 'AI', '開発効率'], true),

(9, '機械学習の基礎理論', '教師あり学習と教師なし学習', 'QUIZ', 
'{"questions": [{"question": "教師あり学習の特徴として正しいものは？", "options": ["正解データが不要", "正解データが必要", "データが不要", "アルゴリズムが不要"], "correct": 1, "explanation": "教師あり学習では、入力データと正解データのペアを使って学習します"}]}', 
'MEDIUM', 35, ARRAY['機械学習', '教師あり学習'], true),

-- プログラミング基礎のサンプルコンテンツ
(10, 'JavaScript基礎', 'JavaScript言語の基本文法', 'ARTICLE', 
'{"sections": [{"title": "変数の宣言", "content": "let, const, varの違い..."}, {"title": "関数の定義", "content": "function宣言とアロー関数..."}]}', 
'EASY', 50, ARRAY['JavaScript', 'プログラミング', '基礎'], true),

(10, 'React入門', 'Reactライブラリの基本概念', 'EXERCISE', 
'{"steps": [{"step": 1, "instruction": "create-react-appでプロジェクト作成", "code": "npx create-react-app my-app"}, {"step": 2, "instruction": "コンポーネントの作成", "code": "function HelloWorld() { return <h1>Hello World!</h1>; }"}]}', 
'MEDIUM', 120, ARRAY['React', 'JavaScript', 'フロントエンド'], true),

-- フラッシュカードのサンプル
(1, '基本情報 重要用語集', '試験によく出る重要用語のフラッシュカード', 'FLASHCARD', 
'{"cards": [{"front": "CPU", "back": "Central Processing Unit - 中央処理装置。コンピュータの演算・制御を行う中心部品"}, {"front": "OS", "back": "Operating System - 基本ソフトウェア。ハードウェアとアプリケーションの仲介役"}, {"front": "API", "back": "Application Programming Interface - ソフトウェア間でデータをやり取りするための仕組み"}]}', 
'EASY', 15, ARRAY['用語', '暗記', '基本情報'], true);

-- サンプルユーザープロフィール（テスト用）
-- 注意: 実際の本番環境では、認証システム経由でのみプロフィールが作成されるべき
INSERT INTO profiles (id, email, username, full_name, skill_level, target_certifications) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'test@example.com', 'testuser', 'テストユーザー', 'BEGINNER', ARRAY['基本情報技術者試験', 'AWS認定']);

-- サンプル学習進捗
INSERT INTO user_progress (user_id, content_id, status, score, time_spent, attempts) VALUES
('550e8400-e29b-41d4-a716-446655440000', 1, 'COMPLETED', 85.0, 25, 1),
('550e8400-e29b-41d4-a716-446655440000', 2, 'IN_PROGRESS', 70.0, 30, 2),
('550e8400-e29b-41d4-a716-446655440000', 3, 'NOT_STARTED', NULL, 0, 0);

-- サンプル学習計画
INSERT INTO study_plans (user_id, category_id, title, description, target_date) VALUES
('550e8400-e29b-41d4-a716-446655440000', 1, '基本情報技術者試験 合格計画', '2024年春期試験に向けた学習計画', '2024-04-21 09:00:00+09'),
('550e8400-e29b-41d4-a716-446655440000', 3, 'AWS SAA取得計画', 'AWS Solutions Architect Associate 認定取得', '2024-06-30 23:59:59+09');

-- 学習計画とコンテンツの紐付け
INSERT INTO study_plan_contents (study_plan_id, content_id, sort_order) VALUES
(1, 1, 1),
(1, 2, 2),
(1, 3, 3),
(1, 11, 4),
(2, 4, 1),
(2, 5, 2);

-- サンプル達成記録
INSERT INTO achievements (user_id, type, title, description, icon_url) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'completion', '初回コンテンツ完了', '最初の学習コンテンツを完了しました', '🎉'),
('550e8400-e29b-41d4-a716-446655440000', 'streak', '3日連続学習', '3日間連続で学習を行いました', '🔥');

-- サンプル学習セッション
INSERT INTO study_sessions (user_id, start_time, end_time, duration, content_ids) VALUES
('550e8400-e29b-41d4-a716-446655440000', '2024-01-15 10:00:00+09', '2024-01-15 10:30:00+09', 30, ARRAY[1]),
('550e8400-e29b-41d4-a716-446655440000', '2024-01-16 14:00:00+09', '2024-01-16 15:15:00+09', 75, ARRAY[2, 3]);