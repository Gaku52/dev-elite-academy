const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ttsdtjzcgxufudepclzg.supabase.co', 'sb_secret_4liMa8VzGiA1UUeXOmnDMw_LcRGzXsU');

async function checkCycle1() {
  const userId = '95099351-4b77-4353-8269-c69718d9a19f';

  const { data: cycle1, count } = await supabase
    .from('user_learning_progress')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .eq('cycle_number', 1);

  console.log('第1周目の総レコード数:', count);
  console.log('answer_count > 0:', cycle1?.filter(r => r.answer_count > 0).length);
  console.log('is_completed = true:', cycle1?.filter(r => r.is_completed).length);

  // 第2周目と比較
  const { data: cycle2 } = await supabase
    .from('user_learning_progress')
    .select('section_key, module_name')
    .eq('user_id', userId)
    .eq('cycle_number', 2);

  const cycle1Keys = new Set(cycle1?.map(r => `${r.module_name}::${r.section_key}`));
  const cycle2Keys = new Set(cycle2?.map(r => `${r.module_name}::${r.section_key}`));

  const inCycle2NotInCycle1 = Array.from(cycle2Keys).filter(k => !cycle1Keys.has(k));
  
  console.log('\n第2周目にあるが第1周目にないレコード:', inCycle2NotInCycle1.length);
  if (inCycle2NotInCycle1.length > 0) {
    console.log('サンプル:');
    inCycle2NotInCycle1.slice(0, 10).forEach(k => console.log('  ', k));
  }
}

checkCycle1();
