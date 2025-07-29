import React, { useState, useRef, useEffect } from "react"
import { Send, User, Bot, Sparkles, Square, ArrowDown, ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from "@/components/theme-provider"
import { FeedbackDialog } from "@/components/feedback-dialog"
import Typewriter from "@/components/typewriter"
import { useChatCache } from "@/contexts/chat-cache"
import { usePayslipCache } from "@/contexts/payslip-cache"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useLanguage } from "@/contexts/language-context"
import { useSettings } from "@/contexts/settings-context"
import { chatService } from "@/services/chatService"

interface ChatInterfaceProps {
  showHistory: boolean
  currentDate: { month: number; year: number }
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp?: number
}

export default function ChatInterface({ showHistory, currentDate }: ChatInterfaceProps) {
  const { messages: cachedMessages, setMessages: setCachedMessages } = useChatCache()
  const { getCachedPayslip } = usePayslipCache()
  const { t, direction } = useLanguage()
  const { aiModel, llamaEndpoint, openaiModel, llamaModel, cohereModel } = useSettings()
  const [feedbackMessageId, setFeedbackMessageId] = useState<string | null>(null)
  const [isPayslipView, setIsPayslipView] = useState(false)
  const [messages, setMessages] = useState<Message[]>(
    cachedMessages.length > 0 ? cachedMessages : [
      {
        id: "1",
        role: "assistant",
        content: t('chat.greeting') + " 💬",
        timestamp: Date.now()
      },
    ]
  )
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showLoadingDots, setShowLoadingDots] = useState(false)
  
  // Get current payslip data from cache using the provided currentDate
  const payslipData = getCachedPayslip(currentDate.month, currentDate.year)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const [completedMessages, setCompletedMessages] = useState<Set<string>>(new Set(["1"]))
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [isManualScroll, setIsManualScroll] = useState(false)
  const [showLeftBlur, setShowLeftBlur] = useState(false)
  const [showRightBlur, setShowRightBlur] = useState(false)
  const suggestionsScrollRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior })
    }
  }

  // Check if user is at bottom of scroll
  const isUserAtBottom = () => {
    if (!chatContainerRef.current) return true
    
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
    // Consider "at bottom" if within 100px of the bottom
    return scrollHeight - scrollTop - clientHeight < 100
  }

  // Update scroll button visibility
  const updateScrollButtonVisibility = () => {
    if (!chatContainerRef.current) return
    
    const isAtBottom = isUserAtBottom()
    setShouldAutoScroll(isAtBottom)
    setShowScrollButton(!isAtBottom)
  }

  // Update blur visibility based on scroll position
  const updateBlurVisibility = () => {
    if (suggestionsScrollRef.current) {
      const container = suggestionsScrollRef.current
      const { scrollLeft, scrollWidth, clientWidth } = container
      
      // Show left blur if scrolled from the beginning
      setShowLeftBlur(scrollLeft > 0)
      
      // Show right blur if there's more content to scroll
      setShowRightBlur(scrollLeft < scrollWidth - clientWidth - 1) // -1 for rounding errors
    }
  }

  // Setup scroll event listener
  useEffect(() => {
    const chatContainer = chatContainerRef.current
    if (!chatContainer) return
    
    const handleScroll = () => {
      // Only update if this is a manual scroll (not programmatic)
      if (isManualScroll) {
        updateScrollButtonVisibility()
      }
    }

    chatContainer.addEventListener('scroll', handleScroll, { passive: true })
    
    // Add touch listeners to detect manual scrolling
    const handleTouchStart = () => setIsManualScroll(true)
    const handleTouchEnd = () => {
      updateScrollButtonVisibility()
      setTimeout(() => setIsManualScroll(false), 300)
    }
    
    chatContainer.addEventListener('touchstart', handleTouchStart, { passive: true })
    chatContainer.addEventListener('touchend', handleTouchEnd, { passive: true })
    
    // Add mouse listeners
    const handleMouseDown = () => setIsManualScroll(true)
    const handleMouseUp = () => {
      updateScrollButtonVisibility()
      setTimeout(() => setIsManualScroll(false), 300)
    }
    
    chatContainer.addEventListener('mousedown', handleMouseDown, { passive: true })
    chatContainer.addEventListener('mouseup', handleMouseUp, { passive: true })
    
    // Initialize scroll button visibility
    updateScrollButtonVisibility()
    
    return () => {
      chatContainer.removeEventListener('scroll', handleScroll)
      chatContainer.removeEventListener('touchstart', handleTouchStart)
      chatContainer.removeEventListener('touchend', handleTouchEnd)
      chatContainer.removeEventListener('mousedown', handleMouseDown)
      chatContainer.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  // Auto-scroll when new messages arrive
  useEffect(() => {
    const shouldScroll = shouldAutoScroll || 
                       (messages.length > 0 && messages[messages.length - 1].role === 'user');
    
    if (shouldScroll) {
      // Small delay to ensure DOM has updated
      setTimeout(() => {
        scrollToBottom()
        // After programmatic scroll, update button visibility again
        updateScrollButtonVisibility()
      }, 100)
    } else {
      // If we're not auto-scrolling and have new messages, show the button
      setShowScrollButton(true)
    }
  }, [messages, shouldAutoScroll])

  useEffect(() => {
    if (messages.length > 0) {
      // Update cached messages
      const newCachedMessages = messages
        .filter(msg => msg.role === 'user' || msg.role === 'assistant')
        .map(msg => ({
          ...msg,
          timestamp: msg.timestamp || Date.now(),
          role: msg.role as 'user' | 'assistant'
        }));
      
      // Only update if the content has actually changed
      const isContentChanged = JSON.stringify(newCachedMessages.map(m => ({ id: m.id, content: m.content, role: m.role }))) !== 
                              JSON.stringify(cachedMessages.map(m => ({ id: m.id, content: m.content, role: m.role })));
      
      if (isContentChanged) {
        setCachedMessages(newCachedMessages);
      }
    }
  }, [messages, setCachedMessages, cachedMessages]);

  const handleMessageComplete = (messageId: string) => {
    if (!completedMessages.has(messageId)) {
      setCompletedMessages(prev => new Set([...prev, messageId]))
      
      if (shouldAutoScroll) {
        scrollToBottom()
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    }

    // Add user message immediately
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setShowLoadingDots(true)

    try {
      // Prepare settings for the API call
      const settings = {
        aiModel,
        llamaEndpoint,
        openaiModel,
        llamaModel,
        cohereModel
      }

      // Call our document-based chat API with payslip data, current date, and settings
      const response = await chatService.sendMessage({
        message: input.trim(),
        payslipData: payslipData,
        currentDate: currentDate,
        settings: settings
      })

      // Hide loading dots when response starts
      setShowLoadingDots(false)

      if (response.data) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.data.response,
          timestamp: Date.now()
        }

        setMessages(prev => [...prev, assistantMessage])
      } else {
        // Handle error
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.error || "I apologize, but I'm having trouble processing your request right now. Please try again later. 😔",
          timestamp: Date.now()
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('Chat error:', error)
      setShowLoadingDots(false)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, there was an error processing your message. Please try again. 🔧",
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleQuickSuggestion = (suggestion: string) => {
    setInput(suggestion)
    setTimeout(() => {
      const form = document.querySelector('form')
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true }))
      }
    }, 100)
  }

  const handleFeedbackSubmit = (feedback: {
    messageId: string
    rating: "helpful" | "not_helpful"
    comment?: string
    category?: string
  }) => {
    console.log("Feedback submitted:", feedback)
    setFeedbackMessageId(null)
  }

  const MarkdownMessage = ({ content, onComplete }: { content: string, onComplete?: () => void }) => {
    // Call onComplete when the component mounts/renders
    useEffect(() => {
      if (onComplete) {
        onComplete()
      }
    }, [onComplete])

    return (
      <div className="prose prose-sm max-w-none dark:prose-invert prose-pre:bg-gray-800 prose-pre:text-gray-100">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            ul: ({ children }) => <ul className="mb-2 last:mb-0">{children}</ul>,
            ol: ({ children }) => <ol className="mb-2 last:mb-0">{children}</ol>,
            li: ({ children }) => <li className="mb-1">{children}</li>,
            code: ({ inline, className, children, ...props }: any) => (
              inline ? (
                <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm" {...props}>
                  {children}
                </code>
              ) : (
                <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm overflow-x-auto" {...props}>
                  {children}
                </code>
              )
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    )
  }

  const filteredMessages = showHistory ? messages : messages.slice(-6)

  // Setup resize event listener for mobile layout adjustments
  useEffect(() => {
    // Initial scroll to bottom on mount
    if (messagesEndRef.current) {
      scrollToBottom("auto")
    }
    
    const handleResize = () => {
      // Update scroll button visibility
      updateScrollButtonVisibility()
      // Scroll to bottom when rotating device
      scrollToBottom("auto")
    }
    
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    const checkIsPayslipView = () => {
      const isInPayslipPane = typeof window !== 'undefined' && 
                             window.location.pathname === '/' && 
                             window.innerWidth < 640 &&
                             document.querySelector('main')?.getAttribute('data-active-pane') === 'payslip'
      setIsPayslipView(isInPayslipPane)
    }
    
    checkIsPayslipView()
    
    // Set up a MutationObserver to watch for changes to the data-active-pane attribute
    const mainElement = document.querySelector('main')
    let observer: MutationObserver | null = null
    
    if (mainElement) {
      observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-active-pane') {
            checkIsPayslipView()
          }
        })
      })
      
      observer.observe(mainElement, { attributes: true, attributeFilter: ['data-active-pane'] })
    }
    
    window.addEventListener('resize', checkIsPayslipView)
    
    return () => {
      window.removeEventListener('resize', checkIsPayslipView)
      if (observer) observer.disconnect()
    }
  }, [])

  // Setup suggestions scroll monitoring
  useEffect(() => {
    const suggestionsContainer = suggestionsScrollRef.current
    if (!suggestionsContainer) return

    const handleSuggestionsScroll = () => {
      updateBlurVisibility()
    }

    const handleResize = () => {
      updateBlurVisibility()
    }

    // Initial check
    updateBlurVisibility()

    suggestionsContainer.addEventListener('scroll', handleSuggestionsScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      suggestionsContainer.removeEventListener('scroll', handleSuggestionsScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Loading dots component
  const LoadingDots = () => (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-500 dark:text-gray-400">{t('chat.thinking')}</span>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-full max-h-full">
      {showHistory ? (
        // History view layout
        <div className="flex h-full">
          {/* History panel */}
          <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-2">{t('chat.history')}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Previous chat sessions</p>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {/* Hardcoded chat history */}
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Today, 2:30 PM</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">8 messages</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 truncate">Can you explain my overtime calculation?</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last: Your overtime is calculated at 1.5x rate...</p>
              </div>
              
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Yesterday, 4:15 PM</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">12 messages</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 truncate">Why did my tax deduction increase this month?</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last: The tax increase is due to moving to...</p>
              </div>
              
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Dec 15, 10:45 AM</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">6 messages</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 truncate">What is the housing allowance policy?</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last: Housing allowance is 20% of basic salary...</p>
              </div>
              
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Dec 12, 3:20 PM</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">15 messages</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 truncate">How is my retirement contribution calculated?</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last: Your retirement contribution is 8% of...</p>
              </div>
              
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Dec 10, 11:30 AM</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">9 messages</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 truncate">Can you break down my health insurance deduction?</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last: Your health insurance premium is split...</p>
              </div>
              
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Dec 8, 9:15 AM</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">7 messages</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 truncate">Why is there a bonus payment this month?</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last: The bonus is your quarterly performance...</p>
              </div>
            </div>
          </div>
          
          {/* Current chat panel */}
          <div className="flex-1 flex flex-col">
            <div 
              ref={chatContainerRef} 
              className={`flex-1 overflow-y-auto -webkit-overflow-scrolling-touch p-4 ${isPayslipView ? 'pb-[160px]' : 'pb-48'} sm:pb-4 md:pb-4`}
            >
              <div className="space-y-4 mb-24 sm:mb-0">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 shadow-md transition-all duration-300 ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white"
                          : "bg-white dark:bg-gray-800 text-foreground border border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 ${message.role === "user" ? 
                          direction === "rtl" ? "order-1 ml-2 mr-0" : "order-2 ml-2 mr-0" : 
                          direction === "rtl" ? "ml-0 mr-2" : "mr-2"}`}>
                          {message.role === "user" ? (
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                              <User className="h-4 w-4 text-white" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-500/20 dark:from-purple-400/20 dark:to-blue-300/20 flex items-center justify-center">
                              <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            </div>
                          )}
                        </div>
                        <div className={`flex-1 ${message.role === "user" ? "text-right" : ""}`}>
                          {message.role === "assistant" && message.id !== "1" ? (
                            <>
                              <MarkdownMessage
                                content={message.content}
                                onComplete={() => handleMessageComplete(message.id)}
                              />
                              {completedMessages.has(message.id) && (
                                <button 
                                  onClick={() => setFeedbackMessageId(message.id)}
                                  className="mt-2 text-xs font-medium text-gray-500 hover:text-purple-500 dark:text-gray-400 dark:hover:text-purple-400 transition-colors flex items-center gap-2"
                                >
                                  <div className="flex items-center gap-1">
                                    <ThumbsUp className="h-3 w-3" />
                                    <ThumbsDown className="h-3 w-3" />
                                  </div>
                                  {t('chat.feedback.give_feedback')}
                                </button>
                              )}
                            </>
                          ) : message.id === "1" && message.role === "assistant" ? (
                            // Special handling for greeting message
                            <div className={`prose dark:prose-invert prose-sm max-w-none break-words prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:text-xs prose-pre:p-2 prose-pre:rounded prose-pre:overflow-auto prose-code:text-purple-600 dark:prose-code:text-purple-400 prose-headings:mb-2 prose-p:mb-2 prose-p:leading-relaxed prose-li:my-0 prose-ul:my-1 prose-ol:my-1 prose-blockquote:my-1 prose-blockquote:border-l-2 prose-blockquote:pl-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600 prose-img:rounded-md`}>
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {t('chat.greeting')}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <div className={`prose ${message.role === "user" ? "dark:prose-invert ml-auto prose-headings:text-white prose-p:text-white prose-strong:text-white prose-code:text-white prose-code:bg-white/20 prose-a:text-white prose-ul:text-white prose-ol:text-white" : "dark:prose-invert"} prose-sm max-w-none break-words prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:text-xs prose-pre:p-2 prose-pre:rounded prose-pre:overflow-auto prose-code:text-purple-600 dark:prose-code:text-purple-400 prose-headings:mb-2 prose-p:mb-2 prose-p:leading-relaxed prose-li:my-0 prose-ul:my-1 prose-ol:my-1 prose-blockquote:my-1 prose-blockquote:border-l-2 prose-blockquote:pl-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600 prose-img:rounded-md`}>
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {message.content}
                              </ReactMarkdown>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Loading animation */}
                {showLoadingDots && (
                  <div className="flex justify-start animate-fadeIn">
                    <div className="max-w-[80%] rounded-2xl p-4 bg-white dark:bg-gray-800 text-foreground border border-gray-200 dark:border-gray-700 shadow-md">
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 ${direction === "rtl" ? "ml-0 mr-2" : "mr-2"}`}>
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-500/20 dark:from-purple-400/20 dark:to-blue-300/20 flex items-center justify-center">
                            <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <LoadingDots />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Scroll to bottom trigger */}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Scroll to bottom button */}
              {showScrollButton && (
                <Button
                  onClick={() => scrollToBottom()}
                  className="fixed bottom-24 right-4 z-40 rounded-full h-10 w-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                  size="icon"
                  variant="outline"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {/* Input area for history view */}
            <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
              <form onSubmit={handleSubmit} className={`flex items-center ${direction === "rtl" ? "space-x-reverse" : ""} space-x-2`}>
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder={t('chat.placeholder')}
                  className="flex-1 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400 transition-colors duration-300"
                />
                {isLoading ? (
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !input.trim()}
                    className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 dark:from-purple-500 dark:to-blue-400 dark:hover:from-purple-600 dark:hover:to-blue-500 text-white transition-all duration-300 disabled:opacity-50"
                  >
                    <Send className={`h-4 w-4 ${direction === "rtl" ? "transform rotate-180" : ""}`} />
                    <span className="sr-only">{t('chat.send')}</span>
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !input.trim()}
                    className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 dark:from-purple-500 dark:to-blue-400 dark:hover:from-purple-600 dark:hover:to-blue-500 text-white transition-all duration-300 disabled:opacity-50"
                  >
                    <Send className={`h-4 w-4 ${direction === "rtl" ? "transform rotate-180" : ""}`} />
                    <span className="sr-only">{t('chat.send')}</span>
                  </Button>
                )}
              </form>
              
                             <div className="mt-2 overflow-x-auto scrollbar-hide">
                 <div className="flex gap-2 pb-1">
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={() => handleQuickSuggestion(t('chat.suggestions.explain_pay'))}
                     disabled={isLoading}
                     className="text-xs text-muted-foreground border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200 whitespace-nowrap flex-shrink-0"
                   >
                     <Sparkles className={`h-3 w-3 ${direction === "rtl" ? "ml-1" : "mr-1"} text-purple-500 dark:text-purple-400`} />
                     {t('chat.suggestions.explain_pay')}
                   </Button>
                   
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={() => handleQuickSuggestion(t('chat.suggestions.explain_deductions'))}
                     disabled={isLoading}
                     className="text-xs text-muted-foreground border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200 whitespace-nowrap flex-shrink-0"
                   >
                     <Sparkles className={`h-3 w-3 ${direction === "rtl" ? "ml-1" : "mr-1"} text-purple-500 dark:text-purple-400`} />
                     {t('chat.suggestions.explain_deductions')}
                   </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickSuggestion(t('chat.suggestions.net_salary_change'))}
                    disabled={isLoading}
                    className="text-xs text-muted-foreground border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200 whitespace-nowrap flex-shrink-0"
                  >
                    <Sparkles className={`h-3 w-3 ${direction === "rtl" ? "ml-1" : "mr-1"} text-purple-500 dark:text-purple-400`} />
                    {t('chat.suggestions.net_salary_change')}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickSuggestion(t('chat.suggestions.overtime_calculation'))}
                    disabled={isLoading}
                    className="text-xs text-muted-foreground border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200 whitespace-nowrap flex-shrink-0"
                  >
                    <Sparkles className={`h-3 w-3 ${direction === "rtl" ? "ml-1" : "mr-1"} text-purple-500 dark:text-purple-400`} />
                    {t('chat.suggestions.overtime_calculation')}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickSuggestion(t('chat.suggestions.tax_rate'))}
                    disabled={isLoading}
                    className="text-xs text-muted-foreground border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200 whitespace-nowrap flex-shrink-0"
                  >
                    <Sparkles className={`h-3 w-3 ${direction === "rtl" ? "ml-1" : "mr-1"} text-purple-500 dark:text-purple-400`} />
                    {t('chat.suggestions.tax_rate')}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickSuggestion(t('chat.suggestions.housing_allowance'))}
                    disabled={isLoading}
                    className="text-xs text-muted-foreground border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200 whitespace-nowrap flex-shrink-0"
                  >
                    <Sparkles className={`h-3 w-3 ${direction === "rtl" ? "ml-1" : "mr-1"} text-purple-500 dark:text-purple-400`} />
                    {t('chat.suggestions.housing_allowance')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Normal chat view
        <>
          <div 
            ref={chatContainerRef} 
            className={`flex-1 overflow-y-auto -webkit-overflow-scrolling-touch p-4 ${isPayslipView ? 'pb-[160px]' : 'pb-48'} sm:pb-4 md:pb-4`}
          >
            <div className="space-y-4 mb-24 sm:mb-0">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 shadow-md transition-all duration-300 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white"
                        : "bg-white dark:bg-gray-800 text-foreground border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 ${message.role === "user" ? 
                        direction === "rtl" ? "order-1 ml-2 mr-0" : "order-2 ml-2 mr-0" : 
                        direction === "rtl" ? "ml-0 mr-2" : "mr-2"}`}>
                        {message.role === "user" ? (
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-500/20 dark:from-purple-400/20 dark:to-blue-300/20 flex items-center justify-center">
                            <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                        )}
                      </div>
                      <div className={`flex-1 ${message.role === "user" ? "text-right" : ""}`}>
                        {message.role === "assistant" && message.id !== "1" ? (
                          <>
                            <MarkdownMessage
                              content={message.content}
                              onComplete={() => handleMessageComplete(message.id)}
                            />
                            {completedMessages.has(message.id) && (
                              <button 
                                onClick={() => setFeedbackMessageId(message.id)}
                                className="mt-2 text-xs font-medium text-gray-500 hover:text-purple-500 dark:text-gray-400 dark:hover:text-purple-400 transition-colors flex items-center gap-2"
                              >
                                <div className="flex items-center gap-1">
                                  <ThumbsUp className="h-3 w-3" />
                                  <ThumbsDown className="h-3 w-3" />
                                </div>
                                {t('chat.feedback.give_feedback')}
                              </button>
                            )}
                          </>
                        ) : message.id === "1" && message.role === "assistant" ? (
                          // Special handling for greeting message
                          <div className={`prose dark:prose-invert prose-sm max-w-none break-words prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:text-xs prose-pre:p-2 prose-pre:rounded prose-pre:overflow-auto prose-code:text-purple-600 dark:prose-code:text-purple-400 prose-headings:mb-2 prose-p:mb-2 prose-p:leading-relaxed prose-li:my-0 prose-ul:my-1 prose-ol:my-1 prose-blockquote:my-1 prose-blockquote:border-l-2 prose-blockquote:pl-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600 prose-img:rounded-md`}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {t('chat.greeting')}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <div className={`prose ${message.role === "user" ? "dark:prose-invert ml-auto prose-headings:text-white prose-p:text-white prose-strong:text-white prose-code:text-white prose-code:bg-white/20 prose-a:text-white prose-ul:text-white prose-ol:text-white" : "dark:prose-invert"} prose-sm max-w-none break-words prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:text-xs prose-pre:p-2 prose-pre:rounded prose-pre:overflow-auto prose-code:text-purple-600 dark:prose-code:text-purple-400 prose-headings:mb-2 prose-p:mb-2 prose-p:leading-relaxed prose-li:my-0 prose-ul:my-1 prose-ol:my-1 prose-blockquote:my-1 prose-blockquote:border-l-2 prose-blockquote:pl-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600 prose-img:rounded-md`}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loading animation */}
              {showLoadingDots && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="max-w-[80%] rounded-2xl p-4 bg-white dark:bg-gray-800 text-foreground border border-gray-200 dark:border-gray-700 shadow-md">
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 ${direction === "rtl" ? "ml-0 mr-2" : "mr-2"}`}>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-500/20 dark:from-purple-400/20 dark:to-blue-300/20 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <LoadingDots />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Scroll to bottom trigger */}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Scroll to bottom button */}
            {showScrollButton && (
              <Button
                onClick={() => scrollToBottom()}
                className="fixed bottom-24 right-4 z-40 rounded-full h-10 w-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                size="icon"
                variant="outline"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Desktop mode - fixed input and suggestions at bottom */}
          <div className="hidden sm:block border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
            <form onSubmit={handleSubmit} className={`flex items-center ${direction === "rtl" ? "space-x-reverse" : ""} space-x-2`}>
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder={t('chat.placeholder')}
                className="flex-1 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400 transition-colors duration-300"
              />
              {isLoading ? (
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 dark:from-purple-500 dark:to-blue-400 dark:hover:from-purple-600 dark:hover:to-blue-500 text-white transition-all duration-300 disabled:opacity-50"
                >
                  <Send className={`h-4 w-4 ${direction === "rtl" ? "transform rotate-180" : ""}`} />
                  <span className="sr-only">{t('chat.send')}</span>
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 dark:from-purple-500 dark:to-blue-400 dark:hover:from-purple-600 dark:hover:to-blue-500 text-white transition-all duration-300 disabled:opacity-50"
                >
                  <Send className={`h-4 w-4 ${direction === "rtl" ? "transform rotate-180" : ""}`} />
                  <span className="sr-only">{t('chat.send')}</span>
                </Button>
              )}
            </form>
          
            <div className="mt-2 relative">
              <div ref={suggestionsScrollRef} className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-2 pb-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickSuggestion(t('chat.suggestions.explain_pay'))}
                    disabled={isLoading}
                    className="text-xs text-muted-foreground border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200 whitespace-nowrap flex-shrink-0"
                  >
                    <Sparkles className={`h-3 w-3 ${direction === "rtl" ? "ml-1" : "mr-1"} text-purple-500 dark:text-purple-400`} />
                    {t('chat.suggestions.explain_pay')}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickSuggestion(t('chat.suggestions.explain_deductions'))}
                    disabled={isLoading}
                    className="text-xs text-muted-foreground border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200 whitespace-nowrap flex-shrink-0"
                  >
                    <Sparkles className={`h-3 w-3 ${direction === "rtl" ? "ml-1" : "mr-1"} text-purple-500 dark:text-purple-400`} />
                    {t('chat.suggestions.explain_deductions')}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickSuggestion(t('chat.suggestions.net_salary_change'))}
                    disabled={isLoading}
                    className="text-xs text-muted-foreground border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200 whitespace-nowrap flex-shrink-0"
                  >
                    <Sparkles className={`h-3 w-3 ${direction === "rtl" ? "ml-1" : "mr-1"} text-purple-500 dark:text-purple-400`} />
                    {t('chat.suggestions.net_salary_change')}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickSuggestion(t('chat.suggestions.overtime_calculation'))}
                    disabled={isLoading}
                    className="text-xs text-muted-foreground border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200 whitespace-nowrap flex-shrink-0"
                  >
                    <Sparkles className={`h-3 w-3 ${direction === "rtl" ? "ml-1" : "mr-1"} text-purple-500 dark:text-purple-400`} />
                    {t('chat.suggestions.overtime_calculation')}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickSuggestion(t('chat.suggestions.tax_rate'))}
                    disabled={isLoading}
                    className="text-xs text-muted-foreground border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200 whitespace-nowrap flex-shrink-0"
                  >
                    <Sparkles className={`h-3 w-3 ${direction === "rtl" ? "ml-1" : "mr-1"} text-purple-500 dark:text-purple-400`} />
                    {t('chat.suggestions.tax_rate')}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickSuggestion(t('chat.suggestions.housing_allowance'))}
                    disabled={isLoading}
                    className="text-xs text-muted-foreground border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200 whitespace-nowrap flex-shrink-0"
                  >
                    <Sparkles className={`h-3 w-3 ${direction === "rtl" ? "ml-1" : "mr-1"} text-purple-500 dark:text-purple-400`} />
                    {t('chat.suggestions.housing_allowance')}
                  </Button>
                </div>
              </div>
              
              {/* Left blur overlay - show when scrolled from start */}
              {showLeftBlur && (
                <div className={`absolute top-0 ${direction === "rtl" ? "right-0" : "left-0"} bottom-0 w-20 pointer-events-none transition-opacity duration-200`}>
                  <div className={`h-full w-full bg-gradient-to-${direction === "rtl" ? "l" : "r"} from-white/80 dark:from-gray-800/80 via-transparent to-transparent backdrop-blur-[1px]`}></div>
                </div>
              )}
              
              {/* Right blur overlay - show when more content available */}
              {showRightBlur && (
                <div className={`absolute top-0 ${direction === "rtl" ? "left-0" : "right-0"} bottom-0 w-20 pointer-events-none transition-opacity duration-200`}>
                  <div className={`h-full w-full bg-gradient-to-${direction === "rtl" ? "r" : "l"} from-transparent via-transparent to-white/80 dark:to-gray-800/80 backdrop-blur-[1px]`}></div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      
      {/* Mobile mode - fixed input and footer */}
      <div className="block sm:hidden">
        {/* Fixed chat input at bottom (positioned above footer) */}
        <div className={`fixed ${isPayslipView ? 'bottom-[100px]' : 'bottom-8'} left-0 right-0 z-30 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-md`}>
          <div className="p-4">
            <form onSubmit={handleSubmit} className={`flex items-center ${direction === "rtl" ? "space-x-reverse" : ""} space-x-2`}>
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder={t('chat.placeholder')}
                className="flex-1 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400 transition-colors duration-300"
              />
              {isLoading ? (
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 dark:from-purple-500 dark:to-blue-400 dark:hover:from-purple-600 dark:hover:to-blue-500 text-white transition-all duration-300 disabled:opacity-50"
                >
                  <Send className={`h-4 w-4 ${direction === "rtl" ? "transform rotate-180" : ""}`} />
                  <span className="sr-only">{t('chat.send')}</span>
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 dark:from-purple-500 dark:to-blue-400 dark:hover:from-purple-600 dark:hover:to-blue-500 text-white transition-all duration-300 disabled:opacity-50"
                >
                  <Send className={`h-4 w-4 ${direction === "rtl" ? "transform rotate-180" : ""}`} />
                  <span className="sr-only">{t('chat.send')}</span>
                </Button>
              )}
            </form>
            
            {/* Mobile view - dropdown */}
            <div className="mt-2">
              <select 
                onChange={(e) => {
                  if (e.target.value) {
                    handleQuickSuggestion(e.target.value)
                    e.target.value = "" // Reset to default after selection
                  }
                }}
                disabled={isLoading}
                className="w-full text-xs text-muted-foreground bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
              >
                <option value="">{t('chat.suggestions.title')}</option>
                <option value={t('chat.suggestions.explain_pay')}>{t('chat.suggestions.explain_pay')}</option>
                <option value={t('chat.suggestions.explain_deductions')}>{t('chat.suggestions.explain_deductions')}</option>
                <option value={t('chat.suggestions.net_salary_change')}>{t('chat.suggestions.net_salary_change')}</option>
                <option value={t('chat.suggestions.overtime_calculation')}>{t('chat.suggestions.overtime_calculation')}</option>
                <option value={t('chat.suggestions.tax_rate')}>{t('chat.suggestions.tax_rate')}</option>
                <option value={t('chat.suggestions.housing_allowance')}>{t('chat.suggestions.housing_allowance')}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <FeedbackDialog 
        messageId={feedbackMessageId || ""}
        onSubmit={handleFeedbackSubmit}
        open={!!feedbackMessageId}
        onOpenChange={(open) => {
          if (!open) setFeedbackMessageId(null)
        }}
      />
    </div>
  )
}
