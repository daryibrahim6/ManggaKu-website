'use client'

import { useState, useEffect } from 'react'
import { cn } from '../../lib/utils'

const categories = [
  { value: 'all', label: 'Semua' },
  { value: 'fresh', label: 'Segar' },
  { value: 'olahan', label: 'Olahan' },
  { value: 'bulk', label: 'Bulk' },
]

export function CategoryTabs() {
  const [selected, setSelected] = useState('all')

  useEffect(() => {
    const handler = ((e: CustomEvent) => {
      setSelected(e.detail.category)
    }) as EventListener
    window.addEventListener('marketplace:category', handler)
    return () => window.removeEventListener('marketplace:category', handler)
  }, [])

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => {
            setSelected(cat.value)
            window.dispatchEvent(new CustomEvent('marketplace:category', { detail: { category: cat.value } }))
          }}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-all',
            selected === cat.value
              ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
              : 'bg-white text-neutral-600 border border-neutral-200 hover:border-primary-300 hover:bg-primary-50'
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
