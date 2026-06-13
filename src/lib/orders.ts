import { supabase } from './supabase'
import type { OrderStatus, PaymentMethod } from '../types/pesanan'
import type { ProductUnit } from '../types/produk'

export interface OrderItemData {
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

export interface OrderData {
  id: string
  orderNumber: string
  buyerId: string
  status: OrderStatus
  paymentMethod: PaymentMethod | null
  shippingAddress: {
    recipientName: string
    phone: string
    street: string
    kelurahan: string
    kecamatan: string
    kabupaten: string
    provinsi: string
    postalCode: string
  }
  items: OrderItemData[]
  subtotal: number
  shippingFee: number
  platformFee: number
  total: number
  trackingNumber: string | null
  courier: string | null
  notes: string | null
  paidAt: string | null
  shippedAt: string | null
  deliveredAt: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

function generateOrderNumber(): string {
  return `MK-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
}

export async function createOrder(data: {
  items: OrderItemData[]
  shippingAddress: OrderData['shippingAddress']
  shippingFee?: number
  notes?: string
}): Promise<{ order: OrderData | null; error: string | null }> {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user) {
    return { order: null, error: 'Tidak terautentikasi' }
  }

  const subtotal = data.items.reduce((acc, item) => acc + item.subtotal, 0)
  const platformFee = Math.round(subtotal * 0.03)
  const shippingFee = data.shippingFee ?? 0
  const total = subtotal + platformFee + shippingFee

  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      order_number: generateOrderNumber(),
      buyer_id: session.user.id,
      status: 'pending_payment',
      shipping_address: data.shippingAddress,
      items: data.items,
      subtotal,
      shipping_fee: shippingFee,
      platform_fee: platformFee,
      total,
      notes: data.notes ?? null,
    })
    .select()
    .single()

  if (error) {
    return { order: null, error: error.message }
  }

  return {
    order: {
      id: order.id,
      orderNumber: order.order_number,
      buyerId: order.buyer_id,
      status: order.status as OrderStatus,
      paymentMethod: order.payment_method as PaymentMethod | null,
      shippingAddress: order.shipping_address as OrderData['shippingAddress'],
      items: order.items as OrderItemData[],
      subtotal: order.subtotal,
      shippingFee: order.shipping_fee,
      platformFee: order.platform_fee,
      total: order.total,
      trackingNumber: order.tracking_number,
      courier: order.courier,
      notes: order.notes,
      paidAt: order.paid_at,
      shippedAt: order.shipped_at,
      deliveredAt: order.delivered_at,
      completedAt: order.completed_at,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    },
    error: null,
  }
}

export async function getOrders(): Promise<OrderData[]> {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user) {
    return []
  }

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('buyer_id', session.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return []
  }

  return data.map((o) => ({
    id: o.id,
    orderNumber: o.order_number,
    buyerId: o.buyer_id,
    status: o.status as OrderStatus,
    paymentMethod: o.payment_method as PaymentMethod | null,
    shippingAddress: o.shipping_address as OrderData['shippingAddress'],
    items: o.items as OrderItemData[],
    subtotal: o.subtotal,
    shippingFee: o.shipping_fee,
    platformFee: o.platform_fee,
    total: o.total,
    trackingNumber: o.tracking_number,
    courier: o.courier,
    notes: o.notes,
    paidAt: o.paid_at,
    shippedAt: o.shipped_at,
    deliveredAt: o.delivered_at,
    completedAt: o.completed_at,
    createdAt: o.created_at,
    updatedAt: o.updated_at,
  }))
}

export async function getOrderById(id: string): Promise<OrderData | null> {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user) {
    return null
  }

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .eq('buyer_id', session.user.id)
    .single()

  if (error || !data) {
    return null
  }

  return {
    id: data.id,
    orderNumber: data.order_number,
    buyerId: data.buyer_id,
    status: data.status as OrderStatus,
    paymentMethod: data.payment_method as PaymentMethod | null,
    shippingAddress: data.shipping_address as OrderData['shippingAddress'],
    items: data.items as OrderItemData[],
    subtotal: data.subtotal,
    shippingFee: data.shipping_fee,
    platformFee: data.platform_fee,
    total: data.total,
    trackingNumber: data.tracking_number,
    courier: data.courier,
    notes: data.notes,
    paidAt: data.paid_at,
    shippedAt: data.shipped_at,
    deliveredAt: data.delivered_at,
    completedAt: data.completed_at,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<{ error: string | null }> {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user) {
    return { error: 'Tidak terautentikasi' }
  }

  const updateData: Record<string, unknown> = { status }

  // Set timestamp based on status
  if (status === 'paid') updateData.paid_at = new Date().toISOString()
  if (status === 'shipped') updateData.shipped_at = new Date().toISOString()
  if (status === 'delivered') updateData.delivered_at = new Date().toISOString()
  if (status === 'completed') updateData.completed_at = new Date().toISOString()

  const { error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', id)

  return { error: error?.message ?? null }
}

export async function updatePaymentMethod(
  id: string,
  method: PaymentMethod
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('orders')
    .update({ payment_method: method })
    .eq('id', id)

  return { error: error?.message ?? null }
}
