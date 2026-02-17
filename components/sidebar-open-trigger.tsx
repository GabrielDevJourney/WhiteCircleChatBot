'use client'

import { PanelLeftIcon } from 'lucide-react'
import { useSidebar } from '@/components/ui/sidebar'

export function SidebarOpenTrigger() {
  const { state, toggleSidebar } = useSidebar()

  if (state === 'expanded') return null

  return (
    <button
      onClick={toggleSidebar}
      className="fixed left-3 top-3 z-30 flex size-9 items-center justify-center rounded-lg border border-border/50 bg-card/80 text-muted-foreground/70 shadow-sm backdrop-blur-sm transition-all hover:bg-card hover:text-foreground hover:shadow-md"
    >
      <PanelLeftIcon className="size-4" />
    </button>
  )
}
