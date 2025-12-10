'use client'

import { useState } from 'react'

interface Document {
  id: string
  type: string
  title: string
  description: string | null
  link: string | null
  notes: string | null
}

export default function DocumentForm({
  documentTypes,
  initialData,
  onSubmit,
  onCancel,
}: {
  documentTypes: string[]
  initialData?: Document | null
  onSubmit: (data: any) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    type: initialData?.type || documentTypes[0] || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    link: initialData?.link || '',
    notes: initialData?.notes || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      description: formData.description || null,
      link: formData.link || null,
      notes: formData.notes || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {initialData ? 'Editar Documento' : 'Novo Documento'}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo *
        </label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
        >
          {documentTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Título *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
          placeholder="Título do documento"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descrição
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
          placeholder="Descrição do documento"
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
          Observações
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
          placeholder="Anotações importantes..."
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



