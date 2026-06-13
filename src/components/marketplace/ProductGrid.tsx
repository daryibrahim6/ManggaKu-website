'use client'

import { ProductCard } from './ProductCard'
import type { Product } from '../../types'

interface ProductGridProps {
  products: Product[]
  isLoading?: boolean
}

const mockProducts: Product[] = [
  {
    id: '1', slug: 'mangga-gedong-gincu-segar', sellerId: 's1', sellerRole: 'petani',
    sellerName: 'Pak Karso', sellerVerified: true, name: 'Mangga Gedong Gincu Segar',
    variety: 'gedong_gincu', category: 'fresh', description: 'Mangga gedong gincu pilihan dari kebun Indramayu.',
    price: 35000, unit: 'kg', stock: 100, minOrder: 1,
    images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=400&fit=crop'],
    rating: 4.8, reviewCount: 24, status: 'active', createdAt: '', updatedAt: '',
  },
  {
    id: '2', slug: 'mangga-harum-manis-premium', sellerId: 's2', sellerRole: 'petani',
    sellerName: 'Bu Siti', sellerVerified: true, name: 'Mangga Harum Manis Premium',
    variety: 'harum_manis', category: 'fresh', description: 'Mangga harum manis manis dan wangi.',
    price: 42000, unit: 'kg', stock: 50, minOrder: 1,
    images: ['https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=400&fit=crop'],
    rating: 4.9, reviewCount: 18, status: 'active', createdAt: '', updatedAt: '',
  },
  {
    id: '3', slug: 'jus-mangga-murni', sellerId: 's3', sellerRole: 'umkm',
    sellerName: 'Jus Mangga Bu Rina', sellerVerified: false, name: 'Jus Mangga Murni',
    category: 'olahan', description: 'Jus mangga murni tanpa pengawet.',
    price: 25000, unit: 'botol', stock: 200, minOrder: 1,
    images: ['https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=400&fit=crop'],
    rating: 4.6, reviewCount: 42, status: 'active', createdAt: '', updatedAt: '',
  },
  {
    id: '4', slug: 'mangga-cengkir-bulk', sellerId: 's4', sellerRole: 'petani',
    sellerName: 'Pak Warto', sellerVerified: true, name: 'Mangga Cengkir Bulk 10kg',
    variety: 'cengkir', category: 'bulk', description: 'Paket bulk 10kg untuk reseller.',
    price: 280000, unit: 'box', stock: 20, minOrder: 1,
    images: ['https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?w=400&h=400&fit=crop'],
    rating: 4.7, reviewCount: 8, status: 'active', createdAt: '', updatedAt: '',
  },
  {
    id: '5', slug: 'keripik-mangga-malika', sellerId: 's5', sellerRole: 'umkm',
    sellerName: 'Keripik Malika', sellerVerified: false, name: 'Keripik Mangga Malika',
    category: 'olahan', description: 'Keripik mangga renyah dan gurih.',
    price: 18000, unit: 'pcs', stock: 150, minOrder: 1,
    images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop'],
    rating: 4.5, reviewCount: 31, status: 'active', createdAt: '', updatedAt: '',
  },
  {
    id: '6', slug: 'mangga-manalagi-segar', sellerId: 's6', sellerRole: 'petani',
    sellerName: 'Pak Budi', sellerVerified: true, name: 'Mangga Manalagi Segar',
    variety: 'manalagi', category: 'fresh', description: 'Mangga manalagi segar dari kebun.',
    price: 30000, unit: 'kg', stock: 80, minOrder: 1,
    images: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop'],
    rating: 4.7, reviewCount: 15, status: 'active', createdAt: '', updatedAt: '',
  },
]

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  const displayProducts = products.length > 0 ? products : mockProducts

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCard key={i} isLoading />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {displayProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
