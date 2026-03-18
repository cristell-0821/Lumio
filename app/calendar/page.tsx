'use client'

import { useEffect, useState } from 'react'
import { taskDB, projectDB, pomodoroDBfunc } from '@/lib/db'
import { Task, Project, PomodoroSession } from '@/types'
import PageTransition from '@/components/ui/PageTransition'
import { ChevronLeft, ChevronRight, CalendarDays, LayoutGrid } from 'lucide-react'
import { useUser } from '@clerk/nextjs'

type ViewMode = 'month' | 'week'

interface CalendarEvent {
  id: string
  title: string
  date: string
  type: 'task' | 'project' | 'pomodoro'
  done?: boolean
  priority?: string
}

export default function CalendarPage() {
  const [view, setView] = useState<ViewMode>('month')
  const [current, setCurrent] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const { user } = useUser()
  const userId = user?.id || ''

  useEffect(() => {
    if (!userId) return

    Promise.all([
      taskDB.getAll(userId),
      projectDB.getAll(userId),
      pomodoroDBfunc.getAll(userId),
    ]).then(([tasks, projects, sessions]) => {
      const taskEvents: CalendarEvent[] = tasks
        .filter(t => t.deadline)
        .map(t => ({
          id: t.id,
          title: t.title,
          date: t.deadline,
          type: 'task',
          done: t.status === 'listo',
          priority: t.priority,
        }))

      const projectEvents: CalendarEvent[] = projects
        .filter(p => p.deadline)
        .map(p => ({
          id: p.id,
          title: p.title,
          date: p.deadline,
          type: 'project',
          done: p.tasks.length > 0 && p.tasks.every(t => t.completed),
        }))

      const pomodoroEvents: CalendarEvent[] = sessions.map(s => ({
        id: s.id,
        title: 'Sesión Pomodoro',
        date: s.date.split('T')[0],
        type: 'pomodoro',
        done: true,
      }))

      setEvents([...taskEvents, ...projectEvents, ...pomodoroEvents])
    })
  }, [userId])

  const getEventsForDay = (dateStr: string) =>
    events.filter(e => e.date.split('T')[0] === dateStr)

  const formatDateStr = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

  const eventColor = (type: string, done?: boolean) => {
    if (done) return 'bg-emerald-500/20 text-emerald-400'
    if (type === 'task') return 'bg-yellow-500/20 text-yellow-400'
    if (type === 'project') return 'bg-teal-500/20 text-teal-400'
    if (type === 'pomodoro') return 'bg-purple-500/20 text-purple-400'
    return ''
  }

  const eventDot = (type: string, done?: boolean) => {
    if (done) return 'bg-emerald-400'
    if (type === 'task') return 'bg-yellow-400'
    if (type === 'project') return 'bg-teal-400'
    if (type === 'pomodoro') return 'bg-purple-400'
    return ''
  }

  const priorityLabel = (p?: string) =>
    p === 'alta' ? '🔴' : p === 'media' ? '🟡' : p === 'baja' ? '🟢' : ''

  const renderMonth = () => {
    const year = current.getFullYear()
    const month = current.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const today = formatDateStr(new Date())
    const days: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
    while (days.length % 7 !== 0) days.push(null)

    return (
      <div>
        <div className="grid grid-cols-7 mb-2">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
            <div key={d} className="text-center text-xs font-medium py-2"
              style={{ color: 'var(--text-secondary)' }}>
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            if (!day) return <div key={i} />
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const dayEvents = getEventsForDay(dateStr)
            const isToday = dateStr === today
            const isSelected = dateStr === selectedDay
            return (
              <button key={i}
                onClick={() => setSelectedDay(isSelected ? null : dateStr)}
                className={`relative min-h-[72px] p-1.5 rounded-xl border text-left transition-all
                  ${isSelected ? 'border-emerald-500/50' : 'border-transparent hover:border-emerald-900/30'}`}
                style={{ backgroundColor: isSelected ? 'rgba(16,185,129,0.05)' : 'var(--bg-surface)' }}>
                <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1
                  ${isToday ? 'bg-emerald-500 text-white' : ''}`}
                  style={!isToday ? { color: 'var(--text-primary)' } : {}}>
                  {day}
                </span>
                <div className="flex flex-wrap gap-0.5">
                  {dayEvents.slice(0, 3).map(e => (
                    <span key={e.id} className={`w-2 h-2 rounded-full ${eventDot(e.type, e.done)}`} />
                  ))}
                  {dayEvents.length > 3 && (
                    <span className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>
                      +{dayEvents.length - 3}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
        {selectedDay && (
          <div className="mt-4 p-4 rounded-2xl border border-emerald-900/30"
            style={{ backgroundColor: 'var(--bg-surface)' }}>
            <p style={{ color: 'var(--text-primary)' }} className="font-semibold mb-3 text-sm">
              {new Date(selectedDay + 'T12:00:00').toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            {getEventsForDay(selectedDay).length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }} className="text-sm">Sin eventos este día.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {getEventsForDay(selectedDay).map(e => (
                  <div key={e.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${eventColor(e.type, e.done)}`}>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${eventDot(e.type, e.done)}`} />
                    <span className="flex-1 font-medium">{e.title}</span>
                    {e.priority && <span>{priorityLabel(e.priority)}</span>}
                    <span className="text-xs opacity-70 capitalize">{e.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  const renderWeek = () => {
    const startOfWeek = new Date(current)
    const day = startOfWeek.getDay()
    startOfWeek.setDate(startOfWeek.getDate() - day)
    const today = formatDateStr(new Date())
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek)
      d.setDate(startOfWeek.getDate() + i)
      return d
    })
    return (
      <div className="flex flex-col gap-2">
        {weekDays.map(d => {
          const dateStr = formatDateStr(d)
          const dayEvents = getEventsForDay(dateStr)
          const isToday = dateStr === today
          return (
            <div key={dateStr}
              className={`p-4 rounded-xl border transition-all ${isToday ? 'border-emerald-500/40' : 'border-emerald-900/20'}`}
              style={{ backgroundColor: 'var(--bg-surface)' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                  ${isToday ? 'bg-emerald-500 text-white' : ''}`}
                  style={!isToday ? { color: 'var(--text-primary)' } : {}}>
                  {d.getDate()}
                </div>
                <span className="text-xs font-medium capitalize"
                  style={{ color: isToday ? 'var(--color-primary)' : 'var(--text-secondary)' }}>
                  {d.toLocaleDateString('es-PE', { weekday: 'long' })}
                </span>
                {dayEvents.length > 0 && (
                  <span className="ml-auto text-xs text-emerald-500 font-medium">
                    {dayEvents.length} evento{dayEvents.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              {dayEvents.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }} className="text-xs ml-11">Sin eventos</p>
              ) : (
                <div className="flex flex-col gap-1.5 ml-11">
                  {dayEvents.map(e => (
                    <div key={e.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${eventColor(e.type, e.done)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${eventDot(e.type, e.done)}`} />
                      <span className="flex-1 font-medium">{e.title}</span>
                      {e.priority && <span>{priorityLabel(e.priority)}</span>}
                      <span className="opacity-60 capitalize">{e.type}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  const monthName = current.toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })

  const handlePrev = () => {
    const d = new Date(current)
    if (view === 'month') d.setMonth(d.getMonth() - 1)
    else d.setDate(d.getDate() - 7)
    setCurrent(d)
    setSelectedDay(null)
  }

  const handleNext = () => {
    const d = new Date(current)
    if (view === 'month') d.setMonth(d.getMonth() + 1)
    else d.setDate(d.getDate() + 7)
    setCurrent(d)
    setSelectedDay(null)
  }

  const handleToday = () => {
    setCurrent(new Date())
    setSelectedDay(formatDateStr(new Date()))
  }

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 style={{ color: 'var(--text-primary)' }} className="text-3xl font-bold capitalize">
              {monthName}
            </h2>
            <p style={{ color: 'var(--text-secondary)' }} className="mt-1 text-sm">
              Tus deadlines y sesiones de estudio
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl border border-emerald-900/30 overflow-hidden"
              style={{ backgroundColor: 'var(--bg-surface)' }}>
              <button onClick={() => setView('month')}
                className={`p-2 transition-all ${view === 'month' ? 'bg-emerald-500/20 text-emerald-400' : ''}`}
                style={view !== 'month' ? { color: 'var(--text-secondary)' } : {}}
                title="Vista mensual">
                <LayoutGrid size={16} />
              </button>
              <button onClick={() => setView('week')}
                className={`p-2 transition-all ${view === 'week' ? 'bg-emerald-500/20 text-emerald-400' : ''}`}
                style={view !== 'week' ? { color: 'var(--text-secondary)' } : {}}
                title="Vista semanal">
                <CalendarDays size={16} />
              </button>
            </div>
            <button onClick={handlePrev}
              className="p-2 rounded-xl border border-emerald-900/30 hover:border-emerald-500/30 transition-all"
              style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-surface)' }}>
              <ChevronLeft size={16} />
            </button>
            <button onClick={handleToday}
              className="px-3 py-2 rounded-xl border border-emerald-900/30 text-xs font-medium
                hover:border-emerald-500/30 transition-all"
              style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-surface)' }}>
              Hoy
            </button>
            <button onClick={handleNext}
              className="p-2 rounded-xl border border-emerald-900/30 hover:border-emerald-500/30 transition-all"
              style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-surface)' }}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          {[
            { label: 'Tarea pendiente', color: 'bg-yellow-400' },
            { label: 'Proyecto', color: 'bg-teal-400' },
            { label: 'Completado', color: 'bg-emerald-400' },
            { label: 'Pomodoro', color: 'bg-purple-400' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${l.color}`} />
              <span style={{ color: 'var(--text-secondary)' }} className="text-xs">{l.label}</span>
            </div>
          ))}
        </div>
        {view === 'month' ? renderMonth() : renderWeek()}
      </div>
    </PageTransition>
  )
}