-- ============================================
-- FlowPro Complete Supabase Database Schema
-- ============================================
-- Run this complete SQL script in your Supabase SQL Editor
-- This combines the main schema + equipment/team members migration
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE TABLES
-- ============================================

-- Users profile table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  phone TEXT,
  job_title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Business Access table (for user-business relationships)
CREATE TABLE IF NOT EXISTS business_access (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT, -- Alternative field name
  description TEXT,
  status TEXT DEFAULT 'Planning',
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_date TIMESTAMPTZ DEFAULT NOW(), -- Alternative field name
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Scripts table
CREATE TABLE IF NOT EXISTS scripts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  version TEXT,
  status TEXT DEFAULT 'Draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW(), -- Alternative field name
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Budget Entries table
CREATE TABLE IF NOT EXISTS budget_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  estimated_cost DECIMAL(10, 2),
  actual_cost DECIMAL(10, 2),
  status TEXT DEFAULT 'Planned',
  vendor TEXT,
  is_budget BOOLEAN DEFAULT false,
  date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Crew Members table
CREATE TABLE IF NOT EXISTS crew_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  department TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shoot Schedules table
CREATE TABLE IF NOT EXISTS shoot_schedules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  shoot_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  location_id UUID,
  description TEXT,
  status TEXT DEFAULT 'Scheduled',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shots table
CREATE TABLE IF NOT EXISTS shots (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  script_id UUID REFERENCES scripts(id) ON DELETE SET NULL,
  shot_number TEXT NOT NULL,
  scene_number TEXT,
  scene_description TEXT,
  description TEXT,
  shot_type TEXT,
  camera_angle TEXT,
  duration_seconds INTEGER,
  duration TEXT,
  status TEXT DEFAULT 'Planned',
  priority TEXT,
  reference_image TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post Production table
CREATE TABLE IF NOT EXISTS post_production (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  shot_id UUID REFERENCES shots(id) ON DELETE SET NULL,
  task_type TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'To Do',
  draft_version INTEGER DEFAULT 1,
  feedback TEXT,
  due_date DATE,
  video_link TEXT,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  editor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post Versions table
CREATE TABLE IF NOT EXISTS post_versions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_production_id UUID REFERENCES post_production(id) ON DELETE CASCADE,
  version_number TEXT NOT NULL,
  file_url TEXT,
  video_link TEXT,
  notes TEXT,
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Production Tasks table
CREATE TABLE IF NOT EXISTS production_tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  item TEXT, -- Alternative field name
  category TEXT,
  description TEXT,
  notes TEXT,
  status TEXT DEFAULT 'To Do',
  priority TEXT DEFAULT 'Medium',
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Casting table
CREATE TABLE IF NOT EXISTS casting (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role_name TEXT,
  role TEXT,
  actor_name TEXT,
  actor_email TEXT,
  actor_phone TEXT,
  contact_info TEXT,
  status TEXT DEFAULT 'Pending',
  audition_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  country TEXT,
  location_type TEXT,
  type TEXT, -- Alternative field name
  coordinates JSONB,
  daily_rate DECIMAL(10, 2),
  permit_required BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'Pending',
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  cost DECIMAL(10, 2),
  availability TEXT,
  image_url TEXT,
  photos TEXT[],
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW() -- Alternative field name
);

-- Tasks table (general tasks)
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'To Do',
  priority TEXT DEFAULT 'Medium',
  assigned_to TEXT, -- Can be email or UUID
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_date TIMESTAMPTZ DEFAULT NOW(), -- Alternative field name
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT, -- Alternative field name
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  link TEXT,
  related_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_date TIMESTAMPTZ DEFAULT NOW() -- Alternative field name
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  entity_type TEXT NOT NULL, -- 'project', 'script', 'shot', etc.
  entity_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  file_name TEXT, -- Alternative field name
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  entity_type TEXT,
  entity_id UUID,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Podcast Episodes table
CREATE TABLE IF NOT EXISTS podcast_episodes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  episode_number INTEGER,
  description TEXT,
  audio_url TEXT,
  duration_seconds INTEGER,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  guest_name TEXT,
  guest_email TEXT,
  recording_date DATE,
  recording_time TIME,
  key_topics TEXT[],
  status TEXT DEFAULT 'Idea',
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Podcast Checklists table
CREATE TABLE IF NOT EXISTS podcast_checklists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  episode_id UUID REFERENCES podcast_episodes(id) ON DELETE CASCADE,
  task TEXT NOT NULL,
  category TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Storyboard Frames table
CREATE TABLE IF NOT EXISTS storyboard_frames (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  shot_id UUID REFERENCES shots(id) ON DELETE SET NULL,
  linked_shot_id UUID REFERENCES shots(id) ON DELETE SET NULL,
  frame_number INTEGER NOT NULL,
  image_url TEXT,
  description TEXT,
  notes TEXT,
  status TEXT DEFAULT 'Draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Attachments table
CREATE TABLE IF NOT EXISTS project_attachments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EQUIPMENT TABLES
-- ============================================

-- Equipment Categories table
CREATE TABLE IF NOT EXISTS equipment_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Equipment Items table
CREATE TABLE IF NOT EXISTS equipment_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  category_id UUID REFERENCES equipment_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  specifications TEXT,
  source_type TEXT NOT NULL DEFAULT 'needed', -- 'owned', 'rented', 'borrowed', 'needed'
  source_name TEXT, -- Vendor name or inventory location
  status TEXT DEFAULT 'needed', -- 'needed', 'confirmed', 'reserved', 'picked_up', 'returned'
  daily_cost DECIMAL(10, 2),
  total_cost DECIMAL(10, 2),
  days_needed TEXT[], -- Array of day numbers or dates
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Equipment Reservations table (links equipment to shoot days)
CREATE TABLE IF NOT EXISTS equipment_reservations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  equipment_id UUID REFERENCES equipment_items(id) ON DELETE CASCADE,
  shoot_schedule_id UUID REFERENCES shoot_schedules(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'reserved',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TEAM MEMBERS & PROJECT ACCESS
-- ============================================

-- Project Team Members table
CREATE TABLE IF NOT EXISTS project_team_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'viewer', -- 'owner', 'editor', 'commenter', 'viewer'
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  joined_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending', -- 'pending', 'active', 'removed'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Project Invitations table
CREATE TABLE IF NOT EXISTS project_invitations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer',
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  message TEXT,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resent_at TIMESTAMPTZ,
  resent_count INTEGER DEFAULT 0
);

-- Project Settings table
CREATE TABLE IF NOT EXISTS project_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
  default_role TEXT DEFAULT 'editor',
  editors_can_invite BOOLEAN DEFAULT true,
  members_can_see_list BOOLEAN DEFAULT false,
  visibility TEXT DEFAULT 'private', -- 'private', 'link', 'public'
  share_link TEXT UNIQUE,
  share_password TEXT,
  share_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PRODUCTION SCHEDULE ENHANCEMENTS
-- ============================================

-- Shoot Day Details table (extends shoot_schedules)
CREATE TABLE IF NOT EXISTS shoot_day_details (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  shoot_schedule_id UUID REFERENCES shoot_schedules(id) ON DELETE CASCADE UNIQUE,
  call_time TIME,
  wrap_time TIME,
  weather_forecast JSONB,
  production_notes TEXT,
  location_notes TEXT,
  parking_info TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Schedule Timeline Blocks table
CREATE TABLE IF NOT EXISTS schedule_timeline_blocks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  shoot_schedule_id UUID REFERENCES shoot_schedules(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL, -- 'crew_call', 'cast_call', 'shoot', 'setup_change', 'lunch', 'break', 'wrap'
  start_time TIME NOT NULL,
  end_time TIME,
  duration_minutes INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  scene_numbers TEXT[],
  shot_ids UUID[],
  cast_ids UUID[],
  crew_ids UUID[],
  equipment_ids UUID[],
  location_id UUID,
  notes TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shoot Day Cast table
CREATE TABLE IF NOT EXISTS shoot_day_cast (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  shoot_schedule_id UUID REFERENCES shoot_schedules(id) ON DELETE CASCADE,
  casting_id UUID REFERENCES casting(id) ON DELETE CASCADE,
  call_time TIME,
  wrap_time TIME,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(shoot_schedule_id, casting_id)
);

-- Shoot Day Crew table
CREATE TABLE IF NOT EXISTS shoot_day_crew (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  shoot_schedule_id UUID REFERENCES shoot_schedules(id) ON DELETE CASCADE,
  crew_member_id UUID REFERENCES crew_members(id) ON DELETE CASCADE,
  call_time TIME,
  wrap_time TIME,
  role TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(shoot_schedule_id, crew_member_id)
);

-- Activity Log table
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL, -- 'created', 'updated', 'deleted', 'shared', etc.
  entity_type TEXT NOT NULL, -- 'project', 'shot', 'schedule', 'equipment', etc.
  entity_id UUID,
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MIGRATION: Add missing columns to existing tables
-- ============================================

-- ============================================
-- MIGRATION: Add optional columns to existing tables
-- ============================================
-- These columns are added after table creation to support both old and new schemas

-- Add optional columns to comments if they don't exist
DO $$ 
BEGIN
  -- Add project_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'comments' AND column_name = 'project_id'
  ) THEN
    ALTER TABLE comments ADD COLUMN project_id UUID REFERENCES projects(id) ON DELETE CASCADE;
  END IF;
  
  -- Add task_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'comments' AND column_name = 'task_id'
  ) THEN
    ALTER TABLE comments ADD COLUMN task_id UUID REFERENCES tasks(id) ON DELETE CASCADE;
  END IF;
  
  -- Add mentions
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'comments' AND column_name = 'mentions'
  ) THEN
    ALTER TABLE comments ADD COLUMN mentions TEXT[];
  END IF;
END $$;

-- Add optional columns to documents if they don't exist
DO $$ 
BEGIN
  -- Add project_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'documents' AND column_name = 'project_id'
  ) THEN
    ALTER TABLE documents ADD COLUMN project_id UUID REFERENCES projects(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ============================================
-- INDEXES
-- ============================================

-- Core table indexes
CREATE INDEX IF NOT EXISTS idx_businesses_created_by ON businesses(created_by);
CREATE INDEX IF NOT EXISTS idx_business_access_business_id ON business_access(business_id);
CREATE INDEX IF NOT EXISTS idx_business_access_user_email ON business_access(user_email);
CREATE INDEX IF NOT EXISTS idx_projects_business_id ON projects(business_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);
CREATE INDEX IF NOT EXISTS idx_scripts_project_id ON scripts(project_id);
CREATE INDEX IF NOT EXISTS idx_budget_entries_project_id ON budget_entries(project_id);
CREATE INDEX IF NOT EXISTS idx_crew_members_project_id ON crew_members(project_id);
CREATE INDEX IF NOT EXISTS idx_crew_members_business_id ON crew_members(business_id);
CREATE INDEX IF NOT EXISTS idx_shoot_schedules_project_id ON shoot_schedules(project_id);
CREATE INDEX IF NOT EXISTS idx_shoot_schedules_shoot_date ON shoot_schedules(shoot_date);
CREATE INDEX IF NOT EXISTS idx_shots_project_id ON shots(project_id);
CREATE INDEX IF NOT EXISTS idx_post_production_project_id ON post_production(project_id);
CREATE INDEX IF NOT EXISTS idx_production_tasks_project_id ON production_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_casting_project_id ON casting(project_id);
CREATE INDEX IF NOT EXISTS idx_locations_business_id ON locations(business_id);
CREATE INDEX IF NOT EXISTS idx_locations_project_id ON locations(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_email ON notifications(user_email);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_comments_entity ON comments(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_documents_entity ON documents(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_podcast_checklists_episode_id ON podcast_checklists(episode_id);
CREATE INDEX IF NOT EXISTS idx_storyboard_frames_project_id ON storyboard_frames(project_id);
CREATE INDEX IF NOT EXISTS idx_project_attachments_project_id ON project_attachments(project_id);

-- Equipment indexes
CREATE INDEX IF NOT EXISTS idx_equipment_items_project_id ON equipment_items(project_id);
CREATE INDEX IF NOT EXISTS idx_equipment_items_category_id ON equipment_items(category_id);
CREATE INDEX IF NOT EXISTS idx_equipment_items_source_type ON equipment_items(source_type);
CREATE INDEX IF NOT EXISTS idx_equipment_items_status ON equipment_items(status);
CREATE INDEX IF NOT EXISTS idx_equipment_reservations_equipment_id ON equipment_reservations(equipment_id);
CREATE INDEX IF NOT EXISTS idx_equipment_reservations_shoot_id ON equipment_reservations(shoot_schedule_id);

-- Team members indexes
CREATE INDEX IF NOT EXISTS idx_project_team_members_project_id ON project_team_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_team_members_user_id ON project_team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_project_team_members_status ON project_team_members(status);
CREATE INDEX IF NOT EXISTS idx_project_invitations_project_id ON project_invitations(project_id);
CREATE INDEX IF NOT EXISTS idx_project_invitations_email ON project_invitations(email);
CREATE INDEX IF NOT EXISTS idx_project_invitations_token ON project_invitations(token);
CREATE INDEX IF NOT EXISTS idx_project_settings_project_id ON project_settings(project_id);

-- Production schedule indexes
CREATE INDEX IF NOT EXISTS idx_shoot_day_details_shoot_id ON shoot_day_details(shoot_schedule_id);
CREATE INDEX IF NOT EXISTS idx_schedule_timeline_blocks_shoot_id ON schedule_timeline_blocks(shoot_schedule_id);
CREATE INDEX IF NOT EXISTS idx_schedule_timeline_blocks_order ON schedule_timeline_blocks(shoot_schedule_id, order_index);
CREATE INDEX IF NOT EXISTS idx_shoot_day_cast_shoot_id ON shoot_day_cast(shoot_schedule_id);
CREATE INDEX IF NOT EXISTS idx_shoot_day_crew_shoot_id ON shoot_day_crew(shoot_schedule_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_project_id ON activity_log(project_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_entity ON activity_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at DESC);

-- Create indexes for optional columns (after migration)
-- These indexes are created conditionally after the columns are added
DO $$ 
BEGIN
  -- Index for comments.project_id
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'comments' AND column_name = 'project_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_comments_project_id ON comments(project_id);
  END IF;
  
  -- Index for documents.project_id
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'documents' AND column_name = 'project_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);
  END IF;
END $$;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE shoot_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE shots ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_production ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE casting ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE podcast_episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE podcast_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE storyboard_frames ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE shoot_day_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_timeline_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE shoot_day_cast ENABLE ROW LEVEL SECURITY;
ALTER TABLE shoot_day_crew ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - CORE TABLES
-- ============================================

-- Users
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Businesses
CREATE POLICY "Users can view businesses they own or have access to"
  ON businesses FOR SELECT
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM business_access 
      WHERE business_access.business_id = businesses.id 
      AND (business_access.user_id = auth.uid() OR business_access.user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
    )
  );

CREATE POLICY "Users can create businesses"
  ON businesses FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update businesses they own"
  ON businesses FOR UPDATE
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete businesses they own"
  ON businesses FOR DELETE
  USING (created_by = auth.uid());

-- Business Access
CREATE POLICY "Users can view business access for their businesses"
  ON business_access FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = business_access.business_id 
      AND businesses.created_by = auth.uid()
    ) OR
    user_id = auth.uid() OR
    user_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

CREATE POLICY "Business owners can manage access"
  ON business_access FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = business_access.business_id 
      AND businesses.created_by = auth.uid()
    )
  );

-- Projects
CREATE POLICY "Users can view projects from accessible businesses"
  ON projects FOR SELECT
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = projects.business_id 
      AND (
        businesses.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM business_access 
          WHERE business_access.business_id = businesses.id 
          AND (business_access.user_id = auth.uid() OR business_access.user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
        )
      )
    ) OR
    EXISTS (
      SELECT 1 FROM project_team_members
      WHERE project_team_members.project_id = projects.id
      AND project_team_members.user_id = auth.uid()
      AND project_team_members.status = 'active'
    )
  );

CREATE POLICY "Users can create projects in accessible businesses"
  ON projects FOR INSERT
  WITH CHECK (
    created_by = auth.uid() AND
    (
      business_id IS NULL OR
      EXISTS (
        SELECT 1 FROM businesses 
        WHERE businesses.id = projects.business_id 
        AND (
          businesses.created_by = auth.uid() OR
          EXISTS (
            SELECT 1 FROM business_access 
            WHERE business_access.business_id = businesses.id 
            AND (business_access.user_id = auth.uid() OR business_access.user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
          )
        )
      )
    )
  );

CREATE POLICY "Users can update projects in accessible businesses"
  ON projects FOR UPDATE
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = projects.business_id 
      AND (
        businesses.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM business_access 
          WHERE business_access.business_id = businesses.id 
          AND (business_access.user_id = auth.uid() OR business_access.user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
        )
      )
    ) OR
    EXISTS (
      SELECT 1 FROM project_team_members
      WHERE project_team_members.project_id = projects.id
      AND project_team_members.user_id = auth.uid()
      AND project_team_members.status = 'active'
      AND project_team_members.role IN ('owner', 'editor')
    )
  );

