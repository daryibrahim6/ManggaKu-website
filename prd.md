# ManggaKu — Product Requirements Document (PRD)

> **Untuk Agent:** Ini adalah sumber kebenaran tunggal untuk build ManggaKu.
> Baca seluruh dokumen ini sebelum menulis satu baris kode pun.
> Jika ada konflik antara instruksi chat dan dokumen ini, ikuti dokumen ini.
>
> **Working MVP Scope:** Backend menggunakan localStorage via Zustand persist (bukan Supabase).
> Auth, cart, search, checkout, dan dashboard berfungsi dengan data mock/localStorage.

---

## PRINSIP BUILD

1. Bangun **satu fitur selesai dan berfungsi** sebelum lanjut ke fitur berikutnya
2. Setiap halaman harus **responsive** (mobile-first) sebelum lanjut
3. **Auth adalah blocker** — kerjakan di awal, semua hal lain bergantung padanya
4. Gunakan komponen dari library yang sudah ada sebelum buat custom
5. Semua teks UI dalam **Bahasa Indonesia**
6. Semua harga dalam **Rupiah (IDR)** — selalu pakai `formatRupiah()`
7. Jangan skip TypeScript types — semua data harus typed
8. Jangan gunakan `any` — pakai `unknown` atau tipe spesifik

---

## 1. RINGKASAN PROYEK

**ManggaKu** adalah platform marketplace digital tiga sisi untuk ekosistem distribusi mangga di Indramayu, Jawa Barat.

### Tiga Aktor Utama

| Role | Deskripsi | Redirect Setelah Login |
|------|-----------|----------------------|
| `konsumen` | Pembeli mangga segar dan produk olahan | `/marketplace` |
| `petani` | Penjual mangga segar dari kebun | `/petani/dashboard` |
| `umkm` | Penjual produk turunan mangga (jus, manisan, keripik) | `/umkm/dashboard` |
| `admin` | Operator internal platform | `/admin/dashboard` |

### Problem yang Diselesaikan

- Petani terjebak rantai tengkulak dengan harga tidak adil
- Konsumen tidak bisa akses langsung ke mangga berkualitas
- UMKM pengolah kesulitan bahan baku dan pasar distribusi

### Model Bisnis

- Platform fee 3–5% per transaksi sukses
- Subscription Premium (fitur analitik, prioritas tampil) untuk petani & UMKM
- Logistik fee
- B2B Wholesale channel (Fase 3)

---

## 2. TECH STACK

### Core Framework

| Layer | Package | Catatan |
|-------|---------|---------|
| Framework | `astro` (latest) | `output: 'hybrid'` — SSR untuk halaman dinamis |
| UI Components | `shadcn/ui` | React-based, di-generate ke `src/components/ui/` |
| Styling | Tailwind CSS v4 | CSS-first config via `@tailwindcss/vite`, bukan `tailwind.config.js` |
| Animation | `motion/react` | Framer Motion v12 — **selalu import dari `motion/react`**, bukan `framer-motion` |
| Smooth Scroll | `lenis` | Package baru (bukan `@studio-freight/lenis`) |
| Icons | `lucide-react` | Konsisten, jangan campur dengan icon library lain |

### Library Per Fitur

| Kebutuhan | Package | Dipakai Di |
|-----------|---------|-----------|
| Validasi form | `zod` | Semua form punya Zod schema |
| Charts | `recharts` | Dashboard penjualan, laporan |
| Data tables | `@tanstack/react-table` | Kelola produk, manajemen pesanan, admin |
| Carousel | `embla-carousel-react` | Foto produk, banner promo |
| Toast | `sonner` | Feedback semua aksi user |
| Global state | `zustand` | Cart, auth session, UI state |
| Date utilities | `date-fns` | Semua format tanggal, selalu pakai locale `id` |
| Loading skeleton | `react-loading-skeleton` | Semua state loading data fetching |

### Backend (Working MVP)

| Layer | Approach | Catatan |
|-------|----------|---------|
| Storage | localStorage via Zustand persist | Semua data tersimpan di browser |
| Auth | localStorage session | Tidak ada real auth, mock login |
| Products | Hardcoded array di `constants.ts` | 6 produk mock dengan gambar Unsplash |
| Orders | localStorage orders array | Checkout menyimpan order ke localStorage |

> **Note:** Untuk full production, ganti dengan Supabase (PostgreSQL + Auth + Realtime).

---

