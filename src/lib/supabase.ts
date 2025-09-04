import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// CI/CD環境用のService Role Keyを使用したクライアント
export const supabaseAdmin = supabaseUrl && (supabaseServiceKey || supabaseAnonKey)
  ? createClient(
      supabaseUrl, 
      supabaseServiceKey || supabaseAnonKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  : null

// 型定義
export interface Category {
  id: number
  name: string
  description: string | null
  icon: string | null
  color: string | null
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface LearningContent {
  id: number
  category_id: number
  title: string
  description: string | null
  content_type: 'ARTICLE' | 'VIDEO' | 'QUIZ' | 'EXERCISE' | 'FLASHCARD'
  content_body: Record<string, unknown>
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  estimated_time: number
  tags: string[]
  is_published: boolean
  created_at: string
  updated_at: string
  category?: Category
}

export interface Profile {
  id: string
  email: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  skill_level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  target_certifications: string[]
  created_at: string
  updated_at: string
}

// データ取得関数
export async function getCategories() {
  // CI/CD環境ではadminクライアントを使用
  const client = process.env.NODE_ENV === 'production' && process.env.SUPABASE_SERVICE_KEY 
    ? supabaseAdmin 
    : supabase
  
  if (!client) {
    return []
  }
    
  const { data, error } = await client
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  
  if (error) throw error
  return data as Category[]
}

export async function getLearningContents() {
  // CI/CD環境ではadminクライアントを使用
  const client = process.env.NODE_ENV === 'production' && process.env.SUPABASE_SERVICE_KEY 
    ? supabaseAdmin 
    : supabase
  
  if (!client) {
    return []
  }
    
  const { data, error } = await client
    .from('learning_contents')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('is_published', true)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as LearningContent[]
}