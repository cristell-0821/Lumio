'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle, X } from 'lucide-react'

interface Props {
  message: string
  isVisible: boolean
  onClose: () => void
}

export default function Toast({ message, isVisible, onClose }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!mounted) return null

  return createPortal(
    <div
      className="fixed bottom-6 right-6 z-[999] transition-all duration-300"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      <div
        className="flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg border border-emerald-500/30"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        <CheckCircle size={18} className="text-emerald-400 shrink-0" />
        <p style={{ color: 'var(--text-primary)' }} className="text-sm font-medium">
          {message}
        </p>
        <button
          onClick={onClose}
          className="text-emerald-700 hover:text-emerald-400 transition-colors ml-1"
        >
          <X size={15} />
        </button>
      </div>
    </div>,
    document.body
  )
}