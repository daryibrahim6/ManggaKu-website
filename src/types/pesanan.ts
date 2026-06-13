import type { ProductUnit } from './produk'
import type { Address } from './user'

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'disputed'

export type PaymentMethod = 'gopay' | 'ovo' | 'qris' | 'bank_transfer' | 'cod'

export interface OrderItem {
  productId: string
  productName: string
  productImage: string
  sellerId: string
  sellerName: string
  quantity: number
  unit: ProductUnit
  pricePerUnit: number
  subtotal: number
}

export interface Order {
  id: string
  orderNumber: string
  buyerId: string
  items: OrderItem[]
  status: OrderStatus
  paymentMethod: PaymentMethod
  shippingAddress: Address
  subtotal: number
  shippingFee: number
  platformFee: number
  total: number
  trackingNumber?: string
  courier?: string
  notes?: string
  paidAt?: string
  shippedAt?: string
  deliveredAt?: string
  completedAt?: string
  createdAt: string
  updatedAt: string
}
