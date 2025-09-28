/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

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

    // 基本情報技術者試験の進捗データを取得
    const [learningProgressResult, modulesResult, sessionsResult] = await Promise.all([
      supabaseAdmin
        .from('user_learning_progress')
        .select('*')
        .eq('user_id', userId),
      supabaseAdmin
        .from('user_learning_progress')
        .select('module_name')
        .eq('user_id', userId)
        .neq('module_name', null),
      supabaseAdmin
        .from('learning_sessions')
        .select('session_date, duration_minutes')
        .eq('user_id', userId)
        .order('session_date', { ascending: false })
    ]);

    const userProgress = learningProgressResult.data || [];
    const uniqueModules = [...new Set((modulesResult.data || []).map((m: any) => m.module_name))];
    const sessions = sessionsResult.data || [];

    // 基本情報技術者試験の進捗計算
    const completedSections = userProgress.filter((p: any) => p.is_completed === true).length;
    const totalSections = userProgress.length;

    // 目標：全8分野の学習セクション（推定120セクション）
    const targetTotalSections = 120;

    // 学習時間の計算（1セクション平均30分と仮定）
    const completedHours = completedSections * 0.5; // 30分 = 0.5時間
    const totalEstimatedHours = targetTotalSections * 0.5;

    // 学習ストリークの計算（簡易版）
    let streak = 0;
    const uniqueDates = [...new Set(sessions.map((s: any) => s.session_date))].sort().reverse();
    
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

    // 基本情報技術者試験向けの成果計算
    const achievements = [];
    if (completedSections > 0) achievements.push('学習スタート');
    if (completedSections >= 10) achievements.push('基礎力習得');
    if (completedSections >= 30) achievements.push('中級レベル');
    if (completedSections >= 60) achievements.push('上級レベル');
    if (uniqueModules.length >= 4) achievements.push('幅広い知識');
    if (uniqueModules.length >= 8) achievements.push('全分野学習');
    if (streak >= 3) achievements.push('継続の達人');
    if (streak >= 7) achievements.push('週間チャレンジャー');

    return NextResponse.json({
      completed_contents: completedSections,
      total_contents: Math.max(totalSections, targetTotalSections),
      completed_hours: Math.round(completedHours * 10) / 10,
      total_estimated_hours: Math.round(totalEstimatedHours * 10) / 10,
      learning_streak: streak,
      achievements,
      progress_percentage: targetTotalSections > 0 ? Math.round((completedSections / targetTotalSections) * 100) : 0,
      modules_studied: uniqueModules.length,
      total_modules: 8 // 基本情報技術者試験の8分野
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