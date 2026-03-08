
-- Create results table
CREATE TABLE public.results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  roll_number TEXT NOT NULL,
  class TEXT NOT NULL,
  exam_name TEXT NOT NULL,
  year TEXT NOT NULL,
  subjects JSONB NOT NULL DEFAULT '[]',
  total_marks NUMERIC,
  obtained_marks NUMERIC,
  percentage NUMERIC,
  grade TEXT,
  status TEXT NOT NULL DEFAULT 'pass',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Results are publicly readable" ON public.results FOR SELECT USING (true);

-- Admin management
CREATE POLICY "Admins can manage results" ON public.results FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Update trigger
CREATE TRIGGER update_results_updated_at BEFORE UPDATE ON public.results FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Index for fast roll number lookups
CREATE INDEX idx_results_roll_number ON public.results(roll_number);
