-- Fix idempotency_key constraint to allow multiple attempts
-- Drop the existing unique constraint
DROP INDEX IF EXISTS orders_idempotency_key_unique_not_null;

-- Create a new unique constraint that allows nulls but ensures uniqueness when values are present
-- This allows for better handling of duplicate order attempts
CREATE UNIQUE INDEX IF NOT EXISTS orders_idempotency_key_unique_not_null
  ON public.orders (idempotency_key)
  WHERE idempotency_key IS NOT NULL;

-- Add a comment explaining the constraint
COMMENT ON INDEX orders_idempotency_key_unique_not_null IS 'Ensures unique idempotency keys when present, allows nulls for orders without idempotency keys';
