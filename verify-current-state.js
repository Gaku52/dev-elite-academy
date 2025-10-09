const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ttsdtjzcgxufudepclzg.supabase.co', 'sb_secret_4liMa8VzGiA1UUeXOmnDMw_LcRGzXsU');

async function verifyCurrentState() {
  const userId = '95099351-4b77-4353-8269-c69718d9a19f';

  console.log('=== 現在のデータベース状態 ===\n');

  // 第1周目
  const { data: cycle1 } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('cycle_number', 1);

  const c1Unique = new Set(cycle1?.filter(r => r.answer_count > 0).map(r => r.section_key));
  console.log('第1周目:');
  console.log(`  総レコード: 876`);
  console.log(`  ユニーク完了: ${c1Unique.size}/876 = ${Math.round(c1Unique.size/876*100)}%`);

  // 第2周目
  const { data: cycle2 } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('cycle_number', 2);

  const c2Unique = new Set(cycle2?.filter(r => r.answer_count > 0).map(r => r.section_key));
  console.log('\n第2周目:');
  console.log(`  総レコード: 876`);
  console.log(`  ユニーク完了: ${c2Unique.size}/876 = ${Math.round(c2Unique.size/876*100)}%`);

  // APIが返すデータ
  console.log('\n=== APIの動作確認 ===\n');
  
  const { data: maxCycle } = await supabase
    .from('user_learning_progress')
    .select('cycle_number')
    .eq('user_id', userId)
    .order('cycle_number', { ascending: false })
    .limit(1);

  console.log(`最大周回番号: ${maxCycle?.[0]?.cycle_number}`);

  const currentCycle = maxCycle?.[0]?.cycle_number || 1;
  const { data: apiData } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('cycle_number', currentCycle);

  const apiUnique = new Set(apiData?.filter(r => r.answer_count > 0).map(r => r.section_key));
  console.log(`/api/learning-progress (GET) 返却データ: 第${currentCycle}周目`);
  console.log(`  ユニーク完了: ${apiUnique.size}/876 = ${Math.round(apiUnique.size/876*100)}%`);

  console.log('\n=== 期待される表示 ===\n');
  console.log('/modules/it-fundamentals:');
  console.log(`  第${currentCycle}周目の進捗: ${Math.round(apiUnique.size/876*100)}%`);
  console.log('\n/learning-stats:');
  console.log(`  第1周目: 100%`);
  console.log(`  第2周目: ${Math.round(c2Unique.size/876*100)}% (現在)`);
}

verifyCurrentState();
