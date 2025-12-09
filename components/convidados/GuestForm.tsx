'use client'

import { useState } from 'react'

interface Guest {
  id: string
  name: string
  companions: number
  phone: string | null
  contact: string | null
  status: 'NAO_CONVIDADO' | 'CONVIDADO' | 'CONFIRMOU' | 'NAO_IRA'
}

export default function GuestForm({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: Guest | null
  onSubmit: (data: any) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    companions: initialData?.companions?.toString() || '0',
    phone: initialData?.phone || '',
    contact: initialData?.contact || '',
    status: initialData?.status || 'NAO_CONVIDADO',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      companions: parseInt(formData.companions) || 0,
      phone: formData.phone || null,
      contact: formData.contact || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {initialData ? 'Editar Convidado' : 'Novo Convidado'}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nome *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
          placeholder="Nome do convidado"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Número de Acompanhantes
        </label>
        <input
          type="number"
          min="0"
          value={formData.companions}
          onChange={(e) => setFormData({ ...formData, companions: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
          placeholder="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Telefone
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
          placeholder="(00) 00000-0000"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contato Alternativo
        </label>
        <input
          type="text"
          value={formData.contact}
          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
          placeholder="E-mail, WhatsApp, etc."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status *
        </label>
        <select
          value={formData.status}
          onChange={(e) =>
            setFormData({
              ...formData,
              status: e.target.value as 'NAO_CONVIDADO' | 'CONVIDADO' | 'CONFIRMOU' | 'NAO_IRA',
            })
          }
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
        >
          <option value="NAO_CONVIDADO">Não Convidado</option>
          <option value="CONVIDADO">Convidado</option>
          <option value="CONFIRMOU">Confirmou</option>
          <option value="NAO_IRA">Não Irá</option>
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

