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
    const { name, category, estimatedValue, actualValue, paidBy, paymentStatus, weddingId } = data

    if (!name || !category || estimatedValue === undefined) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    const expense = await prisma.expense.create({
      data: {
        name,
        category,
        estimatedValue: parseFloat(estimatedValue),
        actualValue: actualValue ? parseFloat(actualValue) : null,
        paidBy: paidBy || 'AMBOS',
        paymentStatus: paymentStatus || 'A_PAGAR',
        weddingId,
      },
    })

    return NextResponse.json(expense)
  } catch (error) {
    console.error('Erro ao criar gasto:', error)
    return NextResponse.json(
      { error: 'Erro ao criar gasto' },
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

    const expenses = await prisma.expense.findMany({
      where: { weddingId: user.wedding.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(expenses)
  } catch (error) {
    console.error('Erro ao buscar gastos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar gastos' },
      { status: 500 }
    )
  }
}

