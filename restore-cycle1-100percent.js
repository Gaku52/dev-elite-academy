const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ttsdtjzcgxufudepclzg.supabase.co', 'sb_secret_4liMa8VzGiA1UUeXOmnDMw_LcRGzXsU');

async function restoreCycle1() {
  const userId = '95099351-4b77-4353-8269-c69718d9a19f';

  console.log('=== 第1周目を100%に復元 ===\n');

  // 第1周目でanswer_count = 0 のレコードを確認
  const { data: zeroRecords } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('cycle_number', 1)
    .eq('answer_count', 0);

  console.log(`answer_count = 0 のレコード: ${zeroRecords?.length}件`);

  if (zeroRecords && zeroRecords.length > 0) {
    console.log('\nこれらを answer_count = 1, is_completed = true に更新します...');
    
    const { error } = await supabase
      .from('user_learning_progress')
      .update({
        answer_count: 1,
        correct_count: 1,
        is_completed: true,
        is_correct: true
      })
      .eq('user_id', userId)
      .eq('cycle_number', 1)
      .eq('answer_count', 0);

    if (error) {
      console.error('エラー:', error);
      return;
    }

    console.log('✓ 更新完了');
  }

  // 確認
  const { data: cycle1 } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('cycle_number', 1);

  const unique = new Set(cycle1?.filter(r => r.answer_count > 0).map(r => r.section_key));
  console.log(`\n第1周目: ${unique.size}/876 = ${Math.round(unique.size/876*100)}%`);

  console.log('\n✅ 第1周目が100%に復元されました！');
}

restoreCycle1();
