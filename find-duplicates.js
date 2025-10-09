const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ttsdtjzcgxufudepclzg.supabase.co', 'sb_secret_4liMa8VzGiA1UUeXOmnDMw_LcRGzXsU');

async function findDuplicates() {
  const userId = '95099351-4b77-4353-8269-c69718d9a19f';

  const { data: cycle1 } = await supabase
    .from('user_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('cycle_number', 1);

  const keyCounts = {};
  cycle1?.forEach(r => {
    const key = `${r.module_name}::${r.section_key}`;
    keyCounts[key] = (keyCounts[key] || 0) + 1;
  });

  const duplicates = Object.entries(keyCounts).filter(([k, count]) => count > 1);
  
  console.log('重複しているキー:', duplicates.length);
  
  if (duplicates.length > 0) {
    console.log('\nサンプル（重複数が多い順）:');
    duplicates
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([key, count]) => {
        console.log(`  ${key}: ${count}回`);
      });

    console.log('\n解決策: ユニーク制約違反のため、重複レコードを削除する必要があります');
  } else {
    console.log('重複なし');
    console.log('\nユニークキー数:', Object.keys(keyCounts).length);
    console.log('総レコード数:', cycle1?.length);
  }
}

findDuplicates();
