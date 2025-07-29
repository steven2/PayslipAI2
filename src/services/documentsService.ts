import { apiService, ApiResponse } from './api'

export interface Document {
  id: string
  name: string
  filename: string
  type: string
  description: string
  content: string
  version: string
  effectiveFrom: string
  effectiveTo?: string
  uploadDate: string
  size: string
  status: string
  lastUpdated: string
}

export interface DocumentStats {
  totalDocuments: number
  activeDocuments: number
  documentsByType: Record<string, number>
  recentDocuments: Document[]
}

export const documentsService = {
  async getDocuments(params?: {
    id?: string
    search?: string
    type?: string
    stats?: boolean
    date?: string
    month?: string
    year?: string
    versions?: string
    latest?: boolean
  }): Promise<ApiResponse<Document[] | Document | DocumentStats>> {
    const searchParams: Record<string, string> = {}
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams[key] = String(value)
        }
      })
    }
    
    return apiService.get('/api/documents', searchParams)
  },

  async createDocument(document: Omit<Document, 'id'>): Promise<ApiResponse<Document>> {
    return apiService.post('/api/documents', document)
  },

  async updateDocument(id: string, updates: Partial<Document>): Promise<ApiResponse<Document>> {
    return apiService.put(`/api/documents?id=${id}`, updates)
  },

  async deleteDocument(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.delete(`/api/documents?id=${id}`)
  }
} 