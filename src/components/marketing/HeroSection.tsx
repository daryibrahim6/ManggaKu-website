'use client'

import { motion } from 'motion/react'

export function HeroSection() {
  return (
    <section className="relative h-[calc(100dvh-4rem)] min-h-[calc(100dvh-4rem)] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50" />

      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-200/20 rounded-full blur-3xl" />

      {/* Mobile: stacked layout */}
      <div className="relative md:hidden w-full h-full flex flex-col justify-center px-4 py-6 gap-5 overflow-hidden">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full text-xs font-semibold mb-3 shadow-lg shadow-primary-500/25"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Marketplace Mangga #1 di Indramayu
          </motion.span>

          <h1 className="font-display text-[1.75rem] font-bold text-neutral-900 leading-[1.15]">
            Mangga Segar{' '}
            <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700 bg-clip-text text-transparent">
              Langsung dari Kebun
            </span>
          </h1>

          <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
            Beli mangga Indramayu berkualitas langsung dari petani.
          </p>

          <div className="mt-4 flex gap-3">
            <motion.a
              href="/marketplace"
              whileTap={{ scale: 0.98 }}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-lg shadow-primary-500/25 min-h-[44px]"
            >
              Beli Mangga
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.a>
            <motion.a
              href="/cara-kerja"
              whileTap={{ scale: 0.98 }}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-primary-700 bg-white border-2 border-primary-200 rounded-xl min-h-[44px]"
            >
              Cara Kerja
            </motion.a>
          </div>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative flex-1 min-h-0"
        >
          <div className="relative rounded-2xl overflow-hidden h-full shadow-xl shadow-primary-900/10">
            <img
              src="https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&h=600&fit=crop"
              alt="Mangga segar Indramayu"
              className="w-full h-full object-cover"
              width={800}
              height={600}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {/* Stats on image */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1 shadow-lg">
                <span className="font-display text-xs font-bold text-primary-600">150+</span>
                <span className="text-[9px] text-neutral-500">Petani</span>
              </div>
              <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1 shadow-lg">
                <span className="font-display text-xs font-bold text-secondary-500">500+</span>
                <span className="text-[9px] text-neutral-500">Produk</span>
              </div>
              <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1 shadow-lg">
                <span className="font-display text-xs font-bold text-primary-600">25+</span>
                <span className="text-[9px] text-neutral-500">Kota</span>
              </div>
            </div>

            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-2 flex items-center gap-2 border border-neutral-100"
            >
              <div className="w-7 h-7 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-neutral-900 text-[11px] leading-tight">100% Segar</p>
                <p className="text-[9px] text-neutral-400 leading-tight">Dipanen saat matang</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Desktop: side by side layout */}
      <div className="relative max-w-7xl mx-auto w-full px-4 md:px-8 hidden md:grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Kiri: Teks */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full text-sm font-semibold mb-6 shadow-lg shadow-primary-500/25"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Marketplace Mangga #1 di Indramayu
          </motion.span>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-neutral-900 leading-[1.1]">
            Mangga Segar{' '}
            <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700 bg-clip-text text-transparent">
              Langsung dari Kebun
            </span>
          </h1>

          <p className="mt-4 text-lg md:text-xl text-neutral-500 max-w-lg leading-relaxed">
            Beli mangga Indramayu berkualitas langsung dari petani. Harga transparan, kualitas terjamin, pengiriman cepat ke seluruh Indonesia.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <motion.a
              href="/marketplace"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 min-h-[44px]"
            >
              Beli Mangga Sekarang
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.a>
            <motion.a
              href="/cara-kerja"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-primary-700 bg-white border-2 border-primary-200 rounded-2xl hover:bg-primary-50 hover:border-primary-300 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 min-h-[44px]"
            >
              Lihat Cara Kerja
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.a>
          </div>

          <div className="mt-8 flex items-center gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className="font-display text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">150+</p>
              <p className="text-sm text-neutral-500 mt-1">Petani Aktif</p>
            </motion.div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-neutral-300 to-transparent"></div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="font-display text-3xl font-bold bg-gradient-to-r from-secondary-500 to-secondary-600 bg-clip-text text-transparent">500+</p>
              <p className="text-sm text-neutral-500 mt-1">Produk Terjual</p>
            </motion.div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-neutral-300 to-transparent"></div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <p className="font-display text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">25+</p>
              <p className="text-sm text-neutral-500 mt-1">Kota Terjangkau</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Kanan: Gambar */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-primary-900/10">
            <img
              src="https://images.unsplash.com/photo-1553279768-865429fa0078?w=900&h=700&fit=crop"
              alt="Mangga segar Indramayu dipetik langsung dari kebun"
              className="w-full h-[350px] lg:h-[550px] object-cover"
              width={900}
              height={700}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>

          {/* Floating card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-neutral-100"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-neutral-900 text-sm">100% Segar</p>
              <p className="text-xs text-neutral-500">Dipanen saat matang</p>
            </div>
          </motion.div>

          {/* Floating card 2 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-neutral-100"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg shadow-secondary-500/30">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-neutral-900 text-sm">Kirim Cepat</p>
              <p className="text-xs text-neutral-500">1-2 hari sampai</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
