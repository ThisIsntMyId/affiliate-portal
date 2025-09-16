"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DynamicForm, FormFieldConfig } from "./DynamicForm";
import { z } from "zod";

interface ModalFormProps {
  // Trigger button
  children: React.ReactNode;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  className?: string;
  
  // Modal configuration  
  modalTitle: string;
  modalDescription?: string;
  
  // Form configuration
  config: FormFieldConfig[];
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
  defaultValues?: Record<string, unknown>;
  schema?: z.ZodSchema;
  
  // Button labels
  saveText?: string;
  cancelText?: string;
  loadingText?: string;
  
  // Other props
  disabled?: boolean;
  gridCols?: number;
}

export function ModalForm({
  children,
  variant = "default",
  className,
  modalTitle,
  modalDescription,
  config,
  onSubmit,
  defaultValues,
  schema,
  saveText = "Save",
  cancelText = "Cancel",
  loadingText = "Saving...",
  disabled = false,
  gridCols = 1,
}: ModalFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSave = async (values: Record<string, unknown>) => {
    try {
      await onSubmit(values);
      // Close modal on success
      handleClose();
    } catch (error) {
      // Re-throw error to let DynamicForm handle it
      throw error;
    }
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        disabled={disabled}
        variant={variant}
        className={`cursor-pointer ${className}`}
      >
        {children}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{modalTitle}</DialogTitle>
            {modalDescription && (
              <DialogDescription>{modalDescription}</DialogDescription>
            )}
          </DialogHeader>
          
          <div className="py-4">
            {/* DynamicForm with secondary action */}
            <DynamicForm
              config={config}
              onSubmit={handleSave}
              defaultValues={defaultValues}
              schema={schema}
              submitText={saveText}
              loadingText={loadingText}
              submitButtonAlign="right"
              loading={false}
              gridCols={gridCols}
              secondaryAction={{
                label: cancelText,
                onClick: async () => {
                  handleClose();
                }
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
