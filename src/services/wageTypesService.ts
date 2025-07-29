import { apiService, ApiResponse } from './api'

export interface WageType {
  id: string
  name: string
  description: string
  calculationMethod: string
  taxable: boolean
  status: string
  category: string
  effectiveDate?: string
  lastUpdated?: string
}

export interface WageTypeStats {
  totalWageTypes: number
  activeWageTypes: number
  categoriesCount: number
  recentUpdates: WageType[]
}

export const wageTypesService = {
  async getWageTypes(params?: {
    id?: string
    search?: string
    category?: string
    status?: string
    stats?: boolean
    refresh?: boolean
  }): Promise<ApiResponse<WageType[] | WageType | WageTypeStats>> {
    const searchParams: Record<string, string> = {}
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams[key] = String(value)
        }
      })
    }
    
    return apiService.get('/api/wage-types', searchParams)
  },

  async getCategories(): Promise<ApiResponse<string[]>> {
    return apiService.get('/api/wage-types/categories')
  },

  async getMetadata(): Promise<ApiResponse<any>> {
    return apiService.get('/api/wage-types/metadata')
  }
} 