CREATE POLICY "Users can delete projects they created"
  ON projects FOR DELETE
  USING (created_by = auth.uid());

-- Scripts
CREATE POLICY "Users can manage scripts in accessible projects"
  ON scripts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      JOIN businesses ON businesses.id = projects.business_id
      WHERE projects.id = scripts.project_id 
      AND (
        projects.created_by = auth.uid() OR
        businesses.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM business_access 
          WHERE business_access.business_id = businesses.id 
          AND (business_access.user_id = auth.uid() OR business_access.user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
        ) OR
        EXISTS (
          SELECT 1 FROM project_team_members
          WHERE project_team_members.project_id = scripts.project_id
          AND project_team_members.user_id = auth.uid()
          AND project_team_members.status = 'active'
          AND project_team_members.role IN ('owner', 'editor', 'commenter')
        )
      )
    )
  );

-- Budget Entries
CREATE POLICY "Users can manage budget entries in accessible projects"
  ON budget_entries FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      JOIN businesses ON businesses.id = projects.business_id
      WHERE projects.id = budget_entries.project_id 
      AND (
        projects.created_by = auth.uid() OR
        businesses.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM business_access 
          WHERE business_access.business_id = businesses.id 
          AND (business_access.user_id = auth.uid() OR business_access.user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
        ) OR
        EXISTS (
          SELECT 1 FROM project_team_members
          WHERE project_team_members.project_id = budget_entries.project_id
          AND project_team_members.user_id = auth.uid()
          AND project_team_members.status = 'active'
          AND project_team_members.role IN ('owner', 'editor')
        )
      )
    )
  );

