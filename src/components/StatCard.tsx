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
  description?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  color?: "green" | "red" | "blue" | "purple" | "orange" | "gray"
  progress?: number
  progressColor?: "green" | "red" | "blue" | "purple" | "orange" | "gray"
  size?: "small" | "medium" | "large"
}

export function StatCard({
  title,
  subtitle,
  value,
  icon,
  iconPosition = "top-right",
  link,
  className,
  description,
  trend,
  trendValue,
  color,
  progress,
  progressColor,
  size = "medium",
}: StatCardProps) {
  const CardWrapper = link ? "a" : "div"
  
  // Helper functions for styling
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "text-green-600"
      case "down": return "text-red-600"
      case "neutral": return "text-gray-600"
      default: return "text-gray-600"
    }
  }

  const getProgressColor = (color: string) => {
    switch (color) {
      case "green": return "bg-green-500"
      case "red": return "bg-red-500"
      case "blue": return "bg-blue-500"
      case "purple": return "bg-purple-500"
      case "orange": return "bg-orange-500"
      case "gray": return "bg-gray-500"
      default: return "bg-blue-500"
    }
  }

  const getSizeClasses = (size: string) => {
    switch (size) {
      case "small": return "text-lg"
      case "large": return "text-3xl"
      default: return "text-2xl"
    }
  }

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
        <div className={cn("font-bold text-foreground", getSizeClasses(size))}>
          {value}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && trendValue && (
          <div className={cn("text-sm font-medium mt-1", getTrendColor(trend))}>
            {trend === "up" && "↗"} {trend === "down" && "↘"} {trend === "neutral" && "→"} {trendValue}
          </div>
        )}
        {progress !== undefined && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={cn("h-2 rounded-full", getProgressColor(progressColor || "blue"))}
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              ></div>
            </div>
          </div>
        )}
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
