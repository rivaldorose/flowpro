-- FlowPro Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users profile table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
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
  description TEXT,
  status TEXT DEFAULT 'Planning',
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Scripts table
CREATE TABLE IF NOT EXISTS scripts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  version TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Budget Entries table
CREATE TABLE IF NOT EXISTS budget_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'Planned',
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
  description TEXT,
  duration_seconds INTEGER,
  status TEXT DEFAULT 'Planned',
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
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post Versions table
CREATE TABLE IF NOT EXISTS post_versions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_production_id UUID REFERENCES post_production(id) ON DELETE CASCADE,
  version_number TEXT NOT NULL,
  file_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Production Tasks table
CREATE TABLE IF NOT EXISTS production_tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
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
  role TEXT,
  contact_info TEXT,
  status TEXT DEFAULT 'Pending',
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
  coordinates JSONB,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table (general tasks)
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'To Do',
  priority TEXT DEFAULT 'Medium',
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
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
  description TEXT,
  audio_url TEXT,
  duration_seconds INTEGER,
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
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Storyboard Frames table
CREATE TABLE IF NOT EXISTS storyboard_frames (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  shot_id UUID REFERENCES shots(id) ON DELETE SET NULL,
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

-- Create indexes for better query performance
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
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_comments_entity ON comments(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_documents_entity ON documents(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_podcast_checklists_episode_id ON podcast_checklists(episode_id);
CREATE INDEX IF NOT EXISTS idx_storyboard_frames_project_id ON storyboard_frames(project_id);
CREATE INDEX IF NOT EXISTS idx_project_attachments_project_id ON project_attachments(project_id);

-- Enable Row Level Security (RLS)
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

-- RLS Policies for users
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for businesses
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

-- RLS Policies for business_access
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

-- RLS Policies for projects (users can access projects from businesses they have access to)
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
    )
  );

CREATE POLICY "Users can create projects in accessible businesses"
  ON projects FOR INSERT
  WITH CHECK (
    created_by = auth.uid() AND
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
    )
  );

CREATE POLICY "Users can delete projects they created"
  ON projects FOR DELETE
  USING (created_by = auth.uid());

-- Similar RLS policies for other tables (simplified pattern)
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
        )
      )
    )
  );

-- Locations
CREATE POLICY "Users can manage locations in accessible businesses"
  ON locations FOR ALL
  USING (
    EXISTS (
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
    )
  );

-- Tasks
CREATE POLICY "Users can view tasks assigned to them or in their projects"
  ON tasks FOR SELECT
  USING (
    assigned_to = auth.uid() OR
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
        )
      )
    ))
  );

CREATE POLICY "Users can update tasks assigned to them or in their projects"
  ON tasks FOR UPDATE
  USING (
    assigned_to = auth.uid() OR
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
        )
      )
    )
  );

-- Notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Comments
CREATE POLICY "Users can manage comments"
  ON comments FOR ALL
  USING (true); -- Can be more specific based on entity_type

-- Documents
CREATE POLICY "Users can manage documents in accessible entities"
  ON documents FOR ALL
  USING (true); -- Can be more specific based on entity_type

-- Podcast Episodes
CREATE POLICY "Users can view published episodes or their own"
  ON podcast_episodes FOR SELECT
  USING (
    published = true OR
    created_by = auth.uid()
  );

CREATE POLICY "Users can create podcast episodes"
  ON podcast_episodes FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own podcast episodes"
  ON podcast_episodes FOR UPDATE
  USING (created_by = auth.uid());

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
        )
      )
    )
  );

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
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
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

