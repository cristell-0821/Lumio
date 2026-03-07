'use client'

import { Task } from '@/types'
import { Draggable } from '@hello-pangea/dnd'
import { Trash2, Calendar, BookOpen, Pencil } from 'lucide-react'

const priorityStyles = {
  alta: 'bg-red-500/20 text-red-400 border-red-500/30',
  media: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  baja: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
}

interface Props {
  task: Task
  index: number
  onDelete: (id: string) => void
  onEdit: (task: Task) => void
  onConfirmDelete: (task: Task) => void
}

export default function TaskCard({ task, index, onDelete, onEdit, onConfirmDelete }: Props) {
  const isOverdue = new Date(task.deadline) < new Date()

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-4 rounded-xl border
            ${snapshot.isDragging
              ? 'border-emerald-500/50 shadow-xl'
              : 'border-emerald-900/30 hover:border-emerald-500/30'
            }`}
          style={provided.draggableProps.style}
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <p style={{ color: 'var(--text-primary)' }} className="text-sm font-medium leading-snug">
              {task.title}
            </p>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onEdit(task)}
                className="p-1 rounded-lg text-emerald-700 hover:text-emerald-400 hover:bg-emerald-500/10"
              >
                <Pencil size={13} />
              </button>
              <button
                onClick={() => onConfirmDelete(task)}
                className="p-1 rounded-lg text-emerald-800 hover:text-red-400 hover:bg-red-500/10"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityStyles[task.priority]}`}>
              {task.priority}
            </span>
            <span style={{ color: 'var(--text-secondary)' }} className="flex items-center gap-1 text-xs">
              <BookOpen size={11} />
              {task.subject}
            </span>
            <span
              className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-400' : ''}`}
              style={!isOverdue ? { color: 'var(--text-secondary)' } : {}}
            >
              <Calendar size={11} />
              {task.deadline}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  )
}