## 3. PROJECT SETUP

### Instalasi

```bash
# 1. Init project
npm create astro@latest manggaku -- --template minimal --typescript strict
cd manggaku

# 2. Astro integrations
npx astro add react

# 3. Tailwind v4
npm install -D @tailwindcss/vite tailwindcss

# 4. shadcn/ui init
npx shadcn@latest init
# Pilih: TypeScript yes, style Default, base color Neutral, CSS variables yes

# 5. Core UI & Animation
npm install motion lenis lucide-react

# 6. Feature libraries
npm install zod recharts @tanstack/react-table embla-carousel-react
npm install sonner zustand date-fns react-loading-skeleton

# 7. Supabase
npm install @supabase/supabase-js @supabase/ssr

# 8. shadcn components yang dibutuhkan
npx shadcn@latest add button input label select textarea card badge avatar
npx shadcn@latest add dialog sheet drawer tabs separator
npx shadcn@latest add form
npx shadcn@latest add table
npx shadcn@latest add progress skeleton
npx shadcn@latest add input-otp
npx shadcn@latest add popover command
npx shadcn@latest add scroll-area
npx shadcn@latest add dropdown-menu
```

### `astro.config.mjs`

```js
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  output: 'hybrid',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
})
```

### `.env`

```env
PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` hanya untuk server-side API routes. Jangan pernah expose ke client.

---

## 4. DESIGN SYSTEM

### Konsep Visual: "Clean White + Fresh Green"

**Bukan** hijau tua gelap, bukan poster investor.
**Adalah:** Clean, minimal, banyak white space. Fresh seperti mangga matang, profesional seperti startup modern.

### Color Palette

| Token | Warna | Kegunaan |
|-------|-------|----------|
| `primary-50` | `#f0fdf4` | Light green background |
| `primary-100` | `#dcfce7` | Green light |
| `primary-500` | `#22c55e` | Green accent |
| `primary-600` | `#16a34a` | Primary CTA, brand color |
| `primary-700` | `#15803d` | Hover state |
| `secondary-50` | `#fff7ed` | Light orange background |
| `secondary-100` | `#ffedd5` | Orange light |
| `secondary-400` | `#fb923c` | Star rating |
| `secondary-500` | `#f97316` | Harga, highlight |
| `secondary-600` | `#ea580c` | Harga hover |
| `neutral-50` | `#f8fafc` | Background sections |
| `neutral-100` | `#f1f5f9` | Borders, dividers |
| `neutral-200` | `#e2e8f0` | Borders |
| `neutral-500` | `#64748b` | Text sekunder |
| `neutral-900` | `#0f172a` | Text utama |
| `white` | `#ffffff` | Background utama |

### Color Usage

| Kegunaan | Class Tailwind |
|----------|---------------|
| CTA primer (Beli, Daftar) | `bg-primary-600 hover:bg-primary-700` |
| CTA sekunder (Lihat Cara Kerja) | `border border-primary-600 text-primary-600` |
| Harga | `text-secondary-600` (JetBrains Mono) |
| Rating bintang | `text-secondary-400 fill-secondary-400` |
| Page background | `bg-white` |
| Section alternatif | `bg-neutral-50` |
| Card background | `bg-white` |
| Card border | `border border-neutral-100` |
| Text utama | `text-neutral-900` |
| Text sekunder | `text-neutral-500` |
| Success state | `bg-green-100 text-green-700` |
| Error state | `bg-red-100 text-red-700` |

### Typography Scale

| Elemen | Font | Weight | Size |
|--------|------|--------|------|
| Hero H1 | Bricolage Grotesque | 700 | `clamp(2.5rem, 5vw, 4rem)` |
| Section H2 | Bricolage Grotesque | 700 | `clamp(1.75rem, 3vw, 2.5rem)` |
| Card title | Plus Jakarta Sans | 600 | `1rem` |
| Body teks | Plus Jakarta Sans | 400 | `0.9375rem` |
| Meta / label | Plus Jakarta Sans | 400 | `0.8125rem` |
| Harga (price) | JetBrains Mono | 500 | varies |
| Badge / pill | Plus Jakarta Sans | 600 | `0.75rem` |

### Spacing & Shape

- Container: `max-w-7xl mx-auto px-4 md:px-8`
- Card radius: `rounded-2xl`
- Input radius: `rounded-xl`
- Badge/pill radius: `rounded-full`
- Card shadow: `shadow-sm border border-neutral-100`
- Section padding: `py-16 md:py-24`

