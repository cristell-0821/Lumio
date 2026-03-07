'use client'

import { Project } from '@/types'
import { Trash2, Users, Calendar, ChevronRight, Pencil } from 'lucide-react'
import { useState } from 'react'
import ConfirmModal from '@/components/ui/ConfirmModal'

interface Props {
  project: Project
  onClick: () => void
  onDelete: (id: string) => void
  onEdit: (project: Project) => void
}

export default function ProjectCard({ project, onClick, onDelete, onEdit }: Props) {
  const total = project.tasks.length
  const completed = project.tasks.filter(t => t.completed).length
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100)
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <>
      <div
        className="p-5 rounded-2xl border border-emerald-900/30 hover:border-emerald-500/30 transition-all duration-200 group"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 style={{ color: 'var(--text-primary)' }} className="font-semibold">
              {project.title}
            </h4>
            <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-0.5 line-clamp-2">
              {project.description}
            </p>
          </div>
          {/* Acciones */}
          <div className="flex items-center gap-1 ml-2 shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(project) }}
              className="p-1.5 rounded-lg text-emerald-700 hover:text-emerald-400
                hover:bg-emerald-500/10 transition-all"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setShowConfirm(true) }}
              className="p-1.5 rounded-lg text-emerald-800 hover:text-red-400
                hover:bg-red-500/10 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5"
            style={{ color: 'var(--text-secondary)' }}>
            <span>{completed}/{total} tareas</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-emerald-900/40">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span style={{ color: 'var(--text-secondary)' }} className="flex items-center gap-1 text-xs">
              <Users size={12} />
              {project.members.length} miembros
            </span>
            <span style={{ color: 'var(--text-secondary)' }} className="flex items-center gap-1 text-xs">
              <Calendar size={12} />
              {project.deadline}
            </span>
          </div>
          <button
            onClick={onClick}
            className="flex items-center gap-1 text-xs text-emerald-500
              hover:text-emerald-300 transition-colors font-medium"
          >
            Ver <ChevronRight size={13} />
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="¿Eliminar proyecto?"
        message={`"${project.title}" y todas sus tareas serán eliminados permanentemente.`}
        onConfirm={() => { onDelete(project.id); setShowConfirm(false) }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  )
}