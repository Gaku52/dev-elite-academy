const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ttsdtjzcgxufudepclzg.supabase.co', 'sb_secret_4liMa8VzGiA1UUeXOmnDMw_LcRGzXsU');

async function compareSectionKeys() {
  const userId = '95099351-4b77-4353-8269-c69718d9a19f';

  const { data: cycle1 } = await supabase
    .from('user_learning_progress')
    .select('section_key, module_name')
    .eq('user_id', userId)
    .eq('cycle_number', 1);

  const { data: cycle2 } = await supabase
    .from('user_learning_progress')
    .select('section_key, module_name')
    .eq('user_id', userId)
    .eq('cycle_number', 2);

  const c1Keys = new Set(cycle1?.map(r => `${r.module_name}::${r.section_key}`));
  const c2Keys = new Set(cycle2?.map(r => `${r.module_name}::${r.section_key}`));

  const c1SectionOnly = new Set(cycle1?.map(r => r.section_key));
  const c2SectionOnly = new Set(cycle2?.map(r => r.section_key));

  console.log('第1周目:');
  console.log('  総レコード:', cycle1?.length);
  console.log('  module::section ユニーク:', c1Keys.size);
  console.log('  section のみユニーク:', c1SectionOnly.size);

  console.log('\n第2周目:');
  console.log('  総レコード:', cycle2?.length);
  console.log('  module::section ユニーク:', c2Keys.size);
  console.log('  section のみユニーク:', c2SectionOnly.size);

  console.log('\n第2周目が正しいデータ構造を持っている場合:');
  console.log('  第2周目のデータをベースに第1周目を再構築すべき');
}

compareSectionKeys();
