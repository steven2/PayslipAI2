import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Save, Globe, Bot, Server, Zap, Cloud } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useSettings } from "@/contexts/settings-context"
import LanguageSelector from "@/components/language-selector"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useTheme } from "@/components/theme-provider"
import { useState } from "react"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const { t, direction } = useLanguage()
  const { theme, setTheme } = useTheme()
  const { 
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
  } = useSettings()
  
  const [tempLlamaEndpoint, setTempLlamaEndpoint] = useState(llamaEndpoint)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Update the Llama endpoint
      setLlamaEndpoint(tempLlamaEndpoint)
      
      // Here you could also save to a backend API if needed
      // await fetch('/api/settings', { method: 'POST', body: JSON.stringify(settings) })
      
      // Show success feedback
      setTimeout(() => {
        setIsSaving(false)
      }, 1000)
    } catch (error) {
      console.error('Failed to save settings:', error)
      setIsSaving(false)
    }
  }

  return (
    <div className="py-6" dir={direction}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{t('admin.settings.title') || 'Settings'}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('admin.settings.description') || 'Configure application settings and preferences'}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6 space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              {t('admin.settings.generalSettings') || 'General Settings'}
            </CardTitle>
            <CardDescription>{t('admin.settings.generalSettingsDescription') || 'Basic application configuration'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="language">{t('admin.settings.language') || 'Language'}</Label>
                <div className="flex items-center">
                  <LanguageSelector />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="theme">{t('admin.settings.theme') || 'Theme'}</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger id="theme">
                    <SelectValue placeholder={t('admin.settings.theme') || 'Theme'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">{t('admin.settings.light') || 'Light'}</SelectItem>
                    <SelectItem value="dark">{t('admin.settings.dark') || 'Dark'}</SelectItem>
                    <SelectItem value="system">{t('admin.settings.system') || 'System'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Model Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bot className="mr-2 h-5 w-5" />
              {t('admin.settings.aiModelConfiguration') || 'AI Model Configuration'}
            </CardTitle>
            <CardDescription>{t('admin.settings.aiModelConfigurationDescription') || 'Configure AI models and providers'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Model Selection */}
              <div className="space-y-2">
                <Label htmlFor="aiModel">{t('admin.settings.aiModelProvider') || 'AI Model Provider'}</Label>
                <Select value={aiModel} onValueChange={setAIModel}>
                  <SelectTrigger id="aiModel">
                    <SelectValue placeholder={t('admin.settings.selectAiModel') || 'Select AI model'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">
                      <div className="flex items-center">
                        <Zap className="mr-2 h-4 w-4" />
                        OpenAI <Badge variant="secondary" className="ml-2">{t('admin.settings.cloud') || 'Cloud'}</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="cohere">
                      <div className="flex items-center">
                        <Cloud className="mr-2 h-4 w-4" />
                        Cohere <Badge variant="secondary" className="ml-2">{t('admin.settings.cloud') || 'Cloud'}</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="llama">
                      <div className="flex items-center">
                        <Server className="mr-2 h-4 w-4" />
                        Llama (Local) <Badge variant="outline" className="ml-2">{t('admin.settings.selfHosted') || 'Self-hosted'}</Badge>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {aiModel === 'openai' 
                    ? t('admin.settings.openaiDescription') || 'Fast and reliable cloud-based AI from OpenAI'
                    : aiModel === 'cohere'
                    ? t('admin.settings.cohereDescription') || 'Advanced language models from Cohere'
                    : t('admin.settings.llamaDescription') || 'Self-hosted local AI models via Ollama'
                  }
                </p>
              </div>

              <Separator />

              {/* OpenAI Configuration */}
              {aiModel === 'openai' && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <h3 className="text-lg font-medium">{t('admin.settings.openaiConfig') || 'OpenAI Configuration'}</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="openaiModel">{t('admin.settings.openaiModel') || 'OpenAI Model'}</Label>
                    <Select value={openaiModel} onValueChange={setOpenaiModel}>
                      <SelectTrigger id="openaiModel">
                        <SelectValue placeholder={t('admin.settings.openaiModel') || 'OpenAI Model'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4o-mini">{t('admin.settings.models.gpt4oMini') || 'GPT-4o Mini'} <Badge variant="secondary">{t('admin.settings.recommended') || 'Recommended'}</Badge></SelectItem>
                        <SelectItem value="gpt-4o">{t('admin.settings.models.gpt4o') || 'GPT-4o'}</SelectItem>
                        <SelectItem value="gpt-4-turbo">{t('admin.settings.models.gpt4Turbo') || 'GPT-4 Turbo'}</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">{t('admin.settings.models.gpt35Turbo') || 'GPT-3.5 Turbo'}</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('admin.settings.openaiModelDescription') || 'Choose the OpenAI model for chat responses'}
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>{t('admin.settings.apiKeyRequired') || 'API Key Required'}:</strong> {t('admin.settings.apiKeyInstructions') || 'Add your OpenAI API key to the'} <code>.env.local</code> {t('admin.settings.file') || 'file'}:
                      <br />
                      <code className="mt-1 block bg-blue-100 dark:bg-blue-900/30 p-2 rounded">
                        OPENAI_API_KEY=your_api_key_here
                      </code>
                    </p>
                  </div>
                </div>
              )}

              {/* Cohere Configuration */}
              {aiModel === 'cohere' && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Cloud className="h-4 w-4 text-purple-500" />
                    <h3 className="text-lg font-medium">{t('admin.settings.cohereConfig') || 'Cohere Configuration'}</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cohereModel">{t('admin.settings.cohereModel') || 'Cohere Model'}</Label>
                    <Select value={cohereModel} onValueChange={setCohereModel}>
                      <SelectTrigger id="cohereModel">
                        <SelectValue placeholder={t('admin.settings.cohereModel') || 'Cohere Model'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="command-a-03-2025">{t('admin.settings.models.commandA032025') || 'Command-A-03-2025'} <Badge variant="secondary">{t('admin.settings.recommended') || 'Recommended'}</Badge></SelectItem>
                        <SelectItem value="command-r-plus">{t('admin.settings.models.commandRPlus') || 'Command R+'}</SelectItem>
                        <SelectItem value="command-r">{t('admin.settings.models.commandR') || 'Command R'}</SelectItem>
                        <SelectItem value="command">{t('admin.settings.models.command') || 'Command'}</SelectItem>
                        <SelectItem value="command-light">{t('admin.settings.models.commandLight') || 'Command Light'}</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('admin.settings.cohereModelDescription') || 'Choose the Cohere model for chat responses'}
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <p className="text-sm text-purple-800 dark:text-purple-200">
                      <strong>{t('admin.settings.apiKeyRequired') || 'API Key Required'}:</strong> {t('admin.settings.cohereApiKeyInstructions') || 'Add your Cohere API key to the'} <code>.env.local</code> {t('admin.settings.file') || 'file'}:
                      <br />
                      <code className="mt-1 block bg-purple-100 dark:bg-purple-900/30 p-2 rounded">
                        COHERE_API_KEY=your_api_key_here
                      </code>
                    </p>
                    <p className="text-sm text-purple-800 dark:text-purple-200 mt-2">
                      {t('admin.settings.cohereSignupInfo') || 'Get your free API key at'} <a href="https://cohere.com/command" target="_blank" rel="noopener noreferrer" className="underline">cohere.com</a>
                    </p>
                  </div>
                </div>
              )}

              {/* Llama Configuration */}
              {aiModel === 'llama' && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Server className="h-4 w-4 text-green-500" />
                    <h3 className="text-lg font-medium">{t('admin.settings.llamaConfig') || 'Llama Configuration'}</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="llamaEndpoint">{t('admin.settings.llamaEndpoint') || 'Llama Endpoint'}</Label>
                    <Input
                      id="llamaEndpoint"
                      value={tempLlamaEndpoint}
                      onChange={(e) => setTempLlamaEndpoint(e.target.value)}
                      placeholder="http://localhost:11434"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('admin.settings.llamaEndpointDescription') || 'URL to your Ollama server'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="llamaModel">{t('admin.settings.llamaModel') || 'Llama Model'}</Label>
                    <Select value={llamaModel} onValueChange={setLlamaModel}>
                      <SelectTrigger id="llamaModel">
                        <SelectValue placeholder={t('admin.settings.llamaModel') || 'Llama Model'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="llama3">{t('admin.settings.models.llama3') || 'Llama 3'} <Badge variant="secondary">{t('admin.settings.recommended') || 'Recommended'}</Badge></SelectItem>
                        <SelectItem value="llama3:8b">{t('admin.settings.models.llama38b') || 'Llama 3 8B'}</SelectItem>
                        <SelectItem value="llama3:70b">{t('admin.settings.models.llama370b') || 'Llama 3 70B'}</SelectItem>
                        <SelectItem value="llama2">{t('admin.settings.models.llama2') || 'Llama 2'}</SelectItem>
                        <SelectItem value="codellama">{t('admin.settings.models.codellama') || 'Code Llama'}</SelectItem>
                        <SelectItem value="mistral">{t('admin.settings.models.mistral') || 'Mistral'}</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('admin.settings.llamaModelDescription') || 'Choose the local Llama model'}
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      <strong>{t('admin.settings.setupRequired') || 'Setup Required'}:</strong> {t('admin.settings.setupInstructions') || 'Follow these steps to set up local AI'}
                    </p>
                    <ol className="text-sm text-green-800 dark:text-green-200 mt-2 ml-4 list-decimal space-y-1">
                      <li>{t('admin.settings.installOllama') || 'Install'} <a href="https://ollama.ai" target="_blank" rel="noopener noreferrer" className="underline">Ollama</a></li>
                      <li>{t('admin.settings.pullModel') || 'Pull the model:'} <code className="bg-green-100 dark:bg-green-900/30 px-1 rounded">ollama pull {llamaModel}</code></li>
                      <li>{t('admin.settings.startServer') || 'Start the server:'} <code className="bg-green-100 dark:bg-green-900/30 px-1 rounded">ollama serve</code></li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? t('admin.settings.saving') || 'Saving...' : t('admin.settings.saveSettings') || 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  )
}
