'use client'

import { useState } from 'react'
import { Plus, ShoppingBag, CheckCircle2 } from 'lucide-react'
import RegistryItemForm from './RegistryItemForm'
import RegistryItemCard from './RegistryItemCard'

interface RegistryItem {
  id: string
  name: string
  category: string
  estimatedPrice: number | null
  store: string | null
  link: string | null
  status: 'PENDENTE' | 'COMPRADO'
  createdAt: Date
  updatedAt: Date
}

export default function RegistryItemList({
  initialItems,
  categories,
  weddingId,
}: {
  initialItems: RegistryItem[]
  categories: string[]
  weddingId: string
}) {
  const [items, setItems] = useState(initialItems)
  const [showForm, setShowForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredItems =
    selectedCategory === 'all'
      ? items
      : items.filter((item) => item.category === selectedCategory)

  const pendingItems = items.filter((i) => i.status === 'PENDENTE')
  const purchasedItems = items.filter((i) => i.status === 'COMPRADO')

  const handleAdd = async (data: any) => {
    const res = await fetch('/api/enxoval', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, weddingId }),
    })

    if (res.ok) {
      const newItem = await res.json()
      setItems([newItem, ...items])
      setShowForm(false)
    }
  }

  const handleUpdate = async (id: string, data: any) => {
    const res = await fetch(`/api/enxoval/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      const updated = await res.json()
      setItems(items.map((item) => (item.id === id ? updated : item)))
    }
  }

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/enxoval/${id}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <ShoppingBag size={20} />
            <span className="text-sm">Pendentes</span>
          </div>
          <p className="text-2xl font-bold text-wedding-700 mt-1">
            {pendingItems.length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <CheckCircle2 size={20} />
            <span className="text-sm">Comprados</span>
          </div>
          <p className="text-2xl font-bold text-rose-600 mt-1">
            {purchasedItems.length}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium touch-target ${
              selectedCategory === 'all'
                ? 'bg-wedding-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Todas
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium touch-target ${
                selectedCategory === cat
                  ? 'bg-wedding-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Botão Adicionar */}
      <button
        onClick={() => setShowForm(true)}
        className="w-full bg-wedding-600 text-white py-4 rounded-xl font-medium hover:bg-wedding-700 transition-colors flex items-center justify-center space-x-2 touch-target shadow-lg"
      >
        <Plus size={20} />
        <span>Adicionar Item</span>
      </button>

      {/* Formulário Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <RegistryItemForm
              categories={categories}
              onSubmit={handleAdd}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* Lista de Itens */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Nenhum item cadastrado ainda</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <RegistryItemCard
              key={item.id}
              item={item}
              categories={categories}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}