-- Crew Members
CREATE POLICY "Users can manage crew members in accessible businesses/projects"
  ON crew_members FOR ALL
  USING (
    (project_id IS NULL OR EXISTS (
      SELECT 1 FROM projects 
      JOIN businesses ON businesses.id = projects.business_id
      WHERE projects.id = crew_members.project_id 
      AND (
        projects.created_by = auth.uid() OR
        businesses.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM business_access 
          WHERE business_access.business_id = businesses.id 
          AND (business_access.user_id = auth.uid() OR business_access.user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
        ) OR
        EXISTS (
          SELECT 1 FROM project_team_members
          WHERE project_team_members.project_id = crew_members.project_id
          AND project_team_members.user_id = auth.uid()
          AND project_team_members.status = 'active'
          AND project_team_members.role IN ('owner', 'editor')
        )
      )
    )) OR
    (business_id IS NULL OR EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = crew_members.business_id 
      AND (
        businesses.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM business_access 
          WHERE business_access.business_id = businesses.id 
          AND (business_access.user_id = auth.uid() OR business_access.user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
        )
      )
    ))
  );

-- Shoot Schedules
CREATE POLICY "Users can manage shoot schedules in accessible projects"
  ON shoot_schedules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      JOIN businesses ON businesses.id = projects.business_id
      WHERE projects.id = shoot_schedules.project_id 
      AND (
        projects.created_by = auth.uid() OR
        businesses.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM business_access 
          WHERE business_access.business_id = businesses.id 
          AND (business_access.user_id = auth.uid() OR business_access.user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
        ) OR
        EXISTS (
          SELECT 1 FROM project_team_members
          WHERE project_team_members.project_id = shoot_schedules.project_id
          AND project_team_members.user_id = auth.uid()
          AND project_team_members.status = 'active'
          AND project_team_members.role IN ('owner', 'editor')
        )
      )
    )
  );

