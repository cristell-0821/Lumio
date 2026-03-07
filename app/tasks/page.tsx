'use client'

import { useEffect, useState } from 'react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { Task, TaskStatus, Priority } from '@/types'
import { taskStorage } from '@/lib/storage'
import TaskColumn from '@/components/tasks/TaskColumn'
import { Plus, X } from 'lucide-react'
import PageTransition from '@/components/ui/PageTransition'
import Toast from '@/components/ui/Toast'
import { useToast } from '@/lib/useToast'

const COLUMNS: TaskStatus[] = ['pendiente', 'en-progreso', 'listo']

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '',
    subject: '',
    deadline: '',
    priority: 'media' as Priority,
  })
  const { toast, showToast, hideToast } = useToast()
  const [formError, setFormError] = useState('')
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  useEffect(() => {
    setTasks(taskStorage.getAll())
  }, [])

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId) return

    const updated = tasks.map(t =>
      t.id === draggableId
        ? { ...t, status: destination.droppableId as TaskStatus }
        : t
    )
    setTasks(updated)
    taskStorage.save(updated)
    showToast('¡Tarea creada exitosamente!')
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setForm({
      title: task.title,
      subject: task.subject,
      deadline: task.deadline,
      priority: task.priority,
    })
    setShowForm(true)
  }

  const handleAdd = () => {
    if (!form.title.trim() || !form.subject.trim() || !form.deadline) {
      setFormError('Por favor completa todos los campos.')
      return
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selected = new Date(form.deadline + 'T00:00:00')
    if (selected < today) {
      setFormError('La fecha no puede ser anterior a hoy.')
      return
    }

    setFormError('')
    if (editingTask) {
      const updated = tasks.map(t =>
        t.id === editingTask.id
          ? { ...t, title: form.title, subject: form.subject, deadline: form.deadline, priority: form.priority }
          : t
      )
      setTasks(updated)
      taskStorage.save(updated)
      showToast('¡Tarea actualizada!')
      setEditingTask(null)
    } else {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: form.title,
        subject: form.subject,
        deadline: form.deadline,
        priority: form.priority,
        status: 'pendiente',
        createdAt: new Date().toISOString(),
      }
      const updated = [...tasks, newTask]
      setTasks(updated)
      taskStorage.save(updated)
      showToast('¡Tarea creada exitosamente!')
    }

    setForm({ title: '', subject: '', deadline: '', priority: 'media' })
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    const updated = tasks.filter(t => t.id !== id)
    setTasks(updated)
    taskStorage.save(updated)
    showToast('Tarea eliminada.')
  }

  return (
    <PageTransition>
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 style={{ color: 'var(--text-primary)' }} className="text-3xl font-bold">Tareas</h2>
          <p style={{ color: 'var(--text-secondary)' }} className="mt-1">Organiza tu carga académica</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl
            bg-gradient-to-r from-emerald-500 to-teal-500
            text-white font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          Nueva tarea
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8 p-6 rounded-2xl border border-emerald-900/30"
          style={{ backgroundColor: 'var(--bg-surface)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ color: 'var(--text-primary)' }} className="font-semibold">{editingTask ? 'Editar tarea' : 'Nueva tarea'}</h3>
            <button onClick={() => {
              setShowForm(false)
              setEditingTask(null)
              setForm({ title: '', subject: '', deadline: '', priority: 'media' })
              setFormError('')
            }}>
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Título de la tarea"
              value={form.title}
              onChange={e => {setForm({ ...form, title: e.target.value });; setFormError('')}}
              className="px-4 py-2.5 rounded-xl border border-emerald-900/30
                text-sm focus:outline-none focus:border-emerald-500/50"
              style={{
                backgroundColor: 'var(--bg-main)',
                color: 'var(--text-primary)',
              }}
            />
            <input
              placeholder="Materia"
              value={form.subject}
              onChange={e => {setForm({ ...form, subject: e.target.value }); setFormError('') }}
              className="px-4 py-2.5 rounded-xl border border-emerald-900/30
                text-sm focus:outline-none focus:border-emerald-500/50"
              style={{
                backgroundColor: 'var(--bg-main)',
                color: 'var(--text-primary)',
              }}
            />
            <input
              type="date"
              value={form.deadline}
              min={new Date().toISOString().split('T')[0]}
              onChange={e =>{ setForm({ ...form, deadline: e.target.value }); setFormError('') }}
              className="px-4 py-2.5 rounded-xl border border-emerald-900/30
                text-sm focus:outline-none focus:border-emerald-500/50"
              style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}
            />
            <select
              value={form.priority}
              onChange={e => setForm({ ...form, priority: e.target.value as Priority })}
              className="px-4 py-2.5 rounded-xl border border-emerald-900/30
                text-sm focus:outline-none focus:border-emerald-500/50"
              style={{
                backgroundColor: 'var(--bg-main)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="alta">Alta prioridad</option>
              <option value="media">Media prioridad</option>
              <option value="baja">Baja prioridad</option>
            </select>
          </div>
          {formError && (
            <p className="mt-3 text-xs text-red-400 flex items-center gap-1">
              <span>⚠</span> {formError}
            </p>
          )}
          <button
            onClick={handleAdd}
            className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500
              to-teal-500 text-white font-medium text-sm hover:opacity-90 transition-opacity"
          >
            {editingTask ? 'Guardar cambios' : 'Agregar tarea'}
          </button>
        </div>
      )}
      {/* Kanban */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map(status => (
            <TaskColumn
              key={status}
              status={status}
              tasks={tasks.filter(t => t.status === status)}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
    <Toast message={toast.message} isVisible={toast.visible} onClose={hideToast} />
    </PageTransition>
  )
}