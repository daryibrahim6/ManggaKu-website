'use client'

import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table'
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { formatRupiah, cn } from '../../lib/utils'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import type { Product } from '../../types'

const columnHelper = createColumnHelper<Product>()

const mockProducts: Product[] = [
  {
    id: '1', slug: 'keripik-mangga-original', sellerId: 'u1', sellerRole: 'umkm',
    sellerName: 'Bu Ratna', sellerVerified: true, name: 'Keripik Mangga Original',
    variety: 'gedong_gincu', category: 'olahan', description: '',
    price: 25000, unit: 'box', stock: 150, minOrder: 1, images: [],
    rating: 4.8, reviewCount: 32, status: 'active', createdAt: '2026-06-01', updatedAt: '2026-06-10',
  },
  {
    id: '2', slug: 'sambal-mangga-pedas', sellerId: 'u2', sellerRole: 'umkm',
    sellerName: 'Bu Ratna', sellerVerified: true, name: 'Sambal Mangga Pedas',
    variety: 'harum_manis', category: 'olahan', description: '',
    price: 18000, unit: 'botol', stock: 80, minOrder: 2, images: [],
    rating: 4.7, reviewCount: 21, status: 'active', createdAt: '2026-06-03', updatedAt: '2026-06-11',
  },
  {
    id: '3', slug: 'dodol-mangga-1kg', sellerId: 'u3', sellerRole: 'umkm',
    sellerName: 'Bu Ratna', sellerVerified: true, name: 'Dodol Mangga 1kg',
    variety: 'cengkir', category: 'olahan', description: '',
    price: 45000, unit: 'box', stock: 5, minOrder: 1, images: [],
    rating: 4.9, reviewCount: 15, status: 'active', createdAt: '2026-06-05', updatedAt: '2026-06-12',
  },
  {
    id: '4', slug: 'jus-mangga-kemasan', sellerId: 'u4', sellerRole: 'umkm',
    sellerName: 'Bu Ratna', sellerVerified: false, name: 'Jus Mangga Kemasan 500ml',
    variety: 'manalagi', category: 'olahan', description: '',
    price: 12000, unit: 'botol', stock: 200, minOrder: 6, images: [],
    rating: 4.5, reviewCount: 10, status: 'pending_review', createdAt: '2026-06-08', updatedAt: '2026-06-13',
  },
]

export function ProductTable() {
  const [globalFilter, setGlobalFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Nama Produk',
      cell: (info) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-mango-50 rounded-lg flex items-center justify-center text-xs shrink-0">🥭</div>
          <span className="font-medium text-leaf-900">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor('category', {
      header: 'Kategori',
      cell: (info) => {
        const v = info.getValue()
        const labels: Record<string, string> = {
          olahan: 'Olahan',
          fresh: 'Fresh',
          bulk: 'Bulk',
        }
        return <span className="text-sm text-leaf-700/70">{v ? labels[v] ?? v : '-'}</span>
      },
    }),
    columnHelper.accessor('price', {
      header: 'Harga',
      cell: (info) => (
        <span className="font-mono text-sm">{formatRupiah(info.getValue())}</span>
      ),
    }),
    columnHelper.accessor('stock', {
      header: 'Stok',
      cell: (info) => (
        <span className={cn('text-sm font-medium', info.getValue() < 10 ? 'text-red-500' : 'text-leaf-900')}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => {
        const status = info.getValue()
        const style = {
          active: 'bg-green-100 text-green-700',
          inactive: 'bg-gray-100 text-gray-600',
          pending_review: 'bg-orange-100 text-orange-700',
          rejected: 'bg-red-100 text-red-700',
        }[status]
        const label = {
          active: 'Aktif',
          inactive: 'Nonaktif',
          pending_review: 'Pending',
          rejected: 'Ditolak',
        }[status]
        return <Badge className={style}>{label}</Badge>
      },
    }),
    columnHelper.accessor('updatedAt', {
      header: 'Update',
      cell: (info) => <span className="text-xs text-leaf-700/50">{info.getValue()}</span>,
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Aksi',
      cell: (info) => (
        <div className="flex items-center gap-1">
          <a href={`/umkm/produk/${info.row.original.id}/edit`}>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Pencil className="w-4 h-4 text-leaf-600" />
            </Button>
          </a>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            {info.row.original.status === 'active' ? (
              <EyeOff className="w-4 h-4 text-amber-500" />
            ) : (
              <Eye className="w-4 h-4 text-leaf-600" />
            )}
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
    }),
  ], [])

  const filteredData = useMemo(() => {
    let data = mockProducts
    if (statusFilter !== 'all') {
      data = data.filter((p) => p.status === statusFilter)
    }
    return data
  }, [statusFilter])

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Input
            placeholder="Cari produk olahan..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-64"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-leaf-200 text-sm"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
            <option value="pending_review">Pending</option>
          </select>
        </div>
        <a href="/umkm/produk/tambah">
          <Button className="bg-mango-500 hover:bg-mango-600">+ Tambah Produk</Button>
        </a>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-leaf-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-leaf-100">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-xs font-semibold text-leaf-700/70 uppercase tracking-wider"
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-leaf-50 hover:bg-leaf-50/50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 flex items-center justify-between border-t border-leaf-100">
          <p className="text-sm text-leaf-700/50">
            Menampilkan {table.getRowModel().rows.length} dari {filteredData.length} produk
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
