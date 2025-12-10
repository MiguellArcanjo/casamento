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
    const { name, companions, phone, contact, status, family, isGodparent, godparentType, weddingId } = data

    if (!name) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      )
    }

    const guest = await prisma.guest.create({
      data: {
        name,
        companions: companions || 0,
        phone: phone || null,
        contact: contact || null,
        status: status || 'NAO_CONVIDADO',
        family: family || null,
        isGodparent: isGodparent || false,
        godparentType: isGodparent && godparentType ? godparentType : null,
        weddingId,
      },
    })

    return NextResponse.json(guest)
  } catch (error) {
    console.error('Erro ao criar convidado:', error)
    return NextResponse.json(
      { error: 'Erro ao criar convidado' },
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

    const guests = await prisma.guest.findMany({
      where: { weddingId: user.wedding.id },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(guests)
  } catch (error) {
    console.error('Erro ao buscar convidados:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar convidados' },
      { status: 500 }
    )
  }
}



