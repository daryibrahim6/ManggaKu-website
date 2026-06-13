'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '../ui/input'

interface SearchBarProps {
  onSearch?: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
    window.dispatchEvent(new CustomEvent('marketplace:search', { detail: { query } }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    onSearch?.(val)
    window.dispatchEvent(new CustomEvent('marketplace:search', { detail: { query: val } }))
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
      <Input
        type="text"
        placeholder="Cari mangga segar, produk olahan..."
        value={query}
        onChange={handleChange}
        className="pl-12 py-6 text-base rounded-2xl border-neutral-200 bg-white shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
      />
    </form>
  )
}
