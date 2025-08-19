"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Search, Filter, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { get } from 'lodash'
import { cn } from '@/lib/utils'

// UI Components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

// Types
export interface ColumnConfig {
  key: string
  label: string
  field?: string // for nested data like 'user.profile.name'
  type: 'text' | 'image' | 'tag' | 'custom' | 'actions'
  width?: string
  align?: 'left' | 'center' | 'right'
  
  // For tag type
  tagColors?: Record<string, string> // { active: 'bg-green-500', inactive: 'bg-red-500' }
  
  // For custom type
  render?: (row: Record<string, unknown>, index: number) => React.ReactNode
  
  // For actions type
  actions?: {
    label: string
    icon?: React.ReactNode
    onClick?: (row: Record<string, unknown>) => void
    url?: string
    variant?: 'default' | 'outline' | 'destructive'
  }[]
}

export interface FilterConfig {
  key: string
  label: string
  type: 'select' | 'input' | 'date' | 'custom'
  options?: { label: string; value: string }[]
  placeholder?: string
  
  // For custom type
  component?: React.ComponentType<{ value: unknown; onChange: (value: unknown) => void }>
}

export interface EmptyStateConfig {
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: () => void
  actionLabel?: string
}

export type TableAction = 
  | { type: 'filter'; data: Record<string, unknown> }
  | { type: 'sort'; data: string }
  | { type: 'page'; data: number }
  | { type: 'search'; data: string }
  | { type: 'perPage'; data: number }

export interface DynamicTableProps {
  data: Record<string, unknown>[]
  columns: ColumnConfig[]
  filters?: FilterConfig[]
  sortOptions?: Record<string, string> // { latest: "Latest", oldest: "Oldest" }
  title?: string
  description?: string
  headerActions?: React.ReactNode[]
  paginationType?: 'full' | 'simple' | 'none'
  loading?: boolean
  emptyState?: EmptyStateConfig
  onAction: (action: TableAction) => void
}

// Helper function for nested data
function getNestedValue(obj: Record<string, unknown>, path?: string): unknown {
  if (!path) return obj
  return get(obj, path)
}

// Custom hook for debounced search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Cell Renderers
function renderCell(column: ColumnConfig, row: Record<string, unknown>, index: number): React.ReactNode {
  switch (column.type) {
    case 'text':
      const textValue = getNestedValue(row, column.field)
      return String(textValue || '-')
      
    case 'image':
      const imageSrc = getNestedValue(row, column.field)
      if (!imageSrc || typeof imageSrc !== 'string') return '-'
      return (
        <img 
          src={imageSrc} 
          alt="" 
          className="w-10 h-10 object-cover rounded"
        />
      )
      
    case 'tag':
      const tagValue = getNestedValue(row, column.field)
      if (!tagValue || typeof tagValue !== 'string') return '-'
      const color = column.tagColors?.[tagValue] || 'bg-gray-500 text-gray-900'
      return (
        <Badge className={color}>
          {tagValue}
        </Badge>
      )
      
    case 'custom':
      return column.render?.(row, index) || '-'
      
    case 'actions':
      return renderActionButtons(column.actions || [], row)
      
    default:
      const defaultValue = getNestedValue(row, column.field)
      return defaultValue ? String(defaultValue) : '-'
  }
}

function renderActionButtons(actions: ColumnConfig['actions'], row: Record<string, unknown>): React.ReactNode {
  if (!actions || actions.length === 0) return '-'
  
  return (
    <div className="flex gap-2">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant || 'outline'}
          size="sm"
          onClick={() => action.onClick?.(row)}
          asChild={!!action.url}
          className="cursor-pointer"
        >
          {action.url ? (
            <a href={action.url}>
              {action.icon}
              {action.label}
            </a>
          ) : (
            <>
              {action.icon}
              {action.label}
            </>
          )}
        </Button>
      ))}
    </div>
  )
}

