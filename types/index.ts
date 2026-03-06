// ===== TASKS =====
export type Priority = 'alta' | 'media' | 'baja'
export type TaskStatus = 'pendiente' | 'en-progreso' | 'listo'

export interface Task {
  id: string
  title: string
  subject: string
  deadline: string
  priority: Priority
  status: TaskStatus
  createdAt: string
}

// ===== FLASHCARDS =====
export interface Flashcard {
  id: string
  question: string
  answer: string
}

export interface FlashcardSet {
  id: string
  title: string
  subject: string
  cards: Flashcard[]
  createdAt: string
}

// ===== PROJECTS =====
export interface Member {
  id: string
  name: string
}

export interface ProjectTask {
  id: string
  title: string
  assignedTo: string // Member id
  completed: boolean
}

export interface Project {
  id: string
  title: string
  description: string
  deadline: string
  members: Member[]
  tasks: ProjectTask[]
  createdAt: string
}