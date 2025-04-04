import { ReactNode } from 'react'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='min-h-screen flex flex-col'>
      <header className='bg-secondary text-secondary-foreground shadow-md'>
        <div className='container mx-auto p-4'>
          <h1 className='text-3xl font-bold text-center flex justify-center items-center gap-2'>
            PDF Memorization Tracker Generator
          </h1>
        </div>
      </header>
      <div className='flex flex-col md:flex-row flex-1'>
        <main className='flex-1 p-6'>{children}</main>
      </div>
      <footer className='bg-muted border-t text-muted-foreground py-4 text-sm'>
        <div className='container mx-auto text-center px-4'>
          <p>
            PDF Memorization Tracker Generator &copy; {new Date().getFullYear()}{' '}
            by <a href='https://linktr.ee/asmaahamid02'>Asmaa Hamid</a>.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
