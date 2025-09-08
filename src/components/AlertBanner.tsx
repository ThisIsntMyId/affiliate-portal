"use client";

import { AlertTriangle, Info, XCircle, CheckCircle, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AlertBannerProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  buttonTitle?: string;
  buttonUrl?: string;
  buttonAction?: () => void;
  style?: "info" | "warning" | "danger" | "success";
  onClose?: () => void;
  className?: string;
}

const styleConfig = {
  info: {
    container: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200",
    icon: "text-blue-500 dark:text-blue-400",
    button: "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600",
    defaultIcon: Info,
  },
  warning: {
    container: "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-200",
    icon: "text-yellow-500 dark:text-yellow-400",
    button: "bg-yellow-600 hover:bg-yellow-700 text-white dark:bg-yellow-700 dark:hover:bg-yellow-600",
    defaultIcon: AlertTriangle,
  },
  danger: {
    container: "bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200",
    icon: "text-red-500 dark:text-red-400",
    button: "bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-600",
    defaultIcon: XCircle,
  },
  success: {
    container: "bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200",
    icon: "text-green-500 dark:text-green-400",
    button: "bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-600",
    defaultIcon: CheckCircle,
  },
};

export function AlertBanner({
  icon,
  title,
  description,
  buttonTitle,
  buttonUrl,
  buttonAction,
  style = "info",
  onClose,
  className,
}: AlertBannerProps) {
  const config = styleConfig[style];
  const DefaultIcon = config.defaultIcon;

  return (
    <div className={cn("border rounded-lg p-4", config.container, className)}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {icon ? (
            <div className={config.icon}>{icon}</div>
          ) : (
            <DefaultIcon className={cn("h-5 w-5", config.icon)} />
          )}
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium">{title}</h3>
          <div className="mt-1 text-sm">
            <p>{description}</p>
          </div>
        </div>
        <div className="ml-4 flex items-center gap-2">
          {buttonTitle && (buttonUrl || buttonAction) && (
            <div>
              {buttonUrl ? (
                <Link
                  href={buttonUrl}
                  className={cn(
                    "inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md transition-colors duration-200",
                    config.button
                  )}
                >
                  {buttonTitle}
                </Link>
              ) : (
                <Button
                  onClick={buttonAction}
                  size="sm"
                  className={cn("text-sm font-medium", config.button)}
                >
                  {buttonTitle}
                </Button>
              )}
            </div>
          )}
          {onClose && (
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  "inline-flex rounded-md p-1.5 hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent",
                  config.icon
                )}
              >
                <span className="sr-only">Dismiss</span>
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
