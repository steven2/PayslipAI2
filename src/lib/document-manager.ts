import { promises as fs } from 'fs'
import path from 'path'

export interface Document {
  id: string
  name: string
  filename: string
  type: 'Policy' | 'Guide' | 'Reference' | 'FAQ'
  description: string
  content: string
  uploadDate: string
  size: string
  status: 'Active' | 'Archived' | 'Draft'
  version: string
  lastUpdated: string
  documentId?: string
  effectiveFrom: string  // Format: YYYY-MM-DD
  effectiveTo?: string   // Format: YYYY-MM-DD, undefined means current/ongoing
  applicableMonths?: number[] // Array of month numbers (0-11) when this document applies, undefined means all months
}

export interface DocumentVersion {
  version: string
  effectiveFrom: string
  effectiveTo?: string
  filename: string
  description?: string
}

export class DocumentManager {
  private documentsPath: string
  private documents: Document[] = []
  private documentVersions: Map<string, DocumentVersion[]> = new Map()
  
  constructor() {
    this.documentsPath = path.join(process.cwd(), 'public', 'documents')
    this.initializeVersionMappings()
  }

  private initializeVersionMappings() {
    // Define version mappings for different documents
    // This allows multiple versions of the same document for different time periods
    
    this.documentVersions.set('payroll-policy', [
      {
        version: '1.0',
        effectiveFrom: '2024-01-01',
        effectiveTo: '2024-06-30',
        filename: 'payroll-policy-2024-h1.txt',
        description: 'First half 2024 payroll policy'
      },
      {
        version: '1.1',
        effectiveFrom: '2024-07-01',
        filename: 'payroll-policy-2024-h2.txt',
        description: 'Second half 2024 payroll policy with updated tax rates'
      }
    ])

    this.documentVersions.set('tax-calculation', [
      {
        version: '3.1',
        effectiveFrom: '2024-01-01',
        effectiveTo: '2024-03-31',
        filename: 'tax-calculation-q1-2024.txt',
        description: 'Q1 2024 tax calculation reference'
      },
      {
        version: '3.2',
        effectiveFrom: '2024-04-01',
        filename: 'tax-calculation-reference.txt',
        description: 'Updated tax calculation reference from Q2 2024'
      }
    ])

    this.documentVersions.set('overtime-policy', [
      {
        version: '2.0',
        effectiveFrom: '2024-01-01',
        filename: 'overtime-policy.txt',
        description: 'Current overtime policy'
      }
    ])

    this.documentVersions.set('benefits-overview', [
      {
        version: '1.0',
        effectiveFrom: '2024-01-01',
        filename: 'benefits-overview.txt',
        description: 'Current benefits overview'
      }
    ])

    this.documentVersions.set('salary-structure', [
      {
        version: '2.0',
        effectiveFrom: '2024-01-01',
        effectiveTo: '2024-05-31',
        filename: 'salary-structure-guide-old.txt',
        description: 'Legacy salary structure guide'
      },
      {
        version: '2.1',
        effectiveFrom: '2024-06-01',
        filename: 'salary-structure-guide.txt',
        description: 'Updated salary structure guide with new allowance rates'
      }
    ])
  }

  async loadDocuments(): Promise<Document[]> {
    return this.loadDocumentsFromFileSystem()
  }

