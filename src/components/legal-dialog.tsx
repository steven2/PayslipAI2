

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { legalContent, getLocalizedLegalContent } from "@/content/legal-content"
import { useLanguage } from "@/contexts/language-context"

interface LegalDialogProps {
  type: keyof typeof legalContent
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LegalDialog({ type, open, onOpenChange }: LegalDialogProps) {
  const { direction, t } = useLanguage()
  
  // Get content safely
  let content = { title: "", content: "" }
  try {
    const localizedContent = getLocalizedLegalContent(t)
    content = localizedContent[type] || { title: type, content: "Content not available" }
  } catch (error) {
    console.warn("Failed to load legal content:", error)
    content = { 
      title: t(`footer.${type}`) || type, 
      content: t(`legal.${type}.content`) || "Content not available" 
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {content.title || "Legal Information"}
          </DialogTitle>
        </DialogHeader>
        <div>
          <div>
            {content.content || "Legal content is not available at this time."}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 