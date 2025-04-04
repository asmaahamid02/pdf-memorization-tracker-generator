import { jsPDF } from 'jspdf'
import {
  drawTitle,
  drawCircles,
  drawThinHorizontalLine,
  moveToNewPage,
  containsArabic,
  drawFooter,
} from './pdfUtils'

export interface SeparateAyahsData {
  title: string
  startAyah: number
  lastAyah: number
  repetitions: number
  orientation?: 'portrait' | 'landscape'
}

export interface GroupedAyahsData extends SeparateAyahsData {
  ayahsPerGroup: number
}

const xMargin = 20
const yMargin = 20
const circlesStartIncrement = 20

export const generateSeparateAyahsPDF = (data: SeparateAyahsData): jsPDF => {
  const {
    title,
    startAyah,
    lastAyah,
    repetitions,
    orientation = 'portrait',
  } = data

  const doc = new jsPDF({ orientation, unit: 'mm' })
  const pageWidth = doc.internal.pageSize.width
  const fullTitle = `${title}: ${startAyah} - ${lastAyah}`
  const isArabic = containsArabic(fullTitle)

  drawTitle(doc, fullTitle)
  drawFooter(doc)

  let y = yMargin + 20

  for (let ayah = startAyah; ayah <= lastAyah; ayah++) {
    doc.setFontSize(14)
    doc.text(`${ayah}`, isArabic ? pageWidth - xMargin : xMargin, y, {
      align: isArabic ? 'right' : 'left',
    })

    doc.setFontSize(12)

    const circlesY =
      drawCircles(
        doc,
        isArabic
          ? pageWidth - xMargin - circlesStartIncrement
          : xMargin + circlesStartIncrement,
        y - 2,
        circlesStartIncrement,
        repetitions,
        fullTitle,
        `${ayah}`
      ) + 8

    drawThinHorizontalLine(doc, circlesY)
    y = circlesY + 10

    // Add new page if needed
    if (y > doc.internal.pageSize.height - yMargin - 10 && ayah < lastAyah) {
      y = moveToNewPage(doc, fullTitle)
    }
  }

  return doc
}

export const generateGroupedAyahsPDF = (data: GroupedAyahsData): jsPDF => {
  const {
    title,
    startAyah,
    lastAyah,
    ayahsPerGroup,
    repetitions,
    orientation = 'portrait',
  } = data

  const doc = new jsPDF({ orientation, unit: 'mm' })
  const pageWidth = doc.internal.pageSize.width
  const fullTitle = `${title}: ${startAyah} - ${lastAyah}`
  const isArabic = containsArabic(fullTitle)
  const totalAyahs = lastAyah - startAyah + 1

  drawTitle(doc, fullTitle)
  drawFooter(doc)

  const extraSpace = startAyah > 99 ? 15 : 10
  let y = yMargin + 20
  for (let ayah = 0; ayah < totalAyahs; ayah += ayahsPerGroup) {
    const groupStartAyah = startAyah + ayah
    const groupLastAyah = Math.min(groupStartAyah + ayahsPerGroup - 1, lastAyah)
    const label = `${groupStartAyah} - ${groupLastAyah}`

    doc.setFontSize(14)
    doc.text(label, isArabic ? pageWidth - xMargin : xMargin, y, {
      align: isArabic ? 'right' : 'left',
    })

    doc.setFontSize(12)

    const circlesY =
      drawCircles(
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

    drawThinHorizontalLine(doc, circlesY)
    y = circlesY + 10

    // Add new page if needed
    if (
      y > doc.internal.pageSize.height - yMargin - 10 &&
      ayah < totalAyahs - 1
    ) {
      y = moveToNewPage(doc, fullTitle)
    }
  }

  return doc
}
