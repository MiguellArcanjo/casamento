import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Layout from '@/components/Layout'
import DocumentsContent from '@/components/documentos/DocumentsContent'

async function getDocuments(weddingId: string) {
  return await prisma.document.findMany({
    where: { weddingId },
    orderBy: { createdAt: 'desc' },
  })
}

const documentTypes = [
  'Documentos para Cartório',
  'Documentos para Igreja',
  'Contratos com Fornecedores',
  'Cronograma do Dia',
  'Outros',
]

export default async function DocumentosPage() {
  const user = await getCurrentUser()

  if (!user || !user.wedding) {
    redirect('/login')
  }

  const documents = await getDocuments(user.wedding.id)

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-serif font-bold text-wedding-800">
          Documentos e Itens Importantes
        </h1>

        <DocumentsContent
          initialDocuments={documents}
          documentTypes={documentTypes}
          weddingId={user.wedding.id}
        />
      </div>
    </Layout>
  )
}



