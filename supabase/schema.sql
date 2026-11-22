-- ============================================
-- Mohite Farms - Supabase Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CATEGORIES
-- ============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PRODUCTS
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  images TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PRODUCT VARIANTS (pack sizes)
-- ============================================
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  sku TEXT UNIQUE,
  pack_size TEXT NOT NULL,          -- e.g., "1 kg", "5 kg", "500 g"
  pack_size_grams INTEGER NOT NULL, -- normalized weight in grams for sorting
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),   -- strikethrough price
  stock INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SHIPPING CONFIG
-- ============================================
CREATE TABLE shipping_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  base_charge DECIMAL(10,2) DEFAULT 0,
  free_shipping_threshold DECIMAL(10,2),  -- free shipping above this order value
  per_kg_charge DECIMAL(10,2) DEFAULT 0,
  cod_extra_charge DECIMAL(10,2) DEFAULT 0,
  is_cod_available BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ORDERS
-- ============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID,  -- from Supabase Auth
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,

  -- Shipping Address
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  country TEXT DEFAULT 'India',

  -- Amounts
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_charge DECIMAL(10,2) DEFAULT 0,
  cod_charge DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,

  -- Payment
  payment_method TEXT NOT NULL DEFAULT 'online',  -- 'online' | 'cod'
  payment_status TEXT NOT NULL DEFAULT 'pending',  -- 'pending' | 'paid' | 'failed' | 'refunded'
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,

  -- Order Status
  status TEXT NOT NULL DEFAULT 'pending',  -- 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  tracking_number TEXT,
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ORDER ITEMS
-- ============================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  variant_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Public read access for categories, products, variants, shipping
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read variants" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Public read shipping" ON shipping_config FOR SELECT USING (true);

-- Authenticated users can read their own orders
CREATE POLICY "Users read own orders" ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users read own order items" ON order_items FOR SELECT
  USING (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
  );

-- Service role (admin API routes) has full access by default
-- These policies allow the service role key to manage all data

-- Admin policies (using service role key in API routes)
-- The service role key bypasses RLS, so admin operations work through API routes

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_variants_updated_at BEFORE UPDATE ON product_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number = 'MF-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- ============================================
-- SEED DATA
-- ============================================

-- Categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Khapli Wheat', 'khapli-wheat', 'Ancient emmer wheat grown naturally in the Deccan Plateau. Known for its nutty flavor and traditional heritage.', 1),
  ('Shalu', 'shalu', 'Traditional jowar (sorghum) variety native to Maharashtra. A wholesome, gluten-free grain.', 2);

-- Products
INSERT INTO products (category_id, name, slug, description, short_description, is_featured, sort_order) VALUES
  (
    (SELECT id FROM categories WHERE slug = 'khapli-wheat'),
    'Khapli Wheat Grain',
    'khapli-wheat-grain',
    'Khapli (Emmer) wheat grain, grown naturally on our farm in Tondoli, Kadegaon, Maharashtra. This ancient grain variety has been cultivated in the Deccan Plateau for generations. Our Khapli wheat is grown without chemical pesticides or synthetic fertilizers, harvested at peak maturity, and carefully cleaned before packing. Ideal for making traditional chapatis, bhakri, and porridge.',
    'Naturally grown ancient emmer wheat grain from our farm in Tondoli, Maharashtra.',
    true,
    1
  ),
  (
    (SELECT id FROM categories WHERE slug = 'khapli-wheat'),
    'Khapli Wheat Atta',
    'khapli-wheat-atta',
    'Stone-ground flour made from our farm-grown Khapli (Emmer) wheat. The flour is milled fresh in small batches to preserve its natural nutrients and earthy aroma. Perfect for soft, flavorful chapatis and rotis. Our atta retains the bran and germ for wholesome nutrition.',
    'Fresh stone-ground flour from farm-grown Khapli wheat.',
    true,
    2
  ),
  (
    (SELECT id FROM categories WHERE slug = 'shalu'),
    'Shalu Grain',
    'shalu-grain',
    'Shalu jowar (sorghum) grain, a traditional Maharashtra variety grown on our family farm. Shalu is a hardy, rain-fed crop that thrives in the Kadegaon region. This gluten-free grain is naturally rich in fiber and has been a dietary staple in western Maharashtra for centuries. Use it for bhakri, porridge, or as a rice alternative.',
    'Traditional Maharashtra jowar variety, naturally grown and gluten-free.',
    true,
    3
  ),
  (
    (SELECT id FROM categories WHERE slug = 'shalu'),
    'Shalu Flour',
    'shalu-flour',
    'Freshly milled Shalu jowar flour, made from our farm-grown sorghum. Ground in small batches to maintain freshness and nutritional value. This gluten-free flour makes excellent bhakri and can be used in various traditional recipes. The flour has a subtle, sweet flavor characteristic of the Shalu variety.',
    'Freshly milled gluten-free jowar flour from our farm.',
    true,
    4
  );

