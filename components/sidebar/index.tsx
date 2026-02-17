'use client'

import { ChatSidebarHeader } from './sidebar-header'
import { ConversationList } from './conversation-list'
import type { Conversation } from '@/lib/types'

export function ChatSidebar({
  conversations,
}: {
  conversations: Conversation[]
}) {
  return (
    <>
      <ChatSidebarHeader />
      <ConversationList conversations={conversations} />
    </>
  )
}
