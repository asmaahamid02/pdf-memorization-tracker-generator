import { FC, useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import jsPDF from 'jspdf'
import { Button } from '@/components/ui/button'

interface PDFPreviewProps {
  pdfDoc: jsPDF | null
  fileName: string
}

const PDFPreview: FC<PDFPreviewProps> = ({ pdfDoc, fileName }) => {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (pdfDoc) {
      const dataUrl = pdfDoc.output('datauristring')
      setPreviewUrl(dataUrl)
    } else {
      setPreviewUrl(undefined)
    }

    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [pdfDoc, previewUrl])

  const handleDownload = () => {
    if (pdfDoc) {
      pdfDoc.save(fileName)
    }
  }

  if (!previewUrl) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>PDF Preview</CardTitle>
      </CardHeader>

      <CardContent>
        <iframe
          src={previewUrl}
          className='w-full h-[600px]'
          title='PDF Preview'
        />
      </CardContent>

      <CardFooter>
        <Button
          className='w-full bg-accent text-accent-foreground hover:bg-accent/80'
          onClick={handleDownload}
        >
          Download PDF
        </Button>
      </CardFooter>
    </Card>
  )
}

export default PDFPreview
