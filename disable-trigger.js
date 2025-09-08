const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ttsdtjzcgxufudepclzg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0c2R0anpjZ3h1ZnVkZXBjbHpnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njk1MTcyOSwiZXhwIjoyMDcyNTI3NzI5fQ.Wkzm_rjE4gq8eI9WA0lokGLTPnav3PMP8no08iQMB-E';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function disableTriggerAndCreateUser() {
  console.log('🔧 Disabling problematic trigger...');
  
  try {
    // トリガーを削除するSQL
    const { data: dropResult, error: dropError } = await supabase
      .from('pg_trigger')
      .select('*')
      .limit(1);
      
    console.log('⚠️  Cannot execute DROP TRIGGER directly via client');
    console.log('🚀 Attempting user creation anyway...');

    // ユーザー作成を試行
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: 'gan.keyss3kfree2350@gmail.com',
      password: 'password123',
      email_confirm: true
    });

    if (userError) {
      console.log('❌ User creation failed:', userError.message);
      
      // エラーがトリガー関連の場合
      if (userError.message.includes('public.users') || userError.message.includes('handle_new_user')) {
        console.log('');
        console.log('💡 Solution: Please execute this SQL in SQL Editor:');
        console.log('   DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;');
        console.log('   DROP FUNCTION IF EXISTS handle_new_user() CASCADE;');
        console.log('');
        console.log('   Then run this script again.');
      }
      
      return false;
    }

    console.log('✅ User created successfully!');
    console.log('📧 Email:', userData.user.email);
    console.log('🆔 User ID:', userData.user.id);
    
    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

// 実行
disableTriggerAndCreateUser()
  .then(success => {
    if (success) {
      console.log('\n🎉 User creation successful!');
      console.log('📝 Login credentials:');
      console.log('   Email: gan.keyss3kfree2350@gmail.com');
      console.log('   Password: password123');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Failed:', error);
    process.exit(1);
  });