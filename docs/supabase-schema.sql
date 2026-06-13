-- ============================================
-- ManggaKu — Supabase Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Profiles (extend from auth.users)
CREATE TABLE public.profiles (
  id          UUID REFERENCES auth.users PRIMARY KEY,
  name        TEXT NOT NULL,
  phone       TEXT,
  role        TEXT NOT NULL CHECK (role IN ('konsumen', 'petani', 'umkm', 'admin')),
  avatar_url  TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- 2. Petani profiles
CREATE TABLE public.petani_profiles (
  user_id             UUID REFERENCES public.profiles PRIMARY KEY,
  store_name          TEXT NOT NULL,
  store_slug          TEXT UNIQUE NOT NULL,
  location            TEXT,
  bio                 TEXT,
  rating              NUMERIC(3,2) DEFAULT 0,
  total_sales         INT DEFAULT 0,
  is_verified_seller  BOOLEAN DEFAULT false,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected'))
);

-- 3. UMKM profiles
CREATE TABLE public.umkm_profiles (
  user_id             UUID REFERENCES public.profiles PRIMARY KEY,
  business_name       TEXT NOT NULL,
  business_slug       TEXT UNIQUE NOT NULL,
  product_types       TEXT[],
  certifications      TEXT[],
  location            TEXT,
  rating              NUMERIC(3,2) DEFAULT 0,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected'))
);

-- 4. Addresses
CREATE TABLE public.addresses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES public.profiles NOT NULL,
  recipient_name  TEXT NOT NULL,
  phone           TEXT NOT NULL,
  street          TEXT NOT NULL,
  kelurahan       TEXT,
  kecamatan       TEXT,
  kabupaten       TEXT DEFAULT 'Indramayu',
  provinsi        TEXT DEFAULT 'Jawa Barat',
  postal_code     TEXT,
  is_default      BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- 5. Products
CREATE TABLE public.products (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             TEXT UNIQUE NOT NULL,
  seller_id        UUID REFERENCES public.profiles NOT NULL,
  seller_role      TEXT NOT NULL CHECK (seller_role IN ('petani', 'umkm')),
  name             TEXT NOT NULL,
  variety          TEXT,
  category         TEXT NOT NULL CHECK (category IN ('fresh', 'olahan', 'bulk')),
  description      TEXT,
  price            INT NOT NULL,
  unit             TEXT NOT NULL,
  stock            INT NOT NULL DEFAULT 0,
  min_order        INT NOT NULL DEFAULT 1,
  images           TEXT[] DEFAULT '{}',
  rating           NUMERIC(3,2) DEFAULT 0,
  review_count     INT DEFAULT 0,
  status           TEXT DEFAULT 'pending_review'
                   CHECK (status IN ('active', 'inactive', 'pending_review', 'rejected')),
  rejection_reason TEXT,
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

-- 6. Orders
CREATE TABLE public.orders (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number      TEXT UNIQUE NOT NULL,
  buyer_id          UUID REFERENCES public.profiles NOT NULL,
  status            TEXT NOT NULL DEFAULT 'pending_payment',
  payment_method    TEXT,
  shipping_address  JSONB NOT NULL,
  items             JSONB NOT NULL,
  subtotal          INT NOT NULL,
  shipping_fee      INT NOT NULL DEFAULT 0,
  platform_fee      INT NOT NULL DEFAULT 0,
  total             INT NOT NULL,
  tracking_number   TEXT,
  courier           TEXT,
  notes             TEXT,
  paid_at           TIMESTAMPTZ,
  shipped_at        TIMESTAMPTZ,
  delivered_at      TIMESTAMPTZ,
  completed_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- 7. Reviews
CREATE TABLE public.reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID REFERENCES public.products NOT NULL,
  order_id    UUID REFERENCES public.orders NOT NULL,
  user_id     UUID REFERENCES public.profiles NOT NULL,
  rating      INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  images      TEXT[] DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Profiles: users can read all, update own
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Petani profiles: public read, owner update
ALTER TABLE public.petani_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Petani profiles viewable by everyone" ON public.petani_profiles FOR SELECT USING (true);
CREATE POLICY "Petani can update own profile" ON public.petani_profiles FOR UPDATE USING (auth.uid() = user_id);

-- UMKM profiles: public read, owner update
ALTER TABLE public.umkm_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "UMKM profiles viewable by everyone" ON public.umkm_profiles FOR SELECT USING (true);
CREATE POLICY "UMKM can update own profile" ON public.umkm_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Addresses: owner only
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own addresses" ON public.addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own addresses" ON public.addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own addresses" ON public.addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own addresses" ON public.addresses FOR DELETE USING (auth.uid() = user_id);

-- Products: public read, owner CRUD
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Sellers can insert own products" ON public.products FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can update own products" ON public.products FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can delete own products" ON public.products FOR DELETE USING (auth.uid() = seller_id);

-- Orders: buyer and seller can view
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buyers can view own orders" ON public.orders FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Buyers can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Buyers can update own orders" ON public.orders FOR UPDATE USING (auth.uid() = buyer_id);

-- Reviews: public read, author CRUD
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can insert own reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'konsumen')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- SEED DATA (6 mock products)
-- ============================================

-- Note: Products need seller_id which references auth.users.
-- You'll need to create a test seller account first,
-- then run this seed with the actual UUID.

-- INSERT INTO public.products (slug, seller_id, seller_role, name, variety, category, description, price, unit, stock, min_order, images, rating, review_count, status)
-- VALUES
-- ('mangga-gedong-gincu-segar', 'SELLER_UUID', 'petani', 'Mangga Gedong Gincu Segar', 'gedong_gincu', 'fresh', 'Mangga gedong gincu segar dari kebun Indramayu.', 35000, 'kg', 150, 2, ARRAY['https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=400&fit=crop'], 4.8, 47, 'active'),
-- ('mangga-harum-manis-premium', 'SELLER_UUID', 'petani', 'Mangga Harum Manis Premium', 'harum_manis', 'fresh', 'Mangga harum manis kualitas premium.', 42000, 'kg', 80, 1, ARRAY['https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=400&fit=crop'], 4.9, 63, 'active'),
-- ('jus-mangga-murni', 'SELLER_UUID', 'umkm', 'Jus Mangga Murni', NULL, 'olahan', 'Jus mangga murni tanpa pengawet.', 25000, 'botol', 200, 3, ARRAY['https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=400&fit=crop'], 4.7, 89, 'active'),
-- ('mangga-cengkir-bulk-10kg', 'SELLER_UUID', 'petani', 'Mangga Cengkir Bulk 10kg', 'cengkir', 'bulk', 'Paket bulk 10kg mangga cengkir.', 280000, 'box', 50, 1, ARRAY['https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?w=400&h=400&fit=crop'], 4.6, 34, 'active'),
-- ('keripik-mangga-malika', 'SELLER_UUID', 'umkm', 'Keripik Mangga Malika', NULL, 'olahan', 'Keripik mangga renyah dari brand Malika.', 18000, 'pcs', 300, 5, ARRAY['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop'], 4.5, 112, 'active'),
-- ('mangga-manalagi-segar', 'SELLER_UUID', 'petani', 'Mangga Manalagi Segar', 'manalagi', 'fresh', 'Mangga manalagi segar dengan tekstur lembut.', 30000, 'kg', 120, 2, ARRAY['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop'], 4.4, 28, 'active');
