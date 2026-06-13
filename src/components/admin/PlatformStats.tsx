'use client'

import { motion } from 'motion/react'
import { DollarSign, Users, ShoppingCart, AlertTriangle, Package, UserCheck } from 'lucide-react'
import { formatRupiah } from '../../lib/utils'

interface PlatformStatsProps {
  gmvHari?: number
  totalUser?: number
  userBaruMinggu?: number
  transaksiSukses?: number
  produkPending?: number
  sengketaAktif?: number
}

export function PlatformStats({
  gmvHari = 12500000,
  totalUser = 1250,
  userBaruMinggu = 48,
  transaksiSukses = 320,
  produkPending = 15,
  sengketaAktif = 3,
}: PlatformStatsProps) {
  const stats = [
    { icon: DollarSign, label: 'GMV Hari Ini', value: formatRupiah(gmvHari), color: 'bg-mango-50 text-mango-600' },
    { icon: Users, label: 'Total User', value: totalUser.toLocaleString('id-ID'), color: 'bg-leaf-50 text-leaf-600' },
    { icon: UserCheck, label: 'User Baru Minggu Ini', value: userBaruMinggu.toString(), color: 'bg-blue-50 text-blue-600' },
    { icon: ShoppingCart, label: 'Transaksi Sukses', value: transaksiSukses.toString(), color: 'bg-green-50 text-green-600' },
    { icon: Package, label: 'Produk Pending Review', value: produkPending.toString(), color: 'bg-amber-50 text-amber-500', badge: produkPending > 0 },
    { icon: AlertTriangle, label: 'Sengketa Aktif', value: sengketaAktif.toString(), color: 'bg-red-50 text-red-500', badge: sengketaAktif > 0 },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.08 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-leaf-100/50"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center relative`}>
              <stat.icon className="w-5 h-5" />
              {stat.badge && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {stat.value}
                </span>
              )}
            </div>
            <div>
              <p className="text-xs text-leaf-700/50">{stat.label}</p>
              <p className="font-semibold text-leaf-900">{stat.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
