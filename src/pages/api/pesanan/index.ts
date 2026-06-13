export const prerender = false

import type { APIRoute } from 'astro'
import { createSupabaseServerClient } from '../../../lib/supabase.server'

export const GET: APIRoute = async ({ cookies }) => {
  const supabase = createSupabaseServerClient(cookies)
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('buyer_id', session.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ orders: data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const supabase = createSupabaseServerClient(cookies)
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const body = await request.json()
  const orderNumber = `SM-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

  const { data, error } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      buyer_id: session.user.id,
      items: body.items,
      status: 'pending_payment',
      payment_method: body.paymentMethod,
      shipping_address: body.shippingAddress,
      subtotal: body.subtotal,
      shipping_fee: body.shippingFee,
      platform_fee: body.platformFee,
      total: body.total,
      courier: body.courier,
      notes: body.notes,
    })
    .select()
    .single()

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ order: data }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  })
}
