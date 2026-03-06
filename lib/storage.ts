import { Task, FlashcardSet, Project } from '@/types'

// ===== KEYS =====
const KEYS = {
  tasks: 'lumio_tasks',
  flashcardSets: 'lumio_flashcard_sets',
  projects: 'lumio_projects',
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

// ===== FLASHCARD SETS =====
export const flashcardStorage = {
  getAll: (): FlashcardSet[] => getItem<FlashcardSet>(KEYS.flashcardSets),
  save: (sets: FlashcardSet[]): void => setItem(KEYS.flashcardSets, sets),
  add: (set: FlashcardSet): void => {
    const sets = flashcardStorage.getAll()
    flashcardStorage.save([...sets, set])
  },
  delete: (id: string): void => {
    flashcardStorage.save(flashcardStorage.getAll().filter(s => s.id !== id))
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