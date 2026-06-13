'use client'

import { motion } from 'motion/react'
import { Star, CheckCircle } from 'lucide-react'
import { cn, formatRupiah } from '../../lib/utils'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { useCartStore } from '../../stores/cartStore'
import { toast } from 'sonner'
import type { Product } from '../../types'
import Skeleton from 'react-loading-skeleton'

interface ProductCardProps {
  product?: Product
  isLoading?: boolean
  className?: string
}

export function ProductCard({ product, isLoading = false, className }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)

  if (isLoading || !product) {
    return (
      <div className={cn('rounded-2xl overflow-hidden bg-white shadow-sm', className)}>
        <Skeleton height={200} />
        <div className="p-4">
          <Skeleton height={20} className="mb-2" />
          <Skeleton height={16} width="60%" className="mb-3" />
          <Skeleton height={24} width="40%" />
        </div>
      </div>
    )
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    toast.success(`${product.name} ditambahkan ke keranjang`)
  }

  const categoryBadge = {
    fresh: { label: 'Segar', className: 'bg-primary-100 text-primary-700' },
    olahan: { label: 'Olahan', className: 'bg-secondary-100 text-secondary-700' },
    bulk: { label: 'Bulk', className: 'bg-neutral-100 text-neutral-600' },
  }[product.category]

  return (
    <motion.a
      href={`/marketplace/${product.slug}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.15 }}
      className={cn(
        'block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow border border-neutral-100',
        className
      )}
    >
      <div className="relative aspect-square bg-neutral-50">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={`Foto ${product.name}`}
            className="w-full h-full object-cover"
            loading="lazy"
            width={400}
            height={400}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <Badge className={cn('absolute top-3 left-3', categoryBadge.className)}>
          {categoryBadge.label}
        </Badge>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-neutral-900 truncate">{product.name}</h3>

        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-sm text-neutral-500 truncate">{product.sellerName}</span>
          {product.sellerVerified && (
            <CheckCircle className="w-3.5 h-3.5 text-primary-500 shrink-0" />
          )}
        </div>

        <div className="flex items-center gap-1 mt-2" role="img" aria-label={`Rating ${product.rating} dari 5 bintang`}>
          <Star className="w-4 h-4 text-secondary-400 fill-secondary-400" />
          <span className="text-sm font-medium text-neutral-900">{product.rating}</span>
          <span className="text-xs text-neutral-400">({product.reviewCount})</span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="font-mono font-medium text-secondary-600 text-lg">
            {formatRupiah(product.price)}
            <span className="text-xs font-sans text-neutral-400">/{product.unit}</span>
          </span>
          <Button
            size="sm"
            className="bg-primary-600 hover:bg-primary-700 rounded-xl min-h-[44px] min-w-[44px]"
            onClick={handleAddToCart}
            aria-label={`Tambah ${product.name} ke keranjang`}
          >
            Tambah +
          </Button>
        </div>
      </div>
    </motion.a>
  )
}
