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

async function createUser() {
  console.log('👤 Creating user without trigger...');
  
  try {
    // トリガーを一時的に無効化してユーザーを作成
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: 'gan.keyss3kfree2350@gmail.com',
      password: 'password123',
      email_confirm: true
    });

    if (userError) {
      console.log('❌ User creation failed:', userError.message);
      return false;
    }

    console.log('✅ User created in auth.users successfully');
    console.log('📧 Email:', userData.user.email);
    console.log('🆔 User ID:', userData.user.id);
    
    console.log('\n⚠️  Note: public.users table still needs to be created manually');
    console.log('   Then you can login with the credentials above');

    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

// 実行
createUser()
  .then(success => {
    if (success) {
      console.log('\n✅ User creation completed!');
      console.log('📝 Login credentials:');
      console.log('   Email: gan.keyss3kfree2350@gmail.com');
      console.log('   Password: password123');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Creation failed:', error);
    process.exit(1);
  });