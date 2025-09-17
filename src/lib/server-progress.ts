import { createClient } from '@supabase/supabase-js';

// サーバーサイドでの進捗データ取得
export async function getServerSideProgress(userId?: string, moduleName?: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('⚠️ Supabase configuration missing for server-side progress');
    return { progress: [], stats: null };
  }

  if (!userId) {
    console.log('👤 No user ID provided for server-side progress');
    return { progress: [], stats: null };
  }

  // サービスロール用のSupabaseクライアント
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    // 進捗データを取得
    let query = supabase
      .from('learning_progress')
      .select('*')
      .eq('user_id', userId);

    if (moduleName) {
      query = query.eq('module_name', moduleName);
    }

    const { data: progress, error: progressError } = await query;

    if (progressError) {
      console.error('Error fetching progress:', progressError);
      return { progress: [], stats: null };
    }

    // 統計情報を計算
    const stats = calculateProgressStats(progress || []);

    return {
      progress: progress || [],
      stats
    };
  } catch (error) {
    console.error('Server-side progress fetch error:', error);
    return { progress: [], stats: null };
  }
}

// 進捗統計の計算
function calculateProgressStats(progress: Array<{
  module_name: string;
  is_completed: boolean;
  [key: string]: unknown;
}>) {
  const moduleStats: { [key: string]: { total: number; completed: number } } = {};
  let totalQuestions = 0;
  let completedQuestions = 0;

  progress.forEach(item => {
    const moduleName = item.module_name;

    if (!moduleStats[moduleName]) {
      moduleStats[moduleName] = { total: 0, completed: 0 };
    }

    moduleStats[moduleName].total += 1;
    totalQuestions += 1;

    if (item.is_completed) {
      moduleStats[moduleName].completed += 1;
      completedQuestions += 1;
    }
  });

  const correctRate = totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0;

  return {
    totalQuestions,
    completedQuestions,
    correctRate,
    moduleStats
  };
}

// モジュール別進捗率を計算
export function calculateModuleProgress(stats: {
  moduleStats?: { [key: string]: { total: number; completed: number } };
} | null, moduleQuizCounts: Record<string, number>) {
  const progressData: { [key: number]: number } = {};

  const moduleNameMapping: Record<number, string> = {
    1: 'computer-systems',
    2: 'algorithms-programming',
    3: 'database',
    4: 'network',
    5: 'security',
    6: 'system-development',
    7: 'management-legal',
    8: 'strategy'
  };

  if (stats && stats.moduleStats) {
    Object.entries(moduleNameMapping).forEach(([topicId, moduleName]) => {
      const moduleProgress = stats.moduleStats![moduleName];
      const totalQuizzes = moduleQuizCounts[moduleName] || 0;

      if (moduleProgress && totalQuizzes > 0) {
        const progressPercentage = Math.round((moduleProgress.completed / totalQuizzes) * 100);
        progressData[parseInt(topicId)] = progressPercentage;
      } else {
        progressData[parseInt(topicId)] = 0;
      }
    });
  } else {
    // デフォルト値
    Object.keys(moduleNameMapping).forEach(key => {
      progressData[parseInt(key)] = 0;
    });
  }

  return progressData;
}