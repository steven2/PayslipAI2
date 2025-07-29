

import { useState, useEffect } from "react"
import { X, Maximize2, Minimize2 } from "lucide-react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog"
import PayslipViewer from "@/components/payslip-viewer"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { useMobile } from "@/hooks/use-mobile"

interface PayslipDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentDate: { month: number; year: number }
  zoomLevel: number
}

export default function PayslipDialog({ 
  open, 
  onOpenChange, 
  currentDate, 
  zoomLevel 
}: PayslipDialogProps) {
  const { t } = useLanguage()
  const isMobile = useMobile()
  const [isFullscreen, setIsFullscreen] = useState(isMobile)

  // Force fullscreen mode on mobile
  useEffect(() => {
    setIsFullscreen(isMobile)
  }, [isMobile])

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!isMobile) {
      setIsFullscreen(!isFullscreen)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        hideDefaultClose={true}
        className={
          isFullscreen 
            ? "fixed inset-0 w-screen h-screen max-w-none max-h-none rounded-none transform-none left-0 top-0 translate-x-0 translate-y-0 p-0 gap-0 z-[99999]" 
            : "w-3/4 max-w-4xl h-[90vh] p-0 gap-0"
        }
        style={
          isFullscreen 
            ? {
                position: 'fixed',
                inset: '0',
                transform: 'none',
                left: '0',
                top: '0',
                width: '100vw',
                height: '100vh',
                maxWidth: 'none',
                maxHeight: 'none',
                zIndex: 99999
              }
            : undefined
        }
      >
        <DialogHeader className="px-4 py-2 flex flex-row items-center justify-between border-b">
          <DialogTitle className="text-lg font-semibold">
            {t('payslip.viewer')}
          </DialogTitle>
          <div className="flex items-center space-x-2">
            {!isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleFullscreen}
                className="h-8 w-8 rounded-full"
                aria-label={isFullscreen ? t('payslip.minimize') : t('payslip.expand')}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            )}
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <PayslipViewer currentDate={currentDate} zoomLevel={zoomLevel} />
        </div>
      </DialogContent>
    </Dialog>
  )
} 