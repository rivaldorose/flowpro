import { supabase } from '@/lib/supabase'

// Supabase client wrapper for easy migration from base44
export const supabaseClient = supabase

// Helper functions to mimic base44 API structure
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  // Get user profile
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()
  
  return {
    id: user.id,
    email: user.email,
    full_name: profile?.full_name || user.user_metadata?.full_name || '',
    photo: profile?.avatar_url || user.user_metadata?.avatar_url || '',
    role: profile?.role || 'user'
  }
}

export default supabase

