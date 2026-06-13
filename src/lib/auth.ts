import { supabase } from './supabase'
import type { UserRole } from '../types'

export interface AuthUser {
  id: string
  email: string
  name: string
  phone: string
  role: UserRole
  avatarUrl: string | null
  isVerified: boolean
  createdAt: string
}

export async function signUp(data: {
  email: string
  password: string
  name: string
  phone: string
  role: UserRole
}): Promise<{ user: AuthUser | null; error: string | null }> {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
        phone: data.phone,
        role: data.role,
      },
    },
  })

  if (authError) {
    return { user: null, error: authError.message }
  }

  if (!authData.user) {
    return { user: null, error: 'Gagal membuat akun' }
  }

  // Profile is auto-created by trigger, fetch it
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .single()

  if (profileError) {
    return { user: null, error: 'Gagal mengambil data profil' }
  }

  return {
    user: {
      id: profile.id,
      email: authData.user.email ?? '',
      name: profile.name,
      phone: profile.phone ?? '',
      role: profile.role,
      avatarUrl: profile.avatar_url,
      isVerified: profile.is_verified,
      createdAt: profile.created_at,
    },
    error: null,
  }
}

export async function signIn(email: string, password: string): Promise<{ user: AuthUser | null; error: string | null }> {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (authError) {
    return { user: null, error: authError.message }
  }

  if (!authData.user) {
    return { user: null, error: 'Gagal masuk' }
  }

  // Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .single()

  if (profileError) {
    return { user: null, error: 'Gagal mengambil data profil' }
  }

  return {
    user: {
      id: profile.id,
      email: authData.user.email ?? '',
      name: profile.name,
      phone: profile.phone ?? '',
      role: profile.role,
      avatarUrl: profile.avatar_url,
      isVerified: profile.is_verified,
      createdAt: profile.created_at,
    },
    error: null,
  }
}

export async function signOut(): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.signOut()
  return { error: error?.message ?? null }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user) {
    return null
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (!profile) {
    return null
  }

  return {
    id: profile.id,
    email: session.user.email ?? '',
    name: profile.name,
    phone: profile.phone ?? '',
    role: profile.role,
    avatarUrl: profile.avatar_url,
    isVerified: profile.is_verified,
    createdAt: profile.created_at,
  }
}

export async function updateProfile(updates: {
  name?: string
  phone?: string
  avatarUrl?: string
}): Promise<{ error: string | null }> {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user) {
    return { error: 'Tidak terautentikasi' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      ...(updates.name !== undefined && { name: updates.name }),
      ...(updates.phone !== undefined && { phone: updates.phone }),
      ...(updates.avatarUrl !== undefined && { avatar_url: updates.avatarUrl }),
    })
    .eq('id', session.user.id)

  return { error: error?.message ?? null }
}
