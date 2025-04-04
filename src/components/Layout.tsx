import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation()

  const navItems = [
    { name: 'Separate Ayahs', path: '/' },
    { name: 'Grouped Ayahs', path: '/grouped-ayahs' },
    { name: 'Separate Pages', path: '/separate-pages' },
    { name: 'Grouped Pages', path: '/grouped-pages' },
  ]

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
        <nav className='bg-sidebar border-r border-sidebar-border md:w-1/4 p-4'>
          <div className='space-y-2'>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'block py-2 px-4 rounded-md transition-colors',
                  location.pathname === item.path
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/35'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

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
