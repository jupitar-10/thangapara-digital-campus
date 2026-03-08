
-- Create admission status enum
CREATE TYPE public.admission_status AS ENUM ('pending', 'approved', 'rejected');

-- Create students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  class TEXT NOT NULL,
  roll_number TEXT NOT NULL,
  dob DATE,
  father_name TEXT,
  mother_name TEXT,
  mobile TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admissions table
CREATE TABLE public.admissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  class_applied TEXT NOT NULL,
  dob DATE,
  father_name TEXT,
  mother_name TEXT,
  mobile TEXT,
  email TEXT,
  address TEXT,
  status admission_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;

-- Students: admin only
CREATE POLICY "Students are publicly readable" ON public.students FOR SELECT USING (true);
CREATE POLICY "Admins can manage students" ON public.students FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Admissions: public insert, admin manage
CREATE POLICY "Anyone can submit admissions" ON public.admissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admissions are publicly readable" ON public.admissions FOR SELECT USING (true);
CREATE POLICY "Admins can manage admissions" ON public.admissions FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Update triggers
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_admissions_updated_at BEFORE UPDATE ON public.admissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
