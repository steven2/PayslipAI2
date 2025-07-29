

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type AIModel = 'openai' | 'llama' | 'cohere'

interface SettingsContextType {
  aiModel: AIModel
  setAIModel: (model: AIModel) => void
  llamaEndpoint: string
  setLlamaEndpoint: (endpoint: string) => void
  openaiModel: string
  setOpenaiModel: (model: string) => void
  llamaModel: string
  setLlamaModel: (model: string) => void
  cohereModel: string
  setCohereModel: (model: string) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [aiModel, setAIModelState] = useState<AIModel>('openai')
  const [llamaEndpoint, setLlamaEndpointState] = useState('http://localhost:11434')
  const [openaiModel, setOpenaiModelState] = useState('gpt-4o-mini')
  const [llamaModel, setLlamaModelState] = useState('llama3')
  const [cohereModel, setCohereModelState] = useState('command-a-03-2025')

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedAIModel = localStorage.getItem('aiModel') as AIModel
    const savedLlamaEndpoint = localStorage.getItem('llamaEndpoint')
    const savedOpenaiModel = localStorage.getItem('openaiModel')
    const savedLlamaModel = localStorage.getItem('llamaModel')
    const savedCohereModel = localStorage.getItem('cohereModel')

    if (savedAIModel) {
      setAIModelState(savedAIModel)
    }
    if (savedLlamaEndpoint) {
      setLlamaEndpointState(savedLlamaEndpoint)
    }
    if (savedOpenaiModel) {
      setOpenaiModelState(savedOpenaiModel)
    }
    if (savedLlamaModel) {
      setLlamaModelState(savedLlamaModel)
    }
    if (savedCohereModel) {
      setCohereModelState(savedCohereModel)
    }
  }, [])

  const setAIModel = (model: AIModel) => {
    setAIModelState(model)
    localStorage.setItem('aiModel', model)
  }

  const setLlamaEndpoint = (endpoint: string) => {
    setLlamaEndpointState(endpoint)
    localStorage.setItem('llamaEndpoint', endpoint)
  }

  const setOpenaiModel = (model: string) => {
    setOpenaiModelState(model)
    localStorage.setItem('openaiModel', model)
  }

  const setLlamaModel = (model: string) => {
    setLlamaModelState(model)
    localStorage.setItem('llamaModel', model)
  }

  const setCohereModel = (model: string) => {
    setCohereModelState(model)
    localStorage.setItem('cohereModel', model)
  }

  return (
    <SettingsContext.Provider value={{
      aiModel,
      setAIModel,
      llamaEndpoint,
      setLlamaEndpoint,
      openaiModel,
      setOpenaiModel,
      llamaModel,
      setLlamaModel,
      cohereModel,
      setCohereModel
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
} 