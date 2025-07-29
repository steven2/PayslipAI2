# PayslipAI - Employee Payslip Management System

A modern React-based employee payslip management system with AI-powered chat assistance for payroll queries and document management.

## 🚀 Features

- **Modern React UI**: Built with React 18, TypeScript, and Vite for fast development
- **AI Chat Assistant**: Integrated AI chatbot for payroll and payslip queries
- **Document Management**: Upload, view, and manage payroll documents
- **Multi-language Support**: English, French, and Hebrew language support
- **Dark/Light Theme**: System preference aware theme switching
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Admin Dashboard**: Comprehensive admin panel for HR management
- **Employee Portal**: User-friendly interface for employees to view payslips

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **Shadcn/ui** - High-quality UI components

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **OpenAI API** - AI chat integration
- **Cohere API** - Alternative AI provider

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PayslipAI2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Environment Setup**
   - Copy `.env.example` to `.env` (if available)
   - Add your API keys for OpenAI and/or Cohere
   - See `ENV_SETUP.md` for detailed environment configuration

## 🚀 Running the Application

### Development Mode

1. **Start the frontend (React app)**
   ```bash
   npm run dev
   ```
   The React app will be available at `http://localhost:3002`

2. **Start the backend server** (in a separate terminal)
   ```bash
   cd server
   npm start
   ```
   The API server will be available at `http://localhost:3003`

### Production Build

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
PayslipAI2/
├── src/                    # React application source
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts (Auth, Theme, etc.)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and helpers
│   ├── services/          # API service functions
│   ├── styles/            # Global styles
│   └── main.tsx           # Application entry point
├── server/                # Express.js backend
│   ├── index.js           # Server entry point
│   └── package.json       # Server dependencies
├── public/                # Static assets
│   ├── documents/         # Sample documents
│   ├── locales/           # Translation files
│   └── data/              # Mock data files
├── scripts/               # Utility scripts
├── docs/                  # Documentation
└── package.json           # Frontend dependencies
```

## 🔧 Configuration

### API Configuration
The frontend connects to the backend API at `http://localhost:3003` by default. This can be configured in `src/services/api.ts`.

### Environment Variables
- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:3003)
- `OPENAI_API_KEY` - OpenAI API key for chat functionality
- `COHERE_API_KEY` - Cohere API key as alternative

## 🌐 API Endpoints

### Documents API
- `GET /api/documents` - Retrieve documents
- `POST /api/documents` - Create new document
- `PUT /api/documents` - Update document
- `DELETE /api/documents` - Delete document

### Chat API
- `POST /api/chat` - Send chat message to AI assistant

### Wage Types API
- `GET /api/wage-types` - Retrieve wage type information

### Health Check
- `GET /health` - Server health status

## 🎨 UI Components

The project uses Shadcn/ui components for a consistent and modern design system:
- Forms and inputs with validation
- Data tables for document management
- Modal dialogs and sheets
- Navigation and breadcrumbs
- Charts and data visualization
- Toast notifications

## 🌍 Internationalization

Supports multiple languages:
- **English** (en) - Default
- **French** (fr)
- **Hebrew** (he) - RTL support

Language files are located in `public/locales/` and `src/assets/locales/`.

## 🔐 Authentication

The application includes:
- Mock authentication system for development
- Context-based auth state management
- Protected routes for admin functionality
- Role-based access control

## 📱 Responsive Design

- Mobile-first approach
- Optimized for tablets and desktops
- Touch-friendly interface
- Accessible components

## 🧪 Development

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Consistent code formatting
- Component-based architecture

### Hot Module Replacement
Vite provides fast HMR for quick development cycles.

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Contributing

This is a private project. Please contact the project maintainers for contribution guidelines.

## 📞 Support

For support and questions, please refer to the project documentation or contact the development team.

---

Built with ❤️ using React and modern web technologies. 