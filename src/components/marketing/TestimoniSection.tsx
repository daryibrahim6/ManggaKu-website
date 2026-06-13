'use client'

import { motion } from 'motion/react'

const testimonials = [
  {
    quote: 'Sejak bergabung ManggaKu, penghasilan saya naik 40%. Tidak perlu lagi lewat tengkulak.',
    name: 'Pak Karso',
    role: 'Petani Mangga, Indramayu',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=PakKarso&backgroundColor=b6e3f4',
  },
  {
    quote: 'Mangganya segar sekali! Langsung dari kebun, harga juga transparan.',
    name: 'Siti Aminah',
    role: 'Konsumen, Bandung',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=SitiAminah&backgroundColor=ffdfbf',
  },
  {
    quote: 'Bahan baku jadi lebih mudah didapat. Kualitas mangga untuk jus saya terjamin.',
    name: 'Bu Rina',
    role: 'UMKM Jus Mangga, Cirebon',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=BuRina&backgroundColor=c0aede',
  },
  {
    quote: 'Dashboard-nya mudah dipakai. Stok dan pesanan bisa dipantau dari HP.',
    name: 'Pak Warto',
    role: 'Petani Mangga, Jatibarang',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=PakWarto&backgroundColor=b6e3f4',
  },
  {
    quote: 'Pengiriman cepat dan packing-nya aman. Mangga sampai dalam kondisi sempurna.',
    name: 'Andi Pratama',
    role: 'Konsumen, Jakarta',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=AndiPratama&backgroundColor=ffdfbf',
  },
  {
    quote: 'Harga lebih fair dari tengkulak. Petani dapat untung lebih banyak.',
    name: 'Bu Sari',
    role: 'Petani Mangga, Cirebon',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=BuSari&backgroundColor=c0aede',
  },
]

function TestimonialCard({ item }: { item: typeof testimonials[0] }) {
  return (
    <div className="flex-shrink-0 w-[350px] bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-lg hover:border-primary-100 transition-all duration-300">
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-5 h-5 text-secondary-400 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-neutral-600 text-sm leading-relaxed mb-4">"{item.quote}"</p>
      <div className="flex items-center gap-3">
        <img
          src={item.avatar}
          alt={item.name}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-100 bg-primary-50"
          width={40}
          height={40}
        />
        <div>
          <p className="font-medium text-neutral-900 text-sm">{item.name}</p>
          <p className="text-xs text-neutral-500">{item.role}</p>
        </div>
      </div>
    </div>
  )
}

export function TestimoniSection() {
  const duplicatedTestimonials = [...testimonials, ...testimonials]

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-neutral-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-4">
            Testimoni
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-neutral-900">
            Apa Kata Mereka?
          </h2>
          <p className="mt-3 text-neutral-500 max-w-md mx-auto">
            Cerita nyata dari pengguna ManggaKu
          </p>
        </motion.div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-neutral-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        
        <div className="flex gap-6 animate-marquee">
          {duplicatedTestimonials.map((item, idx) => (
            <TestimonialCard key={`${item.name}-${idx}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
