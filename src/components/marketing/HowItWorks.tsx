'use client'

import { motion } from 'motion/react'
import { ShoppingCart, Sprout, Store } from 'lucide-react'

const roles = [
  {
    icon: ShoppingCart,
    title: 'Konsumen',
    color: 'bg-primary-50 text-primary-600',
    steps: [
      'Browse & pilih produk',
      'Checkout & bayar',
      'Terima di rumah',
    ],
  },
  {
    icon: Sprout,
    title: 'Petani',
    color: 'bg-primary-50 text-primary-600',
    steps: [
      'Daftar & verifikasi',
      'Upload produk',
      'Terima pesanan',
    ],
  },
  {
    icon: Store,
    title: 'UMKM',
    color: 'bg-secondary-50 text-secondary-600',
    steps: [
      'Daftar sebagai UMKM',
      'Beli bahan baku',
      'Jual produk olahan',
    ],
  },
]

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-neutral-900">
            Cara Kerja ManggaKu
          </h2>
          <p className="mt-3 text-neutral-500">
            Platform tiga sisi yang menguntungkan semua pihak
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role, idx) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100"
            >
              <div className={`w-12 h-12 ${role.color} rounded-xl flex items-center justify-center mb-4`}>
                <role.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg text-neutral-900 mb-4">{role.title}</h3>
              <ol className="space-y-3">
                {role.steps.map((step, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm text-neutral-600">{step}</span>
                  </li>
                ))}
              </ol>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
