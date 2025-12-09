'use client'

import { Edit, Trash2, ExternalLink } from 'lucide-react'

interface Document {
  id: string
  type: string
  title: string
  description: string | null
  link: string | null
  notes: string | null
}

export default function DocumentCard({
  document,
  documentTypes,
  onEdit,
  onDelete,
}: {
  document: Document
  documentTypes: string[]
  onEdit: () => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-bold text-gray-800">{document.title}</h3>
            <span className="px-2 py-1 bg-wedding-100 text-wedding-700 rounded text-xs font-medium">
              {document.type}
            </span>
          </div>
          {document.description && (
            <p className="text-sm text-gray-600 mb-2">{document.description}</p>
          )}
          {document.link && (
            <a
              href={document.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-wedding-600 hover:underline text-sm mb-2"
            >
              <ExternalLink size={14} />
              <span>Abrir link</span>
            </a>
          )}
          {document.notes && (
            <div className="mt-2 pt-2 border-t">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Observações:</span> {document.notes}
              </p>
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
            onClick={() => onDelete(document.id)}
            className="p-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg touch-target"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

