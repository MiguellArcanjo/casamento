import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.wedding) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const data = await request.json()
    const { type, title, description, link, notes, weddingId } = data

    if (!type || !title) {
      return NextResponse.json(
        { error: 'Tipo e título são obrigatórios' },
        { status: 400 }
      )
    }

    const document = await prisma.document.create({
      data: {
        type,
        title,
        description: description || null,
        link: link || null,
        notes: notes || null,
        weddingId,
      },
    })

    return NextResponse.json(document)
  } catch (error) {
    console.error('Erro ao criar documento:', error)
    return NextResponse.json(
      { error: 'Erro ao criar documento' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.wedding) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const documents = await prisma.document.findMany({
      where: { weddingId: user.wedding.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error('Erro ao buscar documentos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar documentos' },
      { status: 500 }
    )
  }
}

