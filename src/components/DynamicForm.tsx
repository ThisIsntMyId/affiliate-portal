"use client"

import React, { useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { Check, ChevronsUpDown, Calendar as CalendarIcon, CloudUpload, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// UI Components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { MultiSelect } from '@/components/ui/multi-select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { RichTextEditor } from '@/components/RichTextEditor'
import { Skeleton } from '@/components/ui/skeleton'

// Custom Error Class
export class DynamicFormSubmissionError extends Error {
  field?: string | Record<string, string>
  
  constructor(message: string, field?: string | Record<string, string>) {
    super(message)
    this.name = 'DynamicFormSubmissionError'
    this.field = field
  }
}

/**
 * Simple File Upload Configuration
 * 
 * Example usage in FormFieldConfig:
 * 
 * // Single image upload with preview
 * {
 *   name: "avatar",
 *   label: "Profile Picture",
 *   type: "file",
 *   fileConfig: {
 *     maxFiles: 1,
 *     multiple: false,
 *     image: true,          // ← Enables image preview
 *     boxSizeWidth: 150,
 *     boxSizeHeight: 150,
 *     accept: ["image/png", "image/jpeg"], // ← Can be string or array
 *     maxSize: 5 * 1024 * 1024,
 *     hint: "Upload PNG or JPEG image up to 5MB" // ← Custom hint
 *   }
 * }
 * 
 * // Multiple file upload with grid layout (no image preview)
 * {
 *   name: "documents",
 *   label: "Supporting Documents",
 *   type: "file",
 *   fileConfig: {
 *     maxFiles: 5,
 *     multiple: true,
 *     image: false,         // ← Shows file initials + name
 *     boxSizeWidth: 100,
 *     boxSizeHeight: 100,
 *     gridColumns: 5,
 *     accept: [".pdf", ".doc", ".docx"], // ← Array format
 *     maxSize: 10 * 1024 * 1024
 *     // hint: omitted - will auto-generate from accept, maxFiles, maxSize
 *   }
 * }
 * 
 * NOTE: Always use type: "file". Image preview is controlled by fileConfig.image
 */

// Types
export interface FormFieldConfig {
  name: string
  label: string
  type: 'input' | 'password' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'checkboxgroup' | 'switch' | 'date' | 'radio' | 'file' | 'combobox' | 'number' | 'email' | 'richtext'
  required?: boolean
  placeholder?: string
  description?: string
  options?: { label: string; value: string }[]
  prefix?: string
  suffix?: string
  fileConfig?: {
    maxFiles?: number
    multiple?: boolean
    image?: boolean
    boxSizeWidth?: number
    boxSizeHeight?: number
    gridColumns?: number
    accept?: string | string[]
    maxSize?: number
    hint?: string
  }
  richtextConfig?: {
    variant: 'minimal' | 'full'
    placeholder?: string
  }
}

export interface DynamicFormProps {
  config: FormFieldConfig[]
  onSubmit?: (values: Record<string, unknown>) => Promise<void>
  defaultValues?: Record<string, unknown>
  schema?: z.ZodSchema
  submitText?: string
  loadingText?: string
  submitButtonAlign?: 'full' | 'left' | 'right'
  loading?: boolean
}

// Schema Generation
function generateSchemaFromConfig(config: FormFieldConfig[]): z.ZodSchema {
  const schemaFields: Record<string, z.ZodTypeAny> = {}
  
  config.forEach(field => {
    let fieldSchema: z.ZodTypeAny
    
    switch (field.type) {
      case 'input':
      case 'password':
      case 'textarea':
      case 'richtext':
        fieldSchema = z.string()
        break
      case 'number':
        fieldSchema = z.coerce.number()
        break
      case 'email':
        fieldSchema = z.string().email()
        break
      case 'select':
      case 'combobox':
        fieldSchema = z.string()
        break
      case 'multiselect':
        fieldSchema = z.array(z.string())
        break
      case 'checkbox':
      case 'switch':
        fieldSchema = z.boolean()
        break
      case 'checkboxgroup':
        fieldSchema = z.array(z.string())
        break
      case 'date':
        fieldSchema = z.coerce.date()
        break
      case 'radio':
        fieldSchema = z.string()
        break
      case 'file':
        if (field.fileConfig?.multiple) {
          fieldSchema = z.array(z.union([z.instanceof(File), z.string()]))
        } else {
          fieldSchema = z.union([z.instanceof(File), z.string()]).nullable()
        }
        break
      default:
        fieldSchema = z.string()
    }
    
    if (field.required) {
      if (z.string().safeParse(fieldSchema).success) {
        fieldSchema = (fieldSchema as z.ZodString).min(1, { message: `${field.label} is required` })
      } else if (z.array(z.unknown()).safeParse(fieldSchema).success) {
        fieldSchema = (fieldSchema as z.ZodArray<z.ZodUnknown>).min(1, { message: `${field.label} is required` })
      } else if (field.type === 'file') {
        // For file fields, we need special handling for required validation
        if (field.fileConfig?.multiple) {
          fieldSchema = (fieldSchema as z.ZodArray<z.ZodUnion<[z.ZodType<File>, z.ZodString]>>).min(1, { message: `${field.label} is required` })
        } else {
          fieldSchema = (fieldSchema as z.ZodUnion<[z.ZodType<File>, z.ZodString]>).refine(
            (val) => val !== null && val !== undefined,
            { message: `${field.label} is required` }
          )
        }
      }
    } else {
      fieldSchema = fieldSchema.optional()
    }
    
    schemaFields[field.name] = fieldSchema
  })
  
  return z.object(schemaFields)
}

// Form type for field renderers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormType = UseFormReturn<any>

// Field Renderers
function renderField(config: FormFieldConfig, form: FormType) {
  switch (config.type) {
    case 'input':
      return <InputField config={config} form={form} />
    case 'password':
      return <PasswordField config={config} form={form} />
    case 'number':
      return <NumberField config={config} form={form} />
    case 'email':
      return <EmailField config={config} form={form} />
    case 'textarea':
      return <TextareaField config={config} form={form} />
    case 'select':
      return <SelectField config={config} form={form} />
    case 'multiselect':
      return <MultiSelectField config={config} form={form} />
    case 'checkbox':
      return <CheckboxField config={config} form={form} />
    case 'checkboxgroup':
      return <CheckboxGroupField config={config} form={form} />
    case 'switch':
      return <SwitchField config={config} form={form} />
    case 'date':
      return <DateField config={config} form={form} />
    case 'radio':
      return <RadioField config={config} form={form} />
    case 'file':
      return <FileField config={config} form={form} />
    case 'combobox':
      return <ComboboxField config={config} form={form} />
    case 'richtext':
      return <RichTextField config={config} form={form} />
    default:
      return <InputField config={config} form={form} />
  }
}

function InputField({ config, form }: { config: FormFieldConfig; form: FormType }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={config.name}>{config.label}</Label>
      <div className="relative">
        {config.prefix && (
          <span className="absolute left-0 top-0 bottom-0 flex items-center justify-center text-sm text-muted-foreground bg-muted border border-input px-2 rounded-l-md min-w-[2.5rem]">
            {config.prefix}
          </span>
        )}
        <Input
          id={config.name}
          type="text"
          placeholder={config.placeholder}
          className={cn(
            config.prefix && "pl-12",
            config.suffix && "pr-12"
          )}
          {...form.register(config.name)}
        />
        {config.suffix && (
          <span className="absolute right-0 top-0 bottom-0 flex items-center justify-center text-sm text-muted-foreground bg-muted border border-input px-2 rounded-r-md min-w-[2.5rem]">
            {config.suffix}
          </span>
        )}
      </div>
      {config.description && (
        <p className="text-sm text-muted-foreground">{config.description}</p>
      )}
      {form.formState.errors[config.name] && (
        <p className="text-sm text-destructive">{form.formState.errors[config.name]?.message as string}</p>
      )}
    </div>
  )
}

function PasswordField({ config, form }: { config: FormFieldConfig; form: FormType }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={config.name}>{config.label}</Label>
      <div className="relative">
        {config.prefix && (
          <span className="absolute left-0 top-0 bottom-0 flex items-center justify-center text-sm text-muted-foreground bg-muted border border-input px-2 rounded-l-md min-w-[2.5rem]">
            {config.prefix}
          </span>
        )}
        <Input
          id={config.name}
          type="password"
          placeholder={config.placeholder}
          className={cn(
            config.prefix && "pl-12",
            config.suffix && "pr-12"
          )}
          {...form.register(config.name)}
        />
        {config.suffix && (
          <span className="absolute right-0 top-0 bottom-0 flex items-center justify-center text-sm text-muted-foreground bg-muted border border-input px-2 rounded-r-md min-w-[2.5rem]">
            {config.suffix}
          </span>
        )}
      </div>
      {config.description && (
        <p className="text-sm text-muted-foreground">{config.description}</p>
      )}
      {form.formState.errors[config.name] && (
        <p className="text-sm text-destructive">{form.formState.errors[config.name]?.message as string}</p>
      )}
    </div>
  )
}

