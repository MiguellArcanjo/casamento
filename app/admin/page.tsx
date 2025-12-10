import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Layout from '@/components/Layout'
import AdminContent from '@/components/admin/AdminContent'

async function getWeddingData(userId: string) {
  const wedding = await prisma.wedding.findUnique({
    where: { userId },
  })

  return wedding
}

export default async function AdminPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const wedding = await getWeddingData(user.id)

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-serif font-bold text-wedding-800">
          Configurações do Casamento
        </h1>

        <AdminContent initialWedding={wedding} userId={user.id} />
      </div>
    </Layout>
  )
}



