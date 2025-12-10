import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Layout from '@/components/Layout'
import FinancialContent from '@/components/financeiro/FinancialContent'

async function getFinancialData(weddingId: string) {
  const [expenses, deposits, budgets, wedding] = await Promise.all([
    prisma.expense.findMany({ where: { weddingId } }),
    prisma.deposit.findMany({ where: { weddingId }, orderBy: { date: 'desc' } }),
    prisma.budget.findMany({ where: { weddingId }, orderBy: { category: 'asc' } }),
    prisma.wedding.findUnique({ where: { id: weddingId } }),
  ])

  return { expenses, deposits, budgets, wedding }
}

const expenseCategories = [
  'Buffet',
  'Decoração',
  'Música',
  'Fotografia',
  'Vestido',
  'Terno',
  'Documentação',
  'Viagem',
  'Flores',
  'Convites',
  'Local',
  'Outros',
]

export default async function FinanceiroPage() {
  const user = await getCurrentUser()

  if (!user || !user.wedding) {
    redirect('/login')
  }

  const { expenses, deposits, budgets, wedding } = await getFinancialData(user.wedding.id)

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-serif font-bold text-wedding-800">
          Financeiro do Casamento
        </h1>

        <FinancialContent
          initialExpenses={expenses}
          initialDeposits={deposits}
          initialBudgets={budgets}
          wedding={wedding}
          categories={expenseCategories}
          weddingId={user.wedding.id}
        />
      </div>
    </Layout>
  )
}



