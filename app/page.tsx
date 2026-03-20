'use client'

import { useEffect, useState } from 'react'
import { taskDB, quizDB, projectDB } from '@/lib/db'
import { Task, QuizResult, Project } from '@/types'
import { Sparkles, CheckSquare, Brain, Users, ArrowRight, Plus, Timer, ClipboardCheck } from 'lucide-react'
import Link from 'next/link'
import PageTransition from '@/components/ui/PageTransition'
import { useUser } from '@clerk/nextjs'
import { SkeletonCard, SkeletonGreeting } from '@/components/ui/Skeleton'

export default function Dashboard() {
  const [greeting, setGreeting] = useState('')
  const [loadingGreeting, setLoadingGreeting] = useState(true)
  const [stats, setStats] = useState({ tasks: 0, quizzes: 0, projects: 0, urgentTasks: 0, avgScore: 0 })
  const [recentActivity, setRecentActivity] = useState<{ title: string; meta: string; type: 'task' | 'quiz' | 'project'; priority?: string; score?: number }[]>([])
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
      const urgent = pendingTasks.filter(t => new Date(t.deadline + 'T00:00:00') <= tomorrow)
      const avgScore = quizzes.length > 0
        ? Math.round(quizzes.reduce((sum, q) => sum + q.score, 0) / quizzes.length)
        : 0

      setStats({
        tasks: pendingTasks.length,
        quizzes: quizzes.length,
        projects: projects.filter(p => p.tasks.some(t => !t.completed)).length,
        urgentTasks: urgent.length,
        avgScore,
      })

      // Actividad reciente
      const activity: typeof recentActivity = []

      // Tareas urgentes primero
      urgent.slice(0, 2).forEach(t => {
        const deadline = new Date(t.deadline + 'T00:00:00')
        const isToday = deadline.toDateString() === new Date().toDateString()
        activity.push({
          title: t.title,
          meta: isToday ? 'Hoy' : 'Mañana',
          type: 'task',
          priority: t.priority,
        })
      })

      // Último quiz
      if (quizzes.length > 0) {
        const last = quizzes[0]
        activity.push({
          title: `Quiz — ${last.topic}`,
          meta: new Date(last.date).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' }),
          type: 'quiz',
          score: last.score,
        })
      }

      setRecentActivity(activity)

      const name = user?.firstName || ''
      setGreeting(`¡Hola${name ? `, ${name}` : ''}! Bienvenido a Lumio. Listo para ayudarte hoy. 🌿`)
      setLoading(false)
      setLoadingGreeting(false)
    })
  }, [userId])

  const cards = [
    {
      href: '/tasks',
      icon: CheckSquare,
      label: 'Tareas',
      value: stats.tasks,
      description: 'pendientes',
      tag: stats.urgentTasks > 0 ? `${stats.urgentTasks} urgentes` : 'Al día ✓',
      tagColor: stats.urgentTasks > 0 ? 'bg-red-500/15 text-red-400' : 'bg-emerald-500/15 text-emerald-400',
      gradient: 'from-emerald-500/15 to-teal-500/5',
      border: 'border-emerald-500/25',
      iconBg: 'bg-emerald-500/15',
      iconColor: 'text-emerald-400',
      arrowColor: 'text-emerald-700 group-hover:text-emerald-400',
    },
    {
      href: '/quiz',
      icon: Brain,
      label: 'Quiz IA',
      value: stats.quizzes,
      description: 'exámenes realizados',
      tag: stats.avgScore > 0 ? `Prom. ${stats.avgScore}/20` : 'Sin exámenes',
      tagColor: 'bg-violet-500/15 text-violet-400',
      gradient: 'from-violet-500/15 to-purple-500/5',
      border: 'border-violet-500/25',
      iconBg: 'bg-violet-500/15',
      iconColor: 'text-violet-400',
      arrowColor: 'text-violet-700 group-hover:text-violet-400',
    },
    {
      href: '/projects',
      icon: Users,
      label: 'Proyectos',
      value: stats.projects,
      description: 'activos',
      tag: 'En progreso',
      tagColor: 'bg-teal-500/15 text-teal-400',
      gradient: 'from-teal-500/15 to-cyan-500/5',
      border: 'border-teal-500/25',
      iconBg: 'bg-teal-500/15',
      iconColor: 'text-teal-400',
      arrowColor: 'text-teal-700 group-hover:text-teal-400',
    },
  ]

  const priorityColor = (p?: string) =>
    p === 'alta' ? 'bg-red-500/15 text-red-400' :
    p === 'media' ? 'bg-amber-500/15 text-amber-400' :
    'bg-emerald-500/15 text-emerald-400'

  const activityDot = (type: string) =>
    type === 'task' ? 'bg-red-400' :
    type === 'quiz' ? 'bg-violet-400' : 'bg-teal-400'

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto">

        {/* Greeting */}
        {loadingGreeting ? <SkeletonGreeting /> : (
          <div className="mb-10 p-5 rounded-2xl border border-emerald-500/20"
            style={{ background: 'linear-gradient(135deg, rgba(6,78,59,0.3), rgba(13,79,79,0.2))' }}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Sparkles size={16} className="text-emerald-400" />
              </div>
              <p style={{ color: 'var(--text-primary)' }} className="text-base leading-relaxed pt-1">
                {greeting}
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h2 style={{ color: 'var(--text-primary)' }} className="text-3xl font-bold">Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)' }} className="mt-1 text-sm">Resumen de tu actividad académica</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : cards.map(({ href, icon: Icon, label, value, description, tag, tagColor, gradient, border, iconBg, iconColor, arrowColor }) => (
              <Link key={href} href={href}
                className={`group p-5 rounded-2xl bg-gradient-to-br ${gradient} border ${border}
                  hover:scale-[1.02] hover:border-opacity-50 transition-all duration-200`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center`}>
                    <Icon size={18} className={iconColor} />
                  </div>
                  <ArrowRight size={16} className={`${arrowColor} group-hover:translate-x-1 transition-all duration-200`} />
                </div>
                <p style={{ color: 'var(--text-primary)' }} className="text-4xl font-bold mb-1">{value}</p>
                <p style={{ color: 'var(--text-secondary)' }} className="text-xs mb-3">
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{label}</span> {description}
                </p>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${tagColor}`}>{tag}</span>
              </Link>
            ))
          }
        </div>

        {/* Quick actions */}
        <div className="mb-8">
          <p style={{ color: 'var(--text-secondary)' }} className="text-xs font-medium uppercase tracking-widest mb-3">
            Acceso rápido
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { href: '/tasks', icon: Plus, label: 'Nueva tarea', color: 'text-emerald-400', hoverBg: 'hover:bg-emerald-500/10 hover:border-emerald-500/30' },
              { href: '/focus', icon: Timer, label: 'Iniciar Focus', color: 'text-teal-400', hoverBg: 'hover:bg-teal-500/10 hover:border-teal-500/30' },
              { href: '/quiz', icon: ClipboardCheck, label: 'Generar Quiz', color: 'text-violet-400', hoverBg: 'hover:bg-violet-500/10 hover:border-violet-500/30' },
            ].map(({ href, icon: Icon, label, color, hoverBg }) => (
              <Link key={href} href={href}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border border-transparent
                  transition-all duration-200 text-sm ${hoverBg}`}
                style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                <Icon size={15} className={color} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        {recentActivity.length > 0 && (
          <div>
            <p style={{ color: 'var(--text-secondary)' }} className="text-xs font-medium uppercase tracking-widest mb-3">
              Actividad reciente
            </p>
            <div className="flex flex-col gap-2">
              {recentActivity.map((item, i) => (
                <div key={i}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-transparent transition-all"
                  style={{ backgroundColor: 'var(--bg-surface)' }}>
                  <div className={`w-2 h-2 rounded-full shrink-0 ${activityDot(item.type)}`} />
                  <p style={{ color: 'var(--text-primary)' }} className="text-sm flex-1">{item.title}</p>
                  {item.priority && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  )}
                  {item.score !== undefined && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                      ${item.score >= 15 ? 'bg-emerald-500/15 text-emerald-400' :
                        item.score >= 11 ? 'bg-amber-500/15 text-amber-400' :
                        'bg-red-500/15 text-red-400'}`}>
                      {item.score}/20
                    </span>
                  )}
                  <p style={{ color: 'var(--text-secondary)' }} className="text-xs">{item.meta}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  )
}