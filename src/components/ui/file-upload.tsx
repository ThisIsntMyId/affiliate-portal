"use client"

import * as React from "react"
import { useDropzone, DropzoneOptions } from "react-dropzone"
import { cn } from "@/lib/utils"

interface FileUploaderProps {
  value?: File[] | null
  onValueChange?: (files: File[] | null) => void
  dropzoneOptions?: DropzoneOptions
  children: React.ReactNode
  className?: string
}

interface FileInputProps {
  children: React.ReactNode
  className?: string
}

interface FileUploaderContentProps {
  children: React.ReactNode
  className?: string
}

interface FileUploaderItemProps {
  children: React.ReactNode
  index: number
  className?: string
}

export function FileUploader({
  value,
  onValueChange,
  dropzoneOptions,
  children,
  className,
}: FileUploaderProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (onValueChange) {
        onValueChange(acceptedFiles)
      }
    },
    ...dropzoneOptions,
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        "cursor-pointer transition-colors",
        isDragActive && "border-primary bg-primary/5",
        className
      )}
    >
      <input {...getInputProps()} />
      {children}
    </div>
  )
}

export function FileInput({ children, className }: FileInputProps) {
  return (
    <div className={cn("border-2 border-dashed rounded-lg p-4", className)}>
      {children}
    </div>
  )
}

export function FileUploaderContent({ children, className }: FileUploaderContentProps) {
  return (
    <div className={cn("mt-2 space-y-2", className)}>
      {children}
    </div>
  )
}

export function FileUploaderItem({ children, index, className }: FileUploaderItemProps) {
  return (
    <div className={cn("flex items-center gap-2 p-2 bg-muted rounded-md", className)}>
      {children}
    </div>
  )
}
