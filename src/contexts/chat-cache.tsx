

import { createContext, useContext, useState, ReactNode } from "react"

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: number
}

interface ChatCacheContextType {
  messages: Message[]
  setMessages: (messages: Message[]) => void
}

const ChatCacheContext = createContext<ChatCacheContextType | undefined>(undefined)

export function ChatCacheProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([])

  return (
    <ChatCacheContext.Provider value={{ messages, setMessages }}>
      {children}
    </ChatCacheContext.Provider>
  )
}

export function useChatCache() {
  const context = useContext(ChatCacheContext)
  if (context === undefined) {
    throw new Error("useChatCache must be used within a ChatCacheProvider")
  }
  return context
} 