'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '../ui/input-otp'
import { sendEmailOTP, verifyEmailOTP } from '../../lib/auth'
import { useAuthStore } from '../../stores/authStore'

interface OTPInputProps {
  length?: number
  email: string
  onVerified?: () => void
}

export function OTPInput({ length = 6, email, onVerified }: OTPInputProps) {
  const [otp, setOtp] = useState('')
  const [countdown, setCountdown] = useState(59)
  const [canResend, setCanResend] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const setUser = useAuthStore((s) => s.setUser)

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true)
      return
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  const handleVerify = useCallback(async (token: string) => {
    setIsVerifying(true)
    try {
      const { user, error } = await verifyEmailOTP(email, token)
      if (error) {
        toast.error(error)
        setOtp('')
        return
      }
      if (user) {
        setUser(user)
        toast.success('Verifikasi berhasil!')
        onVerified?.()
      }
    } finally {
      setIsVerifying(false)
    }
  }, [email, onVerified, setUser])

  useEffect(() => {
    if (otp.length === length && !isVerifying) {
      handleVerify(otp)
    }
  }, [otp, length, isVerifying, handleVerify])

  const handleResend = async () => {
    if (!canResend || isSending) return
    setIsSending(true)
    try {
      const { error } = await sendEmailOTP(email)
      if (error) {
        toast.error(error)
        return
      }
      setCountdown(59)
      setCanResend(false)
      toast.success('OTP baru telah dikirim!')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-center">
        <InputOTP maxLength={length} value={otp} onChange={setOtp}>
          <InputOTPGroup>
            {Array.from({ length }).map((_, i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      <p className="text-center text-sm text-neutral-500">
        {isVerifying
          ? 'Memverifikasi kode OTP...'
          : `Masukkan ${length} digit kode OTP yang dikirim ke email kamu`}
      </p>

      <div className="text-center">
        {canResend ? (
          <button
            onClick={handleResend}
            disabled={isSending}
            className="text-sm font-medium text-primary-600 hover:text-primary-700 disabled:opacity-50"
          >
            {isSending ? 'Mengirim...' : 'Kirim Ulang OTP'}
          </button>
        ) : (
          <p className="text-sm text-neutral-400">
            Kirim ulang dalam {countdown} detik
          </p>
        )}
      </div>
    </motion.div>
  )
}
