const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ttsdtjzcgxufudepclzg.supabase.co';
const supabaseServiceKey = 'sb_secret_4liMa8VzGiA1UUeXOmnDMw_LcRGzXsU';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createCycle2Records() {
  const userId = '95099351-4b77-4353-8269-c69718d9a19f';

  console.log('第2周目の完全なレコードセットを作成します...\n');

  // 第1周目の全レコードを取得
  const { data: cycle1Records, error: cycle1Error } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('cycle_number', 1);

  if (cycle1Error) {
    console.error('Error:', cycle1Error);
    return;
  }

  console.log(`第1周目のレコード数: ${cycle1Records.length}`);

  // 第2周目の既存レコードを取得
  const { data: cycle2Records, error: cycle2Error } = await supabase
    .from('user_learning_progress')
    .select('section_key, module_name')
    .eq('user_id', userId)
    .eq('cycle_number', 2);

  if (cycle2Error) {
    console.error('Error:', cycle2Error);
    return;
  }

  console.log(`第2周目の既存レコード数: ${cycle2Records?.length || 0}`);

  // 第2周目に存在しないレコードを特定
  const cycle2Keys = new Set(
    cycle2Records?.map(r => `${r.module_name}::${r.section_key}`) || []
  );

  const missingRecords = cycle1Records.filter(r =>
    !cycle2Keys.has(`${r.module_name}::${r.section_key}`)
  );

  console.log(`第2周目に不足しているレコード数: ${missingRecords.length}\n`);

  if (missingRecords.length === 0) {
    console.log('✓ 第2周目は既に完全です！');
    return;
  }

  // 不足しているレコードを作成
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

  console.log(`${newRecords.length}件のレコードを作成中...`);

  // バッチで挿入（1000件ずつ）
  const batchSize = 1000;
  for (let i = 0; i < newRecords.length; i += batchSize) {
    const batch = newRecords.slice(i, i + batchSize);
    const { error: insertError } = await supabase
      .from('user_learning_progress')
      .insert(batch);

    if (insertError) {
      console.error(`Batch ${i / batchSize + 1} error:`, insertError);
      return;
    }
    console.log(`  Batch ${i / batchSize + 1}: ${batch.length}件挿入完了`);
  }

  // 確認
  const { data: finalCycle2, error: finalError } = await supabase
    .from('user_learning_progress')
    .select('id')
    .eq('user_id', userId)
    .eq('cycle_number', 2);

  if (!finalError) {
    console.log(`\n✅ 完了！第2周目の総レコード数: ${finalCycle2.length}`);
  }
}

createCycle2Records();
