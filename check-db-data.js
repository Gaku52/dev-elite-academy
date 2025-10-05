const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ttsdtjzcgxufudepclzg.supabase.co';
const supabaseServiceKey = 'sb_secret_4liMa8VzGiA1UUeXOmnDMw_LcRGzXsU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkData() {
  try {
    // 1. すべてのユーザーを取得
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }

    console.log('\n=== Users ===');
    users.users.forEach(user => {
      console.log(`User ID: ${user.id}, Email: ${user.email}`);
    });

    if (users.users.length === 0) {
      console.log('No users found');
      return;
    }

    // すべてのユーザーのデータを確認
    for (const user of users.users) {
      const userId = user.id;
      console.log(`\n=== Checking data for User: ${userId} (${user.email}) ===\n`);

    // 2. 周回別の統計を取得
    const { data: allProgress, error: progressError } = await supabase
      .from('user_learning_progress')
      .select('*')
      .eq('user_id', userId)
      .order('cycle_number', { ascending: true })
      .order('created_at', { ascending: true });

    if (progressError) {
      console.error('Error fetching progress:', progressError);
      return;
    }

    // 周回別に集計
    const cycleStats = {};

    allProgress.forEach(record => {
      const cycle = record.cycle_number || 1;
      if (!cycleStats[cycle]) {
        cycleStats[cycle] = {
          totalRecords: 0,
          hasAnswerCount: 0,
          isCompletedTrue: 0,
          totalAnswerCount: 0,
          records: []
        };
      }

      cycleStats[cycle].totalRecords++;
      if ((record.answer_count || 0) > 0) {
        cycleStats[cycle].hasAnswerCount++;
      }
      if (record.is_completed) {
        cycleStats[cycle].isCompletedTrue++;
      }
      cycleStats[cycle].totalAnswerCount += (record.answer_count || 0);

      // サンプルレコードを保存
      if (cycleStats[cycle].records.length < 5) {
        cycleStats[cycle].records.push({
          section_key: record.section_key,
          module_name: record.module_name,
          is_completed: record.is_completed,
          answer_count: record.answer_count,
          correct_count: record.correct_count
        });
      }
    });

    // 結果を表示
    Object.keys(cycleStats).sort((a, b) => a - b).forEach(cycle => {
      const stats = cycleStats[cycle];
      console.log(`\n第${cycle}周目:`);
      console.log(`  総レコード数: ${stats.totalRecords}`);
      console.log(`  answer_count > 0: ${stats.hasAnswerCount} (${Math.round(stats.hasAnswerCount / stats.totalRecords * 100)}%)`);
      console.log(`  is_completed = true: ${stats.isCompletedTrue} (${Math.round(stats.isCompletedTrue / stats.totalRecords * 100)}%)`);
      console.log(`  総answer_count: ${stats.totalAnswerCount}`);
      console.log(`  サンプルレコード:`);
      stats.records.forEach((r, i) => {
        console.log(`    ${i + 1}. ${r.module_name}/${r.section_key}: completed=${r.is_completed}, answer_count=${r.answer_count}, correct_count=${r.correct_count}`);
      });
    });

    console.log('\n=== 問題の分析 ===');
    const cycle1 = cycleStats[1];
    if (cycle1) {
      const completedButNoAnswer = cycle1.isCompletedTrue - cycle1.hasAnswerCount;
      if (completedButNoAnswer > 0) {
        console.log(`⚠️ 第1周目: is_completed=true だが answer_count=0 のレコードが ${completedButNoAnswer} 件存在`);
        console.log('   → これが100%→36%になった原因の可能性が高い');
      }

      if (cycle1.isCompletedTrue === 876 || cycle1.totalRecords === 876) {
        console.log(`✓ 第1周目のレコード数は876件で正常`);
      } else {
        console.log(`⚠️ 第1周目のレコード数が876件ではない: ${cycle1.totalRecords}件`);
      }
    }
    } // end of user loop

  } catch (error) {
    console.error('Error:', error);
  }
}

checkData();
