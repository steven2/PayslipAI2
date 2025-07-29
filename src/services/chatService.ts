import { apiService, ApiResponse } from './api'

export interface ChatMessage {
  message: string
  payslipData?: any
  currentDate?: { month: number; year: number }
  settings?: any
}

export interface ChatResponse {
  response: string
}

export const chatService = {
  async sendMessage(data: ChatMessage): Promise<ApiResponse<ChatResponse>> {
    return apiService.post('/api/chat', data)
  }
} 