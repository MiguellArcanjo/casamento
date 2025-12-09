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
    const { description, amount, paidBy, date, weddingId } = data

    if (!description || amount === undefined) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    const deposit = await prisma.deposit.create({
      data: {
        description,
        amount: parseFloat(amount),
        paidBy: paidBy || 'AMBOS',
        date: new Date(date),
        weddingId,
      },
    })

    return NextResponse.json(deposit)
  } catch (error) {
    console.error('Erro ao criar depósito:', error)
    return NextResponse.json(
      { error: 'Erro ao criar depósito' },
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

    const deposits = await prisma.deposit.findMany({
      where: { weddingId: user.wedding.id },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(deposits)
  } catch (error) {
    console.error('Erro ao buscar depósitos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar depósitos' },
      { status: 500 }
    )
  }
}

