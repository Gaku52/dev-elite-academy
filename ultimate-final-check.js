const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ttsdtjzcgxufudepclzg.supabase.co', 'sb_secret_4liMa8VzGiA1UUeXOmnDMw_LcRGzXsU');

async function ultimateFinalCheck() {
  const userId = '95099351-4b77-4353-8269-c69718d9a19f';
  const TOTAL_QUESTIONS = 876;

  console.log('=== 最終的なシステム状態確認 ===\n');

  // すべてのデータを取得
  const { data: allData } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .order('cycle_number', { ascending: true });

  const cycles = [...new Set(allData.map(r => r.cycle_number))].sort();

  console.log(`総レコード数: ${allData.length}`);
  console.log(`存在する周回: ${cycles.join(', ')}\n`);

  // 各周回の詳細
  for (const cycle of cycles) {
    const cycleData = allData.filter(r => r.cycle_number === cycle);

    // module::section_key でユニークにカウント（コードと同じロジック）
    const uniqueAnswered = new Set(
      cycleData
        .filter(r => r.answer_count > 0)
        .map(r => `${r.module_name}::${r.section_key}`)
    );

    const completionRate = Math.round((uniqueAnswered.size / TOTAL_QUESTIONS) * 100);

    console.log(`第${cycle}周目:`);
    console.log(`  レコード数: ${cycleData.length}/${TOTAL_QUESTIONS} ${cycleData.length === TOTAL_QUESTIONS ? '✅' : '❌'}`);
    console.log(`  完了問題数 (module::section_key): ${uniqueAnswered.size}/${TOTAL_QUESTIONS}`);
    console.log(`  完了率: ${completionRate}%`);

    if (cycle === 1) {
      console.log(`  状態: ${completionRate === 100 ? '✅ 100%完了' : '⚠️ まだ完了していません'}`);
    } else if (cycle === 2) {
      console.log(`  状態: ✅ 進行中 (${uniqueAnswered.size} 問回答済み)`);
    }
    console.log();
  }

  // 第2周目のモジュール別詳細
  console.log('第2周目のモジュール別進捗:');
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

  let totalAnswered = 0;

  for (const [module, total] of Object.entries(moduleQuizCounts)) {
    const moduleData = cycle2.filter(r => r.module_name === module);
    const uniqueAnswered = new Set(
      moduleData
        .filter(r => r.answer_count > 0)
        .map(r => `${r.module_name}::${r.section_key}`)
    );

    totalAnswered += uniqueAnswered.size;

    const rate = Math.round((uniqueAnswered.size / total) * 100);

    console.log(`  ${module}:`);
    console.log(`    レコード: ${moduleData.length}/${total} ${moduleData.length === total ? '✅' : '❌'}`);
    console.log(`    完了: ${uniqueAnswered.size}/${total} (${rate}%)`);
  }

  console.log(`\n  合計回答数: ${totalAnswered}/${TOTAL_QUESTIONS} (${Math.round((totalAnswered / TOTAL_QUESTIONS) * 100)}%)\n`);

  // 画面表示の期待値
  console.log('=== 画面表示される期待値 ===');

  const c1 = allData.filter(r => r.cycle_number === 1);
  const c2 = allData.filter(r => r.cycle_number === 2);

  const c1Answered = new Set(
    c1.filter(r => r.answer_count > 0).map(r => `${r.module_name}::${r.section_key}`)
  );

  const c2Answered = new Set(
    c2.filter(r => r.answer_count > 0).map(r => `${r.module_name}::${r.section_key}`)
  );

  console.log('学習統計ページ (https://ogadix.com/learning-stats):');
  console.log(`  第1周目: ${c1Answered.size}/${TOTAL_QUESTIONS} = ${Math.round((c1Answered.size / TOTAL_QUESTIONS) * 100)}%`);
  console.log(`  第2周目: ${c2Answered.size}/${TOTAL_QUESTIONS} = ${Math.round((c2Answered.size / TOTAL_QUESTIONS) * 100)}%\n`);

  // 整合性確認
  console.log('=== 整合性確認 ===');

  const c1Keys = new Set(c1.map(r => `${r.module_name}::${r.section_key}`));
  const c2Keys = new Set(c2.map(r => `${r.module_name}::${r.section_key}`));

  const keysMatch = c1Keys.size === c2Keys.size &&
                    [...c1Keys].every(k => c2Keys.has(k)) &&
                    [...c2Keys].every(k => c1Keys.has(k));

  console.log(`  両周回のキーセット一致: ${keysMatch ? '✅' : '❌'}`);
  console.log(`  第1周目のユニークキー: ${c1Keys.size}`);
  console.log(`  第2周目のユニークキー: ${c2Keys.size}`);

  // 重複チェック
  for (const cycle of cycles) {
    const cycleData = allData.filter(r => r.cycle_number === cycle);
    const keys = cycleData.map(r => `${r.module_name}::${r.section_key}`);
    const uniqueKeys = new Set(keys);

    console.log(`  第${cycle}周目の重複: ${keys.length !== uniqueKeys.size ? 'あり ❌' : 'なし ✅'}`);
  }

  console.log('\n=== 最終判定 ===');

  const allChecksPass =
    c1.length === TOTAL_QUESTIONS &&
    c2.length === TOTAL_QUESTIONS &&
    c1Answered.size === TOTAL_QUESTIONS &&
    keysMatch;

  if (allChecksPass) {
    console.log('✅ システムは完全に正常です！');
    console.log(`✅ 第1周目: ${TOTAL_QUESTIONS}/${TOTAL_QUESTIONS} (100%)`);
    console.log(`✅ 第2周目: ${c2Answered.size}/${TOTAL_QUESTIONS} (${Math.round((c2Answered.size / TOTAL_QUESTIONS) * 100)}%)`);
    console.log('✅ データ整合性に問題なし');
    console.log('✅ 統計画面に正しく表示されるはず');
  } else {
    console.log('⚠️ 以下の項目を確認:');
    if (c1.length !== TOTAL_QUESTIONS) console.log(`  - 第1周目のレコード数: ${c1.length}/${TOTAL_QUESTIONS}`);
    if (c2.length !== TOTAL_QUESTIONS) console.log(`  - 第2周目のレコード数: ${c2.length}/${TOTAL_QUESTIONS}`);
    if (c1Answered.size !== TOTAL_QUESTIONS) console.log(`  - 第1周目の完了数: ${c1Answered.size}/${TOTAL_QUESTIONS}`);
    if (!keysMatch) console.log('  - 周回間のキーセット不一致');
  }

  console.log('\n=== 確認完了 ===');
}

ultimateFinalCheck();