-- Shots
CREATE POLICY "Users can manage shots in accessible projects"
  ON shots FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      JOIN businesses ON businesses.id = projects.business_id
      WHERE projects.id = shots.project_id 
      AND (
        projects.created_by = auth.uid() OR
        businesses.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM business_access 
          WHERE business_access.business_id = businesses.id 
          AND (business_access.user_id = auth.uid() OR business_access.user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
        ) OR
        EXISTS (
          SELECT 1 FROM project_team_members
          WHERE project_team_members.project_id = shots.project_id
          AND project_team_members.user_id = auth.uid()
          AND project_team_members.status = 'active'
          AND project_team_members.role IN ('owner', 'editor')
        )
      )
    )
  );

-- Post Production
CREATE POLICY "Users can manage post production in accessible projects"
  ON post_production FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      JOIN businesses ON businesses.id = projects.business_id
      WHERE projects.id = post_production.project_id 
      AND (
        projects.created_by = auth.uid() OR
        businesses.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM business_access 
          WHERE business_access.business_id = businesses.id 
          AND (business_access.user_id = auth.uid() OR business_access.user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
        ) OR
        EXISTS (
          SELECT 1 FROM project_team_members
          WHERE project_team_members.project_id = post_production.project_id
          AND project_team_members.user_id = auth.uid()
          AND project_team_members.status = 'active'
          AND project_team_members.role IN ('owner', 'editor')
        )
      )
    )
  );

