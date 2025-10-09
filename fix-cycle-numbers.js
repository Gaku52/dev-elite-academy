const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ttsdtjzcgxufudepclzg.supabase.co', 'sb_secret_4liMa8VzGiA1UUeXOmnDMw_LcRGzXsU');

async function fixCycleNumbers() {
  const userId = '95099351-4b77-4353-8269-c69718d9a19f';

  console.log('=== 周回番号の修正 ===\n');

  // 現在の第2周目を削除（すべてanswer_count=0なので不要）
  console.log('1. 第2周目（空データ）を削除中...');
  const { error: deleteError } = await supabase
    .from('user_learning_progress')
    .delete()
    .eq('user_id', userId)
    .eq('cycle_number', 2);

  if (deleteError) {
    console.error('削除エラー:', deleteError);
    return;
  }
  console.log('   ✓ 削除完了');

  // 第4周目を第2周目にリネーム
  console.log('\n2. 第4周目を第2周目にリネーム中...');
  const { error: updateError } = await supabase
    .from('user_learning_progress')
    .update({ cycle_number: 2 })
    .eq('user_id', userId)
    .eq('cycle_number', 4);

  if (updateError) {
    console.error('更新エラー:', updateError);
    return;
  }
  console.log('   ✓ リネーム完了');

  // 確認
  console.log('\n3. 確認:');
  const { data: allCycles } = await supabase
    .from('user_learning_progress')
    .select('cycle_number')
    .eq('user_id', userId);

  const unique = [...new Set(allCycles?.map(d => d.cycle_number))].sort();
  console.log('   存在する周回:', unique);

  for (const cycle of unique) {
    const { data: cycleData } = await supabase
      .from('user_learning_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('cycle_number', cycle);

    const hasAnswer = cycleData?.filter(r => r.answer_count > 0).length || 0;
    console.log(`   第${cycle}周目: ${cycleData?.length}件, answer_count > 0: ${hasAnswer}件`);
  }

  console.log('\n✅ 修正完了！');
}

fixCycleNumbers();
