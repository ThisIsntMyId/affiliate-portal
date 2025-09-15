"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Search, Filter, ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react'
import { get } from 'lodash'
import { cn } from '@/lib/utils'

// UI Components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { Pagination } from '@/lib/paginate'
import useDebounce from '@/lib/useDebounce'

// Types
export interface PaginationData {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface ColumnConfig {
  key: string
  label: string
  field?: string // for nested data like 'user.profile.name'
  type: 'text' | 'image' | 'tag' | 'custom' | 'actions'
  width?: string
  align?: 'left' | 'center' | 'right'

  // For image type
  imageWidth?: string // e.g., '70px', '80px'
  imageHeight?: string // e.g., '70px', '80px'

  // For tag type
  tagColors?: Record<string, string> // { active: 'bg-green-500', inactive: 'bg-red-500' }
  tagLabel?: Record<string, string> // { active: 'Active', inactive: 'Inactive' }

  // For custom type
  render?: (row: Record<string, unknown>, index: number) => React.ReactNode

  // For actions type
  actions?: {
    label: string
    icon?: React.ReactNode
    onClick?: (row: Record<string, unknown>) => void
    url?: string | ((row: Record<string, unknown>) => string)
    variant?: 'default' | 'outline' | 'destructive'
    newTab?: boolean
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
  | { type: 'filter'; data: { key: string, value: string } }
  | { type: 'filterBatch'; data: Record<string, unknown> }
  | { type: 'sort'; data: string }
  | { type: 'page'; data: number }
  | { type: 'search'; data: string }
  | { type: 'perPage'; data: number }

export interface DynamicTableProps {
  data: Record<string, unknown>[]
  pagination?: Pagination
  pageLimits?: number[]

  columns: ColumnConfig[]

  searchQuery?: string
  filters?: FilterConfig[] // For modal
  quickFilters?: FilterConfig[] // For inline controls
  filterValues?: Record<string, string> // For showing selected values
  sortOptions?: Record<string, string> // { latest: "Latest", oldest: "Oldest" }
  sortBy?: string

  loading?: boolean

  onAction?: (action: TableAction) => void

  emptyState?: EmptyStateConfig

  // Feature toggles
  searchable?: boolean
  filterable?: boolean
  sortable?: boolean
}

// Helper function for nested data
function getNestedValue(obj: Record<string, unknown>, path?: string): unknown {
  if (!path) return obj
  return get(obj, path)
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
      
      const imageWidth = column.imageWidth || '70px'
      const imageHeight = column.imageHeight || '70px'
      
      return (
        <div 
          className="border border-gray-200 rounded-md bg-gray-50 flex items-center justify-center overflow-hidden"
          style={{ width: imageWidth, height: imageHeight }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      )

    case 'tag':
      const tagValue = getNestedValue(row, column.field)
      if (!tagValue || typeof tagValue !== 'string') return '-'
      const color = column.tagColors?.[tagValue] || 'bg-gray-500 text-gray-900'
      return (
        <Badge className={color}>
          {column.tagLabel?.[tagValue] || tagValue}
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
  if (!actions || actions.length === 0) {
    return '-';
  }

  return (
    <div className="flex items-center gap-2">
      {actions.map((action, index) => {
        // If a URL is provided, render a Link component styled as a Button.
        if (action.url) {
          const href = typeof action.url === 'function' ? action.url(row) : action.url;

          return (
            <Button key={index} variant={action.variant || 'outline'} size="sm" asChild>
              <Link
                href={href}
                target={action.newTab ? '_blank' : undefined}
                rel={action.newTab ? 'noopener noreferrer' : undefined}
              >
                {action.icon}
                <span className={action.icon ? 'ml-1' : ''}>{action.label}</span>
              </Link>
            </Button>
          );
        }

        // Otherwise, render a standard Button with an onClick handler.
        return (
          <Button
            key={index}
            variant={action.variant || 'outline'}
            size="sm"
            onClick={() => action.onClick?.(row)}
          >
            {action.icon}
            <span className={action.icon ? 'ml-1' : ''}>{action.label}</span>
          </Button>
        );
      })}
    </div>
  );
}

// Filter Modal Component
function FilterModal({
  open,
  onClose,
  filters,
  onApply,
  isFiltering,
  initialValues
}: {
  open: boolean
  onClose: () => void
  filters?: FilterConfig[]
  onApply: (filters: Record<string, unknown>) => void
  isFiltering: boolean
  initialValues?: Record<string, string>
}) {
  const [filterValues, setFilterValues] = useState<Record<string, string>>(initialValues || {})

  // Update filter values when initial values change
  useEffect(() => {
    if (initialValues) {
      setFilterValues(initialValues)
    }
  }, [initialValues])

  const handleApply = () => {
    onApply(filterValues)
  }

  const handleReset = () => {
    setFilterValues({})
    // Automatically apply reset and close modal
    onApply({})
    onClose()
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
                  value={filterValues[filter.key] || 'all'}
                  onValueChange={(value) => setFilterValues(prev => ({ ...prev, [filter.key]: value }))}
                >
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder={filter.placeholder || `Select ${filter.label}`} />
                  </SelectTrigger>
                  <SelectContent>
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
                "h-10",
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
  pagination,
  pageLimits,
  onPageChange,
  onPerPageChange
}: {
  pagination: Pagination
  pageLimits?: number[]
  onPageChange: (page: number) => void
  onPerPageChange: (perPage: number) => void
}) {
  return (
    <div className="flex items-center justify-between mt-6">
      {pagination.totalPages && pagination.page && (
        <div className="text-sm text-muted-foreground">
          Page {pagination.page} of {pagination.totalPages}
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={!pagination.hasPrev}
          className="cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex gap-1">
          {pagination?.totalPages > 1 &&
            (() => {
              const pageNumbers =
                pagination.totalPages <= 5
                  ? Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  : [1, 2, 3, '...', pagination.totalPages - 2, pagination.totalPages - 1, pagination.totalPages,];

              return pageNumbers.map((pageNum, index) => {
                if (typeof pageNum === 'string') {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="w-8 h-8 flex items-center justify-center"
                    >
                      ...
                    </span>
                  );
                }

                return (
                  <Button
                    key={pageNum}
                    variant={pagination.page === pageNum ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                    className="w-8 h-8 p-0 cursor-pointer"
                  >
                    {pageNum}
                  </Button>
                );
              });
            })()
          }
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={!pagination.hasNext}
          className="cursor-pointer"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {pageLimits && pagination.limit && (
        <Select value={String(pagination.limit)} onValueChange={(value) => onPerPageChange(Number(value))}>
          <SelectTrigger className="w-20 cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageLimits.map((limit) => (
              <SelectItem key={limit} value={String(limit)}>
                {limit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  )
}

// Main Component
export function DynamicTable({
  data,
  pagination,
  pageLimits,
  columns,
  filters,
  quickFilters,
  filterValues,
  sortBy,
  sortOptions,
  searchQuery,
  loading = false,
  emptyState,
  onAction,
  searchable = true,
  filterable = true,
  sortable = true,
}: DynamicTableProps) {
  // State
  const [internalSearchQuery, setInternalSearchQuery] = useState(searchQuery)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [isFiltering, setIsFiltering] = useState(false)

  // Debounced search
  const debouncedSearch = useDebounce(internalSearchQuery, 500)

  // Effects
  useEffect(() => {
    // Don't fire on initial mount if the search is empty
    if (debouncedSearch !== searchQuery) {
      onAction?.({ type: 'search', data: debouncedSearch ?? '' });
    }
}, [debouncedSearch, onAction, searchQuery]); 

  // Handlers
  const handleSortChange = useCallback((sortValue: string) => {
    onAction?.({ type: 'sort', data: sortValue })
  }, [onAction])

  const handlePageChange = useCallback((page: number) => {
    onAction?.({ type: 'page', data: page })
  }, [onAction])

  const handleFilterChange = useCallback((key: string, value: string) => {
    onAction?.({ type: 'filter', data: { key, value } });
  }, [onAction]);

  const handleClearSearch = useCallback(() => {
    setInternalSearchQuery('');
    onAction?.({ type: 'search', data: '' });
  }, [onAction]);

  const handleFilterApply = useCallback((filters: Record<string, unknown>) => {
    setShowFilterModal(false)
    setIsFiltering(true)
    // Filter out "all" values and empty strings
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([, value]) =>
        value !== 'all' && value !== '' && value !== null && value !== undefined
      )
    )
    onAction?.({ type: 'filterBatch', data: cleanFilters })
    // Reset loading state after a delay to allow parent to handle
    setTimeout(() => setIsFiltering(false), 100)
  }, [onAction])

  const handlePerPageChange = useCallback((perPage: number) => {
    onAction?.({ type: 'perPage', data: perPage })
  }, [onAction])

  // Count active filters
  const getActiveFilterCount = useCallback(() => {
    if (!filterValues) return 0
    return Object.values(filterValues).filter(value => 
      value && value !== '' && value !== 'all'
    ).length
  }, [filterValues])

  // Render table
  const renderTable = () => {
    if (loading) return <TableSkeleton columns={columns} />
    if (data.length === 0) return <NoDataComponent {...emptyState} />

    // Calculate pagination
    // const startIndex = (currentPage - 1) * perPage
    // const endIndex = startIndex + perPage
    // const currentPageData = data

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
            {data.map((row, index) => (
              <tr key={index} className="border-b hover:bg-muted/50">
                {columns.map(col => (
                  <td
                    key={col.key}
                    className={cn(
                      "p-3 text-sm",
                      col.align === 'center' && "text-center",
                      col.align === 'right' && "text-right"
                    )}
                  >
                    {renderCell(col, row, index)}
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
    <div className="w-full">
      <div>
        {/* Search and Controls Bar */}
        {(searchable || filterable || sortable) && (
          <div className="flex flex-col sm:flex-row gap-2 mb-6 flex-wrap items-center">
            {/* 1. MODIFIED: Search Input */}
            {searchable && (
              <div className="relative w-full sm:w-auto sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={"Search..."}
                  value={internalSearchQuery}
                  onChange={(e) => setInternalSearchQuery(e.target.value)}
                  className="pl-10 cursor-text pr-8"
                />
                {internalSearchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                    onClick={handleClearSearch}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {/* 2. NEW: Quick Filters */}
            {quickFilters?.map(filter => {
              // For now, we only implement the 'select' type inline
              if (filter.type === 'select') {
                return (
                  <Select
                    key={filter.key}
                    value={filterValues?.[filter.key] || ''}
                    onValueChange={(value) => handleFilterChange(filter.key, value)}
                  >
                    <SelectTrigger className="w-full sm:w-40 cursor-pointer">
                      <SelectValue placeholder={filter.label} />
                    </SelectTrigger>
                    <SelectContent>
                      {filter.options?.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )
              }
              return null;
            })}
            
            {/* 3. MODIFIED: Group remaining controls to the right */}
            <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
                {/* This button is now for "Advanced" filters from the modal */}
                {filterable && filters && filters.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setShowFilterModal(true)}
                    className="flex items-center gap-2 cursor-pointer relative"
                    disabled={isFiltering}
                  >
                    {isFiltering ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Filter className="h-4 w-4" />
                    )}
                    {isFiltering ? 'Filtering...' : 'Filters'}
                    {getActiveFilterCount() > 0 && (
                      <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {getActiveFilterCount()}
                      </span>
                    )}
                  </Button>
                )}

                {sortable && sortOptions && Object.keys(sortOptions).length > 0 && (
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-full sm:w-40 cursor-pointer">
                      <SelectValue placeholder={"Sort by..."} />
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
        )}

        {/* Table */}
        {renderTable()}

        {/* Pagination */}
        {pagination && (
          <PaginationControls
            pagination={pagination}
            pageLimits={pageLimits}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
          />
        )}
      </div>

      {/* Filter Modal */}
      {filterable && (
        <FilterModal
          open={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          filters={filters}
          onApply={handleFilterApply}
          isFiltering={isFiltering}
          initialValues={filterValues}
        />
      )}
    </div>
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
    <div className="text-center py-12 flex flex-col items-center justify-center">
      {icon && <div className="mb-4 text-muted-foreground align-center">{icon}</div>}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      {action && actionLabel && (
        <Button onClick={action} className="cursor-pointer">{actionLabel}</Button>
      )}
    </div>
  )
}
