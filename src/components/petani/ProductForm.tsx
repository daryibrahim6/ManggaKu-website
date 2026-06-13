'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { Upload, X } from 'lucide-react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'

const productSchema = z.object({
  name: z.string().min(2, 'Nama produk wajib diisi'),
  variety: z.string().min(1, 'Varietas wajib dipilih'),
  category: z.string().min(1, 'Kategori wajib dipilih'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  price: z.number().min(1000, 'Harga minimal Rp 1.000'),
  unit: z.string().min(1, 'Satuan wajib dipilih'),
  stock: z.number().min(0, 'Stok tidak boleh negatif'),
  minOrder: z.number().min(1, 'Minimal order 1'),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  initialData?: Partial<ProductFormData>
  isEdit?: boolean
}

export function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
  const [images, setImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      variety: initialData?.variety ?? '',
      category: initialData?.category ?? '',
      description: initialData?.description ?? '',
      price: initialData?.price ?? 0,
      unit: initialData?.unit ?? '',
      stock: initialData?.stock ?? 0,
      minOrder: initialData?.minOrder ?? 1,
    },
  })

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true)
    try {
      // TODO: Upload images to Supabase Storage, then save product
      toast.success(isEdit ? 'Produk berhasil diupdate!' : 'Produk berhasil ditambahkan!')
      window.location.href = '/petani/produk'
    } catch {
      toast.error('Gagal menyimpan produk. Coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = () => {
    // Mock image upload
    const mockImage = `https://via.placeholder.com/200x200?text=Produk+${images.length + 1}`
    setImages([...images, mockImage])
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Foto Produk */}
      <div className="space-y-2">
        <Label>Foto Produk (maks. 5)</Label>
        <div className="flex flex-wrap gap-3">
          {images.map((img, i) => (
            <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-leaf-200">
              <img src={img} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {images.length < 5 && (
            <button
              type="button"
              onClick={handleImageUpload}
              className="w-20 h-20 rounded-xl border-2 border-dashed border-leaf-300 flex flex-col items-center justify-center text-leaf-500 hover:border-mango-400 hover:text-mango-500 transition-colors"
            >
              <Upload className="w-5 h-5 mb-1" />
              <span className="text-[10px]">Upload</span>
            </button>
          )}
        </div>
      </div>

      {/* Nama Produk */}
      <div className="space-y-2">
        <Label htmlFor="name">Nama Produk</Label>
        <Input id="name" placeholder="Contoh: Mangga Gedong Gincu Segar" {...form.register('name')} />
        {form.formState.errors.name && (
          <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
        )}
      </div>

      {/* Varietas + Kategori */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Varietas</Label>
          <Select value={form.watch('variety')} onValueChange={(v) => form.setValue('variety', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih varietas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gedong_gincu">Gedong Gincu</SelectItem>
              <SelectItem value="harum_manis">Harum Manis</SelectItem>
              <SelectItem value="cengkir">Cengkir</SelectItem>
              <SelectItem value="golek">Golek</SelectItem>
              <SelectItem value="manalagi">Manalagi</SelectItem>
              <SelectItem value="other">Lainnya</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.variety && (
            <p className="text-sm text-red-500">{form.formState.errors.variety.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Kategori</Label>
          <Select value={form.watch('category')} onValueChange={(v) => form.setValue('category', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fresh">Fresh</SelectItem>
              <SelectItem value="bulk">Bulk</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.category && (
            <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
          )}
        </div>
      </div>

      {/* Deskripsi */}
      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea id="description" rows={4} placeholder="Deskripsikan produkmu..." {...form.register('description')} />
        {form.formState.errors.description && (
          <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
        )}
      </div>

      {/* Harga + Satuan */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Harga (Rp)</Label>
          <Input id="price" type="number" placeholder="35000" {...form.register('price', { valueAsNumber: true })} />
          {form.formState.errors.price && (
            <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Satuan</Label>
          <Select value={form.watch('unit')} onValueChange={(v) => form.setValue('unit', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih satuan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kg">kg</SelectItem>
              <SelectItem value="buah">buah</SelectItem>
              <SelectItem value="box">box</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.unit && (
            <p className="text-sm text-red-500">{form.formState.errors.unit.message}</p>
          )}
        </div>
      </div>

      {/* Stok + Min Order */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stock">Stok</Label>
          <Input id="stock" type="number" placeholder="100" {...form.register('stock', { valueAsNumber: true })} />
          {form.formState.errors.stock && (
            <p className="text-sm text-red-500">{form.formState.errors.stock.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="minOrder">Minimum Order</Label>
          <Input id="minOrder" type="number" placeholder="1" {...form.register('minOrder', { valueAsNumber: true })} />
          {form.formState.errors.minOrder && (
            <p className="text-sm text-red-500">{form.formState.errors.minOrder.message}</p>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-4">
        <a href="/petani/produk">
          <Button type="button" variant="outline" className="flex-1">
            Batal
          </Button>
        </a>
        <Button type="submit" className="flex-1 bg-mango-500 hover:bg-mango-600" disabled={isLoading}>
          {isLoading ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Simpan Produk'}
        </Button>
      </div>
    </motion.form>
  )
}
