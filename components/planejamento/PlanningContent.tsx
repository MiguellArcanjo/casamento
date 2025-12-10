'use client'

import { useState } from 'react'
import { MapPin, Plus, Edit, Trash2, ExternalLink, Phone, Mail } from 'lucide-react'
import LocationForm from './LocationForm'
import SupplierForm from './SupplierForm'
import SupplierCard from './SupplierCard'

interface Location {
  id: string
  name: string
  type: 'CERIMONIA' | 'RECEPCAO'
  address: string
  time: string
  mapsLink: string | null
}

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

export default function PlanningContent({
  initialLocations,
  initialSuppliers,
  supplierTypes,
  weddingId,
}: {
  initialLocations: Location[]
  initialSuppliers: Supplier[]
  supplierTypes: string[]
  weddingId: string
}) {
  const [locations, setLocations] = useState(initialLocations)
  const [suppliers, setSuppliers] = useState(initialSuppliers)
  const [showLocationForm, setShowLocationForm] = useState(false)
  const [showSupplierForm, setShowSupplierForm] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)

  const ceremonyLocation = locations.find((l) => l.type === 'CERIMONIA')
  const receptionLocation = locations.find((l) => l.type === 'RECEPCAO')

  const handleLocationSubmit = async (data: any) => {
    const url = editingLocation
      ? `/api/planejamento/locations/${editingLocation.id}`
      : '/api/planejamento/locations'
    const method = editingLocation ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, weddingId }),
    })

    if (res.ok) {
      const location = await res.json()
      if (editingLocation) {
        setLocations(locations.map((l) => (l.id === location.id ? location : l)))
      } else {
        setLocations([...locations, location])
      }
      setShowLocationForm(false)
      setEditingLocation(null)
    }
  }

  const handleSupplierSubmit = async (data: any) => {
    const url = editingSupplier
      ? `/api/planejamento/suppliers/${editingSupplier.id}`
      : '/api/planejamento/suppliers'
    const method = editingSupplier ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, weddingId }),
    })

    if (res.ok) {
      const supplier = await res.json()
      if (editingSupplier) {
        setSuppliers(suppliers.map((s) => (s.id === supplier.id ? supplier : s)))
      } else {
        setSuppliers([supplier, ...suppliers])
      }
      setShowSupplierForm(false)
      setEditingSupplier(null)
    }
  }

  const handleDeleteLocation = async (id: string) => {
    const res = await fetch(`/api/planejamento/locations/${id}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      setLocations(locations.filter((l) => l.id !== id))
    }
  }

  const handleDeleteSupplier = async (id: string) => {
    const res = await fetch(`/api/planejamento/suppliers/${id}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      setSuppliers(suppliers.filter((s) => s.id !== id))
    }
  }

  return (
    <div className="space-y-8">
      {/* Locais */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <MapPin size={24} className="text-wedding-600" />
            <span>Locais</span>
          </h2>
          <button
            onClick={() => {
              setEditingLocation(null)
              setShowLocationForm(true)
            }}
            className="bg-wedding-600 text-white px-4 py-2 rounded-lg hover:bg-wedding-700 transition-colors flex items-center space-x-2 touch-target"
          >
            <Plus size={18} />
            <span>Adicionar Local</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LocationCard
            location={ceremonyLocation}
            type="CERIMONIA"
            label="Cerimônia"
            onEdit={() => {
              setEditingLocation(ceremonyLocation || null)
              setShowLocationForm(true)
            }}
            onDelete={ceremonyLocation ? () => handleDeleteLocation(ceremonyLocation.id) : undefined}
          />
          <LocationCard
            location={receptionLocation}
            type="RECEPCAO"
            label="Recepção"
            onEdit={() => {
              setEditingLocation(receptionLocation || null)
              setShowLocationForm(true)
            }}
            onDelete={receptionLocation ? () => handleDeleteLocation(receptionLocation.id) : undefined}
          />
        </div>
      </section>

      {/* Fornecedores */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Fornecedores</h2>
          <button
            onClick={() => {
              setEditingSupplier(null)
              setShowSupplierForm(true)
            }}
            className="bg-wedding-600 text-white px-4 py-2 rounded-lg hover:bg-wedding-700 transition-colors flex items-center space-x-2 touch-target"
          >
            <Plus size={18} />
            <span>Adicionar Fornecedor</span>
          </button>
        </div>

        <div className="space-y-4">
          {suppliers.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-600">Nenhum fornecedor cadastrado ainda</p>
            </div>
          ) : (
            suppliers.map((supplier) => (
              <SupplierCard
                key={supplier.id}
                supplier={supplier}
                supplierTypes={supplierTypes}
                onEdit={() => {
                  setEditingSupplier(supplier)
                  setShowSupplierForm(true)
                }}
                onDelete={() => handleDeleteSupplier(supplier.id)}
                onUpdate={handleSupplierSubmit}
              />
            ))
          )}
        </div>
      </section>

      {/* Modals */}
      {showLocationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <LocationForm
              initialData={editingLocation}
              onSubmit={handleLocationSubmit}
              onCancel={() => {
                setShowLocationForm(false)
                setEditingLocation(null)
              }}
            />
          </div>
        </div>
      )}

      {showSupplierForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <SupplierForm
              initialData={editingSupplier}
              supplierTypes={supplierTypes}
              onSubmit={handleSupplierSubmit}
              onCancel={() => {
                setShowSupplierForm(false)
                setEditingSupplier(null)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function LocationCard({
  location,
  type,
  label,
  onEdit,
  onDelete,
}: {
  location: Location | undefined
  type: 'CERIMONIA' | 'RECEPCAO'
  label: string
  onEdit: () => void
  onDelete?: () => void
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-800">{label}</h3>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-2 text-gray-600 hover:text-wedding-600 hover:bg-wedding-50 rounded-lg touch-target"
          >
            <Edit size={18} />
          </button>
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg touch-target"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {location ? (
        <div className="space-y-2">
          <p className="font-medium text-gray-800">{location.name}</p>
          <p className="text-sm text-gray-600">{location.address}</p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Horário:</span> {location.time}
          </p>
          {location.mapsLink && (
            <a
              href={location.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-wedding-600 hover:underline text-sm"
            >
              <ExternalLink size={14} />
              <span>Ver no Google Maps</span>
            </a>
          )}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">Nenhum local cadastrado</p>
      )}
    </div>
  )
}



