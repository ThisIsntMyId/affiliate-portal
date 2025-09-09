'use client'

import { cn } from '@/lib/utils'

interface ToolbarGroupProps {
  children: React.ReactNode
  className?: string
}

export function ToolbarGroup({ children, className }: ToolbarGroupProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {children}
    </div>
  )
}
