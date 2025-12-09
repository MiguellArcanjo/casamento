'use client'

import { useState } from 'react'
import { Plus, StickyNote } from 'lucide-react'
import NoteForm from './NoteForm'
import NoteCard from './NoteCard'

interface Note {
  id: string
  title: string | null
  content: string
  type: 'GERAL' | 'DECORACAO' | 'MUSICA' | 'CARTA' | 'VOTOS' | 'PLAYLIST'
}

export default function NotesContent({
  initialNotes,
  noteTypes,
  weddingId,
}: {
  initialNotes: Note[]
  noteTypes: { value: string; label: string }[]
  weddingId: string
}) {
  const [notes, setNotes] = useState(initialNotes)
  const [showForm, setShowForm] = useState(false)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [editingNote, setEditingNote] = useState<Note | null>(null)

  const filteredNotes =
    selectedType === 'all'
      ? notes
      : notes.filter((note) => note.type === selectedType)

  const handleAdd = async (data: any) => {
    const url = editingNote ? `/api/anotacoes/${editingNote.id}` : '/api/anotacoes'
    const method = editingNote ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, weddingId }),
    })

    if (res.ok) {
      const note = await res.json()
      if (editingNote) {
        setNotes(notes.map((n) => (n.id === note.id ? note : n)))
      } else {
        setNotes([note, ...notes])
      }
      setShowForm(false)
      setEditingNote(null)
    }
  }

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/anotacoes/${id}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      setNotes(notes.filter((n) => n.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium touch-target ${
              selectedType === 'all'
                ? 'bg-wedding-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Todas
          </button>
          {noteTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium touch-target ${
                selectedType === type.value
                  ? 'bg-wedding-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          setEditingNote(null)
          setShowForm(true)
        }}
        className="w-full bg-wedding-600 text-white py-4 rounded-xl font-medium hover:bg-wedding-700 transition-colors flex items-center justify-center space-x-2 touch-target shadow-lg"
      >
        <Plus size={20} />
        <span>Nova Anotação</span>
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <NoteForm
              noteTypes={noteTypes}
              initialData={editingNote}
              onSubmit={handleAdd}
              onCancel={() => {
                setShowForm(false)
                setEditingNote(null)
              }}
            />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredNotes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <StickyNote size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Nenhuma anotação cadastrada ainda</p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              noteTypes={noteTypes}
              onEdit={() => {
                setEditingNote(note)
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

