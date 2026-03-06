'use client'

import { Task } from '@/types'
import { Draggable } from '@hello-pangea/dnd'
import { Trash2, Calendar, BookOpen } from 'lucide-react'

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

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-4 rounded-xl border transition-all duration-200
            ${snapshot.isDragging
              ? 'bg-emerald-900/40 border-emerald-500/50 shadow-lg shadow-emerald-900/30 rotate-1'
              : 'bg-[#111814] border-emerald-900/30 hover:border-emerald-500/30'
            }`}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <p className="text-emerald-50 text-sm font-medium leading-snug">{task.title}</p>
            <button
              onClick={() => onDelete(task.id)}
              className="text-emerald-800 hover:text-red-400 transition-colors shrink-0"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityStyles[task.priority]}`}>
              {task.priority}
            </span>
            <span className="flex items-center gap-1 text-xs text-emerald-600">
              <BookOpen size={11} />
              {task.subject}
            </span>
            <span className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-400' : 'text-emerald-600'}`}>
              <Calendar size={11} />
              {task.deadline}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  )
}