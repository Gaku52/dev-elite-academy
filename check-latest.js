const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ttsdtjzcgxufudepclzg.supabase.co', 'sb_secret_4liMa8VzGiA1UUeXOmnDMw_LcRGzXsU');

async function check() {
  const userId = '95099351-4b77-4353-8269-c69718d9a19f';
  
  const { data, error } = await supabase
    .from('user_learning_progress')
    .select('cycle_number')
    .eq('user_id', userId);

  const cycle1 = data?.filter(d => d.cycle_number === 1).length || 0;
  const cycle2 = data?.filter(d => d.cycle_number === 2).length || 0;
  
  console.log(`第1周目: ${cycle1}件`);
  console.log(`第2周目: ${cycle2}件`);
  console.log(`合計: ${data?.length}件`);
}
check();
