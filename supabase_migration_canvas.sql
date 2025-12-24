-- ============================================
-- Canvas Items Migration
-- ============================================
-- Adds support for canvas workspace items (cards, notes, sections, etc.)
-- ============================================

-- Canvas Items table - stores all canvas items (cards, notes, sections, etc.)
CREATE TABLE IF NOT EXISTS canvas_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('text', 'image', 'note', 'section', 'shot', 'script')),
  x INTEGER NOT NULL DEFAULT 0,
  y INTEGER NOT NULL DEFAULT 0,
  width INTEGER DEFAULT 300,
  height INTEGER,
  z_index INTEGER DEFAULT 0,
  
  -- Type-specific data (stored as JSONB for flexibility)
  data JSONB DEFAULT '{}'::jsonb,
  
  -- Common fields
  title TEXT,
  content TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Indexes for canvas items
CREATE INDEX IF NOT EXISTS idx_canvas_items_project_id ON canvas_items(project_id);
CREATE INDEX IF NOT EXISTS idx_canvas_items_type ON canvas_items(type);
CREATE INDEX IF NOT EXISTS idx_canvas_items_project_type ON canvas_items(project_id, type);
CREATE INDEX IF NOT EXISTS idx_canvas_items_created_at ON canvas_items(created_at DESC);

-- Enable RLS
ALTER TABLE canvas_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for canvas_items
-- Users can view canvas items for projects they have access to
CREATE POLICY "Users can view canvas items for accessible projects"
  ON canvas_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = canvas_items.project_id
      AND (
        p.created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM business_access ba
          WHERE ba.business_id = p.business_id
          AND ba.user_id = auth.uid()
        )
      )
    )
  );

-- Users can insert canvas items for projects they have access to
CREATE POLICY "Users can create canvas items for accessible projects"
  ON canvas_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = canvas_items.project_id
      AND (
        p.created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM business_access ba
          WHERE ba.business_id = p.business_id
          AND ba.user_id = auth.uid()
        )
      )
    )
  );

-- Users can update canvas items they created or for accessible projects
CREATE POLICY "Users can update canvas items for accessible projects"
  ON canvas_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = canvas_items.project_id
      AND (
        p.created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM business_access ba
          WHERE ba.business_id = p.business_id
          AND ba.user_id = auth.uid()
        )
      )
    )
  );

-- Users can delete canvas items they created or for accessible projects
CREATE POLICY "Users can delete canvas items for accessible projects"
  ON canvas_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = canvas_items.project_id
      AND (
        p.created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM business_access ba
          WHERE ba.business_id = p.business_id
          AND ba.user_id = auth.uid()
        )
      )
    )
  );

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_canvas_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER canvas_items_updated_at
  BEFORE UPDATE ON canvas_items
  FOR EACH ROW
  EXECUTE FUNCTION update_canvas_items_updated_at();

-- Canvas Layout Settings table - stores canvas zoom, scroll position, etc. per project
CREATE TABLE IF NOT EXISTS canvas_layouts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL UNIQUE,
  zoom DECIMAL(5, 2) DEFAULT 100.0,
  scroll_x INTEGER DEFAULT 0,
  scroll_y INTEGER DEFAULT 0,
  background_pattern TEXT DEFAULT 'grid',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Indexes for canvas_layouts
CREATE INDEX IF NOT EXISTS idx_canvas_layouts_project_id ON canvas_layouts(project_id);

-- Enable RLS
ALTER TABLE canvas_layouts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for canvas_layouts
CREATE POLICY "Users can view canvas layouts for accessible projects"
  ON canvas_layouts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = canvas_layouts.project_id
      AND (
        p.created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM business_access ba
          WHERE ba.business_id = p.business_id
          AND ba.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can create canvas layouts for accessible projects"
  ON canvas_layouts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = canvas_layouts.project_id
      AND (
        p.created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM business_access ba
          WHERE ba.business_id = p.business_id
          AND ba.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can update canvas layouts for accessible projects"
  ON canvas_layouts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = canvas_layouts.project_id
      AND (
        p.created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM business_access ba
          WHERE ba.business_id = p.business_id
          AND ba.user_id = auth.uid()
        )
      )
    )
  );

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_canvas_layouts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER canvas_layouts_updated_at
  BEFORE UPDATE ON canvas_layouts
  FOR EACH ROW
  EXECUTE FUNCTION update_canvas_layouts_updated_at();

