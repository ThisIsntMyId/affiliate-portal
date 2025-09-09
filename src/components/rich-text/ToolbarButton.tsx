'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface ToolbarButtonProps {
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
  children: React.ReactNode
  className?: string
  title?: string
}

export function ToolbarButton({
  onClick,
  isActive = false,
  disabled = false,
  children,
  className,
  title,
}: ToolbarButtonProps) {
  return (
    <Button
      variant={isActive ? 'default' : 'ghost'}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'h-8 w-8 p-0 hover:bg-gray-200',
        isActive && 'bg-gray-200 text-gray-900',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </Button>
  )
}
