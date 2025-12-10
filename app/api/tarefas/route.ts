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
    const { description, deadline, stage, responsible, priority, weddingId } = data

    if (!description || !deadline || !stage) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    const task = await prisma.task.create({
      data: {
        description,
        deadline: new Date(deadline),
        stage: stage as any,
        responsible: responsible || 'AMBOS',
        priority: priority || 'MEDIA',
        weddingId,
      },
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error('Erro ao criar tarefa:', error)
    return NextResponse.json(
      { error: 'Erro ao criar tarefa' },
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

    const tasks = await prisma.task.findMany({
      where: { weddingId: user.wedding.id },
      orderBy: [
        { deadline: 'asc' },
        { priority: 'desc' },
      ],
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar tarefas' },
      { status: 500 }
    )
  }
}



