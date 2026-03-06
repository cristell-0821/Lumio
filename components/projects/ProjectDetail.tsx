'use client'

import { Project, ProjectTask, Member } from '@/types'
import { useState } from 'react'
import { ChevronLeft, Plus, Trash2, Check, UserPlus } from 'lucide-react'

interface Props {
  project: Project
  onBack: () => void
  onUpdate: (project: Project) => void
}

export default function ProjectDetail({ project, onBack, onUpdate }: Props) {
  const [newTask, setNewTask] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [newMember, setNewMember] = useState('')

  const handleAddMember = () => {
    if (!newMember.trim()) return
    const member: Member = { id: crypto.randomUUID(), name: newMember.trim() }
    onUpdate({ ...project, members: [...project.members, member] })
    setNewMember('')
  }

  const handleAddTask = () => {
    if (!newTask.trim()) return
    const task: ProjectTask = {
      id: crypto.randomUUID(),
      title: newTask.trim(),
      assignedTo: assignedTo,
      completed: false,
    }
    onUpdate({ ...project, tasks: [...project.tasks, task] })
    setNewTask('')
    setAssignedTo('')
  }

  const handleToggleTask = (taskId: string) => {
    const updated = project.tasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    )
    onUpdate({ ...project, tasks: updated })
  }

  const handleDeleteTask = (taskId: string) => {
    onUpdate({ ...project, tasks: project.tasks.filter(t => t.id !== taskId) })
  }

  const handleDeleteMember = (memberId: string) => {
    onUpdate({ ...project, members: project.members.filter(m => m.id !== memberId) })
  }

  const total = project.tasks.length
  const completed = project.tasks.filter(t => t.completed).length
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100)

  const getMemberName = (id: string) =>
    project.members.find(m => m.id === id)?.name ?? 'Sin asignar'

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-400 transition-colors"
        >
          <ChevronLeft size={18} />
          <span className="text-sm">Volver</span>
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-emerald-50">{project.title}</h2>
          <p className="text-emerald-600 text-sm mt-0.5">{project.description}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="p-5 rounded-2xl bg-[#111814] border border-emerald-900/30 mb-6">
        <div className="flex justify-between text-sm text-emerald-400 mb-2 font-medium">
          <span>Progreso general</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-emerald-900/40">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-emerald-700 text-xs mt-2">{completed} de {total} tareas completadas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Miembros */}
        <div className="p-5 rounded-2xl bg-[#111814] border border-emerald-900/30">
          <h3 className="text-emerald-100 font-semibold mb-4">Miembros</h3>

          <div className="flex gap-2 mb-4">
            <input
              placeholder="Nombre del miembro"
              value={newMember}
              onChange={e => setNewMember(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddMember()}
              className="flex-1 px-3 py-2 rounded-xl bg-[#0A0F0D] border border-emerald-900/30
                text-emerald-100 placeholder-emerald-800 text-sm
                focus:outline-none focus:border-emerald-500/50"
            />
            <button
              onClick={handleAddMember}
              className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400
                hover:bg-emerald-500/30 transition-colors"
            >
              <UserPlus size={16} />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {project.members.length === 0 ? (
              <p className="text-emerald-800 text-xs">Sin miembros aún</p>
            ) : (
              project.members.map(member => (
                <div key={member.id} className="flex items-center justify-between
                  px-3 py-2 rounded-lg bg-emerald-900/20">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br
                      from-emerald-500 to-teal-500 flex items-center justify-center
                      text-white text-xs font-bold">
                      {member.name[0].toUpperCase()}
                    </div>
                    <span className="text-emerald-200 text-sm">{member.name}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    className="text-emerald-800 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Agregar tarea */}
        <div className="p-5 rounded-2xl bg-[#111814] border border-emerald-900/30">
          <h3 className="text-emerald-100 font-semibold mb-4">Nueva tarea</h3>
          <div className="flex flex-col gap-3">
            <input
              placeholder="Título de la tarea"
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#0A0F0D] border border-emerald-900/30
                text-emerald-100 placeholder-emerald-800 text-sm
                focus:outline-none focus:border-emerald-500/50"
            />
            <select
              value={assignedTo}
              onChange={e => setAssignedTo(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#0A0F0D] border border-emerald-900/30
                text-emerald-100 text-sm focus:outline-none focus:border-emerald-500/50"
            >
              <option value="">Sin asignar</option>
              {project.members.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <button
              onClick={handleAddTask}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                bg-gradient-to-r from-emerald-500 to-teal-500
                text-white font-medium text-sm hover:opacity-90 transition-opacity"
            >
              <Plus size={15} />
              Agregar tarea
            </button>
          </div>
        </div>
      </div>

      {/* Lista de tareas */}
      <div className="mt-6 p-5 rounded-2xl bg-[#111814] border border-emerald-900/30">
        <h3 className="text-emerald-100 font-semibold mb-4">
          Tareas del proyecto
        </h3>
        {project.tasks.length === 0 ? (
          <p className="text-emerald-800 text-xs">Sin tareas aún, agrega una arriba 👆</p>
        ) : (
          <div className="flex flex-col gap-2">
            {project.tasks.map(task => (
              <div key={task.id} className="flex items-center justify-between
                px-4 py-3 rounded-xl bg-[#0A0F0D] border border-emerald-900/20">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center
                      transition-all duration-200 shrink-0
                      ${task.completed
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-emerald-700 hover:border-emerald-500'
                      }`}
                  >
                    {task.completed && <Check size={12} className="text-white" />}
                  </button>
                  <div>
                    <p className={`text-sm transition-all ${task.completed
                      ? 'line-through text-emerald-700'
                      : 'text-emerald-100'}`}>
                      {task.title}
                    </p>
                    <p className="text-xs text-emerald-700">{getMemberName(task.assignedTo)}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-emerald-800 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}