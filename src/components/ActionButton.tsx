"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { type VariantProps } from "class-variance-authority";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmationConfig {
  enabled: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  icon?: React.ReactNode;
}

interface ActionButtonProps extends Omit<React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>, "onClick"> {
  onClick: () => Promise<void>;
  loadingText?: string;
  confirmation?: ConfirmationConfig;
}

export function ActionButton({
  onClick,
  children,
  loadingText = "Processing...",
  confirmation,
  disabled = false,
  ...props
}: ActionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleClick = async () => {
    if (confirmation?.enabled) {
      setShowConfirmation(true);
      return;
    }
    
    await executeAction();
  };

  const executeAction = async () => {
    setIsLoading(true);
    try {
      await onClick();
    } catch (error) {
      setIsLoading(false);
      throw error; // Re-throw to parent for handling
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    setShowConfirmation(false);
    await executeAction();
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={disabled || isLoading}
        className="cursor-pointer"
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {loadingText}
          </>
        ) : (
          children
        )}
      </Button>

      {confirmation?.enabled && (
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent>
            <DialogHeader>
              {confirmation.icon && (
                <div className="flex justify-center mb-2">
                  {confirmation.icon}
                </div>
              )}
              <DialogTitle>{confirmation.title}</DialogTitle>
              <DialogDescription>{confirmation.description}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={handleCancel} className="cursor-pointer">
                {confirmation.cancelText || "Cancel"}
              </Button>
              <Button onClick={handleConfirm} disabled={isLoading} className="cursor-pointer">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {loadingText}
                  </>
                ) : (
                  confirmation.confirmText || "Confirm"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
