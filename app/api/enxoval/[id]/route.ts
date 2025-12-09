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
    const { name, category, estimatedPrice, store, link, status } = data

    const item = await prisma.registryItem.findUnique({
      where: { id: params.id },
    })

    if (!item || item.weddingId !== user.wedding.id) {
      return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 })
    }

    const updated = await prisma.registryItem.update({
      where: { id: params.id },
      data: {
        name: name || item.name,
        category: category || item.category,
        estimatedPrice: estimatedPrice !== undefined ? estimatedPrice : item.estimatedPrice,
        store: store !== undefined ? store : item.store,
        link: link !== undefined ? link : item.link,
        status: status || item.status,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Erro ao atualizar item:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar item' },
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

    const item = await prisma.registryItem.findUnique({
      where: { id: params.id },
    })

    if (!item || item.weddingId !== user.wedding.id) {
      return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 })
    }

    await prisma.registryItem.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Item excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir item:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir item' },
      { status: 500 }
    )
  }
}

