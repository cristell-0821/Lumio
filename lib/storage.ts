import { Task, Project, QuizResult, PomodoroSession } from '@/types'

// ===== KEYS =====
const KEYS = {
  tasks: 'lumio_tasks',
  projects: 'lumio_projects',
  quizResults: 'lumio_quiz_results',
  pomodoroSessions: 'lumio_pomodoro_sessions',
}

// ===== HELPERS =====
function getItem<T>(key: string): T[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function setItem<T>(key: string, value: T[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

// ===== TASKS =====
export const taskStorage = {
  getAll: (): Task[] => getItem<Task>(KEYS.tasks),
  save: (tasks: Task[]): void => setItem(KEYS.tasks, tasks),
  add: (task: Task): void => {
    const tasks = taskStorage.getAll()
    taskStorage.save([...tasks, task])
  },
  update: (updated: Task): void => {
    const tasks = taskStorage.getAll().map(t => t.id === updated.id ? updated : t)
    taskStorage.save(tasks)
  },
  delete: (id: string): void => {
    taskStorage.save(taskStorage.getAll().filter(t => t.id !== id))
  },
}

// ===== QUIZ RESULTS =====
export const quizStorage = {
  getAll: (): QuizResult[] => getItem<QuizResult>(KEYS.quizResults),
  save: (results: QuizResult[]): void => setItem(KEYS.quizResults, results),
  add: (result: QuizResult): void => {
    const results = quizStorage.getAll()
    quizStorage.save([...results, result])
  },
  delete: (id: string): void => {
    quizStorage.save(quizStorage.getAll().filter(r => r.id !== id))
  },
}

// ===== PROJECTS =====
export const projectStorage = {
  getAll: (): Project[] => getItem<Project>(KEYS.projects),
  save: (projects: Project[]): void => setItem(KEYS.projects, projects),
  add: (project: Project): void => {
    const projects = projectStorage.getAll()
    projectStorage.save([...projects, project])
  },
  update: (updated: Project): void => {
    const projects = projectStorage.getAll().map(p => p.id === updated.id ? updated : p)
    projectStorage.save(projects)
  },
  delete: (id: string): void => {
    projectStorage.save(projectStorage.getAll().filter(p => p.id !== id))
  },
}

// ===== POMODORO =====
export const pomodoroStorage = {
  getAll: (): PomodoroSession[] => getItem<PomodoroSession>(KEYS.pomodoroSessions),
  add: (session: PomodoroSession): void => {
    const sessions = pomodoroStorage.getAll()
    pomodoroStorage.save([...sessions, session])
  },
  save: (sessions: PomodoroSession[]): void => setItem(KEYS.pomodoroSessions, sessions),
}