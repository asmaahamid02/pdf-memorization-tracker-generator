import { jsPDF } from 'jspdf'
import { fontStr } from '@/utils/Amiri-Bold.ts'

// Constants
const xMargin = 20
const yMargin = 20
const spacing = 7
const circleRadius = 2.5

// Arabic detection
export const containsArabic = (text: string): boolean =>
  /[\u0600-\u06FF]/.test(text)

// Font setup
const setupArabicFont = (doc: jsPDF) => {
  doc.addFileToVFS('Amiri-Bold.ttf', fontStr)
  doc.addFont('Amiri-Bold.ttf', 'Amiri', 'bold')
  doc.setFont('Amiri')
}

// Title Drawer
export const drawTitle = (doc: jsPDF, title: string, y = yMargin) => {
  doc.setFontSize(16)
  doc.setLineWidth(0.5)
  doc.setFont('helvetica', 'bold')

  if (containsArabic(title)) setupArabicFont(doc)

  doc.text(title, doc.internal.pageSize.width / 2, y, { align: 'center' })
  doc.line(xMargin, y + 5, doc.internal.pageSize.width - xMargin, y + 5)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(12)
  doc.setLineWidth(0.3)
}

// Thin Line Drawer
export const drawThinHorizontalLine = (
  doc: jsPDF,
  y: number,
  color = '#eee',
  width = 0.1
) => {
  const pageWidth = doc.internal.pageSize.width
  doc.setLineWidth(width)
  doc.setDrawColor(color)
  doc.line(xMargin, y, pageWidth - xMargin, y)

  // Reset to defaults
  doc.setLineWidth(0.3)
  doc.setDrawColor(0, 0, 0)
}

// Page Handler
export const moveToNewPage = (doc: jsPDF, title: string): number => {
  doc.addPage()
  drawTitle(doc, title)
  drawFooter(doc)
  return yMargin + 20
}

export const drawFooter = (doc: jsPDF) => {
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height
  doc.setFontSize(10)
  doc.setLineWidth(0.5)

  doc.text(
    `${doc.getNumberOfPages()}`,
    pageWidth - xMargin,
    pageHeight - yMargin,
    { align: 'right' }
  )
  const textWidth = doc.getTextWidth(`${doc.getNumberOfPages()}`)
  doc.line(
    xMargin,
    pageHeight - yMargin,
    pageWidth - xMargin - textWidth - 5,
    pageHeight - yMargin
  )
  doc.setFontSize(12)
  doc.setLineWidth(0.3)
}

// Circle Drawer
export const drawCircles = (
  doc: jsPDF,
  x: number,
  y: number,
  spaceDecrement: number,
  count: number,
  contextTitle: string,
  rowLabel = ''
): number => {
  const pageWidth = doc.internal.pageSize.width
  const maxWidth = pageWidth - xMargin * 2
  const isArabic = containsArabic(contextTitle)
  const circlesPerLine = Math.floor((maxWidth - spaceDecrement) / spacing)

  let currentX = x
  let currentY = y

  for (let i = 0; i < count; i++) {
    if (i > 0 && i % circlesPerLine === 0) {
      currentX = x
      currentY += spacing

      // Add new page if needed
      if (currentY > doc.internal.pageSize.height - yMargin - 10) {
        currentY = moveToNewPage(doc, contextTitle)

        doc.setFontSize(14)
        doc.text(rowLabel, isArabic ? pageWidth - xMargin : xMargin, currentY, {
          align: isArabic ? 'right' : 'left',
        })
        doc.setFontSize(12)
        currentY -= 2
      }
    }

    doc.circle(currentX, currentY, circleRadius, 'S')
    currentX += isArabic ? -spacing : spacing
  }

  return currentY
}
