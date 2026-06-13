'use client'

import { motion } from 'motion/react'

export function CTASection() {
  return (
    <section className="bg-primary-600 py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-4xl font-bold text-white"
        >
          Siap Merasakan Perbedaannya?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-4 text-white/80 text-lg"
        >
          Bergabung dengan ribuan petani dan konsumen di Indramayu
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
        >
          <a
            href="/marketplace"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-primary-600 bg-white rounded-xl hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 min-h-[44px]"
          >
            Mulai Belanja
          </a>
          <a
            href="/auth/daftar"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white border-2 border-white/30 rounded-xl hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 min-h-[44px]"
          >
            Daftar sebagai Petani
          </a>
        </motion.div>
      </div>
    </section>
  )
}
