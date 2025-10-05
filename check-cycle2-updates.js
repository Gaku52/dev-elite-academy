const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ttsdtjzcgxufudepclzg.supabase.co';
const supabaseServiceKey = 'sb_secret_4liMa8VzGiA1UUeXOmnDMw_LcRGzXsU';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkCycle2Updates() {
  const userId = '95099351-4b77-4353-8269-c69718d9a19f';

  // 第1周目のレコードで最近更新されたものを確認
  const { data: cycle1Recent } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('cycle_number', 1)
    .order('updated_at', { ascending: false })
    .limit(10);

  console.log('第1周目の最近更新されたレコード（上位10件）:');
  cycle1Recent?.forEach((r, i) => {
    console.log(`  ${i+1}. ${r.module_name}/${r.section_key}: answer_count=${r.answer_count}, updated_at=${r.updated_at}`);
  });

  // 第2周目のレコードで最近更新されたものを確認
  const { data: cycle2Recent } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('cycle_number', 2)
    .order('updated_at', { ascending: false })
    .limit(10);

  console.log('\n第2周目の最近更新されたレコード（上位10件）:');
  cycle2Recent?.forEach((r, i) => {
    console.log(`  ${i+1}. ${r.module_name}/${r.section_key}: answer_count=${r.answer_count}, updated_at=${r.updated_at}`);
  });

  // 第1周目と第2周目の同じsection_keyのデータを比較
  const { data: cycle1All } = await supabase
    .from('user_learning_progress')
    .select('section_key, module_name, answer_count, updated_at')
    .eq('user_id', userId)
    .eq('cycle_number', 1);

  const { data: cycle2All } = await supabase
    .from('user_learning_progress')
    .select('section_key, module_name, answer_count, updated_at')
    .eq('user_id', userId)
    .eq('cycle_number', 2);

  console.log('\n同じsection_keyの比較（第2周目が作成されているもの）:');
  cycle2All?.slice(0, 5).forEach(c2 => {
    const c1 = cycle1All?.find(c => c.section_key === c2.section_key && c.module_name === c2.module_name);
    if (c1) {
      console.log(`  ${c2.module_name}/${c2.section_key}:`);
      console.log(`    第1周目: answer_count=${c1.answer_count}, updated=${c1.updated_at}`);
      console.log(`    第2周目: answer_count=${c2.answer_count}, updated=${c2.updated_at}`);
    }
  });
}

checkCycle2Updates();
