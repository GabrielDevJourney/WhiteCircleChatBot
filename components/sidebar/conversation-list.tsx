'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageCircle } from 'lucide-react'
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import type { Conversation } from '@/lib/types'

export function ConversationList({
  conversations,
}: {
  conversations: Conversation[]
}) {
  const pathname = usePathname()

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-muted-foreground/60">
          Conversations
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {conversations.map((conv) => (
              <SidebarMenuItem key={conv.id}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === `/${conv.id}`}
                  className="gap-2 rounded-lg"
                >
                  <Link href={`/${conv.id}`}>
                    <MessageCircle className="size-3.5 shrink-0 opacity-50" />
                    <span className="truncate">{conv.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            {conversations.length === 0 && (
              <p className="px-3 py-6 text-center text-xs text-muted-foreground/50">
                No conversations yet
              </p>
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  )
}
