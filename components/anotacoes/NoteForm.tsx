'use client'

import { useState } from 'react'

interface Note {
  id: string
  title: string | null
  content: string
  type: 'GERAL' | 'DECORACAO' | 'MUSICA' | 'CARTA' | 'VOTOS' | 'PLAYLIST'
}

export default function NoteForm({
  noteTypes,
  initialData,
  onSubmit,
  onCancel,
}: {
  noteTypes: { value: string; label: string }[]
  initialData?: Note | null
  onSubmit: (data: any) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    type: initialData?.type || 'GERAL',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      title: formData.title || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {initialData ? 'Editar Anotação' : 'Nova Anotação'}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo *
        </label>
        <select
          value={formData.type}
          onChange={(e) =>
            setFormData({
              ...formData,
              type: e.target.value as 'GERAL' | 'DECORACAO' | 'MUSICA' | 'CARTA' | 'VOTOS' | 'PLAYLIST',
            })
          }
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
        >
          {noteTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Título (opcional)
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
          placeholder="Título da anotação"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Conteúdo *
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          required
          rows={8}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
          placeholder="Escreva suas ideias, inspirações, músicas, votos..."
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



