const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ttsdtjzcgxufudepclzg.supabase.co', 'sb_secret_4liMa8VzGiA1UUeXOmnDMw_LcRGzXsU');

async function checkWithLimit() {
  const userId = '95099351-4b77-4353-8269-c69718d9a19f';

  console.log('=== limit指定での確認 ===\n');

  // limitなし（デフォルト）
  const { data: c2Default } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('cycle_number', 2);

  console.log(`デフォルト（limit なし）: ${c2Default?.length || 0} 件\n`);

  // limit(1000)
  const { data: c2With1000 } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('cycle_number', 2)
    .limit(1000);

  console.log(`limit(1000): ${c2With1000?.length || 0} 件\n`);

  // range指定
  const { data: c2Range } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('cycle_number', 2)
    .range(0, 999);

  console.log(`range(0, 999): ${c2Range?.length || 0} 件\n`);

  // countのみ
  const { count } = await supabase
    .from('user_learning_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('cycle_number', 2);

  console.log(`count のみ: ${count} 件\n`);

  console.log('=== 結論 ===');
  if (c2Default?.length === c2With1000?.length && c2With1000?.length === count) {
    console.log(`✅ すべての方法で ${count} 件で一致`);
    console.log(`正確なレコード数: ${count} 件`);
  } else {
    console.log('❌ 方法によって結果が異なる:');
    console.log(`  デフォルト: ${c2Default?.length || 0}`);
    console.log(`  limit(1000): ${c2With1000?.length || 0}`);
    console.log(`  range: ${c2Range?.length || 0}`);
    console.log(`  count: ${count}`);
    console.log(`\n正しい値は count の ${count} 件です`);
  }

  if (count === 124) {
    console.log('\n⚠️ 第2周目には 124 件しかレコードが存在しません');
    console.log(`不足: ${876 - 124} = 752 件`);
    console.log('これらのレコードを補完する必要があります');
  } else if (count === 876) {
    console.log('\n✅ 第2周目は 876 件すべてのレコードが存在します');
  }
}

checkWithLimit();
