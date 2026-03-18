import { supabase } from './supabase'
import { Task, Project, QuizResult, PomodoroSession } from '@/types'

// ===== TASKS =====
export const taskDB = {
  getAll: async (userId: string): Promise<Task[]> => {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return (data || []).map(t => ({
      id: t.id,
      title: t.title,
      subject: t.subject,
      deadline: t.deadline,
      priority: t.priority,
      status: t.status,
      createdAt: t.created_at,
    }))
  },

  add: async (userId: string, task: Omit<Task, 'id' | 'createdAt'>): Promise<Task | null> => {
    const { data } = await supabase
      .from('tasks')
      .insert({ ...task, user_id: userId })
      .select()
      .single()
    if (!data) return null
    return { id: data.id, title: data.title, subject: data.subject, deadline: data.deadline, priority: data.priority, status: data.status, createdAt: data.created_at }
  },

  update: async (id: string, updates: Partial<Task>): Promise<void> => {
    await supabase.from('tasks').update(updates).eq('id', id)
  },

  delete: async (id: string): Promise<void> => {
    await supabase.from('tasks').delete().eq('id', id)
  },
}

// ===== PROJECTS =====
export const projectDB = {
  getAll: async (userId: string): Promise<Project[]> => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return (data || []).map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      deadline: p.deadline,
      members: p.members,
      tasks: p.tasks,
      createdAt: p.created_at,
    }))
  },

  add: async (userId: string, project: Omit<Project, 'id' | 'createdAt'>): Promise<Project | null> => {
    const { data } = await supabase
      .from('projects')
      .insert({ ...project, user_id: userId })
      .select()
      .single()
    if (!data) return null
    return { id: data.id, title: data.title, description: data.description, deadline: data.deadline, members: data.members, tasks: data.tasks, createdAt: data.created_at }
  },

  update: async (id: string, updates: Partial<Project>): Promise<void> => {
    await supabase.from('projects').update(updates).eq('id', id)
  },

  delete: async (id: string): Promise<void> => {
    await supabase.from('projects').delete().eq('id', id)
  },
}

// ===== QUIZ RESULTS =====
export const quizDB = {
  getAll: async (userId: string): Promise<QuizResult[]> => {
    const { data } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
    return (data || []).map(r => ({
      id: r.id,
      topic: r.topic,
      score: r.score,
      correct: r.correct,
      total: r.total,
      answers: r.answers,
      date: r.date,
    }))
  },

  add: async (userId: string, result: Omit<QuizResult, 'id'>): Promise<void> => {
    await supabase.from('quiz_results').insert({ ...result, user_id: userId })
  },

  delete: async (id: string): Promise<void> => {
    await supabase.from('quiz_results').delete().eq('id', id)
  },
}

// ===== POMODORO =====
export const pomodoroDBfunc = {
  getAll: async (userId: string): Promise<PomodoroSession[]> => {
    const { data } = await supabase
      .from('pomodoro_sessions')
      .select('*')
      .eq('user_id', userId)
    return (data || []).map(s => ({ id: s.id, date: s.date }))
  },

  add: async (userId: string): Promise<void> => {
    await supabase.from('pomodoro_sessions').insert({ user_id: userId })
  },
}