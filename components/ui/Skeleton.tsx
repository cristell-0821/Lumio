export function SkeletonCard() {
  return (
    <div className="p-6 rounded-2xl border border-emerald-900/20 animate-pulse"
      style={{ backgroundColor: 'var(--bg-surface)' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-6 h-6 rounded-lg bg-emerald-900/30" />
        <div className="w-4 h-4 rounded bg-emerald-900/30" />
      </div>
      <div className="w-12 h-10 rounded-lg bg-emerald-900/30 mb-2" />
      <div className="w-24 h-3 rounded bg-emerald-900/20" />
    </div>
  )
}

export function SkeletonTask() {
  return (
    <div className="p-4 rounded-xl border border-emerald-900/20 animate-pulse"
      style={{ backgroundColor: 'var(--bg-surface)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-32 h-4 rounded bg-emerald-900/30" />
        <div className="w-12 h-5 rounded-full bg-emerald-900/20" />
      </div>
      <div className="w-20 h-3 rounded bg-emerald-900/20 mb-2" />
      <div className="w-24 h-3 rounded bg-emerald-900/20" />
    </div>
  )
}

export function SkeletonProject() {
  return (
    <div className="p-6 rounded-2xl border border-emerald-900/20 animate-pulse"
      style={{ backgroundColor: 'var(--bg-surface)' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-40 h-5 rounded bg-emerald-900/30" />
        <div className="w-16 h-6 rounded-full bg-emerald-900/20" />
      </div>
      <div className="w-full h-3 rounded bg-emerald-900/20 mb-2" />
      <div className="w-3/4 h-3 rounded bg-emerald-900/20 mb-4" />
      <div className="w-full h-2 rounded-full bg-emerald-900/20" />
    </div>
  )
}

export function SkeletonQuiz() {
  return (
    <div className="px-4 py-3 rounded-xl border border-emerald-900/20 animate-pulse"
      style={{ backgroundColor: 'var(--bg-surface)' }}>
      <div className="flex items-center justify-between">
        <div>
          <div className="w-36 h-4 rounded bg-emerald-900/30 mb-2" />
          <div className="w-28 h-3 rounded bg-emerald-900/20" />
        </div>
        <div className="w-12 h-7 rounded bg-emerald-900/30" />
      </div>
    </div>
  )
}

export function SkeletonGreeting() {
  return (
    <div className="mb-10 p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-5 h-5 rounded bg-emerald-900/30 shrink-0 mt-1" />
        <div className="flex-1">
          <div className="w-3/4 h-4 rounded bg-emerald-900/30 mb-2" />
          <div className="w-1/2 h-4 rounded bg-emerald-900/20" />
        </div>
      </div>
    </div>
  )
}