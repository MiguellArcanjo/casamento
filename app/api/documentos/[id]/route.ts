import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.wedding) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()
    const { type, title, description, link, notes } = data

    const document = await prisma.document.findUnique({
      where: { id },
    })

    if (!document || document.weddingId !== user.wedding.id) {
      return NextResponse.json({ error: 'Documento não encontrado' }, { status: 404 })
    }

    const updated = await prisma.document.update({
      where: { id },
      data: {
        type: type !== undefined ? type : document.type,
        title: title !== undefined ? title : document.title,
        description: description !== undefined ? description : document.description,
        link: link !== undefined ? link : document.link,
        notes: notes !== undefined ? notes : document.notes,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Erro ao atualizar documento:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar documento' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.wedding) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const document = await prisma.document.findUnique({
      where: { id },
    })

    if (!document || document.weddingId !== user.wedding.id) {
      return NextResponse.json({ error: 'Documento não encontrado' }, { status: 404 })
    }

    await prisma.document.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Documento excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir documento:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir documento' },
      { status: 500 }
    )
  }
}

