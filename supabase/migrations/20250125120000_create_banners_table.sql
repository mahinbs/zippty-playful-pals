-- Create banners table for managing hero banners
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_banners_is_active ON public.banners(is_active);
CREATE INDEX IF NOT EXISTS idx_banners_display_order ON public.banners(display_order);
CREATE INDEX IF NOT EXISTS idx_banners_created_at ON public.banners(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to active banners
CREATE POLICY "Allow public read access to active banners" ON public.banners
    FOR SELECT USING (is_active = true);

-- Create policies for admin full access
CREATE POLICY "Allow admin full access to banners" ON public.banners
    FOR ALL USING (true);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_banners_updated_at 
    BEFORE UPDATE ON public.banners 
    FOR EACH ROW 
    EXECUTE FUNCTION public.trigger_set_timestamp();

-- Insert sample banners
INSERT INTO public.banners (title, subtitle, image_url, alt_text, display_order, is_active) VALUES
('Smart Play for Smart Pets', 'Interactive toys that adapt to your pet''s behavior', '/src/assets/hero-pet-1.jpg', 'Golden retriever playing with interactive smart toy', 1, true),
('Mental Stimulation Made Fun', 'Puzzle feeders that challenge and entertain', '/src/assets/hero-pet-2.jpg', 'Orange tabby cat with puzzle feeder', 2, true),
('Endless Entertainment', 'Automated toys for active playtime', '/src/assets/hero-pet-3.jpg', 'Beagle puppy with automated ball launcher', 3, true);
