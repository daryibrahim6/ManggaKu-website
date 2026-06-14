'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Check, X, Truck, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { cn } from '../../lib/utils'

interface Order {
  id: string
  orderNumber: string
  buyerName: string
  items: { name: string; qty: number; price: number }[]
  address: string
  total: number
  status: 'new' | 'processing' | 'shipped' | 'completed'
  date: string
}

const mockOrders: Order[] = [
  {
    id: '1', orderNumber: 'UM-2026-XYZ78', buyerName: 'Toko Buah Segar Bandung',
    items: [{ name: 'Keripik Mangga Original', qty: 10, price: 250000 }],
    address: 'Jl. Buah Batu No. 45, Bandung', total: 250000, status: 'new', date: '13 Jun 2026',
  },
  {
    id: '2', orderNumber: 'UM-2026-ABC12', buyerName: 'Cafe Madu Jakarta',
    items: [{ name: 'Sambal Mangga Pedas', qty: 20, price: 360000 }],
    address: 'Jl. Senopati No. 12, Jakarta', total: 360000, status: 'new', date: '12 Jun 2026',
  },
  {
    id: '3', orderNumber: 'UM-2026-DEF34', buyerName: 'Rumah Makan Sederhana',
    items: [{ name: 'Dodol Mangga 1kg', qty: 5, price: 225000 }],
    address: 'Jl. Pahlawan No. 8, Cirebon', total: 225000, status: 'processing', date: '11 Jun 2026',
  },
  {
    id: '4', orderNumber: 'UM-2026-GHI56', buyerName: 'Minimarket Sejahtera',
    items: [{ name: 'Jus Mangga Kemasan 500ml', qty: 50, price: 600000 }],
    address: 'Jl. Raya Utama No. 100, Indramayu', total: 600000, status: 'shipped', date: '10 Jun 2026',
  },
]

const tabs = [
  { value: 'all', label: 'Semua' },
  { value: 'new', label: 'Pesanan Baru' },
  { value: 'processing', label: 'Diproses' },
  { value: 'shipped', label: 'Dikirim' },
  { value: 'completed', label: 'Selesai' },
]

export function OrderTable() {
  const [activeTab, setActiveTab] = useState('all')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const filteredOrders = activeTab === 'all'
    ? mockOrders
    : mockOrders.filter((o) => o.status === activeTab)

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              activeTab === tab.value
                ? 'bg-mango-500 text-white'
                : 'bg-white text-leaf-700 border border-leaf-200 hover:border-leaf-300'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="space-y-3">
        {filteredOrders.map((order) => (
          <motion.div
            key={order.id}
            layout
            className="bg-white rounded-2xl shadow-sm border border-leaf-100/50 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-mono text-sm font-medium text-leaf-900">{order.orderNumber}</p>
                  <p className="text-xs text-leaf-700/50">{order.date}</p>
                </div>
                <Badge className={
                  order.status === 'new' ? 'bg-red-100 text-red-700' :
                  order.status === 'processing' ? 'bg-amber-100 text-amber-700' :
                  order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                  'bg-green-100 text-green-700'
                }>
                  {order.status === 'new' ? 'Baru' :
                   order.status === 'processing' ? 'Diproses' :
                   order.status === 'shipped' ? 'Dikirim' : 'Selesai'}
                </Badge>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-leaf-100 rounded-full flex items-center justify-center text-xs">
                  {order.buyerName.charAt(0)}
                </div>
                <span className="text-sm font-medium text-leaf-900">{order.buyerName}</span>
              </div>

              <div className="space-y-1 mb-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-leaf-700/70">{item.name} x {item.qty}</span>
                    <span className="font-mono text-leaf-900">Rp {item.price.toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="font-mono font-semibold text-mango-500">
                  Rp {order.total.toLocaleString('id-ID')}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    className="text-sm text-leaf-600 hover:text-leaf-700"
                  >
                    {expandedOrder === order.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {order.status === 'new' && (
                    <>
                      <Button size="sm" className="bg-leaf-600 hover:bg-leaf-700">
                        <Check className="w-4 h-4 mr-1" /> Terima
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                        <X className="w-4 h-4 mr-1" /> Tolak
                      </Button>
                    </>
                  )}
                  {order.status === 'processing' && (
                    <a href={`/umkm/pengiriman/${order.id}`}>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Truck className="w-4 h-4 mr-1" /> Input Resi
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {expandedOrder === order.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="px-4 pb-4 border-t border-leaf-100"
              >
                <div className="pt-3 text-sm">
                  <p className="text-leaf-700/50 mb-1">Alamat Pengiriman:</p>
                  <p className="text-leaf-900">{order.address}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-leaf-700/50">Tidak ada pesanan</p>
          </div>
        )}
      </div>
    </div>
  )
}
