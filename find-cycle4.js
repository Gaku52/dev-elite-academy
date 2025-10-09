const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ttsdtjzcgxufudepclzg.supabase.co', 'sb_secret_4liMa8VzGiA1UUeXOmnDMw_LcRGzXsU');

async function findCycle4() {
  const userId = '95099351-4b77-4353-8269-c69718d9a19f';

  // cycle_number >= 3 のレコードを探す
  const { data: cycle3Plus } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .gte('cycle_number', 3);

  console.log('cycle_number >= 3 のレコード:', cycle3Plus?.length);
  
  if (cycle3Plus && cycle3Plus.length > 0) {
    console.log('\nサンプル:');
    cycle3Plus.slice(0, 10).forEach((r, i) => {
      console.log(`  ${i+1}. cycle=${r.cycle_number}, ${r.module_name}/${r.section_key}, answer_count=${r.answer_count}`);
    });

    const byCycle = {};
    cycle3Plus.forEach(r => {
      byCycle[r.cycle_number] = (byCycle[r.cycle_number] || 0) + 1;
    });
    console.log('\n周回別:');
    Object.entries(byCycle).forEach(([c, count]) => {
      console.log(`  第${c}周目: ${count}件`);
    });
  }
}

findCycle4();
