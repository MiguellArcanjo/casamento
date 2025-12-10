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
    const { title, content, type, weddingId } = data

    if (!content) {
      return NextResponse.json(
        { error: 'Conteúdo é obrigatório' },
        { status: 400 }
      )
    }

    const note = await prisma.note.create({
      data: {
        title: title || null,
        content,
        type: type || 'GERAL',
        weddingId,
      },
    })

    return NextResponse.json(note)
  } catch (error) {
    console.error('Erro ao criar anotação:', error)
    return NextResponse.json(
      { error: 'Erro ao criar anotação' },
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

    const notes = await prisma.note.findMany({
      where: { weddingId: user.wedding.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(notes)
  } catch (error) {
    console.error('Erro ao buscar anotações:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar anotações' },
      { status: 500 }
    )
  }
}



