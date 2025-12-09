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
    const { description, amount, paidBy, date } = data

    const deposit = await prisma.deposit.findUnique({
      where: { id: params.id },
    })

    if (!deposit || deposit.weddingId !== user.wedding.id) {
      return NextResponse.json({ error: 'Depósito não encontrado' }, { status: 404 })
    }

    const updated = await prisma.deposit.update({
      where: { id: params.id },
      data: {
        description: description !== undefined ? description : deposit.description,
        amount: amount !== undefined ? parseFloat(amount) : deposit.amount,
        paidBy: paidBy !== undefined ? paidBy : deposit.paidBy,
        date: date !== undefined ? new Date(date) : deposit.date,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Erro ao atualizar depósito:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar depósito' },
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

    const deposit = await prisma.deposit.findUnique({
      where: { id: params.id },
    })

    if (!deposit || deposit.weddingId !== user.wedding.id) {
      return NextResponse.json({ error: 'Depósito não encontrado' }, { status: 404 })
    }

    await prisma.deposit.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Depósito excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir depósito:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir depósito' },
      { status: 500 }
    )
  }
}

