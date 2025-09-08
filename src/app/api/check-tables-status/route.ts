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

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    // 1. 全テーブル一覧取得
    const { data: tables } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');

    // 2. 各テーブルの詳細情報取得
    const tableDetails: Record<string, any> = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    
    for (const table of (tables || [])) {
      const tableName = table.table_name;
      
      // カラム情報取得
      const { data: columns } = await supabaseAdmin
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable, column_default')
        .eq('table_schema', 'public')
        .eq('table_name', tableName)
        .order('ordinal_position');

      // テーブル行数取得
      let rowCount = 0;
      try {
        const { count } = await supabaseAdmin
          .from(tableName)
          .select('*', { count: 'exact', head: true });
        rowCount = count || 0;
      } catch {
        // エラーは無視（権限がない場合など）
      }

      tableDetails[tableName] = {
        columns: columns || [],
        rowCount
      };
    }

    // 3. 認証関連テーブルの存在確認
    const progressTables = ['user_progress', 'section_progress', 'learning_sessions'];
    const authTables = ['users']; // ユーザーマスターテーブル
    const coreAppTables = ['learning_contents', 'categories'];
    
    const existingProgressTables = progressTables.filter(table => tables?.some(t => t.table_name === table));
    const existingAuthTables = authTables.filter(table => tables?.some(t => t.table_name === table));
    const existingCoreAppTables = coreAppTables.filter(table => tables?.some(t => t.table_name === table));

    // 4. ID型の判定
    let idType = 'UUID';
    if (tableDetails['learning_contents']?.columns) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const idColumn = tableDetails['learning_contents'].columns.find((c: any) => c.column_name === 'id');
      if (idColumn?.data_type === 'integer' || idColumn?.data_type === 'bigint') {
        idType = 'INTEGER';
      }
    }

    // 5. 認証統合状況の判定
    let authIntegrationStatus = 'not_implemented';
    if (existingProgressTables.length > 0 && existingAuthTables.length > 0) {
      authIntegrationStatus = 'fully_integrated';
    } else if (existingProgressTables.length > 0) {
      authIntegrationStatus = 'partial_tables_only';
    }

    // 6. 推奨アクションの決定
    const recommendations = [];
    
    if (existingCoreAppTables.length === 0) {
      recommendations.push({
        priority: 'high',
        action: 'create_core_tables',
        message: 'コアアプリテーブル（learning_contents, categories）を作成してください'
      });
    }
    
    if (existingAuthTables.length === 0) {
      recommendations.push({
        priority: 'high', 
        action: 'create_user_master',
        message: 'ユーザーマスターテーブル（users）を作成してください'
      });
    }
    
    if (existingProgressTables.length === 0) {
      recommendations.push({
        priority: 'medium',
        action: 'create_progress_tables',
        message: '学習進捗テーブルを作成してください'
      });
    } else if (authIntegrationStatus === 'partial_tables_only') {
      recommendations.push({
        priority: 'medium',
        action: 'update_for_auth',
        message: '既存の進捗テーブルを認証システム統合版に更新してください'
      });
    }

    const result = {
      summary: {
        totalTables: tables?.length || 0,
        coreAppTablesCount: existingCoreAppTables.length,
        progressTablesCount: existingProgressTables.length, 
        authTablesCount: existingAuthTables.length,
        idType,
        authIntegrationStatus
      },
      tables: {
        existing: tables?.map(t => t.table_name) || [],
        coreApp: existingCoreAppTables,
        progress: existingProgressTables,
        auth: existingAuthTables
      },
      details: tableDetails,
      recommendations,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('テーブル状況確認エラー:', error);
    return NextResponse.json({ 
      error: 'テーブル状況確認中にエラーが発生しました',
      details: (error as Error).message 
    }, { status: 500 });
  }
}