function NumberField({ config, form }: { config: FormFieldConfig; form: FormType }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={config.name}>{config.label}</Label>
      <div className="relative">
        {config.prefix && (
          <span className="absolute left-0 top-0 bottom-0 flex items-center justify-center text-sm text-muted-foreground bg-muted border border-input px-2 rounded-l-md min-w-[2.5rem]">
            {config.prefix}
          </span>
        )}
        <Input
          id={config.name}
          type="number"
          placeholder={config.placeholder}
          className={cn(
            config.prefix && "pl-12",
            config.suffix && "pr-12"
          )}
          {...form.register(config.name, { valueAsNumber: true })}
        />
        {config.suffix && (
          <span className="absolute right-0 top-0 bottom-0 flex items-center justify-center text-sm text-muted-foreground bg-muted border border-input px-2 rounded-r-md min-w-[2.5rem]">
            {config.suffix}
          </span>
        )}
      </div>
      {config.description && (
        <p className="text-sm text-muted-foreground">{config.description}</p>
      )}
      {form.formState.errors[config.name] && (
        <p className="text-sm text-destructive">{form.formState.errors[config.name]?.message as string}</p>
      )}
    </div>
  )
}

function EmailField({ config, form }: { config: FormFieldConfig; form: FormType }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={config.name}>{config.label}</Label>
      <Input
        id={config.name}
        type="email"
        placeholder={config.placeholder}
        {...form.register(config.name)}
      />
      {config.description && (
        <p className="text-sm text-muted-foreground">{config.description}</p>
      )}
      {form.formState.errors[config.name] && (
        <p className="text-sm text-destructive">{form.formState.errors[config.name]?.message as string}</p>
      )}
    </div>
  )
}