### UI/UX Guidelines (dari ui-ux-pro-max)

#### Accessibility (CRITICAL)

- **Color Contrast**: Minimum 4.5:1 ratio untuk normal text
- **Focus States**: Visible focus rings pada semua interactive elements
- **Alt Text**: Semua gambar harus ada alt text yang deskriptif
- **Aria Labels**: Tombol icon-only harus ada aria-label
- **Keyboard Nav**: Tab order sesuai visual order
- **Skip Links**: Skip to main content untuk keyboard users

#### Touch & Interaction (CRITICAL)

- **Touch Target Size**: Minimum 44×44px untuk semua interactive elements
- **Touch Spacing**: Minimum 8px gap antara touch targets
- **Loading Feedback**: Disable button saat async operations
- **Error Feedback**: Clear error messages near problem

#### Performance (HIGH)

- **Image Optimization**: Pakai Unsplash/Pexels images
- **Lazy Loading**: `loading="lazy"` untuk gambar below-fold
- **Image Dimensions**: Declare width/height untuk prevent CLS
- **Loading States**: Skeleton screens untuk data loading

#### Style Selection (HIGH)

- **Style**: Clean, minimal, lots of white space
- **Icons**: Lucide icons (SVG), bukan emoji
- **Shadows**: Subtle (`shadow-sm`), consistent
- **Borders**: `border border-neutral-100` untuk cards

---

## 5. FOLDER STRUCTURE

```
manggaku/
├── src/
│   ├── components/
│   │   ├── ui/                     # shadcn (auto-generated)
│   │   ├── layout/
│   │   │   ├── BaseLayout.astro    # Root layout
│   │   │   ├── MarketingLayout.astro # Public pages
│   │   │   ├── AppLayout.astro     # Authenticated pages
│   │   │   ├── DashboardLayout.astro # Dashboard sidebar
│   │   │   ├── MarketingNav.astro
│   │   │   ├── AppNavbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.astro
│   │   │   └── SmoothScroll.tsx
│   │   ├── marketing/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── FeaturesGrid.tsx
│   │   │   ├── TestimoniSection.tsx
│   │   │   ├── StatsBar.tsx
│   │   │   └── CTASection.tsx
│   │   ├── marketplace/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductFilters.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── CategoryTabs.tsx
│   │   │   └── BannerCarousel.tsx
│   │   ├── auth/
│   │   │   ├── RolePicker.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   └── OTPInput.tsx
│   │   ├── konsumen/
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── CartItem.tsx
│   │   │   ├── CheckoutStepper.tsx
│   │   │   ├── AddressForm.tsx
│   │   │   ├── PaymentMethodPicker.tsx
│   │   │   ├── OrderCard.tsx
│   │   │   ├── OrderTimeline.tsx
│   │   │   └── ReviewForm.tsx
│   │   ├── petani/
│   │   │   ├── DashboardStats.tsx
│   │   │   ├── SalesChart.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── ProductTable.tsx
│   │   │   ├── OrderTable.tsx
│   │   │   └── StockAlert.tsx
│   │   ├── umkm/
│   │   │   ├── DashboardStats.tsx
│   │   │   ├── ProductOlahanForm.tsx
│   │   │   └── OrderTable.tsx
│   │   └── admin/
│   │       ├── PlatformStats.tsx
│   │       ├── UserTable.tsx
│   │       └── ProductApprovalTable.tsx
│   │
│   ├── pages/
│   │   ├── index.astro
│   │   ├── cara-kerja.astro
│   │   ├── tentang-kami.astro
│   │   ├── faq.astro
│   │   ├── kontak.astro
│   │   ├── auth/
│   │   │   ├── daftar.astro
│   │   │   ├── masuk.astro
│   │   │   ├── verifikasi.astro
│   │   │   └── lupa-password.astro
│   │   ├── marketplace/
│   │   │   ├── index.astro
│   │   │   ├── [slug].astro
│   │   │   └── kategori/
│   │   │       └── [slug].astro
│   │   ├── keranjang.astro
│   │   ├── checkout.astro
│   │   ├── pembayaran/
│   │   │   └── [orderId].astro
│   │   ├── pesanan/
│   │   │   ├── index.astro
│   │   │   └── [orderId].astro
│   │   ├── profil/
│   │   │   └── index.astro
│   │   ├── toko/
│   │   │   └── [slug].astro
│   │   ├── petani/
│   │   │   ├── dashboard.astro
│   │   │   ├── produk/
│   │   │   │   ├── index.astro
│   │   │   │   ├── tambah.astro
│   │   │   │   └── [id]/
│   │   │   │       └── edit.astro
│   │   │   ├── pesanan.astro
│   │   │   ├── pengiriman/
│   │   │   │   └── [id].astro
│   │   │   ├── stok.astro
│   │   │   ├── laporan.astro
│   │   │   ├── dana.astro
│   │   │   ├── toko.astro
│   │   │   └── verifikasi.astro
│   │   ├── umkm/
│   │   │   ├── dashboard.astro
│   │   │   ├── produk/
│   │   │   │   ├── index.astro
│   │   │   │   ├── tambah.astro
│   │   │   │   └── [id]/
│   │   │   │       └── edit.astro
│   │   │   ├── pesanan.astro
│   │   │   ├── bahan-baku.astro
│   │   │   ├── laporan.astro
│   │   │   └── profil.astro
│   │   ├── admin/
│   │   │   ├── dashboard.astro
│   │   │   ├── users.astro
│   │   │   ├── produk.astro
│   │   │   ├── transaksi.astro
│   │   │   └── sengketa.astro
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── session.ts
│   │       │   └── logout.ts
│   │       ├── produk/
│   │       │   ├── index.ts
│   │       │   └── [id].ts
│   │       ├── pesanan/
│   │       │   ├── index.ts
│   │       │   └── [id].ts
│   │       └── pembayaran/
│   │           └── create.ts
│   │
│   ├── stores/
│   │   ├── cartStore.ts
│   │   ├── authStore.ts
│   │   └── uiStore.ts
│   │
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── supabase.server.ts
│   │   ├── utils.ts
│   │   └── constants.ts
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── user.ts
│   │   ├── produk.ts
│   │   └── pesanan.ts
│   │
│   └── styles/
│       └── globals.css
```

