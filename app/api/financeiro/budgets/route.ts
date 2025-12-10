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
    const { category, amount, description, weddingId } = data

    if (!category || amount === undefined) {
      return NextResponse.json(
        { error: 'Categoria e valor são obrigatórios' },
        { status: 400 }
      )
    }

    // Verifica se já existe orçamento para esta categoria
    const existing = await prisma.budget.findUnique({
      where: {
        weddingId_category: {
          weddingId,
          category,
        },
      },
    })

    let budget
    if (existing) {
      // Atualiza o existente
      budget = await prisma.budget.update({
        where: { id: existing.id },
        data: {
          amount: parseFloat(amount),
          description: description || null,
        },
      })
    } else {
      // Cria novo
      budget = await prisma.budget.create({
        data: {
          category,
          amount: parseFloat(amount),
          description: description || null,
          weddingId,
        },
      })
    }

    return NextResponse.json(budget)
  } catch (error) {
    console.error('Erro ao criar/atualizar orçamento:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar orçamento' },
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

    const budgets = await prisma.budget.findMany({
      where: { weddingId: user.wedding.id },
      orderBy: { category: 'asc' },
    })

    return NextResponse.json(budgets)
  } catch (error) {
    console.error('Erro ao buscar orçamentos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar orçamentos' },
      { status: 500 }
    )
  }
}

