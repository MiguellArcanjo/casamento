'use client'

import { Edit, Trash2, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react'

interface Budget {
  id: string
  category: string
  amount: number
  description: string | null
}

interface Expense {
  id: string
  category: string
  actualValue: number | null
  estimatedValue: number
}

export default function BudgetList({
  budgets,
  expenses,
  categories,
  currency,
  onEdit,
  onDelete,
}: {
  budgets: Budget[]
  expenses: Expense[]
  categories: string[]
  currency: string
  onEdit: (budget: Budget) => void
  onDelete: (id: string) => void
}) {
  // Calcular gastos reais por categoria
  const expensesByCategory: Record<string, number> = {}
  expenses.forEach((expense) => {
    const value = expense.actualValue || expense.estimatedValue
    expensesByCategory[expense.category] =
      (expensesByCategory[expense.category] || 0) + value
  })

  if (budgets.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <p className="text-gray-600 mb-4">Nenhum orçamento cadastrado ainda</p>
        <p className="text-sm text-gray-500">
          Defina orçamentos por categoria para ter melhor controle dos gastos
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {budgets.map((budget) => {
        const spent = expensesByCategory[budget.category] || 0
        const remaining = budget.amount - spent
        const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0
        const isOverBudget = spent > budget.amount
        const isNearLimit = percentage >= 80 && percentage <= 100

        return (
          <div
            key={budget.id}
            className={`bg-white rounded-xl shadow-md p-4 border-l-4 ${
              isOverBudget
                ? 'border-rose-500 bg-rose-50'
                : isNearLimit
                ? 'border-wedding-500 bg-wedding-50'
                : 'border-gray-300'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-bold text-gray-800 text-lg">{budget.category}</h3>
                  {isOverBudget && (
                    <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded text-xs font-semibold flex items-center space-x-1">
                      <AlertCircle size={12} />
                      <span>Ultrapassou!</span>
                    </span>
                  )}
                  {isNearLimit && !isOverBudget && (
                    <span className="px-2 py-1 bg-wedding-100 text-wedding-700 rounded text-xs font-semibold flex items-center space-x-1">
                      <AlertCircle size={12} />
                      <span>Atenção</span>
                    </span>
                  )}
                  {percentage < 80 && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold flex items-center space-x-1">
                      <CheckCircle2 size={12} />
                      <span>Dentro do orçamento</span>
                    </span>
                  )}
                </div>
                {budget.description && (
                  <p className="text-sm text-gray-600 mb-2">{budget.description}</p>
                )}
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => onEdit(budget)}
                  className="p-2 text-gray-600 hover:text-wedding-600 hover:bg-wedding-50 rounded-lg touch-target"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDelete(budget.id)}
                  className="p-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg touch-target"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Orçado</p>
                  <p className="text-lg font-bold text-gray-800">
                    {currency} {budget.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Gasto</p>
                  <p
                    className={`text-lg font-bold ${
                      isOverBudget ? 'text-rose-600' : 'text-gray-800'
                    }`}
                  >
                    {currency} {spent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    isOverBudget
                      ? 'bg-rose-600'
                      : isNearLimit
                      ? 'bg-wedding-600'
                      : 'bg-green-600'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">
                  {percentage.toFixed(0)}% utilizado
                </span>
                {isOverBudget ? (
                  <span className="text-rose-600 font-semibold">
                    Excedeu em {currency}{' '}
                    {Math.abs(remaining).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                ) : (
                  <span className="text-green-600 font-semibold">
                    Restante: {currency}{' '}
                    {remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

