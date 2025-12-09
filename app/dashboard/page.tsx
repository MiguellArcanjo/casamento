import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Layout from '@/components/Layout'
import CountdownTimer from '@/components/CountdownTimer'
import { differenceInDays, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, CheckCircle, DollarSign, Users, AlertCircle, TrendingUp, LucideIcon } from 'lucide-react'

async function getDashboardData(weddingId: string) {
  const [
    tasks,
    expenses,
    deposits,
    guests,
    registryItems,
  ] = await Promise.all([
    prisma.task.findMany({ where: { weddingId } }),
    prisma.expense.findMany({ where: { weddingId } }),
    prisma.deposit.findMany({ where: { weddingId } }),
    prisma.guest.findMany({ where: { weddingId } }),
    prisma.registryItem.findMany({ where: { weddingId } }),
  ])

  const completedTasks = tasks.filter(t => t.completed).length
  const taskProgress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0

  const totalDeposits = deposits.reduce((sum, d) => sum + d.amount, 0)
  
  const wedding = await prisma.wedding.findUnique({
    where: { id: weddingId },
  })

  const financialGoal = wedding?.financialGoal || 0
  const financialProgress = financialGoal > 0 ? (totalDeposits / financialGoal) * 100 : 0

  const confirmedGuests = guests.filter(g => g.status === 'CONFIRMOU').length
  const totalGuests = guests.reduce((sum, g) => sum + 1 + g.companions, 0)

  const purchasedItems = registryItems.filter(i => i.status === 'COMPRADO').length
  const registryProgress = registryItems.length > 0 ? (purchasedItems / registryItems.length) * 100 : 0

  const upcomingTasks = tasks
    .filter(t => !t.completed)
    .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
    .slice(0, 5)

  return {
    taskProgress,
    completedTasks,
    totalTasks: tasks.length,
    financialProgress,
    totalDeposits,
    financialGoal,
    confirmedGuests,
    totalGuests,
    registryProgress,
    purchasedItems,
    totalItems: registryItems.length,
    upcomingTasks,
    wedding,
  }
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  if (!user.wedding) {
    redirect('/admin')
  }

  const data = await getDashboardData(user.wedding.id)
  const { wedding } = data

  if (!wedding) {
    redirect('/admin')
  }

  const daysUntilWedding = differenceInDays(new Date(wedding.weddingDate), new Date())
  const weddingDateFormatted = format(new Date(wedding.weddingDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })

  return (
    <Layout>
      <div className="space-y-6">
        {/* Banner com Data do Casamento */}
        <div className="bg-gradient-to-r from-wedding-500 to-rose-500 text-white rounded-2xl p-6 md:p-8 shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">
              {wedding.coupleName}
            </h1>
            <div className="flex items-center justify-center space-x-2 text-lg md:text-xl mb-6">
              <Calendar size={20} />
              <span>{weddingDateFormatted}</span>
            </div>
            {daysUntilWedding >= 0 ? (
              <div className="mt-6">
                <CountdownTimer targetDate={new Date(wedding.weddingDate)} />
              </div>
            ) : (
              <div className="mt-4 text-2xl md:text-3xl font-bold animate-pulse">
                Casados há {Math.abs(daysUntilWedding)} {Math.abs(daysUntilWedding) === 1 ? 'dia' : 'dias'}! 💕
              </div>
            )}
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Tarefas"
            value={`${data.completedTasks}/${data.totalTasks}`}
            progress={data.taskProgress}
            icon={CheckCircle}
            color="wedding"
          />
          <StatCard
            title="Financeiro"
            value={`${data.wedding?.currency || 'R$'} ${data.totalDeposits.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            progress={data.financialProgress}
            icon={DollarSign}
            color="rose"
            subtitle={`Meta: ${data.wedding?.currency || 'R$'} ${data.financialGoal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          />
          <StatCard
            title="Convidados"
            value={`${data.confirmedGuests}/${data.totalGuests}`}
            progress={data.totalGuests > 0 ? (data.confirmedGuests / data.totalGuests) * 100 : 0}
            icon={Users}
            color="wedding"
          />
          <StatCard
            title="Enxoval"
            value={`${data.purchasedItems}/${data.totalItems}`}
            progress={data.registryProgress}
            icon={TrendingUp}
            color="rose"
          />
        </div>

        {/* Próximas Tarefas */}
        {data.upcomingTasks.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <AlertCircle size={24} className="text-wedding-600" />
              <span>Próximas Tarefas</span>
            </h2>
            <div className="space-y-3">
              {data.upcomingTasks.map((task) => {
                const daysUntil = differenceInDays(new Date(task.deadline), new Date())
                const isOverdue = daysUntil < 0
                const isUrgent = daysUntil <= 7 && daysUntil >= 0

                return (
                  <div
                    key={task.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      isOverdue
                        ? 'bg-rose-50 border-rose-500'
                        : isUrgent
                        ? 'bg-wedding-50 border-wedding-500'
                        : 'bg-gray-50 border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{task.description}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Prazo: {format(new Date(task.deadline), "dd/MM/yyyy", { locale: ptBR })}
                          {isOverdue && (
                            <span className="ml-2 text-rose-600 font-semibold">
                              (Atrasada)
                            </span>
                          )}
                          {isUrgent && !isOverdue && (
                            <span className="ml-2 text-wedding-600 font-semibold">
                              (Urgente)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Mensagem de Boas-vindas */}
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <p className="text-lg text-gray-700">
            Bem-vindos, <span className="font-bold text-wedding-700">{wedding.coupleName}</span>! 💕
          </p>
          <p className="text-gray-600 mt-2">
            Tudo organizado em um só lugar para tornar este momento ainda mais especial.
          </p>
        </div>
      </div>
    </Layout>
  )
}

function StatCard({
  title,
  value,
  progress,
  icon: Icon,
  color,
  subtitle,
}: {
  title: string
  value: string
  progress: number
  icon: LucideIcon
  color: 'wedding' | 'rose'
  subtitle?: string
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <Icon size={20} className={`text-${color}-600`} />
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`bg-${color}-600 h-2 rounded-full transition-all`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-500">{progress.toFixed(0)}% concluído</p>
      </div>
    </div>
  )
}

