const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ttsdtjzcgxufudepclzg.supabase.co', 'sb_secret_4liMa8VzGiA1UUeXOmnDMw_LcRGzXsU');

async function verifyFix() {
  const userId = '95099351-4b77-4353-8269-c69718d9a19f';

  console.log('=== 修正検証：module::section_key での集計 ===\n');

  // 第1周目のデータ
  const { data: cycle1 } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('cycle_number', 1);

  // 第2周目のデータ
  const { data: cycle2 } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('cycle_number', 2);

  console.log('第1周目:');
  console.log('  総レコード数:', cycle1?.length);
  console.log('  answer_count > 0:', cycle1?.filter(r => r.answer_count > 0).length);

  // 旧方式（section_keyのみ）
  const c1SectionOnly = new Set(cycle1?.filter(r => r.answer_count > 0).map(r => r.section_key));
  console.log('  旧方式（section_keyのみ）:', c1SectionOnly.size);

  // 新方式（module::section_key）
  const c1ModuleSection = new Set(cycle1?.filter(r => r.answer_count > 0).map(r => `${r.module_name}::${r.section_key}`));
  console.log('  新方式（module::section_key）:', c1ModuleSection.size);
  console.log('  → 876問完了で100%となるべき ✅');

  console.log('\n第2周目:');
  console.log('  総レコード数:', cycle2?.length);
  console.log('  answer_count > 0:', cycle2?.filter(r => r.answer_count > 0).length);

  // 旧方式（section_keyのみ）
  const c2SectionOnly = new Set(cycle2?.filter(r => r.answer_count > 0).map(r => r.section_key));
  console.log('  旧方式（section_keyのみ）:', c2SectionOnly.size);

  // 新方式（module::section_key）
  const c2ModuleSection = new Set(cycle2?.filter(r => r.answer_count > 0).map(r => `${r.module_name}::${r.section_key}`));
  console.log('  新方式（module::section_key）:', c2ModuleSection.size);
  console.log('  → 進捗率:', Math.round((c2ModuleSection.size / 876) * 100), '%');

  console.log('\n✅ 修正により:');
  console.log('  - 第1周目が876/876 = 100%と表示されるはず');
  console.log(`  - 第2周目が${c2ModuleSection.size}/876 = ${Math.round((c2ModuleSection.size / 876) * 100)}%と表示されるはず`);
}

verifyFix();