-- Product Variants (pack sizes with prices)
-- Khapli Wheat Grain
INSERT INTO product_variants (product_id, sku, pack_size, pack_size_grams, price, compare_at_price, stock) VALUES
  ((SELECT id FROM products WHERE slug = 'khapli-wheat-grain'), 'KWG-1KG', '1 kg', 1000, 120.00, 150.00, 50),
  ((SELECT id FROM products WHERE slug = 'khapli-wheat-grain'), 'KWG-2KG', '2 kg', 2000, 230.00, 290.00, 40),
  ((SELECT id FROM products WHERE slug = 'khapli-wheat-grain'), 'KWG-5KG', '5 kg', 5000, 550.00, 700.00, 30),
  ((SELECT id FROM products WHERE slug = 'khapli-wheat-grain'), 'KWG-10KG', '10 kg', 10000, 1050.00, 1350.00, 20);

-- Khapli Wheat Atta
INSERT INTO product_variants (product_id, sku, pack_size, pack_size_grams, price, compare_at_price, stock) VALUES
  ((SELECT id FROM products WHERE slug = 'khapli-wheat-atta'), 'KWA-1KG', '1 kg', 1000, 140.00, 170.00, 50),
  ((SELECT id FROM products WHERE slug = 'khapli-wheat-atta'), 'KWA-2KG', '2 kg', 2000, 270.00, 330.00, 40),
  ((SELECT id FROM products WHERE slug = 'khapli-wheat-atta'), 'KWA-5KG', '5 kg', 5000, 650.00, 800.00, 30),
  ((SELECT id FROM products WHERE slug = 'khapli-wheat-atta'), 'KWA-10KG', '10 kg', 10000, 1250.00, 1550.00, 20);

-- Shalu Grain
INSERT INTO product_variants (product_id, sku, pack_size, pack_size_grams, price, compare_at_price, stock) VALUES
  ((SELECT id FROM products WHERE slug = 'shalu-grain'), 'SG-1KG', '1 kg', 1000, 90.00, 110.00, 60),
  ((SELECT id FROM products WHERE slug = 'shalu-grain'), 'SG-2KG', '2 kg', 2000, 170.00, 210.00, 45),
  ((SELECT id FROM products WHERE slug = 'shalu-grain'), 'SG-5KG', '5 kg', 5000, 400.00, 500.00, 35),
  ((SELECT id FROM products WHERE slug = 'shalu-grain'), 'SG-10KG', '10 kg', 10000, 760.00, 950.00, 25);

-- Shalu Flour
INSERT INTO product_variants (product_id, sku, pack_size, pack_size_grams, price, compare_at_price, stock) VALUES
  ((SELECT id FROM products WHERE slug = 'shalu-flour'), 'SF-1KG', '1 kg', 1000, 100.00, 130.00, 55),
  ((SELECT id FROM products WHERE slug = 'shalu-flour'), 'SF-2KG', '2 kg', 2000, 190.00, 250.00, 40),
  ((SELECT id FROM products WHERE slug = 'shalu-flour'), 'SF-5KG', '5 kg', 5000, 450.00, 600.00, 30),
  ((SELECT id FROM products WHERE slug = 'shalu-flour'), 'SF-10KG', '10 kg', 10000, 860.00, 1150.00, 20);

-- Shipping Config
INSERT INTO shipping_config (name, description, base_charge, free_shipping_threshold, per_kg_charge, cod_extra_charge, is_cod_available) VALUES
  ('Standard Shipping', 'Standard delivery across India. Free shipping on orders above ₹999.', 60.00, 999.00, 15.00, 40.00, true);

-- ============================================
-- STORAGE BUCKET
-- ============================================
-- Run this separately in Supabase:
-- 1. Go to Storage > Create bucket named "product-images" (public)
-- 2. Add policy: Allow public read access
-- 3. Add policy: Allow authenticated users to upload (for admin)
