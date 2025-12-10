'use client'

import { useState } from 'react'
import { Plus, FileText, ExternalLink } from 'lucide-react'
import DocumentForm from './DocumentForm'
import DocumentCard from './DocumentCard'

interface Document {
  id: string
  type: string
  title: string
  description: string | null
  link: string | null
  notes: string | null
}

export default function DocumentsContent({
  initialDocuments,
  documentTypes,
  weddingId,
}: {
  initialDocuments: Document[]
  documentTypes: string[]
  weddingId: string
}) {
  const [documents, setDocuments] = useState(initialDocuments)
  const [showForm, setShowForm] = useState(false)
  const [editingDocument, setEditingDocument] = useState<Document | null>(null)

  const handleAdd = async (data: any) => {
    const url = editingDocument
      ? `/api/documentos/${editingDocument.id}`
      : '/api/documentos'
    const method = editingDocument ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, weddingId }),
    })

    if (res.ok) {
      const document = await res.json()
      if (editingDocument) {
        setDocuments(documents.map((d) => (d.id === document.id ? document : d)))
      } else {
        setDocuments([document, ...documents])
      }
      setShowForm(false)
      setEditingDocument(null)
    }
  }

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/documentos/${id}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      setDocuments(documents.filter((d) => d.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => {
          setEditingDocument(null)
          setShowForm(true)
        }}
        className="w-full bg-wedding-600 text-white py-4 rounded-xl font-medium hover:bg-wedding-700 transition-colors flex items-center justify-center space-x-2 touch-target shadow-lg"
      >
        <Plus size={20} />
        <span>Adicionar Documento</span>
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <DocumentForm
              documentTypes={documentTypes}
              initialData={editingDocument}
              onSubmit={handleAdd}
              onCancel={() => {
                setShowForm(false)
                setEditingDocument(null)
              }}
            />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {documents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Nenhum documento cadastrado ainda</p>
          </div>
        ) : (
          documents.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              documentTypes={documentTypes}
              onEdit={() => {
                setEditingDocument(document)
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



