-- Create coupons table
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('fixed', 'percentage')),
    value DECIMAL(10,2) NOT NULL,
    max_discount DECIMAL(10,2), -- For percentage coupons
    min_order_value DECIMAL(10,2) DEFAULT 0,
    max_usage INTEGER DEFAULT 1,
    used_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create coupon usage tracking table
CREATE TABLE IF NOT EXISTS public.coupon_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    coupon_id UUID REFERENCES public.coupons(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    discount_amount DECIMAL(10,2) NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(coupon_id, user_id) -- One coupon per user
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON public.coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_coupons_expires_at ON public.coupons(expires_at);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_coupon_id ON public.coupon_usage(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_user_id ON public.coupon_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_order_id ON public.coupon_usage(order_id);

-- Enable Row Level Security
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;

-- Create policies for coupons (public read access to active coupons)
CREATE POLICY "Allow public read access to active coupons" ON public.coupons
    FOR SELECT USING (is_active = true AND expires_at > NOW());

-- Create policies for coupon usage (users can view their own usage)
CREATE POLICY "Users can view their own coupon usage" ON public.coupon_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coupon usage" ON public.coupon_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_coupons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_coupons_updated_at 
    BEFORE UPDATE ON public.coupons 
    FOR EACH ROW 
    EXECUTE FUNCTION update_coupons_updated_at();

-- Insert sample coupons
INSERT INTO public.coupons (code, name, description, type, value, max_discount, min_order_value, max_usage, expires_at)
VALUES 
    ('WELCOME10', 'Welcome Discount', 'Get 10% off on your first order', 'percentage', 10, 500, 1000, 100, NOW() + INTERVAL '30 days'),
    ('SAVE200', 'Flat Discount', 'Get ₹200 off on orders above ₹1500', 'fixed', 200, NULL, 1500, 50, NOW() + INTERVAL '15 days'),
    ('NEWUSER', 'New User Special', 'Get ₹100 off on your first order', 'fixed', 100, NULL, 500, 200, NOW() + INTERVAL '7 days')
ON CONFLICT (code) DO NOTHING;
