'use client'

import { useEffect, useState } from 'react'
import { OTPInput } from './OTPInput'
import { sendEmailOTP, getCurrentUser } from '../../lib/auth'

export function VerificationHandler() {
  const [email, setEmail] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const init = async () => {
      const user = await getCurrentUser()
      if (!user?.email) {
        setError('Tidak ada sesi aktif. Silakan daftar atau masuk terlebih dahulu.')
        return
      }
      setEmail(user.email)

      const { error: otpError } = await sendEmailOTP(user.email)
      if (otpError) {
        setError(otpError)
        return
      }
      setSent(true)
    }
    init()
  }, [])

  if (error) {
    return (
      <div className="text-center space-y-4">
        <p className="text-sm text-red-600">{error}</p>
        <a
          href="/auth/daftar"
          className="text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          Kembali ke pendaftaran
        </a>
      </div>
    )
  }

  if (!sent || !email) {
    return (
      <div className="text-center">
        <p className="text-sm text-neutral-500">Mengirim kode OTP...</p>
      </div>
    )
  }

  return (
    <OTPInput
      email={email}
      onVerified={() => {
        window.location.href = '/marketplace'
      }}
    />
  )
}
