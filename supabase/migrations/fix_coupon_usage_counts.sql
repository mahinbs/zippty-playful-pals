-- Fix coupon usage counts by updating used_count based on actual usage
-- This will sync the used_count field with the actual number of usages

-- Update used_count for each coupon based on actual usage in coupon_usage table
UPDATE public.coupons 
SET used_count = (
    SELECT COUNT(*) 
    FROM public.coupon_usage 
    WHERE coupon_usage.coupon_id = coupons.id
)
WHERE id IN (
    SELECT DISTINCT coupon_id 
    FROM public.coupon_usage
);

-- Set used_count to 0 for coupons that have no usage
UPDATE public.coupons 
SET used_count = 0 
WHERE id NOT IN (
    SELECT DISTINCT coupon_id 
    FROM public.coupon_usage
);

-- Add a comment explaining the fix
COMMENT ON COLUMN public.coupons.used_count IS 'Number of times this coupon has been used successfully';
