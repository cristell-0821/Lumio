'use client'

import { Task } from '@/types'
import { Draggable } from '@hello-pangea/dnd'
import { Trash2, Calendar, BookOpen } from 'lucide-react'
import { useState } from 'react'
import ConfirmModal from '@/components/ui/ConfirmModal'

const priorityStyles = {
  alta: 'bg-red-500/20 text-red-400 border-red-500/30',
  media: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  baja: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
}

interface Props {
  task: Task
  index: number
  onDelete: (id: string) => void
}

export default function TaskCard({ task, index, onDelete }: Props) {
  const isOverdue = new Date(task.deadline) < new Date()
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`p-4 rounded-xl border transition-all duration-200
              ${snapshot.isDragging
                ? 'border-emerald-500/50 shadow-lg shadow-emerald-900/30 rotate-1'
                : 'border-emerald-900/30 hover:border-emerald-500/30'
              }`}
            style={{
              backgroundColor: snapshot.isDragging ? 'var(--bg-main)' : 'var(--bg-surface)',
            }}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <p style={{ color: 'var(--text-primary)' }} className="text-sm font-medium leading-snug">
                {task.title}
              </p>
              <button
                onClick={() => setShowConfirm(true)}
                className="text-emerald-800 hover:text-red-400 transition-colors shrink-0"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityStyles[task.priority]}`}>
                {task.priority}
              </span>
              <span style={{ color: 'var(--text-secondary)' }} className="flex items-center gap-1 text-xs">
                <BookOpen size={11} />
                {task.subject}
              </span>
              <span className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-400' : ''}`}
                style={!isOverdue ? { color: 'var(--text-secondary)' } : {}}>
                <Calendar size={11} />
                {task.deadline}
              </span>
            </div>
          </div>
        )}
      </Draggable>

      <ConfirmModal
        isOpen={showConfirm}
        title="¿Eliminar tarea?"
        message={`"${task.title}" será eliminada permanentemente.`}
        onConfirm={() => { onDelete(task.id); setShowConfirm(false) }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  )
}