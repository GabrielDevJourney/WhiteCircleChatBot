'use client'

import { useState } from 'react'
import { ArrowUp } from 'lucide-react'
import type { ChatStatus } from 'ai'

interface ChatInputProps {
  onSend: (text: string) => void
  status: ChatStatus
}

export function ChatInput({ onSend, status }: ChatInputProps) {
  const [input, setInput] = useState('')

  const isDisabled = status === 'submitted' || status === 'streaming'

  const onSubmit = () => {
    if (!input.trim() || isDisabled) return
    onSend(input)
    setInput('')
  }

  return (
    <div className="px-4 py-3 sm:px-6">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
        className="mx-auto flex max-w-3xl items-center gap-3"
      >
        <div className="relative flex-1">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a message..."
            className="w-full rounded-xl border border-border/60 bg-background/80 px-4 py-2.5 text-sm text-foreground shadow-sm transition-all placeholder:text-muted-foreground/50 focus:border-primary/40 focus:shadow-md focus:shadow-primary/5 focus:outline-none disabled:opacity-50"
            disabled={isDisabled}
          />
        </div>
        <button
          type="submit"
          disabled={isDisabled || !input.trim()}
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-indigo-500 text-white shadow-md shadow-violet-500/20 transition-all hover:shadow-lg hover:shadow-violet-500/30 disabled:opacity-30 disabled:shadow-none"
        >
          <ArrowUp className="size-4" />
        </button>
      </form>
    </div>
  )
}
