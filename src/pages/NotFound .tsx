import Layout from '@/components/Layout'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <Layout>
      <div className='container mx-auto text-center space-y-2'>
        <h1 className='text-3xl font-bold w-full p-4 mt-6'>Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Button asChild>
          <Link to='/'>Go Home</Link>
        </Button>
      </div>
    </Layout>
  )
}

export default NotFound
