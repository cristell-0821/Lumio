'use client'

import { useEffect, useRef, useState } from 'react'
import PageTransition from '@/components/ui/PageTransition'
import { X, Timer, Coffee, Zap } from 'lucide-react'
import { pomodoroDBfunc } from '@/lib/db'
import { useUser } from '@clerk/nextjs'

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
  const { user } = useUser()
  const userId = user?.id || ''

  const totalSeconds = isBreak ? breakMinutes * 60 : focusMinutes * 60
  const progress = (totalSeconds - seconds) / totalSeconds
  const radius = 110
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - progress)
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60

  const accentColor = isBreak ? '#0D9488' : '#10B981'
  const bgGlow = isBreak ? 'rgba(13,148,136,0.12)' : 'rgba(16,185,129,0.12)'
  const accentBorder = isBreak ? 'border-teal-500/25' : 'border-emerald-500/25'
  const accentBg = isBreak ? 'from-teal-500/10 to-cyan-500/5' : 'from-emerald-500/10 to-teal-500/5'

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
              pomodoroDBfunc.add(userId)
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
  const handleReset = () => { setIsRunning(false); setIsBreak(false); setSeconds(focusMinutes * 60); setShowPhrase(false) }
  const handleSaveSettings = () => {
    setFocusMinutes(tempFocus); setBreakMinutes(tempBreak)
    setSeconds(tempFocus * 60); setIsRunning(false); setIsBreak(false); setShowSettings(false)
  }

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500
              ${isBreak ? 'bg-teal-500/15' : 'bg-emerald-500/15'}`}>
              {isBreak
                ? <Coffee size={20} className="text-teal-400" />
                : <Timer size={20} className="text-emerald-400" />
              }
            </div>
            <div>
              <h2 style={{ color: 'var(--text-primary)' }} className="text-3xl font-bold">Modo Focus</h2>
              <p style={{ color: 'var(--text-secondary)' }} className="text-sm mt-0.5 transition-all duration-500">
                {isBreak ? 'Tiempo de descanso — recarga energías' : 'Tiempo de concentración — tú puedes'}
              </p>
            </div>
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

        {/* Settings panel */}
        {showSettings && (
          <div className="mb-8 p-6 rounded-2xl border border-emerald-900/30"
            style={{ backgroundColor: 'var(--bg-surface)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ color: 'var(--text-primary)' }} className="font-semibold">Personalizar tiempos</h3>
              <button onClick={() => setShowSettings(false)} className="text-emerald-700 hover:text-emerald-400 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label style={{ color: 'var(--text-secondary)' }} className="text-xs mb-2 block">Minutos de foco</label>
                <input type="number" min={1} max={90} value={tempFocus}
                  onChange={e => setTempFocus(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-emerald-900/30 text-sm focus:outline-none focus:border-emerald-500/50"
                  style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label style={{ color: 'var(--text-secondary)' }} className="text-xs mb-2 block">Minutos de descanso</label>
                <input type="number" min={1} max={30} value={tempBreak}
                  onChange={e => setTempBreak(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-emerald-900/30 text-sm focus:outline-none focus:border-emerald-500/50"
                  style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }} />
              </div>
            </div>
            <button onClick={handleSaveSettings}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium text-sm hover:opacity-90 transition-opacity">
              Guardar
            </button>
          </div>
        )}

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

          {/* Timer */}
          <div className="flex flex-col items-center">
            <div className="relative mb-6" style={{ filter: `drop-shadow(0 0 40px ${bgGlow})` }}>
              <svg width="280" height="280" className="-rotate-90">
                <circle cx="140" cy="140" r={radius} fill="none" stroke="rgba(16,185,129,0.08)" strokeWidth="10" />
                <circle cx="140" cy="140" r={radius} fill="none" stroke={accentColor} strokeWidth="10"
                  strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                  style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-2 h-2 rounded-full mb-3"
                  style={{
                    backgroundColor: accentColor,
                    animation: isRunning ? 'pulse 2s ease-in-out infinite' : 'none',
                    boxShadow: `0 0 12px ${accentColor}`,
                  }} />
                <p className="text-6xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                  {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
                </p>
                <p style={{ color: 'var(--text-secondary)' }} className="text-sm mt-2">
                  {isBreak ? 'descanso' : 'foco'}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button onClick={handleReset}
                className="px-5 py-2.5 rounded-2xl border border-emerald-900/30 text-sm font-medium hover:border-emerald-500/30 transition-all"
                style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-surface)' }}>
                Reiniciar
              </button>
              <button onClick={handleStartStop}
                className="px-10 py-3 rounded-2xl text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg"
                style={{ background: `linear-gradient(135deg, ${accentColor}, #0D9488)`, boxShadow: `0 4px 24px ${bgGlow}` }}>
                {isRunning ? 'Pausar' : 'Iniciar'}
              </button>
              <button onClick={() => { setIsBreak(!isBreak); setSeconds(!isBreak ? breakMinutes * 60 : focusMinutes * 60); setIsRunning(false) }}
                className="px-5 py-2.5 rounded-2xl border border-emerald-900/30 text-sm font-medium hover:border-emerald-500/30 transition-all"
                style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-surface)' }}>
                {isBreak ? '→ Foco' : '→ Descanso'}
              </button>
            </div>

            {/* Phrase */}
            <div className="mt-6 text-center transition-all duration-500 h-6"
              style={{ opacity: showPhrase ? 1 : 0 }}>
              <p className="text-emerald-400 font-medium text-sm">{phrase}</p>
            </div>
          </div>

          {/* Side info */}
          <div className="flex flex-col gap-4">

            {/* Status card */}
            <div className={`p-5 rounded-2xl border bg-gradient-to-br ${accentBg} ${accentBorder} transition-all duration-500`}>
              <div className="flex items-center gap-3 mb-3">
                <Zap size={16} style={{ color: accentColor }} />
                <p className="text-sm font-medium" style={{ color: accentColor }}>
                  {isRunning ? (isBreak ? 'Descansando...' : 'En modo focus') : 'Timer pausado'}
                </p>
              </div>
              <p style={{ color: 'var(--text-secondary)' }} className="text-xs leading-relaxed">
                {isBreak
                  ? 'Aprovecha este tiempo para estirarte, hidratarte y descansar la vista.'
                  : 'Elimina distracciones y concéntrate en una sola tarea a la vez.'}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Sesiones hoy', value: sessions, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                { label: 'Min. foco', value: focusMinutes, color: 'text-teal-400', bg: 'bg-teal-500/10' },
                { label: 'Min. descanso', value: breakMinutes, color: 'text-violet-400', bg: 'bg-violet-500/10' },
              ].map(({ label, value, color, bg }) => (
                <div key={label} className={`p-3 rounded-xl ${bg} text-center`}>
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                  <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Técnica Pomodoro info */}
            <div className="p-5 rounded-2xl border border-emerald-900/20" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <p style={{ color: 'var(--text-primary)' }} className="text-sm font-medium mb-3">
                Técnica Pomodoro
              </p>
              <div className="flex flex-col gap-2.5">
                {[
                  { n: '1', text: `Trabaja ${focusMinutes} minutos sin distracciones` },
                  { n: '2', text: `Descansa ${breakMinutes} minutos al terminar` },
                  { n: '3', text: 'Cada 4 sesiones toma un descanso largo' },
                ].map(({ n, text }) => (
                  <div key={n} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-emerald-400">{n}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }} className="text-xs leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}