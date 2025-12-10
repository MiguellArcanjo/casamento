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
    const { name, type, address, time, mapsLink, weddingId } = data

    if (!name || !type || !address || !time) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    // Verifica se já existe um local deste tipo
    const existing = await prisma.location.findFirst({
      where: {
        weddingId,
        type: type as 'CERIMONIA' | 'RECEPCAO',
      },
    })

    let location
    if (existing) {
      // Atualiza o existente
      location = await prisma.location.update({
        where: { id: existing.id },
        data: {
          name,
          address,
          time,
          mapsLink: mapsLink || null,
        },
      })
    } else {
      // Cria novo
      location = await prisma.location.create({
        data: {
          name,
          type: type as 'CERIMONIA' | 'RECEPCAO',
          address,
          time,
          mapsLink: mapsLink || null,
          weddingId,
        },
      })
    }

    return NextResponse.json(location)
  } catch (error) {
    console.error('Erro ao criar/atualizar local:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar local' },
      { status: 500 }
    )
  }
}



