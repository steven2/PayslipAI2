import React, { useState, useEffect, useRef } from "react"

interface TypewriterProps {
  text: string
  speed?: number // in ms per character
  onComplete?: () => void
  isThinking?: boolean
  isStopped?: boolean
  renderOutput?: (text: string) => React.ReactNode
}

const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 30, onComplete, isThinking = false, isStopped = false, renderOutput }) => {
  const [displayedText, setDisplayedText] = useState(text)
  const containerRef = useRef<HTMLDivElement>(null)
  const hasCompletedRef = useRef(false)
  const textRef = useRef(text)
  const wasStoppedRef = useRef(isStopped)
  
  // Reset completion state when text changes
  useEffect(() => {
    if (textRef.current !== text) {
      textRef.current = text
      hasCompletedRef.current = false
    }
  }, [text])
  
  // Handle stopped state separately to ensure it takes priority
  useEffect(() => {
    if (isStopped && !wasStoppedRef.current) {
      console.log('Typewriter stopped, displaying full text')
      // When first stopped, show the full text immediately
      setDisplayedText(text)
      wasStoppedRef.current = true
    } else if (!isStopped && wasStoppedRef.current) {
      // Reset stopped state if needed
      wasStoppedRef.current = false
    }
  }, [isStopped, text])
  
  // Update displayed text when props change
  useEffect(() => {
    // Skip if stopped - that's handled by the effect above
    if (isStopped) return
    
    setDisplayedText(text)
    
    // Notify parent that "animation" is complete immediately
    // Only if we haven't already called onComplete for this text
    if (onComplete && !isThinking && !hasCompletedRef.current) {
      hasCompletedRef.current = true
      onComplete()
    }
  }, [text, onComplete, isThinking, isStopped])

  return (
    <div 
      ref={containerRef}
      className={`whitespace-pre-wrap break-words w-full transition-opacity duration-200 ${
        isThinking ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ 
        minHeight: '20px',  // Prevent initial height jumps
        overflowWrap: 'break-word',
        wordBreak: 'break-word'
      }}
    >
      {renderOutput ? renderOutput(displayedText) : displayedText}
    </div>
  )
}

export default Typewriter 