import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Layout from '@/components/Layout'
import PlanningContent from '@/components/planejamento/PlanningContent'

async function getPlanningData(weddingId: string) {
  const [locations, suppliers] = await Promise.all([
    prisma.location.findMany({ where: { weddingId } }),
    prisma.supplier.findMany({ where: { weddingId }, orderBy: { createdAt: 'desc' } }),
  ])

  return { locations, suppliers }
}

export default async function PlanejamentoPage() {
  const user = await getCurrentUser()

  if (!user || !user.wedding) {
    redirect('/login')
  }

  const { locations, suppliers } = await getPlanningData(user.wedding.id)

  const supplierTypes = [
    'Buffet',
    'Decoração',
    'Fotógrafo',
    'DJ/Banda',
    'Vestido',
    'Terno',
    'Flores',
    'Bolo',
    'Convites',
    'Cerimonialista',
    'Outros',
  ]

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-serif font-bold text-wedding-800">
          Planejamento do Evento
        </h1>

        <PlanningContent
          initialLocations={locations}
          initialSuppliers={suppliers}
          supplierTypes={supplierTypes}
          weddingId={user.wedding.id}
        />
      </div>
    </Layout>
  )
}



