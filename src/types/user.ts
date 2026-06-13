export type UserRole = 'konsumen' | 'petani' | 'umkm' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  phone: string
  role: UserRole
  avatarUrl?: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface PetaniProfile {
  userId: string
  storeName: string
  storeSlug: string
  location: string
  bio?: string
  rating: number
  totalSales: number
  isVerifiedSeller: boolean
  verificationStatus: 'pending' | 'approved' | 'rejected'
}

export interface UMKMProfile {
  userId: string
  businessName: string
  businessSlug: string
  productTypes: string[]
  certifications?: string[]
  location: string
  rating: number
  verificationStatus: 'pending' | 'approved' | 'rejected'
}

export interface Address {
  id: string
  userId: string
  recipientName: string
  phone: string
  street: string
  kelurahan: string
  kecamatan: string
  kabupaten: string
  provinsi: string
  postalCode: string
  isDefault: boolean
}
