-- EENVOUDIGE VERSIE VOOR TESTEN
-- Kopieer en plak dit in Supabase SQL Editor (zonder de ``` markers!)

-- Enable RLS on scripts table
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read scripts (voor testen)
CREATE POLICY "Authenticated users can read scripts"
ON scripts FOR SELECT
TO authenticated
USING (true);

-- Allow all authenticated users to update scripts (voor testen)
CREATE POLICY "Authenticated users can update scripts"
ON scripts FOR UPDATE
TO authenticated
USING (true);

