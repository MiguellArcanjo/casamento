'use client'

import { useState } from 'react'
import { Plus, CheckCircle2, Circle, AlertCircle, Calendar } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import TaskForm from './TaskForm'
import TaskCard from './TaskCard'

interface Task {
  id: string
  description: string
  deadline: Date
  stage: string
  responsible: 'NOIVO' | 'NOIVA' | 'AMBOS'
  priority: 'BAIXA' | 'MEDIA' | 'ALTA'
  completed: boolean
}

export default function TasksContent({
  initialTasks,
  stages,
  weddingId,
}: {
  initialTasks: Task[]
  stages: { value: string; label: string }[]
  weddingId: string
}) {
  const [tasks, setTasks] = useState(initialTasks)
  const [showForm, setShowForm] = useState(false)
  const [selectedStage, setSelectedStage] = useState<string>('all')
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const filteredTasks =
    selectedStage === 'all'
      ? tasks
      : tasks.filter((task) => task.stage === selectedStage)

  const completedTasks = tasks.filter((t) => t.completed).length
  const totalTasks = tasks.length
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const handleAdd = async (data: any) => {
    const res = await fetch('/api/tarefas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, weddingId }),
    })

    if (res.ok) {
      const newTask = await res.json()
      setTasks([...tasks, newTask])
      setShowForm(false)
    }
  }

  const handleUpdate = async (id: string, data: any) => {
    const res = await fetch(`/api/tarefas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      const updated = await res.json()
      setTasks(tasks.map((task) => (task.id === id ? updated : task)))
      setEditingTask(null)
    }
  }

  const handleToggleComplete = async (id: string, completed: boolean) => {
    const res = await fetch(`/api/tarefas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed }),
    })

    if (res.ok) {
      const updated = await res.json()
      setTasks(tasks.map((task) => (task.id === id ? updated : task)))
    }
  }

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/tarefas/${id}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      setTasks(tasks.filter((task) => task.id !== id))
    }
  }

  const overdueTasks = tasks.filter((t) => {
    if (t.completed) return false
    const daysUntil = differenceInDays(new Date(t.deadline), new Date())
    return daysUntil < 0
  })

  const urgentTasks = tasks.filter((t) => {
    if (t.completed) return false
    const daysUntil = differenceInDays(new Date(t.deadline), new Date())
    return daysUntil >= 0 && daysUntil <= 7
  })

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Progresso Geral</h2>
          <span className="text-2xl font-bold text-wedding-700">
            {completedTasks}/{totalTasks}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-wedding-600 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">{progress.toFixed(0)}% concluído</p>
      </div>

      {/* Alertas */}
      {(overdueTasks.length > 0 || urgentTasks.length > 0) && (
        <div className="space-y-2">
          {overdueTasks.length > 0 && (
            <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle size={20} className="text-rose-600" />
                <span className="font-medium text-rose-800">
                  {overdueTasks.length} tarefa(s) atrasada(s)
                </span>
              </div>
            </div>
          )}
          {urgentTasks.length > 0 && (
            <div className="bg-wedding-50 border-l-4 border-wedding-500 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Calendar size={20} className="text-wedding-600" />
                <span className="font-medium text-wedding-800">
                  {urgentTasks.length} tarefa(s) com prazo próximo (7 dias)
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedStage('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium touch-target ${
              selectedStage === 'all'
                ? 'bg-wedding-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Todas
          </button>
          {stages.map((stage) => (
            <button
              key={stage.value}
              onClick={() => setSelectedStage(stage.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium touch-target ${
                selectedStage === stage.value
                  ? 'bg-wedding-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {stage.label}
            </button>
          ))}
        </div>
      </div>

      {/* Botão Adicionar */}
      <button
        onClick={() => {
          setEditingTask(null)
          setShowForm(true)
        }}
        className="w-full bg-wedding-600 text-white py-4 rounded-xl font-medium hover:bg-wedding-700 transition-colors flex items-center justify-center space-x-2 touch-target shadow-lg"
      >
        <Plus size={20} />
        <span>Adicionar Tarefa</span>
      </button>

      {/* Formulário Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <TaskForm
              stages={stages}
              initialData={editingTask}
              onSubmit={editingTask ? (data) => handleUpdate(editingTask.id, data) : handleAdd}
              onCancel={() => {
                setShowForm(false)
                setEditingTask(null)
              }}
            />
          </div>
        </div>
      )}

      {/* Lista de Tarefas */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <CheckCircle2 size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Nenhuma tarefa cadastrada ainda</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              stages={stages}
              onToggleComplete={handleToggleComplete}
              onEdit={() => {
                setEditingTask(task)
                setShowForm(true)
              }}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}