// Filter Modal Component
function FilterModal({ 
  open, 
  onClose, 
  filters, 
  onApply,
  isFiltering
}: { 
  open: boolean
  onClose: () => void
  filters?: FilterConfig[]
  onApply: (filters: Record<string, unknown>) => void
  isFiltering: boolean
}) {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})

  const handleApply = () => {
    onApply(filterValues)
  }

  const handleReset = () => {
    setFilterValues({})
  }

  if (!filters || filters.length === 0) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Data</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {filters.map((filter) => (
            <div key={filter.key} className="space-y-2">
              <Label htmlFor={filter.key}>{filter.label}</Label>
              
              {filter.type === 'select' && (
                                 <Select 
                   value={filterValues[filter.key] || ''} 
                   onValueChange={(value) => setFilterValues(prev => ({ ...prev, [filter.key]: value }))}
                 >
                   <SelectTrigger className="cursor-pointer">
                     <SelectValue placeholder={filter.placeholder || `Select ${filter.label}`} />
                   </SelectTrigger>
                                     <SelectContent>
                     <SelectItem value="all">All</SelectItem>
                     {filter.options?.map((option) => (
                       <SelectItem key={option.value} value={option.value}>
                         {option.label}
                       </SelectItem>
                     ))}
                   </SelectContent>
                </Select>
              )}
              
              {filter.type === 'input' && (
                <Input
                  id={filter.key}
                  placeholder={filter.placeholder}
                  value={filterValues[filter.key] || ''}
                  onChange={(e) => setFilterValues(prev => ({ ...prev, [filter.key]: e.target.value }))}
                  className="cursor-text"
                />
              )}
              
              {filter.type === 'custom' && filter.component && (
                <filter.component
                  value={filterValues[filter.key]}
                  onChange={(value) => setFilterValues(prev => ({ ...prev, [filter.key]: String(value) }))}
                />
              )}
            </div>
          ))}
        </div>
        
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={handleReset} className="cursor-pointer">
            Reset
          </Button>
          <Button onClick={handleApply} className="cursor-pointer" disabled={isFiltering}>
            {isFiltering ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Applying...
              </>
            ) : (
              'Apply Filters'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Table Skeleton Component
function TableSkeleton({ columns }: { columns: ColumnConfig[] }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: 8 }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {columns.map((column, colIndex) => (
            <Skeleton 
              key={colIndex} 
              className={cn(
                "h-4",
                column.width || "flex-1"
              )} 
            />
          ))}
        </div>
      ))}
    </div>
  )
}

