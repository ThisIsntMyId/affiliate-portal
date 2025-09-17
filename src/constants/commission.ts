// Commission Type Constants
export const CommissionType = {
  FIXED: 'fixed',
  PERCENT: 'percent'
} as const;

// Commission Type Labels for UI Display
export const CommissionTypeLabels = {
  [CommissionType.FIXED]: 'Fixed',
  [CommissionType.PERCENT]: 'Percent',
} as const;

// Commission Type Colors for UI Display
export const CommissionTypeColors = {
  [CommissionType.FIXED]: 'bg-gray-100 text-gray-800',
  [CommissionType.PERCENT]: 'bg-green-100 text-green-800',
} as const;