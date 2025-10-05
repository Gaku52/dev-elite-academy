const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ttsdtjzcgxufudepclzg.supabase.co', 'sb_secret_4liMa8VzGiA1UUeXOmnDMw_LcRGzXsU');

async function debug() {
  const userId = '95099351-4b77-4353-8269-c69718d9a19f';
  
  const { data: cycle2, count, error } = await supabase
    .from('user_learning_progress')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .eq('cycle_number', 2);

  console.log('Error:', error);
  console.log('Count:', count);
  console.log('Data length:', cycle2?.length);
  console.log('\nFirst 5 records:');
  cycle2?.slice(0, 5).forEach(r => {
    console.log(`  ${r.module_name}/${r.section_key}: answer_count=${r.answer_count}`);
  });
}
debug();
