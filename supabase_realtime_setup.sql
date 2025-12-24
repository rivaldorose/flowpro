-- Enable RLS on scripts table (if not already enabled)
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read scripts from projects they have access to
-- Note: Adjust this based on your actual table structure and auth setup
CREATE POLICY "Users can read scripts from accessible projects"
ON scripts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = scripts.project_id
    AND (
      -- User is admin (adjust based on your users table structure)
      EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND role = 'admin'
      )
      OR
      -- User has access to the project's business
      EXISTS (
        SELECT 1 FROM business_access ba
        WHERE ba.user_email = (SELECT email FROM auth.users WHERE id = auth.uid())
        AND ba.business_id = p.business_id
      )
      OR
      -- User created the script or has direct access
      scripts.created_by = auth.uid()
    )
  )
);

-- Policy: Users can update scripts from projects they have access to
CREATE POLICY "Users can update scripts from accessible projects"
ON scripts FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = scripts.project_id
    AND (
      EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND role = 'admin'
      )
      OR
      EXISTS (
        SELECT 1 FROM business_access ba
        WHERE ba.user_email = (SELECT email FROM auth.users WHERE id = auth.uid())
        AND ba.business_id = p.business_id
      )
      OR
      scripts.created_by = auth.uid()
    )
  )
);

-- If you want to allow all authenticated users to read/update (for testing):
-- DROP POLICY IF EXISTS "Users can read scripts from accessible projects" ON scripts;
-- DROP POLICY IF EXISTS "Users can update scripts from accessible projects" ON scripts;
-- 
-- CREATE POLICY "Authenticated users can read scripts"
-- ON scripts FOR SELECT
-- TO authenticated
-- USING (true);
-- 
-- CREATE POLICY "Authenticated users can update scripts"
-- ON scripts FOR UPDATE
-- TO authenticated
-- USING (true);

