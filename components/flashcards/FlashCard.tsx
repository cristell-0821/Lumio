'use client'

import { Flashcard } from '@/types'
import { useState } from 'react'

interface Props {
  card: Flashcard
}

export default function FlashCard({ card }: Props) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="cursor-pointer h-48"
      style={{ perspective: '1000px' }}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl border border-emerald-500/30
            bg-gradient-to-br from-emerald-500/10 to-teal-500/10
            flex items-center justify-center p-6"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <p style={{ color: 'var(--text-primary)' }} className="text-center font-medium">
            {card.question}
          </p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl border border-teal-500/30
            bg-gradient-to-br from-teal-500/10 to-cyan-500/10
            flex items-center justify-center p-6"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <p style={{ color: 'var(--text-primary)' }} className="text-center text-sm leading-relaxed">
            {card.answer}
          </p>
        </div>
      </div>
    </div>
  )
}