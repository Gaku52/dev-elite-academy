const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ttsdtjzcgxufudepclzg.supabase.co', 'sb_secret_4liMa8VzGiA1UUeXOmnDMw_LcRGzXsU');

async function recheckCurrentState() {
  const userId = '95099351-4b77-4353-8269-c69718d9a19f';

  console.log('=== 現在のデータベース状態を再確認 ===\n');

  // すべての周回を取得
  const { data: allData, error, count } = await supabase
    .from('user_learning_progress')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('cycle_number', { ascending: true });

  if (error) {
    console.error('エラー:', error);
    return;
  }

  console.log(`総レコード数: ${count} 件\n`);

  // 周回ごとに集計
  const cycles = [...new Set(allData.map(r => r.cycle_number))].sort();

  console.log(`存在する周回: ${cycles.join(', ')}\n`);

  for (const cycle of cycles) {
    const cycleData = allData.filter(r => r.cycle_number === cycle);

    console.log(`第${cycle}周目:`);
    console.log(`  総レコード数: ${cycleData.length}`);
    console.log(`  answer_count > 0: ${cycleData.filter(r => r.answer_count > 0).length}`);

    // ユニークなmodule::section_keyでカウント
    const uniqueAnswered = new Set(
      cycleData
        .filter(r => r.answer_count > 0)
        .map(r => `${r.module_name}::${r.section_key}`)
    );

    console.log(`  ユニーク回答済み: ${uniqueAnswered.size}`);
    console.log(`  進捗率: ${Math.round((uniqueAnswered.size / 876) * 100)}%\n`);
  }

  // モジュール別の内訳（第2周目）
  console.log('第2周目のモジュール別詳細:');
  const cycle2 = allData.filter(r => r.cycle_number === 2);

  const moduleQuizCounts = {
    'computer-systems': 134,
    'algorithms-programming': 118,
    'database': 80,
    'network': 119,
    'security': 99,
    'system-development': 120,
    'management-legal': 100,
    'strategy': 106
  };

  for (const [module, expected] of Object.entries(moduleQuizCounts)) {
    const moduleData = cycle2.filter(r => r.module_name === module);
    const answered = moduleData.filter(r => r.answer_count > 0);

    console.log(`  ${module}:`);
    console.log(`    レコード: ${moduleData.length}/${expected} ${moduleData.length === expected ? '✅' : '❌'}`);
    console.log(`    回答済み: ${answered.length}`);
  }

  console.log('\n=== 最終結論 ===');

  const c1 = allData.filter(r => r.cycle_number === 1);
  const c2 = allData.filter(r => r.cycle_number === 2);

  const c1Answered = new Set(
    c1.filter(r => r.answer_count > 0).map(r => `${r.module_name}::${r.section_key}`)
  );

  const c2Answered = new Set(
    c2.filter(r => r.answer_count > 0).map(r => `${r.module_name}::${r.section_key}`)
  );

  console.log(`第1周目: ${c1.length} レコード, ${c1Answered.size}/876 完了 (${Math.round((c1Answered.size / 876) * 100)}%)`);
  console.log(`第2周目: ${c2.length} レコード, ${c2Answered.size}/876 完了 (${Math.round((c2Answered.size / 876) * 100)}%)`);

  if (c1.length === 876 && c2.length === 876 && c1Answered.size === 876) {
    console.log('\n✅ システムは正常な状態です');
  } else if (c1.length === 876 && c2.length === 876) {
    console.log('\n⚠️ レコード数は正常ですが、第1周目が100%ではありません');
  } else {
    console.log('\n❌ レコード数に問題があります');
  }
}

recheckCurrentState();
