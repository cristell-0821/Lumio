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

// ===== QUIZ =====
export type QuestionType = 'multiple' | 'truefalse'

export interface Question {
  id: string
  type: QuestionType
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
}

export interface QuizResult {
  id: string
  topic: string
  score: number        // sobre 20
  correct: number      // preguntas correctas
  total: number        // total preguntas
  date: string
  answers: AnswerDetail[] 
}

export interface AnswerDetail {
  question: string
  selected: string
  correct: boolean
  correctAnswer: string
  explanation: string
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

// ===== POMODORO=====
export interface PomodoroSession {
  id: string
  date: string // ISO
}