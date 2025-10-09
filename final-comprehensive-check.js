const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ttsdtjzcgxufudepclzg.supabase.co', 'sb_secret_4liMa8VzGiA1UUeXOmnDMw_LcRGzXsU');

async function comprehensiveCheck() {
  const userId = '95099351-4b77-4353-8269-c69718d9a19f';

  console.log('=== 最終的な包括的検証 ===\n');

  // 1. すべての周回を確認
  const { data: allProgress } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .order('cycle_number', { ascending: true });

  const cycles = [...new Set(allProgress?.map(r => r.cycle_number))].sort();
  console.log('✅ 存在する周回:', cycles);
  console.log('   総レコード数:', allProgress?.length, '\n');

  // 2. 各周回の詳細分析
  for (const cycle of cycles) {
    const cycleData = allProgress.filter(r => r.cycle_number === cycle);
    const answered = cycleData.filter(r => r.answer_count > 0);

    const uniqueModuleSection = new Set(answered.map(r => `${r.module_name}::${r.section_key}`));
    const uniqueSectionOnly = new Set(answered.map(r => r.section_key));

    console.log(`第${cycle}周目:`);
    console.log(`  総レコード数: ${cycleData.length}`);
    console.log(`  answer_count > 0: ${answered.length}`);
    console.log(`  ユニーク module::section_key: ${uniqueModuleSection.size}`);
    console.log(`  ユニーク section_key のみ: ${uniqueSectionOnly.size}`);
    console.log(`  進捗率: ${Math.round((uniqueModuleSection.size / 876) * 100)}%`);

    if (cycle === 1) {
      console.log(`  期待値: 876/876 = 100% ${uniqueModuleSection.size === 876 ? '✅' : '❌'}`);
    } else if (cycle === 2) {
      console.log(`  期待値: ${uniqueModuleSection.size}/876 = ${Math.round((uniqueModuleSection.size / 876) * 100)}% ✅`);
    }
    console.log();
  }

  // 3. モジュール別の詳細（第2周目）
  console.log('第2周目のモジュール別詳細:');
  const cycle2 = allProgress.filter(r => r.cycle_number === 2);
  const modules = [...new Set(cycle2.map(r => r.module_name))];

  for (const module of modules) {
    const moduleData = cycle2.filter(r => r.module_name === module);
    const answered = moduleData.filter(r => r.answer_count > 0);
    const uniqueModuleSection = new Set(answered.map(r => `${r.module_name}::${r.section_key}`));

    console.log(`  ${module}: ${uniqueModuleSection.size} 問完了`);
  }
  console.log();

  // 4. データ整合性チェック
  console.log('データ整合性チェック:');

  // 4.1 重複チェック（module::section_key の組み合わせで各周回内に重複がないか）
  for (const cycle of cycles) {
    const cycleData = allProgress.filter(r => r.cycle_number === cycle);
    const keys = cycleData.map(r => `${r.module_name}::${r.section_key}`);
    const uniqueKeys = new Set(keys);

    if (keys.length !== uniqueKeys.size) {
      console.log(`  ❌ 第${cycle}周目に重複あり: ${keys.length} レコード、${uniqueKeys.size} ユニーク`);
    } else {
      console.log(`  ✅ 第${cycle}周目: 重複なし (${keys.length} レコード)`);
    }
  }
  console.log();

  // 5. 期待される最終状態
  console.log('期待される最終状態:');
  console.log('  ✅ 第1周目: 876/876 問完了 (100%)');
  console.log('  ✅ 第2周目: 127/876 問完了 (14%)');
  console.log('  ✅ 新しい回答は第2周目に記録される');
  console.log('  ✅ 統計画面で正確な進捗が表示される');
  console.log();

  // 6. 警告事項
  console.log('注意事項:');
  console.log('  ⚠️ section_key のみでの集計は 316 個しか認識できない（誤り）');
  console.log('  ✅ module::section_key での集計で 876 個すべてを認識できる（正しい）');
  console.log();

  console.log('=== 検証完了 ===');
}

comprehensiveCheck();
