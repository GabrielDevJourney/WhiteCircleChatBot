'use client'

import { useChat } from '@ai-sdk/react'
import type { UIMessage } from 'ai'
import { useEffect, useRef, useState } from 'react'
import { ChatMessages } from '@/components/chat-messages'
import { ChatInput } from '@/components/chat-input'
import { scanPii } from '@/app/actions/pii'
import type { MessageMetadata, PiiSpan } from '@/lib/types'

export function ConversationChat({
  conversationId,
  initialMessages,
}: {
  conversationId: string
  initialMessages: Array<{
    id: string
    role: 'user' | 'assistant'
    parts: Array<{ type: 'text'; text: string }>
    piiSpans: Array<{ start: number; end: number; type: string; text: string }> | null
  }>
}) {
  const hasSentPending = useRef(false)
  const [piiMap, setPiiMap] = useState<Map<string, PiiSpan[]>>(() => {
    const map = new Map<string, PiiSpan[]>()
    for (const msg of initialMessages) {
      if (msg.role === 'user' && msg.piiSpans && msg.piiSpans.length > 0) {
        const text = msg.parts.map((p) => p.text).join('')
        map.set(text, msg.piiSpans)
      }
    }
    return map
  })
  const [pendingPiiTexts, setPendingPiiTexts] = useState<Set<string>>(new Set())

  const { messages, status, error, sendMessage, regenerate } = useChat<
    UIMessage<MessageMetadata>
  >({
    messages: initialMessages as UIMessage<MessageMetadata>[],
  })

  const sendMessageRef = useRef(sendMessage)
  useEffect(() => {
    sendMessageRef.current = sendMessage
  }, [sendMessage])

  async function handleSend(text: string) {
    setPendingPiiTexts((prev) => new Set(prev).add(text))

    const spans = await scanPii(text)
    setPiiMap((prev) => new Map(prev).set(text, spans))
    setPendingPiiTexts((prev) => {
      const next = new Set(prev)
      next.delete(text)
      return next
    })

    sendMessageRef.current({ text }, { body: { conversationId, piiSpans: spans } })
  }

  useEffect(() => {
    if (hasSentPending.current) return
    hasSentPending.current = true

    const key = `pending-message-${conversationId}`
    const pendingText = sessionStorage.getItem(key)
    if (pendingText) {
      sessionStorage.removeItem(key)
      queueMicrotask(() => handleSend(pendingText))
    }
  })

  return (
    <div className="flex flex-1 flex-col bg-background">
      <ChatMessages
        messages={messages}
        piiMap={piiMap}
        pendingPiiTexts={pendingPiiTexts}
      />
      {error && (
        <div className="flex items-center gap-2 px-4 py-2 text-sm text-destructive">
          <span>Something went wrong.</span>
          <button
            onClick={() => regenerate()}
            className="underline underline-offset-2"
          >
            Try again
          </button>
        </div>
      )}
      <ChatInput onSend={handleSend} status={status} />
    </div>
  )
}
