import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Layout from '@/components/Layout'
import RegistryItemList from '@/components/enxoval/RegistryItemList'

async function getRegistryItems(weddingId: string) {
  return await prisma.registryItem.findMany({
    where: { weddingId },
    orderBy: { createdAt: 'desc' },
  })
}

export default async function EnxovalPage() {
  const user = await getCurrentUser()

  if (!user || !user.wedding) {
    redirect('/login')
  }

  const items = await getRegistryItems(user.wedding.id)

  const categories = [
    'Cozinha',
    'Quarto',
    'Banheiro',
    'Lavanderia',
    'Eletrônicos',
    'Sala',
    'Decoração',
    'Outros',
  ]

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-serif font-bold text-wedding-800">
            Lista de Enxoval
          </h1>
        </div>

        <RegistryItemList initialItems={items} categories={categories} weddingId={user.wedding.id} />
      </div>
    </Layout>
  )
}



