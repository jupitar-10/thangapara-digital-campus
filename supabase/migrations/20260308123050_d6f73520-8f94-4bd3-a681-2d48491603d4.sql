
-- Create update_updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Notices table
CREATE TABLE public.notices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Notices are publicly readable" ON public.notices FOR SELECT USING (true);

-- Teachers table
CREATE TABLE public.teachers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  photo_url TEXT,
  designation TEXT,
  qualification TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers are publicly readable" ON public.teachers FOR SELECT USING (true);

-- Gallery table
CREATE TABLE public.gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT,
  event_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Gallery is publicly readable" ON public.gallery FOR SELECT USING (true);

-- Downloads table
CREATE TABLE public.downloads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Downloads are publicly readable" ON public.downloads FOR SELECT USING (true);

-- Contact messages table
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Admin roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Admin policies for all tables
CREATE POLICY "Admins can manage notices" ON public.notices FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage teachers" ON public.teachers FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage gallery" ON public.gallery FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage downloads" ON public.downloads FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can read contact messages" ON public.contact_messages FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage user roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON public.notices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON public.teachers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for school assets
INSERT INTO storage.buckets (id, name, public) VALUES ('school-assets', 'school-assets', true);
CREATE POLICY "School assets are publicly readable" ON storage.objects FOR SELECT USING (bucket_id = 'school-assets');
CREATE POLICY "Admins can upload school assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'school-assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update school assets" ON storage.objects FOR UPDATE USING (bucket_id = 'school-assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete school assets" ON storage.objects FOR DELETE USING (bucket_id = 'school-assets' AND public.has_role(auth.uid(), 'admin'));
