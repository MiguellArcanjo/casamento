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
    const { name, address, time, mapsLink } = data

    const location = await prisma.location.findUnique({
      where: { id: params.id },
    })

    if (!location || location.weddingId !== user.wedding.id) {
      return NextResponse.json({ error: 'Local não encontrado' }, { status: 404 })
    }

    const updated = await prisma.location.update({
      where: { id: params.id },
      data: {
        name: name || location.name,
        address: address || location.address,
        time: time || location.time,
        mapsLink: mapsLink !== undefined ? mapsLink : location.mapsLink,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Erro ao atualizar local:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar local' },
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

    const location = await prisma.location.findUnique({
      where: { id: params.id },
    })

    if (!location || location.weddingId !== user.wedding.id) {
      return NextResponse.json({ error: 'Local não encontrado' }, { status: 404 })
    }

    await prisma.location.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Local excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir local:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir local' },
      { status: 500 }
    )
  }
}

