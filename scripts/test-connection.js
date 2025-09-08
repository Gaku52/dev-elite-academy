#!/usr/bin/env node

/**
 * Quick database connection test
 */

const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const testConnection = async () => {
  console.log('🔍 Testing database connection...\n');
  
  const config = {
    host: process.env.SUPABASE_HOST,
    port: process.env.SUPABASE_PORT,
    database: process.env.SUPABASE_DATABASE,
    user: process.env.SUPABASE_USER,
    password: process.env.SUPABASE_PASSWORD,
    ssl: { rejectUnauthorized: false }
  };
  
  console.log('📝 Connection config:');
  console.log(`   Host: ${config.host}`);
  console.log(`   Port: ${config.port}`);
  console.log(`   Database: ${config.database}`);
  console.log(`   User: ${config.user}`);
  console.log(`   Password: ${config.password ? '***' : 'NOT SET'}\n`);
  
  if (!config.password) {
    console.log('❌ SUPABASE_PASSWORD is not set in .env.local');
    return;
  }
  
  const client = new Client(config);
  
  try {
    await client.connect();
    console.log('✅ Connection successful!');
    
    // Basic queries
    const versionResult = await client.query('SELECT version()');
    console.log('\n🐘 PostgreSQL version:');
    console.log('   ' + versionResult.rows[0].version.split(',')[0]);
    
    const dbResult = await client.query('SELECT current_database(), current_user');
    console.log('\n📊 Connection details:');
    console.log(`   Database: ${dbResult.rows[0].current_database}`);
    console.log(`   User: ${dbResult.rows[0].current_user}`);
    
    console.log('\n🎉 Ready for Claude Code database operations!');
    
  } catch (error) {
    console.log('❌ Connection failed:');
    console.log('   ' + error.message);
    
    if (error.message.includes('password authentication failed')) {
      console.log('\n💡 Suggestions:');
      console.log('   • Check your password in .env.local');
      console.log('   • Reset password in Supabase Dashboard > Settings > Database');
    }
  } finally {
    await client.end();
  }
};

testConnection().catch(console.error);