function TextareaField({ config, form }: { config: FormFieldConfig; form: FormType }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={config.name}>{config.label}</Label>
      <Textarea
        id={config.name}
        placeholder={config.placeholder}
        className="resize-none"
        {...form.register(config.name)}
      />
      {config.description && (
        <p className="text-sm text-muted-foreground">{config.description}</p>
      )}
      {form.formState.errors[config.name] && (
        <p className="text-sm text-destructive">{form.formState.errors[config.name]?.message as string}</p>
      )}
    </div>
  )
}

function SelectField({ config, form }: { config: FormFieldConfig; form: FormType }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={config.name}>{config.label}</Label>
      <Select onValueChange={(value) => form.setValue(config.name, value)} defaultValue={form.watch(config.name) as string}>
        <SelectTrigger>
          <SelectValue placeholder={config.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {config.options?.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {config.description && (
        <p className="text-sm text-muted-foreground">{config.description}</p>
      )}
      {form.formState.errors[config.name] && (
        <p className="text-sm text-destructive">{form.formState.errors[config.name]?.message as string}</p>
      )}
    </div>
  )
}

function MultiSelectField({ config, form }: { config: FormFieldConfig; form: FormType }) {
  const selectedValues = (form.watch(config.name) as string[]) || []
  
  return (
    <div className="space-y-2">
      <Label htmlFor={config.name}>{config.label}</Label>
      <MultiSelect
        options={config.options || []}
        selected={selectedValues}
        onChange={(values) => form.setValue(config.name, values)}
        placeholder={config.placeholder}
        className="max-w-xs"
      />
      {config.description && (
        <p className="text-sm text-muted-foreground">{config.description}</p>
      )}
      {form.formState.errors[config.name] && (
        <p className="text-sm text-destructive">{form.formState.errors[config.name]?.message as string}</p>
      )}
    </div>
  )
}

function CheckboxField({ config, form }: { config: FormFieldConfig; form: FormType }) {
  return (
    <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
      <Checkbox
        id={config.name}
        checked={form.watch(config.name) as boolean}
        onCheckedChange={(checked) => form.setValue(config.name, checked)}
      />
      <div className="space-y-1 leading-none">
        <Label htmlFor={config.name}>{config.label}</Label>
        {config.description && (
          <p className="text-sm text-muted-foreground">{config.description}</p>
        )}
        {form.formState.errors[config.name] && (
          <p className="text-sm text-destructive">{form.formState.errors[config.name]?.message as string}</p>
        )}
      </div>
    </div>
  )
}

function CheckboxGroupField({ config, form }: { config: FormFieldConfig; form: FormType }) {
  const selectedValues = (form.watch(config.name) as string[]) || []
  
  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      form.setValue(config.name, [...selectedValues, value])
    } else {
      form.setValue(config.name, selectedValues.filter(v => v !== value))
    }
  }
  
  return (
    <div className="space-y-3">
      <Label>{config.label}</Label>
      <div className="space-y-2">
        {config.options?.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Checkbox
              id={`${config.name}-${index}`}
              checked={selectedValues.includes(option.value)}
              onCheckedChange={(checked) => handleCheckboxChange(option.value, checked as boolean)}
            />
            <Label htmlFor={`${config.name}-${index}`} className="font-normal">
              {option.label}
            </Label>
          </div>
        ))}
      </div>
      {config.description && (
        <p className="text-sm text-muted-foreground">{config.description}</p>
      )}
      {form.formState.errors[config.name] && (
        <p className="text-sm text-destructive">{form.formState.errors[config.name]?.message as string}</p>
      )}
    </div>
  )
}

