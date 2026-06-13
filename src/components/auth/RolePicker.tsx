'use client'

import { useState } from 'react'
import { User, Sprout, Store } from 'lucide-react'
import { cn } from '../../lib/utils'
import type { UserRole } from '../../types'

interface RolePickerProps {
  selected: UserRole | null
  onSelect: (role: UserRole) => void
}

const roles = [
  {
    value: 'konsumen' as UserRole,
    icon: User,
    title: 'Saya Konsumen',
    description: 'Beli mangga segar dan produk olahan langsung dari petani.',
    color: 'border-secondary-400 bg-secondary-50',
    iconBg: 'bg-secondary-100',
    iconColor: 'text-secondary-600',
  },
  {
    value: 'petani' as UserRole,
    icon: Sprout,
    title: 'Saya Petani',
    description: 'Jual hasil kebun langsung ke konsumen tanpa perantara.',
    color: 'border-primary-400 bg-primary-50',
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-600',
  },
  {
    value: 'umkm' as UserRole,
    icon: Store,
    title: 'Saya UMKM',
    description: 'Jual produk olahan mangga dan temukan bahan baku berkualitas.',
    color: 'border-amber-400 bg-amber-50',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
]

export function RolePicker({ selected, onSelect }: RolePickerProps) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {roles.map((role) => {
        const isSelected = selected === role.value
        const isHovered = hovered === role.value
        return (
          <button
            key={role.value}
            type="button"
            onClick={() => onSelect(role.value)}
            onMouseEnter={() => setHovered(role.value)}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              'relative p-6 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              'active:scale-[0.97]',
              isSelected
                ? `${role.color} shadow-lg`
                : isHovered
                  ? 'border-neutral-300 bg-neutral-50 shadow-md'
                  : 'border-neutral-200 bg-white hover:shadow-md'
            )}
          >
            {isSelected && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            <div className={cn(
              'w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-200',
              isSelected ? 'bg-white/80 shadow-sm' : role.iconBg
            )}>
              <role.icon className={cn(
                'w-7 h-7 transition-colors duration-200',
                isSelected ? role.iconColor : 'text-neutral-500'
              )} />
            </div>
            <h3 className={cn(
              'font-semibold transition-colors duration-200',
              isSelected ? 'text-neutral-900' : 'text-neutral-700'
            )}>
              {role.title}
            </h3>
            <p className={cn(
              'mt-1.5 text-sm leading-relaxed transition-colors duration-200',
              isSelected ? 'text-neutral-600' : 'text-neutral-400'
            )}>
              {role.description}
            </p>
          </button>
        )
      })}
    </div>
  )
}
