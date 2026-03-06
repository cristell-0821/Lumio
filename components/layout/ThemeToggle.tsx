'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const handleToggle = () => {
  const next = theme === 'dark' ? 'light' : 'dark'
  console.log('Cambiando tema a:', next)
  setTheme(next)
}

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-lg transition-all duration-200 
        hover:bg-emerald-500/10 text-emerald-400 hover:text-emerald-300"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}