// Pagination Controls Component
function PaginationControls({
  type,
  currentPage,
  totalPages,
  perPage,
  onPageChange,
  onPerPageChange
}: {
  type: 'full' | 'simple' | 'none'
  currentPage: number
  totalPages: number
  perPage: number
  onPageChange: (page: number) => void
  onPerPageChange: (perPage: number) => void
}) {
  if (type === 'none') return null

  return (
    <div className="flex items-center justify-between mt-6">
      {type === 'full' && (
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        
        {type === 'full' && (
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                  className="w-8 h-8 p-0 cursor-pointer"
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="cursor-pointer"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
             {type === 'full' && (
         <Select value={String(perPage)} onValueChange={(value) => onPerPageChange(Number(value))}>
           <SelectTrigger className="w-20 cursor-pointer">
             <SelectValue />
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="5">5</SelectItem>
             <SelectItem value="10">10</SelectItem>
             <SelectItem value="20">20</SelectItem>
             <SelectItem value="50">50</SelectItem>
             <SelectItem value="100">100</SelectItem>
           </SelectContent>
         </Select>
       )}
    </div>
  )
}

// Main Component
export function DynamicTable({ 
  data, 
  columns, 
  filters, 
  sortOptions, 
  title, 
  description, 
  headerActions, 
  paginationType = 'full', 
  loading = false, 
  emptyState, 
  onAction 
}: DynamicTableProps) {
  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [currentSort, setCurrentSort] = useState('')
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [isFiltering, setIsFiltering] = useState(false)
  const [isSorting, setIsSorting] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  
  // Debounced search
  const debouncedSearch = useDebounce(searchQuery, 300)
  
  // Effects
  useEffect(() => {
    if (debouncedSearch !== searchQuery) {
      setIsSearching(true)
      onAction({ type: 'search', data: debouncedSearch })
      // Reset loading state after a delay to allow parent to handle
      setTimeout(() => setIsSearching(false), 100)
    }
  }, [debouncedSearch, searchQuery, onAction])
  
  // Handlers
  const handleSortChange = useCallback((sortValue: string) => {
    setCurrentSort(sortValue)
    setIsSorting(true)
    onAction({ type: 'sort', data: sortValue })
    // Reset loading state after a delay to allow parent to handle
    setTimeout(() => setIsSorting(false), 100)
  }, [onAction])
  
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    onAction({ type: 'page', data: page })
  }, [onAction])
  
  const handleFilterApply = useCallback((filters: Record<string, unknown>) => {
    setShowFilterModal(false)
    setIsFiltering(true)
    // Filter out "all" values and empty strings
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => 
        value !== 'all' && value !== '' && value !== null && value !== undefined
      )
    )
    onAction({ type: 'filter', data: cleanFilters })
    // Reset loading state after a delay to allow parent to handle
    setTimeout(() => setIsFiltering(false), 100)
  }, [onAction])
  
  const handlePerPageChange = useCallback((perPage: number) => {
    setPerPage(perPage)
    setCurrentPage(1)
    onAction({ type: 'perPage', data: perPage })
  }, [onAction])
  
     // Render table
   const renderTable = () => {
     if (loading) return <TableSkeleton columns={columns} />
     if (data.length === 0) return <NoDataComponent {...emptyState} />
     
     // Calculate pagination
     const startIndex = (currentPage - 1) * perPage
     const endIndex = startIndex + perPage
     const currentPageData = data.slice(startIndex, endIndex)
     
     return (
       <div className="overflow-x-auto">
         <table className="w-full">
           <thead>
             <tr className="border-b">
               {columns.map(col => (
                 <th 
                   key={col.key} 
                   className={cn(
                     "text-left p-3 font-medium text-sm",
                     col.width && `w-[${col.width}]`,
                     col.align === 'center' && "text-center",
                     col.align === 'right' && "text-right"
                   )}
                 >
                   {col.label}
                 </th>
               ))}
             </tr>
           </thead>
           <tbody>
             {currentPageData.map((row, index) => (
               <tr key={startIndex + index} className="border-b hover:bg-muted/50">
                 {columns.map(col => (
                   <td 
                     key={col.key} 
                     className={cn(
                       "p-3 text-sm",
                       col.align === 'center' && "text-center",
                       col.align === 'right' && "text-right"
                     )}
                   >
                     {renderCell(col, row, startIndex + index)}
                   </td>
                 ))}
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     )
   }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {headerActions && (
            <div className="flex gap-2">{headerActions}</div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Search and Controls Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            {isSearching ? (
              <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            )}
            <Input
              placeholder={isSearching ? "Searching..." : "Search..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 cursor-text"
              disabled={isSearching}
            />
          </div>
          
          <div className="flex gap-2">
                         {filters && filters.length > 0 && (
               <Button
                 variant="outline"
                 onClick={() => setShowFilterModal(true)}
                 className="flex items-center gap-2 cursor-pointer"
                 disabled={isFiltering}
               >
                 {isFiltering ? (
                   <Loader2 className="h-4 w-4 animate-spin" />
                 ) : (
                   <Filter className="h-4 w-4" />
                 )}
                 {isFiltering ? 'Filtering...' : 'Filters'}
               </Button>
             )}
             
             {sortOptions && Object.keys(sortOptions).length > 0 && (
               <Select value={currentSort} onValueChange={handleSortChange} disabled={isSorting}>
                 <SelectTrigger className="w-40 cursor-pointer">
                   <SelectValue placeholder={isSorting ? "Sorting..." : "Sort by..."} />
                 </SelectTrigger>
                 <SelectContent>
                   {Object.entries(sortOptions).map(([value, label]) => (
                     <SelectItem key={value} value={value}>
                       {label}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             )}
          </div>
        </div>
        
        {/* Table */}
        {renderTable()}
        
        {/* Pagination */}
                 {paginationType !== 'none' && data.length > 0 && (
           <PaginationControls
             type={paginationType}
             currentPage={currentPage}
             totalPages={Math.ceil(data.length / perPage)}
             perPage={perPage}
             onPageChange={handlePageChange}
             onPerPageChange={handlePerPageChange}
           />
         )}
      </CardContent>
      
      {/* Filter Modal */}
      <FilterModal
        open={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onApply={handleFilterApply}
        isFiltering={isFiltering}
      />
    </Card>
  )
}

// Export NoDataComponent separately
export function NoDataComponent({ 
  title = "No data found", 
  description = "There are no items to display at the moment.", 
  icon, 
  action, 
  actionLabel 
}: EmptyStateConfig) {
  return (
    <div className="text-center py-12">
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      {action && actionLabel && (
        <Button onClick={action} className="cursor-pointer">{actionLabel}</Button>
      )}
    </div>
  )
}
