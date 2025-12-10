'use client'

import { DollarSign, TrendingUp, TrendingDown, Target, AlertCircle } from 'lucide-react'

interface Expense {
  id: string
  name: string
  category: string
  estimatedValue: number
  actualValue: number | null
  paidBy: 'NOIVO' | 'NOIVA' | 'AMBOS'
  paymentStatus: 'A_PAGAR' | 'PAGO_PARCIALMENTE' | 'PAGO'
}

interface Deposit {
  id: string
  description: string
  amount: number
  paidBy: 'NOIVO' | 'NOIVA' | 'AMBOS'
  date: Date
}

interface Budget {
  id: string
  category: string
  amount: number
  description: string | null
}

export default function FinancialSummary({
  expenses,
  deposits,
  budgets,
  financialGoal,
  currency,
}: {
  expenses: Expense[]
  deposits: Deposit[]
  budgets: Budget[]
  financialGoal: number
  currency: string
}) {
  const totalDeposits = deposits.reduce((sum, d) => sum + d.amount, 0)
  const totalEstimated = expenses.reduce((sum, e) => sum + e.estimatedValue, 0)
  const totalActual = expenses.reduce(
    (sum, e) => sum + (e.actualValue || e.estimatedValue),
    0
  )
  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0)
  const remaining = financialGoal - totalDeposits
  const progress = financialGoal > 0 ? (totalDeposits / financialGoal) * 100 : 0

  const categoryTotals: Record<string, number> = {}
  expenses.forEach((expense) => {
    const value = expense.actualValue || expense.estimatedValue
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + value
  })

  // Calcular gastos vs orçamento por categoria
  const budgetComparison: Array<{
    category: string
    budget: number
    spent: number
    remaining: number
    percentage: number
    isOverBudget: boolean
  }> = []

  budgets.forEach((budget) => {
    const spent = categoryTotals[budget.category] || 0
    const remaining = budget.amount - spent
    const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0
    budgetComparison.push({
      category: budget.category,
      budget: budget.amount,
      spent,
      remaining,
      percentage,
      isOverBudget: spent > budget.amount,
    })
  })

  return (
    <div className="space-y-6">
      {/* Meta Financeira */}
      <div className="bg-gradient-to-r from-wedding-500 to-rose-500 text-white rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Meta Financeira</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span>Total Juntado</span>
            <span className="text-2xl font-bold">
              {currency} {totalDeposits.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Meta</span>
            <span className="text-xl">
              {currency} {financialGoal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="w-full bg-white bg-opacity-30 rounded-full h-3 mt-4">
            <div
              className="bg-white h-3 rounded-full transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm">
              {progress.toFixed(0)}% da meta
            </span>
            {remaining > 0 ? (
              <span className="text-sm">
                Faltam {currency} {remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            ) : (
              <span className="text-sm">Meta alcançada! 🎉</span>
            )}
          </div>
        </div>
      </div>

      {/* Comparativo */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Comparativo Orçado x Real</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {totalBudget > 0 && (
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Target className="mx-auto text-blue-600 mb-2" size={24} />
              <p className="text-sm text-gray-600">Orçado</p>
              <p className="text-xl font-bold text-gray-800">
                {currency} {totalBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          )}
          <div className="text-center p-4 bg-wedding-50 rounded-lg">
            <TrendingUp className="mx-auto text-wedding-600 mb-2" size={24} />
            <p className="text-sm text-gray-600">Estimado</p>
            <p className="text-xl font-bold text-gray-800">
              {currency} {totalEstimated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-center p-4 bg-rose-50 rounded-lg">
            <TrendingDown className="mx-auto text-rose-600 mb-2" size={24} />
            <p className="text-sm text-gray-600">Real</p>
            <p className="text-xl font-bold text-gray-800">
              {currency} {totalActual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t space-y-2">
          {totalBudget > 0 && (
            <p className="text-sm text-gray-600">
              Orçado vs Real:{' '}
              <span
                className={`font-bold ${
                  totalActual - totalBudget >= 0 ? 'text-rose-600' : 'text-green-600'
                }`}
              >
                {totalActual - totalBudget >= 0 ? '+' : ''}
                {currency}{' '}
                {(totalActual - totalBudget).toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                })}
              </span>
            </p>
          )}
          <p className="text-sm text-gray-600">
            Estimado vs Real:{' '}
            <span
              className={`font-bold ${
                totalActual - totalEstimated >= 0 ? 'text-rose-600' : 'text-green-600'
              }`}
            >
              {totalActual - totalEstimated >= 0 ? '+' : ''}
              {currency}{' '}
              {(totalActual - totalEstimated).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}
            </span>
          </p>
        </div>
      </div>

      {/* Orçamentos por Categoria */}
      {budgetComparison.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <Target size={24} className="text-wedding-600" />
            <span>Orçamentos por Categoria</span>
          </h2>
          <div className="space-y-4">
            {budgetComparison
              .sort((a, b) => b.budget - a.budget)
              .map((item) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">{item.category}</span>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-600">
                        {item.percentage.toFixed(0)}%
                      </span>
                      {item.isOverBudget && (
                        <span className="text-rose-600 font-semibold flex items-center space-x-1">
                          <AlertCircle size={14} />
                          <span>Ultrapassou</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        item.isOverBudget
                          ? 'bg-rose-600'
                          : item.percentage >= 80
                          ? 'bg-wedding-600'
                          : 'bg-green-600'
                      }`}
                      style={{ width: `${Math.min(item.percentage, 100)}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-gray-500">Orçado</p>
                      <p className="font-semibold text-gray-800">
                        {currency} {item.budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Gasto</p>
                      <p
                        className={`font-semibold ${
                          item.isOverBudget ? 'text-rose-600' : 'text-gray-800'
                        }`}
                      >
                        {currency} {item.spent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Restante</p>
                      <p
                        className={`font-semibold ${
                          item.isOverBudget ? 'text-rose-600' : 'text-green-600'
                        }`}
                      >
                        {currency} {item.remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Por Categoria (apenas categorias sem orçamento) */}
      {Object.keys(categoryTotals).length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Gastos por Categoria</h2>
          <div className="space-y-2">
            {Object.entries(categoryTotals)
              .filter(([category]) => !budgets.find((b) => b.category === category))
              .sort(([, a], [, b]) => b - a)
              .map(([category, total]) => (
                <div key={category} className="flex justify-between items-center py-2">
                  <span className="text-gray-700">{category}</span>
                  <span className="font-bold text-gray-800">
                    {currency} {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            {Object.keys(categoryTotals).every((cat) =>
              budgets.find((b) => b.category === cat)
            ) && (
              <p className="text-sm text-gray-500 text-center py-4">
                Todas as categorias com gastos possuem orçamento definido
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}