  private async loadDocumentsFromFileSystem(): Promise<Document[]> {
    try {
      // Define our base document mappings
      const baseDocumentMappings = [
        {
          baseId: 'payroll-policy',
          name: 'Payroll Policy 2024',
          type: 'Policy' as const,
          description: 'Official company payroll policy document outlining salary structures, benefits, deductions, and payment procedures',
          documentId: 'POL-PAY-2024-001'
        },
        {
          baseId: 'salary-structure',
          name: 'Salary Structure Guide',
          type: 'Guide' as const,
          description: 'Detailed explanation of salary components, allowances, deductions, and calculation methods'
        },
        {
          baseId: 'tax-calculation',
          name: 'Tax Calculation Reference',
          type: 'Reference' as const,
          description: 'Comprehensive reference for tax calculation methods, brackets, exemptions, and deductions',
          documentId: 'TAX-REF-2024'
        },
        {
          baseId: 'benefits-overview',
          name: 'Benefits Overview',
          type: 'Guide' as const,
          description: 'Complete guide to employee benefits including health insurance, retirement plans, time off, and professional development'
        },
        {
          baseId: 'overtime-policy',
          name: 'Overtime Policy',
          type: 'Policy' as const,
          description: 'Policy document for overtime calculation, authorization, compensation rates, and compliance requirements',
          documentId: 'HR-OT-001'
        }
      ]

      // Generate documents for each version
      const allDocuments: Document[] = []
      let documentIdCounter = 1

      for (const baseDoc of baseDocumentMappings) {
        const versions = this.documentVersions.get(baseDoc.baseId) || []
        
        for (const versionInfo of versions) {
          try {
            const filePath = path.join(this.documentsPath, versionInfo.filename)
            
            // Check if file exists, if not use fallback
            let content = ''
            let size = '0 KB'
            
            try {
              content = await fs.readFile(filePath, 'utf-8')
              const stats = await fs.stat(filePath)
              const sizeInKB = Math.round(stats.size / 1024)
              size = sizeInKB < 1000 ? `${sizeInKB} KB` : `${(sizeInKB / 1024).toFixed(1)} MB`
            } catch (fileError) {
              // Try to find the base filename if versioned file doesn't exist
              const basePath = path.join(this.documentsPath, baseDoc.baseId.replace('-', '-') + '.txt')
              try {
                content = await fs.readFile(basePath, 'utf-8')
                const stats = await fs.stat(basePath)
                const sizeInKB = Math.round(stats.size / 1024)
                size = sizeInKB < 1000 ? `${sizeInKB} KB` : `${(sizeInKB / 1024).toFixed(1)} MB`
              } catch (baseFileError) {
                console.warn(`Could not load file for ${baseDoc.baseId} version ${versionInfo.version}`)
                content = `Document content unavailable for ${baseDoc.name} version ${versionInfo.version}`
              }
            }

            const document: Document = {
              id: documentIdCounter.toString(),
              name: `${baseDoc.name} v${versionInfo.version}`,
              filename: versionInfo.filename,
              type: baseDoc.type,
              description: versionInfo.description || baseDoc.description,
              content,
              size,
              uploadDate: versionInfo.effectiveFrom,
              status: versionInfo.effectiveTo ? 'Archived' : 'Active',
              version: versionInfo.version,
              lastUpdated: versionInfo.effectiveFrom,
              documentId: baseDoc.documentId,
              effectiveFrom: versionInfo.effectiveFrom,
              effectiveTo: versionInfo.effectiveTo
            }

            allDocuments.push(document)
            documentIdCounter++
          } catch (error) {
            console.error(`Error loading document version ${versionInfo.version} for ${baseDoc.baseId}:`, error)
          }
        }
      }

      this.documents = allDocuments
      return this.documents
    } catch (error) {
      console.error('Error loading documents from file system:', error)
      return []
    }
  }

  // Get documents that are effective for a specific date
  async getDocumentsForDate(targetDate: Date): Promise<Document[]> {
    const documents = await this.getDocuments()
    const targetDateStr = targetDate.toISOString().split('T')[0]
    
    return documents.filter(doc => {
      const effectiveFrom = doc.effectiveFrom
      const effectiveTo = doc.effectiveTo
      
      const isAfterEffectiveFrom = targetDateStr >= effectiveFrom
      const isBeforeEffectiveTo = !effectiveTo || targetDateStr <= effectiveTo
      
      return isAfterEffectiveFrom && isBeforeEffectiveTo
    })
  }

  // Get documents for a specific month and year (for payslip context)
  async getDocumentsForPayslipDate(month: number, year: number): Promise<Document[]> {
    const targetDate = new Date(year, month, 15) // Use 15th of the month as reference point
    return this.getDocumentsForDate(targetDate)
  }

  // Get the most recent version of each document type for a given date
  async getLatestDocumentsForDate(targetDate: Date): Promise<Document[]> {
    const documentsForDate = await this.getDocumentsForDate(targetDate)
    
    // Group documents by base type and get the latest version
    const latestDocs = new Map<string, Document>()
    
    for (const doc of documentsForDate) {
      const baseType = doc.name.split(' v')[0] // Remove version from name to get base type
      const existingDoc = latestDocs.get(baseType)
      
      if (!existingDoc || doc.version > existingDoc.version) {
        latestDocs.set(baseType, doc)
      }
    }
    
    return Array.from(latestDocs.values())
  }

  async getDocuments(): Promise<Document[]> {
    if (this.documents.length === 0) {
      await this.loadDocuments()
    }
    return this.documents
  }

  async getDocumentById(id: string): Promise<Document | null> {
    const documents = await this.getDocuments()
    return documents.find(doc => doc.id === id) || null
  }

  async getDocumentByName(name: string): Promise<Document | null> {
    const documents = await this.getDocuments()
    return documents.find(doc => 
      doc.name.toLowerCase().includes(name.toLowerCase())
    ) || null
  }

  async searchDocuments(query: string): Promise<Document[]> {
    const documents = await this.getDocuments()
    const searchTerm = query.toLowerCase()
    
    return documents.filter(doc => 
      doc.name.toLowerCase().includes(searchTerm) ||
      doc.description.toLowerCase().includes(searchTerm) ||
      doc.type.toLowerCase().includes(searchTerm) ||
      doc.content.toLowerCase().includes(searchTerm)
    )
  }

  async getDocumentsByType(type: Document['type']): Promise<Document[]> {
    const documents = await this.getDocuments()
    return documents.filter(doc => doc.type === type)
  }

  async getDocumentContent(id: string): Promise<string | null> {
    const document = await this.getDocumentById(id)
    return document?.content || null
  }

