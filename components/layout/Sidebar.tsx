'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, CheckSquare, BookOpen, Users, Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { useState } from 'react'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tasks', label: 'Tareas', icon: CheckSquare },
  { href: '/flashcards', label: 'Flashcards', icon: BookOpen },
  { href: '/projects', label: 'Proyectos', icon: Users },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold bg-gradient-to-r
          from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          Lumio
        </h1>
        <p className="text-xs text-emerald-600 mt-1">Asistente académico</p>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl
                transition-all duration-200 text-sm font-medium
                ${isActive
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-emerald-700 hover:text-emerald-400 hover:bg-emerald-500/10'
                }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="flex items-center justify-between mt-auto pt-6">
        <span className="text-xs text-emerald-700">v1.0.0</span>
        <ThemeToggle />
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64
        bg-[#111814] border-r border-emerald-900/30
        flex-col justify-between p-6 z-50">
        <NavContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50
        bg-[#111814] border-b border-emerald-900/30
        flex items-center justify-between px-5 py-4">
        <h1 className="text-xl font-bold bg-gradient-to-r
          from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          Lumio
        </h1>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div className={`lg:hidden fixed top-0 left-0 h-screen w-72 z-50
        bg-[#111814] border-r border-emerald-900/30
        flex flex-col p-6 transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold bg-gradient-to-r
            from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Lumio
          </h1>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-emerald-600 hover:text-emerald-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <NavContent />
      </div>
    </>
  )
}