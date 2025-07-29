# Environment Setup

This PayslipAI application runs entirely locally without requiring any external database connections. All data is managed through local files and in-memory storage.

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### AI Model Configuration (Optional)

```bash
# OpenAI (recommended for best results)
OPENAI_API_KEY=your_openai_api_key_here

# Cohere (alternative AI provider)
COHERE_API_KEY=your_cohere_api_key_here

# Note: If no AI keys are provided, the app will show an error when trying to use the chat feature
```

## Local Data Sources

The application uses the following local data sources:

### Document Management
- **Location**: `public/documents/`
- **Format**: Text files (.txt)
- **Purpose**: Stores policy documents, guides, and references for the AI chatbot

### Wage Types
- **Location**: `public/wage-types-catalog.xlsx`
- **Format**: Excel file with "WageTypes" and "Metadata" sheets
- **Purpose**: Defines salary components, allowances, and deductions
- **Fallback**: If Excel file is missing, uses hardcoded fallback data

### User Management
- **Location**: In-memory mock data
- **Fallback**: `public/data/mock-users.json` (reference only)
- **Purpose**: Provides sample users, roles, and permissions for admin features

### Authentication
- **Type**: Mock authentication system
- **Storage**: Browser localStorage
- **Purpose**: Simulates user login/logout without external authentication

## Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PayslipAI2
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your AI API keys (optional)
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000)
   - For admin features, sign in with any email containing "admin"

## Features Working Locally

### ✅ Fully Functional
- **Document Management**: Reads from local text files with versioning
- **Wage Type Catalog**: Excel-based wage type definitions
- **AI Chatbot**: Works with OpenAI, Cohere, or local Ollama
- **Authentication**: Mock login/logout system
- **Admin Dashboard**: User management with sample data
- **Payslip Analysis**: Document-based policy lookups

### 📝 Mock Data
- **User Management**: Sample users and roles
- **Analytics**: Generated mock statistics
- **Employee Records**: Predefined sample employees

## Optional AI Model Setup

### OpenAI (Recommended)
1. Get API key from [OpenAI Platform](https://platform.openai.com/)
2. Add to `.env.local`: `OPENAI_API_KEY=sk-...`

### Cohere
1. Get API key from [Cohere Dashboard](https://dashboard.cohere.ai/)
2. Add to `.env.local`: `COHERE_API_KEY=...`

### Local Ollama
1. Install [Ollama](https://ollama.ai/)
2. Run: `ollama run llama3`
3. No API key needed - uses localhost:11434

## File Structure

```
PayslipAI2/
├── public/
│   ├── documents/          # Policy documents (txt files)
│   ├── data/
│   │   └── mock-users.json # Sample user data
│   └── wage-types-catalog.xlsx # Wage type definitions
├── lib/
│   ├── document-manager.ts     # Document management
│   ├── wage-type-manager.ts    # Wage type handling
│   └── mock-user-service.ts    # User management
├── contexts/
│   └── auth-context.tsx        # Mock authentication
└── app/
    ├── api/                    # API routes
    └── admin/                  # Admin interface
```

## Troubleshooting

### No Documents Loading
- Check that files exist in `public/documents/`
- Ensure filenames match the document mappings in `document-manager.ts`

### Wage Types Not Working
- Verify `public/wage-types-catalog.xlsx` exists
- Check Excel file has "WageTypes" sheet with proper columns
- App will use fallback data if Excel file is missing

### AI Chat Not Working
- Verify AI API keys in `.env.local`
- Check API key validity and quotas
- For Ollama, ensure service is running locally

### Admin Features Not Working
- Sign in with an email containing "admin" (e.g., admin@test.com)
- Mock data is generated automatically

## Production Deployment

This version is designed for local/demo use. For production:

1. Replace mock authentication with real auth provider
2. Implement persistent data storage
3. Add proper user management backend
4. Secure API endpoints with authentication
5. Set up proper environment variable management

## Notes

- **No Database Required**: This version eliminates all database dependencies
- **Local First**: All data is stored locally or in-memory
- **Development Friendly**: Easy to set up and run without external services
- **Demo Ready**: Includes realistic sample data for demonstrations 