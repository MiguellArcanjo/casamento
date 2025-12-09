import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const data = await request.json()
    const {
      coupleName,
      weddingDate,
      city,
      state,
      ceremonyType,
      currency,
      financialGoal,
      theme,
      userId,
    } = data

    if (!coupleName || !weddingDate || !city || !state) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    const wedding = await prisma.wedding.create({
      data: {
        coupleName,
        weddingDate: new Date(weddingDate),
        city,
        state,
        ceremonyType: ceremonyType || 'Civil',
        currency: currency || 'R$',
        financialGoal: parseFloat(financialGoal) || 0,
        theme: theme || 'light',
        userId,
      },
    })

    return NextResponse.json(wedding)
  } catch (error) {
    console.error('Erro ao criar casamento:', error)
    return NextResponse.json(
      { error: 'Erro ao criar casamento' },
      { status: 500 }
    )
  }
}

