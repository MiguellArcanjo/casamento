import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Layout from '@/components/Layout'
import TasksContent from '@/components/tarefas/TasksContent'

async function getTasks(weddingId: string) {
  return await prisma.task.findMany({
    where: { weddingId },
    orderBy: [
      { deadline: 'asc' },
      { priority: 'desc' },
    ],
  })
}

const stages = [
  { value: 'MESES_12_9', label: '12-9 meses antes' },
  { value: 'MESES_9_6', label: '9-6 meses antes' },
  { value: 'MESES_6_3', label: '6-3 meses antes' },
  { value: 'MESES_3_1', label: '3-1 mês antes' },
  { value: 'SEMANA_CASAMENTO', label: 'Semana do casamento' },
  { value: 'DIA_CASAMENTO', label: 'Dia do casamento' },
]

export default async function TarefasPage() {
  const user = await getCurrentUser()

  if (!user || !user.wedding) {
    redirect('/login')
  }

  const tasks = await getTasks(user.wedding.id)

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-serif font-bold text-wedding-800">
          Tarefas do Casamento
        </h1>

        <TasksContent initialTasks={tasks} stages={stages} weddingId={user.wedding.id} />
      </div>
    </Layout>
  )
}



