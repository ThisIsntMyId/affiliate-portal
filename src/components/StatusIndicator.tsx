"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { type VariantProps } from "class-variance-authority";
import { CheckCircle, AlertTriangle, XCircle, Info, Circle } from "lucide-react";

interface StatusIndicatorProps extends Omit<React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>, "variant"> {
  status: "success" | "warning" | "error" | "info" | "neutral";
  label?: string;
  icon?: ReactNode;
  showIcon?: boolean;
}

const statusConfig = {
  success: {
    variant: "default" as const,
    className: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700",
    icon: CheckCircle,
  },
  warning: {
    variant: "secondary" as const,
    className: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700",
    icon: AlertTriangle,
  },
  error: {
    variant: "destructive" as const,
    className: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700",
    icon: XCircle,
  },
  info: {
    variant: "outline" as const,
    className: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700",
    icon: Info,
  },
  neutral: {
    variant: "secondary" as const,
    className: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700",
    icon: Circle,
  },
};

export function StatusIndicator({
  status,
  label,
  icon,
  showIcon = true,
  className,
  children,
  ...props
}: StatusIndicatorProps) {
  const config = statusConfig[status];
  const DefaultIcon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={cn(config.className, className)}
      {...props}
    >
      {showIcon && (
        <span className="flex items-center gap-1">
          {icon ? icon : <DefaultIcon className="h-3 w-3" />}
          {label || children}
        </span>
      )}
      {!showIcon && (label || children)}
    </Badge>
  );
}
