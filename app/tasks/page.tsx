'use client'

import { useEffect, useState } from 'react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { Task, TaskStatus, Priority } from '@/types'
import { taskStorage } from '@/lib/storage'
import TaskColumn from '@/components/tasks/TaskColumn'
import { Plus, X } from 'lucide-react'

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
  }

  const handleAdd = () => {
    if (!form.title || !form.subject || !form.deadline) return

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
    setForm({ title: '', subject: '', deadline: '', priority: 'media' })
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    const updated = tasks.filter(t => t.id !== id)
    setTasks(updated)
    taskStorage.save(updated)
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-emerald-50">Tareas</h2>
          <p className="text-emerald-600 mt-1">Organiza tu carga académica</p>
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
        <div className="mb-8 p-6 rounded-2xl bg-[#111814] border border-emerald-900/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-emerald-100 font-semibold">Nueva tarea</h3>
            <button onClick={() => setShowForm(false)} className="text-emerald-700 hover:text-emerald-400">
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Título de la tarea"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="px-4 py-2.5 rounded-xl bg-[#0A0F0D] border border-emerald-900/30
                text-emerald-100 placeholder-emerald-800 text-sm
                focus:outline-none focus:border-emerald-500/50"
            />
            <input
              placeholder="Materia"
              value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
              className="px-4 py-2.5 rounded-xl bg-[#0A0F0D] border border-emerald-900/30
                text-emerald-100 placeholder-emerald-800 text-sm
                focus:outline-none focus:border-emerald-500/50"
            />
            <input
              type="date"
              value={form.deadline}
              onChange={e => setForm({ ...form, deadline: e.target.value })}
              className="px-4 py-2.5 rounded-xl bg-[#0A0F0D] border border-emerald-900/30
                text-emerald-100 text-sm focus:outline-none focus:border-emerald-500/50"
            />
            <select
              value={form.priority}
              onChange={e => setForm({ ...form, priority: e.target.value as Priority })}
              className="px-4 py-2.5 rounded-xl bg-[#0A0F0D] border border-emerald-900/30
                text-emerald-100 text-sm focus:outline-none focus:border-emerald-500/50"
            >
              <option value="alta">Alta prioridad</option>
              <option value="media">Media prioridad</option>
              <option value="baja">Baja prioridad</option>
            </select>
          </div>
          <button
            onClick={handleAdd}
            className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500
              to-teal-500 text-white font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Agregar tarea
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
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}