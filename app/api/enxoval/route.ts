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
    const { name, category, estimatedPrice, store, link, status, weddingId } = data

    if (!name || !category) {
      return NextResponse.json(
        { error: 'Nome e categoria são obrigatórios' },
        { status: 400 }
      )
    }

    const item = await prisma.registryItem.create({
      data: {
        name,
        category,
        estimatedPrice: estimatedPrice || null,
        store: store || null,
        link: link || null,
        status: status || 'PENDENTE',
        weddingId,
      },
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Erro ao criar item:', error)
    return NextResponse.json(
      { error: 'Erro ao criar item' },
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

    const items = await prisma.registryItem.findMany({
      where: { weddingId: user.wedding.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Erro ao buscar itens:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar itens' },
      { status: 500 }
    )
  }
}



