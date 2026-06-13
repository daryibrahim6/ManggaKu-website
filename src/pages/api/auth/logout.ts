export const prerender = false

import type { APIRoute } from 'astro'
import { createSupabaseServerClient } from '../../../lib/supabase.server'

export const POST: APIRoute = async ({ cookies }) => {
  const supabase = createSupabaseServerClient(cookies)
  await supabase.auth.signOut()

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
