export const prerender = false

import type { APIRoute } from 'astro'
import { createSupabaseServerClient } from '../../../lib/supabase.server'

export const POST: APIRoute = async ({ request, cookies }) => {
  const supabase = createSupabaseServerClient(cookies)
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return new Response(JSON.stringify({ user: null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.user_metadata?.name ?? '',
      phone: session.user.user_metadata?.phone ?? '',
      role: session.user.user_metadata?.role ?? 'konsumen',
      isVerified: session.user.email_confirmed_at !== null,
    },
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
