'use client'

import { useEffect, useState } from 'react'
import { Project } from '@/types'
import { projectStorage } from '@/lib/storage'
import ProjectCard from '@/components/projects/ProjectCard'
import ProjectDetail from '@/components/projects/ProjectDetail'
import { Plus, X } from 'lucide-react'
import PageTransition from '@/components/ui/PageTransition'
import Toast from '@/components/ui/Toast'
import { useToast } from '@/lib/useToast'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    deadline: '',
  })
  const { toast, showToast, hideToast } = useToast()

  useEffect(() => {
    setProjects(projectStorage.getAll())
  }, [])

  const handleAdd = () => {
    if (!form.title.trim() || !form.deadline) return
    const newProject: Project = {
      id: crypto.randomUUID(),
      title: form.title,
      description: form.description,
      deadline: form.deadline,
      members: [],
      tasks: [],
      createdAt: new Date().toISOString(),
    }
    projectStorage.add(newProject)
    setProjects(projectStorage.getAll())
    setForm({ title: '', description: '', deadline: '' })
    setShowForm(false)
    showToast('¡Proyecto creado exitosamente!')
  }

  const handleUpdate = (updated: Project) => {
    projectStorage.update(updated)
    setProjects(projectStorage.getAll())
    setActiveProject(updated)
  }

  const handleDelete = (id: string) => {
    projectStorage.delete(id)
    setProjects(projectStorage.getAll())
    showToast('Proyecto eliminado.')
  }

  if (activeProject) {
    return (
      <ProjectDetail
        project={activeProject}
        onBack={() => setActiveProject(null)}
        onUpdate={handleUpdate}
      />
    )
  }

  return (
    <PageTransition>
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 style={{ color: 'var(--text-primary)' }} className="text-3xl font-bold">
            Proyectos
          </h2>
          <p style={{ color: 'var(--text-secondary)' }} className="mt-1">
            Gestiona tus proyectos grupales
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl
            bg-gradient-to-r from-emerald-500 to-teal-500
            text-white font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          Nuevo proyecto
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8 p-6 rounded-2xl border border-emerald-900/30"
          style={{ backgroundColor: 'var(--bg-surface)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ color: 'var(--text-primary)' }} className="font-semibold">
              Nuevo proyecto
            </h3>
            <button onClick={() => setShowForm(false)} className="text-emerald-700 hover:text-emerald-400">
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Nombre del proyecto"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-emerald-900/30
                text-sm focus:outline-none focus:border-emerald-500/50"
              style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}
            />
            <input
              type="date"
              value={form.deadline}
              onChange={e => setForm({ ...form, deadline: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-emerald-900/30
                text-sm focus:outline-none focus:border-emerald-500/50"
              style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}
            />
            <textarea
              placeholder="Descripción del proyecto"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="md:col-span-2 px-4 py-2.5 rounded-xl border border-emerald-900/30
                text-sm resize-none focus:outline-none focus:border-emerald-500/50"
              style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}
            />
          </div>
          <button
            onClick={handleAdd}
            className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500
              to-teal-500 text-white font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Crear proyecto
          </button>
        </div>
      )}

      {/* Projects grid */}
      {projects.length === 0 ? (
        <div className="text-center py-16 text-emerald-800">
          <p>No tienes proyectos aún.</p>
          <p className="text-xs mt-1">Crea tu primer proyecto arriba 👆</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => setActiveProject(project)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
    </PageTransition>
  )
}