  async getDocumentStats(): Promise<{
    total: number
    byType: Record<string, number>
    totalSize: string
    versions: Record<string, number>
  }> {
    const documents = await this.getDocuments()
    
    const byType = documents.reduce((acc, doc) => {
      acc[doc.type] = (acc[doc.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const versions = documents.reduce((acc, doc) => {
      const baseType = doc.name.split(' v')[0]
      acc[baseType] = (acc[baseType] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Calculate total size (rough approximation)
    const totalSizeKB = documents.reduce((acc, doc) => {
      const sizeMatch = doc.size.match(/(\d+(?:\.\d+)?)\s*(KB|MB)/)
      if (sizeMatch) {
        const value = parseFloat(sizeMatch[1])
        const unit = sizeMatch[2]
        return acc + (unit === 'MB' ? value * 1024 : value)
      }
      return acc
    }, 0)

    const totalSize = totalSizeKB < 1000 
      ? `${Math.round(totalSizeKB)} KB`
      : `${(totalSizeKB / 1024).toFixed(1)} MB`

    return {
      total: documents.length,
      byType,
      totalSize,
      versions
    }
  }

  // Extract relevant information for payslip questions with date context
  async getRelevantContentForPayslip(question: string, month: number, year: number): Promise<string> {
    const documents = await this.getDocumentsForPayslipDate(month, year)
    const questionLower = question.toLowerCase()
    
    // Keywords mapping to document types
    const keywordMappings = {
      'tax': ['tax', 'deduction', 'withholding', 'bracket', 'rate'],
      'overtime': ['overtime', 'extra hours', 'weekend', 'holiday work'],
      'benefits': ['benefit', 'insurance', 'health', 'dental', 'vision', 'retirement'],
      'salary': ['salary', 'wage', 'pay', 'allowance', 'basic salary', 'housing'],
      'policy': ['policy', 'rule', 'regulation', 'procedure']
    }

    const relevantDocs: Document[] = []
    
    // Find documents that contain relevant keywords
    for (const [category, keywords] of Object.entries(keywordMappings)) {
      if (keywords.some(keyword => questionLower.includes(keyword))) {
        const categoryDocs = documents.filter(doc => 
          doc.name.toLowerCase().includes(category) ||
          doc.description.toLowerCase().includes(category) ||
          keywords.some(keyword => doc.content.toLowerCase().includes(keyword))
        )
        relevantDocs.push(...categoryDocs)
      }
    }

    // Remove duplicates
    const uniqueDocs = relevantDocs.filter((doc, index, self) => 
      index === self.findIndex(d => d.id === doc.id)
    )

    if (uniqueDocs.length === 0) {
      // Return a summary from all documents if no specific match
      return documents.map(doc => 
        `Document: ${doc.name} (Effective: ${doc.effectiveFrom}${doc.effectiveTo ? ` to ${doc.effectiveTo}` : ' - Current'})\n` +
        `Description: ${doc.description}`
      ).join('\n\n')
    }

    // Return content from relevant documents with version info
    return uniqueDocs.map(doc => 
      `Document: ${doc.name} (Version ${doc.version})\n` +
      `Effective Period: ${doc.effectiveFrom}${doc.effectiveTo ? ` to ${doc.effectiveTo}` : ' - Current'}\n` +
      `Content:\n${doc.content}`
    ).join('\n\n---\n\n')
  }

  // Backward compatibility - delegates to new method with current date
  async getRelevantContent(question: string): Promise<string> {
    const now = new Date()
    return this.getRelevantContentForPayslip(question, now.getMonth(), now.getFullYear())
  }

  // Get all versions of a specific document
  async getDocumentVersions(baseDocumentId: string): Promise<Document[]> {
    const documents = await this.getDocuments()
    const baseDocName = baseDocumentId.replace('-', ' ').toLowerCase()
    
    return documents.filter(doc => 
      doc.name.toLowerCase().includes(baseDocName) ||
      doc.documentId === baseDocumentId
    ).sort((a, b) => b.version.localeCompare(a.version))
  }

  // Document management methods - now use in-memory operations only
  async createDocument(document: Omit<Document, 'id'>): Promise<Document> {
    const newId = (this.documents.length + 1).toString()
    const created: Document = {
      ...document,
      id: newId
    }
    
    this.documents.push(created)
    return created
  }

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document> {
    const index = this.documents.findIndex(doc => doc.id === id)
    if (index === -1) {
      throw new Error(`Document with id ${id} not found`)
    }
    
    this.documents[index] = { ...this.documents[index], ...updates }
    return this.documents[index]
  }

  async deleteDocument(id: string): Promise<void> {
    const index = this.documents.findIndex(doc => doc.id === id)
    if (index === -1) {
      throw new Error(`Document with id ${id} not found`)
    }
    
    this.documents.splice(index, 1)
  }
}

// Export a singleton instance
export const documentManager = new DocumentManager() 