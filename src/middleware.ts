import { defineMiddleware } from 'astro:middleware'
import { createServerClient } from '@supabase/ssr'
import type { UserRole } from './types'

const roleRedirects: Record<string, string> = {
  konsumen: '/marketplace',
  petani: '/petani/dashboard',
  umkm: '/umkm/dashboard',
  admin: '/admin/dashboard',
}

const protectedPatterns = ['/petani/', '/umkm/', '/admin/', '/checkout', '/keranjang']
const authPatterns = ['/auth/masuk', '/auth/daftar']
const skipPatterns = ['/_astro/', '/api/', '/favicon', '/robots.txt', '/sitemap']

export const onRequest = defineMiddleware(async ({ locals, url, cookies, redirect }, next) => {
  const pathname = url.pathname

  // Skip middleware untuk static files dan API routes
  if (skipPatterns.some(p => pathname.startsWith(p))) {
    return next()
  }

  // Skip jika env vars belum di-set (development)
  if (!import.meta.env.PUBLIC_SUPABASE_URL || !import.meta.env.PUBLIC_SUPABASE_ANON_KEY) {
    return next()
  }

  try {
    const supabase = createServerClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { data: { session } } = await supabase.auth.getSession()
    locals.session = session
    locals.user = session?.user ?? null

    const isProtected = protectedPatterns.some(p => pathname.startsWith(p))

    if (isProtected && !session) {
      return redirect('/auth/masuk')
    }

    const isAuthRoute = authPatterns.some(p => pathname.startsWith(p))

    if (isAuthRoute && session) {
      const role = (session.user?.user_metadata?.role as UserRole) || 'konsumen'
      return redirect(roleRedirects[role] || '/marketplace')
    }

    if (session) {
      const role = (session.user?.user_metadata?.role as UserRole) || 'konsumen'

      if (pathname.startsWith('/petani/') && role !== 'petani') {
        return redirect(roleRedirects[role] || '/marketplace')
      }
      if (pathname.startsWith('/umkm/') && role !== 'umkm') {
        return redirect(roleRedirects[role] || '/marketplace')
      }
      if (pathname.startsWith('/admin/') && role !== 'admin') {
        return redirect(roleRedirects[role] || '/marketplace')
      }
    }

    return next()
  } catch (e) {
    // Fail open - biarkan request lewat jika middleware crash
    console.error('Middleware error:', e)
    return next()
  }
})
