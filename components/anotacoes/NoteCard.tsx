'use client'

import { Edit, Trash2 } from 'lucide-react'

interface Note {
  id: string
  title: string | null
  content: string
  type: 'GERAL' | 'DECORACAO' | 'MUSICA' | 'CARTA' | 'VOTOS' | 'PLAYLIST'
}

export default function NoteCard({
  note,
  noteTypes,
  onEdit,
  onDelete,
}: {
  note: Note
  noteTypes: { value: string; label: string }[]
  onEdit: () => void
  onDelete: (id: string) => void
}) {
  const typeLabel = noteTypes.find((t) => t.value === note.type)?.label || note.type

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {note.title && <h3 className="font-bold text-gray-800">{note.title}</h3>}
            <span className="px-2 py-1 bg-wedding-100 text-wedding-700 rounded text-xs font-medium">
              {typeLabel}
            </span>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={onEdit}
            className="p-2 text-gray-600 hover:text-wedding-600 hover:bg-wedding-50 rounded-lg touch-target"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg touch-target"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

