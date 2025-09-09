'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'

interface DropdownItem {
  label: string
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
}

interface ToolbarDropdownProps {
  trigger: string | React.ReactNode
  items: DropdownItem[]
  className?: string
}

export function ToolbarDropdown({ trigger, items, className }: ToolbarDropdownProps) {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'h-8 px-2 text-sm font-medium hover:bg-gray-200',
            typeof trigger === 'string' && 'justify-start',
            className
          )}
        >
          {trigger}
          {typeof trigger === 'string' && <ChevronDown className="ml-1 h-3 w-3" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        {items.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => {
              if (!item.disabled) {
                item.onClick()
                setOpen(false)
              }
            }}
            disabled={item.disabled}
            className={cn(
              'cursor-pointer',
              item.isActive && 'bg-gray-100 font-medium',
              item.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
