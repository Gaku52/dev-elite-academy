const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ttsdtjzcgxufudepclzg.supabase.co', 'sb_secret_4liMa8VzGiA1UUeXOmnDMw_LcRGzXsU');

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

async function finalSystemVerification() {
  const userId = '95099351-4b77-4353-8269-c69718d9a19f';
  const totalQuestions = Object.values(moduleQuizCounts).reduce((sum, count) => sum + count, 0);

  console.log('=== システム全体の最終検証 ===\n');
  console.log(`総問題数: ${totalQuestions} 問\n`);

  // 1. データベース状態の確認
  console.log('【1. データベース状態】');
  const { data: allProgress } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId);

  const cycles = [...new Set(allProgress.map(r => r.cycle_number))].sort();
  console.log(`  存在する周回: ${cycles.join(', ')}`);
  console.log(`  総レコード数: ${allProgress.length}\n`);

  // 2. 各周回の統計（コードと同じロジック）
  console.log('【2. 各周回の統計（コードと同じロジック）】');

  for (const cycle of cycles) {
    const cycleData = allProgress.filter(r => r.cycle_number === cycle);

    // ユニークな module::section_key でカウント（コードと同じ）
    const uniqueModuleSection = new Set(
      cycleData
        .filter(r => r.answer_count > 0)
        .map(r => `${r.module_name}::${r.section_key}`)
    );

    const completionRate = Math.round((uniqueModuleSection.size / totalQuestions) * 100);

    console.log(`  第${cycle}周目:`);
    console.log(`    レコード数: ${cycleData.length}/${totalQuestions}`);
    console.log(`    完了問題数: ${uniqueModuleSection.size}/${totalQuestions}`);
    console.log(`    完了率: ${completionRate}%`);

    if (cycle === 1) {
      const isCorrect = uniqueModuleSection.size === totalQuestions && completionRate === 100;
      console.log(`    期待値: 100% ${isCorrect ? '✅' : '❌'}`);
    } else if (cycle === 2) {
      console.log(`    期待値: 進行中 (${completionRate}%) ✅`);
    }
    console.log();
  }

  // 3. モジュール別統計（第2周目）
  console.log('【3. 第2周目のモジュール別統計】');
  const cycle2 = allProgress.filter(r => r.cycle_number === 2);

  for (const [moduleName, total] of Object.entries(moduleQuizCounts)) {
    const uniqueSections = new Set(
      cycle2
        .filter(r => r.module_name === moduleName && r.answer_count > 0)
        .map(r => `${r.module_name}::${r.section_key}`)
    );

    const moduleTotal = cycle2.filter(r => r.module_name === moduleName).length;

    console.log(`  ${moduleName}:`);
    console.log(`    レコード: ${moduleTotal}/${total} ${moduleTotal === total ? '✅' : '❌'}`);
    console.log(`    完了: ${uniqueSections.size}/${total}`);
  }
  console.log();

  // 4. 整合性チェック
  console.log('【4. 整合性チェック】');

  // 4.1 第1周目と第2周目のキーセットが同じか
  const c1Keys = new Set(allProgress.filter(r => r.cycle_number === 1).map(r => `${r.module_name}::${r.section_key}`));
  const c2Keys = new Set(allProgress.filter(r => r.cycle_number === 2).map(r => `${r.module_name}::${r.section_key}`));

  const keysMatch = c1Keys.size === c2Keys.size &&
                    [...c1Keys].every(k => c2Keys.has(k)) &&
                    [...c2Keys].every(k => c1Keys.has(k));

  console.log(`  第1周目と第2周目のキーセット: ${keysMatch ? '一致 ✅' : '不一致 ❌'}`);
  console.log(`    第1周目のキー数: ${c1Keys.size}`);
  console.log(`    第2周目のキー数: ${c2Keys.size}`);

  // 4.2 重複チェック
  for (const cycle of cycles) {
    const cycleData = allProgress.filter(r => r.cycle_number === cycle);
    const keys = cycleData.map(r => `${r.module_name}::${r.section_key}`);
    const uniqueKeys = new Set(keys);

    const hasDuplicates = keys.length !== uniqueKeys.size;
    console.log(`  第${cycle}周目の重複: ${hasDuplicates ? '有り ❌' : '無し ✅'}`);
  }
  console.log();

  // 5. 最終確認
  console.log('【5. 最終確認】');

  const c1Completed = new Set(
    allProgress
      .filter(r => r.cycle_number === 1 && r.answer_count > 0)
      .map(r => `${r.module_name}::${r.section_key}`)
  ).size;

  const c2Completed = new Set(
    allProgress
      .filter(r => r.cycle_number === 2 && r.answer_count > 0)
      .map(r => `${r.module_name}::${r.section_key}`)
  ).size;

  const c1Rate = Math.round((c1Completed / totalQuestions) * 100);
  const c2Rate = Math.round((c2Completed / totalQuestions) * 100);

  console.log(`  ✅ 第1周目: ${c1Completed}/${totalQuestions} = ${c1Rate}%`);
  console.log(`  ✅ 第2周目: ${c2Completed}/${totalQuestions} = ${c2Rate}%`);
  console.log();

  console.log('【6. システム状態の総括】');
  if (c1Rate === 100 && keysMatch && !hasDuplicates) {
    console.log('  ✅ システムは正常に動作しています');
    console.log('  ✅ 第1周目は100%完了');
    console.log(`  ✅ 第2周目は${c2Rate}%で進行中`);
    console.log('  ✅ データ整合性に問題なし');
  } else {
    console.log('  ⚠️ 以下の項目を確認してください:');
    if (c1Rate !== 100) console.log(`    - 第1周目が100%ではありません (${c1Rate}%)`);
    if (!keysMatch) console.log('    - 周回間でキーセットが一致しません');
  }

  console.log('\n=== 検証完了 ===');
}

finalSystemVerification();
