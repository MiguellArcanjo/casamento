'use client'

import { useState } from 'react'

interface Task {
  id: string
  description: string
  deadline: Date
  stage: string
  responsible: 'NOIVO' | 'NOIVA' | 'AMBOS'
  priority: 'BAIXA' | 'MEDIA' | 'ALTA'
  completed: boolean
}

export default function TaskForm({
  stages,
  initialData,
  onSubmit,
  onCancel,
}: {
  stages: { value: string; label: string }[]
  initialData?: Task | null
  onSubmit: (data: any) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    description: initialData?.description || '',
    deadline: initialData
      ? new Date(initialData.deadline).toISOString().split('T')[0]
      : '',
    stage: initialData?.stage || stages[0]?.value || '',
    responsible: initialData?.responsible || 'AMBOS',
    priority: initialData?.priority || 'MEDIA',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      deadline: new Date(formData.deadline),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {initialData ? 'Editar Tarefa' : 'Nova Tarefa'}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descrição *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
          placeholder="Descreva a tarefa..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Etapa *
        </label>
        <select
          value={formData.stage}
          onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
        >
          {stages.map((stage) => (
            <option key={stage.value} value={stage.value}>
              {stage.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prazo *
        </label>
        <input
          type="date"
          value={formData.deadline}
          onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Responsável *
        </label>
        <select
          value={formData.responsible}
          onChange={(e) =>
            setFormData({
              ...formData,
              responsible: e.target.value as 'NOIVO' | 'NOIVA' | 'AMBOS',
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
          Prioridade *
        </label>
        <select
          value={formData.priority}
          onChange={(e) =>
            setFormData({
              ...formData,
              priority: e.target.value as 'BAIXA' | 'MEDIA' | 'ALTA',
            })
          }
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent touch-target"
        >
          <option value="BAIXA">Baixa</option>
          <option value="MEDIA">Média</option>
          <option value="ALTA">Alta</option>
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



