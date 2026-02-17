import { notFound } from 'next/navigation'
import { getConversation } from '@/app/actions/conversations'
import { ConversationChat } from './conversation-chat'

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const conversation = await getConversation(id)

  if (!conversation) {
    notFound()
  }

  const initialMessages = conversation.messages.map((msg) => ({
    id: msg.id,
    role: msg.role as 'user' | 'assistant',
    parts: msg.parts as Array<{ type: 'text'; text: string }>,
  }))

  return <ConversationChat conversationId={id} initialMessages={initialMessages} />
}
