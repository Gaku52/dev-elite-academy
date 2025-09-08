import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        completed_contents: 0,
        total_contents: 0,
        completed_hours: 0,
        total_estimated_hours: 0,
        learning_streak: 0,
        achievements: []
      });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // 基本進捗データの取得
    const [progressResult, contentsResult, sessionsResult] = await Promise.all([
      supabaseAdmin
        .from('user_progress')
        .select('*, learning_contents(estimated_time)')
        .eq('user_id', userId),
      supabaseAdmin
        .from('learning_contents')
        .select('estimated_time')
        .eq('is_published', true),
      supabaseAdmin
        .from('learning_sessions')
        .select('session_date, duration_minutes')
        .eq('user_id', userId)
        .order('session_date', { ascending: false })
    ]);

    const userProgress = progressResult.data || [];
    const allContents = contentsResult.data || [];
    const sessions = sessionsResult.data || [];

    // 完了したコンテンツの計算
    const completedContents = userProgress.filter(p => p.status === 'completed').length;
    const totalContents = allContents.length;

    // 学習時間の計算
    const completedHours = userProgress
      .filter(p => p.status === 'completed')
      .reduce((total, p) => total + (p.learning_contents?.estimated_time || 0), 0) / 60;

    const totalEstimatedHours = allContents.reduce((total, c) => total + (c.estimated_time || 0), 0) / 60;

    // 学習ストリークの計算（簡易版）
    let streak = 0;
    const uniqueDates = [...new Set(sessions.map(s => s.session_date))].sort().reverse();
    
    for (let i = 0; i < uniqueDates.length; i++) {
      const currentDate = new Date(uniqueDates[i]);
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);
      
      if (currentDate.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
        streak++;
      } else {
        break;
      }
    }

    // 成果の計算
    const achievements = [];
    if (completedContents > 0) achievements.push('初回完了');
    if (completedContents >= 5) achievements.push('学習継続者');
    if (completedContents >= 10) achievements.push('専門学習者');
    if (streak >= 3) achievements.push('継続の達人');
    if (streak >= 7) achievements.push('週間チャレンジャー');

    return NextResponse.json({
      completed_contents: completedContents,
      total_contents: totalContents,
      completed_hours: Math.round(completedHours * 10) / 10,
      total_estimated_hours: Math.round(totalEstimatedHours * 10) / 10,
      learning_streak: streak,
      achievements,
      progress_percentage: totalContents > 0 ? Math.round((completedContents / totalContents) * 100) : 0
    });

  } catch (error) {
    console.error('User progress API error:', error);
    return NextResponse.json({
      completed_contents: 0,
      total_contents: 0,
      completed_hours: 0,
      total_estimated_hours: 0,
      learning_streak: 0,
      achievements: [],
      error: 'Failed to fetch user progress'
    }, { status: 500 });
  }
}