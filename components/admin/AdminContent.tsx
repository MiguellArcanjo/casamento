'use client'

import { useState } from 'react'
import { Save, Calendar, DollarSign, Users } from 'lucide-react'
import WeddingForm from './WeddingForm'

interface Wedding {
  id: string
  coupleName: string
  weddingDate: Date
  city: string
  state: string
  ceremonyType: string
  currency: string
  financialGoal: number
  theme: string
}

export default function AdminContent({
  initialWedding,
  userId,
}: {
  initialWedding: Wedding | null
  userId: string
}) {
  const [wedding, setWedding] = useState(initialWedding)
  const [showForm, setShowForm] = useState(!initialWedding)
  const [saving, setSaving] = useState(false)

  const handleSave = async (data: any) => {
    setSaving(true)
    try {
      const url = wedding ? `/api/admin/wedding/${wedding.id}` : '/api/admin/wedding'
      const method = wedding ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, userId }),
      })

      if (res.ok) {
        const saved = await res.json()
        setWedding(saved)
        setShowForm(false)
        window.location.reload()
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
    } finally {
      setSaving(false)
    }
  }

  if (!wedding && !showForm) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <p className="text-gray-600 mb-4">Nenhuma configuração encontrada</p>
        <button
          onClick={() => setShowForm(true)}
          className="bg-wedding-600 text-white px-6 py-3 rounded-lg hover:bg-wedding-700 transition-colors touch-target"
        >
          Criar Configuração
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {showForm ? (
        <div className="bg-white rounded-xl shadow-md p-6">
          <WeddingForm
            initialData={wedding}
            onSubmit={handleSave}
            onCancel={wedding ? () => setShowForm(false) : undefined}
            saving={saving}
          />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Informações do Casamento</h2>
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-wedding-600 text-white rounded-lg hover:bg-wedding-700 transition-colors touch-target"
              >
                Editar
              </button>
            </div>
            {wedding && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Users size={20} className="text-wedding-600" />
                  <div>
                    <p className="text-sm text-gray-600">Casal</p>
                    <p className="font-bold text-gray-800">{wedding.coupleName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={20} className="text-wedding-600" />
                  <div>
                    <p className="text-sm text-gray-600">Data do Casamento</p>
                    <p className="font-bold text-gray-800">
                      {new Date(wedding.weddingDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Local</p>
                  <p className="font-bold text-gray-800">
                    {wedding.city}, {wedding.state}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tipo de Cerimônia</p>
                  <p className="font-bold text-gray-800">{wedding.ceremonyType}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign size={20} className="text-wedding-600" />
                  <div>
                    <p className="text-sm text-gray-600">Meta Financeira</p>
                    <p className="font-bold text-gray-800">
                      {wedding.currency}{' '}
                      {wedding.financialGoal.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}



