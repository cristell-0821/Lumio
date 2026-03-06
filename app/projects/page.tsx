'use client'

import { useEffect, useState } from 'react'
import { Project } from '@/types'
import { projectStorage } from '@/lib/storage'
import ProjectCard from '@/components/projects/ProjectCard'
import ProjectDetail from '@/components/projects/ProjectDetail'
import { Plus, X } from 'lucide-react'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    deadline: '',
  })

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
  }

  const handleUpdate = (updated: Project) => {
    projectStorage.update(updated)
    setProjects(projectStorage.getAll())
    setActiveProject(updated)
  }

  const handleDelete = (id: string) => {
    projectStorage.delete(id)
    setProjects(projectStorage.getAll())
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
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-emerald-50">Proyectos</h2>
          <p className="text-emerald-600 mt-1">Gestiona tus proyectos grupales</p>
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
        <div className="mb-8 p-6 rounded-2xl bg-[#111814] border border-emerald-900/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-emerald-100 font-semibold">Nuevo proyecto</h3>
            <button onClick={() => setShowForm(false)} className="text-emerald-700 hover:text-emerald-400">
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Nombre del proyecto"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="px-4 py-2.5 rounded-xl bg-[#0A0F0D] border border-emerald-900/30
                text-emerald-100 placeholder-emerald-800 text-sm
                focus:outline-none focus:border-emerald-500/50"
            />
            <input
              type="date"
              value={form.deadline}
              onChange={e => setForm({ ...form, deadline: e.target.value })}
              className="px-4 py-2.5 rounded-xl bg-[#0A0F0D] border border-emerald-900/30
                text-emerald-100 text-sm focus:outline-none focus:border-emerald-500/50"
            />
            <textarea
              placeholder="Descripción del proyecto"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="md:col-span-2 px-4 py-2.5 rounded-xl bg-[#0A0F0D] border border-emerald-900/30
                text-emerald-100 placeholder-emerald-800 text-sm resize-none
                focus:outline-none focus:border-emerald-500/50"
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
  )
}