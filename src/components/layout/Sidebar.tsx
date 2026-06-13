import { useState } from 'react'
import {
  LayoutDashboard, Package, ShoppingCart, Truck, BarChart3,
  Wallet, Store, FileCheck, Users, AlertTriangle,
  ChevronLeft, Menu, LogOut
} from 'lucide-react'
import { cn } from '../../lib/utils'

interface SidebarProps {
  role: 'petani' | 'umkm' | 'admin'
}

const petaniLinks = [
  { href: '/petani/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/petani/produk', label: 'Produk', icon: Package },
  { href: '/petani/pesanan', label: 'Pesanan', icon: ShoppingCart },
  { href: '/petani/pengiriman', label: 'Pengiriman', icon: Truck },
  { href: '/petani/stok', label: 'Stok', icon: Package },
  { href: '/petani/laporan', label: 'Laporan', icon: BarChart3 },
  { href: '/petani/dana', label: 'Dana', icon: Wallet },
  { href: '/petani/toko', label: 'Toko Saya', icon: Store },
  { href: '/petani/verifikasi', label: 'Verifikasi', icon: FileCheck },
]

const umkmLinks = [
  { href: '/umkm/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/umkm/produk', label: 'Produk Olahan', icon: Package },
  { href: '/umkm/pesanan', label: 'Pesanan', icon: ShoppingCart },
  { href: '/umkm/bahan-baku', label: 'Bahan Baku', icon: Package },
  { href: '/umkm/laporan', label: 'Laporan', icon: BarChart3 },
  { href: '/umkm/profil', label: 'Profil UMKM', icon: Store },
]

const adminLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Manajemen User', icon: Users },
  { href: '/admin/produk', label: 'Approval Produk', icon: Package },
  { href: '/admin/transaksi', label: 'Transaksi', icon: ShoppingCart },
  { href: '/admin/sengketa', label: 'Sengketa', icon: AlertTriangle },
]

export function Sidebar({ role }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const links = role === 'petani' ? petaniLinks : role === 'umkm' ? umkmLinks : adminLinks

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 bottom-0 bg-white border-r border-leaf-100 transition-all duration-300 z-40',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-leaf-100">
        {!isCollapsed && (
          <span className="text-sm font-semibold text-leaf-700 uppercase tracking-wider">
            {role === 'petani' ? 'Petani' : role === 'umkm' ? 'UMKM' : 'Admin'}
          </span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 text-leaf-500 hover:bg-leaf-50 rounded-lg transition-colors"
        >
          {isCollapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="p-2 space-y-1">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
              'text-leaf-700/70 hover:bg-leaf-50 hover:text-leaf-700'
            )}
            title={isCollapsed ? link.label : undefined}
          >
            <link.icon className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>{link.label}</span>}
          </a>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-leaf-100">
        <a
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-leaf-700/70 hover:bg-leaf-50 hover:text-leaf-700 transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span>Keluar</span>}
        </a>
      </div>
    </aside>
  )
}
