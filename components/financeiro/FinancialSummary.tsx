'use client'

import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react'

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

export default function FinancialSummary({
  expenses,
  deposits,
  financialGoal,
  currency,
}: {
  expenses: Expense[]
  deposits: Deposit[]
  financialGoal: number
  currency: string
}) {
  const totalDeposits = deposits.reduce((sum, d) => sum + d.amount, 0)
  const totalEstimated = expenses.reduce((sum, e) => sum + e.estimatedValue, 0)
  const totalActual = expenses.reduce(
    (sum, e) => sum + (e.actualValue || e.estimatedValue),
    0
  )
  const remaining = financialGoal - totalDeposits
  const progress = financialGoal > 0 ? (totalDeposits / financialGoal) * 100 : 0

  const categoryTotals: Record<string, number> = {}
  expenses.forEach((expense) => {
    const value = expense.actualValue || expense.estimatedValue
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + value
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
        <h2 className="text-xl font-bold text-gray-800 mb-4">Comparativo Estimado x Real</h2>
        <div className="grid grid-cols-2 gap-4">
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
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600">
            Diferença:{' '}
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

      {/* Por Categoria */}
      {Object.keys(categoryTotals).length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Gastos por Categoria</h2>
          <div className="space-y-2">
            {Object.entries(categoryTotals)
              .sort(([, a], [, b]) => b - a)
              .map(([category, total]) => (
                <div key={category} className="flex justify-between items-center py-2">
                  <span className="text-gray-700">{category}</span>
                  <span className="font-bold text-gray-800">
                    {currency} {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

