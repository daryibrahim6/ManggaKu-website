'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { cn } from '../../lib/utils'
import type { Product } from '../../types'

interface ProductWithSeller extends Product {
  sellerName: string
  submittedAt: string
}

const mockProducts: ProductWithSeller[] = [
  {
    id: '1', slug: 'mangga-gedong-gincu-segar', sellerId: 's1', sellerRole: 'petani',
    sellerName: 'Pak Karso', sellerVerified: true, name: 'Mangga Gedong Gincu Segar',
    variety: 'gedong_gincu', category: 'fresh', description: 'Mangga segar dari kebun.',
    price: 35000, unit: 'kg', stock: 100, minOrder: 1, images: [],
    rating: 0, reviewCount: 0, status: 'pending_review', submittedAt: '12 Jun 2026', createdAt: '', updatedAt: '',
  },
  {
    id: '2', slug: 'jus-mangga-murni', sellerId: 's2', sellerRole: 'umkm',
    sellerName: 'Bu Rina', sellerVerified: false, name: 'Jus Mangga Murni',
    category: 'olahan', description: 'Jus mangga tanpa pengawet.',
    price: 25000, unit: 'botol', stock: 200, minOrder: 1, images: [],
    rating: 0, reviewCount: 0, status: 'pending_review', submittedAt: '11 Jun 2026', createdAt: '', updatedAt: '',
  },
  {
    id: '3', slug: 'keripik-mangga-malika', sellerId: 's3', sellerRole: 'umkm',
    sellerName: 'Keripik Malika', sellerVerified: false, name: 'Keripik Mangga Malika',
    category: 'olahan', description: 'Keripik renyah.',
    price: 18000, unit: 'pcs', stock: 150, minOrder: 1, images: [],
    rating: 0, reviewCount: 0, status: 'pending_review', submittedAt: '10 Jun 2026', createdAt: '', updatedAt: '',
  },
]

const tabs = [
  { value: 'pending', label: 'Menunggu Review' },
  { value: 'approved', label: 'Disetujui' },
  { value: 'rejected', label: 'Ditolak' },
]

export function ProductApprovalTable() {
  const [activeTab, setActiveTab] = useState('pending')
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState<string | null>(null)

  const filteredProducts = mockProducts.filter((p) =>
    activeTab === 'pending' ? p.status === 'pending_review' :
    activeTab === 'approved' ? p.status === 'active' :
    p.status === 'rejected'
  )

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              activeTab === tab.value
                ? 'bg-mango-500 text-white'
                : 'bg-white text-leaf-700 border border-leaf-200 hover:border-leaf-300'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Products */}
      <div className="space-y-3">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            layout
            className="bg-white rounded-2xl shadow-sm border border-leaf-100/50 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-leaf-50 rounded-xl flex items-center justify-center text-2xl shrink-0">
                  🥭
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-leaf-900">{product.name}</h3>
                    <Badge className="bg-orange-100 text-orange-700">Pending Review</Badge>
                  </div>
                  <p className="text-sm text-leaf-700/70 mt-1">oleh {product.sellerName}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="text-leaf-700/50">Kategori: {product.category}</span>
                    <span className="font-mono text-mango-500">Rp {product.price.toLocaleString('id-ID')}/{product.unit}</span>
                    <span className="text-leaf-700/50">{product.submittedAt}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 mt-4">
                <button
                  onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                  className="text-sm text-leaf-600 hover:text-leaf-700"
                >
                  {expandedProduct === product.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  Detail
                </button>
                <Button size="sm" className="bg-leaf-600 hover:bg-leaf-700">
                  <Check className="w-4 h-4 mr-1" /> Setujui
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                  onClick={() => setShowRejectForm(showRejectForm === product.id ? null : product.id)}
                >
                  <X className="w-4 h-4 mr-1" /> Tolak
                </Button>
              </div>

              {/* Reject Form */}
              {showRejectForm === product.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200"
                >
                  <label className="text-sm font-medium text-red-700">Alasan Penolakan</label>
                  <textarea
                    rows={2}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full mt-2 px-3 py-2 rounded-lg border border-red-300 text-sm resize-none"
                    placeholder="Masukkan alasan penolakan..."
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <Button size="sm" variant="outline" onClick={() => setShowRejectForm(null)}>
                      Batal
                    </Button>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      Konfirmasi Tolak
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Expanded Detail */}
            {expandedProduct === product.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="px-4 pb-4 border-t border-leaf-100"
              >
                <div className="pt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-leaf-700/50">Deskripsi</span>
                    <p className="text-leaf-900 mt-1">{product.description}</p>
                  </div>
                  <div>
                    <span className="text-leaf-700/50">Stok</span>
                    <p className="text-leaf-900 mt-1">{product.stock} {product.unit}</p>
                  </div>
                  <div>
                    <span className="text-leaf-700/50">Varietas</span>
                    <p className="text-leaf-900 mt-1">{product.variety ?? '-'}</p>
                  </div>
                  <div>
                    <span className="text-leaf-700/50">Min Order</span>
                    <p className="text-leaf-900 mt-1">{product.minOrder} {product.unit}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-leaf-700/50">Tidak ada produk</p>
          </div>
        )}
      </div>
    </div>
  )
}
