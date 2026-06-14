-- ============================================
-- ManggaKu — Seed Test Users
-- Run this in Supabase SQL Editor
-- ============================================
-- Test Credentials:
--   konsumen@test.com / password123
--   petani@test.com   / password123
--   umkm@test.com     / password123
-- ============================================

-- ============================================
-- 1. KONSUMEN
-- ============================================
DO $$
DECLARE
  konsumen_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    raw_app_meta_data,
    raw_user_meta_data
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    konsumen_id,
    'authenticated',
    'authenticated',
    'konsumen@test.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '',
    '',
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Konsumen Test", "phone": "081234560001", "role": "konsumen"}'
  );

  -- Trigger otomatis buat profiles row, tapi kita insert manual untuk safety
  INSERT INTO public.profiles (id, name, phone, role)
  VALUES (konsumen_id, 'Konsumen Test', '081234560001', 'konsumen')
  ON CONFLICT (id) DO NOTHING;

  RAISE NOTICE '✅ konsumen@test.com created (id: %)', konsumen_id;
END $$;

-- ============================================
-- 2. PETANI
-- ============================================
DO $$
DECLARE
  petani_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    raw_app_meta_data,
    raw_user_meta_data
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    petani_id,
    'authenticated',
    'authenticated',
    'petani@test.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '',
    '',
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Pak Test Petani", "phone": "081234560002", "role": "petani"}'
  );

  -- Profile
  INSERT INTO public.profiles (id, name, phone, role)
  VALUES (petani_id, 'Pak Test Petani', '081234560002', 'petani')
  ON CONFLICT (id) DO NOTHING;

  -- Petani profile
  INSERT INTO public.petani_profiles (user_id, store_name, store_slug, location, bio, rating, total_sales)
  VALUES (
    petani_id,
    'Kebun Test Indramayu',
    'kebun-test-indramayu',
    'Indramayu, Jawa Barat',
    'Petani mangga test dari Indramayu',
    4.8,
    156
  );

  RAISE NOTICE '✅ petani@test.com created (id: %)', petani_id;
END $$;

-- ============================================
-- 3. UMKM
-- ============================================
DO $$
DECLARE
  umkm_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    raw_app_meta_data,
    raw_user_meta_data
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    umkm_id,
    'authenticated',
    'authenticated',
    'umkm@test.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '',
    '',
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Bu Test UMKM", "phone": "081234560003", "role": "umkm"}'
  );

  -- Profile
  INSERT INTO public.profiles (id, name, phone, role)
  VALUES (umkm_id, 'Bu Test UMKM', '081234560003', 'umkm')
  ON CONFLICT (id) DO NOTHING;

  -- UMKM profile
  INSERT INTO public.umkm_profiles (user_id, business_name, business_slug, product_types, certifications, location, rating)
  VALUES (
    umkm_id,
    'UMKM Test Mangga',
    'umkm-test-mangga',
    ARRAY['Keripik Mangga', 'Jus Mangga'],
    ARRAY['Halal', 'P-IRT'],
    'Indramayu, Jawa Barat',
    4.6
  );

  RAISE NOTICE '✅ umkm@test.com created (id: %)', umkm_id;
END $$;

-- ============================================
-- Verifikasi
-- ============================================
SELECT '🎉 Seed selesai! 3 test users created.' AS status;

-- Cek users
SELECT
  au.email,
  p.name,
  p.role,
  p.created_at
FROM auth.users au
JOIN public.profiles p ON p.id = au.id
WHERE au.email IN ('konsumen@test.com', 'petani@test.com', 'umkm@test.com')
ORDER BY p.role;
