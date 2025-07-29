const express = require('express')
const cors = require('cors')
const OpenAI = require('openai')
const { CohereClient } = require('cohere-ai')
const fs = require('fs').promises
const path = require('path')
require('dotenv').config()

// Polyfill fetch for Node.js versions that don't have it
if (!globalThis.fetch) {
  const fetch = require('node-fetch')
  globalThis.fetch = fetch
}

const app = express()
const PORT = process.env.PORT || 3003

// Middleware
app.use(cors())
app.use(express.json())

// Initialize AI clients (optional - only if API keys are provided)
let openai = null
let cohere = null

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

if (process.env.COHERE_API_KEY) {
  cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
  })
}

// Mock document manager (simplified version)
const documentManager = {
  async getRelevantContentForPayslip(message, month, year) {
    try {
      // Load relevant documents based on the message and date
      const documentsPath = path.join(__dirname, '..', 'public', 'documents')
      const files = await fs.readdir(documentsPath)
      
      let content = ''
      for (const file of files) {
        if (file.endsWith('.txt')) {
          const filePath = path.join(documentsPath, file)
          const fileContent = await fs.readFile(filePath, 'utf-8')
          content += `\n=== ${file} ===\n${fileContent}\n`
        }
      }
      
      return content || 'No relevant documents found.'
    } catch (error) {
      console.error('Error loading documents:', error)
      return 'Error loading documents.'
    }
  },

  async getRelevantContent(message) {
    return this.getRelevantContentForPayslip(message, new Date().getMonth(), new Date().getFullYear())
  }
}

// Mock wage type manager
const wageTypeManager = {
  async getActiveWageTypes() {
    // Return mock wage types that match our React app
    return [
      {
        id: "1000",
        name: "Basic Salary",
        category: "Earnings",
        description: "Monthly basic salary for regular employees",
        calculationMethod: "Fixed monthly amount as per employment contract",
        taxable: true,
        status: "Active",
        effectiveDate: "2024-01-01",
        lastUpdated: "2024-01-15"
      },
      {
        id: "1010",
        name: "Overtime Pay",
        category: "Earnings",
        description: "Additional compensation for hours worked beyond standard schedule",
        calculationMethod: "Regular hourly rate × 1.5 × overtime hours",
        taxable: true,
        status: "Active",
        effectiveDate: "2024-01-01",
        lastUpdated: "2024-01-15"
      },
      {
        id: "2000",
        name: "Housing Allowance",
        category: "Allowances",
        description: "Monthly allowance to support housing expenses",
        calculationMethod: "Fixed amount of $800 per month",
        taxable: true,
        status: "Active",
        effectiveDate: "2024-01-01",
        lastUpdated: "2024-01-15"
      },
      {
        id: "3000",
        name: "Income Tax",
        category: "Deductions",
        description: "Mandatory income tax deduction as per tax brackets",
        calculationMethod: "Progressive tax rates based on income level",
        taxable: false,
        status: "Active",
        effectiveDate: "2024-01-01",
        lastUpdated: "2024-01-15"
      },
      {
        id: "4000",
        name: "Health Insurance",
        category: "Benefits",
        description: "Company-provided health insurance coverage",
        calculationMethod: "2% of gross salary, company covers 80%",
        taxable: false,
        status: "Active",
        effectiveDate: "2024-01-01",
        lastUpdated: "2024-01-15"
      }
    ]
  }
}