-- Production Tasks
CREATE POLICY "Users can manage production tasks in accessible projects"
  ON production_tasks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      JOIN businesses ON businesses.id = projects.business_id
      WHERE projects.id = production_tasks.project_id 
      AND (
        projects.created_by = auth.uid() OR
        businesses.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM business_access 
          WHERE business_access.business_id = businesses.id 
          AND (business_access.user_id = auth.uid() OR business_access.user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
        ) OR
        EXISTS (
          SELECT 1 FROM project_team_members
          WHERE project_team_members.project_id = production_tasks.project_id
          AND project_team_members.user_id = auth.uid()
          AND project_team_members.status = 'active'
          AND project_team_members.role IN ('owner', 'editor')
        )
      )
    )
  );

-- Casting
CREATE POLICY "Users can manage casting in accessible projects"
  ON casting FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      JOIN businesses ON businesses.id = projects.business_id
      WHERE projects.id = casting.project_id 
      AND (
        projects.created_by = auth.uid() OR
        businesses.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM business_access 
          WHERE business_access.business_id = businesses.id 
          AND (business_access.user_id = auth.uid() OR business_access.user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
        ) OR
        EXISTS (
          SELECT 1 FROM project_team_members
          WHERE project_team_members.project_id = casting.project_id
          AND project_team_members.user_id = auth.uid()
          AND project_team_members.status = 'active'
          AND project_team_members.role IN ('owner', 'editor')
        )
      )
    )
  );

-- Locations
CREATE POLICY "Users can manage locations in accessible businesses/projects"
  ON locations FOR ALL
  USING (
    (business_id IS NULL OR EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = locations.business_id 
      AND (
        businesses.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM business_access 
          WHERE business_access.business_id = businesses.id 
          AND (business_access.user_id = auth.uid() OR business_access.user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
        )
      )
    )) OR
    (project_id IS NULL OR EXISTS (
      SELECT 1 FROM projects 
      JOIN businesses ON businesses.id = projects.business_id
      WHERE projects.id = locations.project_id 
      AND (
        projects.created_by = auth.uid() OR
        businesses.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM business_access 
          WHERE business_access.business_id = businesses.id 
          AND (business_access.user_id = auth.uid() OR business_access.user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
        ) OR
        EXISTS (
          SELECT 1 FROM project_team_members
          WHERE project_team_members.project_id = locations.project_id
          AND project_team_members.user_id = auth.uid()
          AND project_team_members.status = 'active'
          AND project_team_members.role IN ('owner', 'editor')
        )
      )
    ))
  );

-- Tasks
CREATE POLICY "Users can view tasks assigned to them or in their projects"
  ON tasks FOR SELECT
  USING (
    assigned_to = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
    assigned_to::UUID = auth.uid() OR
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM projects 
      JOIN businesses ON businesses.id = projects.business_id
      WHERE projects.id = tasks.project_id 
      AND (
        projects.created_by = auth.uid() OR
        businesses.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM business_access 
          WHERE business_access.business_id = businesses.id 
          AND (business_access.user_id = auth.uid() OR business_access.user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
        ) OR
        EXISTS (
          SELECT 1 FROM project_team_members
          WHERE project_team_members.project_id = tasks.project_id
          AND project_team_members.user_id = auth.uid()
          AND project_team_members.status = 'active'
        )
      )
    )
  );

CREATE POLICY "Users can create tasks in accessible projects"
  ON tasks FOR INSERT
  WITH CHECK (
    created_by = auth.uid() AND
    (project_id IS NULL OR EXISTS (
      SELECT 1 FROM projects 
      JOIN businesses ON businesses.id = projects.business_id
      WHERE projects.id = tasks.project_id 
      AND (
        projects.created_by = auth.uid() OR
        businesses.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM business_access 
          WHERE business_access.business_id = businesses.id 
          AND (business_access.user_id = auth.uid() OR business_access.user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
        ) OR
        EXISTS (
          SELECT 1 FROM project_team_members
          WHERE project_team_members.project_id = tasks.project_id
          AND project_team_members.user_id = auth.uid()
          AND project_team_members.status = 'active'
          AND project_team_members.role IN ('owner', 'editor')
        )
      )
    ))
  );

CREATE POLICY "Users can update tasks assigned to them or in their projects"
  ON tasks FOR UPDATE
  USING (
    assigned_to = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
    assigned_to::UUID = auth.uid() OR
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM projects 
      JOIN businesses ON businesses.id = projects.business_id
      WHERE projects.id = tasks.project_id 
      AND (
        projects.created_by = auth.uid() OR
        businesses.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM business_access 
          WHERE business_access.business_id = businesses.id 
          AND (business_access.user_id = auth.uid() OR business_access.user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
        ) OR
        EXISTS (
          SELECT 1 FROM project_team_members
          WHERE project_team_members.project_id = tasks.project_id
          AND project_team_members.user_id = auth.uid()
          AND project_team_members.status = 'active'
          AND project_team_members.role IN ('owner', 'editor')
        )
      )
    )
  );

-- Notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (
    auth.uid() = user_id OR
    user_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (
    auth.uid() = user_id OR
    user_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

CREATE POLICY "Users can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Comments
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can manage comments" ON comments;

CREATE POLICY "Users can manage comments"
  ON comments FOR ALL
  USING (
    user_id = auth.uid() OR
    -- Check via entity_type/entity_id (works for both old and new structure)
    (
      comments.entity_type = 'project' 
      AND comments.entity_id IS NOT NULL 
      AND EXISTS (
        SELECT 1 FROM projects 
        WHERE projects.id = comments.entity_id 
        AND (
          projects.created_by = auth.uid() OR
          EXISTS (
            SELECT 1 FROM project_team_members
            WHERE project_team_members.project_id = comments.entity_id
            AND project_team_members.user_id = auth.uid()
            AND project_team_members.status = 'active'
          )
        )
      )
    )
  );

-- Documents
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can manage documents in accessible entities" ON documents;

CREATE POLICY "Users can manage documents in accessible entities"
  ON documents FOR ALL
  USING (
    created_by = auth.uid() OR
    -- Check via entity_type/entity_id (works for both old and new structure)
    (
      documents.entity_type = 'project' 
      AND documents.entity_id IS NOT NULL 
      AND EXISTS (
        SELECT 1 FROM projects 
        WHERE projects.id = documents.entity_id 
        AND (
          projects.created_by = auth.uid() OR
          EXISTS (
            SELECT 1 FROM project_team_members
            WHERE project_team_members.project_id = documents.entity_id
            AND project_team_members.user_id = auth.uid()
            AND project_team_members.status = 'active'
          )
        )
      )
    )
  );

-- Podcast Episodes
CREATE POLICY "Users can view published episodes or their own"
  ON podcast_episodes FOR SELECT
  USING (
    published = true OR
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = podcast_episodes.business_id 
      AND (
        businesses.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM business_access 
          WHERE business_access.business_id = businesses.id 
          AND (business_access.user_id = auth.uid() OR business_access.user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
        )
      )
    )
  );

CREATE POLICY "Users can create podcast episodes"
  ON podcast_episodes FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own podcast episodes"
  ON podcast_episodes FOR UPDATE
  USING (created_by = auth.uid());

-- Podcast Checklists
CREATE POLICY "Users can manage podcast checklists for accessible episodes"
  ON podcast_checklists FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM podcast_episodes 
      WHERE podcast_episodes.id = podcast_checklists.episode_id 
      AND (
        podcast_episodes.created_by = auth.uid() OR
        podcast_episodes.published = true
      )
    )
  );

-- Storyboard Frames
CREATE POLICY "Users can manage storyboard frames in accessible projects"
  ON storyboard_frames FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      JOIN businesses ON businesses.id = projects.business_id
      WHERE projects.id = storyboard_frames.project_id 
      AND (
        projects.created_by = auth.uid() OR
        businesses.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM business_access 
          WHERE business_access.business_id = businesses.id 
          AND (business_access.user_id = auth.uid() OR business_access.user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
        ) OR
        EXISTS (
          SELECT 1 FROM project_team_members
          WHERE project_team_members.project_id = storyboard_frames.project_id
          AND project_team_members.user_id = auth.uid()
          AND project_team_members.status = 'active'
          AND project_team_members.role IN ('owner', 'editor')
        )
      )
    )
  );

-- Project Attachments
CREATE POLICY "Users can manage attachments in accessible projects"
  ON project_attachments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      JOIN businesses ON businesses.id = projects.business_id
      WHERE projects.id = project_attachments.project_id 
      AND (
        projects.created_by = auth.uid() OR
        businesses.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM business_access 
          WHERE business_access.business_id = businesses.id 
          AND (business_access.user_id = auth.uid() OR business_access.user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
        ) OR
        EXISTS (
          SELECT 1 FROM project_team_members
          WHERE project_team_members.project_id = project_attachments.project_id
          AND project_team_members.user_id = auth.uid()
          AND project_team_members.status = 'active'
          AND project_team_members.role IN ('owner', 'editor')
        )
      )
    )
  );

-- ============================================
-- RLS POLICIES - EQUIPMENT & TEAM
-- ============================================

-- Equipment Categories (read-only for all authenticated users)
CREATE POLICY "Users can view equipment categories"
  ON equipment_categories FOR SELECT
  USING (auth.role() = 'authenticated');

-- Equipment Items
CREATE POLICY "Users can manage equipment in accessible projects"
  ON equipment_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      JOIN businesses ON businesses.id = projects.business_id
      WHERE projects.id = equipment_items.project_id 
      AND (
        projects.created_by = auth.uid() OR
        businesses.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM business_access 
          WHERE business_access.business_id = businesses.id 
          AND (business_access.user_id = auth.uid() OR business_access.user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
        ) OR
        EXISTS (
          SELECT 1 FROM project_team_members
          WHERE project_team_members.project_id = equipment_items.project_id
          AND project_team_members.user_id = auth.uid()
          AND project_team_members.status = 'active'
          AND project_team_members.role IN ('owner', 'editor')
        )
      )
    )
  );

-- Equipment Reservations
CREATE POLICY "Users can manage equipment reservations in accessible projects"
  ON equipment_reservations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM equipment_items
      JOIN projects ON projects.id = equipment_items.project_id
      JOIN businesses ON businesses.id = projects.business_id
      WHERE equipment_items.id = equipment_reservations.equipment_id
      AND (
        projects.created_by = auth.uid() OR
        businesses.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM business_access 
          WHERE business_access.business_id = businesses.id 
          AND (business_access.user_id = auth.uid() OR business_access.user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
        ) OR
        EXISTS (
          SELECT 1 FROM project_team_members
          WHERE project_team_members.project_id = projects.id
          AND project_team_members.user_id = auth.uid()
          AND project_team_members.status = 'active'
          AND project_team_members.role IN ('owner', 'editor')
        )
      )
    )
  );

