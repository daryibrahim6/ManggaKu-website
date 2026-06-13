import { createServerClient } from '@supabase/ssr'
import type { AstroCookies } from 'astro'

export function createSupabaseServerClient(cookies: AstroCookies) {
  return createServerClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () =>
          Object.fromEntries(
            ['sb-access-token', 'sb-refresh-token'].map(name => [
              name,
              cookies.get(name)?.value ?? '',
            ])
          ),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookies.set(name, value, options)
          )
        },
      },
    }
  )
}

export async function getSession(Astro: { cookies: AstroCookies }) {
  const supabase = createSupabaseServerClient(Astro.cookies)
  const { data: { session } } = await supabase.auth.getSession()
  return session
}
