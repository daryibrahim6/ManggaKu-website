export type ProductCategory = 'fresh' | 'olahan' | 'bulk'
export type ProductStatus = 'active' | 'inactive' | 'pending_review' | 'rejected'
export type ProductUnit = 'kg' | 'buah' | 'box' | 'botol' | 'pcs'
export type MangoVariety = 'gedong_gincu' | 'harum_manis' | 'cengkir' | 'golek' | 'manalagi' | 'other'

export interface Product {
  id: string
  slug: string
  sellerId: string
  sellerRole: 'petani' | 'umkm'
  sellerName: string
  sellerVerified: boolean
  name: string
  variety?: MangoVariety
  category: ProductCategory
  description: string
  price: number
  unit: ProductUnit
  stock: number
  minOrder: number
  images: string[]
  rating: number
  reviewCount: number
  status: ProductStatus
  rejectionReason?: string
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  productId: string
  orderId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  images?: string[]
  createdAt: string
}
