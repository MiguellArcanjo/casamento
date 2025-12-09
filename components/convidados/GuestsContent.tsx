'use client'

import { useState } from 'react'
import { Plus, Users, CheckCircle2, XCircle, Mail } from 'lucide-react'
import GuestForm from './GuestForm'
import GuestCard from './GuestCard'

interface Guest {
  id: string
  name: string
  companions: number
  phone: string | null
  contact: string | null
  status: 'NAO_CONVIDADO' | 'CONVIDADO' | 'CONFIRMOU' | 'NAO_IRA'
}

export default function GuestsContent({
  initialGuests,
  weddingId,
}: {
  initialGuests: Guest[]
  weddingId: string
}) {
  const [guests, setGuests] = useState(initialGuests)
  const [showForm, setShowForm] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)

  const filteredGuests =
    selectedStatus === 'all'
      ? guests
      : guests.filter((guest) => guest.status === selectedStatus)

  const totalGuests = guests.reduce((sum, g) => sum + 1 + g.companions, 0)
  const confirmedGuests = guests
    .filter((g) => g.status === 'CONFIRMOU')
    .reduce((sum, g) => sum + 1 + g.companions, 0)
  const invitedGuests = guests.filter((g) => g.status === 'CONVIDADO' || g.status === 'CONFIRMOU').length
  const notComingGuests = guests.filter((g) => g.status === 'NAO_IRA').length

  const handleAdd = async (data: any) => {
    const url = editingGuest
      ? `/api/convidados/${editingGuest.id}`
      : '/api/convidados'
    const method = editingGuest ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, weddingId }),
    })

    if (res.ok) {
      const guest = await res.json()
      if (editingGuest) {
        setGuests(guests.map((g) => (g.id === guest.id ? guest : g)))
      } else {
        setGuests([...guests, guest])
      }
      setShowForm(false)
      setEditingGuest(null)
    }
  }

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/convidados/${id}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      setGuests(guests.filter((g) => g.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center space-x-2 text-gray-600 mb-2">
            <Users size={20} />
            <span className="text-sm">Total</span>
          </div>
          <p className="text-2xl font-bold text-wedding-700">{totalGuests}</p>
          <p className="text-xs text-gray-500 mt-1">{guests.length} convidados</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center space-x-2 text-gray-600 mb-2">
            <CheckCircle2 size={20} />
            <span className="text-sm">Confirmados</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{confirmedGuests}</p>
          <p className="text-xs text-gray-500 mt-1">
            {guests.filter((g) => g.status === 'CONFIRMOU').length} convidados
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center space-x-2 text-gray-600 mb-2">
            <Mail size={20} />
            <span className="text-sm">Convidados</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{invitedGuests}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center space-x-2 text-gray-600 mb-2">
            <XCircle size={20} />
            <span className="text-sm">Não Irão</span>
          </div>
          <p className="text-2xl font-bold text-gray-600">{notComingGuests}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium touch-target ${
              selectedStatus === 'all'
                ? 'bg-wedding-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setSelectedStatus('NAO_CONVIDADO')}
            className={`px-4 py-2 rounded-lg text-sm font-medium touch-target ${
              selectedStatus === 'NAO_CONVIDADO'
                ? 'bg-wedding-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Não Convidado
          </button>
          <button
            onClick={() => setSelectedStatus('CONVIDADO')}
            className={`px-4 py-2 rounded-lg text-sm font-medium touch-target ${
              selectedStatus === 'CONVIDADO'
                ? 'bg-wedding-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Convidado
          </button>
          <button
            onClick={() => setSelectedStatus('CONFIRMOU')}
            className={`px-4 py-2 rounded-lg text-sm font-medium touch-target ${
              selectedStatus === 'CONFIRMOU'
                ? 'bg-wedding-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Confirmou
          </button>
          <button
            onClick={() => setSelectedStatus('NAO_IRA')}
            className={`px-4 py-2 rounded-lg text-sm font-medium touch-target ${
              selectedStatus === 'NAO_IRA'
                ? 'bg-wedding-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Não Irá
          </button>
        </div>
      </div>

      {/* Botão Adicionar */}
      <button
        onClick={() => {
          setEditingGuest(null)
          setShowForm(true)
        }}
        className="w-full bg-wedding-600 text-white py-4 rounded-xl font-medium hover:bg-wedding-700 transition-colors flex items-center justify-center space-x-2 touch-target shadow-lg"
      >
        <Plus size={20} />
        <span>Adicionar Convidado</span>
      </button>

      {/* Formulário Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <GuestForm
              initialData={editingGuest}
              onSubmit={handleAdd}
              onCancel={() => {
                setShowForm(false)
                setEditingGuest(null)
              }}
            />
          </div>
        </div>
      )}

      {/* Lista de Convidados */}
      <div className="space-y-4">
        {filteredGuests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Nenhum convidado cadastrado ainda</p>
          </div>
        ) : (
          filteredGuests.map((guest) => (
            <GuestCard
              key={guest.id}
              guest={guest}
              onEdit={() => {
                setEditingGuest(guest)
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

