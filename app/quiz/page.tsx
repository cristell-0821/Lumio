'use client'

import { useState, useEffect } from 'react'
import { Question, QuizResult, AnswerDetail } from '@/types'
import { quizFromTopicPrompt, quizFromTextPrompt } from '@/lib/prompts'
import { quizDB } from '@/lib/db'
import PageTransition from '@/components/ui/PageTransition'
import { Brain, Upload, Loader2, CheckCircle, XCircle, Trophy, RotateCcw, FileText, Download } from 'lucide-react'
import Toast from '@/components/ui/Toast'
import { useToast } from '@/lib/useToast'
import { exportQuizToPDF } from '@/lib/exportQuizPDF'
import { useUser } from '@clerk/nextjs'

type Mode = 'topic' | 'pdf'
type Stage = 'setup' | 'quiz' | 'results'

export default function QuizPage() {
  const [mode, setMode] = useState<Mode>('topic')
  const [stage, setStage] = useState<Stage>('setup')
  const [input, setInput] = useState('')
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [answers, setAnswers] = useState<{ question: Question; selected: string; correct: boolean }[]>([])
  const { toast, showToast, hideToast } = useToast()
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [history, setHistory] = useState<QuizResult[]>([])
  const { user } = useUser()
  const userId = user?.id || ''

  useEffect(() => {
    if (!userId) return
    quizDB.getAll(userId).then(setHistory)
  }, [userId])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || file.type !== 'application/pdf') {
      setError('Por favor sube un archivo PDF válido.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.mjs',
        import.meta.url
      ).toString()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      let fullText = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        const pageText = content.items.map((item: any) => ('str' in item ? item.str : '')).join(' ')
        fullText += pageText + '\n'
      }
      const trimmed = fullText.trim().slice(0, 5000)
      if (!trimmed) {
        setError('No se pudo extraer texto del PDF. Prueba con otro archivo.')
        setLoading(false)
        return
      }
      setTopic(file.name.replace('.pdf', ''))
      setInput(trimmed)
    } catch (err) {
      console.log('Error PDF:', err)
      setError('Error al leer el PDF. Intenta con otro archivo.')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!input.trim()) {
      setError('Por favor ingresa un tema o sube un PDF.')
      return
    }
    if (mode === 'topic' && /^\d+$/.test(input.trim())) {
      setError('Ingresa un tema válido, no solo números.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const prompt = mode === 'topic' ? quizFromTopicPrompt(input) : quizFromTextPrompt(input)
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      const clean = data.result.replace(/```json|```/g, '').trim()
      const parsed: Question[] = JSON.parse(clean)
      setQuestions(parsed)
      setTopic(mode === 'topic' ? input : topic)
      setStage('quiz')
      setCurrent(0)
      setAnswers([])
    } catch {
      setError('No se pudo generar el quiz. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (option: string) => {
    if (answered) return
    setSelected(option)
    setAnswered(true)
  }

  const handleNext = async () => {
    if (!selected) return
    const q = questions[current]
    const isCorrect = selected === q.correctAnswer
    const newAnswers = [...answers, { question: q, selected, correct: isCorrect }]
    setAnswers(newAnswers)

    if (current + 1 >= questions.length) {
      const correct = newAnswers.filter(a => a.correct).length
      const score = Math.round((correct / questions.length) * 20)
      const result: QuizResult = {
        id: crypto.randomUUID(),
        topic,
        score,
        correct,
        total: questions.length,
        date: new Date().toISOString(),
        answers: newAnswers.map(a => ({
          question: a.question.question,
          selected: a.selected,
          correct: a.correct,
          correctAnswer: a.question.correctAnswer,
          explanation: a.question.explanation,
        })),
      }
      await quizDB.add(userId, result)
      const updated = await quizDB.getAll(userId)
      setHistory(updated)
      setQuizResult(result)
      setStage('results')
    } else {
      setCurrent(current + 1)
      setSelected(null)
      setAnswered(false)
    }
  }

  const handleRestart = () => {
    setStage('setup')
    setInput('')
    setTopic('')
    setQuestions([])
    setCurrent(0)
    setSelected(null)
    setAnswered(false)
    setAnswers([])
    setError('')
  }

  const correct = answers.filter(a => a.correct).length
  const score = questions.length > 0 ? Math.round((correct / questions.length) * 20) : 0
  const scoreColor = score >= 15 ? 'text-emerald-400' : score >= 11 ? 'text-yellow-400' : 'text-red-400'
  const scoreLabel = score >= 15 ? '¡Excelente! 🏆' : score >= 11 ? 'Aprobado 👍' : 'Desaprobado 📚'

  // ===== SETUP =====
  if (stage === 'setup') {
    return (
      <PageTransition>
        <div className="max-w-2xl mx-auto">
          <div className="mb-10">
            <h2 style={{ color: 'var(--text-primary)' }} className="text-3xl font-bold">Quiz IA</h2>
            <p style={{ color: 'var(--text-secondary)' }} className="mt-1">
              Genera un examen y obtén tu nota sobre 20
            </p>
          </div>

          <div className="flex gap-2 mb-6">
            {(['topic', 'pdf'] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setInput(''); setError('') }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${mode === m
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'border border-transparent hover:bg-emerald-500/10'
                  }`}
                style={mode !== m ? { color: 'var(--text-secondary)' } : {}}
              >
                {m === 'topic' ? <><Brain size={16} /> Por tema</> : <><FileText size={16} /> Subir PDF</>}
              </button>
            ))}
          </div>

          <div className="p-6 rounded-2xl border border-emerald-900/30 mb-4"
            style={{ backgroundColor: 'var(--bg-surface)' }}>
            {mode === 'topic' ? (
              <>
                <label style={{ color: 'var(--text-secondary)' }} className="text-xs mb-2 block">
                  Ingresa el tema del examen
                </label>
                <input
                  placeholder="Ej: Segunda Guerra Mundial, Álgebra lineal, Fotosíntesis..."
                  value={input}
                  onChange={e => { setInput(e.target.value); setError('') }}
                  className="w-full px-4 py-2.5 rounded-xl border border-emerald-900/30
                    text-sm focus:outline-none focus:border-emerald-500/50"
                  style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}
                />
              </>
            ) : (
              <>
                <label style={{ color: 'var(--text-secondary)' }} className="text-xs mb-2 block">
                  Sube tu documento PDF
                </label>
                <label className="flex flex-col items-center justify-center w-full h-32
                  rounded-xl border-2 border-dashed border-emerald-900/40 cursor-pointer
                  hover:border-emerald-500/50 transition-colors"
                  style={{ backgroundColor: 'var(--bg-main)' }}>
                  <Upload size={24} className="text-emerald-600 mb-2" />
                  <span style={{ color: 'var(--text-secondary)' }} className="text-sm">
                    {topic ? `✓ ${topic}.pdf` : 'Haz clic para subir un PDF'}
                  </span>
                  <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
                </label>
              </>
            )}
            {error && (
              <p className="text-xs text-red-400 mt-3 flex items-center gap-1">
                <span>⚠</span> {error}
              </p>
            )}
            <button
              onClick={handleGenerate}
              disabled={loading || !input.trim()}
              className="mt-4 flex items-center gap-2 px-6 py-2.5 rounded-xl
                bg-gradient-to-r from-emerald-500 to-teal-500
                text-white font-medium text-sm hover:opacity-90
                transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Brain size={16} />}
              {loading ? 'Generando examen...' : 'Generar examen'}
            </button>
          </div>

          {history.length > 0 && (
            <div className="mt-8">
              <h3 style={{ color: 'var(--text-primary)' }} className="font-semibold mb-4">
                Historial de exámenes
              </h3>
              <div className="flex flex-col gap-2">
                {history.slice(0, 5).map(r => (
                  <div key={r.id}
                    className="flex items-center justify-between px-4 py-3 rounded-xl border border-emerald-900/30"
                    style={{ backgroundColor: 'var(--bg-surface)' }}>
                    <div>
                      <p style={{ color: 'var(--text-primary)' }} className="text-sm font-medium">{r.topic}</p>
                      <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-0.5">
                        {new Date(r.date).toLocaleDateString('es-PE')} · {r.correct}/{r.total} correctas
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-lg font-bold ${r.score >= 15 ? 'text-emerald-400' : r.score >= 11 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {r.score}/20
                      </span>
                      <button
                        onClick={() => exportQuizToPDF(r, r.answers)}
                        className="p-1.5 rounded-lg hover:bg-emerald-500/10 transition-colors text-emerald-600 hover:text-emerald-400"
                        title="Descargar PDF"
                      >
                        <Download size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <Toast message={toast.message} isVisible={toast.visible} onClose={hideToast} />
      </PageTransition>
    )
  }

  // ===== QUIZ =====
  if (stage === 'quiz') {
    const q = questions[current]
    const progress = (current / questions.length) * 100
    return (
      <PageTransition>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 style={{ color: 'var(--text-primary)' }} className="text-xl font-bold">{topic}</h2>
              <p style={{ color: 'var(--text-secondary)' }} className="text-sm mt-0.5">
                Pregunta {current + 1} de {questions.length}
              </p>
            </div>
            <button onClick={handleRestart} style={{ color: 'var(--text-secondary)' }}
              className="text-xs hover:text-red-400 transition-colors">
              Cancelar
            </button>
          </div>
          <div className="h-1.5 rounded-full bg-emerald-900/30 mb-8">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
              style={{ width: `${progress}%` }} />
          </div>
          <div className="p-6 rounded-2xl border border-emerald-900/30 mb-4"
            style={{ backgroundColor: 'var(--bg-surface)' }}>
            <span className="text-xs text-emerald-500 font-medium uppercase tracking-wide">
              {q.type === 'multiple' ? 'Opción múltiple' : 'Verdadero / Falso'}
            </span>
            <p style={{ color: 'var(--text-primary)' }} className="text-lg font-medium mt-3 leading-relaxed">
              {q.question}
            </p>
          </div>
          <div className="flex flex-col gap-3 mb-6">
            {q.options.map(option => {
              let optionStyle = 'border-emerald-900/30 hover:border-emerald-500/30'
              let textColor = 'var(--text-primary)'
              if (answered) {
                if (option === q.correctAnswer) { optionStyle = 'border-emerald-500/50 bg-emerald-500/10'; textColor = '#10B981' }
                else if (option === selected && option !== q.correctAnswer) { optionStyle = 'border-red-500/50 bg-red-500/10'; textColor = '#f87171' }
              } else if (selected === option) {
                optionStyle = 'border-emerald-500/50 bg-emerald-500/10'
              }
              return (
                <button key={option} onClick={() => handleAnswer(option)} disabled={answered}
                  className={`flex items-center justify-between px-5 py-4 rounded-xl border
                    text-left transition-all duration-200 ${optionStyle} disabled:cursor-default`}
                  style={{ backgroundColor: 'var(--bg-surface)', color: textColor }}>
                  <span className="text-sm font-medium">{option}</span>
                  {answered && option === q.correctAnswer && <CheckCircle size={18} className="text-emerald-400 shrink-0" />}
                  {answered && option === selected && option !== q.correctAnswer && <XCircle size={18} className="text-red-400 shrink-0" />}
                </button>
              )
            })}
          </div>
          {answered && (
            <div className="p-4 rounded-xl border border-emerald-900/30 mb-6"
              style={{ backgroundColor: 'var(--bg-surface)' }}>
              <p className="text-xs text-emerald-500 font-medium mb-1">Explicación</p>
              <p style={{ color: 'var(--text-secondary)' }} className="text-sm leading-relaxed">
                {q.explanation}
              </p>
            </div>
          )}
          {answered && (
            <button onClick={handleNext}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500
                text-white font-medium text-sm hover:opacity-90 transition-opacity">
              {current + 1 >= questions.length ? 'Ver resultados' : 'Siguiente pregunta →'}
            </button>
          )}
        </div>
      </PageTransition>
    )
  }

  // ===== RESULTS =====
  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10 p-8 rounded-2xl border border-emerald-900/30"
          style={{ backgroundColor: 'var(--bg-surface)' }}>
          <Trophy size={40} className="text-emerald-400 mx-auto mb-4" />
          <h2 style={{ color: 'var(--text-primary)' }} className="text-2xl font-bold mb-1">{topic}</h2>
          <p className={`text-6xl font-bold my-4 ${scoreColor}`}>{score}/20</p>
          <p className={`text-lg font-medium ${scoreColor}`}>{scoreLabel}</p>
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm mt-2">
            {correct} de {questions.length} preguntas correctas
          </p>
        </div>
        <h3 style={{ color: 'var(--text-primary)' }} className="font-semibold mb-4">Revisión de respuestas</h3>
        <div className="flex flex-col gap-3 mb-8">
          {answers.map((a, i) => (
            <div key={i}
              className={`p-4 rounded-xl border ${a.correct ? 'border-emerald-500/20' : 'border-red-500/20'}`}
              style={{ backgroundColor: 'var(--bg-surface)' }}>
              <div className="flex items-start gap-3">
                {a.correct
                  ? <CheckCircle size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  : <XCircle size={18} className="text-red-400 shrink-0 mt-0.5" />}
                <div className="flex-1">
                  <p style={{ color: 'var(--text-primary)' }} className="text-sm font-medium mb-1">
                    {a.question.question}
                  </p>
                  {!a.correct && (
                    <p className="text-xs text-red-400 mb-1">Tu respuesta: {a.selected}</p>
                  )}
                  <p className="text-xs text-emerald-500">Correcta: {a.question.correctAnswer}</p>
                  <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-1">
                    {a.question.explanation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => quizResult && exportQuizToPDF(quizResult, answers.map(a => ({
            question: a.question.question,
            selected: a.selected,
            correct: a.correct,
            correctAnswer: a.question.correctAnswer,
            explanation: a.question.explanation,
          })))}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
            border border-emerald-500/30 text-emerald-400 font-medium text-sm
            hover:bg-emerald-500/10 transition-all mb-3"
        >
          <Download size={16} />
          Descargar PDF
        </button>
        <button onClick={handleRestart}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
            bg-gradient-to-r from-emerald-500 to-teal-500
            text-white font-medium text-sm hover:opacity-90 transition-opacity">
          <RotateCcw size={16} />
          Nuevo examen
        </button>
      </div>
    </PageTransition>
  )
}