const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ttsdtjzcgxufudepclzg.supabase.co', 'sb_secret_4liMa8VzGiA1UUeXOmnDMw_LcRGzXsU');

async function recheck() {
  const userId = '95099351-4b77-4353-8269-c69718d9a19f';

  const { data: max1 } = await supabase
    .from('user_learning_progress')
    .select('cycle_number')
    .eq('user_id', userId)
    .order('cycle_number', { ascending: false })
    .limit(1);

  console.log('クエリ1（最大周回）:', max1);

  const { data: all } = await supabase
    .from('user_learning_progress')
    .select('cycle_number')
    .eq('user_id', userId);

  const unique = [...new Set(all?.map(d => d.cycle_number))].sort();
  console.log('ユニーク周回:', unique);
  console.log('最大値:', Math.max(...unique));

  // 第2周目のレコード数を再確認
  const { data: cycle2 } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('cycle_number', 2);

  console.log('\n第2周目:');
  console.log('  レコード数:', cycle2?.length);
  console.log('  answer_count > 0:', cycle2?.filter(r => r.answer_count > 0).length);
}

recheck();
