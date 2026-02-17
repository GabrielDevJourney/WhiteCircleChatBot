'use client'

import { useEffect, useRef } from 'react'
import type { UIMessage } from 'ai'
import type { MessageMetadata, PiiSpan } from '@/lib/types'
import { PiiText } from '@/components/pii-blur'

export function ChatMessages({
  messages,
  piiMap,
  pendingPiiTexts,
}: {
  messages: UIMessage<MessageMetadata>[]
  piiMap?: Map<string, PiiSpan[]>
  pendingPiiTexts?: Set<string>
}) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  let gateIndex = -1
  for (let i = 0; i < messages.length; i++) {
    if (
      messages[i].role === 'user' &&
      pendingPiiTexts?.has(getMessageText(messages[i]))
    ) {
      gateIndex = i
      break
    }
  }

  return (
    <div className="chat-gradient flex flex-1 flex-col gap-5 overflow-y-auto px-4 py-6 sm:px-6">
      {messages.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500 to-indigo-500 text-2xl text-white shadow-lg shadow-violet-500/20">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 12 3z"
                fill="currentColor"
                opacity="0.2"
              />
              <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 12 3z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-foreground/70">
            What can I help you with?
          </p>
        </div>
      )}

      {messages.map((message, index) => {
        if (gateIndex >= 0 && index >= gateIndex) {
          if (index === gateIndex) {
            return (
              <div key={message.id} className="flex justify-end">
                <div className="max-w-[75%]">
                  <div className="shimmer-scan rounded-2xl rounded-br-md bg-primary/10 px-4 py-3 text-sm text-muted-foreground">
                    Scanning for sensitive info&hellip;
                  </div>
                </div>
              </div>
            )
          }
          return null
        }

        const isUser = message.role === 'user'
        const text = getMessageText(message)
        const spans = isUser && piiMap ? piiMap.get(text) : undefined

        return (
          <div
            key={message.id}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex max-w-[75%] flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? 'rounded-br-md bg-linear-to-br from-violet-500 to-indigo-500 text-white shadow-violet-500/15'
                    : 'rounded-bl-md border border-border/50 bg-card text-foreground shadow-black/3'
                }`}
              >
                {message.parts.map((part, i) => {
                  if (part.type === 'text') {
                    if (spans && spans.length > 0) {
                      return <PiiText key={i} text={part.text} spans={spans} />
                    }
                    return <span key={i}>{part.text}</span>
                  }
                  return null
                })}
              </div>
              {!isUser && message.metadata?.outputTokens && (
                <span className="px-1 text-[11px] tracking-wide text-muted-foreground/60">
                  {message.metadata.outputTokens} tokens
                </span>
              )}
            </div>
          </div>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}

function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('')
}
