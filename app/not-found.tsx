'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Home, BookOpen } from 'lucide-react'

export default function NotFound() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="max-w-md w-full text-center">

        {/* Número animado */}
        <div className="relative mb-8 select-none">
          <p className="text-[160px] font-bold leading-none"
            style={{
              background: 'linear-gradient(135deg, #10B981, #0D9488)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              opacity: mounted ? 1 : 0,
              transition: 'opacity 0.5s ease',
            }}>
            404
          </p>
          {/* Glow detrás */}
          <div className="absolute inset-0 blur-3xl opacity-20 -z-10"
            style={{ background: 'radial-gradient(circle, #10B981, transparent)' }} />
        </div>

        {/* Ícono */}
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-2xl border border-emerald-500/20"
            style={{ backgroundColor: 'var(--bg-surface)' }}>
            <BookOpen size={32} className="text-emerald-400" />
          </div>
        </div>

        {/* Texto */}
        <h1 style={{ color: 'var(--text-primary)' }} className="text-2xl font-bold mb-3">
          Página no encontrada
        </h1>
        <p style={{ color: 'var(--text-secondary)' }} className="text-sm leading-relaxed mb-8">
          Parece que esta página no existe o fue movida.
          No te preocupes, tu progreso académico sigue intacto. 🌿
        </p>

        {/* Botón */}
        <Link href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
            bg-gradient-to-r from-emerald-500 to-teal-500
            text-white font-medium text-sm hover:opacity-90 transition-opacity">
          <Home size={16} />
          Volver al Dashboard
        </Link>

        {/* Branding */}
        <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-8 opacity-50">
          Lumio — Asistente académico
        </p>
      </div>
    </div>
  )
}