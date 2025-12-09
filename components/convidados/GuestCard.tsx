'use client'

import { Edit, Trash2, Phone, Mail } from 'lucide-react'

interface Guest {
  id: string
  name: string
  companions: number
  phone: string | null
  contact: string | null
  status: 'NAO_CONVIDADO' | 'CONVIDADO' | 'CONFIRMOU' | 'NAO_IRA'
}

export default function GuestCard({
  guest,
  onEdit,
  onDelete,
}: {
  guest: Guest
  onEdit: () => void
  onDelete: (id: string) => void
}) {
  const statusLabels = {
    NAO_CONVIDADO: 'Não Convidado',
    CONVIDADO: 'Convidado',
    CONFIRMOU: 'Confirmou',
    NAO_IRA: 'Não Irá',
  }

  const statusColors = {
    NAO_CONVIDADO: 'bg-gray-100 text-gray-700',
    CONVIDADO: 'bg-blue-100 text-blue-700',
    CONFIRMOU: 'bg-green-100 text-green-700',
    NAO_IRA: 'bg-rose-100 text-rose-700',
  }

  const totalPeople = 1 + guest.companions

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-bold text-gray-800">{guest.name}</h3>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${statusColors[guest.status]}`}
            >
              {statusLabels[guest.status]}
            </span>
          </div>
          {guest.companions > 0 && (
            <p className="text-sm text-gray-600 mb-2">
              {guest.companions} {guest.companions === 1 ? 'acompanhante' : 'acompanhantes'} (
              {totalPeople} {totalPeople === 1 ? 'pessoa' : 'pessoas'} no total)
            </p>
          )}
          {guest.phone && (
            <div className="flex items-center space-x-1 text-sm text-gray-600 mb-1">
              <Phone size={14} />
              <a href={`tel:${guest.phone}`} className="hover:text-wedding-600">
                {guest.phone}
              </a>
            </div>
          )}
          {guest.contact && (
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Mail size={14} />
              <span>{guest.contact}</span>
            </div>
          )}
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={onEdit}
            className="p-2 text-gray-600 hover:text-wedding-600 hover:bg-wedding-50 rounded-lg touch-target"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDelete(guest.id)}
            className="p-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg touch-target"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

