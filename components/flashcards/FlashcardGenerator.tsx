'use client'

import { useState } from 'react'
import { Flashcard } from '@/types'
import { flashcardsFromTopicPrompt, flashcardsFromTextPrompt } from '@/lib/prompts'
import { Sparkles, Loader2 } from 'lucide-react'

interface Props {
  onGenerated: (cards: Flashcard[]) => void
}

type Mode = 'topic' | 'text'

export default function FlashcardGenerator({ onGenerated }: Props) {
  const [mode, setMode] = useState<Mode>('topic')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!input.trim()) return
    setLoading(true)
    setError('')

    try {
      const prompt = mode === 'topic'
        ? flashcardsFromTopicPrompt(input)
        : flashcardsFromTextPrompt(input)

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      const data = await res.json()
      const clean = data.result.replace(/```json|```/g, '').trim()
      const cards: Flashcard[] = JSON.parse(clean).map((c: Flashcard) => ({
        ...c,
        id: crypto.randomUUID(),
      }))

      onGenerated(cards)
      setInput('')
    } catch {
      setError('No se pudo generar las flashcards. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 rounded-2xl bg-[#111814] border border-emerald-900/30">
      <h3 className="text-emerald-100 font-semibold mb-4">Generar con IA</h3>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-4">
        {(['topic', 'text'] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setInput('') }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all
              ${mode === m
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-emerald-700 hover:text-emerald-400'
              }`}
          >
            {m === 'topic' ? 'Por tema' : 'Por texto'}
          </button>
        ))}
      </div>

      {/* Input */}
      {mode === 'topic' ? (
        <input
          placeholder="Ej: Derivadas, Segunda Guerra Mundial, Fotosíntesis..."
          value={input}
          onChange={e => setInput(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-[#0A0F0D] border border-emerald-900/30
            text-emerald-100 placeholder-emerald-800 text-sm mb-4
            focus:outline-none focus:border-emerald-500/50"
        />
      ) : (
        <textarea
          placeholder="Pega aquí tus apuntes o texto para resumir en flashcards..."
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={5}
          className="w-full px-4 py-2.5 rounded-xl bg-[#0A0F0D] border border-emerald-900/30
            text-emerald-100 placeholder-emerald-800 text-sm mb-4 resize-none
            focus:outline-none focus:border-emerald-500/50"
        />
      )}

      {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

      <button
        onClick={handleGenerate}
        disabled={loading || !input.trim()}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl
          bg-gradient-to-r from-emerald-500 to-teal-500
          text-white font-medium text-sm hover:opacity-90
          transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
        {loading ? 'Generando...' : 'Generar flashcards'}
      </button>
    </div>
  )
}