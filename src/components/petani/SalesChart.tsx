'use client'

import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatRupiah, cn } from '../../lib/utils'

const data7hari = [
  { tanggal: 'Sen', pendapatan: 450000 },
  { tanggal: 'Sel', pendapatan: 320000 },
  { tanggal: 'Rab', pendapatan: 580000 },
  { tanggal: 'Kam', pendapatan: 420000 },
  { tanggal: 'Jum', pendapatan: 650000 },
  { tanggal: 'Sab', pendapatan: 890000 },
  { tanggal: 'Min', pendapatan: 720000 },
]

const data30hari = [
  { tanggal: '1 Jun', pendapatan: 450000 },
  { tanggal: '5 Jun', pendapatan: 320000 },
  { tanggal: '10 Jun', pendapatan: 580000 },
  { tanggal: '15 Jun', pendapatan: 420000 },
  { tanggal: '20 Jun', pendapatan: 650000 },
  { tanggal: '25 Jun', pendapatan: 890000 },
  { tanggal: '30 Jun', pendapatan: 720000 },
]

const data3bulan = [
  { tanggal: 'Apr', pendapatan: 4500000 },
  { tanggal: 'Mei', pendapatan: 5200000 },
  { tanggal: 'Jun', pendapatan: 5800000 },
]

const filters = [
  { value: '7', label: '7 Hari' },
  { value: '30', label: '30 Hari' },
  { value: '90', label: '3 Bulan' },
]

export function SalesChart() {
  const [period, setPeriod] = useState('7')

  const chartData = period === '7' ? data7hari : period === '30' ? data30hari : data3bulan

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-leaf-100/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-leaf-900">Grafik Penjualan</h3>
        <div className="flex gap-1">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setPeriod(f.value)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                period === f.value
                  ? 'bg-leaf-600 text-white'
                  : 'bg-leaf-50 text-leaf-700 hover:bg-leaf-100'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#46a35e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#46a35e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="tanggal" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(v) => formatRupiah(v)} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v: number) => [formatRupiah(v), 'Pendapatan']} />
          <Area type="monotone" dataKey="pendapatan" stroke="#46a35e" fill="url(#salesGrad)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
