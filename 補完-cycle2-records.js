const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ttsdtjzcgxufudepclzg.supabase.co', 'sb_secret_4liMa8VzGiA1UUeXOmnDMw_LcRGzXsU');

async function 補完Cycle2Records() {
  const userId = '95099351-4b77-4353-8269-c69718d9a19f';

  console.log('=== 第2周目の不足レコードを補完します ===\n');

  // 第1周目の全レコードを取得
  const { data: cycle1 } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('cycle_number', 1);

  // 第2周目の現在のレコードを取得
  const { data: cycle2 } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('cycle_number', 2);

  console.log(`第1周目: ${cycle1.length} レコード`);
  console.log(`第2周目: ${cycle2.length} レコード\n`);

  // 第2周目に存在しないキーを特定
  const c2Keys = new Set(cycle2.map(r => `${r.module_name}::${r.section_key}`));

  const missingRecords = cycle1.filter(r => {
    const key = `${r.module_name}::${r.section_key}`;
    return !c2Keys.has(key);
  });

  console.log(`不足レコード: ${missingRecords.length} 件\n`);

  if (missingRecords.length === 0) {
    console.log('✅ 不足レコードはありません');
    return;
  }

  // モジュール別の不足数を表示
  const byModule = {};
  missingRecords.forEach(r => {
    if (!byModule[r.module_name]) byModule[r.module_name] = [];
    byModule[r.module_name].push(r);
  });

  console.log('モジュール別不足数:');
  for (const [module, records] of Object.entries(byModule)) {
    console.log(`  ${module}: ${records.length} 件`);
  }
  console.log();

  // 新規レコードを作成
  const newRecords = missingRecords.map(r => ({
    user_id: userId,
    module_name: r.module_name,
    section_key: r.section_key,
    cycle_number: 2,
    is_completed: false,
    is_correct: false,
    answer_count: 0,
    correct_count: 0
  }));

  console.log(`${newRecords.length} 件のレコードを挿入します...\n`);

  // バッチ挿入（100件ずつ）
  const batchSize = 100;
  let totalInserted = 0;

  for (let i = 0; i < newRecords.length; i += batchSize) {
    const batch = newRecords.slice(i, i + batchSize);

    const { data, error } = await supabase
      .from('user_learning_progress')
      .insert(batch)
      .select();

    if (error) {
      console.error(`❌ エラー (バッチ ${Math.floor(i / batchSize) + 1}):`, error);
      console.error('エラー詳細:', error.message);
      break;
    }

    totalInserted += batch.length;
    console.log(`  進捗: ${totalInserted}/${newRecords.length} 件挿入完了`);
  }

  console.log(`\n✅ ${totalInserted} 件のレコードを挿入しました\n`);

  // 確認
  const { data: updatedCycle2 } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('cycle_number', 2);

  console.log('=== 補完後の状態 ===');
  console.log(`第2周目のレコード数: ${updatedCycle2.length}/876 ${updatedCycle2.length === 876 ? '✅' : '❌'}\n`);

  // モジュール別確認
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

  console.log('モジュール別レコード数:');
  for (const [module, expected] of Object.entries(moduleQuizCounts)) {
    const actual = updatedCycle2.filter(r => r.module_name === module).length;
    console.log(`  ${module}: ${actual}/${expected} ${actual === expected ? '✅' : '❌'}`);
  }

  // 回答済み問題数
  const answered = new Set(
    updatedCycle2
      .filter(r => r.answer_count > 0)
      .map(r => `${r.module_name}::${r.section_key}`)
  );

  console.log(`\n回答済み問題数: ${answered.size}/876 (${Math.round((answered.size / 876) * 100)}%)`);
  console.log('\n✅ 第2周目のレコード補完が完了しました');
}

補完Cycle2Records();
