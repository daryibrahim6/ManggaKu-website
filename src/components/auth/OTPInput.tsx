'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '../ui/input-otp'
import { Button } from '../ui/button'

interface OTPInputProps {
  length?: number
  onSubmit: (otp: string) => void
}

export function OTPInput({ length = 6, onSubmit }: OTPInputProps) {
  const [otp, setOtp] = useState('')
  const [countdown, setCountdown] = useState(59)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true)
      return
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  useEffect(() => {
    if (otp.length === length) {
      onSubmit(otp)
    }
  }, [otp, length, onSubmit])

  const handleResend = () => {
    if (!canResend) return
    setCountdown(59)
    setCanResend(false)
    toast.success('OTP baru telah dikirim!')
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
        Masukkan 6 digit kode OTP yang dikirim ke nomor HP kamu
      </p>

      <div className="text-center">
        {canResend ? (
          <button
            onClick={handleResend}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Kirim Ulang OTP
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
