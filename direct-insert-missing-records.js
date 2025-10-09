const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ttsdtjzcgxufudepclzg.supabase.co', 'sb_secret_4liMa8VzGiA1UUeXOmnDMw_LcRGzXsU');

async function directInsertMissingRecords() {
  const userId = '95099351-4b77-4353-8269-c69718d9a19f';

  console.log('=== 第2周目不足レコードの直接挿入 ===\n');

  try {
    // 第1周目の全レコードを取得（where条件を明示的に指定）
    console.log('第1周目のレコードを取得中...');
    const { data: cycle1Data, error: c1Error } = await supabase
      .from('user_learning_progress')
      .select('user_id, module_name, section_key, cycle_number')
      .eq('user_id', userId)
      .eq('cycle_number', 1);

    if (c1Error) {
      console.error('❌ 第1周目取得エラー:', c1Error);
      return;
    }

    console.log(`✅ 第1周目: ${cycle1Data.length} 件取得\n`);

    // 第2周目の全レコードを取得
    console.log('第2周目のレコードを取得中...');
    const { data: cycle2Data, error: c2Error } = await supabase
      .from('user_learning_progress')
      .select('user_id, module_name, section_key, cycle_number')
      .eq('user_id', userId)
      .eq('cycle_number', 2);

    if (c2Error) {
      console.error('❌ 第2周目取得エラー:', c2Error);
      return;
    }

    console.log(`✅ 第2周目: ${cycle2Data.length} 件取得\n`);

    // 第2周目に存在しないレコードを特定
    const c2KeysSet = new Set(cycle2Data.map(r => `${r.module_name}::${r.section_key}`));

    const missingInCycle2 = cycle1Data.filter(r => {
      const key = `${r.module_name}::${r.section_key}`;
      return !c2KeysSet.has(key);
    });

    console.log(`不足しているレコード: ${missingInCycle2.length} 件\n`);

    if (missingInCycle2.length === 0) {
      console.log('✅ すべてのレコードが存在します');
      return;
    }

    // モジュール別の不足数
    const missingByModule = {};
    missingInCycle2.forEach(r => {
      if (!missingByModule[r.module_name]) {
        missingByModule[r.module_name] = [];
      }
      missingByModule[r.module_name].push(r.section_key);
    });

    console.log('不足レコードの内訳:');
    for (const [module, keys] of Object.entries(missingByModule)) {
      console.log(`  ${module}: ${keys.length} 件`);
      console.log(`    サンプル: ${keys.slice(0, 3).join(', ')}`);
    }
    console.log();

    // 新規レコードを作成
    const recordsToInsert = missingInCycle2.map(r => ({
      user_id: userId,
      module_name: r.module_name,
      section_key: r.section_key,
      cycle_number: 2,
      is_completed: false,
      is_correct: false,
      answer_count: 0,
      correct_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    console.log(`\n${recordsToInsert.length} 件のレコードを挿入開始...\n`);

    // バッチで挿入（50件ずつ、より安全に）
    const BATCH_SIZE = 50;
    let totalInserted = 0;
    let batchNumber = 1;

    for (let i = 0; i < recordsToInsert.length; i += BATCH_SIZE) {
      const batch = recordsToInsert.slice(i, i + BATCH_SIZE);

      console.log(`バッチ ${batchNumber}: ${batch.length} 件を挿入中...`);

      const { data: insertedData, error: insertError } = await supabase
        .from('user_learning_progress')
        .insert(batch)
        .select();

      if (insertError) {
        console.error(`❌ バッチ ${batchNumber} 挿入エラー:`, insertError.message);
        console.error('エラーコード:', insertError.code);
        console.error('詳細:', insertError.details);
        console.error('ヒント:', insertError.hint);
        break;
      }

      totalInserted += batch.length;
      console.log(`✅ バッチ ${batchNumber} 完了 (累計: ${totalInserted}/${recordsToInsert.length})`);
      batchNumber++;

      // 負荷軽減のため少し待機
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n✅ 合計 ${totalInserted} 件のレコードを挿入しました\n`);

    // 最終確認
    const { data: finalCycle2, error: finalError } = await supabase
      .from('user_learning_progress')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('cycle_number', 2);

    if (finalError) {
      console.error('❌ 最終確認エラー:', finalError);
      return;
    }

    console.log('=== 補完後の最終確認 ===');
    console.log(`第2周目の総レコード数: ${finalCycle2.length}`);
    console.log(`期待値: 876 件 ${finalCycle2.length === 876 ? '✅' : '❌'}`);

    if (finalCycle2.length === 876) {
      const answered = new Set(
        finalCycle2
          .filter(r => r.answer_count > 0)
          .map(r => `${r.module_name}::${r.section_key}`)
      );

      console.log(`回答済み: ${answered.size}/876 (${Math.round((answered.size / 876) * 100)}%)`);
      console.log('\n✅ 第2周目のデータ補完が完全に完了しました！');
    } else {
      console.log(`\n⚠️ まだ ${876 - finalCycle2.length} 件不足しています`);
    }

  } catch (error) {
    console.error('予期しないエラー:', error);
  }
}

directInsertMissingRecords();
