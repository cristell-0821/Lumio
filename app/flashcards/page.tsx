'use client'

import { useEffect, useState } from 'react'
import { Flashcard, FlashcardSet } from '@/types'
import { flashcardStorage } from '@/lib/storage'
import FlashCard from '@/components/flashcards/FlashCard'
import FlashcardGenerator from '@/components/flashcards/FlashcardGenerator'
import { Plus, Trash2, ChevronLeft } from 'lucide-react'
import PageTransition from '@/components/ui/PageTransition'
import ConfirmModal from '@/components/ui/ConfirmModal'

export default function FlashcardsPage() {
  const [sets, setSets] = useState<FlashcardSet[]>([])
  const [activeSet, setActiveSet] = useState<FlashcardSet | null>(null)
  const [pendingCards, setPendingCards] = useState<Flashcard[]>([])
  const [setName, setSetName] = useState('')
  const [setSubject, setSetSubject] = useState('')
  const [showSaveForm, setShowSaveForm] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  useEffect(() => {
    setSets(flashcardStorage.getAll())
  }, [])

  const handleGenerated = (cards: Flashcard[]) => {
    setPendingCards(cards)
    setShowSaveForm(true)
  }

  const handleSaveSet = () => {
    if (!setName.trim() || !setSubject.trim() || pendingCards.length === 0) return
    const newSet: FlashcardSet = {
      id: crypto.randomUUID(),
      title: setName,
      subject: setSubject,
      cards: pendingCards,
      createdAt: new Date().toISOString(),
    }
    flashcardStorage.add(newSet)
    setSets(flashcardStorage.getAll())
    setPendingCards([])
    setSetName('')
    setSetSubject('')
    setShowSaveForm(false)
  }

  const handleDeleteSet = (id: string) => {
    flashcardStorage.delete(id)
    setSets(flashcardStorage.getAll())
    if (activeSet?.id === id) setActiveSet(null)
  }

  if (activeSet) {
    return (
      <PageTransition>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setActiveSet(null)}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-400 transition-colors"
          >
            <ChevronLeft size={18} />
            <span className="text-sm">Volver</span>
          </button>
          <div>
            <h2 style={{ color: 'var(--text-primary)' }} className="text-2xl font-bold">
              {activeSet.title}
            </h2>
            <p className="text-emerald-600 text-sm mt-0.5">
              {activeSet.subject} · {activeSet.cards.length} tarjetas
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeSet.cards.map(card => (
            <FlashCard key={card.id} card={card} />
          ))}
        </div>

        <p className="text-center text-emerald-700 text-xs mt-6">
          Haz clic en cada tarjeta para voltearla
        </p>
      </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 style={{ color: 'var(--text-primary)' }} className="text-3xl font-bold">Flashcards</h2>
        <p style={{ color: 'var(--text-secondary)' }} className="mt-1">
          Genera y estudia con tarjetas inteligentes
        </p>
      </div>

      {/* Generator */}
      <div className="mb-8">
        <FlashcardGenerator onGenerated={handleGenerated} />
      </div>

      {/* Preview */}
      {pendingCards.length > 0 && (
        <div className="mb-8 p-6 rounded-2xl border border-teal-500/20"
          style={{ backgroundColor: 'var(--bg-surface)' }}>
          <h3 style={{ color: 'var(--text-primary)' }} className="font-semibold mb-4">
            Vista previa — {pendingCards.length} tarjetas generadas
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {pendingCards.map(card => (
              <FlashCard key={card.id} card={card} />
            ))}
          </div>

          {showSaveForm && (
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                placeholder="Nombre del set"
                value={setName}
                onChange={e => setSetName(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-emerald-900/30
                  text-sm focus:outline-none focus:border-emerald-500/50"
                style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}
              />
              <input
                placeholder="Materia"
                value={setSubject}
                onChange={e => setSetSubject(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-emerald-900/30
                  text-sm focus:outline-none focus:border-emerald-500/50"
                style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}
              />
              <button
                onClick={handleSaveSet}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                  bg-gradient-to-r from-emerald-500 to-teal-500
                  text-white font-medium text-sm hover:opacity-90 transition-opacity"
              >
                <Plus size={16} />
                Guardar set
              </button>
            </div>
          )}
        </div>
      )}

      {/* Sets guardados */}
      <div>
        <h3 style={{ color: 'var(--text-primary)' }} className="font-semibold mb-4">
          Sets guardados
        </h3>
        {sets.length === 0 ? (
          <div className="text-center py-12 text-emerald-800">
            <p>Aún no tienes sets guardados.</p>
            <p className="text-xs mt-1">Genera tu primer set con la IA 👆</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sets.map(set => (
              <div
                key={set.id}
                className="group p-5 rounded-2xl border border-emerald-900/30
                  hover:border-emerald-500/30 transition-all duration-200"
                style={{ backgroundColor: 'var(--bg-surface)' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 style={{ color: 'var(--text-primary)' }} className="font-medium">
                      {set.title}
                    </h4>
                    <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-0.5">
                      {set.subject} · {set.cards.length} tarjetas
                    </p>
                  </div>
                  <button
                    onClick={() => setConfirmDelete(set.id)}
                    className="text-emerald-800 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <button
                  onClick={() => setActiveSet(set)}
                  className="text-xs text-emerald-500 hover:text-emerald-300 transition-colors font-medium"
                >
                  Estudiar →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <ConfirmModal
        isOpen={!!confirmDelete}
        title="¿Eliminar set?"
        message="Este set y todas sus flashcards serán eliminados permanentemente."
        onConfirm={() => { handleDeleteSet(confirmDelete!); setConfirmDelete(null) }}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
    </PageTransition>
  )
}