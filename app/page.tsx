'use client'

import { useEffect, useState } from 'react'
import { taskDB, quizDB, projectDB } from '@/lib/db'
import { dashboardGreetingPrompt } from '@/lib/prompts'
import { Sparkles, CheckSquare, Brain, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import PageTransition from '@/components/ui/PageTransition'
import { useUser } from '@clerk/nextjs'
import { SkeletonCard, SkeletonGreeting } from '@/components/ui/Skeleton'

export default function Dashboard() {
  const [greeting, setGreeting] = useState('')
  const [loadingGreeting, setLoadingGreeting] = useState(true)
  const [stats, setStats] = useState({ tasks: 0, quizzes: 0, projects: 0 })
  const { user } = useUser()
  const userId = user?.id || ''
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    Promise.all([
      taskDB.getAll(userId),
      quizDB.getAll(userId),
      projectDB.getAll(userId),
    ]).then(([tasks, quizzes, projects]) => {
      const pendingTasks = tasks.filter(t => t.status !== 'listo')
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const urgentTasks = tasks
        .filter(t => t.status !== 'listo' && new Date(t.deadline) <= tomorrow)
        .map(t => t.title)

      setStats({
        tasks: pendingTasks.length,
        quizzes: quizzes.length,
        projects: projects.filter(p => p.tasks.some(t => !t.completed)).length,
      })

      const name = user?.firstName || ''
      fetchGreeting(pendingTasks.length, urgentTasks, projects.length, name)
      setLoading(false)
    })
  }, [userId])

  const fetchGreeting = async (taskCount: number, urgentTasks: string[], projectCount: number, name?: string) => {
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: dashboardGreetingPrompt(taskCount, urgentTasks, projectCount, name)
        }),
      })
      const data = await res.json()
      setGreeting(data.result || '¡Bienvenido a Lumio! Listo para ayudarte hoy. 🌿')
    } catch {
      setGreeting('¡Bienvenido a Lumio! Listo para ayudarte hoy. 🌿')
    } finally {
      setLoadingGreeting(false)
    }
  }

  const cards = [
    {
      href: '/tasks',
      icon: CheckSquare,
      label: 'Tareas',
      value: stats.tasks,
      description: 'pendientes',
      gradient: 'from-emerald-500/20 to-teal-500/20',
      border: 'border-emerald-500/30',
      iconColor: 'text-emerald-500',
    },
    {
      href: '/quiz',
      icon: Brain,
      label: 'Quiz IA',
      value: stats.quizzes,
      description: 'exámenes realizados',
      gradient: 'from-teal-500/20 to-cyan-500/20',
      border: 'border-teal-500/30',
      iconColor: 'text-teal-500',
    },
    {
      href: '/projects',
      icon: Users,
      label: 'Proyectos',
      value: stats.projects,
      description: 'activos',
      gradient: 'from-cyan-500/20 to-emerald-500/20',
      border: 'border-cyan-500/30',
      iconColor: 'text-cyan-500',
    },
  ]

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto">
        {/* Greeting */}
        {loadingGreeting ? (
            <SkeletonGreeting />
          ) : (
            <div className="mb-10 p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
              <div className="flex items-start gap-3">
                <Sparkles className="text-emerald-500 mt-1 shrink-0" size={20} />
                <p style={{ color: 'var(--text-primary)' }} className="text-lg leading-relaxed">
                  {greeting}
                </p>
              </div>
            </div>
          )}

        {/* Title */}
        <div className="mb-8">
          <h2 style={{ color: 'var(--text-primary)' }} className="text-3xl font-bold">Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)' }} className="mt-1">
            Resumen de tu actividad académica
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : cards.map(({ href, icon: Icon, label, value, description, gradient, border, iconColor }) => (
                <Link
                  key={href}
                  href={href}
                  className={`group p-6 rounded-2xl bg-gradient-to-br ${gradient}
                    border ${border} hover:scale-[1.02] transition-all duration-200`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <Icon className={iconColor} size={24} />
                    <ArrowRight className="text-emerald-700 group-hover:text-emerald-500
                      group-hover:translate-x-1 transition-all duration-200" size={18} />
                  </div>
                  <p style={{ color: 'var(--text-primary)' }} className="text-4xl font-bold mb-1">
                    {value}
                  </p>
                  <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
                    <span className="text-emerald-500 font-medium">{label}</span> {description}
                  </p>
                </Link>
              ))
          }
        </div>
      </div>
    </PageTransition>
  )
}