'use client'

import { Task, TaskStatus } from '@/types'
import { Droppable } from '@hello-pangea/dnd'
import TaskCard from './TaskCard'

const columnStyles: Record<TaskStatus, { label: string; border: string; badge: string }> = {
  'pendiente': {
    label: 'Pendiente',
    border: 'border-yellow-500/20',
    badge: 'bg-yellow-500/20 text-yellow-400',
  },
  'en-progreso': {
    label: 'En Progreso',
    border: 'border-blue-500/20',
    badge: 'bg-blue-500/20 text-blue-400',
  },
  'listo': {
    label: 'Listo',
    border: 'border-emerald-500/20',
    badge: 'bg-emerald-500/20 text-emerald-400',
  },
}

interface Props {
  status: TaskStatus
  tasks: Task[]
  onDelete: (id: string) => void
}

export default function TaskColumn({ status, tasks, onDelete }: Props) {
  const style = columnStyles[status]

  return (
    <div
      className={`flex flex-col rounded-2xl border ${style.border} p-4 min-h-[500px]`}
      style={{ backgroundColor: 'var(--bg-surface)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 style={{ color: 'var(--text-primary)' }} className="font-semibold text-sm">
          {style.label}
        </h3>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${style.badge}`}>
          {tasks.length}
        </span>
      </div>

      {/* Cards */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col gap-3 flex-1 rounded-xl transition-colors duration-200 p-1
              ${snapshot.isDraggingOver ? 'bg-emerald-500/5' : ''}`}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onDelete={onDelete}
              />
            ))}
            {provided.placeholder}

            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex-1 flex items-center justify-center">
                <p style={{ color: 'var(--text-secondary)' }} className="text-xs">
                  Sin tareas aquí
                </p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}