// Chat API endpoint - exact replica of Next.js version
app.post('/api/chat', async (req, res) => {
  try {
    const { message, payslipData, currentDate, settings } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    // Get relevant document content based on the user's question and payslip date context
    let relevantContent
    
    if (currentDate && typeof currentDate.month === 'number' && typeof currentDate.year === 'number') {
      // Use month-specific document versions for payslip context
      relevantContent = await documentManager.getRelevantContentForPayslip(
        message, 
        currentDate.month, 
        currentDate.year
      )
    } else {
      // Fallback to current date if no payslip date provided
      relevantContent = await documentManager.getRelevantContent(message)
    }

    // Get wage type information from local manager
    const wageTypeContent = await getWageTypeContent()

    // Load AI instructions from file
    const aiInstructionsPath = path.join(__dirname, '..', 'ai-instructions.md')
    const aiInstructions = await fs.readFile(aiInstructionsPath, 'utf-8')

    // Prepare the context for the AI with enhanced date context
    const payslipDateInfo = currentDate ? 
      `Payslip Date: ${getMonthName(currentDate.month)} ${currentDate.year} (Month: ${currentDate.month}, Year: ${currentDate.year})` :
      'Payslip Date: Not specified'

    const contextMessage = `
CURRENT PAYSLIP DATA:
${payslipData ? JSON.stringify(payslipData, null, 2) : 'No payslip data provided'}

PAYSLIP DATE CONTEXT:
${payslipDateInfo}

RELEVANT DOCUMENT CONTENT (Version-specific for ${payslipDateInfo}):
${relevantContent}

${wageTypeContent}

IMPORTANT: The document content above has been selected based on the effective dates that apply to the payslip period. Use only the information from these documents and the wage type catalog when answering policy-related questions, as they represent the correct versions that were in effect during the payslip period.

For wage type questions, refer to the WAGE TYPE CATALOG section above which contains current active wage types with their descriptions, calculation methods, and tax implications.

USER QUESTION: ${message}
`

    let response

    // Determine which AI model to use based on settings
    const aiModel = settings?.aiModel || 'openai'
    
    if (aiModel === 'llama') {
      response = await callLlamaModel(aiInstructions, contextMessage, settings)
    } else if (aiModel === 'cohere') {
      response = await callCohereModel(aiInstructions, contextMessage, settings)
    } else {
      response = await callOpenAIModel(aiInstructions, contextMessage, settings)
    }

    res.json({ response })
  } catch (error) {
    console.error('Error in chat API:', error)
    
    // Check if it's an OpenAI API error
    if (error instanceof Error && error.message.includes('API key')) {
      return res.status(500).json({
        error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.'
      })
    }

    // Check if it's a Cohere API error
    if (error instanceof Error && error.message.includes('Cohere API key')) {
      return res.status(500).json({
        error: 'Cohere API key not configured. Please add COHERE_API_KEY to your environment variables.'
      })
    }

    // Check if it's a Llama connection error
    if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
      return res.status(500).json({
        error: 'Cannot connect to Llama server. Please ensure Ollama is running and accessible.'
      })
    }
    
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Helper function to get month name
function getMonthName(monthIndex) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  return months[monthIndex] || 'Unknown'
}

async function callOpenAIModel(systemMessage, userMessage, settings) {
  if (!openai) {
    throw new Error('OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.')
  }

  const model = settings?.openaiModel || 'gpt-4o-mini'
  
  const completion = await openai.chat.completions.create({
    model: model,
    messages: [
      {
        role: "system",
        content: systemMessage
      },
      {
        role: "user",
        content: userMessage
      }
    ],
    temperature: 0.7,
    max_tokens: 1000,
  })

  return completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again. 🤖"
}

async function callLlamaModel(systemMessage, userMessage, settings) {
  const endpoint = settings?.llamaEndpoint || 'http://localhost:11434'
  const model = settings?.llamaModel || 'llama3'
  
  try {
    const response = await fetch(`${endpoint}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: systemMessage
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 1000,
        }
      }),
    })

    if (!response.ok) {
      throw new Error(`Llama API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    // Ollama returns the response in a different format
    const content = data.message?.content || data.response || "I apologize, but I couldn't generate a response. Please try again. 🤖"
    
    return content
  } catch (error) {
    console.error('Error calling Llama model:', error)
    
    if (error instanceof Error && error.message.includes('fetch')) {
      throw new Error('ECONNREFUSED: Cannot connect to Llama server')
    }
    
    throw error
  }
}

async function callCohereModel(systemMessage, userMessage, settings) {
  if (!cohere) {
    throw new Error('Cohere API key not configured. Please add COHERE_API_KEY to your environment variables.')
  }

  const model = settings?.cohereModel || 'command-a-03-2025'
  
  try {
    const response = await cohere.chat({
      model: model,
      message: userMessage,
      preamble: systemMessage,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return response.text || "I apologize, but I couldn't generate a response. Please try again. 🤖"
  } catch (error) {
    console.error('Error calling Cohere model:', error)
    
    if (error instanceof Error && error.message.includes('API key')) {
      throw new Error('Cohere API key not configured')
    }
    
    throw error
  }
}

// Helper function to get wage type content for AI context
async function getWageTypeContent() {
  try {
    const wageTypes = await wageTypeManager.getActiveWageTypes()

    if (!wageTypes || wageTypes.length === 0) {
      return '\nWAGE TYPE CATALOG: No wage types available'
    }

    // Group wage types by category for better organization
    const groupedWageTypes = wageTypes.reduce((acc, wt) => {
      if (!acc[wt.category]) {
        acc[wt.category] = []
      }
      acc[wt.category].push(wt)
      return acc
    }, {})

    // Format wage types data for AI context
    let content = '\nWAGE TYPE CATALOG (Current Active Wage Types):\n'
    
    for (const [category, types] of Object.entries(groupedWageTypes)) {
      content += `\n=== ${category.toUpperCase()} ===\n`
      
      types.forEach((wt) => {
        content += `
• ${wt.name} (${wt.id})
  Description: ${wt.description}
  Calculation Method: ${wt.calculationMethod}
  Taxable: ${wt.taxable ? 'Yes' : 'No'}
  Status: ${wt.status}
  ${wt.effectiveDate ? `Effective Date: ${wt.effectiveDate}` : ''}
  ${wt.lastUpdated ? `Last Updated: ${wt.lastUpdated}` : ''}
`
      })
    }

    content += `
IMPORTANT: Use this wage type information to explain salary components, allowances, deductions, and their calculation methods when answering payslip-related questions. Each wage type includes its calculation method and tax implications.
`

    return content
  } catch (error) {
    console.error('Error fetching wage types for AI context:', error)
    return '\nWAGE TYPE CATALOG: Error loading wage types'
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`🚀 Chat API Server running on http://localhost:${PORT}`)
  console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/chat`)
  console.log(`🏥 Health check: http://localhost:${PORT}/health`)
}) 