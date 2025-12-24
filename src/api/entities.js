import { supabase } from '@/lib/supabase'

// Entity classes that mimic base44 API structure but use Supabase
class Entity {
  constructor(tableName) {
    this.tableName = tableName
  }

  async list(orderBy = null) {
    let query = supabase.from(this.tableName).select('*')
    
    if (orderBy) {
      const [column, direction = 'asc'] = orderBy.startsWith('-') 
        ? [orderBy.slice(1), 'desc'] 
        : [orderBy, 'asc']
      query = query.order(column, { ascending: direction === 'asc' })
    }
    
    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  async get(id) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  async create(data) {
    const { data: result, error } = await supabase
      .from(this.tableName)
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  async update(id, data) {
    const { data: result, error } = await supabase
      .from(this.tableName)
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  async delete(id) {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return { success: true }
  }

  async filter(filters) {
    let query = supabase.from(this.tableName).select('*')
    
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value)
    })
    
    const { data, error } = await query
    if (error) throw error
    return data || []
  }
}

// Export entities matching base44 structure
export const Business = new Entity('businesses')
export const Project = new Entity('projects')
export const Script = new Entity('scripts')
export const BudgetEntry = new Entity('budget_entries')
export const CrewMember = new Entity('crew_members')
export const ShootSchedule = new Entity('shoot_schedules')
export const Shot = new Entity('shots')
export const PostProduction = new Entity('post_production')
export const ProductionTask = new Entity('production_tasks')
export const Casting = new Entity('casting')
export const PostVersion = new Entity('post_versions')
export const Location = new Entity('locations')
export const BusinessAccess = new Entity('business_access')
export const Task = new Entity('tasks')
export const Notification = new Entity('notifications')
export const Comment = new Entity('comments')
export const Document = new Entity('documents')
export const PodcastEpisode = new Entity('podcast_episodes')
export const PodcastChecklist = new Entity('podcast_checklists')
export const StoryboardFrame = new Entity('storyboard_frames')
export const ProjectAttachment = new Entity('project_attachments')
export const EquipmentItem = new Entity('equipment_items')
export const EquipmentCategory = new Entity('equipment_categories')
export const ProjectTeamMember = new Entity('project_team_members')
export const ProjectInvitation = new Entity('project_invitations')

// Auth wrapper
export const User = {
  me: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    
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
  },
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },
  signUp: async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    if (error) throw error
    return data
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },
  updateMe: async (data) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    
    // Check if user profile exists
    const { data: existingProfile } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()
    
    // Prepare user data
    const userData = {
      id: user.id,
      email: user.email,
      full_name: data.full_name,
      avatar_url: data.photo,
      ...(data.job_title && { job_title: data.job_title })
    }
    
    let profile
    if (existingProfile) {
      // Update existing profile
      const { data: updated, error: profileError } = await supabase
        .from('users')
        .update({
          full_name: data.full_name,
          avatar_url: data.photo,
          ...(data.job_title && { job_title: data.job_title })
        })
        .eq('id', user.id)
        .select()
        .single()
      
      if (profileError) throw profileError
      profile = updated
    } else {
      // Create new profile if it doesn't exist
      const { data: created, error: profileError } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single()
      
      if (profileError) throw profileError
      profile = created
    }
    
    // Update auth user metadata (non-blocking)
    supabase.auth.updateUser({
      data: {
        full_name: data.full_name,
        avatar_url: data.photo
      }
    }).catch(err => console.warn('Failed to update auth metadata:', err))
    
    return {
      id: user.id,
      email: user.email,
      full_name: profile.full_name || data.full_name,
      photo: profile.avatar_url || data.photo,
      role: profile.role || 'user',
      job_title: profile.job_title || data.job_title
    }
  }
}
