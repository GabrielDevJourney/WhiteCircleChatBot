'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ChatMessages } from '@/components/chat-messages'
import { ChatInput } from '@/components/chat-input'
import { createConversation } from '@/app/actions/conversations'

export default function Home() {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)

  async function handleSend(text: string) {
    if (isCreating) return
    setIsCreating(true)

    const title = text.length > 100 ? text.slice(0, 100) + '...' : text
    const id = await createConversation(title)

    // Store the first message so the conversation page can pick it up
    sessionStorage.setItem(`pending-message-${id}`, text)
    router.push(`/${id}`)
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      <ChatMessages messages={[]} />
      <ChatInput
        onSend={handleSend}
        status={isCreating ? 'submitted' : 'ready'}
      />
    </div>
  )
}
