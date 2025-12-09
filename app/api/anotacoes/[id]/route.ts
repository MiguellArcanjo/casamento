import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.wedding) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const data = await request.json()
    const { title, content, type } = data

    const note = await prisma.note.findUnique({
      where: { id: params.id },
    })

    if (!note || note.weddingId !== user.wedding.id) {
      return NextResponse.json({ error: 'Anotação não encontrada' }, { status: 404 })
    }

    const updated = await prisma.note.update({
      where: { id: params.id },
      data: {
        title: title !== undefined ? title : note.title,
        content: content !== undefined ? content : note.content,
        type: type !== undefined ? type : note.type,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Erro ao atualizar anotação:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar anotação' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.wedding) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const note = await prisma.note.findUnique({
      where: { id: params.id },
    })

    if (!note || note.weddingId !== user.wedding.id) {
      return NextResponse.json({ error: 'Anotação não encontrada' }, { status: 404 })
    }

    await prisma.note.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Anotação excluída com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir anotação:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir anotação' },
      { status: 500 }
    )
  }
}

