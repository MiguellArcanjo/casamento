'use client'

import { useState } from 'react'

interface Expense {
  id: string
  name: string
  category: string
  estimatedValue: number
  actualValue: number | null
  paidBy: 'NOIVO' | 'NOIVA' | 'AMBOS'
  paymentStatus: 'A_PAGAR' | 'PAGO_PARCIALMENTE' | 'PAGO'
}

export default function ExpenseForm({
  categories,
  initialData,
  onSubmit,
  onCancel,
}: {
  categories: string[]
  initialData?: Expense | null
  onSubmit: (data: any) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || categories[0] || '',
    estimatedValue: initialData?.estimatedValue?.toString() || '',
    actualValue: initialData?.actualValue?.toString() || '',
    paidBy: initialData?.paidBy || 'AMBOS',
    paymentStatus: initialData?.paymentStatus || 'A_PAGAR',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      estimatedValue: parseFloat(formData.estimatedValue) || 0,
      actualValue: formData.actualValue ? parseFloat(formData.actualValue) : null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {initialData ? 'Editar Gasto' : 'Novo Gasto'}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nome do Gasto *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
          placeholder="Ex: Buffet"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Categoria *
        </label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Valor Estimado (R$) *
        </label>
        <input
          type="number"
          step="0.01"
          value={formData.estimatedValue}
          onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
          placeholder="0.00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Valor Real (R$)
        </label>
        <input
          type="number"
          step="0.01"
          value={formData.actualValue}
          onChange={(e) => setFormData({ ...formData, actualValue: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
          placeholder="Deixe em branco se ainda não foi pago"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quem Pagou *
        </label>
        <select
          value={formData.paidBy}
          onChange={(e) =>
            setFormData({
              ...formData,
              paidBy: e.target.value as 'NOIVO' | 'NOIVA' | 'AMBOS',
            })
          }
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
        >
          <option value="NOIVO">Noivo</option>
          <option value="NOIVA">Noiva</option>
          <option value="AMBOS">Ambos</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status de Pagamento *
        </label>
        <select
          value={formData.paymentStatus}
          onChange={(e) =>
            setFormData({
              ...formData,
              paymentStatus: e.target.value as 'A_PAGAR' | 'PAGO_PARCIALMENTE' | 'PAGO',
            })
          }
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
        >
          <option value="A_PAGAR">A Pagar</option>
          <option value="PAGO_PARCIALMENTE">Pago Parcialmente</option>
          <option value="PAGO">Pago</option>
        </select>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors touch-target"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-3 bg-wedding-600 text-white rounded-lg font-medium hover:bg-wedding-700 transition-colors touch-target"
        >
          Salvar
        </button>
      </div>
    </form>
  )
}



