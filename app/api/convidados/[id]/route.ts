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
    const { name, companions, phone, contact, status } = data

    const guest = await prisma.guest.findUnique({
      where: { id: params.id },
    })

    if (!guest || guest.weddingId !== user.wedding.id) {
      return NextResponse.json({ error: 'Convidado não encontrado' }, { status: 404 })
    }

    const updated = await prisma.guest.update({
      where: { id: params.id },
      data: {
        name: name !== undefined ? name : guest.name,
        companions: companions !== undefined ? companions : guest.companions,
        phone: phone !== undefined ? phone : guest.phone,
        contact: contact !== undefined ? contact : guest.contact,
        status: status !== undefined ? status : guest.status,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Erro ao atualizar convidado:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar convidado' },
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

    const guest = await prisma.guest.findUnique({
      where: { id: params.id },
    })

    if (!guest || guest.weddingId !== user.wedding.id) {
      return NextResponse.json({ error: 'Convidado não encontrado' }, { status: 404 })
    }

    await prisma.guest.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Convidado excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir convidado:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir convidado' },
      { status: 500 }
    )
  }
}