function SwitchField({ config, form }: { config: FormFieldConfig; form: FormType }) {
  return (
    <div className="flex flex-row items-center justify-between rounded-lg border p-4">
      <div className="space-y-0.5">
        <Label htmlFor={config.name}>{config.label}</Label>
        {config.description && (
          <p className="text-sm text-muted-foreground">{config.description}</p>
        )}
      </div>
      <Switch
        id={config.name}
        checked={form.watch(config.name) as boolean}
        onCheckedChange={(checked) => form.setValue(config.name, checked)}
      />
      {form.formState.errors[config.name] && (
        <p className="text-sm text-destructive">{form.formState.errors[config.name]?.message as string}</p>
      )}
    </div>
  )
}

function DateField({ config, form }: { config: FormFieldConfig; form: FormType }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={config.name}>{config.label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[240px] pl-3 text-left font-normal",
              !form.watch(config.name) && "text-muted-foreground"
            )}
          >
            {form.watch(config.name) ? (
              format(form.watch(config.name) as Date, "PPP")
            ) : (
              <span>{config.placeholder || "Pick a date"}</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={form.watch(config.name) as Date}
            onSelect={(date) => form.setValue(config.name, date)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {config.description && (
        <p className="text-sm text-muted-foreground">{config.description}</p>
      )}
      {form.formState.errors[config.name] && (
        <p className="text-sm text-destructive">{form.formState.errors[config.name]?.message as string}</p>
      )}
    </div>
  )
}

function RadioField({ config, form }: { config: FormFieldConfig; form: FormType }) {
  return (
    <div className="space-y-3">
      <Label>{config.label}</Label>
      <RadioGroup
        value={form.watch(config.name) as string}
        onValueChange={(value) => form.setValue(config.name, value)}
        className="flex flex-col space-y-1"
      >
        {config.options?.map((option, index) => (
          <div className="flex items-center space-x-3 space-y-0" key={index}>
            <RadioGroupItem value={option.value} id={`${config.name}-${index}`} />
            <Label htmlFor={`${config.name}-${index}`} className="font-normal">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {config.description && (
        <p className="text-sm text-muted-foreground">{config.description}</p>
      )}
      {form.formState.errors[config.name] && (
        <p className="text-sm text-destructive">{form.formState.errors[config.name]?.message as string}</p>
      )}
    </div>
  )
}

// Helper function to get file extension
function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

// Helper function to check if file is image by extension
function isImageByExtension(filename: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico']
  return imageExtensions.includes(getFileExtension(filename))
}

// Helper function to get initials from filename
function getFileInitials(filename: string): string {
  const name = filename.replace(/\.[^/.]+$/, '') // Remove extension
  if (name.length >= 2) {
    return name.substring(0, 2).toUpperCase()
  }
  return name.toUpperCase()
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function FileField({ config, form }: { config: FormFieldConfig; form: FormType }) {
  const [files, setFiles] = useState<(File | string)[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  
  const isMultiple = config.fileConfig?.multiple || false
  const maxFiles = config.fileConfig?.maxFiles || 1
  const boxWidth = config.fileConfig?.boxSizeWidth || 120
  const boxHeight = config.fileConfig?.boxSizeHeight || 120
  const gridColumns = config.fileConfig?.gridColumns || 5
  const isImageType = config.fileConfig?.image || false
  const acceptRaw = config.fileConfig?.accept || (isImageType ? 'image/*' : '*/*')
  const accept = Array.isArray(acceptRaw) ? acceptRaw.join(', ') : acceptRaw
  const maxSize = config.fileConfig?.maxSize || 1024 * 1024 * 4
  
  // Initialize files from form default values
  React.useEffect(() => {
    const formValue = form.getValues(config.name)
    if (formValue) {
      if (isMultiple && Array.isArray(formValue)) {
        setFiles(formValue)
      } else if (!isMultiple && (typeof formValue === 'string' || formValue instanceof File)) {
        setFiles([formValue])
      }
    }
  }, [config.name, form, isMultiple])
  
  // Generate previews for uploaded files
  React.useEffect(() => {
    const newPreviews: string[] = []
    
    files.forEach((file, index) => {
      if (file instanceof File) {
        // For uploaded files, generate preview
        if (isImageType || isImageByExtension(file.name)) {
          const reader = new FileReader()
          reader.onload = (e) => {
            newPreviews[index] = e.target?.result as string
            if (newPreviews.length === files.length) {
              setPreviews([...newPreviews])
            }
          }
          reader.readAsDataURL(file)
        } else {
          newPreviews[index] = ''
        }
      } else if (typeof file === 'string') {
        // For existing file URLs
        if (isImageType || isImageByExtension(file)) {
          newPreviews[index] = file
        } else {
          newPreviews[index] = ''
        }
      }
    })
    
    if (newPreviews.length === files.length) {
      setPreviews([...newPreviews])
    }
  }, [files, isImageType])
  
  // Update form value when files change
  React.useEffect(() => {
    if (isMultiple) {
      form.setValue(config.name, files)
    } else {
      form.setValue(config.name, files[0] || null)
    }
  }, [files, config.name, isMultiple, form])
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    
    // Validate file size
    const validFiles = selectedFiles.filter(file => {
      if (file.size > maxSize) {
        toast.error(`File ${file.name} is too large. Maximum size is ${formatFileSize(maxSize)}.`)
        // Set form error for file size validation
        form.setError(config.name, { 
          type: 'manual', 
          message: `File size exceeds maximum allowed size of ${formatFileSize(maxSize)}` 
        })
        return false
      }
      return true
    })
    
    // Clear any previous file size errors if validation passes
    if (validFiles.length > 0) {
      form.clearErrors(config.name)
    }
    
    if (validFiles.length === 0) return
    
    if (isMultiple) {
      // Add files to existing array, respecting maxFiles limit
      const currentFileCount = files.length
      const remainingSlots = maxFiles - currentFileCount
      const filesToAdd = validFiles.slice(0, remainingSlots)
      
      if (filesToAdd.length < validFiles.length) {
        toast.error(`Maximum ${maxFiles} files allowed.`)
      }
      
      setFiles([...files, ...filesToAdd])
    } else {
      // Replace with first file
      setFiles([validFiles[0]])
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  
  const handleFileRemove = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
  }
  
  const handleBoxClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  
  const renderFilePreview = (file: File | string, index: number) => {
    const filename = typeof file === 'string' ? file.split('/').pop() || file : file.name
    const preview = previews[index]
    const isImage = isImageType || (preview && (typeof file === 'string' || isImageByExtension(filename)))
    
    return (
      <div 
        key={index}
        className="relative group"
        style={{ width: boxWidth, height: boxHeight }}
      >
        <div className="w-full h-full border border-input bg-background rounded-md overflow-hidden flex items-center justify-center">
          {isImage && preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={preview} 
              alt={filename}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-1 text-center w-full h-full">
              <div className="text-lg font-bold text-muted-foreground mb-1 leading-none">
                {getFileInitials(filename)}
              </div>
              <div className="text-xs text-muted-foreground px-1 leading-tight break-words overflow-hidden" style={{ 
                display: '-webkit-box', 
                WebkitLineClamp: 2, 
                WebkitBoxOrient: 'vertical',
                maxHeight: '2.4em',
                lineHeight: '1.2em'
              }}>
                {filename}
              </div>
              {typeof file !== 'string' && (
                <div className="text-xs text-muted-foreground mt-1 leading-none">
                  {formatFileSize(file.size)}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Remove button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleFileRemove(index)
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-background/80 hover:bg-background border border-input rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg className="w-3 h-3 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    )
  }
  
  const renderPlaceholderBox = () => {
    if (!isMultiple && files.length > 0) return null
    if (isMultiple && files.length >= maxFiles) return null
    
    return (
      <div 
        onClick={handleBoxClick}
        className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 bg-muted/30 hover:bg-muted/50 rounded-md cursor-pointer transition-colors flex flex-col items-center justify-center group"
        style={{ width: boxWidth, height: boxHeight }}
      >
        <CloudUpload className="w-8 h-8 text-muted-foreground/50 group-hover:text-muted-foreground mb-2" />
        <p className="text-xs text-muted-foreground/70 group-hover:text-muted-foreground text-center px-2">
          Click to upload
        </p>
      </div>
    )
  }
  
  const generateFileHints = () => {
    // If custom hint is provided, use it
    if (config.fileConfig?.hint) {
      return config.fileConfig.hint
    }
    
    // Otherwise, generate hints automatically
    const hints: string[] = []
    
    if (accept && accept !== '*/*') {
      hints.push(`Supported: ${accept}`)
    }
    
    if (isMultiple) {
      hints.push(`Max: ${maxFiles} files`)
    }
    
    hints.push(`Size: ${formatFileSize(maxSize)}`)
    
    return hints.join(' • ')
  }
  
  return (
    <div className="space-y-2">
      <Label htmlFor={config.name}>{config.label}</Label>
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={isMultiple}
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {/* File grid */}
      <div 
        className="flex flex-wrap gap-3"
        style={{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }}
      >
        {files.map((file, index) => renderFilePreview(file, index))}
        {renderPlaceholderBox()}
      </div>
      
      {/* File hints */}
      {generateFileHints() && (
        <p className="text-xs text-muted-foreground">
          {generateFileHints()}
        </p>
      )}
      
      {/* Description */}
      {config.description && (
        <p className="text-sm text-muted-foreground">{config.description}</p>
      )}
      
      {/* Error message */}
      {form.formState.errors[config.name] && (
        <p className="text-sm text-destructive">{form.formState.errors[config.name]?.message as string}</p>
      )}
    </div>
  )
}

function ComboboxField({ config, form }: { config: FormFieldConfig; form: FormType }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={config.name}>{config.label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-[200px] justify-between",
              !form.watch(config.name) && "text-muted-foreground"
            )}
          >
            {form.watch(config.name)
              ? config.options?.find((option) => option.value === form.watch(config.name))?.label
              : config.placeholder || "Select option"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder={`Search ${config.label.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>
                {config.options?.map((option) => (
                  <CommandItem
                    value={option.label}
                    key={option.value}
                    onSelect={() => {
                      form.setValue(config.name, option.value)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        option.value === form.watch(config.name)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {config.description && (
        <p className="text-sm text-muted-foreground">{config.description}</p>
      )}
      {form.formState.errors[config.name] && (
        <p className="text-sm text-destructive">{form.formState.errors[config.name]?.message as string}</p>
      )}
    </div>
  )
}

function RichTextField({ config, form }: { config: FormFieldConfig; form: FormType }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={config.name}>{config.label}</Label>
      <RichTextEditor
        value={form.watch(config.name) as string || ''}
        onChange={(html) => form.setValue(config.name, html)}
        variant={config.richtextConfig?.variant || 'minimal'}
        placeholder={config.richtextConfig?.placeholder || config.placeholder}
        className="min-h-[120px]"
      />
      {config.description && (
        <p className="text-sm text-muted-foreground">{config.description}</p>
      )}
      {form.formState.errors[config.name] && (
        <p className="text-sm text-destructive">{form.formState.errors[config.name]?.message as string}</p>
      )}
    </div>
  )
}

// Form Skeleton Component
function FormSkeleton({ config }: { config: FormFieldConfig[] }) {
  return (
    <div className="space-y-6">
      {config.map((field, index) => (
        <div key={field.name || index} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          
          {field.type === 'textarea' || field.type === 'richtext' ? (
            <Skeleton className="h-20 w-full" />
          ) : field.type === 'checkbox' || field.type === 'switch' ? (
            <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </div>
          ) : field.type === 'checkboxgroup' ? (
            <div className="space-y-2">
              {field.options?.slice(0, 3).map((_, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : field.type === 'radio' ? (
            <div className="space-y-2">
              {field.options?.slice(0, 3).map((_, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-3 space-y-0">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : field.type === 'file' ? (
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: field.fileConfig?.maxFiles || 1 }).map((_, index) => (
                <Skeleton 
                  key={index} 
                  className="border border-input rounded-md" 
                  style={{ 
                    width: field.fileConfig?.boxSizeWidth || 120, 
                    height: field.fileConfig?.boxSizeHeight || 120 
                  }} 
                />
              ))}
            </div>
          ) : field.type === 'date' ? (
            <Skeleton className="h-10 w-48" />
          ) : field.type === 'select' || field.type === 'multiselect' || field.type === 'combobox' ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Skeleton className="h-10 w-full" />
          )}
          
          {field.description && (
            <Skeleton className="h-3 w-3/4" />
          )}
        </div>
      ))}
      
      {/* Submit button skeleton */}
      <div className="flex w-full">
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
}

// Main Component
export function DynamicForm({ config, onSubmit, defaultValues, schema, submitText, loadingText, submitButtonAlign = 'full', loading = false }: DynamicFormProps) {
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Auto-generate schema if not provided
  const finalSchema = schema || generateSchemaFromConfig(config)
  
  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(finalSchema as any),
    defaultValues,
  })
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (values: any) => {
    try {
      setFormError(null)
      setIsSubmitting(true)
      await onSubmit?.(values as Record<string, unknown>)
      toast.success('Form submitted successfully!')
    } catch (error) {
      if (error instanceof DynamicFormSubmissionError) {
        if (typeof error.field === 'string') {
          // Single field error
          form.setError(error.field, { message: error.message })
        } else if (typeof error.field === 'object') {
          // Multiple field errors
          Object.entries(error.field).forEach(([fieldName, message]) => {
            form.setError(fieldName, { message })
          })
        } else {
          // Form-level error
          setFormError(error.message)
        }
      } else {
        // Generic error
        setFormError('An unexpected error occurred. Please try again.')
      }
      toast.error('Form submission failed. Please check the errors below.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Show skeleton loader when loading
  if (loading) {
    return <FormSkeleton config={config} />
  }

  const formContent = (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      {/* Form-level error display */}
      {formError && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">{formError}</p>
        </div>
      )}
      
      {/* Render form fields */}
      {config.map((field, index) => (
        <div key={field.name || index}>
          {renderField(field, form)}
        </div>
      ))}
      
      {/* Submit Button Container */}
      <div className={cn(
        "flex w-full",
        submitButtonAlign === 'full' && "w-full",
        submitButtonAlign === 'left' && "justify-start",
        submitButtonAlign === 'right' && "justify-end"
      )}>
        <Button 
          type="submit" 
          className={`cursor-pointer ${submitButtonAlign === 'full' ? 'w-full' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {loadingText || 'Submitting...'}
            </>
          ) : (
            submitText || 'Submit'
          )}
        </Button>
      </div>
    </form>
  )

  return (formContent);
}