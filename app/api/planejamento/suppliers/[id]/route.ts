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
    const {
      type,
      name,
      contactName,
      phone,
      email,
      agreedValue,
      paymentStatus,
      notes,
    } = data

    const supplier = await prisma.supplier.findUnique({
      where: { id: params.id },
    })

    if (!supplier || supplier.weddingId !== user.wedding.id) {
      return NextResponse.json({ error: 'Fornecedor não encontrado' }, { status: 404 })
    }

    const updated = await prisma.supplier.update({
      where: { id: params.id },
      data: {
        type: type || supplier.type,
        name: name || supplier.name,
        contactName: contactName !== undefined ? contactName : supplier.contactName,
        phone: phone !== undefined ? phone : supplier.phone,
        email: email !== undefined ? email : supplier.email,
        agreedValue: agreedValue !== undefined ? parseFloat(agreedValue) : supplier.agreedValue,
        paymentStatus: paymentStatus || supplier.paymentStatus,
        notes: notes !== undefined ? notes : supplier.notes,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Erro ao atualizar fornecedor:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar fornecedor' },
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

    const supplier = await prisma.supplier.findUnique({
      where: { id: params.id },
    })

    if (!supplier || supplier.weddingId !== user.wedding.id) {
      return NextResponse.json({ error: 'Fornecedor não encontrado' }, { status: 404 })
    }

    await prisma.supplier.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Fornecedor excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir fornecedor:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir fornecedor' },
      { status: 500 }
    )
  }
}

