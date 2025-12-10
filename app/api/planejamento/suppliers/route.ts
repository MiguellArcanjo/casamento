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
    const {
      type,
      name,
      contactName,
      phone,
      email,
      agreedValue,
      paymentStatus,
      notes,
      weddingId,
    } = data

    if (!type || !name || !agreedValue) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    const supplier = await prisma.supplier.create({
      data: {
        type,
        name,
        contactName: contactName || null,
        phone: phone || null,
        email: email || null,
        agreedValue: parseFloat(agreedValue),
        paymentStatus: paymentStatus || 'A_PAGAR',
        notes: notes || null,
        weddingId,
      },
    })

    return NextResponse.json(supplier)
  } catch (error) {
    console.error('Erro ao criar fornecedor:', error)
    return NextResponse.json(
      { error: 'Erro ao criar fornecedor' },
      { status: 500 }
    )
  }
}



