import jsPDF from 'jspdf'
import { QuizResult } from '@/types'

interface AnswerDetail {
  question: string
  selected: string
  correct: boolean
  correctAnswer: string
  explanation: string
}

export function exportQuizToPDF(result: QuizResult, answers: AnswerDetail[]) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20

  const emerald: [number, number, number] = [16, 185, 129]
  const teal: [number, number, number] = [13, 148, 136]
  const black: [number, number, number] = [30, 30, 30]
  const gray: [number, number, number] = [100, 100, 100]
  const lightGray: [number, number, number] = [240, 240, 240]
  const white: [number, number, number] = [255, 255, 255]
  const red: [number, number, number] = [220, 60, 60]
  const yellow: [number, number, number] = [200, 150, 0]

  const scoreColor: [number, number, number] = result.score >= 15 ? emerald : result.score >= 11 ? yellow : red
  const scoreLabel = result.score >= 15 ? 'Excelente' : result.score >= 11 ? 'Aprobado' : 'Desaprobado'

  // ===== PORTADA =====
  // Fondo blanco
  doc.setFillColor(...white)
  doc.rect(0, 0, pageWidth, pageHeight, 'F')

  // Franja superior verde
  doc.setFillColor(...emerald)
  doc.rect(0, 0, pageWidth, 18, 'F')

  // Nombre app en franja
  doc.setTextColor(...white)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text('Lumio', margin, 12)

  // Título
  doc.setTextColor(...black)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('Reporte de Examen', margin, 40)

  // Tema
  doc.setTextColor(...gray)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'normal')
  const topicLines = doc.splitTextToSize(result.topic, pageWidth - margin * 2)
  doc.text(topicLines, margin, 52)

  // Línea separadora
  doc.setDrawColor(...emerald)
  doc.setLineWidth(0.5)
  doc.line(margin, 62, pageWidth - margin, 62)

  // Nota grande
  doc.setTextColor(...scoreColor)
  doc.setFontSize(72)
  doc.setFont('helvetica', 'bold')
  doc.text(`${result.score}/20`, margin, 118)

  doc.setFontSize(16)
  doc.text(scoreLabel, margin, 132)

  // Stats
  doc.setTextColor(...gray)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(`${result.correct} de ${result.total} preguntas correctas`, margin, 148)
  doc.text(`Fecha: ${new Date(result.date).toLocaleDateString('es-PE')}`, margin, 160)

  // Franja inferior
  doc.setFillColor(...emerald)
  doc.rect(0, pageHeight - 10, pageWidth, 10, 'F')
  doc.setTextColor(...white)
  doc.setFontSize(8)
  doc.text('Generado por Lumio', margin, pageHeight - 4)

  // ===== PÁGINAS DE RESPUESTAS =====
  answers.forEach((a, i) => {
    doc.addPage()

    // Fondo blanco
    doc.setFillColor(...white)
    doc.rect(0, 0, pageWidth, pageHeight, 'F')

    // Header
    doc.setFillColor(...emerald)
    doc.rect(0, 0, pageWidth, 10, 'F')
    doc.setTextColor(...white)
    doc.setFontSize(8)
    doc.text('Lumio', margin, 7)
    doc.text(`${i + 1} / ${answers.length}`, pageWidth - margin, 7, { align: 'right' })

    // Badge correcto/incorrecto
    const badgeColor: [number, number, number] = a.correct ? emerald : red
    doc.setFillColor(...badgeColor)
    doc.roundedRect(margin, 18, a.correct ? 30 : 36, 9, 2, 2, 'F')
    doc.setTextColor(...white)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    doc.text(a.correct ? 'CORRECTO' : 'INCORRECTO', margin + 3, 24)

    // Pregunta
    doc.setTextColor(...black)
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    const questionLines = doc.splitTextToSize(a.question, pageWidth - margin * 2)
    doc.text(questionLines, margin, 40)

    const afterQuestion = 40 + questionLines.length * 7

    // Tu respuesta
    doc.setFillColor(...lightGray)
    doc.roundedRect(margin, afterQuestion + 5, pageWidth - margin * 2, 22, 3, 3, 'F')
    doc.setTextColor(...gray)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('TU RESPUESTA', margin + 8, afterQuestion + 14)
    doc.setTextColor(a.correct ? emerald[0] : red[0], a.correct ? emerald[1] : red[1], a.correct ? emerald[2] : red[2])
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(a.selected, margin + 8, afterQuestion + 22)

    // Respuesta correcta (solo si falló)
    let nextY = afterQuestion + 35
    if (!a.correct) {
      doc.setFillColor(220, 255, 240)
      doc.roundedRect(margin, nextY, pageWidth - margin * 2, 22, 3, 3, 'F')
      doc.setTextColor(...gray)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text('RESPUESTA CORRECTA', margin + 8, nextY + 9)
      doc.setTextColor(...emerald)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text(a.correctAnswer, margin + 8, nextY + 17)
      nextY += 30
    }

    // Explicación
    doc.setFillColor(245, 255, 250)
    doc.roundedRect(margin, nextY + 5, pageWidth - margin * 2, 40, 3, 3, 'F')
    doc.setDrawColor(...emerald)
    doc.setLineWidth(0.3)
    doc.roundedRect(margin, nextY + 5, pageWidth - margin * 2, 40, 3, 3, 'S')
    doc.setTextColor(...teal)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text('EXPLICACIÓN', margin + 8, nextY + 14)
    doc.setTextColor(...black)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const expLines = doc.splitTextToSize(a.explanation, pageWidth - margin * 2 - 16)
    doc.text(expLines, margin + 8, nextY + 22)

    // Footer
    doc.setFillColor(...emerald)
    doc.rect(0, pageHeight - 10, pageWidth, 10, 'F')
    doc.setTextColor(...white)
    doc.setFontSize(8)
    doc.text(`Lumio · ${result.topic}`, margin, pageHeight - 4)
  })

  doc.save(`quiz_${result.topic.replace(/\s+/g, '_')}_${result.score}-20.pdf`)
}