'use client'

import { motion } from 'motion/react'
import { Check, Clock, Truck, Package, MapPin, Star } from 'lucide-react'
import { cn } from '../../lib/utils'

interface OrderTimelineProps {
  currentStep: number
}

const steps = [
  { label: 'Pesanan Dibuat', icon: Package, date: '12 Jun 2026, 10:23' },
  { label: 'Pembayaran Dikonfirmasi', icon: Check, date: '12 Jun 2026, 10:31' },
  { label: 'Penjual Memproses', icon: Clock, date: '' },
  { label: 'Dalam Pengiriman', icon: Truck, date: '' },
  { label: 'Tiba di Tujuan', icon: MapPin, date: '' },
  { label: 'Pesanan Diterima', icon: Star, date: '' },
]

export function OrderTimeline({ currentStep }: OrderTimelineProps) {
  return (
    <div className="space-y-0">
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep
        const isActive = idx === currentStep
        const isPending = idx > currentStep

        return (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-start gap-4"
          >
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                  isCompleted ? 'bg-leaf-600 text-white' :
                  isActive ? 'bg-mango-500 text-white animate-pulse' :
                  'bg-leaf-100 text-leaf-400'
                )}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
              </div>
              {idx < steps.length - 1 && (
                <div className={cn(
                  'w-0.5 h-12',
                  isCompleted ? 'bg-leaf-600' : 'bg-leaf-100'
                )} />
              )}
            </div>

            <div className="pb-8">
              <p className={cn(
                'font-medium text-sm',
                isCompleted ? 'text-leaf-900' :
                isActive ? 'text-mango-500' :
                'text-leaf-400'
              )}>
                {step.label}
              </p>
              {step.date && (
                <p className="text-xs text-leaf-700/50 mt-0.5">{step.date}</p>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
