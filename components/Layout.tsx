import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Navbar from './Navbar'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6 pb-20">
        {children}
      </main>
    </div>
  )
}



