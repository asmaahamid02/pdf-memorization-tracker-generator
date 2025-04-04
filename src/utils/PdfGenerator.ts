import { jsPDF } from 'jspdf'
import {
  drawTitle,
  drawCircles,
  drawThinHorizontalLine,
  moveToNewPage,
  containsArabic,
  drawFooter,
  drawSquares,
  drawLabeledSquares,
  yMargin,
  xMargin,
  circlesStartIncrement,
} from '@/utils/pdfUtils'

export interface SeparateData {
  title: string
  startNumber: number
  lastNumber: number
  repetitions: number
  orientation?: 'portrait' | 'landscape'
  shape?: 'circle' | 'square'
}

export interface GroupedData extends SeparateData {
  countPerGroup: number
}

export interface Data extends GroupedData {
  isGrouped?: boolean
}

export const generateSeparatePDF = (data: SeparateData): jsPDF => {
  const {
    title,
    startNumber,
    lastNumber,
    repetitions,
    orientation = 'portrait',
    shape = 'circle',
  } = data

  const doc = new jsPDF({ orientation, unit: 'mm' })
  const pageWidth = doc.internal.pageSize.width
  const fullTitle = `${title}: ${startNumber} - ${lastNumber}`
  const isArabic = containsArabic(fullTitle)

  drawTitle(doc, fullTitle)
  drawFooter(doc)

  let y = yMargin + 20

  for (let i = startNumber; i <= lastNumber; i++) {
    doc.setFontSize(14)
    doc.text(`${i}`, isArabic ? pageWidth - xMargin : xMargin, y, {
      align: isArabic ? 'right' : 'left',
    })

    doc.setFontSize(12)

    const circlesY =
      shape === 'circle'
        ? drawCircles(
            doc,
            isArabic
              ? pageWidth - xMargin - circlesStartIncrement
              : xMargin + circlesStartIncrement,
            y - 2,
            circlesStartIncrement,
            repetitions,
            fullTitle,
            `${i}`
          ) + 8
        : drawSquares(
            doc,
            isArabic
              ? pageWidth - xMargin - circlesStartIncrement
              : xMargin + circlesStartIncrement,
            y - 4,
            circlesStartIncrement,
            repetitions,
            fullTitle,
            `${i}`
          ) + 8

    if (i < lastNumber) {
      drawThinHorizontalLine(doc, circlesY)
    }

    y = circlesY + 10

    // Add new page if needed
    if (y > doc.internal.pageSize.height - yMargin - 10 && i < lastNumber) {
      y = moveToNewPage(doc, fullTitle)
    }
  }

  return doc
}

export const generateGroupedPDF = (data: GroupedData): jsPDF => {
  const {
    title,
    startNumber,
    lastNumber,
    countPerGroup,
    repetitions,
    orientation = 'portrait',
    shape = 'circle',
  } = data

  const doc = new jsPDF({ orientation, unit: 'mm' })
  const pageWidth = doc.internal.pageSize.width
  const fullTitle = `${title}: ${startNumber} - ${lastNumber}`
  const isArabic = containsArabic(fullTitle)
  const total = lastNumber - startNumber + 1

  drawTitle(doc, fullTitle)
  drawFooter(doc)

  const extraSpace = startNumber > 99 ? 15 : 10
  let y = yMargin + 20
  for (let i = 0; i < total; i += countPerGroup) {
    const groupStartNumber = startNumber + i
    const groupLastNumber = Math.min(
      groupStartNumber + countPerGroup - 1,
      lastNumber
    )
    const label = `${groupStartNumber} - ${groupLastNumber}`

    doc.setFontSize(14)
    doc.text(label, isArabic ? pageWidth - xMargin : xMargin, y, {
      align: isArabic ? 'right' : 'left',
    })

    doc.setFontSize(12)

    const circlesY =
      shape === 'circle'
        ? drawCircles(
            doc,
            isArabic
              ? pageWidth - xMargin - circlesStartIncrement - extraSpace
              : xMargin + circlesStartIncrement + extraSpace,
            y - 2,
            circlesStartIncrement + extraSpace,
            repetitions,
            fullTitle,
            label
          ) + 8
        : drawSquares(
            doc,
            isArabic
              ? pageWidth - xMargin - circlesStartIncrement - extraSpace
              : xMargin + circlesStartIncrement + extraSpace,
            y - 4,
            circlesStartIncrement + extraSpace,
            repetitions,
            fullTitle,
            label
          ) + 8

    if (i < total - 1) {
      drawThinHorizontalLine(doc, circlesY)
    }

    y = circlesY + 10

    // Add new page if needed
    if (y > doc.internal.pageSize.height - yMargin - 10 && i < total - 1) {
      y = moveToNewPage(doc, fullTitle)
    }
  }

  return doc
}

export const generatePDF = (data: Data): jsPDF => {
  const {
    title,
    startNumber,
    lastNumber,
    isGrouped,
    countPerGroup,
    repetitions,
    orientation = 'portrait',
    shape = 'circle',
  } = data

  const pdfData = {
    title,
    startNumber: startNumber,
    lastNumber: lastNumber,
    repetitions,
    orientation,
    shape,
  }

  if (isGrouped) {
    return generateGroupedPDF({
      ...pdfData,
      countPerGroup: countPerGroup,
    })
  }

  return generateSeparatePDF(pdfData)
}

export const generatePDFWithLabeledSquares = (data: Data): jsPDF => {
  const { title, startNumber, lastNumber, orientation = 'portrait' } = data

  const doc = new jsPDF({ orientation, unit: 'mm' })
  const fullTitle = `${title}: ${startNumber} - ${lastNumber}`

  drawTitle(doc, fullTitle)
  drawFooter(doc)

  const y = yMargin + 10

  drawLabeledSquares(doc, xMargin, y, startNumber, lastNumber)

  return doc
}
