import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Layout from '@/components/Layout'
import NotesContent from '@/components/anotacoes/NotesContent'

async function getNotes(weddingId: string) {
  return await prisma.note.findMany({
    where: { weddingId },
    orderBy: { createdAt: 'desc' },
  })
}

const noteTypes = [
  { value: 'GERAL', label: 'Geral' },
  { value: 'DECORACAO', label: 'Decoração' },
  { value: 'MUSICA', label: 'Música' },
  { value: 'CARTA', label: 'Carta' },
  { value: 'VOTOS', label: 'Votos' },
  { value: 'PLAYLIST', label: 'Playlist' },
]

export default async function AnotacoesPage() {
  const user = await getCurrentUser()

  if (!user || !user.wedding) {
    redirect('/login')
  }

  const notes = await getNotes(user.wedding.id)

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-serif font-bold text-wedding-800">
          Anotações e Inspirações
        </h1>

        <NotesContent initialNotes={notes} noteTypes={noteTypes} weddingId={user.wedding.id} />
      </div>
    </Layout>
  )
}

