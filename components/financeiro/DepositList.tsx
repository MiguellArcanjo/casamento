'use client'

import { Edit, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Deposit {
  id: string
  description: string
  amount: number
  paidBy: 'NOIVO' | 'NOIVA' | 'AMBOS'
  date: Date
}

export default function DepositList({
  deposits,
  onEdit,
  onDelete,
}: {
  deposits: Deposit[]
  onEdit: (deposit: Deposit) => void
  onDelete: (id: string) => void
}) {
  if (deposits.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <p className="text-gray-600">Nenhum depósito cadastrado ainda</p>
      </div>
    )
  }

  const paidByLabels = {
    NOIVO: 'Noivo',
    NOIVA: 'Noiva',
    AMBOS: 'Ambos',
  }

  return (
    <div className="space-y-4">
      {deposits.map((deposit) => (
        <div key={deposit.id} className="bg-white rounded-xl shadow-md p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-2">{deposit.description}</h3>
              <div className="space-y-1">
                <p className="text-lg font-bold text-wedding-700">
                  R$ {deposit.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Data:</span>{' '}
                  {format(new Date(deposit.date), "dd/MM/yyyy", { locale: ptBR })}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Depositado por:</span>{' '}
                  {paidByLabels[deposit.paidBy]}
                </p>
              </div>
            </div>
            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => onEdit(deposit)}
                className="p-2 text-gray-600 hover:text-wedding-600 hover:bg-wedding-50 rounded-lg touch-target"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => onDelete(deposit.id)}
                className="p-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg touch-target"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