---

## 6. SITEMAP LENGKAP

### Marketing (Public, Prerendered)

| Route | File | Prerender |
|-------|------|-----------|
| `/` | `pages/index.astro` | `true` |
| `/cara-kerja` | `pages/cara-kerja.astro` | `true` |
| `/tentang-kami` | `pages/tentang-kami.astro` | `true` |
| `/faq` | `pages/faq.astro` | `true` |
| `/kontak` | `pages/kontak.astro` | `true` |

### Marketplace & Consumer (Hybrid)

| Route | Auth Required | Catatan |
|-------|---------------|---------|
| `/marketplace` | Tidak | Browse produk |
| `/marketplace/[slug]` | Tidak | Detail produk |
| `/marketplace/kategori/[slug]` | Tidak | Filter per kategori |
| `/keranjang` | Ya (konsumen) | |
| `/checkout` | Ya (konsumen) | Multi-step form |
| `/pembayaran/[orderId]` | Ya (konsumen) | Konfirmasi pembayaran |
| `/pesanan` | Ya (konsumen) | Riwayat pesanan |
| `/pesanan/[orderId]` | Ya (konsumen) | Detail + tracking |
| `/profil` | Ya (semua role) | |
| `/toko/[slug]` | Tidak | Profil publik penjual |

### Auth (SSR)

| Route | Catatan |
|-------|---------|
| `/auth/daftar` | Step 1: pilih role → Step 2: form |
| `/auth/masuk` | Login email/HP + password |
| `/auth/verifikasi` | OTP 6 digit via SMS |
| `/auth/lupa-password` | Reset link via email |

### Petani Dashboard (SSR, role: petani)

| Route | Deskripsi |
|-------|-----------|
| `/petani/dashboard` | Stats, chart, recent orders |
| `/petani/produk` | Daftar semua produk |
| `/petani/produk/tambah` | Form tambah produk |
| `/petani/produk/[id]/edit` | Form edit produk |
| `/petani/pesanan` | Pesanan masuk |
| `/petani/pengiriman/[id]` | Input resi & update status kirim |
| `/petani/stok` | Update stok real-time |
| `/petani/laporan` | Chart penjualan, export |
| `/petani/dana` | Saldo + form penarikan dana |
| `/petani/toko` | Edit profil & toko |
| `/petani/verifikasi` | Upload dokumen KTP + lahan |

### UMKM Dashboard (SSR, role: umkm)

