'use client'

import { useState } from 'react'

interface RegistryItemFormProps {
  categories: string[]
  onSubmit: (data: any) => void
  onCancel: () => void
  initialData?: {
    name: string
    category: string
    estimatedPrice: number | null
    store: string | null
    link: string | null
    status: 'PENDENTE' | 'COMPRADO'
  }
}

export default function RegistryItemForm({
  categories,
  onSubmit,
  onCancel,
  initialData,
}: RegistryItemFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || categories[0] || '',
    estimatedPrice: initialData?.estimatedPrice?.toString() || '',
    store: initialData?.store || '',
    link: initialData?.link || '',
    status: initialData?.status || 'PENDENTE',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      estimatedPrice: formData.estimatedPrice ? parseFloat(formData.estimatedPrice) : null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {initialData ? 'Editar Item' : 'Novo Item'}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nome do Item *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
          placeholder="Ex: Jogo de pratos"
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
          Preço Estimado (R$)
        </label>
        <input
          type="number"
          step="0.01"
          value={formData.estimatedPrice}
          onChange={(e) => setFormData({ ...formData, estimatedPrice: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
          placeholder="0.00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Loja
        </label>
        <input
          type="text"
          value={formData.store}
          onChange={(e) => setFormData({ ...formData, store: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
          placeholder="Nome da loja"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Link
        </label>
        <input
          type="url"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as 'PENDENTE' | 'COMPRADO' })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
        >
          <option value="PENDENTE">Pendente</option>
          <option value="COMPRADO">Comprado</option>
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



