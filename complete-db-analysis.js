const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ttsdtjzcgxufudepclzg.supabase.co', 'sb_secret_4liMa8VzGiA1UUeXOmnDMw_LcRGzXsU');

async function completeAnalysis() {
  const userId = '95099351-4b77-4353-8269-c69718d9a19f';

  console.log('='.repeat(80));
  console.log('完全なデータベース分析');
  console.log('='.repeat(80));

  // 全データを取得
  const { data: allData } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .order('cycle_number')
    .order('updated_at', { ascending: false });

  const cycle1 = allData?.filter(d => d.cycle_number === 1) || [];
  const cycle2 = allData?.filter(d => d.cycle_number === 2) || [];

  console.log('\n【第1周目】');
  console.log(`総レコード数: ${cycle1.length}`);
  console.log(`answer_count > 0: ${cycle1.filter(r => r.answer_count > 0).length}`);
  console.log(`is_completed = true: ${cycle1.filter(r => r.is_completed).length}`);
  console.log(`総answer_count: ${cycle1.reduce((s, r) => s + r.answer_count, 0)}`);
  console.log(`総correct_count: ${cycle1.reduce((s, r) => s + r.correct_count, 0)}`);

  console.log('\n【第2周目】');
  console.log(`総レコード数: ${cycle2.length}`);
  console.log(`answer_count > 0: ${cycle2.filter(r => r.answer_count > 0).length}`);
  console.log(`is_completed = true: ${cycle2.filter(r => r.is_completed).length}`);
  console.log(`総answer_count: ${cycle2.reduce((s, r) => s + r.answer_count, 0)}`);
  console.log(`総correct_count: ${cycle2.reduce((s, r) => s + r.correct_count, 0)}`);

  console.log('\n【現在のAPIが返す周回番号】');
  const { data: maxCycle } = await supabase
    .from('user_learning_progress')
    .select('cycle_number')
    .eq('user_id', userId)
    .order('cycle_number', { ascending: false })
    .limit(1);
  console.log(`ユーザー全体の最大周回: ${maxCycle?.[0]?.cycle_number || 1}`);

  console.log('\n【GETリクエストが返すデータ】');
  const currentCycle = maxCycle?.[0]?.cycle_number || 1;
  const { data: getData } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('cycle_number', currentCycle);
  console.log(`/api/learning-progress (GET) が返すレコード数: ${getData?.length}`);
  console.log(`そのうち answer_count > 0: ${getData?.filter(r => r.answer_count > 0).length}`);

  console.log('\n【統計計算の結果】');
  const progressData = getData || [];
  const uniqueCompleted = new Set(
    progressData.filter(p => (p.answer_count || 0) > 0).map(p => p.section_key)
  );
  console.log(`ユニーク完了数（answer_count > 0基準）: ${uniqueCompleted.size}`);
  console.log(`進捗率: ${Math.round(uniqueCompleted.size / 876 * 100)}%`);

  console.log('\n【問題点の特定】');
  console.log('1. 第1周目は876問完了（100%）← 正しい');
  console.log('2. 第2周目は876レコード存在、すべてanswer_count=0 ← 問題！');
  console.log('3. 現在のAPIは第2周目を取得 ← 正しい');
  console.log('4. しかし第2周目はすべて未解答なので0%表示 ← これが原因');
  
  console.log('\n【必要な対応】');
  console.log('✓ saveProgress API修正: ユーザー全体の最大周回を使用（完了）');
  console.log('? 第1周目のデータで10月1日以降の更新を第2周目に移行するか？');
  console.log('  → または、これから新規に第2周目を解き直すか？');

  console.log('\n【第1周目の10月1日以降の更新】');
  const oct1 = cycle1.filter(r => new Date(r.updated_at) >= new Date('2025-10-01'));
  console.log(`10月1日以降に更新されたレコード: ${oct1.length}件`);
  if (oct1.length > 0) {
    console.log('  これらが第2周目で解答したつもりのデータの可能性');
    console.log('  モジュール別:');
    const byModule = {};
    oct1.forEach(r => {
      byModule[r.module_name] = (byModule[r.module_name] || 0) + 1;
    });
    Object.entries(byModule).forEach(([m, count]) => {
      console.log(`    ${m}: ${count}問`);
    });
  }

  console.log('\n' + '='.repeat(80));
}

completeAnalysis();
