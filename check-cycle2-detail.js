const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ttsdtjzcgxufudepclzg.supabase.co', 'sb_secret_4liMa8VzGiA1UUeXOmnDMw_LcRGzXsU');

async function checkCycle2() {
  const userId = '95099351-4b77-4353-8269-c69718d9a19f';
  
  // 第2周目のすべてのレコードを取得
  const { data: cycle2, error } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('cycle_number', 2);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`第2周目の総レコード数: ${cycle2.length}`);
  
  // answer_count > 0 のレコードを確認
  const hasAnswers = cycle2.filter(r => (r.answer_count || 0) > 0);
  console.log(`answer_count > 0 のレコード: ${hasAnswers.length}件`);
  
  // is_completed = true のレコードを確認
  const completed = cycle2.filter(r => r.is_completed);
  console.log(`is_completed = true のレコード: ${completed.length}件`);
  
  // 総answer_count
  const totalAnswers = cycle2.reduce((sum, r) => sum + (r.answer_count || 0), 0);
  console.log(`総answer_count: ${totalAnswers}`);
  
  // 総correct_count
  const totalCorrect = cycle2.reduce((sum, r) => sum + (r.correct_count || 0), 0);
  console.log(`総correct_count: ${totalCorrect}`);
  
  if (hasAnswers.length > 0) {
    console.log('\nanswer_count > 0 のレコード（上位10件）:');
    hasAnswers.slice(0, 10).forEach((r, i) => {
      console.log(`  ${i+1}. ${r.module_name}/${r.section_key}`);
      console.log(`     answer_count=${r.answer_count}, correct_count=${r.correct_count}, is_completed=${r.is_completed}`);
      console.log(`     updated_at=${r.updated_at}`);
    });
  }
  
  // モジュール別の集計
  const byModule = {};
  cycle2.forEach(r => {
    if (!byModule[r.module_name]) {
      byModule[r.module_name] = { total: 0, hasAnswer: 0, totalAnswers: 0 };
    }
    byModule[r.module_name].total++;
    if ((r.answer_count || 0) > 0) {
      byModule[r.module_name].hasAnswer++;
      byModule[r.module_name].totalAnswers += r.answer_count;
    }
  });
  
  console.log('\nモジュール別集計:');
  Object.entries(byModule).forEach(([module, stats]) => {
    if (stats.hasAnswer > 0) {
      console.log(`  ${module}: ${stats.hasAnswer}/${stats.total}問解答 (総回答数: ${stats.totalAnswers})`);
    }
  });
}

checkCycle2();
