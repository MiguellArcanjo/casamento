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
    const { category, amount, description } = data

    const budget = await prisma.budget.findUnique({
      where: { id },
    })

    if (!budget || budget.weddingId !== user.wedding.id) {
      return NextResponse.json({ error: 'Orçamento não encontrado' }, { status: 404 })
    }

    const updated = await prisma.budget.update({
      where: { id },
      data: {
        category: category !== undefined ? category : budget.category,
        amount: amount !== undefined ? parseFloat(amount) : budget.amount,
        description: description !== undefined ? description : budget.description,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Erro ao atualizar orçamento:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar orçamento' },
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
    const budget = await prisma.budget.findUnique({
      where: { id },
    })

    if (!budget || budget.weddingId !== user.wedding.id) {
      return NextResponse.json({ error: 'Orçamento não encontrado' }, { status: 404 })
    }

    await prisma.budget.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Orçamento excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir orçamento:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir orçamento' },
      { status: 500 }
    )
  }
}

