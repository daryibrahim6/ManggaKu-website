import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '../types'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  sellerName?: string
  unit?: string
}

interface CartState {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist<CartState>(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((item) => item.productId === product.id)
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            }
          }
          return {
            items: [...state.items, {
              id: `cart-${Date.now()}`,
              productId: product.id,
              name: product.name,
              price: product.price,
              image: product.images[0] || '',
              quantity,
              sellerName: product.sellerName,
              unit: product.unit,
            }]
          }
        })
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('cart:updated'))
        }
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId)
        }))
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('cart:updated'))
        }
      },
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: quantity <= 0
            ? state.items.filter((item) => item.productId !== productId)
            : state.items.map((item) =>
                item.productId === productId ? { ...item, quantity } : item
              )
        }))
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('cart:updated'))
        }
      },
      clearCart: () => {
        set({ items: [] })
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('cart:updated'))
        }
      },
      totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      totalPrice: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    }),
    { name: 'manggaku-cart' }
  )
)
