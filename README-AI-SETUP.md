# PayslipAI - Real AI Chat Setup

This guide explains how to set up the real AI chat functionality with OpenAI, Cohere, and Llama support.

## Architecture

The application now consists of two parts:
- **React App** (port 3002): The main user interface
- **API Server** (port 3001): Node.js Express server handling AI requests

## Quick Start

### Option 1: Automatic Setup (Recommended)
```bash
# Make the startup script executable
chmod +x start-full-app.sh

# Start both React app and API server
./start-full-app.sh
```

### Option 2: Manual Setup

1. **Start the API Server:**
```bash
cd server
npm install
npm run dev  # Runs on port 3001
```

2. **Start the React App (in a new terminal):**
```bash
npm run dev  # Runs on port 3002
```

## AI Configuration

### 1. Environment Setup

Create `server/.env` file with your AI API keys:

```env
# Server Configuration
PORT=3001

# AI API Keys
OPENAI_API_KEY=sk-your-openai-key-here
COHERE_API_KEY=your-cohere-key-here

# Optional: Llama/Ollama Configuration
# LLAMA_ENDPOINT=http://localhost:11434
```

### 2. AI Model Options

#### OpenAI (Default)
- **Models**: gpt-4o-mini (default), gpt-4, gpt-3.5-turbo
- **Setup**: Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
- **Cost**: Pay per token usage

#### Cohere
- **Models**: command-a-03-2025 (default), command-r-plus
- **Setup**: Get API key from [Cohere Dashboard](https://dashboard.cohere.ai/)
- **Cost**: Pay per token usage

#### Llama (Local/Free)
- **Models**: llama3 (default), llama2, codellama
- **Setup**: Install [Ollama](https://ollama.ai/) and run `ollama serve`
- **Cost**: Free (runs locally)

### 3. Model Selection

Change AI models in the app's **Settings → AI Configuration**:
- Choose between OpenAI, Cohere, or Llama
- Select specific model versions
- Configure custom Llama endpoints

## Features

### Real AI Functionality
✅ **OpenAI Integration**: GPT-4, GPT-3.5 support with configurable models  
✅ **Cohere Integration**: Command models with advanced reasoning  
✅ **Llama Integration**: Local Ollama support for privacy/cost control  
✅ **Document Context**: AI references actual payslip documents  
✅ **Wage Type Knowledge**: AI understands company wage types and calculations  
✅ **Date-Aware Responses**: Context-aware based on payslip dates  
✅ **Multi-Model Settings**: Switch between AI providers in real-time  

### AI Context Data
The AI has access to:
- **Payslip Data**: Current user's payslip information
- **Company Documents**: All documents from `public/documents/`
- **Wage Types**: Active wage types with calculation methods
- **Date Context**: Specific month/year for historical accuracy
- **AI Instructions**: Specialized payslip analysis guidelines

## API Endpoints

### Chat API
```
POST http://localhost:3001/api/chat
Content-Type: application/json

{
  "message": "How is my overtime calculated?",
  "payslipData": { /* user's payslip data */ },
  "currentDate": { "month": 11, "year": 2024 },
  "settings": {
    "aiModel": "openai",
    "openaiModel": "gpt-4o-mini",
    "cohereModel": "command-a-03-2025",
    "llamaModel": "llama3",
    "llamaEndpoint": "http://localhost:11434"
  }
}
```

### Health Check
```
GET http://localhost:3001/health
```

## Troubleshooting

### API Key Issues
- **OpenAI**: Check key format `sk-...` and billing account
- **Cohere**: Verify key is active and has credits
- **Llama**: Ensure Ollama is running on port 11434

### Connection Issues
- Check if API server is running on port 3001
- Verify React app points to correct API URL
- Check firewall/proxy settings

### Model Errors
- Verify model names are correct for each provider
- Check if you have access to specific models
- Review API usage limits and quotas

## Development

### Adding New AI Providers
1. Add client initialization in `server/index.js`
2. Create new `call[Provider]Model` function
3. Add provider option in model selection logic
4. Update React settings to include new provider

### Customizing AI Instructions
Edit `ai-instructions.md` to modify AI behavior and response style.

### Document Integration
Add new documents to `public/documents/` - they'll automatically be included in AI context.

## Production Deployment

For production deployment:
1. Set up proper environment variables
2. Use PM2 or similar for process management
3. Configure reverse proxy (nginx) for both services
4. Set up SSL certificates
5. Configure proper CORS settings
6. Monitor API usage and costs

## Support

- **React App Issues**: Check browser console and Vite logs
- **API Server Issues**: Check server console output
- **AI Response Issues**: Verify API keys and model availability
- **Document Context**: Ensure documents are in `public/documents/`

The chat now provides the same intelligent, context-aware responses as the original Next.js version! 🚀 