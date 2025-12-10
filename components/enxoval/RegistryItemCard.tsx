'use client'

import { useState } from 'react'
import { Edit, Trash2, ExternalLink, CheckCircle2, Circle } from 'lucide-react'
import RegistryItemForm from './RegistryItemForm'

interface RegistryItem {
  id: string
  name: string
  category: string
  estimatedPrice: number | null
  store: string | null
  link: string | null
  status: 'PENDENTE' | 'COMPRADO'
}

export default function RegistryItemCard({
  item,
  categories,
  onUpdate,
  onDelete,
}: {
  item: RegistryItem
  categories: string[]
  onUpdate: (id: string, data: any) => void
  onDelete: (id: string) => void
}) {
  const [showEdit, setShowEdit] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleUpdate = (data: any) => {
    onUpdate(item.id, data)
    setShowEdit(false)
  }

  const handleDelete = () => {
    onDelete(item.id)
    setShowDeleteConfirm(false)
  }

  const handleToggleStatus = () => {
    const newStatus = item.status === 'COMPRADO' ? 'PENDENTE' : 'COMPRADO'
    onUpdate(item.id, {
      ...item,
      status: newStatus,
    })
  }

  return (
    <>
      <div
        className={`bg-white rounded-xl shadow-md p-4 border-l-4 ${
          item.status === 'COMPRADO'
            ? 'border-green-500 bg-green-50'
            : 'border-wedding-500'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <button
                onClick={handleToggleStatus}
                className="touch-target focus:outline-none"
                aria-label={item.status === 'COMPRADO' ? 'Marcar como pendente' : 'Marcar como comprado'}
              >
                {item.status === 'COMPRADO' ? (
                  <CheckCircle2 size={20} className="text-green-600 cursor-pointer hover:text-green-700" />
                ) : (
                  <Circle size={20} className="text-gray-400 cursor-pointer hover:text-gray-600" />
                )}
              </button>
              <h3 className="font-bold text-gray-800">{item.name}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">Categoria:</span> {item.category}
            </p>
            {item.estimatedPrice && (
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Preço:</span> R${' '}
                {item.estimatedPrice.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                })}
              </p>
            )}
            {item.store && (
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Loja:</span> {item.store}
              </p>
            )}
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-wedding-600 hover:underline text-sm"
              >
                <ExternalLink size={14} />
                <span>Ver link</span>
              </a>
            )}
          </div>
          <div className="flex space-x-2 ml-4">
            <button
              onClick={() => setShowEdit(true)}
              className="p-2 text-gray-600 hover:text-wedding-600 hover:bg-wedding-50 rounded-lg touch-target"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg touch-target"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <RegistryItemForm
              categories={categories}
              initialData={item}
              onSubmit={handleUpdate}
              onCancel={() => setShowEdit(false)}
            />
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Confirmar exclusão
            </h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir o item "{item.name}"?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors touch-target"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-3 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors touch-target"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}



