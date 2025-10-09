const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ttsdtjzcgxufudepclzg.supabase.co', 'sb_secret_4liMa8VzGiA1UUeXOmnDMw_LcRGzXsU');

async function fixCycle2MissingRecords() {
  const userId = '95099351-4b77-4353-8269-c69718d9a19f';

  console.log('=== 第2周目の不足レコードを補完 ===\n');

  // 1. 第1周目のすべてのレコードを取得
  const { data: cycle1, error: c1Error } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('cycle_number', 1);

  if (c1Error) {
    console.error('❌ 第1周目データ取得エラー:', c1Error);
    return;
  }

  console.log(`第1周目のレコード: ${cycle1.length} 件`);

  // 2. 第2周目のすべてのレコードを取得
  const { data: cycle2, error: c2Error } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('cycle_number', 2);

  if (c2Error) {
    console.error('❌ 第2周目データ取得エラー:', c2Error);
    return;
  }

  console.log(`第2周目の現在のレコード: ${cycle2.length} 件\n`);

  // 3. 第2周目に存在しないキーを特定
  const c2KeySet = new Set(cycle2.map(r => `${r.module_name}::${r.section_key}`));
  const missingRecords = cycle1.filter(r => {
    const key = `${r.module_name}::${r.section_key}`;
    return !c2KeySet.has(key);
  });

  console.log(`不足しているレコード: ${missingRecords.length} 件\n`);

  if (missingRecords.length === 0) {
    console.log('✅ すべてのレコードが存在します');
    return;
  }

  // 4. 不足レコードの詳細
  console.log('モジュール別の不足数:');
  const missingByModule = {};
  missingRecords.forEach(r => {
    if (!missingByModule[r.module_name]) {
      missingByModule[r.module_name] = 0;
    }
    missingByModule[r.module_name]++;
  });

  Object.entries(missingByModule).forEach(([module, count]) => {
    console.log(`  ${module}: ${count} 件`);
  });
  console.log();

  // 5. 不足レコードを補完
  console.log('補完データの作成中...');
  const newRecords = missingRecords.map(r => ({
    user_id: r.user_id,
    module_name: r.module_name,
    section_key: r.section_key,
    cycle_number: 2,
    is_completed: false,
    is_correct: false,
    answer_count: 0,
    correct_count: 0
  }));

  console.log(`${newRecords.length} 件のレコードを挿入します...\n`);

  // バッチで挿入（Supabaseの制限を考慮）
  const batchSize = 100;
  let inserted = 0;

  for (let i = 0; i < newRecords.length; i += batchSize) {
    const batch = newRecords.slice(i, i + batchSize);

    const { data, error } = await supabase
      .from('user_learning_progress')
      .insert(batch)
      .select();

    if (error) {
      console.error(`❌ バッチ ${Math.floor(i / batchSize) + 1} 挿入エラー:`, error);
      break;
    }

    inserted += batch.length;
    console.log(`  ${inserted}/${newRecords.length} 件挿入完了...`);
  }

  console.log();

  // 6. 確認
  const { data: updatedCycle2 } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('cycle_number', 2);

  console.log('=== 補完後の状態 ===');
  console.log(`第2周目のレコード数: ${updatedCycle2.length} 件`);
  console.log(`期待値: 876 件 ${updatedCycle2.length === 876 ? '✅' : '❌'}`);
  console.log();

  // モジュール別確認
  console.log('モジュール別レコード数:');
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
    const actual = updatedCycle2.filter(r => r.module_name === module).length;
    console.log(`  ${module}: ${actual}/${expected} ${actual === expected ? '✅' : '❌'}`);
  }

  console.log('\n✅ 第2周目のレコード補完が完了しました');
}

fixCycle2MissingRecords();
