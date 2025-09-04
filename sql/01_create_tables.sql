-- Dev Elite Academy Database Schema
-- Created for Supabase PostgreSQL

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types (enums)
CREATE TYPE skill_level AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
CREATE TYPE content_type AS ENUM ('ARTICLE', 'VIDEO', 'QUIZ', 'EXERCISE', 'FLASHCARD');
CREATE TYPE difficulty AS ENUM ('EASY', 'MEDIUM', 'HARD');
CREATE TYPE progress_status AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- ユーザープロフィール
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    skill_level skill_level DEFAULT 'BEGINNER',
    target_certifications TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 学習カテゴリー
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 学習コンテンツ
CREATE TABLE learning_contents (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content_type content_type NOT NULL,
    content_body JSONB NOT NULL DEFAULT '{}',
    difficulty difficulty NOT NULL,
    estimated_time INTEGER NOT NULL DEFAULT 0, -- 分単位
    tags TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ユーザー学習進捗
CREATE TABLE user_progress (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content_id INTEGER REFERENCES learning_contents(id) ON DELETE CASCADE,
    status progress_status DEFAULT 'NOT_STARTED',
    score NUMERIC(5,2), -- 0.00-100.00
    time_spent INTEGER DEFAULT 0, -- 分単位
    attempts INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, content_id)
);

-- 学習計画
CREATE TABLE study_plans (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id),
    title TEXT NOT NULL,
    description TEXT,
    target_date TIMESTAMPTZ NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 学習計画とコンテンツの中間テーブル
CREATE TABLE study_plan_contents (
    id SERIAL PRIMARY KEY,
    study_plan_id INTEGER REFERENCES study_plans(id) ON DELETE CASCADE,
    content_id INTEGER REFERENCES learning_contents(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(study_plan_id, content_id)
);

-- 達成記録
CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- "completion", "streak", "score", etc.
    title TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    earned_at TIMESTAMPTZ DEFAULT NOW()
);

-- 学習セッション（時間追跡用）
CREATE TABLE study_sessions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    duration INTEGER NOT NULL, -- 分単位
    content_ids INTEGER[] DEFAULT '{}', -- 学習したコンテンツのID配列
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックスの作成（パフォーマンス最適化）
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_learning_contents_category ON learning_contents(category_id);
CREATE INDEX idx_learning_contents_published ON learning_contents(is_published);
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_content ON user_progress(content_id);
CREATE INDEX idx_user_progress_status ON user_progress(status);
CREATE INDEX idx_study_plans_user ON study_plans(user_id);
CREATE INDEX idx_study_sessions_user ON study_sessions(user_id);
CREATE INDEX idx_achievements_user ON achievements(user_id);

-- RLSポリシーの設定（セキュリティ）
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plan_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

-- プロフィール：ユーザーは自分のデータのみ操作可能
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 学習進捗：ユーザーは自分の進捗のみ操作可能
CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON user_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 学習計画：ユーザーは自分の計画のみ操作可能
CREATE POLICY "Users can view own study plans" ON study_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own study plans" ON study_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own study plans" ON study_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own study plans" ON study_plans FOR DELETE USING (auth.uid() = user_id);

-- 学習計画コンテンツ：所有者のみ操作可能
CREATE POLICY "Users can manage own study plan contents" ON study_plan_contents 
FOR ALL USING (
    auth.uid() = (SELECT user_id FROM study_plans WHERE id = study_plan_id)
);

-- 達成記録：ユーザーは自分の達成記録のみ参照・追加可能
CREATE POLICY "Users can view own achievements" ON achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements" ON achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 学習セッション：ユーザーは自分のセッションのみ操作可能
CREATE POLICY "Users can view own sessions" ON study_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON study_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON study_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 公開コンテンツは全ユーザーが閲覧可能
CREATE POLICY "Published content is viewable by everyone" ON learning_contents 
FOR SELECT USING (is_published = true);

-- カテゴリは全ユーザーが閲覧可能
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);

-- 自動更新トリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_atの自動更新トリガー
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_learning_contents_updated_at BEFORE UPDATE ON learning_contents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_study_plans_updated_at BEFORE UPDATE ON study_plans 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();