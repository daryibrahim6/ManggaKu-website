'use client'

import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { formatRupiah } from '../../lib/utils'
import { useCartStore } from '../../stores/cartStore'
import type { CartItem as CartItemType } from '../../stores/cartStore'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-leaf-100">
      <div className="w-12 h-12 bg-leaf-50 rounded-lg flex items-center justify-center text-sm shrink-0">
        🥭
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-leaf-900 truncate">{item.name}</h4>
        <p className="text-xs text-leaf-700/50">{item.sellerName}</p>
        <p className="font-mono font-medium text-sm text-mango-500 mt-1">
          {formatRupiah(item.price)}/{item.unit}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-leaf-200 hover:bg-leaf-50"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-leaf-200 hover:bg-leaf-50"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      <div className="text-right">
        <p className="font-mono font-medium text-sm text-leaf-900">
          {formatRupiah(item.price * item.quantity)}
        </p>
        <button
          onClick={() => removeItem(item.productId)}
          className="text-red-400 hover:text-red-600 mt-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
