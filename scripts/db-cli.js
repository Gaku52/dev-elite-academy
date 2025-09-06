#!/usr/bin/env node

/**
 * Database CLI for Dev Elite Academy
 * Supabaseデータベースの管理用CLIツール
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 環境変数の読み込み
require('dotenv').config({ path: '.env.local' });

// コマンドライン引数の解析
const args = process.argv.slice(2);
const command = args[0];
const options = args.slice(1);

// データベース接続設定
const getDbConfig = () => {
  const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  
  if (!connectionString) {
    // 個別の環境変数から構築
    const host = process.env.SUPABASE_HOST || 'aws-0-ap-southeast-1.pooler.supabase.com';
    const port = process.env.SUPABASE_PORT || '6543';
    const database = process.env.SUPABASE_DATABASE || 'postgres';
    const user = process.env.SUPABASE_USER || 'postgres.ttsdtjzcgxufudepclzg';
    const password = process.env.SUPABASE_PASSWORD;
    
    if (!password) {
      console.error('❌ エラー: SUPABASE_PASSWORD環境変数が設定されていません');
      console.log('💡 .env.localファイルに以下を追加してください:');
      console.log('SUPABASE_PASSWORD=your-database-password');
      process.exit(1);
    }
    
    return {
      host,
      port,
      database,
      user,
      password,
      ssl: { rejectUnauthorized: false }
    };
  }
  
  // 接続文字列から解析
  return connectionString;
};

// カラーコード
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// ユーティリティ関数
const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bright}${colors.cyan}═══ ${msg} ═══${colors.reset}\n`)
};

// データベース接続
const connectDB = async () => {
  const client = new Client(getDbConfig());
  try {
    await client.connect();
    log.success('データベースに接続しました');
    return client;
  } catch (error) {
    log.error(`接続エラー: ${error.message}`);
    process.exit(1);
  }
};

// SQLファイルの実行
const executeSQLFile = async (client, filePath) => {
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // SQLを個別のステートメントに分割（セミコロンで分割）
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    log.info(`${statements.length}個のSQLステートメントを実行します`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        await client.query(statement);
        process.stdout.write('.');
      } catch (error) {
        console.log('');
        log.error(`ステートメント ${i + 1} でエラー: ${error.message}`);
        log.warning(`失敗したSQL: ${statement.substring(0, 100)}...`);
      }
    }
    
    console.log('');
    log.success(`${path.basename(filePath)} を実行しました`);
  } catch (error) {
    log.error(`ファイル読み込みエラー: ${error.message}`);
  }
};

// コマンド: migrate
const migrate = async () => {
  log.header('データベースマイグレーション');
  
  const client = await connectDB();
  const sqlDir = path.join(__dirname, '..', 'sql');
  
  try {
    // マイグレーション履歴テーブルの作成
    await client.query(`
      CREATE TABLE IF NOT EXISTS migration_history (
        id SERIAL PRIMARY KEY,
        filename TEXT UNIQUE NOT NULL,
        executed_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    
    // 実行済みマイグレーションの取得
    const result = await client.query('SELECT filename FROM migration_history');
    const executed = new Set(result.rows.map(r => r.filename));
    
    // SQLファイルの取得と実行
    const files = fs.readdirSync(sqlDir)
      .filter(f => f.endsWith('.sql'))
      .sort();
    
    let newMigrations = 0;
    for (const file of files) {
      if (!executed.has(file)) {
        log.info(`実行中: ${file}`);
        await executeSQLFile(client, path.join(sqlDir, file));
        await client.query('INSERT INTO migration_history (filename) VALUES ($1)', [file]);
        newMigrations++;
      }
    }
    
    if (newMigrations === 0) {
      log.info('新しいマイグレーションはありません');
    } else {
      log.success(`${newMigrations}個のマイグレーションを実行しました`);
    }
    
  } finally {
    await client.end();
  }
};

// コマンド: reset
const reset = async () => {
  log.header('データベースリセット');
  log.warning('すべてのテーブルとデータが削除されます！');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const answer = await new Promise(resolve => {
    rl.question('本当に実行しますか？ (yes/no): ', resolve);
  });
  rl.close();
  
  if (answer.toLowerCase() !== 'yes') {
    log.info('キャンセルしました');
    return;
  }
  
  const client = await connectDB();
  
  try {
    // すべてのテーブルを削除
    await client.query(`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO postgres;
      GRANT ALL ON SCHEMA public TO public;
    `);
    
    log.success('データベースをリセットしました');
    
    // マイグレーションを再実行
    await migrate();
    
  } finally {
    await client.end();
  }
};

// コマンド: status
const status = async () => {
  log.header('データベース状態');
  
  const client = await connectDB();
  
  try {
    // テーブル一覧
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    log.info(`テーブル数: ${tables.rows.length}`);
    console.log('\n📊 テーブル一覧:');
    
    for (const table of tables.rows) {
      const countResult = await client.query(
        `SELECT COUNT(*) as count FROM ${table.table_name}`
      );
      const count = countResult.rows[0].count;
      console.log(`  • ${table.table_name}: ${count}行`);
    }
    
    // マイグレーション履歴
    const migrations = await client.query(`
      SELECT filename, executed_at 
      FROM migration_history 
      ORDER BY executed_at DESC 
      LIMIT 5
    `);
    
    if (migrations.rows.length > 0) {
      console.log('\n📝 最近のマイグレーション:');
      migrations.rows.forEach(m => {
        const date = new Date(m.executed_at).toLocaleString('ja-JP');
        console.log(`  • ${m.filename} (${date})`);
      });
    }
    
  } finally {
    await client.end();
  }
};

// コマンド: seed
const seed = async () => {
  log.header('初期データ投入');
  
  const client = await connectDB();
  const sqlDir = path.join(__dirname, '..', 'sql');
  
  try {
    const seedFiles = [
      '02_initial_data.sql'
    ];
    
    for (const file of seedFiles) {
      const filePath = path.join(sqlDir, file);
      if (fs.existsSync(filePath)) {
        log.info(`実行中: ${file}`);
        await executeSQLFile(client, filePath);
      }
    }
    
    log.success('初期データを投入しました');
    
  } finally {
    await client.end();
  }
};

// コマンド: query
const query = async (sql) => {
  if (!sql) {
    log.error('SQLクエリを指定してください');
    return;
  }
  
  const client = await connectDB();
  
  try {
    const result = await client.query(sql);
    
    if (result.rows && result.rows.length > 0) {
      console.table(result.rows);
      log.info(`${result.rows.length}行を取得しました`);
    } else if (result.command === 'SELECT') {
      log.info('結果は0行です');
    } else {
      log.success(`${result.command}を実行しました (${result.rowCount}行影響)`);
    }
    
  } catch (error) {
    log.error(`クエリエラー: ${error.message}`);
  } finally {
    await client.end();
  }
};

// ヘルプ表示
const showHelp = () => {
  console.log(`
${colors.bright}Dev Elite Academy - Database CLI${colors.reset}

${colors.cyan}使用方法:${colors.reset}
  node scripts/db-cli.js <command> [options]

${colors.cyan}コマンド:${colors.reset}
  ${colors.green}migrate${colors.reset}     - SQLファイルを順番に実行してテーブルを作成
  ${colors.green}reset${colors.reset}       - データベースをリセットして再構築
  ${colors.green}status${colors.reset}      - データベースの状態を表示
  ${colors.green}seed${colors.reset}        - 初期データを投入
  ${colors.green}query${colors.reset} <sql> - 任意のSQLクエリを実行
  ${colors.green}help${colors.reset}        - このヘルプを表示

${colors.cyan}例:${colors.reset}
  node scripts/db-cli.js migrate
  node scripts/db-cli.js status
  node scripts/db-cli.js query "SELECT * FROM profiles LIMIT 5"
  node scripts/db-cli.js reset

${colors.cyan}環境変数 (.env.local):${colors.reset}
  SUPABASE_HOST     - ホスト名
  SUPABASE_PORT     - ポート番号 (6543)
  SUPABASE_DATABASE - データベース名 (postgres)
  SUPABASE_USER     - ユーザー名
  SUPABASE_PASSWORD - パスワード
  `);
};

// メイン処理
const main = async () => {
  switch (command) {
    case 'migrate':
      await migrate();
      break;
    case 'reset':
      await reset();
      break;
    case 'status':
      await status();
      break;
    case 'seed':
      await seed();
      break;
    case 'query':
      await query(options.join(' '));
      break;
    case 'help':
    case undefined:
      showHelp();
      break;
    default:
      log.error(`不明なコマンド: ${command}`);
      showHelp();
  }
};

// エラーハンドリング
process.on('unhandledRejection', (error) => {
  log.error(`予期しないエラー: ${error.message}`);
  process.exit(1);
});

// 実行
main().catch(error => {
  log.error(`実行エラー: ${error.message}`);
  process.exit(1);
});