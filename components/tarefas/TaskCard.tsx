'use client'

import { CheckCircle2, Circle, Edit, Trash2, AlertCircle } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Task {
  id: string
  description: string
  deadline: Date
  stage: string
  responsible: 'NOIVO' | 'NOIVA' | 'AMBOS'
  priority: 'BAIXA' | 'MEDIA' | 'ALTA'
  completed: boolean
}

export default function TaskCard({
  task,
  stages,
  onToggleComplete,
  onEdit,
  onDelete,
}: {
  task: Task
  stages: { value: string; label: string }[]
  onToggleComplete: (id: string, completed: boolean) => void
  onEdit: () => void
  onDelete: (id: string) => void
}) {
  const daysUntil = differenceInDays(new Date(task.deadline), new Date())
  const isOverdue = daysUntil < 0 && !task.completed
  const isUrgent = daysUntil >= 0 && daysUntil <= 7 && !task.completed

  const priorityColors = {
    BAIXA: 'bg-gray-100 text-gray-700',
    MEDIA: 'bg-wedding-100 text-wedding-700',
    ALTA: 'bg-rose-100 text-rose-700',
  }

  const responsibleLabels = {
    NOIVO: 'Noivo',
    NOIVA: 'Noiva',
    AMBOS: 'Ambos',
  }

  const stageLabel = stages.find((s) => s.value === task.stage)?.label || task.stage

  return (
    <div
      className={`bg-white rounded-xl shadow-md p-4 border-l-4 ${
        task.completed
          ? 'border-green-500 bg-green-50'
          : isOverdue
          ? 'border-rose-500 bg-rose-50'
          : isUrgent
          ? 'border-wedding-500 bg-wedding-50'
          : 'border-gray-300'
      }`}
    >
      <div className="flex items-start space-x-3">
        <button
          onClick={() => onToggleComplete(task.id, task.completed)}
          className="mt-1 touch-target"
        >
          {task.completed ? (
            <CheckCircle2 size={24} className="text-green-600" />
          ) : (
            <Circle size={24} className="text-gray-400" />
          )}
        </button>
        <div className="flex-1">
          <h3
            className={`font-medium text-gray-800 ${
              task.completed ? 'line-through text-gray-500' : ''
            }`}
          >
            {task.description}
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
              {stageLabel}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
              {responsibleLabels[task.responsible]}
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <p className="text-sm text-gray-600">
              Prazo: {format(new Date(task.deadline), "dd/MM/yyyy", { locale: ptBR })}
            </p>
            {isOverdue && (
              <span className="inline-flex items-center space-x-1 text-rose-600 text-xs font-semibold">
                <AlertCircle size={14} />
                <span>Atrasada</span>
              </span>
            )}
            {isUrgent && !isOverdue && (
              <span className="text-wedding-600 text-xs font-semibold">
                (Urgente - {daysUntil} {daysUntil === 1 ? 'dia' : 'dias'})
              </span>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-2 text-gray-600 hover:text-wedding-600 hover:bg-wedding-50 rounded-lg touch-target"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg touch-target"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}