| Route | Deskripsi |
|-------|-----------|
| `/umkm/dashboard` | Stats penjualan produk olahan |
| `/umkm/produk` | Daftar produk olahan |
| `/umkm/produk/tambah` | Form tambah produk olahan |
| `/umkm/produk/[id]/edit` | Form edit produk olahan |
| `/umkm/pesanan` | Pesanan konsumen |
| `/umkm/bahan-baku` | Beli mangga dari petani di platform |
| `/umkm/laporan` | Analitik penjualan & margin |
| `/umkm/profil` | Edit profil UMKM |

### Admin Panel (SSR, role: admin)

| Route | Deskripsi |
|-------|-----------|
| `/admin/dashboard` | GMV, user aktif, transaksi, alerts |
| `/admin/users` | Manajemen semua akun |
| `/admin/produk` | Review & approve listing baru |
| `/admin/transaksi` | Monitor semua transaksi |
| `/admin/sengketa` | Mediasi buyer-seller |

---

## 7. SPESIFIKASI HALAMAN

### 7.1 Landing Page (`/`)

**Sections dari atas ke bawah:**

1. **Navigation Bar** (Fixed top)
   - Kiri: Logo "ManggaKu" (text, bukan icon)
   - Tengah: link Marketplace, Cara Kerja, Tentang, FAQ
   - Kanan: button "Masuk" (outline) + button "Daftar" (bg primary-600)

2. **Hero Section** (Clean white background)
   - Kiri: Badge "Marketplace Mangga #1 di Indramayu"
   - H1: *"Mangga Segar Langsung dari Kebun"* — Bricolage Grotesque 700
   - Subtitle: teks deskripsi
   - CTA row: "Beli Mangga Sekarang" (primary-600) + "Lihat Cara Kerja" (outline)
   - Stats: 150+ Petani, 500+ Produk, 25+ Kota
   - Kanan: Gambar mangga dari Unsplash + floating card "100% Segar"

3. **Stats Bar** (primary-600 background)
   - 3 angka dengan animasi count-up

4. **How It Works** (neutral-50 background)
   - H2: "Cara Kerja ManggaKu"
   - 3 kolom: Konsumen / Petani / UMKM
   - Setiap kolom: icon (Lucide) + judul role + 3 step bernomor

5. **Features Grid** (white background)
   - 6 sel: Marketplace Fresh, Live Tracking, Dashboard Petani, UMKM Hub, Harga Transparan, Pengiriman Cepat

6. **Testimonial** (neutral-50 background)
   - 5 testimonial cards dengan avatar dari Unsplash
   - Rating bintang, quote, nama, role

7. **CTA Section** (primary-600 background)
   - H2 + dua button: "Mulai Belanja" + "Daftar sebagai Petani"

8. **Footer** (neutral-50 background)
   - Logo "ManggaKu", deskripsi singkat, kolom navigasi, copyright ManggaKu 2026

---

### 7.2 Marketplace (`/marketplace`)

**Layout:**
- Banner carousel dengan gambar real dari Unsplash
- Search bar besar di atas
- Filter chips row: Semua, Fresh, Olahan, UMKM, Bulk
- Grid 4 kolom desktop / 2 kolom mobile
- Product card dengan gambar real

**`ProductCard` Component:**
```
[Foto produk — aspect square, object-cover dari Unsplash]
[Badge: "Segar" | "Olahan" | "Bulk"]
[Nama produk — font-semibold]
[Nama penjual + ikon centang kalau verified]
[★★★★☆ 4.8 (24 ulasan)]
[Rp 35.000 / kg] — JetBrains Mono, text-secondary-600
[Tombol "Tambah +" — bg-primary-600, full width]
```

---

### 7.3 Detail Produk (`/marketplace/[slug]`)

**Layout desktop 2 kolom, mobile 1 kolom:**

Kolom kiri / atas:
- Gambar produk besar dari Unsplash
- Thumbnail row untuk multi-gallery

Kolom kanan / bawah:
- Breadcrumb
- Badge kategori
- H1 nama produk
- Rating bintang + jumlah ulasan
- Harga besar — JetBrains Mono, `text-secondary-600`
- Seller card dengan avatar dan badge verifikasi
- Spec grid: varietas, kondisi, stok, estimasi kirim
- Qty stepper (+ / -)
- Tombol "Tambah ke Keranjang" + "Beli Sekarang"
- Deskripsi produk
- Section Ulasan dengan avatar real

---

