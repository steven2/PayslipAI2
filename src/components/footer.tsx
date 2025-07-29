

import { useState } from "react"
import { Shield, Info, Mail } from "lucide-react"
import { LegalDialog } from "./legal-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/contexts/language-context"
import { legalContent } from "@/content/legal-content"

interface SimpleFeedbackDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function SimpleFeedbackDialog({ open, onOpenChange }: SimpleFeedbackDialogProps) {
  const [feedback, setFeedback] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const { t, direction } = useLanguage()

  const handleSubmit = () => {
    // Here you would typically send the feedback to your backend
    console.log("Feedback submitted:", feedback)
    setSubmitted(true)
    setTimeout(() => {
      setFeedback("")
      setSubmitted(false)
      onOpenChange(false)
    }, 2000)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setFeedback("")
      setSubmitted(false)
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]" dir={direction}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            {t('footer.feedback') || 'Feedback'}
          </DialogTitle>
          <DialogDescription>
            {t('feedback.description') || 'We\'d love to hear your thoughts about the application.'}
          </DialogDescription>
        </DialogHeader>
        
        {submitted ? (
          <div className="text-center py-8">
            <div className="text-green-600 dark:text-green-400 text-lg font-medium">
              {t('feedback.thank_you') || 'Thank you for your feedback!'}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {t('feedback.received') || 'Your message has been received.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={t('feedback.placeholder') || 'Tell us what you think...'}
              className="min-h-[120px] resize-none"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {t('common.cancel') || 'Cancel'}
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!feedback.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {t('common.send') || 'Send'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default function Footer() {
  const [openDialog, setOpenDialog] = useState<keyof typeof legalContent | null>(null)
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false)
  const { t, direction } = useLanguage()

  return (
    <footer className="glass-subtle border-0 py-4 px-6 shadow-lg" dir={direction}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <button
            onClick={() => setOpenDialog("disclaimer")}
            className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
          >
            <Info className="h-3 w-3" />
            <span>{t('footer.disclaimer')}</span>
          </button>
          <button
            onClick={() => setOpenDialog("privacy")}
            className="text-xs text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
          >
            {t('footer.privacy')}
          </button>
          <button
            onClick={() => setOpenDialog("terms")}
            className="text-xs text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
          >
            {t('footer.terms')}
          </button>
          <button
            onClick={() => setOpenDialog("security")}
            className="text-xs text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
          >
            {t('footer.security')}
          </button>
          <button
            onClick={() => setOpenDialog("accessibility")}
            className="text-xs text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
          >
            {t('footer.accessibility')}
          </button>
          <button
            onClick={() => setFeedbackDialogOpen(true)}
            className="text-xs text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
          >
            {t('footer.feedback')}
          </button>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200/30 dark:border-gray-700/30">
          <p className="text-xs text-center text-muted-foreground">
            {t('footer.copyright').replace('{year}', new Date().getFullYear().toString())}
          </p>
        </div>
      </div>

      {openDialog && (
        <LegalDialog
          type={openDialog}
          open={true}
          onOpenChange={(open) => !open && setOpenDialog(null)}
        />
      )}
      
      <SimpleFeedbackDialog
        open={feedbackDialogOpen}
        onOpenChange={setFeedbackDialogOpen}
      />
    </footer>
  )
} 