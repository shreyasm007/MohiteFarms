-- ============================================
-- Additional SQL functions
-- Run after schema.sql
-- ============================================

-- Function to safely decrement stock
CREATE OR REPLACE FUNCTION decrement_stock(p_variant_id UUID, p_quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE product_variants
  SET stock = GREATEST(0, stock - p_quantity)
  WHERE id = p_variant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policy to allow authenticated users to insert orders
CREATE POLICY "Authenticated users can create orders" ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow authenticated users to insert order items for their orders
CREATE POLICY "Authenticated users can create order items" ON order_items
  FOR INSERT
  WITH CHECK (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
  );

-- ============================================
-- Supabase Storage Setup Instructions
-- ============================================
-- 1. Go to Supabase Dashboard > Storage
-- 2. Create a new bucket called "product-images"
-- 3. Make it PUBLIC (toggle public access on)
-- 4. Add an RLS policy for the bucket:
--    - Policy name: "Allow public read"
--    - Operation: SELECT
--    - Target roles: (leave empty for all)
--    - USING expression: true
-- 5. Add another policy:
--    - Policy name: "Allow authenticated uploads"
--    - Operation: INSERT
--    - Target roles: authenticated
--    - WITH CHECK expression: true

-- ============================================
-- Supabase Auth Setup Instructions
-- ============================================
-- 1. Go to Supabase Dashboard > Authentication > Providers
-- 2. Enable Google provider:
--    - Add your Google Client ID and Secret
--    - Set redirect URL to: https://your-project.supabase.co/auth/v1/callback
-- 3. Enable Phone (OTP) provider:
--    - Choose Twilio or another SMS provider
--    - Configure SMS template
-- 4. Go to Authentication > URL Configuration:
--    - Site URL: https://your-domain.com (or http://localhost:3000 for dev)
--    - Redirect URLs: http://localhost:3000/auth/callback, https://your-domain.com/auth/callback
