
-- Allow authenticated users to upload to school-assets bucket
CREATE POLICY "Admins can upload to school-assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'school-assets' AND public.has_role(auth.uid(), 'admin'));

-- Allow authenticated admins to delete from school-assets bucket
CREATE POLICY "Admins can delete from school-assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'school-assets' AND public.has_role(auth.uid(), 'admin'));

-- Allow public read access to school-assets
CREATE POLICY "Public can read school-assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'school-assets');
