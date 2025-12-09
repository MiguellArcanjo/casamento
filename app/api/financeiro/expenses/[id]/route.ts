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
    const { name, category, estimatedValue, actualValue, paidBy, paymentStatus } = data

    const expense = await prisma.expense.findUnique({
      where: { id },
    })

    if (!expense || expense.weddingId !== user.wedding.id) {
      return NextResponse.json({ error: 'Gasto não encontrado' }, { status: 404 })
    }

    const updated = await prisma.expense.update({
      where: { id },
      data: {
        name: name !== undefined ? name : expense.name,
        category: category !== undefined ? category : expense.category,
        estimatedValue:
          estimatedValue !== undefined ? parseFloat(estimatedValue) : expense.estimatedValue,
        actualValue:
          actualValue !== undefined
            ? actualValue === null
              ? null
              : parseFloat(actualValue)
            : expense.actualValue,
        paidBy: paidBy !== undefined ? paidBy : expense.paidBy,
        paymentStatus: paymentStatus !== undefined ? paymentStatus : expense.paymentStatus,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Erro ao atualizar gasto:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar gasto' },
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
    const expense = await prisma.expense.findUnique({
      where: { id },
    })

    if (!expense || expense.weddingId !== user.wedding.id) {
      return NextResponse.json({ error: 'Gasto não encontrado' }, { status: 404 })
    }

    await prisma.expense.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Gasto excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir gasto:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir gasto' },
      { status: 500 }
    )
  }
}

