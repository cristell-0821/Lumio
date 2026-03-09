import jsPDF from 'jspdf'
import { FlashcardSet } from '@/types'

export function exportFlashcardsToPDF(set: FlashcardSet) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20

  // Colores
  const emerald = [16, 185, 129] as [number, number, number]
  const dark = [10, 15, 13] as [number, number, number]
  const gray = [100, 120, 110] as [number, number, number]

  // Portada
  doc.setFillColor(...dark)
  doc.rect(0, 0, pageWidth, pageHeight, 'F')

  doc.setFillColor(...emerald)
  doc.rect(0, 0, pageWidth, 3, 'F')

  doc.setTextColor(...emerald)
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.text('Lumio', margin, 50)

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.text(set.title, margin, 70)

  doc.setTextColor(...gray)
  doc.setFontSize(12)
  doc.text(`Materia: ${set.subject}`, margin, 85)
  doc.text(`${set.cards.length} flashcards`, margin, 95)
  doc.text(`Generado el ${new Date().toLocaleDateString('es-ES')}`, margin, 105)

  // Cards
  set.cards.forEach((card, i) => {
    doc.addPage()

    // Fondo oscuro
    doc.setFillColor(...dark)
    doc.rect(0, 0, pageWidth, pageHeight, 'F')

    // Número de card
    doc.setTextColor(...emerald)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`${i + 1} / ${set.cards.length}`, pageWidth - margin, 15, { align: 'right' })

    // Sección pregunta
    doc.setFillColor(17, 24, 20)
    doc.roundedRect(margin, 25, pageWidth - margin * 2, 90, 4, 4, 'F')

    doc.setTextColor(...emerald)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('PREGUNTA', margin + 10, 42)

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(13)
    doc.setFont('helvetica', 'normal')
    const questionLines = doc.splitTextToSize(card.question, pageWidth - margin * 2 - 20)
    doc.text(questionLines, margin + 10, 55)

    // Sección respuesta
    doc.setFillColor(13, 25, 20)
    doc.roundedRect(margin, 130, pageWidth - margin * 2, 110, 4, 4, 'F')

    doc.setTextColor(13, 148, 136)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('RESPUESTA', margin + 10, 147)

    doc.setTextColor(200, 240, 225)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    const answerLines = doc.splitTextToSize(card.answer, pageWidth - margin * 2 - 20)
    doc.text(answerLines, margin + 10, 160)

    // Footer
    doc.setTextColor(...gray)
    doc.setFontSize(8)
    doc.text(`Lumio · ${set.title}`, margin, pageHeight - 10)
  })

  doc.save(`${set.title.replace(/\s+/g, '_')}_flashcards.pdf`)
}