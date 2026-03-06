'use client'

import { Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!isOpen || !mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Overlay completo */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)' }}
        onClick={onCancel}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-sm rounded-2xl border border-red-500/20 p-6 shadow-2xl"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-emerald-700 hover:text-emerald-400 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20
          flex items-center justify-center mb-4">
          <Trash2 size={20} className="text-red-400" />
        </div>

        <h3 style={{ color: 'var(--text-primary)' }} className="font-semibold text-lg mb-2">
          {title}
        </h3>
        <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-emerald-900/30
              text-sm font-medium transition-colors hover:bg-emerald-500/10"
            style={{ color: 'var(--text-primary)' }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30
              text-red-400 text-sm font-medium hover:bg-red-500/30 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}