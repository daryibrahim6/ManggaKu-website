'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { supabase } from '../../lib/supabase'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'

const forgotPasswordSchema = z.object({
  email: z.string().email('Email tidak valid'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })
      if (error) throw error
      setIsSent(true)
      toast.success('Link reset password telah dikirim!')
    } catch {
      toast.error('Gagal mengirim email. Coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSent) {
    return (
      <div className="text-center py-8 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
        <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">✉️</span>
        </div>
        <h2 className="font-semibold text-neutral-900 mb-2">Email Terkirim!</h2>
        <p className="text-sm text-neutral-500">
          Periksa inbox email kamu untuk link reset password.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="contoh@email.com" {...form.register('email')} />
        {form.formState.errors.email && (
          <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700" disabled={isLoading}>
        {isLoading ? 'Mengirim...' : 'Kirim Link Reset'}
      </Button>
    </form>
  )
}
