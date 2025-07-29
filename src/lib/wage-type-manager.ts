import * as XLSX from 'xlsx'
import path from 'path'
import fs from 'fs'

export interface WageType {
  id: string
  name: string
  category: 'Earnings' | 'Allowances' | 'Deductions' | 'Benefits'
  description: string
  calculationMethod: string
  taxable: boolean
  status: 'Active' | 'Inactive'
  effectiveDate?: string
  lastUpdated?: string
}

export interface WageTypeMetadata {
  fileVersion: string
  lastUpdated: string
  totalRecords: number
  categories: string[]
  statusOptions: string[]
}

export class WageTypeManager {
  private filePath: string
  private wageTypes: WageType[] = []
  private metadata: WageTypeMetadata | null = null
  private lastLoadTime: number = 0
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  constructor() {
    // Use absolute path that works in Next.js environment
    this.filePath = path.join(process.cwd(), 'public', 'wage-types-catalog.xlsx')
  }

  private shouldReload(): boolean {
    return Date.now() - this.lastLoadTime > this.CACHE_DURATION
  }

  async loadWageTypes(): Promise<WageType[]> {
    try {
      // Check if we need to reload the data
      if (this.wageTypes.length > 0 && !this.shouldReload()) {
        return this.wageTypes
      }

      // Check if file exists
      if (!fs.existsSync(this.filePath)) {
        throw new Error(`Excel file not found at: ${this.filePath}`)
      }

      // Read the Excel file using fs.readFileSync and then parse with XLSX
      const fileBuffer = fs.readFileSync(this.filePath)
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' })
      
      // Get the WageTypes sheet
      const wageTypesSheet = workbook.Sheets['WageTypes']
      if (!wageTypesSheet) {
        throw new Error('WageTypes sheet not found in Excel file')
      }

      // Convert sheet to JSON
      const rawData = XLSX.utils.sheet_to_json(wageTypesSheet) as any[]
      
      // Transform the data to match our interface
      this.wageTypes = rawData.map((row) => ({
        id: row.id || '',
        name: row.name || '',
        category: row.category || 'Earnings',
        description: row.description || '',
        calculationMethod: row.calculationMethod || '',
        taxable: Boolean(row.taxable),
        status: row.status || 'Active',
        effectiveDate: row.effectiveDate || '',
        lastUpdated: row.lastUpdated || ''
      }))

      // Load metadata if available
      if (workbook.Sheets['Metadata']) {
        const metadataSheet = workbook.Sheets['Metadata']
        const metadataRaw = XLSX.utils.sheet_to_json(metadataSheet) as any[]
        
        const metadataMap = metadataRaw.reduce((acc, row) => {
          acc[row.Property] = row.Value
          return acc
        }, {} as Record<string, any>)

        this.metadata = {
          fileVersion: metadataMap['File Version'] || '1.0',
          lastUpdated: metadataMap['Last Updated'] || '',
          totalRecords: Number(metadataMap['Total Records']) || this.wageTypes.length,
          categories: metadataMap['Categories'] ? metadataMap['Categories'].split(', ') : [],
          statusOptions: metadataMap['Status Options'] ? metadataMap['Status Options'].split(', ') : []
        }
      }

      this.lastLoadTime = Date.now()
      console.log(`Successfully loaded ${this.wageTypes.length} wage types from Excel file`)
      return this.wageTypes
    } catch (error) {
      console.error('Error loading wage types from Excel:', error)
      
      // Return fallback data if Excel file cannot be read
      this.wageTypes = this.getFallbackWageTypes()
      return this.wageTypes
    }
  }

  private getFallbackWageTypes(): WageType[] {
    return [
      {
        id: "WT001",
        name: "Basic Salary",
        category: "Earnings",
        description: "Regular monthly salary based on employment contract",
        calculationMethod: "Fixed amount as per contract",
        taxable: true,
        status: "Active"
      },
      {
        id: "WT002",
        name: "Housing Allowance",
        category: "Allowances",
        description: "Monthly allowance to cover housing expenses",
        calculationMethod: "Percentage of basic salary (15%)",
        taxable: false,
        status: "Active"
      },
      {
        id: "WT005",
        name: "Income Tax",
        category: "Deductions",
        description: "Mandatory tax deduction based on income bracket",
        calculationMethod: "Progressive tax rates based on income level",
        taxable: false,
        status: "Active"
      }
    ]
  }

  async getWageTypes(): Promise<WageType[]> {
    return await this.loadWageTypes()
  }

  async getWageTypeById(id: string): Promise<WageType | null> {
    const wageTypes = await this.getWageTypes()
    return wageTypes.find(wt => wt.id === id) || null
  }

  async getWageTypesByCategory(category: WageType['category']): Promise<WageType[]> {
    const wageTypes = await this.getWageTypes()
    return wageTypes.filter(wt => wt.category === category)
  }

  async getActiveWageTypes(): Promise<WageType[]> {
    const wageTypes = await this.getWageTypes()
    return wageTypes.filter(wt => wt.status === 'Active')
  }

  async searchWageTypes(query: string): Promise<WageType[]> {
    const wageTypes = await this.getWageTypes()
    const searchTerm = query.toLowerCase()
    
    return wageTypes.filter(wt => 
      wt.name.toLowerCase().includes(searchTerm) ||
      wt.description.toLowerCase().includes(searchTerm) ||
      wt.category.toLowerCase().includes(searchTerm) ||
      wt.id.toLowerCase().includes(searchTerm) ||
      wt.calculationMethod.toLowerCase().includes(searchTerm)
    )
  }

  async getWageTypeStats(): Promise<{
    total: number
    byCategory: Record<string, number>
    byStatus: Record<string, number>
    metadata: WageTypeMetadata | null
  }> {
    const wageTypes = await this.getWageTypes()
    
    const byCategory = wageTypes.reduce((acc, wt) => {
      acc[wt.category] = (acc[wt.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const byStatus = wageTypes.reduce((acc, wt) => {
      acc[wt.status] = (acc[wt.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total: wageTypes.length,
      byCategory,
      byStatus,
      metadata: this.metadata
    }
  }

  async getCategories(): Promise<string[]> {
    const wageTypes = await this.getWageTypes()
    return [...new Set(wageTypes.map(wt => wt.category))]
  }

  // Method to refresh data (force reload)
  async refreshData(): Promise<WageType[]> {
    this.lastLoadTime = 0 // Force reload
    return await this.loadWageTypes()
  }

  // Method to get file metadata
  async getMetadata(): Promise<WageTypeMetadata | null> {
    await this.loadWageTypes() // Ensure data is loaded
    return this.metadata
  }
}

// Export a singleton instance
export const wageTypeManager = new WageTypeManager() 