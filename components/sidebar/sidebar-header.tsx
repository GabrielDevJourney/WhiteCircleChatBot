'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquarePlus } from 'lucide-react'
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar'

export function ChatSidebarHeader() {
  const pathname = usePathname()

  return (
    <SidebarHeader className="pb-2">
      <div className="flex items-center justify-between px-2 py-1">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-linear-to-br from-violet-500 to-indigo-500 text-white shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            White Circle
          </span>
        </div>
        <SidebarTrigger className="size-7 text-muted-foreground/60 hover:text-foreground" />
      </div>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={pathname === '/'}
            className="mt-1 gap-2 rounded-lg"
          >
            <Link href="/">
              <MessageSquarePlus className="size-4" />
              <span className="font-medium">New chat</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  )
}
