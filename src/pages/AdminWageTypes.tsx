import { useState, useEffect, useRef } from "react"
import { Search, MoreHorizontal, Trash2, Edit, Eye, Download, Plus, Filter, FileText, Info, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useLanguage } from "@/contexts/language-context"
import { wageTypesService } from "@/services/wageTypesService"

interface WageType {
  id: string
  name: string
  description: string
  calculationMethod: string
  taxable: boolean
  status: string
  category: string
  effectiveDate?: string
  lastUpdated?: string
}

export default function WageTypeCatalog() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddWageTypeDialogOpen, setIsAddWageTypeDialogOpen] = useState(false)
  const [wageTypes, setWageTypes] = useState<WageType[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const { t, direction } = useLanguage()
  const [viewingWageType, setViewingWageType] = useState<WageType | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const [addForm, setAddForm] = useState({
    id: '',
    name: '',
    category: '',
    description: '',
    calculationMethod: '',
    taxable: false,
    status: 'Active',
    effectiveDate: '',
    lastUpdated: ''
  })
  const [editForm, setEditForm] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const editWageTypeRef = useRef<any>(null)
  const [isDocDialogOpen, setIsDocDialogOpen] = useState(false)
  const [docWageType, setDocWageType] = useState<WageType | null>(null)

  // Mock data for demonstration
  const mockWageTypes: WageType[] = [
    {
      id: "1000",
      name: "Basic Salary",
      category: "Earnings",
      description: "Monthly basic salary for regular employees",
      calculationMethod: "Fixed monthly amount as per employment contract",
      taxable: true,
      status: "Active",
      effectiveDate: "2024-01-01",
      lastUpdated: "2024-01-15"
    },
    {
      id: "1010",
      name: "Overtime Pay",
      category: "Earnings",
      description: "Additional compensation for hours worked beyond standard schedule",
      calculationMethod: "Regular hourly rate × 1.5 × overtime hours",
      taxable: true,
      status: "Active",
      effectiveDate: "2024-01-01",
      lastUpdated: "2024-01-15"
    },
    {
      id: "2000",
      name: "Housing Allowance",
      category: "Allowances",
      description: "Monthly allowance to support housing expenses",
      calculationMethod: "Fixed amount of $800 per month",
      taxable: true,
      status: "Active",
      effectiveDate: "2024-01-01",
      lastUpdated: "2024-01-15"
    },
    {
      id: "3000",
      name: "Income Tax",
      category: "Deductions",
      description: "Mandatory income tax deduction as per tax brackets",
      calculationMethod: "Progressive tax rates based on income level",
      taxable: false,
      status: "Active",
      effectiveDate: "2024-01-01",
      lastUpdated: "2024-01-15"
    },
    {
      id: "4000",
      name: "Health Insurance",
      category: "Benefits",
      description: "Company-provided health insurance coverage",
      calculationMethod: "2% of gross salary, company covers 80%",
      taxable: false,
      status: "Active",
      effectiveDate: "2024-01-01",
      lastUpdated: "2024-01-15"
    }
  ]

  useEffect(() => {
    loadWageTypes()
  }, [])

  // Load wage types from API or mock data
  const loadWageTypes = async () => {
    setLoading(true)
    try {
      // Try to load from service, fallback to mock data
      const response = await wageTypesService.getWageTypes()
      if (response.status === 200 && response.data) {
        setWageTypes(Array.isArray(response.data) ? response.data : [])
      } else {
        // Fallback to mock data
        setWageTypes(mockWageTypes)
      }
    } catch (error) {
      console.error('Error loading wage types:', error)
      // Fallback to mock data
      setWageTypes(mockWageTypes)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await wageTypesService.getWageTypes({ stats: 'true' })
      if (response.status === 200 && response.data) {
        setStats(response.data)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      await loadWageTypes()
      await loadStats()
    } catch (error) {
      console.error('Error refreshing data:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const handleCategoryFilter = async (category: string) => {
    setSelectedCategory(category)
    // Filter mock data locally
    if (category === 'all') {
      setWageTypes(mockWageTypes)
    } else {
      setWageTypes(mockWageTypes.filter(wt => wt.category === category))
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    // Filter mock data locally
    if (query.trim() === '') {
      setWageTypes(mockWageTypes)
    } else {
      setWageTypes(mockWageTypes.filter(wt => 
        wt.name.toLowerCase().includes(query.toLowerCase()) ||
        wt.description.toLowerCase().includes(query.toLowerCase())
      ))
    }
  }

  const handleViewWageType = (wageType: WageType) => {
    setViewingWageType(wageType)
    setIsViewDialogOpen(true)
  }

  const handleExport = (format: string) => {
    // Create CSV content
    if (format === 'csv') {
      const headers = ['ID', 'Name', 'Category', 'Description', 'Calculation Method', 'Taxable', 'Status', 'Effective Date', 'Last Updated']
      const csvContent = [
        headers.join(','),
        ...wageTypes.map(wt => [
          wt.id,
          `"${wt.name}"`,
          wt.category,
          `"${wt.description}"`,
          `"${wt.calculationMethod}"`,
          wt.taxable ? 'Yes' : 'No',
          wt.status,
          wt.effectiveDate || '',
          wt.lastUpdated || ''
        ].join(','))
      ].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `wage-types-catalog-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  // Add Wage Type
  const handleAddWageType = async (newWageType: any) => {
    const wageType: WageType = {
      id: newWageType.id,
      name: newWageType.name,
      category: newWageType.category,
      description: newWageType.description,
      calculationMethod: newWageType.calculationMethod,
      taxable: newWageType.taxable,
      status: newWageType.status,
      effectiveDate: newWageType.effectiveDate || undefined,
      lastUpdated: new Date().toISOString(),
    }
    
    setWageTypes(prev => [wageType, ...prev])
    setIsAddWageTypeDialogOpen(false)
    resetAddForm()
  }

  // Edit Wage Type
  const handleEditWageType = async (id: string, updates: any) => {
    try {
      const updatedWageType = {
        ...updates,
        lastUpdated: new Date().toISOString(),
      }

      // Update local state
      setWageTypes(prevWageTypes => 
        prevWageTypes.map(wt => 
          wt.id === id ? { ...wt, ...updatedWageType } : wt
        )
      )

      // Update viewingWageType if it's the same wage type being edited
      if (viewingWageType && viewingWageType.id === id) {
        setViewingWageType({ ...viewingWageType, ...updatedWageType })
      }

      // Close dialogs
      setIsEditDialogOpen(false)
      
      console.log('Wage type updated successfully')
    } catch (error) {
      console.error('Error updating wage type:', error)
      alert('Failed to update wage type. Please try again.')
    }
  }

  // Delete Wage Type
  const handleDeleteWageType = async (id: string) => {
    setWageTypes(wageTypes.filter(wt => wt.id !== id))
  }

  // Open Edit Dialog
  const openEditDialog = (wageType: WageType) => {
    setEditForm({ ...wageType })
    setIsEditDialogOpen(true)
    editWageTypeRef.current = wageType
  }

  // Handle Add Form Change
  const handleAddFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setAddForm((prev) => ({ ...prev, [id]: value }))
  }

  // Handle Add Form Select Change
  const handleAddFormSelect = (id: string, value: any) => {
    setAddForm((prev) => ({ ...prev, [id]: value }))
  }

  // Handle Edit Form Change
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setEditForm((prev: any) => ({ ...prev, [id]: value }))
  }

  // Handle Edit Form Select Change
  const handleEditFormSelect = (id: string, value: any) => {
    setEditForm((prev: any) => ({ ...prev, [id]: value }))
  }

  const handleViewDocumentation = (wageType: WageType) => {
    setDocWageType(wageType)
    setIsDocDialogOpen(true)
  }

  const resetAddForm = () => {
    setAddForm({
      id: '',
      name: '',
      category: '',
      description: '',
      calculationMethod: '',
      taxable: false,
      status: 'Active',
      effectiveDate: '',
      lastUpdated: ''
    })
  }

  if (loading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Wage Type Catalog</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage wage types, calculation methods, and descriptions
          </p>
          <div className="mt-8 flex items-center justify-center">
            <div className="text-lg text-gray-500 dark:text-gray-400">Loading wage types...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-6" dir={direction}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{t("admin.wageTypes.title") || "Wage Type Catalog"}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("admin.wageTypes.description") || "Manage wage types, calculation methods, and descriptions"}
            </p>
          </div>
          <Button 
            onClick={handleRefresh} 
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? t("admin.wageTypes.refreshing") || "Refreshing..." : t("admin.wageTypes.refreshFromExcel") || "Refresh"}
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>{t("admin.wageTypes.wageTypes") || "Wage Types"}</CardTitle>
              <CardDescription>
                {t("admin.wageTypes.wageTypesDescription") || "Comprehensive catalog of wage types and calculations"} ({wageTypes.length} {t("admin.wageTypes.total") || "total"}
                {stats && `, ${stats.byStatus?.Active || 0} ${t("admin.wageTypes.active") || "active"}`})
              </CardDescription>
            </div>
            <Dialog open={isAddWageTypeDialogOpen} onOpenChange={setIsAddWageTypeDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center" onClick={resetAddForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t("admin.wageTypes.addWageType") || "Add Wage Type"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{t("admin.wageTypes.addNewWageType") || "Add New Wage Type"}</DialogTitle>
                  <DialogDescription>
                    {t("admin.wageTypes.addWageTypeDescription") || "Create a new wage type with calculation details"}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="id">{t("admin.wageTypes.wageTypeId") || "Wage Type ID"}</Label>
                      <Input id="id" value={addForm.id} onChange={handleAddFormChange} placeholder={t("admin.wageTypes.wageTypeIdPlaceholder") || "e.g., 1000"} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="name">{t("admin.wageTypes.nameField") || "Name"}</Label>
                      <Input id="name" value={addForm.name} onChange={handleAddFormChange} placeholder={t("admin.wageTypes.nameFieldPlaceholder") || "e.g., Basic Salary"} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={addForm.category} onValueChange={(v) => handleAddFormSelect('category', v)}>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Earnings">Earnings</SelectItem>
                          <SelectItem value="Allowances">Allowances</SelectItem>
                          <SelectItem value="Deductions">Deductions</SelectItem>
                          <SelectItem value="Benefits">Benefits</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="taxable">Taxable</Label>
                      <Select value={addForm.taxable ? 'true' : 'false'} onValueChange={(v) => handleAddFormSelect('taxable', v === 'true')}>
                        <SelectTrigger id="taxable">
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={addForm.description} onChange={handleAddFormChange} placeholder="Detailed description of the wage type..." className="min-h-[80px]" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="calculationMethod">Calculation Method</Label>
                    <Textarea id="calculationMethod" value={addForm.calculationMethod} onChange={handleAddFormChange} placeholder="Explain how this wage type is calculated..." className="min-h-[80px]" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddWageTypeDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleAddWageType(addForm)}>Add Wage Type</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
              <div className="flex space-x-4 w-full md:w-auto">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    placeholder={t("admin.wageTypes.searchPlaceholder") || "Search wage types..."}
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <Select value={selectedCategory || "all"} onValueChange={handleCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder={t("admin.wageTypes.allCategories") || "All Categories"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("admin.wageTypes.allCategories") || "All Categories"}</SelectItem>
                    <SelectItem value="Earnings">{t("admin.wageTypes.categories.earnings") || "Earnings"}</SelectItem>
                    <SelectItem value="Allowances">{t("admin.wageTypes.categories.allowances") || "Allowances"}</SelectItem>
                    <SelectItem value="Deductions">{t("admin.wageTypes.categories.deductions") || "Deductions"}</SelectItem>
                    <SelectItem value="Benefits">{t("admin.wageTypes.categories.benefits") || "Benefits"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      {t("admin.wageTypes.export") || "Export"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleExport('csv')}>{t("admin.wageTypes.exportCsv") || "Export as CSV"}</DropdownMenuItem>
                    <DropdownMenuItem>{t("admin.wageTypes.exportExcel") || "Export as Excel"}</DropdownMenuItem>
                    <DropdownMenuItem>{t("admin.wageTypes.exportPdf") || "Export as PDF"}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t("admin.wageTypes.id") || "ID"}</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t("admin.wageTypes.name") || "Name"}</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t("admin.wageTypes.category") || "Category"}</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground hidden lg:table-cell">
                        {t("admin.wageTypes.description") || "Description"}
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground hidden md:table-cell">
                        {t("admin.wageTypes.taxableField") || "Taxable"}
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t("admin.wageTypes.status") || "Status"}</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t("admin.wageTypes.actions") || "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {wageTypes.map((wageType) => (
                      <tr
                        key={wageType.id}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        <td className="p-4 align-middle font-mono text-sm">{wageType.id}</td>
                        <td className="p-4 align-middle font-medium">{wageType.name}</td>
                        <td className="p-4 align-middle">
                          <Badge
                            variant="outline"
                            className={
                              wageType.category === "Earnings"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
                                : wageType.category === "Deductions"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                            }
                          >
                            {wageType.category}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle hidden lg:table-cell">
                          <div className="max-w-xs truncate" title={wageType.description}>
                            {wageType.description}
                          </div>
                        </td>
                        <td className="p-4 align-middle hidden md:table-cell">
                          {wageType.taxable ? (
                            <Badge
                              variant="outline"
                              className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
                            >
                              Taxable
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800"
                            >
                              Non-Taxable
                            </Badge>
                          )}
                        </td>
                        <td className="p-4 align-middle">
                          <Badge
                            className={
                              wageType.status === "Active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                            }
                          >
                            {wageType.status}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center space-x-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    onClick={() => handleViewWageType(wageType)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View Details</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(wageType)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewDocumentation(wageType)}>
                                  <FileText className="mr-2 h-4 w-4" />
                                  View Documentation
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Info className="mr-2 h-4 w-4" />
                                  View Usage
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={() => handleDeleteWageType(wageType.id)}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wage Type Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              {viewingWageType?.name} ({viewingWageType?.id})
            </DialogTitle>
            <DialogDescription>
              Detailed information about this wage type
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {viewingWageType && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Category:</span>{' '}
                    <Badge variant="outline" className="ml-2">
                      {viewingWageType.category}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>{' '}
                    <Badge className={viewingWageType.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {viewingWageType.status}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Taxable:</span>{' '}
                    <span className={viewingWageType.taxable ? 'text-yellow-600' : 'text-gray-600'}>
                      {viewingWageType.taxable ? 'Yes' : 'No'}
                    </span>
                  </div>
                  {viewingWageType.effectiveDate && (
                    <div>
                      <span className="font-medium">Effective Date:</span>{' '}
                      <span className="text-gray-600">{viewingWageType.effectiveDate}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground bg-gray-50 dark:bg-gray-900 p-3 rounded">
                    {viewingWageType.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Calculation Method</h4>
                  <p className="text-sm text-muted-foreground bg-gray-50 dark:bg-gray-900 p-3 rounded">
                    {viewingWageType.calculationMethod}
                  </p>
                </div>

                {viewingWageType.lastUpdated && (
                  <div className="text-xs text-gray-500 pt-2 border-t">
                    Last updated: {viewingWageType.lastUpdated}
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => viewingWageType && openEditDialog(viewingWageType)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Wage Type
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Wage Type Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Wage Type</DialogTitle>
            <DialogDescription>
              Update the details for this wage type.
            </DialogDescription>
          </DialogHeader>
          {editForm && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="id">Wage Type ID</Label>
                  <Input id="id" value={editForm.id} disabled />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={editForm.name} onChange={handleEditFormChange} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={editForm.category} onValueChange={(v) => handleEditFormSelect('category', v)}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Earnings">Earnings</SelectItem>
                      <SelectItem value="Allowances">Allowances</SelectItem>
                      <SelectItem value="Deductions">Deductions</SelectItem>
                      <SelectItem value="Benefits">Benefits</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="taxable">Taxable</Label>
                  <Select value={editForm.taxable ? 'true' : 'false'} onValueChange={(v) => handleEditFormSelect('taxable', v === 'true')}>
                    <SelectTrigger id="taxable">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={editForm.description} onChange={handleEditFormChange} className="min-h-[80px]" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="calculationMethod">Calculation Method</Label>
                <Textarea id="calculationMethod" value={editForm.calculationMethod} onChange={handleEditFormChange} className="min-h-[80px]" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleEditWageType(editForm.id, editForm)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Documentation Dialog */}
      <Dialog open={isDocDialogOpen} onOpenChange={setIsDocDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Documentation for {docWageType?.name} ({docWageType?.id})</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground bg-gray-50 dark:bg-gray-900 p-3 rounded">
                {docWageType?.description}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Calculation Method</h4>
              <p className="text-sm text-muted-foreground bg-gray-50 dark:bg-gray-900 p-3 rounded">
                {docWageType?.calculationMethod}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDocDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