-- Project Team Members
CREATE POLICY "Users can view team members in accessible projects"
  ON project_team_members FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM projects 
      JOIN businesses ON businesses.id = projects.business_id
      WHERE projects.id = project_team_members.project_id 
      AND (
        projects.created_by = auth.uid() OR
        businesses.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM business_access 
          WHERE business_access.business_id = businesses.id 
          AND (business_access.user_id = auth.uid() OR business_access.user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
        ) OR
        EXISTS (
          SELECT 1 FROM project_team_members ptm
          JOIN project_settings ps ON ps.project_id = ptm.project_id
          WHERE ptm.project_id = project_team_members.project_id
          AND ptm.user_id = auth.uid()
          AND ptm.status = 'active'
          AND (ptm.role IN ('owner', 'editor') OR ps.members_can_see_list = true)
        )
      )
    )
  );

CREATE POLICY "Project owners can manage team members"
  ON project_team_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_team_members.project_id 
      AND projects.created_by = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM project_team_members ptm
      JOIN project_settings ps ON ps.project_id = ptm.project_id
      WHERE ptm.project_id = project_team_members.project_id
      AND ptm.user_id = auth.uid()
      AND ptm.role IN ('owner', 'editor')
      AND ptm.status = 'active'
      AND ps.editors_can_invite = true
    )
  );

-- Project Invitations
CREATE POLICY "Users can view invitations for accessible projects"
  ON project_invitations FOR SELECT
  USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
    EXISTS (
      SELECT 1 FROM projects 
      JOIN businesses ON businesses.id = projects.business_id
      WHERE projects.id = project_invitations.project_id 
      AND (
        projects.created_by = auth.uid() OR
        businesses.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM business_access 
          WHERE business_access.business_id = businesses.id 
          AND (business_access.user_id = auth.uid() OR business_access.user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
        )
      )
    )
  );

CREATE POLICY "Project owners can manage invitations"
  ON project_invitations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_invitations.project_id 
      AND projects.created_by = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM project_team_members ptm
      JOIN project_settings ps ON ps.project_id = ptm.project_id
      WHERE ptm.project_id = project_invitations.project_id
      AND ptm.user_id = auth.uid()
      AND ptm.role IN ('owner', 'editor')
      AND ptm.status = 'active'
      AND ps.editors_can_invite = true
    )
  );

-- Project Settings
CREATE POLICY "Users can view settings for accessible projects"
  ON project_settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      JOIN businesses ON businesses.id = projects.business_id
      WHERE projects.id = project_settings.project_id 
      AND (
        projects.created_by = auth.uid() OR
        businesses.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM business_access 
          WHERE business_access.business_id = businesses.id 
          AND (business_access.user_id = auth.uid() OR business_access.user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
        ) OR
        EXISTS (
          SELECT 1 FROM project_team_members
          WHERE project_team_members.project_id = project_settings.project_id
          AND project_team_members.user_id = auth.uid()
          AND project_team_members.status = 'active'
        )
      )
    )
  );

CREATE POLICY "Project owners can manage settings"
  ON project_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_settings.project_id 
      AND projects.created_by = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM project_team_members
      WHERE project_team_members.project_id = project_settings.project_id
      AND project_team_members.user_id = auth.uid()
      AND project_team_members.role = 'owner'
      AND project_team_members.status = 'active'
    )
  );

-- Shoot Day Details
CREATE POLICY "Users can manage shoot day details in accessible projects"
  ON shoot_day_details FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM shoot_schedules
      JOIN projects ON projects.id = shoot_schedules.project_id
      JOIN businesses ON businesses.id = projects.business_id
      WHERE shoot_schedules.id = shoot_day_details.shoot_schedule_id
      AND (
        projects.created_by = auth.uid() OR
        businesses.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM business_access 
          WHERE business_access.business_id = businesses.id 
          AND (business_access.user_id = auth.uid() OR business_access.user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
        ) OR
        EXISTS (
          SELECT 1 FROM project_team_members
          WHERE project_team_members.project_id = projects.id
          AND project_team_members.user_id = auth.uid()
          AND project_team_members.status = 'active'
          AND project_team_members.role IN ('owner', 'editor')
        )
      )
    )
  );

-- Schedule Timeline Blocks
CREATE POLICY "Users can manage timeline blocks in accessible projects"
  ON schedule_timeline_blocks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM shoot_schedules
      JOIN projects ON projects.id = shoot_schedules.project_id
      JOIN businesses ON businesses.id = projects.business_id
      WHERE shoot_schedules.id = schedule_timeline_blocks.shoot_schedule_id
      AND (
        projects.created_by = auth.uid() OR
        businesses.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM business_access 
          WHERE business_access.business_id = businesses.id 
          AND (business_access.user_id = auth.uid() OR business_access.user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
        ) OR
        EXISTS (
          SELECT 1 FROM project_team_members
          WHERE project_team_members.project_id = projects.id
          AND project_team_members.user_id = auth.uid()
          AND project_team_members.status = 'active'
          AND project_team_members.role IN ('owner', 'editor')
        )
      )
    )
  );

