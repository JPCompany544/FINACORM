-- ─── DATABASE PRIVILEGE FIX ──────────────────────────────────────────────────
-- Grant select permission for avatar_url column to standard roles (required for client access)
GRANT SELECT (avatar_url) ON public.profiles TO authenticated, anon;

-- 1. INSERT: Allow authenticated users to upload an avatar under their own folder
DROP POLICY IF EXISTS "Allow users to upload their own avatar" ON storage.objects;
CREATE POLICY "Allow users to upload their own avatar" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 2. SELECT: Allow authenticated users to view/download their own avatar
DROP POLICY IF EXISTS "Allow users to view their own avatar" ON storage.objects;
CREATE POLICY "Allow users to view their own avatar" 
ON storage.objects 
FOR SELECT 
TO authenticated 
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. UPDATE: Allow authenticated users to replace their own avatar
DROP POLICY IF EXISTS "Allow users to update their own avatar" ON storage.objects;
CREATE POLICY "Allow users to update their own avatar" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. DELETE: Allow authenticated users to delete their own avatar
DROP POLICY IF EXISTS "Allow users to delete their own avatar" ON storage.objects;
CREATE POLICY "Allow users to delete their own avatar" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
