import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export interface StatCardProps {
  title: string
  subtitle?: string
  value: string | number
  icon?: React.ReactNode
  iconPosition?: "top-left" | "top-right"
  link?: string
  className?: string
}

export function StatCard({
  title,
  subtitle,
  value,
  icon,
  iconPosition = "top-right",
  link,
  className,
}: StatCardProps) {
  const CardWrapper = link ? "a" : "div"
  
  const cardContent = (
    <Card className={cn("transition-all duration-200 hover:shadow-md", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {icon && iconPosition === "top-left" && (
                <div className="flex-shrink-0 text-muted-foreground">
                  {icon}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium text-muted-foreground truncate">
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-xs text-muted-foreground/70 mt-0.5 truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
          {icon && iconPosition === "top-right" && (
            <div className="flex-shrink-0 text-muted-foreground">
              {icon}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-2xl font-bold text-foreground">
          {value}
        </div>
      </CardContent>
    </Card>
  )

  if (link) {
    return (
      <CardWrapper
        href={link}
        className="block no-underline text-inherit"
        target="_blank"
        rel="noopener noreferrer"
      >
        {cardContent}
      </CardWrapper>
    )
  }

  return cardContent
}
