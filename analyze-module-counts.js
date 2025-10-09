const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ttsdtjzcgxufudepclzg.supabase.co', 'sb_secret_4liMa8VzGiA1UUeXOmnDMw_LcRGzXsU');

async function analyzeModuleCounts() {
  const userId = '95099351-4b77-4353-8269-c69718d9a19f';

  console.log('=== モジュール別レコード数の分析 ===\n');

  const { data: cycle1 } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('cycle_number', 1);

  const { data: cycle2 } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('cycle_number', 2);

  const modules = ['computer-systems', 'algorithms-programming', 'database', 'network', 'security', 'system-development', 'management-legal', 'strategy'];

  console.log('モジュール別のレコード数比較:\n');

  const c1ByModule = {};
  const c2ByModule = {};

  for (const module of modules) {
    c1ByModule[module] = cycle1.filter(r => r.module_name === module);
    c2ByModule[module] = cycle2.filter(r => r.module_name === module);

    console.log(`${module}:`);
    console.log(`  第1周目: ${c1ByModule[module].length} レコード`);
    console.log(`  第2周目: ${c2ByModule[module].length} レコード ${c1ByModule[module].length === c2ByModule[module].length ? '✅' : '❌'}`);
  }

  console.log('\n合計:');
  console.log(`  第1周目: ${cycle1.length} レコード`);
  console.log(`  第2周目: ${cycle2.length} レコード`);

  // どのsection_keyが第2周目に存在しないか
  console.log('\n第1周目のレコードで第2周目に存在しないもの:\n');
  for (const module of modules) {
    const c1Keys = new Set(c1ByModule[module].map(r => r.section_key));
    const c2Keys = new Set(c2ByModule[module].map(r => r.section_key));

    const missing = [...c1Keys].filter(k => !c2Keys.has(k));
    if (missing.length > 0) {
      console.log(`${module}: ${missing.length} 件不足`);
      console.log(`  サンプル: ${missing.slice(0, 5).join(', ')}`);
    }
  }

  // 逆に第2周目にあって第1周目にないもの
  console.log('\n第2周目のレコードで第1周目に存在しないもの:\n');
  for (const module of modules) {
    const c1Keys = new Set(c1ByModule[module].map(r => r.section_key));
    const c2Keys = new Set(c2ByModule[module].map(r => r.section_key));

    const extra = [...c2Keys].filter(k => !c1Keys.has(k));
    if (extra.length > 0) {
      console.log(`${module}: ${extra.length} 件余分`);
      console.log(`  サンプル: ${extra.slice(0, 5).join(', ')}`);
    }
  }

  console.log('\n=== 結論 ===');
  console.log('第1周目と第2周目で異なるsection_keyのセットを持っています。');
  console.log('これは周回システムとしては正しくありません。');
  console.log('正しい状態: 両周回とも同じ876個の section_key を持つべき');
}

analyzeModuleCounts();
