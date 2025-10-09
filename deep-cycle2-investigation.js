const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ttsdtjzcgxufudepclzg.supabase.co', 'sb_secret_4liMa8VzGiA1UUeXOmnDMw_LcRGzXsU');

async function deepCycle2Investigation() {
  const userId = '95099351-4b77-4353-8269-c69718d9a19f';

  console.log('=== 第2周目の深掘り調査 ===\n');

  // 1. 最新の第2周目データを取得
  const { data: cycle2, error } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('cycle_number', 2)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('❌ エラー:', error);
    return;
  }

  console.log('第2周目の現在の状態:');
  console.log(`  総レコード数: ${cycle2.length}`);
  console.log(`  answer_count > 0: ${cycle2.filter(r => r.answer_count > 0).length}`);
  console.log();

  // 2. すべてのモジュールをチェック
  const moduleQuizCounts = {
    'computer-systems': 187,
    'algorithms-programming': 154,
    'database': 104,
    'network': 123,
    'security': 98,
    'system-development': 65,
    'management-legal': 76,
    'strategy': 69
  };

  console.log('モジュール別レコード存在チェック:');
  for (const [moduleName, expectedCount] of Object.entries(moduleQuizCounts)) {
    const moduleRecords = cycle2.filter(r => r.module_name === moduleName);
    const answered = moduleRecords.filter(r => r.answer_count > 0);

    console.log(`  ${moduleName}:`);
    console.log(`    期待レコード数: ${expectedCount}`);
    console.log(`    実際のレコード数: ${moduleRecords.length} ${moduleRecords.length === expectedCount ? '✅' : '❌'}`);
    console.log(`    answer_count > 0: ${answered.length}`);
  }
  console.log();

  // 3. 第1周目と第2周目のレコード差分
  const { data: cycle1 } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('cycle_number', 1);

  const c1Keys = new Set(cycle1.map(r => `${r.module_name}::${r.section_key}`));
  const c2Keys = new Set(cycle2.map(r => `${r.module_name}::${r.section_key}`));

  console.log('周回間のレコード比較:');
  console.log(`  第1周目のユニークキー数: ${c1Keys.size}`);
  console.log(`  第2周目のユニークキー数: ${c2Keys.size}`);

  // 第1周目にあるが第2周目にないキー
  const inC1NotInC2 = [...c1Keys].filter(k => !c2Keys.has(k));
  console.log(`  第1周目にあるが第2周目にないキー: ${inC1NotInC2.length}`);

  if (inC1NotInC2.length > 0) {
    console.log('    ❌ 問題: 第2周目には全問題のレコードが必要です');
    console.log('    サンプル（最初の10件）:');
    inC1NotInC2.slice(0, 10).forEach(k => console.log(`      - ${k}`));
  }
  console.log();

  // 4. 第2周目のデータ作成日時を確認
  console.log('第2周目のデータ作成日時:');
  const createdDates = [...new Set(cycle2.map(r => new Date(r.created_at).toISOString().split('T')[0]))];
  console.log(`  作成日: ${createdDates.join(', ')}`);

  const latestUpdated = cycle2
    .filter(r => r.answer_count > 0)
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 5);

  console.log('  最新の回答（5件）:');
  latestUpdated.forEach(r => {
    console.log(`    ${r.module_name}::${r.section_key} - 更新: ${new Date(r.updated_at).toISOString()}`);
  });
  console.log();

  // 5. 根本原因の特定
  console.log('=== 根本原因の分析 ===');

  if (cycle2.length < 876) {
    console.log(`❌ 重大な問題発見:`);
    console.log(`   第2周目のレコード数が ${cycle2.length} 件しかありません`);
    console.log(`   正しくは 876 件のレコードが必要です`);
    console.log();
    console.log(`原因の可能性:`);
    console.log(`   1. 新しい周回開始時に一部のレコードしか作成されなかった`);
    console.log(`   2. 手動でデータベースを修正した際に削除された`);
    console.log(`   3. リセット機能に不具合がある`);
    console.log();
    console.log(`解決策:`);
    console.log(`   第1周目の全876レコードをベースに、第2周目の未作成レコードを補完する必要があります`);
  } else {
    console.log(`✅ レコード数は正常です (${cycle2.length} 件)`);
  }
}

deepCycle2Investigation();
