import { jsPDF } from 'jspdf'
import { fontStr } from '@/utils/Amiri-Bold.ts'

// Constants
export const xMargin = 20
export const yMargin = 20
const spacing = 7
const circleRadius = 2.5
const squareSideLength = 5
export const circlesStartIncrement = 15

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
    // New line
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
        currentY -= 2 //to balance the circles with the text
      }
    }

    doc.circle(currentX, currentY, circleRadius, 'S')
    currentX += isArabic ? -spacing : spacing
  }

  return currentY
}
export const drawSquares = (
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
  const squaresPerLine = Math.floor((maxWidth - spaceDecrement) / spacing)

  let currentX = x
  let currentY = y

  for (let i = 0; i < count; i++) {
    // New line
    if (i > 0 && i % squaresPerLine === 0) {
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
        currentY -= 4 //to balance the circles with the text
      }
    }

    // doc.circle(currentX, currentY, circleRadius, 'S')
    doc.rect(currentX, currentY, squareSideLength, squareSideLength, 'S')
    currentX += isArabic ? -spacing : spacing
  }

  return currentY + 2
}

export const drawLabeledSquares = (
  doc: jsPDF,
  x: number,
  y: number,
  start: number,
  end: number
) => {
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height

  let currentX = x
  let currentY = y

  // Use the widest text (end) to calculate square size
  doc.setFontSize(12)
  const YSideLength = doc.getTextWidth(`${end}`) // add padding inside square
  const XSideLength = YSideLength + 5

  for (let i = start; i <= end; i++) {
    // Wrap to next line if necessary
    if (currentX + XSideLength > pageWidth - xMargin) {
      currentX = x
      currentY += YSideLength

      // Add new page if needed
      if (currentY + YSideLength > pageHeight - yMargin) {
        currentY = moveToNewPage(doc, `${start} - ${end}`)
      }
    }

    // Draw text inside square
    doc.text(`${i}`, currentX + XSideLength / 2, currentY + YSideLength / 2, {
      align: 'center',
      baseline: 'middle',
    })

    // Draw square
    doc.rect(currentX, currentY, XSideLength, YSideLength)

    // Move to the next square position
    currentX += XSideLength
  }
}
