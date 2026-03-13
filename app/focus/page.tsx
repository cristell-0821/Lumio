'use client'

import { useEffect, useRef, useState } from 'react'
import PageTransition from '@/components/ui/PageTransition'
import { X } from 'lucide-react'
import { pomodoroStorage } from '@/lib/storage'

const MOTIVATIONAL_PHRASES = [
  '¡Excelente trabajo! Mereces ese descanso. 🌿',
  '¡Una sesión más completada! Vas muy bien. 💪',
  '¡Increíble foco! Sigue así. 🔥',
  '¡Lo lograste! Cada sesión te acerca a tu meta. ⭐',
  '¡Eres imparable! Tómate un respiro. 🌊',
]

export default function FocusPage() {
  const [focusMinutes, setFocusMinutes] = useState(25)
  const [breakMinutes, setBreakMinutes] = useState(5)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [seconds, setSeconds] = useState(focusMinutes * 60)
  const [sessions, setSessions] = useState(0)
  const [phrase, setPhrase] = useState('')
  const [showPhrase, setShowPhrase] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [tempFocus, setTempFocus] = useState(focusMinutes)
  const [tempBreak, setTempBreak] = useState(breakMinutes)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)

  const totalSeconds = isBreak ? breakMinutes * 60 : focusMinutes * 60
  const progress = (totalSeconds - seconds) / totalSeconds
  const radius = 120
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - progress)

  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60

  const playSound = () => {
    try {
      const ctx = new AudioContext()
      audioCtxRef.current = ctx
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      oscillator.frequency.setValueAtTime(528, ctx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5)
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5)
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 1.5)
    } catch {}
  }

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            playSound()
            if (!isBreak) {
              setSessions(s => s + 1)
              pomodoroStorage.add({ id: crypto.randomUUID(), date: new Date().toISOString() }) 
              const randomPhrase = MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)]
              setPhrase(randomPhrase)
              setShowPhrase(true)
              setTimeout(() => setShowPhrase(false), 4000)
              setIsBreak(true)
              return breakMinutes * 60
            } else {
              setIsBreak(false)
              return focusMinutes * 60
            }
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isRunning, isBreak, focusMinutes, breakMinutes])

  const handleStartStop = () => setIsRunning(!isRunning)

  const handleReset = () => {
    setIsRunning(false)
    setIsBreak(false)
    setSeconds(focusMinutes * 60)
    setShowPhrase(false)
  }

  const handleSaveSettings = () => {
    setFocusMinutes(tempFocus)
    setBreakMinutes(tempBreak)
    setSeconds(tempFocus * 60)
    setIsRunning(false)
    setIsBreak(false)
    setShowSettings(false)
  }

  const accentColor = isBreak ? '#0D9488' : '#10B981'
  const bgGlow = isBreak ? 'rgba(13,148,136,0.08)' : 'rgba(16,185,129,0.08)'

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 style={{ color: 'var(--text-primary)' }} className="text-3xl font-bold">
              Modo Focus
            </h2>
            <p style={{ color: 'var(--text-secondary)' }} className="mt-1 text-sm">
              {isBreak ? 'Tiempo de descanso ☻' : 'Tiempo de concentración ☺'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl border border-emerald-500/20 text-center"
              style={{ backgroundColor: 'var(--bg-surface)' }}>
              <p className="text-emerald-400 text-xl font-bold">{sessions}</p>
              <p style={{ color: 'var(--text-secondary)' }} className="text-xs">sesiones</p>
            </div>
            <button
              onClick={() => { setShowSettings(!showSettings); setTempFocus(focusMinutes); setTempBreak(breakMinutes) }}
              className="px-4 py-2 rounded-xl border border-emerald-900/30 text-sm
                hover:border-emerald-500/30 transition-all"
              style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-surface)' }}
            >
              ⚙ Ajustar
            </button>
          </div>
        </div>

        {/* Settings panel */}
        {showSettings && (
          <div className="mb-8 p-6 rounded-2xl border border-emerald-900/30"
            style={{ backgroundColor: 'var(--bg-surface)' }}>
            <div className="flex items-center justify-between mb-4">
                <h3 style={{ color: 'var(--text-primary)' }} className="font-semibold">
                    Personalizar tiempos
                </h3>
                <button
                    onClick={() => setShowSettings(false)}
                    className="text-emerald-700 hover:text-emerald-400 transition-colors"
                >
                    <X size={18} />
                </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label style={{ color: 'var(--text-secondary)' }} className="text-xs mb-2 block">
                  Minutos de foco
                </label>
                <input
                  type="number"
                  min={1} max={90}
                  value={tempFocus}
                  onChange={e => setTempFocus(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-emerald-900/30
                    text-sm focus:outline-none focus:border-emerald-500/50"
                  style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label style={{ color: 'var(--text-secondary)' }} className="text-xs mb-2 block">
                  Minutos de descanso
                </label>
                <input
                  type="number"
                  min={1} max={30}
                  value={tempBreak}
                  onChange={e => setTempBreak(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-emerald-900/30
                    text-sm focus:outline-none focus:border-emerald-500/50"
                  style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>
            <button
              onClick={handleSaveSettings}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500
                to-teal-500 text-white font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Guardar
            </button>
          </div>
        )}

        {/* Timer */}
        <div className="flex flex-col items-center">
          {/* SVG Ring */}
          <div className="relative mb-8" style={{ filter: `drop-shadow(0 0 30px ${bgGlow})` }}>
            <svg width="300" height="300" className="-rotate-90">
              {/* Track */}
              <circle
                cx="150" cy="150" r={radius}
                fill="none"
                stroke="rgba(16,185,129,0.1)"
                strokeWidth="8"
              />
              {/* Progress */}
              <circle
                cx="150" cy="150" r={radius}
                fill="none"
                stroke={accentColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
              />
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Breathing dot */}
              <div
                className="w-2 h-2 rounded-full mb-4"
                style={{
                  backgroundColor: accentColor,
                  animation: isRunning ? 'pulse 2s ease-in-out infinite' : 'none',
                  boxShadow: `0 0 12px ${accentColor}`,
                }}
              />
              <p
                className="text-6xl font-bold tabular-nums"
                style={{ color: 'var(--text-primary)' }}
              >
                {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
              </p>
              <p style={{ color: 'var(--text-secondary)' }} className="text-sm mt-2">
                {isBreak ? 'descanso' : 'foco'}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-2xl border border-emerald-900/30 text-sm font-medium
                hover:border-emerald-500/30 transition-all"
              style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-surface)' }}
            >
              Reiniciar
            </button>
            <button
              onClick={handleStartStop}
              className="px-10 py-3 rounded-2xl text-white font-semibold text-sm
                hover:opacity-90 transition-opacity shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, #0D9488)`,
                boxShadow: `0 4px 20px ${bgGlow}`,
              }}
            >
              {isRunning ? 'Pausar' : 'Iniciar'}
            </button>
            <button
              onClick={() => {
                setIsBreak(!isBreak)
                setSeconds(!isBreak ? breakMinutes * 60 : focusMinutes * 60)
                setIsRunning(false)
              }}
              className="px-6 py-3 rounded-2xl border border-emerald-900/30 text-sm font-medium
                hover:border-emerald-500/30 transition-all"
              style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-surface)' }}
            >
              {isBreak ? '→ Foco' : '→ Descanso'}
            </button>
          </div>

          {/* Motivational phrase */}
          <div
            className="mt-8 text-center transition-all duration-500"
            style={{ opacity: showPhrase ? 1 : 0 }}
          >
            <p className="text-emerald-400 font-medium">{phrase}</p>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}