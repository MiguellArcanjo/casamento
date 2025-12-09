import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
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
    } = data

    const wedding = await prisma.wedding.findUnique({
      where: { id },
    })

    if (!wedding || wedding.userId !== user.id) {
      return NextResponse.json({ error: 'Casamento não encontrado' }, { status: 404 })
    }

    const updated = await prisma.wedding.update({
      where: { id },
      data: {
        coupleName: coupleName !== undefined ? coupleName : wedding.coupleName,
        weddingDate: weddingDate !== undefined ? new Date(weddingDate) : wedding.weddingDate,
        city: city !== undefined ? city : wedding.city,
        state: state !== undefined ? state : wedding.state,
        ceremonyType: ceremonyType !== undefined ? ceremonyType : wedding.ceremonyType,
        currency: currency !== undefined ? currency : wedding.currency,
        financialGoal:
          financialGoal !== undefined ? parseFloat(financialGoal) : wedding.financialGoal,
        theme: theme !== undefined ? theme : wedding.theme,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Erro ao atualizar casamento:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar casamento' },
      { status: 500 }
    )
  }
}

