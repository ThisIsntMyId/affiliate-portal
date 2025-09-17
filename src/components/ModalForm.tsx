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
  children: React.ReactNode;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  className?: string;
  modalTitle: string;
  modalDescription?: string;
  config: FormFieldConfig[];
  defaultValues?: Record<string, unknown>;
  schema?: z.ZodSchema;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
  onOpen?: () => Promise<void>;
  onClose?: () => void;
  saveText?: string;
  cancelText?: string;
  loadingText?: string;
  disabled?: boolean;
  gridCols?: number;
}

/*
  Note on `formKey`: This state is used to force a complete re-mount of the 
  DynamicForm component. By changing the `key` prop on the DynamicForm after 
  asynchronous data has been fetched, we ensure it initializes with the new 
  `defaultValues`, solving the race condition without modifying DynamicForm itself.
*/
export function ModalForm({
  children,
  variant = "default",
  className,
  modalTitle,
  modalDescription,
  config,
  onSubmit,
  onOpen,
  onClose,
  defaultValues,
  schema,
  saveText = "Save",
  cancelText = "Cancel",
  loadingText = "Saving...",
  disabled = false,
  gridCols = 1,
}: ModalFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const handleOpen = () => {
    if (disabled) return;

    setIsOpen(true);
    if (onOpen) {
      setIsLoading(true);
      onOpen().finally(() => {
        setIsLoading(false);
        setFormKey(prevKey => prevKey + 1);
      });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setFormKey(prevKey => prevKey + 1); 
    if (onClose) onClose();
  };

  const handleSave = async (values: Record<string, unknown>) => {
    try {
      await onSubmit(values);
      handleClose();
    } catch (error) {
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
            <DynamicForm
              key={formKey}
              config={config}
              onSubmit={handleSave}
              defaultValues={defaultValues}
              schema={schema}
              submitText={saveText}
              loadingText={loadingText}
              loading={isLoading}
              submitButtonAlign="right"
              gridCols={gridCols}
              secondaryAction={{
                label: cancelText,
                onClick: async () => {
                  handleClose();
                },
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}