### 7.4 Dashboard Petani (`/petani/dashboard`)

**Layout:**
- Demo mode banner (warna secondary)
- Header card saldo dengan gradient primary
- 4 stat cards dengan icon Lucide
- Grafik penjualan placeholder
- Low stock alert (merah)
- Recent orders table dengan status badges
- Quick actions grid

---

## 8. DATA MODELS (TypeScript)

### `src/types/user.ts`

```typescript
export type UserRole = 'konsumen' | 'petani' | 'umkm' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  phone: string
  role: UserRole
  avatarUrl?: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface PetaniProfile {
  userId: string
  storeName: string
  storeSlug: string
  location: string
  bio?: string
  rating: number
  totalSales: number
  isVerifiedSeller: boolean
  verificationStatus: 'pending' | 'approved' | 'rejected'
}

export interface UMKMProfile {
  userId: string
  businessName: string
  businessSlug: string
  productTypes: string[]
  certifications?: string[]
  location: string
  rating: number
  verificationStatus: 'pending' | 'approved' | 'rejected'
}

export interface Address {
  id: string
  userId: string
  recipientName: string
  phone: string
  street: string
  kelurahan: string
  kecamatan: string
  kabupaten: string
  provinsi: string
  postalCode: string
  isDefault: boolean
}
```

### `src/types/produk.ts`

```typescript
export type ProductCategory = 'fresh' | 'olahan' | 'bulk'
export type ProductStatus = 'active' | 'inactive' | 'pending_review' | 'rejected'
export type ProductUnit = 'kg' | 'buah' | 'box' | 'botol' | 'pcs'
export type MangoVariety = 'gedong_gincu' | 'harum_manis' | 'cengkir' | 'golek' | 'manalagi' | 'other'

export interface Product {
  id: string
  slug: string
  sellerId: string
  sellerRole: 'petani' | 'umkm'
  sellerName: string
  sellerVerified: boolean
  name: string
  variety?: MangoVariety
  category: ProductCategory
  description: string
  price: number
  unit: ProductUnit
  stock: number
  minOrder: number
  images: string[]
  rating: number
  reviewCount: number
  status: ProductStatus
  rejectionReason?: string
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  productId: string
  orderId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  images?: string[]
  createdAt: string
}
```

### `src/types/pesanan.ts`

```typescript
export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'disputed'

export type PaymentMethod = 'gopay' | 'ovo' | 'qris' | 'bank_transfer' | 'cod'

export interface OrderItem {
  productId: string
  productName: string
  productImage: string
  sellerId: string
  sellerName: string
  quantity: number
  unit: ProductUnit
  pricePerUnit: number
  subtotal: number
}

export interface Order {
  id: string
  orderNumber: string
  buyerId: string
  items: OrderItem[]
  status: OrderStatus
  paymentMethod: PaymentMethod
  shippingAddress: Address
  subtotal: number
  shippingFee: number
  platformFee: number
  total: number
  trackingNumber?: string
  courier?: string
  notes?: string
  paidAt?: string
  shippedAt?: string
  deliveredAt?: string
  completedAt?: string
  createdAt: string
  updatedAt: string
}
```

---

## 9. ZUSTAND STORES

### `src/stores/cartStore.ts`

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  productId: string
  productName: string
  productImage: string
  sellerId: string
  sellerName: string
  price: number
  unit: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, qty: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find(i => i.productId === item.productId)
        if (existing) {
          set({ items: get().items.map(i =>
            i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i
          )})
        } else {
          set({ items: [...get().items, { ...item, quantity: 1 }] })
        }
      },
      removeItem: (productId) =>
        set({ items: get().items.filter(i => i.productId !== productId) }),
      updateQuantity: (productId, qty) =>
        set({ items: get().items.map(i =>
          i.productId === productId ? { ...i, quantity: Math.max(1, qty) } : i
        )}),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
      totalPrice: () => get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    }),
    { name: 'manggaku-cart' }
  )
)
```

### `src/stores/authStore.ts`

```typescript
import { create } from 'zustand'
import type { User } from '../types'

interface AuthStore {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null }),
}))
```

### `src/stores/uiStore.ts`

```typescript
import { create } from 'zustand'

