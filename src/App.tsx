import { Toaster } from '@/components/ui/sonner'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SeparateAyahsPage from './pages/SeparateAyahsPage'
import GroupedAyahsPage from './pages/GroupedAyahsPage '
import SeparatePagesPage from './pages/SeparatePagesPage'
import GroupedPagesPage from './pages/GroupedPagesPage'
import NotFound from './components/NotFound '

const App = () => {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path='/' index element={<SeparateAyahsPage />} />
          <Route path='/grouped-ayahs' element={<GroupedAyahsPage />} />
          <Route path='/separate-pages' element={<SeparatePagesPage />} />
          <Route path='/grouped-pages' element={<GroupedPagesPage />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
