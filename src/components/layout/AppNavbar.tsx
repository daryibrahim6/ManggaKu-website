'use client'

import { useState } from 'react'
import { ShoppingCart, Menu, X, LogOut } from 'lucide-react'
import { useCartStore } from '../../stores/cartStore'
import { useAuthStore } from '../../stores/authStore'

export function AppNavbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const totalItems = useCartStore((s) => s.totalItems())
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-100/50 shadow-sm shadow-neutral-900/5">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <a href="/marketplace" className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-xl px-2 py-1">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/40 transition-shadow">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <span className="font-display font-bold text-xl text-neutral-900 group-hover:text-primary-600 transition-colors">
            Mangga<span className="text-primary-600">Ku</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          <a href="/marketplace" className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-primary-600 transition-all rounded-xl hover:bg-primary-50/50">
            Marketplace
          </a>
          <a href="/keranjang" className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-primary-600 transition-all rounded-xl hover:bg-primary-50/50">
            Keranjang
          </a>
        </div>

        <div className="flex items-center gap-2">
          <a href="/keranjang" className="relative p-2.5 text-neutral-600 hover:text-primary-600 hover:bg-primary-50/50 transition-all rounded-xl" aria-label="Keranjang">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-secondary-500/30">
                {totalItems}
              </span>
            )}
          </a>

          <div className="hidden md:flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-lg shadow-primary-500/25">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span className="text-sm font-medium text-neutral-700">
              {user?.name ?? 'User'}
            </span>
            <button onClick={() => logout()} className="text-sm text-neutral-500 hover:text-red-600 transition-colors px-2 py-1 rounded-lg hover:bg-red-50">
              Keluar
            </button>
          </div>

          <button
            className="md:hidden p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50/50 rounded-xl transition-all"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label={isMobileOpen ? 'Tutup menu' : 'Buka menu'}
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isMobileOpen && (
        <div className="md:hidden border-t border-neutral-100 bg-white/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-1">
            <a href="/marketplace" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">
              <ShoppingCart className="w-5 h-5 text-neutral-400" />
              Marketplace
            </a>
            <a href="/keranjang" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">
              <ShoppingCart className="w-5 h-5 text-neutral-400" />
              Keranjang
            </a>
            <div className="border-t border-neutral-100 my-2"></div>
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg shadow-primary-500/25">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-900">{user?.name || 'User'}</p>
                <p className="text-xs text-neutral-500">Akun saya</p>
              </div>
            </div>
            <button onClick={() => { logout(); setIsMobileOpen(false) }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all">
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
