import { Toaster } from '@/components/ui/sonner'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NotFound from '@/pages/NotFound '
import Index from '@/pages/Index'

const App = () => {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path='/' index element={<Index />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
