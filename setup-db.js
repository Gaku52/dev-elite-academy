const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY in .env.local');
  process.exit(1);
}

// Service roleでSupabaseクライアント作成（admin権限）
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('🔧 Setting up database...');

  // 1. public.usersテーブル作成
  console.log('📝 Creating public.users table...');
  const { data: tableResult, error: tableError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS public.users (
        id uuid REFERENCES auth.users ON DELETE CASCADE,
        auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
        email text,
        full_name text,
        avatar_url text,
        created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
        PRIMARY KEY (id)
      );
      
      ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
      
      DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
      CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
      
      DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
      CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
    `
  });

  if (tableError) {
    console.log('⚠️  Table creation via RPC failed, trying direct SQL...');
    
    // 直接SQLを実行
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'users')
      .eq('table_schema', 'public');

    if (!data || data.length === 0) {
      console.log('❌ Table does not exist and cannot be created via client');
      console.log('Please create the table manually in SQL Editor');
      return false;
    }
  } else {
    console.log('✅ Table created successfully');
  }

  // 2. トリガー関数を修正
  console.log('🔧 Setting up trigger function...');
  const { data: triggerResult, error: triggerError } = await supabase.rpc('exec_sql', {
    sql: `
      DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
      
      CREATE OR REPLACE FUNCTION handle_new_user()
      RETURNS trigger AS $$
      BEGIN
        INSERT INTO public.users (id, auth_user_id, email, full_name, avatar_url)
        VALUES (
          NEW.id,
          NEW.id,
          NEW.email,
          COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
          NEW.raw_user_meta_data->>'avatar_url'
        );
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
      
      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION handle_new_user();
    `
  });

  if (triggerError) {
    console.log('⚠️  Trigger setup failed:', triggerError.message);
  } else {
    console.log('✅ Trigger function created successfully');
  }

  // 3. ユーザー作成
  console.log('👤 Creating user...');
  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email: 'gan.keyss3kfree2350@gmail.com',
    password: 'password123',
    email_confirm: true
  });

  if (userError) {
    console.log('❌ User creation failed:', userError.message);
    return false;
  } else {
    console.log('✅ User created successfully:', userData.user.email);
    console.log('📧 User ID:', userData.user.id);
  }

  console.log('🎉 Database setup completed!');
  return true;
}

// 実行
setupDatabase()
  .then(success => {
    if (success) {
      console.log('\n✅ Setup completed successfully!');
      console.log('You can now login with:');
      console.log('Email: gan.keyss3kfree2350@gmail.com');
      console.log('Password: password123');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  });