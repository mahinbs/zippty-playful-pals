-- Add coupon fields to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS coupon_id UUID REFERENCES public.coupons(id),
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) DEFAULT 0;

-- Create index for coupon_id
CREATE INDEX IF NOT EXISTS idx_orders_coupon_id ON public.orders(coupon_id);

-- Add comment for the new columns
COMMENT ON COLUMN public.orders.coupon_id IS 'Reference to the coupon used for this order';
COMMENT ON COLUMN public.orders.discount_amount IS 'Discount amount applied from coupon';
