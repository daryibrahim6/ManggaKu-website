'use client'

import { motion } from 'motion/react'
import { ShoppingCart, MapPin, BarChart3, Store, DollarSign, Truck } from 'lucide-react'

const features = [
  {
    title: 'Marketplace Fresh',
    description: 'Beli mangga segar langsung dari petani Indramayu tanpa perantara.',
    icon: ShoppingCart,
    gradient: 'from-primary-500 to-primary-600',
    shadow: 'shadow-primary-500/20',
  },
  {
    title: 'Live Tracking',
    description: 'Lacak pesananmu secara real-time dari kebun hingga ke pintu rumah.',
    icon: MapPin,
    gradient: 'from-secondary-500 to-secondary-600',
    shadow: 'shadow-secondary-500/20',
  },
  {
    title: 'Dashboard Petani',
    description: 'Kelola produk, stok, dan pesanan dalam satu dashboard intuitif.',
    icon: BarChart3,
    gradient: 'from-primary-500 to-primary-700',
    shadow: 'shadow-primary-500/20',
  },
  {
    title: 'UMKM Hub',
    description: 'Temukan bahan baku mangga berkualitas untuk produk olahanmu.',
    icon: Store,
    gradient: 'from-secondary-500 to-secondary-700',
    shadow: 'shadow-secondary-500/20',
  },
  {
    title: 'Harga Transparan',
    description: 'Harga jujur tanpa markup tersembunyi. Petani dapat untung lebih.',
    icon: DollarSign,
    gradient: 'from-primary-600 to-primary-700',
    shadow: 'shadow-primary-500/20',
  },
  {
    title: 'Pengiriman Cepat',
    description: 'Packing khusus menjaga kesegaran mangga selama perjalanan.',
    icon: Truck,
    gradient: 'from-secondary-600 to-secondary-700',
    shadow: 'shadow-secondary-500/20',
  },
]

export function FeaturesGrid() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-4">
            Fitur
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-neutral-900">
            Fitur Unggulan
          </h2>
          <p className="mt-3 text-neutral-500 max-w-md mx-auto">
            Solusi lengkap untuk ekosistem mangga Indramayu
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group p-6 bg-white rounded-2xl border border-neutral-100 hover:border-primary-100 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg ${feature.shadow} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">{feature.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