interface UIStore {
  isCartOpen: boolean
  toggleCart: () => void
  isMobileNavOpen: boolean
  toggleMobileNav: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  isCartOpen: false,
  toggleCart: () => set((s) => ({ isCartOpen: !s.isCartOpen })),
  isMobileNavOpen: false,
  toggleMobileNav: () => set((s) => ({ isMobileNavOpen: !s.isMobileNavOpen })),
}))
```

---

## 10. UTILITY FUNCTIONS

### `src/lib/utils.ts`

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, format } from 'date-fns'
import { id } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd MMMM yyyy', { locale: id })
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'dd MMM yyyy, HH:mm', { locale: id })
}

export function formatRelative(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: id })
}

export function generateOrderNumber(): string {
  return `MK-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
```

---

## 11. DATABASE SCHEMA (Supabase)

```sql
-- Users (extend dari auth.users Supabase)
create table public.profiles (
  id          uuid references auth.users primary key,
  name        text not null,
  phone       text,
  role        text not null check (role in ('konsumen', 'petani', 'umkm', 'admin')),
  avatar_url  text,
  is_verified boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Petani profiles
create table public.petani_profiles (
  user_id           uuid references public.profiles primary key,
  store_name        text not null,
  store_slug        text unique not null,
  location          text,
  bio               text,
  rating            numeric(3,2) default 0,
  total_sales       int default 0,
  is_verified_seller boolean default false,
  verification_status text default 'pending' check (verification_status in ('pending','approved','rejected'))
);

-- UMKM profiles
create table public.umkm_profiles (
  user_id             uuid references public.profiles primary key,
  business_name       text not null,
  business_slug       text unique not null,
  product_types       text[],
  location            text,
  rating              numeric(3,2) default 0,
  verification_status text default 'pending' check (verification_status in ('pending','approved','rejected'))
);

-- Addresses
create table public.addresses (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references public.profiles not null,
  recipient_name text not null,
  phone         text not null,
  street        text not null,
  kelurahan     text,
  kecamatan     text,
  kabupaten     text default 'Indramayu',
  provinsi      text default 'Jawa Barat',
  postal_code   text,
  is_default    boolean default false,
  created_at    timestamptz default now()
);

-- Products
create table public.products (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  seller_id   uuid references public.profiles not null,
  seller_role text not null check (seller_role in ('petani', 'umkm')),
  name        text not null,
  variety     text,
  category    text not null check (category in ('fresh', 'olahan', 'bulk')),
  description text,
  price       int not null,
  unit        text not null,
  stock       int not null default 0,
  min_order   int not null default 1,
  images      text[] default '{}',
  rating      numeric(3,2) default 0,
  review_count int default 0,
  status      text default 'pending_review'
              check (status in ('active','inactive','pending_review','rejected')),
  rejection_reason text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Orders
create table public.orders (
  id              uuid primary key default gen_random_uuid(),
  order_number    text unique not null,
  buyer_id        uuid references public.profiles not null,
  status          text not null default 'pending_payment',
  payment_method  text,
  shipping_address jsonb not null,
  items           jsonb not null,
  subtotal        int not null,
  shipping_fee    int not null default 0,
  platform_fee    int not null default 0,
  total           int not null,
  tracking_number text,
  courier         text,
  notes           text,
  paid_at         timestamptz,
  shipped_at      timestamptz,
  delivered_at    timestamptz,
  completed_at    timestamptz,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Reviews
create table public.reviews (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid references public.products not null,
  order_id    uuid references public.orders not null,
  user_id     uuid references public.profiles not null,
  rating      int not null check (rating between 1 and 5),
  comment     text,
  images      text[] default '{}',
  created_at  timestamptz default now()
);
```

---

## 12. MVP SCOPE

### ✅ Working MVP (Current Build)

Backend menggunakan **localStorage via Zustand persist** (bukan Supabase). Semua fitur berfungsi dengan data mock/localStorage.

**Architecture:**
```
Pages (Astro + React islands)
    ↓
Zustand Stores (authStore, cartStore, orderStore)
    └── persist middleware → localStorage
    ↓
Constants (mockProducts in constants.ts)
Utils (formatRupiah, cn, etc.)
    ↓
shadcn/ui + Tailwind CSS
```

**Working Features:**
- [x] Landing page (semua sections dengan real images)
- [x] Marketplace: browse, filter, detail produk
- [x] Dashboard Petani (stats + mockup)
- [x] Clean white design dengan fresh green accent
- [x] Text-based logo "ManggaKu"
- [x] Hero section dengan real image
- [x] Real images dari Unsplash (verified accessible)
- [x] Accessibility: focus rings, aria-labels, skip links
- [x] Touch targets: minimum 44px
- [x] Lazy loading untuk images
- [x] Auth: Register + Login (localStorage session)
- [x] Cart: Add/Remove/Update (localStorage persist)
- [x] Search + Filter (client-side)
- [x] Checkout flow (multi-step)
- [x] Order history (localStorage)

### 🔮 Not Included (Post-MVP)

- [ ] Real Supabase backend
- [ ] Real payment processing (Midtrans, etc.)
- [ ] Real shipping integration (JNE, J&T API)
- [ ] UMKM dashboard
- [ ] Admin panel
- [ ] Product CRUD for petani
- [ ] Review & rating system
- [ ] Penarikan dana
- [ ] Real-time notifications

---

## 13. CODING CONVENTIONS

### Naming

| Jenis | Konvensi | Contoh |
|-------|----------|--------|
| File komponen React | PascalCase | `ProductCard.tsx` |
| File Astro pages | kebab-case | `cara-kerja.astro` |
| File stores | camelCase | `cartStore.ts` |
| Types/interfaces | PascalCase | `OrderStatus`, `UserRole` |
| Functions | camelCase | `formatRupiah()` |

### Aturan Wajib

- ✅ Semua teks UI: **Bahasa Indonesia**
- ✅ Semua harga: pakai `formatRupiah()` — tidak ada hardcode "Rp"
- ✅ Semua tanggal: pakai `date-fns` dengan `locale: id`
- ✅ Semua form: ada Zod schema
- ✅ Semua data fetch: ada loading skeleton
- ✅ Semua aksi user: ada feedback Sonner toast
- ✅ Error handling: semua API call dalam `try/catch`
- ✅ Semua gambar: ada alt text
- ✅ Semua tombol: minimum 44px touch target
- ✅ Semua interactive elements: visible focus ring

---

## 14. IMAGE SOURCES

### Unsplash Images (Free, Commercial Use)

| Kegunaan | URL |
|----------|-----|
| Hero Section | `https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=800&h=600&fit=crop` |
| Product 1 (Gedong Gincu) | `https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=400&fit=crop` |
| Product 2 (Harum Manis) | `https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=400&fit=crop` |
| Product 3 (Jus Mangga) | `https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=400&fit=crop` |
| Product 4 (Cengkir Bulk) | `https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?w=400&h=400&fit=crop` |
| Product 5 (Keripik) | `https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop` |
| Product 6 (Manalagi) | `https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop` |
| Banner 1 | `https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=600&h=300&fit=crop` |
| Banner 2 | `https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&h=300&fit=crop` |
| Banner 3 | `https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?w=600&h=300&fit=crop` |
| Avatar 1 | `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop` |
| Avatar 2 | `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop` |
| Avatar 3 | `https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop` |
| Avatar 4 | `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop` |
| Avatar 5 | `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop` |

---

## 15. CHANGE LOG

### 2026-06-13

**Bug Fixes (Sprint 1):**
- Fixed `authStore.ts` — role changed from `'buyer'` to `'konsumen'` to match PRD
- Fixed `ProductCard.tsx` — `addItem` now passes `Product` object directly instead of destructured params
- Fixed `orderStore.ts` — `OrderStatus` type aligned with PRD (`pending_payment`, `disputed` added)

**Supabase Migration (Sprint 1):**
- Created Supabase project (LKncvgsqrxcpsdagtwb)
- Created SQL schema (`docs/supabase-schema.sql`) with 7 tables + RLS + triggers
- Created TypeScript types (`src/types/supabase.ts`)
- Created auth helpers (`src/lib/auth.ts`)
- Created product helpers (`src/lib/products.ts`)
- Created order helpers (`src/lib/orders.ts`)
- Rewrote `authStore.ts` to use Supabase Auth (async)
- Updated LoginForm, RegisterForm, MarketingNav for Supabase
- Updated marketplace pages to fetch from Supabase
- Seed script created (`scripts/seed.ts`) with 3 accounts + 6 products

**Landing Page Improvements (Sprint 1):**
- Hero section: fullscreen, gradient background, floating cards, gradient text
- Testimonials: horizontal auto-scroll marquee, 6 testimonials
- Navbar: glassmorphism, gradient buttons, improved mobile menu
- Footer: 4-column grid, social icons, better layout
- FeaturesGrid: gradient icons, hover animations, better card styling
- Added marquee CSS animation to globals.css
