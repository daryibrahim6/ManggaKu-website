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
import { Eye, Shield, Trash2 } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import type { User } from '../../types'

const columnHelper = createColumnHelper<User>()

const mockUsers: User[] = [
  { id: '1', email: 'andi@email.com', name: 'Andi Pratama', phone: '081234567890', role: 'konsumen', isVerified: true, createdAt: '2026-06-01', updatedAt: '2026-06-01' },
  { id: '2', email: 'siti@email.com', name: 'Siti Aminah', phone: '081234567891', role: 'konsumen', isVerified: true, createdAt: '2026-06-02', updatedAt: '2026-06-02' },
  { id: '3', email: 'pak.karso@email.com', name: 'Pak Karso', phone: '081234567892', role: 'petani', isVerified: true, createdAt: '2026-05-15', updatedAt: '2026-06-10' },
  { id: '4', email: 'bu.rina@email.com', name: 'Bu Rina', phone: '081234567893', role: 'umkm', isVerified: false, createdAt: '2026-06-05', updatedAt: '2026-06-05' },
  { id: '5', email: 'pak.warto@email.com', name: 'Pak Warto', phone: '081234567894', role: 'petani', isVerified: false, createdAt: '2026-06-08', updatedAt: '2026-06-08' },
  { id: '6', email: 'admin@smartmango.id', name: 'Admin Smart Mango', phone: '081234567899', role: 'admin', isVerified: true, createdAt: '2026-01-01', updatedAt: '2026-06-12' },
]

export function UserTable() {
  const [globalFilter, setGlobalFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'User',
      cell: (info) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-leaf-100 rounded-full flex items-center justify-center text-xs font-medium">
            {info.getValue().charAt(0)}
          </div>
          <div>
            <p className="font-medium text-leaf-900 text-sm">{info.getValue()}</p>
            <p className="text-xs text-leaf-700/50">{info.row.original.email}</p>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('role', {
      header: 'Role',
      cell: (info) => {
        const role = info.getValue()
        const style = {
          konsumen: 'bg-blue-100 text-blue-700',
          petani: 'bg-leaf-100 text-leaf-700',
          umkm: 'bg-amber-100 text-amber-700',
          admin: 'bg-gray-100 text-gray-700',
        }[role]
        return <Badge className={style}>{role.charAt(0).toUpperCase() + role.slice(1)}</Badge>
      },
    }),
    columnHelper.accessor('isVerified', {
      header: 'Verifikasi',
      cell: (info) => (
        <Badge className={info.getValue() ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
          {info.getValue() ? 'Terverifikasi' : 'Belum'}
        </Badge>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Daftar',
      cell: (info) => <span className="text-xs text-leaf-700/50">{info.getValue()}</span>,
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Aksi',
      cell: () => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Eye className="w-4 h-4 text-leaf-600" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Shield className="w-4 h-4 text-amber-500" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
    }),
  ], [])

  const filteredData = useMemo(() => {
    let data = mockUsers
    if (roleFilter !== 'all') {
      data = data.filter((u) => u.role === roleFilter)
    }
    return data
  }, [roleFilter])

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
            placeholder="Cari user..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-64"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-leaf-200 text-sm"
          >
            <option value="all">Semua Role</option>
            <option value="konsumen">Konsumen</option>
            <option value="petani">Petani</option>
            <option value="umkm">UMKM</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-leaf-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-leaf-100">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-3 text-left text-xs font-semibold text-leaf-700/70 uppercase tracking-wider">
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
            Menampilkan {table.getRowModel().rows.length} dari {filteredData.length} user
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              Sebelumnya
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Selanjutnya
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
