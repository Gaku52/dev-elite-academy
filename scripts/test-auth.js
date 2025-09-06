#!/usr/bin/env node

/**
 * Test authentication workflow
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const testAuth = async () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log('🧪 Testing Supabase Authentication\n');
  
  console.log('📝 Environment Variables:');
  console.log(`   URL: ${supabaseUrl}`);
  console.log(`   Key: ${supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'NOT SET'}\n`);
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('❌ Environment variables not set properly');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  const testEmail = 'test@dev-elite-academy.com';
  const testPassword = 'testpassword123';
  
  try {
    // Test sign up
    console.log('🔐 Testing account creation...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword
    });
    
    if (signUpError) {
      console.log('❌ SignUp Error:', signUpError.message);
      
      // If user already exists, try to sign in
      if (signUpError.message.includes('User already registered')) {
        console.log('👤 User already exists, trying to sign in...');
        
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testPassword
        });
        
        if (signInError) {
          console.log('❌ SignIn Error:', signInError.message);
        } else {
          console.log('✅ SignIn successful!');
          console.log('   User ID:', signInData.user?.id);
          console.log('   Email:', signInData.user?.email);
          
          // Check if profile was created
          await checkProfile(supabase, signInData.user?.id);
        }
      }
    } else {
      console.log('✅ SignUp successful!');
      console.log('   User ID:', signUpData.user?.id);
      console.log('   Email:', signUpData.user?.email);
      console.log('   Confirmation required:', !signUpData.user?.email_confirmed_at);
      
      // Check if profile was created by trigger
      setTimeout(async () => {
        await checkProfile(supabase, signUpData.user?.id);
      }, 1000);
    }
    
  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }
};

const checkProfile = async (supabase, userId) => {
  console.log('\n👤 Checking profile creation...');
  
  // Check in auth.users
  const { Client } = require('pg');
  require('dotenv').config({ path: '.env.local' });
  
  const config = {
    host: process.env.SUPABASE_HOST,
    port: process.env.SUPABASE_PORT,
    database: process.env.SUPABASE_DATABASE,
    user: process.env.SUPABASE_USER,
    password: process.env.SUPABASE_PASSWORD,
    ssl: { rejectUnauthorized: false }
  };
  
  const client = new Client(config);
  
  try {
    await client.connect();
    
    // Check auth.users
    const authResult = await client.query('SELECT id, email, created_at FROM auth.users WHERE id = $1', [userId]);
    console.log('📊 auth.users:', authResult.rows.length > 0 ? '✅ Found' : '❌ Not found');
    
    if (authResult.rows.length > 0) {
      console.log('   User ID:', authResult.rows[0].id);
      console.log('   Email:', authResult.rows[0].email);
    }
    
    // Check public.profiles
    const profileResult = await client.query('SELECT id, email, created_at FROM public.profiles WHERE id = $1', [userId]);
    console.log('📊 public.profiles:', profileResult.rows.length > 0 ? '✅ Found' : '❌ Not found');
    
    if (profileResult.rows.length > 0) {
      console.log('   Profile ID:', profileResult.rows[0].id);
      console.log('   Email:', profileResult.rows[0].email);
      console.log('   Created:', profileResult.rows[0].created_at);
    }
    
  } catch (error) {
    console.log('❌ Database check error:', error.message);
  } finally {
    await client.end();
  }
};

testAuth().catch(console.error);