-- Fix RLS policies for coupons table to allow admin operations

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access to active coupons" ON public.coupons;
DROP POLICY IF EXISTS "Allow admin full access" ON public.coupons;

-- Create new policies for coupons
-- Allow public read access to active coupons
CREATE POLICY "Allow public read access to active coupons" ON public.coupons
    FOR SELECT USING (is_active = true AND expires_at > NOW());

-- Allow authenticated users to read all coupons (for admin panel)
CREATE POLICY "Allow authenticated users to read all coupons" ON public.coupons
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert coupons (for admin panel)
CREATE POLICY "Allow authenticated users to insert coupons" ON public.coupons
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update coupons (for admin panel)
CREATE POLICY "Allow authenticated users to update coupons" ON public.coupons
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete coupons (for admin panel)
CREATE POLICY "Allow authenticated users to delete coupons" ON public.coupons
    FOR DELETE USING (auth.role() = 'authenticated');

-- Fix coupon_usage policies
DROP POLICY IF EXISTS "Users can view their own coupon usage" ON public.coupon_usage;
DROP POLICY IF EXISTS "Users can insert their own coupon usage" ON public.coupon_usage;

-- Allow users to view their own coupon usage
CREATE POLICY "Users can view their own coupon usage" ON public.coupon_usage
    FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own coupon usage
CREATE POLICY "Users can insert their own coupon usage" ON public.coupon_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to read all coupon usage (for admin)
CREATE POLICY "Allow authenticated users to read all coupon usage" ON public.coupon_usage
    FOR SELECT USING (auth.role() = 'authenticated');
