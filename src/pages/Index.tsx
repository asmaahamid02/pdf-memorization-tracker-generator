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
import PDFPreview from '@/components/PDFPreview'
import { generatePDF } from '@/utils/PdfGenerator'

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
    startNumber: z.coerce.number().min(1).max(300), //coerce is used to convert string to number (form handle number input as string)
    lastNumber: z.coerce.number().min(1).max(300),
    isGrouped: z.boolean().default(false).optional(),
    countPerGroup: z.coerce.number().min(1),
    repetitions: z.coerce.number().min(1),
    orientation: z.enum(['portrait', 'landscape']),
  })
  .refine((data) => data.startNumber < data.lastNumber, {
    message: 'Start Number must be less than Last Number.',
    path: ['startNumber'], // Error will be associated with startNumber
  })

const Index = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      startNumber: 1,
      lastNumber: 10,
      isGrouped: false,
      countPerGroup: 1,
      repetitions: 5,
      orientation: 'portrait',
    },
  })
  const [pdfDoc, setPdfDoc] = useState<jsPDF | null>(null)

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)

    try {
      const doc = generatePDF(values)
      setPdfDoc(doc)

      toast.success('PDF generated successfully')
    } catch (e) {
      console.error('Error generating PDF:', e)
      toast('Error generating PDF')
    }
  }

  return (
    <Layout>
      <div className='container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Form */}
        <div className='w-full md:max-w-2xl'>
          <Card>
            <CardHeader>
              <CardTitle className='text-2xl'>Generate Custom PDF</CardTitle>
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
                    name='startNumber'
                    label='Start Number'
                    placeholder='Start Number'
                    type='number'
                  />
                  <FormFieldComponent
                    control={form.control}
                    name='lastNumber'
                    label='Last Number'
                    placeholder='Last Number'
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
                    name='isGrouped'
                    label='Is Grouped'
                    type='checkbox'
                  />

                  <FormFieldComponent
                    control={form.control}
                    name='countPerGroup'
                    label='Count Per Group'
                    placeholder='Count Per Group'
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
            fileName={`${form.getValues('title')}-${form.getValues(
              'startNumber'
            )}-${form.getValues('lastNumber')}.pdf`}
          />
        </div>
      </div>
    </Layout>
  )
}

export default Index
