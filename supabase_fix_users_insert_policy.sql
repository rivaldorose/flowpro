-- ============================================
-- Fix: Add missing INSERT policy for users table
-- ============================================
-- This allows users to create their own profile when it doesn't exist yet
-- ============================================

-- Add INSERT policy for users table (if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'users' 
    AND policyname = 'Users can insert their own profile'
  ) THEN
    CREATE POLICY "Users can insert their own profile"
      ON users FOR INSERT
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

