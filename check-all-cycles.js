const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ttsdtjzcgxufudepclzg.supabase.co', 'sb_secret_4liMa8VzGiA1UUeXOmnDMw_LcRGzXsU');

async function checkAllCycles() {
  const userId = '95099351-4b77-4353-8269-c69718d9a19f';

  const { data } = await supabase
    .from('user_learning_progress')
    .select('cycle_number')
    .eq('user_id', userId);

  const cycles = [...new Set(data?.map(d => d.cycle_number))].sort((a, b) => a - b);
  
  console.log('存在する周回:', cycles);
  console.log('');

  for (const cycle of cycles) {
    const { data: cycleData } = await supabase
      .from('user_learning_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('cycle_number', cycle);

    const total = cycleData?.length || 0;
    const hasAnswer = cycleData?.filter(r => r.answer_count > 0).length || 0;
    const totalAnswers = cycleData?.reduce((s, r) => s + r.answer_count, 0) || 0;

    console.log(`第${cycle}周目:`);
    console.log(`  レコード数: ${total}`);
    console.log(`  answer_count > 0: ${hasAnswer}`);
    console.log(`  総answer_count: ${totalAnswers}`);
    console.log('');
  }
}

checkAllCycles();
