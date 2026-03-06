'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, CheckSquare, BookOpen, Users, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { useState, useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tasks', label: 'Tareas', icon: CheckSquare },
  { href: '/flashcards', label: 'Flashcards', icon: BookOpen },
  { href: '/projects', label: 'Proyectos', icon: Users },
]

const MIN_WIDTH = 64
const MAX_WIDTH = 320
const DEFAULT_WIDTH = 256

export default function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [width, setWidth] = useState(DEFAULT_WIDTH)
  const [isResizing, setIsResizing] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  const logoSrc = mounted && theme === 'light' ? '/img/logo_light.png' : '/img/logo.png'
  const isCollapsed = width <= 160

  // Resize logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      const newWidth = Math.min(Math.max(e.clientX, MIN_WIDTH), MAX_WIDTH)
      setWidth(newWidth)
    }
    const handleMouseUp = () => setIsResizing(false)

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing])

  const NavLinks = () => (
    <nav className="flex flex-col gap-1 flex-1">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            title={isCollapsed ? label : undefined}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl
              transition-all duration-200 text-sm font-medium
              ${isCollapsed ? 'justify-center' : ''}
              ${isActive
                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-emerald-700 hover:text-emerald-400 hover:bg-emerald-500/10'
              }`}
          >
            <Icon size={18} className="shrink-0" />
            {!isCollapsed && <span className="truncate">{label}</span>}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        ref={sidebarRef}
        className="hidden lg:flex fixed left-0 top-0 h-screen
          border-r border-emerald-900/30 flex-col p-4 z-50 select-none"
        style={{
          width: `${width}px`,
          backgroundColor: 'var(--bg-surface)',
          transition: isResizing ? 'none' : 'width 0.1s ease',
        }}
      >
        {/* Logo */}
        {!isCollapsed ? (
          <div className="mb-8 px-1">
            <img src={logoSrc} alt="Lumio" className="h-9 w-auto" />
            <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-1">
              Asistente académico
            </p>
          </div>
        ) : (
          <div className="mb-8 flex justify-center">
            <img src="/favicon.ico" alt="Lumio" className="h-7 w-7 object-contain" />
          </div>
        )}

        <NavLinks />

        {/* Bottom */}
        <div className={`flex items-center pt-4 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && <span style={{ color: 'var(--text-secondary)' }} className="text-xs">v1.0.0</span>}
          <ThemeToggle />
        </div>

        {/* Resize handle */}
        <div
          onMouseDown={() => setIsResizing(true)}
          className="absolute right-0 top-0 h-full w-1 cursor-col-resize
            hover:bg-emerald-500/40 transition-colors duration-200 group"
        >
          <div className="absolute right-[-8px] top-1/2 -translate-y-1/2
            opacity-0 group-hover:opacity-100 transition-opacity">
            {isCollapsed
              ? <ChevronRight size={14} className="text-emerald-500" />
              : <ChevronLeft size={14} className="text-emerald-500" />
            }
          </div>
        </div>
      </aside>

      {/* Desktop spacer */}
      <div
        className="hidden lg:block shrink-0"
        style={{ width: `${width}px`, transition: isResizing ? 'none' : 'width 0.1s ease' }}
      />

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50
        border-b border-emerald-900/30
        flex items-center justify-between px-5 py-4"
        style={{ backgroundColor: 'var(--bg-surface)' }}>
        <img src={logoSrc} alt="Lumio" className="h-8 w-auto" />
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div className={`lg:hidden fixed top-0 left-0 h-screen w-72 z-50
        border-r border-emerald-900/30
        flex flex-col p-6 transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="flex items-center justify-between mb-8">
          <img src={logoSrc} alt="Lumio" className="h-8 w-auto" />
          <button
            onClick={() => setMobileOpen(false)}
            className="text-emerald-600 hover:text-emerald-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <NavLinks />
        <div className="flex items-center justify-between pt-6">
          <span style={{ color: 'var(--text-secondary)' }} className="text-xs">v1.0.0</span>
          <ThemeToggle />
        </div>
      </div>
    </>
  )
}