import { cookies } from 'next/headers'
import { prisma } from './prisma'

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value

  if (!userId) {
    return null
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { wedding: true },
    })

    return user
  } catch (error) {
    return null
  }
}

