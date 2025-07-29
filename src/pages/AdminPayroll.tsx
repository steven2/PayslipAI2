import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, Upload } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function PayrollPage() {
  const { t, direction } = useLanguage()
  
  return (
    <div className="py-6" dir={direction}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{t("admin.payroll.title") || "Payroll Integration"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("admin.payroll.description") || "Manage payroll data and integrations"}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              {t("admin.payroll.payrollData") || "Payroll Data"}
            </CardTitle>
            <CardDescription>{t("admin.payroll.payrollDataDescription") || "Import and manage payroll information"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t("admin.payroll.comingSoon") || "Payroll integration features are coming soon. You will be able to import payroll data, generate reports, and manage payroll processes."}
              </p>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                {t("admin.payroll.uploadPayrollData") || "Upload Payroll Data"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
