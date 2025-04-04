import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import Layout from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import FormFieldComponent from '@/components/FormFieldComponent'
import { toast } from 'sonner'
import { useState } from 'react'
import jsPDF from 'jspdf'
import PDFPreview from '../components/PDFPreview'
import { generateGroupedAyahsPDF } from '@/utils/ayahPdfGenerator'

const formSchema = z
  .object({
    title: z
      .string()
      .min(3, {
        message: 'Title must be at least 3 characters.',
      })
      .max(20, {
        message: 'Title must be at most 20 characters.',
      }),
    startAyah: z.coerce.number().min(1).max(300),
    lastAyah: z.coerce.number().min(1).max(300),
    ayahsPerGroup: z.coerce.number().min(1),
    repetitions: z.coerce.number().min(1),
    orientation: z.enum(['portrait', 'landscape']),
  })
  .refine((data) => data.startAyah < data.lastAyah, {
    message: 'Start Ayah must be less than Last Ayah.',
    path: ['startAyah'], // Error will be associated with startAyah
  })

const GroupedAyahsPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      startAyah: 1,
      lastAyah: 10,
      ayahsPerGroup: 2,
      repetitions: 5,
      orientation: 'portrait',
    },
  })
  const [pdfDoc, setPdfDoc] = useState<jsPDF | null>(null)

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)

    try {
      const doc = generateGroupedAyahsPDF(values)
      setPdfDoc(doc)

      toast.success('PDF generated successfully')
    } catch (e) {
      console.error('Error generating Separate Ayahs PDF:', e)
      toast('Error generating Separate Ayahs PDF')
    }
  }

  return (
    <Layout>
      <div className='container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className='text-2xl'>
                Separate Ayahs Generator
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-8'
                >
                  <FormFieldComponent
                    control={form.control}
                    name='title'
                    label='Title'
                    placeholder='Title'
                  />
                  <FormFieldComponent
                    control={form.control}
                    name='startAyah'
                    label='Start Ayah'
                    placeholder='Start Ayah'
                    type='number'
                  />
                  <FormFieldComponent
                    control={form.control}
                    name='lastAyah'
                    label='Last Ayah'
                    placeholder='Last Ayah'
                    type='number'
                  />

                  <FormFieldComponent
                    control={form.control}
                    name='ayahsPerGroup'
                    label='Ayahs Per Group'
                    placeholder='Ayahs Per Group'
                    type='number'
                  />

                  <FormFieldComponent
                    control={form.control}
                    name='repetitions'
                    label='Repetitions'
                    placeholder='Repetitions'
                    type='number'
                  />
                  <FormFieldComponent
                    control={form.control}
                    name='orientation'
                    label='Orientation'
                    type='radio'
                    options={[
                      { value: 'portrait', label: 'Portrait' },
                      { value: 'landscape', label: 'Landscape' },
                    ]}
                  />

                  <Button type='submit'>Submit</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        {/* PDF Preview */}
        <div>
          <PDFPreview
            pdfDoc={pdfDoc}
            fileName={`separate-ayahs-${form.getValues(
              'title'
            )}-${form.getValues('startAyah')}-${form.getValues(
              'lastAyah'
            )}.pdf`}
          />
        </div>
      </div>
    </Layout>
  )
}

export default GroupedAyahsPage
