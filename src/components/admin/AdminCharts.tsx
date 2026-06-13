'use client'

import { useState } from 'react'
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatRupiah } from '../../lib/utils'

const revenueData = [
  { tanggal: '1 Jun', revenue: 4500000 },
  { tanggal: '5 Jun', revenue: 3200000 },
  { tanggal: '10 Jun', revenue: 5800000 },
  { tanggal: '15 Jun', revenue: 4200000 },
  { tanggal: '20 Jun', revenue: 6500000 },
  { tanggal: '25 Jun', revenue: 8900000 },
  { tanggal: '30 Jun', revenue: 7200000 },
]

const roleData = [
  { name: 'Konsumen', value: 850, color: '#46a35e' },
  { name: 'Petani', value: 320, color: '#d97706' },
  { name: 'UMKM', value: 65, color: '#f59e0b' },
  { name: 'Admin', value: 15, color: '#1f2937' },
]

export function AdminCharts() {
  const [activeChart, setActiveChart] = useState<'revenue' | 'roles'>('revenue')

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-leaf-100/50">
        <h3 className="font-semibold text-leaf-900 mb-4">Revenue 30 Hari</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#46a35e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#46a35e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="tanggal" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => formatRupiah(v)} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v: number) => [formatRupiah(v), 'Revenue']} />
            <Area type="monotone" dataKey="revenue" stroke="#46a35e" fill="url(#revGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Role Distribution */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-leaf-100/50">
        <h3 className="font-semibold text-leaf-900 mb-4">Distribusi Role User</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={roleData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {roleData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
