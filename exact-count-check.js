const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ttsdtjzcgxufudepclzg.supabase.co', 'sb_secret_4liMa8VzGiA1UUeXOmnDMw_LcRGzXsU');

async function exactCountCheck() {
  const userId = '95099351-4b77-4353-8269-c69718d9a19f';

  console.log('=== 正確なカウントチェック ===\n');

  // Method 1: count のみ
  const { count: c1Count } = await supabase
    .from('user_learning_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('cycle_number', 1);

  const { count: c2Count } = await supabase
    .from('user_learning_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('cycle_number', 2);

  console.log('Method 1 (count only):');
  console.log(`  第1周目: ${c1Count} 件`);
  console.log(`  第2周目: ${c2Count} 件\n`);

  // Method 2: データと count
  const { data: c1Data, count: c1DataCount } = await supabase
    .from('user_learning_progress')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .eq('cycle_number', 1);

  const { data: c2Data, count: c2DataCount } = await supabase
    .from('user_learning_progress')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .eq('cycle_number', 2);

  console.log('Method 2 (data with count):');
  console.log(`  第1周目: データ長=${c1Data.length}, count=${c1DataCount}`);
  console.log(`  第2周目: データ長=${c2Data.length}, count=${c2DataCount}\n`);

  // Method 3: 全フィールド取得
  const { data: c1Full } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('cycle_number', 1);

  const { data: c2Full } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('cycle_number', 2);

  console.log('Method 3 (full data):');
  console.log(`  第1周目: ${c1Full?.length || 0} 件`);
  console.log(`  第2周目: ${c2Full?.length || 0} 件\n`);

  // 各メソッドで不一致があるか確認
  if (c1Count === c1DataCount && c1DataCount === (c1Full?.length || 0)) {
    console.log(`✅ 第1周目: すべてのメソッドで ${c1Count} 件で一致`);
  } else {
    console.log(`❌ 第1周目: メソッド間で不一致`);
  }

  if (c2Count === c2DataCount && c2DataCount === (c2Full?.length || 0)) {
    console.log(`✅ 第2周目: すべてのメソッドで ${c2Count} 件で一致`);
  } else {
    console.log(`❌ 第2周目: メソッド間で不一致`);
    console.log(`  count=${c2Count}, dataCount=${c2DataCount}, fullLength=${c2Full?.length || 0}`);
  }

  console.log('\n=== 最終判断 ===');
  console.log(`第2周目の正確なレコード数: ${c2Count} 件`);
  console.log(`不足レコード数: ${876 - c2Count} 件`);

  if (c2Count < 876) {
    console.log('\n⚠️ 第2周目にレコードが不足しています');
    console.log('補完が必要です');
  } else {
    console.log('\n✅ 第2周目のレコード数は正常です');
  }
}

exactCountCheck();