-- Shoot Day Cast & Crew
CREATE POLICY "Users can manage shoot day cast in accessible projects"
  ON shoot_day_cast FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM shoot_schedules
      JOIN projects ON projects.id = shoot_schedules.project_id
      JOIN businesses ON businesses.id = projects.business_id
      WHERE shoot_schedules.id = shoot_day_cast.shoot_schedule_id
      AND (
        projects.created_by = auth.uid() OR
        businesses.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM business_access 
          WHERE business_access.business_id = businesses.id 
          AND (business_access.user_id = auth.uid() OR business_access.user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
        ) OR
        EXISTS (
          SELECT 1 FROM project_team_members
          WHERE project_team_members.project_id = projects.id
          AND project_team_members.user_id = auth.uid()
          AND project_team_members.status = 'active'
          AND project_team_members.role IN ('owner', 'editor')
        )
      )
    )
  );

CREATE POLICY "Users can manage shoot day crew in accessible projects"
  ON shoot_day_crew FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM shoot_schedules
      JOIN projects ON projects.id = shoot_schedules.project_id
      JOIN businesses ON businesses.id = projects.business_id
      WHERE shoot_schedules.id = shoot_day_crew.shoot_schedule_id
      AND (
        projects.created_by = auth.uid() OR
        businesses.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM business_access 
          WHERE business_access.business_id = businesses.id 
          AND (business_access.user_id = auth.uid() OR business_access.user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
        ) OR
        EXISTS (
          SELECT 1 FROM project_team_members
          WHERE project_team_members.project_id = projects.id
          AND project_team_members.user_id = auth.uid()
          AND project_team_members.status = 'active'
          AND project_team_members.role IN ('owner', 'editor')
        )
      )
    )
  );

-- Activity Log
CREATE POLICY "Users can view activity log for accessible projects"
  ON activity_log FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM projects 
      JOIN businesses ON businesses.id = projects.business_id
      WHERE projects.id = activity_log.project_id 
      AND (
        projects.created_by = auth.uid() OR
        businesses.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM business_access 
          WHERE business_access.business_id = businesses.id 
          AND (business_access.user_id = auth.uid() OR business_access.user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
        ) OR
        EXISTS (
          SELECT 1 FROM project_team_members
          WHERE project_team_members.project_id = activity_log.project_id
          AND project_team_members.user_id = auth.uid()
          AND project_team_members.status = 'active'
        )
      )
    )
  );

CREATE POLICY "System can create activity log entries"
  ON activity_log FOR INSERT
  WITH CHECK (true);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, users.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to generate share link token
CREATE OR REPLACE FUNCTION generate_share_link_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(12), 'base64');
END;
$$ LANGUAGE plpgsql;

-- Function to auto-create project settings when project is created
CREATE OR REPLACE FUNCTION create_project_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO project_settings (project_id, share_link)
  VALUES (NEW.id, 'p/' || encode(gen_random_bytes(8), 'base64'))
  ON CONFLICT (project_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to auto-add project creator as owner
CREATE OR REPLACE FUNCTION add_project_owner()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO project_team_members (project_id, user_id, role, status, joined_at)
  VALUES (NEW.id, NEW.created_by, 'owner', 'active', NOW())
  ON CONFLICT (project_id, user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Triggers for updated_at on all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scripts_updated_at BEFORE UPDATE ON scripts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_entries_updated_at BEFORE UPDATE ON budget_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crew_members_updated_at BEFORE UPDATE ON crew_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shoot_schedules_updated_at BEFORE UPDATE ON shoot_schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shots_updated_at BEFORE UPDATE ON shots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_post_production_updated_at BEFORE UPDATE ON post_production
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_production_tasks_updated_at BEFORE UPDATE ON production_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_casting_updated_at BEFORE UPDATE ON casting
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_podcast_episodes_updated_at BEFORE UPDATE ON podcast_episodes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_storyboard_frames_updated_at BEFORE UPDATE ON storyboard_frames
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equipment_items_updated_at BEFORE UPDATE ON equipment_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_team_members_updated_at BEFORE UPDATE ON project_team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_settings_updated_at BEFORE UPDATE ON project_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shoot_day_details_updated_at BEFORE UPDATE ON shoot_day_details
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedule_timeline_blocks_updated_at BEFORE UPDATE ON schedule_timeline_blocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for project creation
DROP TRIGGER IF EXISTS on_project_created_settings ON projects;
CREATE TRIGGER on_project_created_settings
  AFTER INSERT ON projects
  FOR EACH ROW EXECUTE FUNCTION create_project_settings();

DROP TRIGGER IF EXISTS on_project_created_owner ON projects;
CREATE TRIGGER on_project_created_owner
  AFTER INSERT ON projects
  FOR EACH ROW EXECUTE FUNCTION add_project_owner();

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert default equipment categories
INSERT INTO equipment_categories (name, icon, color) VALUES
  ('Camera', 'camera', '#6B46C1'),
  ('Lenses', 'lens', '#3B82F6'),
  ('Lighting', 'lightbulb', '#F97316'),
  ('Audio', 'mic-2', '#14B8A6'),
  ('Grip', 'wrench', '#8B5CF6'),
  ('Transportation', 'truck', '#10B981')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- COMPLETE!
-- ============================================
-- This schema includes:
-- - All core tables (users, businesses, projects, scripts, shots, etc.)
-- - Equipment management tables
-- - Team members & project access tables
-- - Production schedule enhancements
-- - All indexes for performance
-- - Complete Row Level Security policies
-- - All triggers for auto-updates
-- - Initial data (equipment categories)
-- ============================================

