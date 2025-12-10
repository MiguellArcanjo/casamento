'use client'

import { useState } from 'react'

interface Budget {
  id: string
  category: string
  amount: number
  description: string | null
}

export default function BudgetForm({
  categories,
  existingBudgets,
  initialData,
  onSubmit,
  onCancel,
}: {
  categories: string[]
  existingBudgets: Budget[]
  initialData?: Budget | null
  onSubmit: (data: any) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    category: initialData?.category || categories[0] || '',
    amount: initialData?.amount?.toString() || '',
    description: initialData?.description || '',
  })

  // Filtrar categorias que já têm orçamento (exceto a atual)
  const availableCategories = categories.filter(
    (cat) => !existingBudgets.find((b) => b.category === cat) || cat === initialData?.category
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount) || 0,
      description: formData.description || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {initialData ? 'Editar Orçamento' : 'Novo Orçamento'}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Categoria *
        </label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
          disabled={!!initialData}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          {availableCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {initialData && (
          <p className="text-xs text-gray-500 mt-1">
            Não é possível alterar a categoria de um orçamento existente
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Valor do Orçamento (R$) *
        </label>
        <input
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
          placeholder="0.00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descrição (opcional)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
          placeholder="Observações sobre este orçamento..."
        />
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

