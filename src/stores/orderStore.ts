import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type OrderStatus = 'pending_payment' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'disputed'

export interface OrderItem {
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  petaniName?: string
}

export interface Order {
  id: string
  items: OrderItem[]
  subtotal: number
  platformFee: number
  total: number
  status: OrderStatus
  shippingAddress: {
    name: string
    phone: string
    address: string
    city: string
    province: string
    postalCode: string
  }
  paymentMethod?: string
  createdAt: string
  updatedAt: string
}

interface OrderState {
  orders: Order[]
  createOrder: (items: OrderItem[], shippingAddress: Order['shippingAddress']) => Order
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  setPaymentMethod: (orderId: string, method: string) => void
  getOrderById: (orderId: string) => Order | undefined
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      createOrder: (items, shippingAddress) => {
        const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
        const platformFee = Math.round(subtotal * 0.03)
        const total = subtotal + platformFee
        const order: Order = {
          id: `ORD-${Date.now()}`,
          items,
          subtotal,
          platformFee,
          total,
          status: 'pending_payment',
          shippingAddress,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({ orders: [...state.orders, order] }))
        return order
      },
      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? { ...order, status, updatedAt: new Date().toISOString() }
              : order
          ),
        })),
      setPaymentMethod: (orderId, method) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? { ...order, paymentMethod: method, updatedAt: new Date().toISOString() }
              : order
          ),
        })),
      getOrderById: (orderId) => get().orders.find((o) => o.id === orderId),
    }),
    { name: 'manggaku-orders' }
  )
)
