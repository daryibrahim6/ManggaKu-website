/**
 * Seed script for ManggaKu Supabase
 * 
 * Run: npx tsx scripts/seed.ts
 * 
 * This script:
 * 1. Creates a test seller account (petani)
 * 2. Creates a test UMKM account
 * 3. Inserts 6 mock products
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config()

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars. Check .env file.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
  console.log('🌱 Starting seed...\n')

  // 1. Create test petani account
  console.log('1. Creating petani account...')
  const { data: petaniAuth, error: petaniError } = await supabase.auth.admin.createUser({
    email: 'pak.karso@manggaku.test',
    password: 'password123',
    email_confirm: true,
    user_metadata: {
      name: 'Pak Karso',
      phone: '081234567890',
      role: 'petani',
    },
  })

  if (petaniError) {
    if (petaniError.message.includes('already exists')) {
      console.log('   ⚠️  Petani account already exists, skipping...')
    } else {
      console.error('   ❌ Error:', petaniError.message)
    }
  } else {
    console.log('   ✅ Petani account created:', petaniAuth.user.email)

    // Create petani profile
    const { error: profileError } = await supabase
      .from('petani_profiles')
      .insert({
        user_id: petaniAuth.user.id,
        store_name: 'Kebun Karso Indramayu',
        store_slug: 'pak-karso',
        location: 'Jatibarang, Indramayu',
        bio: 'Petani mangga generasi ke-3 di Indramayu. Khusus varietas Gedong Gincu dan Harum Manis.',
        is_verified_seller: true,
        verification_status: 'approved',
      })

    if (profileError) {
      console.error('   ❌ Profile error:', profileError.message)
    } else {
      console.log('   ✅ Petani profile created')
    }
  }

  // 2. Create test UMKM account
  console.log('\n2. Creating UMKM account...')
  const { data: umkmAuth, error: umkmError } = await supabase.auth.admin.createUser({
    email: 'bu.rina@manggaku.test',
    password: 'password123',
    email_confirm: true,
    user_metadata: {
      name: 'Bu Rina',
      phone: '081234567891',
      role: 'umkm',
    },
  })

  if (umkmError) {
    if (umkmError.message.includes('already exists')) {
      console.log('   ⚠️  UMKM account already exists, skipping...')
    } else {
      console.error('   ❌ Error:', umkmError.message)
    }
  } else {
    console.log('   ✅ UMKM account created:', umkmAuth.user.email)

    // Create UMKM profile
    const { error: profileError } = await supabase
      .from('umkm_profiles')
      .insert({
        user_id: umkmAuth.user.id,
        business_name: 'Malika Food Processing',
        business_slug: 'malika-food',
        product_types: ['jus', 'keripik', 'manisan'],
        location: 'Indramayu Kota',
        verification_status: 'approved',
      })

    if (profileError) {
      console.error('   ❌ Profile error:', profileError.message)
    } else {
      console.log('   ✅ UMKM profile created')
    }
  }

  // 3. Create test konsumen account
  console.log('\n3. Creating konsumen account...')
  const { error: konsumenError } = await supabase.auth.admin.createUser({
    email: 'siti@manggaku.test',
    password: 'password123',
    email_confirm: true,
    user_metadata: {
      name: 'Siti Aminah',
      phone: '081234567892',
      role: 'konsumen',
    },
  })

  if (konsumenError) {
    if (konsumenError.message.includes('already exists')) {
      console.log('   ⚠️  Konsumen account already exists, skipping...')
    } else {
      console.error('   ❌ Error:', konsumenError.message)
    }
  } else {
    console.log('   ✅ Konsumen account created')
  }

  // 4. Get seller IDs for products
  console.log('\n4. Fetching seller IDs...')
  const { data: petaniProfile } = await supabase
    .from('petani_profiles')
    .select('user_id')
    .eq('store_slug', 'pak-karso')
    .single()

  const { data: umkmProfile } = await supabase
    .from('umkm_profiles')
    .select('user_id')
    .eq('business_slug', 'malika-food')
    .single()

  const petaniId = petaniProfile?.user_id
  const umkmId = umkmProfile?.user_id

  if (!petaniId || !umkmId) {
    console.error('   ❌ Could not find seller profiles. Make sure accounts were created first.')
    process.exit(1)
  }
  console.log('   ✅ Petani ID:', petaniId)
  console.log('   ✅ UMKM ID:', umkmId)

  // 5. Insert products
  console.log('\n5. Inserting products...')

  const products = [
    {
      slug: 'mangga-gedong-gincu-segar',
      seller_id: petaniId,
      seller_role: 'petani',
      name: 'Mangga Gedong Gincu Segar',
      variety: 'gedong_gincu',
      category: 'fresh',
      description: 'Mangga gedong gincu segar dari kebun Indramayu. Manis, harum, dan berair. Dipanen saat matang sempurna.',
      price: 35000,
      unit: 'kg',
      stock: 150,
      min_order: 2,
      images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=400&fit=crop'],
      rating: 4.8,
      review_count: 47,
      status: 'active',
    },
    {
      slug: 'mangga-harum-manis-premium',
      seller_id: petaniId,
      seller_role: 'petani',
      name: 'Mangga Harum Manis Premium',
      variety: 'harum_manis',
      category: 'fresh',
      description: 'Mangga harum manis kualitas premium. Daging tebal, manis legit, cocok untuk dimakan langsung.',
      price: 42000,
      unit: 'kg',
      stock: 80,
      min_order: 1,
      images: ['https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=400&fit=crop'],
      rating: 4.9,
      review_count: 63,
      status: 'active',
    },
    {
      slug: 'jus-mangga-murni',
      seller_id: umkmId,
      seller_role: 'umkm',
      name: 'Jus Mangga Murni',
      category: 'olahan',
      description: 'Jus mangga murni tanpa pengawet. Dibuat dari mangga pilihan, segar dan menyegarkan.',
      price: 25000,
      unit: 'botol',
      stock: 200,
      min_order: 3,
      images: ['https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=400&fit=crop'],
      rating: 4.7,
      review_count: 89,
      status: 'active',
    },
    {
      slug: 'mangga-cengkir-bulk-10kg',
      seller_id: petaniId,
      seller_role: 'petani',
      name: 'Mangga Cengkir Bulk 10kg',
      variety: 'cengkir',
      category: 'bulk',
      description: 'Paket bulk 10kg mangga cengkir untuk kebutuhan usaha atau acara. Harga lebih hemat.',
      price: 280000,
      unit: 'box',
      stock: 50,
      min_order: 1,
      images: ['https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?w=400&h=400&fit=crop'],
      rating: 4.6,
      review_count: 34,
      status: 'active',
    },
    {
      slug: 'keripik-mangga-malika',
      seller_id: umkmId,
      seller_role: 'umkm',
      name: 'Keripik Mangga Malika',
      category: 'olahan',
      description: 'Keripik mangga renyah dari brand Malika. Camilan sehat tanpa MSG, cocok untuk semua usia.',
      price: 18000,
      unit: 'pcs',
      stock: 300,
      min_order: 5,
      images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop'],
      rating: 4.5,
      review_count: 112,
      status: 'active',
    },
    {
      slug: 'mangga-manalagi-segar',
      seller_id: petaniId,
      seller_role: 'petani',
      name: 'Mangga Manalagi Segar',
      variety: 'manalagi',
      category: 'fresh',
      description: 'Mangga manalagi segar dengan tekstur lembut dan rasa manis alami. Panen langsung dari kebun.',
      price: 30000,
      unit: 'kg',
      stock: 120,
      min_order: 2,
      images: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop'],
      rating: 4.4,
      review_count: 28,
      status: 'active',
    },
  ]

  // Check if products already exist
  const { data: existingProducts } = await supabase
    .from('products')
    .select('slug')

  const existingSlugs = new Set(existingProducts?.map(p => p.slug) || [])
  let insertedCount = 0

  for (const product of products) {
    if (existingSlugs.has(product.slug)) {
      console.log(`   ⚠️  ${product.name} already exists, skipping...`)
      continue
    }

    const { error } = await supabase.from('products').insert(product)
    if (error) {
      console.error(`   ❌ Error inserting ${product.name}:`, error.message)
    } else {
      console.log(`   ✅ Inserted: ${product.name}`)
      insertedCount++
    }
  }

  console.log('\n🎉 Seed complete!')
  console.log(`   - 3 accounts (petani, umkm, konsumen)`)
  console.log(`   - ${insertedCount} products inserted`)
  console.log('\n📧 Test accounts:')
  console.log('   Petani: pak.karso@manggaku.test / password123')
  console.log('   UMKM:   bu.rina@manggaku.test / password123')
  console.log('   User:   siti@manggaku.test / password123')
}

seed().catch(console.error)
