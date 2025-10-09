const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ttsdtjzcgxufudepclzg.supabase.co', 'sb_secret_4liMa8VzGiA1UUeXOmnDMw_LcRGzXsU');

async function testAfterAnswer() {
  const userId = '95099351-4b77-4353-8269-c69718d9a19f';

  console.log('=== テスト: 問題解答後のデータ確認 ===\n');

  // 第2周目で最近更新されたレコードを確認
  const { data: cycle2Recent } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('cycle_number', 2)
    .order('updated_at', { ascending: false })
    .limit(5);

  console.log('第2周目の最近更新されたレコード（上位5件）:');
  cycle2Recent?.forEach((r, i) => {
    const updatedAt = new Date(r.updated_at);
    const now = new Date();
    const minutesAgo = Math.round((now - updatedAt) / 60000);

    console.log(`  ${i+1}. ${r.module_name}/${r.section_key}`);
    console.log(`     answer_count=${r.answer_count}, correct_count=${r.correct_count}`);
    console.log(`     is_completed=${r.is_completed}, is_correct=${r.is_correct}`);
    console.log(`     updated: ${minutesAgo}分前 (${r.updated_at})`);
  });

  // 第2周目で answer_count > 0 のレコード数
  const { data: cycle2WithAnswers } = await supabase
    .from('user_learning_progress')
    .select('id')
    .eq('user_id', userId)
    .eq('cycle_number', 2)
    .gt('answer_count', 0);

  console.log(`\n第2周目で answer_count > 0 のレコード数: ${cycle2WithAnswers?.length || 0}`);

  if ((cycle2WithAnswers?.length || 0) === 0) {
    console.log('\n⚠️  まだ第2周目のデータは更新されていません。');
    console.log('   問題を1問解答してから、再度このスクリプトを実行してください。');
  } else {
    console.log('\n✅ 第2周目のデータが正しく更新されています！');
  }
}

testAfterAnswer();
