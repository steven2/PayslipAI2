

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Check, ThumbsDown, ThumbsUp } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface FeedbackDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  messageId: string
  onSubmit: (feedback: {
    messageId: string
    rating: "helpful" | "not_helpful"
    comment?: string
    category?: string
  }) => void
}

export function FeedbackDialog({ open, onOpenChange, messageId, onSubmit }: FeedbackDialogProps) {
  const [rating, setRating] = useState<"helpful" | "not_helpful" | null>(null)
  const [comment, setComment] = useState("")
  const [category, setCategory] = useState<string | undefined>(undefined)
  const [submitted, setSubmitted] = useState(false)
  const { t, direction } = useLanguage()

  const handleSubmit = () => {
    if (rating) {
      onSubmit({
        messageId,
        rating,
        comment: comment.trim() || undefined,
        category,
      })
      setSubmitted(true)
    }
  }

  // Reset state when dialog is opened
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Small delay to prevent flickering when closing
      setTimeout(() => {
        setRating(null)
        setComment("")
        setCategory(undefined)
        setSubmitted(false)
      }, 200)
    }
    onOpenChange(open)
  }

  const feedbackCategories = {
    helpful: [
      { id: "accurate", label: t('chat.feedback.categories.accurate') },
      { id: "clear", label: t('chat.feedback.categories.clear') },
      { id: "fast", label: t('chat.feedback.categories.fast') },
    ],
    not_helpful: [
      { id: "inaccurate", label: t('chat.feedback.categories.inaccurate') },
      { id: "unclear", label: t('chat.feedback.categories.unclear') },
      { id: "slow", label: t('chat.feedback.categories.slow') },
    ],
    both: [{ id: "other", label: t('chat.feedback.categories.other') }],
  }

  const getApplicableCategories = () => {
    if (!rating) return []
    return [...feedbackCategories[rating], ...feedbackCategories.both]
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent dir={direction} className="sm:max-w-[425px]">
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="text-center">{t('chat.feedback.thank_you')}</DialogTitle>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{t('chat.feedback.title')}</DialogTitle>
              <DialogDescription className="sr-only">Rate this response</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6">
              <div className="flex justify-center space-x-6">
                <button
                  onClick={() => setRating("helpful")}
                  className={`flex flex-col items-center space-y-2 px-4 py-3 rounded-lg transition-colors ${
                    rating === "helpful"
                      ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-muted-foreground"
                  }`}
                >
                  <ThumbsUp
                    className={`h-5 w-5 ${
                      rating === "helpful" ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-500"
                    }`}
                  />
                  <span className="text-sm font-medium">{t('chat.feedback.helpful')}</span>
                </button>

                <button
                  onClick={() => setRating("not_helpful")}
                  className={`flex flex-col items-center space-y-2 px-4 py-3 rounded-lg transition-colors ${
                    rating === "not_helpful"
                      ? "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-muted-foreground"
                  }`}
                >
                  <ThumbsDown
                    className={`h-5 w-5 ${
                      rating === "not_helpful" ? "text-red-600 dark:text-red-400" : "text-gray-400 dark:text-gray-500"
                    }`}
                  />
                  <span className="text-sm font-medium">{t('chat.feedback.not_helpful')}</span>
                </button>
              </div>

              {rating && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t('chat.feedback.category')}</Label>
                    <RadioGroup value={category} onValueChange={setCategory} className="flex flex-wrap gap-2">
                      {getApplicableCategories().map((item) => (
                        <div key={item.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={item.id} id={item.id} />
                          <Label htmlFor={item.id} className="text-sm cursor-pointer">
                            {item.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comment">{t('chat.feedback.comment')}</Label>
                    <Textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="min-h-[80px] resize-none"
                      placeholder=""
                    />
                  </div>

                  <Button onClick={handleSubmit} className="w-full">
                    {t('chat.feedback.submit')}
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
