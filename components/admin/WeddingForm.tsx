'use client'

import { useState } from 'react'

interface Wedding {
  id: string
  coupleName: string
  weddingDate: Date
  city: string
  state: string
  ceremonyType: string
  currency: string
  financialGoal: number
  theme: string
}

export default function WeddingForm({
  initialData,
  onSubmit,
  onCancel,
  saving,
}: {
  initialData?: Wedding | null
  onSubmit: (data: any) => void
  onCancel?: () => void
  saving: boolean
}) {
  const [formData, setFormData] = useState({
    coupleName: initialData?.coupleName || '',
    weddingDate: initialData
      ? new Date(initialData.weddingDate).toISOString().split('T')[0]
      : '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    ceremonyType: initialData?.ceremonyType || 'Civil',
    currency: initialData?.currency || 'R$',
    financialGoal: initialData?.financialGoal?.toString() || '',
    theme: initialData?.theme || 'light',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      financialGoal: parseFloat(formData.financialGoal) || 0,
      weddingDate: new Date(formData.weddingDate),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {initialData ? 'Editar Configurações' : 'Configurar Casamento'}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nome do Casal *
        </label>
        <input
          type="text"
          value={formData.coupleName}
          onChange={(e) => setFormData({ ...formData, coupleName: e.target.value })}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
          placeholder="Ex: Marcos & Maria"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Data do Casamento *
        </label>
        <input
          type="date"
          value={formData.weddingDate}
          onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cidade *
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
            placeholder="Cidade"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado *
          </label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
            placeholder="Estado"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Cerimônia *
        </label>
        <select
          value={formData.ceremonyType}
          onChange={(e) => setFormData({ ...formData, ceremonyType: e.target.value })}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
        >
          <option value="Civil">Civil</option>
          <option value="Religiosa">Religiosa</option>
          <option value="Ambas">Ambas</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Moeda Padrão *
        </label>
        <input
          type="text"
          value={formData.currency}
          onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
          placeholder="R$"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meta Financeira Total (R$) *
        </label>
        <input
          type="number"
          step="0.01"
          value={formData.financialGoal}
          onChange={(e) => setFormData({ ...formData, financialGoal: e.target.value })}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
          placeholder="0.00"
        />
      </div>

      <div className="flex space-x-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors touch-target"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={saving}
          className="flex-1 px-4 py-3 bg-wedding-600 text-white rounded-lg font-medium hover:bg-wedding-700 transition-colors touch-target disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  )
}



