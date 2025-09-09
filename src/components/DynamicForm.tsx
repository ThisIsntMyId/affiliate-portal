"use client"

import React, { useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { Check, ChevronsUpDown, Calendar as CalendarIcon, CloudUpload, Paperclip, Loader2 } from 'lucide-react'
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
import { FileUploader, FileInput, FileUploaderContent, FileUploaderItem } from '@/components/ui/file-upload'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

// Custom Error Class
export class DynamicFormSubmissionError extends Error {
  field?: string | Record<string, string>
  
  constructor(message: string, field?: string | Record<string, string>) {
    super(message)
    this.name = 'DynamicFormSubmissionError'
    this.field = field
  }
}

// Types
export interface FormFieldConfig {
  name: string
  label: string
  type: 'input' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'checkboxgroup' | 'switch' | 'date' | 'radio' | 'file' | 'image' | 'combobox' | 'number' | 'email'
  required?: boolean
  placeholder?: string
  description?: string
  options?: { label: string; value: string }[]
  prefix?: string
  suffix?: string
  fileConfig?: {
    multiple?: boolean
    accept?: string
    maxSize?: number
  }
}

export interface DynamicFormProps {
  config: FormFieldConfig[]
  onSubmit: (values: Record<string, unknown>) => Promise<void>
  defaultValues?: Record<string, unknown>
  schema?: z.ZodSchema
  submitText?: string
  loadingText?: string
  submitButtonAlign?: 'full' | 'left' | 'right'
  title?: string
  description?: string
  showCard?: boolean
}

// Schema Generation
function generateSchemaFromConfig(config: FormFieldConfig[]): z.ZodSchema {
  const schemaFields: Record<string, z.ZodTypeAny> = {}
  
  config.forEach(field => {
    let fieldSchema: z.ZodTypeAny
    
    switch (field.type) {
      case 'input':
      case 'textarea':
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
      case 'image':
        fieldSchema = field.fileConfig?.multiple ? z.array(z.instanceof(File)) : z.instanceof(File)
        break
      default:
        fieldSchema = z.string()
    }
    
    if (field.required) {
      if (z.string().safeParse(fieldSchema).success) {
        fieldSchema = (fieldSchema as z.ZodString).min(1, { message: `${field.label} is required` })
      } else if (z.array(z.unknown()).safeParse(fieldSchema).success) {
        fieldSchema = (fieldSchema as z.ZodArray<z.ZodUnknown>).min(1, { message: `${field.label} is required` })
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
    case 'image':
      return <ImageField config={config} form={form} />
    case 'combobox':
      return <ComboboxField config={config} form={form} />
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

function FileField({ config, form }: { config: FormFieldConfig; form: FormType }) {
  const [files, setFiles] = useState<File[] | null>(null)
  
  const dropZoneConfig = {
    maxFiles: config.fileConfig?.multiple ? 5 : 1,
    maxSize: config.fileConfig?.maxSize || 1024 * 1024 * 4,
    multiple: config.fileConfig?.multiple || false,
    accept: config.fileConfig?.accept ? { [config.fileConfig.accept]: [] } : undefined,
  }
  
  // Update form value when files change
  React.useEffect(() => {
    if (config.fileConfig?.multiple) {
      form.setValue(config.name, files)
    } else {
      form.setValue(config.name, files?.[0] || null)
    }
  }, [files, config.name, config.fileConfig?.multiple, form])
  
  return (
    <div className="space-y-2">
      <Label htmlFor={config.name}>{config.label}</Label>
      <FileUploader
        value={files}
        onValueChange={setFiles}
        dropzoneOptions={dropZoneConfig}
        className="relative bg-background rounded-lg p-2"
      >
        <FileInput className="outline-dashed outline-1 outline-slate-500">
          <div className="flex items-center justify-center flex-col p-8 w-full">
            <CloudUpload className="text-gray-500 w-10 h-10" />
            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span>
              &nbsp; or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {config.fileConfig?.accept || "Any file type"}
            </p>
          </div>
        </FileInput>
        <FileUploaderContent>
          {files &&
            files.length > 0 &&
            files.map((file, i) => (
              <FileUploaderItem key={i} index={i}>
                <Paperclip className="h-4 w-4 stroke-current" />
                <span>{file.name}</span>
              </FileUploaderItem>
            ))}
        </FileUploaderContent>
      </FileUploader>
      {config.description && (
        <p className="text-sm text-muted-foreground">{config.description}</p>
      )}
      {form.formState.errors[config.name] && (
        <p className="text-sm text-destructive">{form.formState.errors[config.name]?.message as string}</p>
      )}
    </div>
  )
}

function ImageField({ config, form }: { config: FormFieldConfig; form: FormType }) {
  const [files, setFiles] = useState<File[] | null>(null)
  const [previews, setPreviews] = useState<string[]>([])
  
  const dropZoneConfig = {
    maxFiles: config.fileConfig?.multiple ? 5 : 1,
    maxSize: config.fileConfig?.maxSize || 1024 * 1024 * 4,
    multiple: config.fileConfig?.multiple || false,
    accept: config.fileConfig?.accept ? { [config.fileConfig.accept]: [] } : { 'image/*': [] },
  }
  
  // Generate previews when files change
  React.useEffect(() => {
    if (files && files.length > 0) {
      const newPreviews: string[] = []
      files.forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          newPreviews.push(e.target?.result as string)
          if (newPreviews.length === files.length) {
            setPreviews([...newPreviews])
          }
        }
        reader.readAsDataURL(file)
      })
    } else {
      setPreviews([])
    }
  }, [files])
  
  // Update form value when files change
  React.useEffect(() => {
    if (config.fileConfig?.multiple) {
      form.setValue(config.name, files)
    } else {
      form.setValue(config.name, files?.[0] || null)
    }
  }, [files, config.name, config.fileConfig?.multiple, form])
  
  return (
    <div className="space-y-2">
      <Label htmlFor={config.name}>{config.label}</Label>
      <FileUploader
        value={files}
        onValueChange={setFiles}
        dropzoneOptions={dropZoneConfig}
        className="relative bg-background rounded-lg p-2"
      >
        <FileInput className="outline-dashed outline-1 outline-slate-500">
          <div className="flex items-center justify-center flex-col p-8 w-full">
            <CloudUpload className="text-gray-500 w-10 h-10" />
            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span>
              &nbsp; or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {config.fileConfig?.accept || "Images only (JPG, PNG, GIF, etc.)"}
            </p>
          </div>
        </FileInput>
        <FileUploaderContent>
          {files &&
            files.length > 0 &&
            files.map((file, i) => (
              <div key={i} className="flex items-center space-x-2 p-2 border rounded">
                {previews[i] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={previews[i]} 
                    alt={file.name} 
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ))}
        </FileUploaderContent>
      </FileUploader>
      {config.description && (
        <p className="text-sm text-muted-foreground">{config.description}</p>
      )}
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

// Main Component
export function DynamicForm({ config, onSubmit, defaultValues, schema, submitText, loadingText, submitButtonAlign = 'full', title, description, showCard = true }: DynamicFormProps) {
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
      await onSubmit(values as Record<string, unknown>)
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

  if (!showCard) {
    return formContent
  }

  return (
    <Card className="w-full">
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        {formContent}
      </CardContent>
    </Card>
  )
}