import { convertToModelMessages, streamText, type UIMessage } from 'ai'
import { prisma } from '@/lib/prisma'
import { chatModel } from '@/lib/ai'
import { CHAT_SYSTEM_PROMPT } from '@/lib/prompts'
import { revalidatePath } from 'next/cache'

export async function POST(req: Request) {
  const { messages, conversationId } = await req.json()

  const result = streamText({
    model: chatModel,
    system: CHAT_SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    async onFinish({ text }) {
      if (!conversationId) return

      const lastUserMessage = [...messages]
        .reverse()
        .find((m: UIMessage) => m.role === 'user')

      const toSave = []

      if (lastUserMessage) {
        toSave.push({
          conversationId,
          role: 'user',
          parts: lastUserMessage.parts,
        })
      }

      toSave.push({
        conversationId,
        role: 'assistant',
        parts: [{ type: 'text', text }],
      })

      await prisma.$transaction([
        prisma.message.createMany({ data: toSave }),
        prisma.conversation.update({
          where: { id: conversationId },
          data: { updatedAt: new Date() },
        }),
      ])

      revalidatePath('/')
    },
  })

  return result.toUIMessageStreamResponse({
    messageMetadata({ part }) {
      if (part.type === 'finish') {
        return { outputTokens: part.totalUsage.outputTokens }
      }
    },
  })
}
