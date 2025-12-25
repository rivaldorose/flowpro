-- Migration: Add contacts table and link to organizations (businesses)
-- This allows users to manage contacts and optionally link them to organizations

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT,
  notes TEXT,
  business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_contacts_business_id ON contacts(business_id);
CREATE INDEX IF NOT EXISTS idx_contacts_created_by ON contacts(created_by);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email) WHERE email IS NOT NULL;

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view all contacts (for now, can be restricted later)
CREATE POLICY "Users can view contacts" ON contacts
  FOR SELECT
  USING (true);

-- Users can create contacts
CREATE POLICY "Users can create contacts" ON contacts
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Users can update their own contacts
CREATE POLICY "Users can update contacts" ON contacts
  FOR UPDATE
  USING (auth.uid() = created_by);

-- Users can delete their own contacts
CREATE POLICY "Users can delete contacts" ON contacts
  FOR DELETE
  USING (auth.uid() = created_by);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_contacts_updated_at();

