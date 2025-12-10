'use client'

import { Edit, Trash2 } from 'lucide-react'

interface Expense {
  id: string
  name: string
  category: string
  estimatedValue: number
  actualValue: number | null
  paidBy: 'NOIVO' | 'NOIVA' | 'AMBOS'
  paymentStatus: 'A_PAGAR' | 'PAGO_PARCIALMENTE' | 'PAGO'
}

export default function ExpenseList({
  expenses,
  categories,
  onEdit,
  onDelete,
}: {
  expenses: Expense[]
  categories: string[]
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
}) {
  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <p className="text-gray-600">Nenhum gasto cadastrado ainda</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {expenses.map((expense) => {
        const paymentStatusLabels = {
          A_PAGAR: 'A Pagar',
          PAGO_PARCIALMENTE: 'Pago Parcialmente',
          PAGO: 'Pago',
        }

        const paymentStatusColors = {
          A_PAGAR: 'bg-yellow-100 text-yellow-800',
          PAGO_PARCIALMENTE: 'bg-blue-100 text-blue-800',
          PAGO: 'bg-green-100 text-green-800',
        }

        const paidByLabels = {
          NOIVO: 'Noivo',
          NOIVA: 'Noiva',
          AMBOS: 'Ambos',
        }

        return (
          <div key={expense.id} className="bg-white rounded-xl shadow-md p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-2">{expense.name}</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="px-2 py-1 bg-wedding-100 text-wedding-700 rounded text-xs font-medium">
                    {expense.category}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${paymentStatusColors[expense.paymentStatus]}`}
                  >
                    {paymentStatusLabels[expense.paymentStatus]}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                    {paidByLabels[expense.paidBy]}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Estimado:</span> R${' '}
                    {expense.estimatedValue.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  {expense.actualValue && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Real:</span> R${' '}
                      {expense.actualValue.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => onEdit(expense)}
                  className="p-2 text-gray-600 hover:text-wedding-600 hover:bg-wedding-50 rounded-lg touch-target"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDelete(expense.id)}
                  className="p-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg touch-target"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}



