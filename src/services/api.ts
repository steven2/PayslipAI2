// Base API configuration - can be pointed to SAP Gateway later
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3003'

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  status: number
}

class ApiService {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      let data
      try {
        data = await response.json()
      } catch (parseError) {
        // Handle non-JSON responses (like HTML error pages)
        const textData = await response.text()
        
        if (!response.ok) {
          return {
            error: `Server returned ${response.status}: Expected JSON but received HTML/text response`,
            status: response.status,
          }
        }
        
        data = { message: textData }
      }

      if (!response.ok) {
        return {
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
        }
      }

      return {
        data,
        status: response.status,
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error',
        status: 0,
      }
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseURL}${endpoint}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }
    
    return this.request(url.pathname + url.search)
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request(endpoint, {
      method: 'DELETE',
    })
  }
}

export const apiService = new ApiService(API_BASE_URL) 