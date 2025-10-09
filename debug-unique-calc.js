const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ttsdtjzcgxufudepclzg.supabase.co', 'sb_secret_4liMa8VzGiA1UUeXOmnDMw_LcRGzXsU');

async function debugUniqueCalc() {
  const userId = '95099351-4b77-4353-8269-c69718d9a19f';

  const { data: cycle1 } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('cycle_number', 1);

  console.log('総レコード数:', cycle1?.length);
  console.log('answer_count > 0:', cycle1?.filter(r => r.answer_count > 0).length);

  const unique1 = new Set(cycle1?.map(r => r.section_key));
  console.log('\nsection_keyのユニーク数:', unique1.size);

  const unique2 = new Set(cycle1?.filter(r => r.answer_count > 0).map(r => r.section_key));
  console.log('answer_count > 0 のsection_keyユニーク数:', unique2.size);

  // これがverify-current-state.jsで使われているロジック
  const c1Unique = new Set(cycle1?.filter(r => r.answer_count > 0).map(r => r.section_key));
  console.log('\nverify-current-state.jsのロジック:', c1Unique.size);

  // すべてのanswer_countを確認
  const answerCounts = cycle1?.map(r => r.answer_count);
  const min = Math.min(...answerCounts);
  const max = Math.max(...answerCounts);
  console.log('\nanswer_count 範囲:', min, '~', max);
  console.log('answer_count = 0 の数:', answerCounts.filter(c => c === 0).length);
}

debugUniqueCalc();
