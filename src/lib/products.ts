import { supabase } from './supabase'
import type { Product, ProductCategory } from '../types'

export interface ProductFilters {
  category?: ProductCategory
  search?: string
  minPrice?: number
  maxPrice?: number
  sellerRole?: 'petani' | 'umkm'
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popular'
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*')
    .eq('status', 'active')

  // Filter by category
  if (filters.category) {
    query = query.eq('category', filters.category)
  }

  // Filter by search term
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  // Filter by price range
  if (filters.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice)
  }
  if (filters.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice)
  }

  // Filter by seller role
  if (filters.sellerRole) {
    query = query.eq('seller_role', filters.sellerRole)
  }

  // Sort
  switch (filters.sortBy) {
    case 'price_asc':
      query = query.order('price', { ascending: true })
      break
    case 'price_desc':
      query = query.order('price', { ascending: false })
      break
    case 'rating':
      query = query.order('rating', { ascending: false })
      break
    case 'popular':
      query = query.order('review_count', { ascending: false })
      break
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false })
      break
  }

  const { data, error } = await query

  if (error) {
    return []
  }

  return data.map((p) => ({
    id: p.id,
    slug: p.slug,
    sellerId: p.seller_id,
    sellerRole: p.seller_role,
    sellerName: '', // Will be joined or fetched separately
    sellerVerified: false,
    name: p.name,
    variety: p.variety ?? undefined,
    category: p.category,
    description: p.description ?? '',
    price: p.price,
    unit: p.unit,
    stock: p.stock,
    minOrder: p.min_order,
    images: p.images ?? [],
    rating: Number(p.rating),
    reviewCount: p.review_count,
    status: p.status,
    rejectionReason: p.rejection_reason ?? undefined,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  }))
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    return null
  }

  return {
    id: data.id,
    slug: data.slug,
    sellerId: data.seller_id,
    sellerRole: data.seller_role,
    sellerName: '',
    sellerVerified: false,
    name: data.name,
    variety: data.variety ?? undefined,
    category: data.category,
    description: data.description ?? '',
    price: data.price,
    unit: data.unit,
    stock: data.stock,
    minOrder: data.min_order,
    images: data.images ?? [],
    rating: Number(data.rating),
    reviewCount: data.review_count,
    status: data.status,
    rejectionReason: data.rejection_reason ?? undefined,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return {
    id: data.id,
    slug: data.slug,
    sellerId: data.seller_id,
    sellerRole: data.seller_role,
    sellerName: '',
    sellerVerified: false,
    name: data.name,
    variety: data.variety ?? undefined,
    category: data.category,
    description: data.description ?? '',
    price: data.price,
    unit: data.unit,
    stock: data.stock,
    minOrder: data.min_order,
    images: data.images ?? [],
    rating: Number(data.rating),
    reviewCount: data.review_count,
    status: data.status,
    rejectionReason: data.rejection_reason ?? undefined,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function createProduct(product: {
  name: string
  variety?: string
  category: ProductCategory
  description?: string
  price: number
  unit: string
  stock: number
  minOrder?: number
  images?: string[]
}): Promise<{ id: string | null; error: string | null }> {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user) {
    return { id: null, error: 'Tidak terautentikasi' }
  }

  // Get user profile to determine seller_role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (!profile || (profile.role !== 'petani' && profile.role !== 'umkm')) {
    return { id: null, error: 'Hanya petani atau UMKM yang bisa menjual' }
  }

  // Generate slug
  const slug = product.name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

  const { data, error } = await supabase
    .from('products')
    .insert({
      slug: `${slug}-${Date.now()}`,
      seller_id: session.user.id,
      seller_role: profile.role,
      name: product.name,
      variety: product.variety ?? null,
      category: product.category,
      description: product.description ?? null,
      price: product.price,
      unit: product.unit,
      stock: product.stock,
      min_order: product.minOrder ?? 1,
      images: product.images ?? [],
    })
    .select('id')
    .single()

  if (error) {
    return { id: null, error: error.message }
  }

  return { id: data.id, error: null }
}

export async function updateProduct(
  id: string,
  updates: {
    name?: string
    variety?: string
    category?: ProductCategory
    description?: string
    price?: number
    unit?: string
    stock?: number
    minOrder?: number
    images?: string[]
    status?: string
  }
): Promise<{ error: string | null }> {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user) {
    return { error: 'Tidak terautentikasi' }
  }

  const { error } = await supabase
    .from('products')
    .update({
      ...(updates.name !== undefined && { name: updates.name }),
      ...(updates.variety !== undefined && { variety: updates.variety }),
      ...(updates.category !== undefined && { category: updates.category }),
      ...(updates.description !== undefined && { description: updates.description }),
      ...(updates.price !== undefined && { price: updates.price }),
      ...(updates.unit !== undefined && { unit: updates.unit }),
      ...(updates.stock !== undefined && { stock: updates.stock }),
      ...(updates.minOrder !== undefined && { min_order: updates.minOrder }),
      ...(updates.images !== undefined && { images: updates.images }),
      ...(updates.status !== undefined && { status: updates.status }),
    })
    .eq('id', id)
    .eq('seller_id', session.user.id)

  return { error: error?.message ?? null }
}

export async function deleteProduct(id: string): Promise<{ error: string | null }> {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user) {
    return { error: 'Tidak terautentikasi' }
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .eq('seller_id', session.user.id)

  return { error: error?.message ?? null }
}
