"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const demoPages = [
  { name: "DynamicForm", href: "/demo" },
  { name: "DynamicTable", href: "/demo/table" },
  { name: "StatCards", href: "/demo/stat-cards" },
]

export function DemoNavigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-muted/30 border-b mb-6">
      <div className="container mx-auto px-4">
        <div className="flex space-x-1 py-2">
          {demoPages.map((page) => {
            const isActive = pathname === page.href
            return (
              <Link
                key={page.href}
                href={page.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {page.name}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
