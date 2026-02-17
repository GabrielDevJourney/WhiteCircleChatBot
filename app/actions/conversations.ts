'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createConversation(title: string) {
  const conversation = await prisma.conversation.create({
    data: { title },
  })
  revalidatePath('/')
  return conversation.id
}

export async function getConversations() {
  return prisma.conversation.findMany({
    orderBy: { updatedAt: 'desc' },
    select: { id: true, title: true, updatedAt: true },
  })
}

export async function getConversation(id: string) {
  return prisma.conversation.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  })
}
