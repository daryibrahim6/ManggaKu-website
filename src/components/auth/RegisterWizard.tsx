'use client'

import { useState } from 'react'
import { RolePicker } from './RolePicker'
import { RegisterForm } from './RegisterForm'
import type { UserRole } from '../../types'

export function RegisterWizard() {
  const [step, setStep] = useState<'role' | 'form'>('role')
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role)
    window.dispatchEvent(new CustomEvent('register:role', { detail: { role } }))
    setStep('form')
  }

  if (step === 'form') {
    return (
      <div>
        <button
          onClick={() => setStep('role')}
          className="mb-6 text-sm text-primary-600 hover:text-primary-700 transition-colors inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </button>
        <RegisterForm role={selectedRole} onSuccess={() => {
          window.location.href = '/auth/verifikasi'
        }} />
      </div>
    )
  }

  return <RolePicker selected={null} onSelect={handleSelectRole} />
}
