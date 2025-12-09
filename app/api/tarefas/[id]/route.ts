import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.wedding) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const data = await request.json()
    const { description, deadline, stage, responsible, priority, completed } = data

    const task = await prisma.task.findUnique({
      where: { id: params.id },
    })

    if (!task || task.weddingId !== user.wedding.id) {
      return NextResponse.json({ error: 'Tarefa não encontrada' }, { status: 404 })
    }

    const updated = await prisma.task.update({
      where: { id: params.id },
      data: {
        description: description !== undefined ? description : task.description,
        deadline: deadline !== undefined ? new Date(deadline) : task.deadline,
        stage: stage !== undefined ? stage : task.stage,
        responsible: responsible !== undefined ? responsible : task.responsible,
        priority: priority !== undefined ? priority : task.priority,
        completed: completed !== undefined ? completed : task.completed,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar tarefa' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.wedding) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const task = await prisma.task.findUnique({
      where: { id: params.id },
    })

    if (!task || task.weddingId !== user.wedding.id) {
      return NextResponse.json({ error: 'Tarefa não encontrada' }, { status: 404 })
    }

    await prisma.task.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Tarefa excluída com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir tarefa:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir tarefa' },
      { status: 500 }
    )
  }
}

