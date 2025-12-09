'use client'

import { Edit, Trash2, Phone, Mail } from 'lucide-react'

interface Supplier {
  id: string
  type: string
  name: string
  contactName: string | null
  phone: string | null
  email: string | null
  agreedValue: number
  paymentStatus: 'A_PAGAR' | 'PAGO_PARCIALMENTE' | 'PAGO'
  notes: string | null
}

export default function SupplierCard({
  supplier,
  supplierTypes,
  onEdit,
  onDelete,
  onUpdate,
}: {
  supplier: Supplier
  supplierTypes: string[]
  onEdit: () => void
  onDelete: () => void
  onUpdate: (data: any) => void
}) {
  const paymentStatusLabels = {
    A_PAGAR: 'A Pagar',
    PAGO_PARCIALMENTE: 'Pago Parcialmente',
    PAGO: 'Pago',
  }

  const paymentStatusColors = {
    A_PAGAR: 'bg-yellow-100 text-yellow-800',
    PAGO_PARCIALMENTE: 'bg-blue-100 text-blue-800',
    PAGO: 'bg-green-100 text-green-800',
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-bold text-gray-800">{supplier.name}</h3>
            <span className="px-2 py-1 bg-wedding-100 text-wedding-700 rounded text-xs font-medium">
              {supplier.type}
            </span>
          </div>
          {supplier.contactName && (
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Contato:</span> {supplier.contactName}
            </p>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {supplier.phone && (
              <a
                href={`tel:${supplier.phone}`}
                className="inline-flex items-center space-x-1 text-wedding-600 hover:underline text-sm"
              >
                <Phone size={14} />
                <span>{supplier.phone}</span>
              </a>
            )}
            {supplier.email && (
              <a
                href={`mailto:${supplier.email}`}
                className="inline-flex items-center space-x-1 text-wedding-600 hover:underline text-sm"
              >
                <Mail size={14} />
                <span>{supplier.email}</span>
              </a>
            )}
          </div>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={onEdit}
            className="p-2 text-gray-600 hover:text-wedding-600 hover:bg-wedding-50 rounded-lg touch-target"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg touch-target"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Valor Combinado</p>
          <p className="text-lg font-bold text-gray-800">
            R$ {supplier.agreedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Status de Pagamento</p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${paymentStatusColors[supplier.paymentStatus]}`}
          >
            {paymentStatusLabels[supplier.paymentStatus]}
          </span>
        </div>
      </div>

      {supplier.notes && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Observações:</span> {supplier.notes}
          </p>
        </div>
      )}
    </div>
  )
}

