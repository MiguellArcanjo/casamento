import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Layout from '@/components/Layout'
import GuestsContent from '@/components/convidados/GuestsContent'

async function getGuests(weddingId: string) {
  return await prisma.guest.findMany({
    where: { weddingId },
    orderBy: { name: 'asc' },
  })
}

export default async function ConvidadosPage() {
  const user = await getCurrentUser()

  if (!user || !user.wedding) {
    redirect('/login')
  }

  const guests = await getGuests(user.wedding.id)

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-serif font-bold text-wedding-800">
          Lista de Convidados
        </h1>

        <GuestsContent initialGuests={guests} weddingId={user.wedding.id} />
      </div>
    </Layout>
  )
}



