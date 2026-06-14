'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'
import { useAuthStore } from '../../stores/authStore'
import type { UserRole } from '../../types'

interface RegisterFormProps {
  role: UserRole | null
  onSuccess: () => void
}

const baseSchema = z.object({
  name: z.string().min(2, 'Nama harus minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().min(10, 'Nomor HP harus minimal 10 digit'),
  password: z.string().min(8, 'Password harus minimal 8 karakter'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword'],
})

const petaniSchema = baseSchema.extend({
  village: z.string().min(2, 'Nama desa wajib diisi'),
  gardenSize: z.string().min(1, 'Estimasi luas kebun wajib dipilih'),
})

const umkmSchema = baseSchema.extend({
  businessName: z.string().min(2, 'Nama usaha wajib diisi'),
  productType: z.string().min(2, 'Jenis produk utama wajib diisi'),
})

type BaseFormData = z.infer<typeof baseSchema>
type PetaniFormData = z.infer<typeof petaniSchema>
type UmkmFormData = z.infer<typeof umkmSchema>

export function RegisterForm({ role: initialRole, onSuccess }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeRole, setActiveRole] = useState<UserRole>(initialRole || 'konsumen')
  const register = useAuthStore((s) => s.register)

  const getRole = () => activeRole

  useEffect(() => {
    const handler = ((e: CustomEvent) => {
      setActiveRole(e.detail.role)
    }) as EventListener
    window.addEventListener('register:role', handler)
    return () => window.removeEventListener('register:role', handler)
  }, [])

  const baseForm = useForm<BaseFormData>({
    resolver: zodResolver(baseSchema),
    defaultValues: { name: '', email: '', phone: '', password: '', confirmPassword: '' },
  })

  const petaniForm = useForm<PetaniFormData>({
    resolver: zodResolver(petaniSchema),
    defaultValues: { name: '', email: '', phone: '', password: '', confirmPassword: '', village: '', gardenSize: '' },
  })

  const umkmForm = useForm<UmkmFormData>({
    resolver: zodResolver(umkmSchema),
    defaultValues: { name: '', email: '', phone: '', password: '', confirmPassword: '', businessName: '', productType: '' },
  })

  const form = getRole() === 'petani' ? petaniForm : getRole() === 'umkm' ? umkmForm : baseForm

  const onSubmit = async (data: BaseFormData | PetaniFormData | UmkmFormData) => {
    setIsLoading(true)
    try {
      const activeRole = getRole()
      const extraFields = activeRole === 'petani'
        ? { village: (data as PetaniFormData).village, gardenSize: (data as PetaniFormData).gardenSize }
        : activeRole === 'umkm'
          ? { businessName: (data as UmkmFormData).businessName, productType: (data as UmkmFormData).productType }
          : {}

      const { error } = await register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: activeRole as UserRole,
        ...extraFields,
      })
      if (error) {
        toast.error(error.includes('already registered') ? 'Email sudah terdaftar.' : error)
        return
      }
      toast.success('Akun berhasil dibuat!')
      onSuccess()
    } catch {
      toast.error('Gagal membuat akun. Coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Nama Lengkap</Label>
        <Input id="name" placeholder="Masukkan nama lengkap" {...form.register('name')} />
        {form.formState.errors.name && (
          <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="contoh@email.com" {...form.register('email')} />
        {form.formState.errors.email && (
          <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Nomor HP</Label>
        <Input id="phone" placeholder="08xxxxxxxxxx" {...form.register('phone')} />
        {form.formState.errors.phone && (
          <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="Minimal 8 karakter" {...form.register('password')} />
        {form.formState.errors.password && (
          <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
        <Input id="confirmPassword" type="password" placeholder="Ulangi password" {...form.register('confirmPassword')} />
        {form.formState.errors.confirmPassword && (
          <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>
        )}
      </div>

      {getRole() === 'petani' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="village">Nama Desa / Kecamatan</Label>
            <Input id="village" placeholder="Contoh: Jatibarang" {...petaniForm.register('village')} />
            {petaniForm.formState.errors.village && (
              <p className="text-sm text-red-500">{petaniForm.formState.errors.village.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="gardenSize">Estimasi Luas Kebun</Label>
            <Select onValueChange={(val) => petaniForm.setValue('gardenSize', val)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih luas kebun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="<0.5">Kurang dari 0.5 hektar</SelectItem>
                <SelectItem value="0.5-1">0.5 - 1 hektar</SelectItem>
                <SelectItem value="1-2">1 - 2 hektar</SelectItem>
                <SelectItem value="2-5">2 - 5 hektar</SelectItem>
                <SelectItem value=">5">Lebih dari 5 hektar</SelectItem>
              </SelectContent>
            </Select>
            {petaniForm.formState.errors.gardenSize && (
              <p className="text-sm text-red-500">{petaniForm.formState.errors.gardenSize.message}</p>
            )}
          </div>
        </>
      )}

      {getRole() === 'umkm' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="businessName">Nama Usaha</Label>
            <Input id="businessName" placeholder="Contoh: Jus Mangga Bu Rina" {...umkmForm.register('businessName')} />
            {umkmForm.formState.errors.businessName && (
              <p className="text-sm text-red-500">{umkmForm.formState.errors.businessName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="productType">Jenis Produk Utama</Label>
            <Input id="productType" placeholder="Contoh: Jus, Manisan, Keripik" {...umkmForm.register('productType')} />
            {umkmForm.formState.errors.productType && (
              <p className="text-sm text-red-500">{umkmForm.formState.errors.productType.message}</p>
            )}
          </div>
        </>
      )}

      <Button type="submit" className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-500/25" disabled={isLoading}>
        {isLoading ? 'Memproses...' : 'Buat Akun'}
      </Button>
    </form>
  )
}
