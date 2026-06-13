'use client'

import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { cn } from '../../lib/utils'

interface ProductFiltersProps {
  onFilter?: (filters: FilterState) => void
  className?: string
}

interface FilterState {
  priceMin: string
  priceMax: string
  variety: string
  location: string
  rating: string
}

export function ProductFilters({ onFilter, className }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    priceMin: '',
    priceMax: '',
    variety: '',
    location: '',
    rating: '',
  })

  const handleApply = () => {
    onFilter?.(filters)
    window.dispatchEvent(new CustomEvent('marketplace:filter', { detail: { filters } }))
    setIsOpen(false)
  }

  const handleReset = () => {
    const defaultFilters: FilterState = { priceMin: '', priceMax: '', variety: '', location: '', rating: '' }
    setFilters(defaultFilters)
    onFilter?.(defaultFilters)
    window.dispatchEvent(new CustomEvent('marketplace:filter', { detail: { filters: defaultFilters } }))
    setIsOpen(false)
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className={cn('border-neutral-200', className)}
      >
        <SlidersHorizontal className="w-4 h-4 mr-2" />
        Filter
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setIsOpen(false)}>
          <div
            className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-lg text-neutral-900">Filter Produk</h2>
              <button onClick={() => setIsOpen(false)} className="text-neutral-500 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Harga</Label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceMin}
                    onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-sm"
                  />
                  <span className="text-neutral-400 self-center">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceMax}
                    onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Varietas</Label>
                <Select value={filters.variety} onValueChange={(v) => setFilters({ ...filters, variety: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua varietas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gedong_gincu">Gedong Gincu</SelectItem>
                    <SelectItem value="harum_manis">Harum Manis</SelectItem>
                    <SelectItem value="cengkir">Cengkir</SelectItem>
                    <SelectItem value="golek">Golek</SelectItem>
                    <SelectItem value="manalagi">Manalagi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Lokasi</Label>
                <Select value={filters.location} onValueChange={(v) => setFilters({ ...filters, location: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua lokasi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jatibarang">Jatibarang</SelectItem>
                    <SelectItem value="karangampel">Karangampel</SelectItem>
                    <SelectItem value="indramayu">Indramayu Kota</SelectItem>
                    <SelectItem value="arahan">Arahan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Rating Minimum</Label>
                <Select value={filters.rating} onValueChange={(v) => setFilters({ ...filters, rating: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4.5">4.5+</SelectItem>
                    <SelectItem value="4.0">4.0+</SelectItem>
                    <SelectItem value="3.5">3.5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={handleReset}>
                Reset
              </Button>
              <Button className="flex-1 bg-primary-600 hover:bg-primary-700" onClick={handleApply}>
                Terapkan
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
