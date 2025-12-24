-- FlowPro Migration: Equipment, Team Members & Production Schedule
-- Run this in your Supabase SQL Editor after the main schema

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
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_equipment_items_project_id ON equipment_items(project_id);
CREATE INDEX IF NOT EXISTS idx_equipment_items_category_id ON equipment_items(category_id);
CREATE INDEX IF NOT EXISTS idx_equipment_items_source_type ON equipment_items(source_type);
CREATE INDEX IF NOT EXISTS idx_equipment_items_status ON equipment_items(status);
CREATE INDEX IF NOT EXISTS idx_equipment_reservations_equipment_id ON equipment_reservations(equipment_id);
CREATE INDEX IF NOT EXISTS idx_equipment_reservations_shoot_id ON equipment_reservations(shoot_schedule_id);

CREATE INDEX IF NOT EXISTS idx_project_team_members_project_id ON project_team_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_team_members_user_id ON project_team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_project_team_members_status ON project_team_members(status);
CREATE INDEX IF NOT EXISTS idx_project_invitations_project_id ON project_invitations(project_id);
CREATE INDEX IF NOT EXISTS idx_project_invitations_email ON project_invitations(email);
CREATE INDEX IF NOT EXISTS idx_project_invitations_token ON project_invitations(token);
CREATE INDEX IF NOT EXISTS idx_project_settings_project_id ON project_settings(project_id);

CREATE INDEX IF NOT EXISTS idx_shoot_day_details_shoot_id ON shoot_day_details(shoot_schedule_id);
CREATE INDEX IF NOT EXISTS idx_schedule_timeline_blocks_shoot_id ON schedule_timeline_blocks(shoot_schedule_id);
CREATE INDEX IF NOT EXISTS idx_schedule_timeline_blocks_order ON schedule_timeline_blocks(shoot_schedule_id, order_index);
CREATE INDEX IF NOT EXISTS idx_shoot_day_cast_shoot_id ON shoot_day_cast(shoot_schedule_id);
CREATE INDEX IF NOT EXISTS idx_shoot_day_crew_shoot_id ON shoot_day_crew(shoot_schedule_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_project_id ON activity_log(project_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_entity ON activity_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

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
          WHERE ptm.project_id = project_team_members.project_id
          AND ptm.user_id = auth.uid()
          AND ptm.status = 'active'
          AND (ptm.role IN ('owner', 'editor') OR project_settings.members_can_see_list = true)
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
      WHERE ptm.project_id = project_team_members.project_id
      AND ptm.user_id = auth.uid()
      AND ptm.role IN ('owner', 'editor')
      AND ptm.status = 'active'
      AND EXISTS (
        SELECT 1 FROM project_settings ps
        WHERE ps.project_id = project_team_members.project_id
        AND ps.editors_can_invite = true
      )
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
      WHERE ptm.project_id = project_invitations.project_id
      AND ptm.user_id = auth.uid()
      AND ptm.role IN ('owner', 'editor')
      AND ptm.status = 'active'
      AND EXISTS (
        SELECT 1 FROM project_settings ps
        WHERE ps.project_id = project_invitations.project_id
        AND ps.editors_can_invite = true
      )
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
-- TRIGGERS
-- ============================================

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
  VALUES (NEW.id, 'p/' || encode(gen_random_bytes(8), 'base64'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create project settings
DROP TRIGGER IF EXISTS on_project_created_settings ON projects;
CREATE TRIGGER on_project_created_settings
  AFTER INSERT ON projects
  FOR EACH ROW EXECUTE FUNCTION create_project_settings();

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

-- Trigger to add project creator as owner
DROP TRIGGER IF EXISTS on_project_created_owner ON projects;
CREATE TRIGGER on_project_created_owner
  AFTER INSERT ON projects
  FOR EACH ROW EXECUTE FUNCTION add_project_owner();

