export const prerender = false

import type { APIRoute } from 'astro'
import { createSupabaseServerClient } from '../../../lib/supabase.server'

export const GET: APIRoute = async ({ url, cookies }) => {
  const supabase = createSupabaseServerClient(cookies)
  const category = url.searchParams.get('category')
  const search = url.searchParams.get('search')

  let query = supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ products: data }), {
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
  const { data, error } = await supabase
    .from('products')
    .insert({
      seller_id: session.user.id,
      name: body.name,
      variety: body.variety,
      category: body.category,
      description: body.description,
      price: body.price,
      unit: body.unit,
      stock: body.stock,
      min_order: body.minOrder,
      images: body.images ?? [],
      status: 'pending_review',
    })
    .select()
    .single()

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ product: data }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  })
}
