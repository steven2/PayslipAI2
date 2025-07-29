import type React from "react"

import { useState, useEffect } from "react"
import { FileText, Upload, Search, MoreHorizontal, Trash2, Edit, Eye, Download, Plus, Filter, Calendar, History, GitBranch, Clock, Save, X } from "lucide-react"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { documentsService } from "@/services/documentsService"

interface Document {
  id: string
  name: string
  filename: string
  type: 'Policy' | 'Guide' | 'Reference' | 'FAQ'
  description: string
  content: string
  version: string
  effectiveFrom: string
  effectiveTo?: string
  documentId?: string
  status: 'Active' | 'Archived' | 'Draft'
  size: string
  lastUpdated: string
  uploadDate: string
}

interface DocumentFormData {
  name: string
  filename: string
  type: 'Policy' | 'Guide' | 'Reference' | 'FAQ'
  description: string
  content: string
  version: string
  effectiveFrom: string
  effectiveTo?: string
  documentId?: string
  status: 'Active' | 'Archived' | 'Draft'
}

export default function DocumentManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const { t, direction } = useLanguage()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null)
  const [editingDocument, setEditingDocument] = useState<Document | null>(null)
  const [deletingDocument, setDeletingDocument] = useState<Document | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const { toast } = useToast()
  
  // New state for versioning features
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [isDateFilterActive, setIsDateFilterActive] = useState(false)
  const [isVersionDialogOpen, setIsVersionDialogOpen] = useState(false)
  const [documentVersions, setDocumentVersions] = useState<Document[]>([])
  const [selectedDocumentForVersions, setSelectedDocumentForVersions] = useState<string>("")
  const [activeTab, setActiveTab] = useState("all")

  // Form data for creating/editing documents
  const [formData, setFormData] = useState<DocumentFormData>({
    name: '',
    filename: '',
    type: 'Policy',
    description: '',
    content: '',
    version: '1.0',
    effectiveFrom: new Date().toISOString().split('T')[0],
    status: 'Active'
  })

  // Load documents from API
  useEffect(() => {
    loadDocuments()
  }, [isDateFilterActive, selectedDate, activeTab])

  // Mock documents data based on actual files in public/documents
  const mockDocuments: Document[] = [
    {
      id: "1",
      name: "Payroll Policy 2024 H1",
      filename: "payroll-policy-2024-h1.txt",
      type: "Policy" as const,
      description: "First half 2024 payroll policy with standard procedures",
      content: "This document outlines the payroll policies and procedures...",
      version: "1.0",
      effectiveFrom: "2024-01-01",
      effectiveTo: "2024-06-30",
      uploadDate: "2024-01-01T00:00:00Z",
      size: "2.0 KB",
      status: "Active" as const,
      lastUpdated: "2024-01-01T00:00:00Z"
    },
    {
      id: "2",
      name: "Payroll Policy 2024 H2",
      filename: "payroll-policy-2024-h2.txt",
      type: "Policy" as const,
      description: "Second half 2024 payroll policy with updated tax rates",
      content: "This document outlines the updated payroll policies...",
      version: "1.1",
      effectiveFrom: "2024-07-01",
      uploadDate: "2024-07-01T00:00:00Z",
      size: "2.8 KB",
      status: "Active" as const,
      lastUpdated: "2024-07-01T00:00:00Z"
    },
    {
      id: "3",
      name: "Salary Structure Guide",
      filename: "salary-structure-guide.txt",
      type: "Guide" as const,
      description: "Comprehensive guide to salary structure and components",
      content: "This guide explains the salary structure...",
      version: "2.0",
      effectiveFrom: "2024-01-01",
      uploadDate: "2024-01-01T00:00:00Z",
      size: "2.4 KB",
      status: "Active" as const,
      lastUpdated: "2024-01-01T00:00:00Z"
    },
    {
      id: "4",
      name: "Tax Calculation Reference",
      filename: "tax-calculation-reference.txt",
      type: "Reference" as const,
      description: "Reference document for tax calculation methods",
      content: "This reference document explains tax calculations...",
      version: "1.0",
      effectiveFrom: "2024-01-01",
      uploadDate: "2024-01-01T00:00:00Z",
      size: "3.0 KB",
      status: "Active" as const,
      lastUpdated: "2024-01-01T00:00:00Z"
    },
    {
      id: "5",
      name: "Benefits Overview",
      filename: "benefits-overview.txt",
      type: "Guide" as const,
      description: "Overview of employee benefits and eligibility",
      content: "This document provides an overview of benefits...",
      version: "1.0",
      effectiveFrom: "2024-01-01",
      uploadDate: "2024-01-01T00:00:00Z",
      size: "5.1 KB",
      status: "Active" as const,
      lastUpdated: "2024-01-01T00:00:00Z"
    },
    {
      id: "6",
      name: "Overtime Policy",
      filename: "overtime-policy.txt",
      type: "Policy" as const,
      description: "Policy governing overtime work and compensation",
      content: "This policy outlines overtime procedures...",
      version: "1.0",
      effectiveFrom: "2024-01-01",
      uploadDate: "2024-01-01T00:00:00Z",
      size: "5.3 KB",
      status: "Active" as const,
      lastUpdated: "2024-01-01T00:00:00Z"
    }
  ]

  const loadDocuments = async () => {
    try {
      setLoading(true)
      let params: any = {}
      
      // Add date filter if active
      if (isDateFilterActive && selectedDate) {
        const date = new Date(selectedDate)
        const month = date.getMonth()
        const year = date.getFullYear()
        params = { month: month.toString(), year: year.toString(), latest: activeTab === 'latest' ? 'true' : 'false' }
      } else if (activeTab === 'latest') {
        // Get latest versions only
        const now = new Date()
        params = { month: now.getMonth().toString(), year: now.getFullYear().toString(), latest: 'true' }
      }
      
              try {
          const response = await documentsService.getDocuments(params)
          if (response.status === 200 && response.data) {
            setDocuments(Array.isArray(response.data) ? response.data as Document[] : [])
          } else {
            // Fallback to mock data
            setDocuments(mockDocuments)
          }
        } catch (error) {
          console.error('Error loading documents from service, using mock data:', error)
          // Fallback to mock data
          setDocuments(mockDocuments)
        }
    } catch (error) {
      console.error('Error loading documents:', error)
      // Fallback to mock data
      setDocuments(mockDocuments)
      toast({
        title: "Warning",
        description: "Using mock data - API service unavailable",
        variant: "default"
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      
      // Read file content if it's a text file
      if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const content = event.target?.result as string
          setFormData(prev => ({
            ...prev,
            content,
            filename: file.name,
            name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
          }))
        }
        reader.readAsText(file)
      }
    }
  }

  const handleCreateDocument = async () => {
    try {
      const response = await documentsService.createDocument({
        ...formData,
        size: `${Math.round((formData.content.length * 8) / 1024)} KB`,
        uploadDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      })

      if (response.status === 200 && response.data) {
        setDocuments(prev => [response.data as Document, ...prev])
        setIsUploadDialogOpen(false)
        resetForm()
        toast({
          title: "Success",
          description: "Document created successfully",
        })
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to create document",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error creating document:', error)
      toast({
        title: "Error",
        description: "Failed to create document",
        variant: "destructive"
      })
    }
  }

  const handleUpdateDocument = async () => {
    if (!editingDocument) return

    try {
      const response = await documentsService.updateDocument(editingDocument.id, formData)

      if (response.status === 200 && response.data) {
        setDocuments(prev => prev.map(doc => 
          doc.id === editingDocument.id ? response.data as Document : doc
        ))
        setIsEditDialogOpen(false)
        setEditingDocument(null)
        resetForm()
        toast({
          title: "Success",
          description: "Document updated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update document",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error updating document:', error)
      toast({
        title: "Error",
        description: "Failed to update document",
        variant: "destructive"
      })
    }
  }

  const handleDeleteDocument = async () => {
    if (!deletingDocument) return

    try {
      const response = await documentsService.deleteDocument(deletingDocument.id)

      if (response.status === 200) {
        setDocuments(prev => prev.filter(doc => doc.id !== deletingDocument.id))
        setIsDeleteDialogOpen(false)
        setDeletingDocument(null)
        toast({
          title: "Success",
          description: "Document deleted successfully",
        })
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete document",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error deleting document:', error)
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive"
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      filename: '',
      type: 'Policy',
      description: '',
      content: '',
      version: '1.0',
      effectiveFrom: new Date().toISOString().split('T')[0],
      status: 'Active'
    })
    setSelectedFile(null)
  }

  const handleEditDocument = (document: Document) => {
    setEditingDocument(document)
    setFormData({
      name: document.name,
      filename: document.filename,
      type: document.type,
      description: document.description,
      content: document.content,
      version: document.version,
      effectiveFrom: document.effectiveFrom,
      effectiveTo: document.effectiveTo,
      documentId: document.documentId,
      status: document.status
    })
    setIsEditDialogOpen(true)
  }

  const handleViewDocument = (document: Document) => {
    setViewingDocument(document)
    setIsViewDialogOpen(true)
  }

  const handleDownloadDocument = (document: Document) => {
    // Create a blob with the document content
    const blob = new Blob([document.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    // Create a temporary download link
    const link = globalThis.document.createElement('a')
    link.href = url
    link.download = `${document.name.replace(/\s+/g, '_')}.txt`
    globalThis.document.body.appendChild(link)
    link.click()
    
    // Cleanup
    globalThis.document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleViewVersions = async (baseDocumentId: string) => {
    try {
      const response = await documentsService.getDocuments({ versions: baseDocumentId })
      if (response.status === 200 && response.data) {
        setDocumentVersions(Array.isArray(response.data) ? response.data : [])
        setSelectedDocumentForVersions(baseDocumentId)
        setIsVersionDialogOpen(true)
      }
    } catch (error) {
      console.error('Error loading document versions:', error)
      toast({
        title: "Error",
        description: "Failed to load document versions",
        variant: "destructive"
      })
    }
  }

  const handleDateFilter = () => {
    setIsDateFilterActive(!isDateFilterActive)
    if (!isDateFilterActive && !selectedDate) {
      const today = new Date()
      setSelectedDate(today.toISOString().split('T')[0])
    }
  }

  const getDocumentBaseId = (doc: Document): string => {
    // Extract base document ID from name or documentId
    if (doc.documentId) {
      return doc.documentId
    }
    // Fallback: remove version from name
    return doc.name.split(' v')[0].toLowerCase().replace(/\s+/g, '-')
  }

  const formatEffectivePeriod = (doc: Document): string => {
    const from = new Date(doc.effectiveFrom).toLocaleDateString()
    const to = doc.effectiveTo ? new Date(doc.effectiveTo).toLocaleDateString() : 'Current'
    return `${from} - ${to}`
  }

  if (loading) {
    return (
      <div className="py-6" dir={direction}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{t("admin.documents.title") || "Document Management"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("admin.documents.description") || "Manage policy documents and guides"}
          </p>
          <div className="mt-8 flex items-center justify-center">
            <div className="text-lg text-gray-500 dark:text-gray-400">{t("admin.documents.loading") || "Loading documents..."}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-6" dir={direction}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{t("admin.documents.title") || "Document Management"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("admin.documents.description") || "Manage policy documents and guides"}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>{t("admin.documents.documentLibrary") || "Document Library"}</CardTitle>
              <CardDescription>
                {t("admin.documents.documentLibraryDescription") || "Manage your organization's documents"} ({documents.length} {t("admin.documents.allDocuments") || "documents"})
              </CardDescription>
            </div>
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center" onClick={resetForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t("admin.documents.createDocument") || "Create Document"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{t("admin.documents.createNewDocument") || "Create New Document"}</DialogTitle>
                  <DialogDescription>
                    {t("admin.documents.createDocumentDescription") || "Add a new document to the library"}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="file">{t("admin.documents.uploadFileOptional") || "Upload File (Optional)"}</Label>
                    <Input id="file" type="file" onChange={handleFileChange} accept=".txt,.md" />
                    {selectedFile && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {t("admin.documents.selectedFile") || "Selected file"}: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="name">{t("admin.documents.documentName") || "Document Name"}</Label>
                    <Input
                      id="name"
                      placeholder={t("admin.documents.enterDocumentName") || "Enter document name"}
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="filename">{t("admin.documents.filename") || "Filename"}</Label>
                    <Input
                      id="filename"
                      placeholder={t("admin.documents.enterFilename") || "Enter filename"}
                      value={formData.filename}
                      onChange={(e) => setFormData(prev => ({ ...prev, filename: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="documentType">{t("admin.documents.documentType") || "Document Type"}</Label>
                    <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger id="documentType">
                        <SelectValue placeholder={t("admin.documents.selectDocumentType") || "Select document type"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Policy">{t("admin.documents.types.policy") || "Policy"}</SelectItem>
                        <SelectItem value="Guide">{t("admin.documents.types.guide") || "Guide"}</SelectItem>
                        <SelectItem value="Reference">{t("admin.documents.types.reference") || "Reference"}</SelectItem>
                        <SelectItem value="FAQ">{t("admin.documents.types.faq") || "FAQ"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="version">{t("admin.documents.version") || "Version"}</Label>
                    <Input
                      id="version"
                      placeholder={t("admin.documents.enterVersion") || "Enter version"}
                      value={formData.version}
                      onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="grid gap-2">
                      <Label htmlFor="effectiveFrom">{t("admin.documents.effectiveFrom") || "Effective From"}</Label>
                      <Input
                        id="effectiveFrom"
                        type="date"
                        value={formData.effectiveFrom}
                        onChange={(e) => setFormData(prev => ({ ...prev, effectiveFrom: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="effectiveTo">{t("admin.documents.effectiveTo") || "Effective To"}</Label>
                      <Input
                        id="effectiveTo"
                        type="date"
                        value={formData.effectiveTo || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, effectiveTo: e.target.value || undefined }))}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">{t("admin.documents.description") || "Description"}</Label>
                    <Textarea
                      id="description"
                      placeholder={t("admin.documents.enterDocumentDescription") || "Enter document description"}
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="content">{t("admin.documents.content") || "Content"}</Label>
                    <Textarea
                      id="content"
                      placeholder={t("admin.documents.enterDocumentContent") || "Enter document content"}
                      className="min-h-[200px]"
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                    {t("admin.documents.cancel") || "Cancel"}
                  </Button>
                  <Button 
                    onClick={handleCreateDocument} 
                    disabled={!formData.name || !formData.content || !formData.description}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {t("admin.documents.createDocument") || "Create Document"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {/* Document View Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="all" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  {t("admin.documents.allVersions") || "All Versions"}
                </TabsTrigger>
                <TabsTrigger value="latest" className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  {t("admin.documents.latestOnly") || "Latest Only"}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  placeholder={t("admin.documents.searchPlaceholder") || "Search documents..."}
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <div className="flex items-center space-x-2">
                  <Button 
                    variant={isDateFilterActive ? "default" : "outline"} 
                    size="sm"
                    onClick={handleDateFilter}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {t("admin.documents.dateFilter") || "Date Filter"}
                  </Button>
                  {isDateFilterActive && (
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-40"
                    />
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={loadDocuments}>
                  <Download className="mr-2 h-4 w-4" />
                  {t("admin.documents.refresh") || "Refresh"}
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className={`h-12 px-4 ${direction === 'rtl' ? 'text-right' : 'text-left'} align-middle font-medium text-muted-foreground`}>{t("admin.documents.name") || "Name"}</th>
                      <th className={`h-12 px-4 ${direction === 'rtl' ? 'text-right' : 'text-left'} align-middle font-medium text-muted-foreground`}>{t("admin.documents.type") || "Type"}</th>
                      <th className={`h-12 px-4 ${direction === 'rtl' ? 'text-right' : 'text-left'} align-middle font-medium text-muted-foreground hidden md:table-cell`}>
                        {t("admin.documents.version") || "Version"}
                      </th>
                      <th className={`h-12 px-4 ${direction === 'rtl' ? 'text-right' : 'text-left'} align-middle font-medium text-muted-foreground hidden lg:table-cell`}>
                        {t("admin.documents.effectivePeriod") || "Effective Period"}
                      </th>
                      <th className={`h-12 px-4 ${direction === 'rtl' ? 'text-right' : 'text-left'} align-middle font-medium text-muted-foreground hidden md:table-cell`}>
                        {t("admin.documents.size") || "Size"}
                      </th>
                      <th className={`h-12 px-4 ${direction === 'rtl' ? 'text-right' : 'text-left'} align-middle font-medium text-muted-foreground`}>{t("admin.documents.status") || "Status"}</th>
                      <th className={`h-12 px-4 ${direction === 'rtl' ? 'text-right' : 'text-left'} align-middle font-medium text-muted-foreground`}>{t("admin.documents.actions") || "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {filteredDocuments.map((doc) => (
                      <tr
                        key={doc.id}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        <td className="p-4 align-middle">
                          <div className="flex items-center">
                            <FileText className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                            <div>
                              <div className="flex items-center">
                                <p className="font-medium">{doc.name}</p>
                                {doc.version && (
                                  <Badge variant="secondary" className="ml-2 text-xs">
                                    v{doc.version}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                                {doc.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <Badge variant="outline">{doc.type}</Badge>
                        </td>
                        <td className="p-4 align-middle hidden md:table-cell">
                          <div className="flex items-center">
                            <GitBranch className="mr-1 h-3 w-3 text-gray-400" />
                            {doc.version || 'N/A'}
                          </div>
                        </td>
                        <td className="p-4 align-middle hidden lg:table-cell">
                          <div className="text-xs">
                            {doc.effectiveFrom && formatEffectivePeriod(doc)}
                          </div>
                        </td>
                        <td className="p-4 align-middle hidden md:table-cell">{doc.size}</td>
                        <td className="p-4 align-middle">
                          <Badge
                            className={
                              doc.status === "Active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : doc.status === "Archived"
                                ? "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                            }
                          >
                            {doc.status}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleViewDocument(doc)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditDocument(doc)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownloadDocument(doc)}>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleViewVersions(getDocumentBaseId(doc))}>
                                <History className="mr-2 h-4 w-4" />
                                View Versions
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600 dark:text-red-400"
                                onClick={() => {
                                  setDeletingDocument(doc)
                                  setIsDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      {/* Document Viewer Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              {viewingDocument?.name}
            </DialogTitle>
            <DialogDescription>
              {viewingDocument?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {viewingDocument && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <span>Type: <Badge variant="outline">{viewingDocument.type}</Badge></span>
                  {viewingDocument.version && <span>Version: {viewingDocument.version}</span>}
                  {viewingDocument.documentId && <span>ID: {viewingDocument.documentId}</span>}
                  <span>Size: {viewingDocument.size}</span>
                  {viewingDocument.effectiveFrom && (
                    <span>Effective: {formatEffectivePeriod(viewingDocument)}</span>
                  )}
                </div>
                <div className="border rounded-md p-4 max-h-96 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {viewingDocument.content}
                  </pre>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            {viewingDocument && (
              <Button onClick={() => handleDownloadDocument(viewingDocument)}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Document Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
            <DialogDescription>
              Update the document information and content.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Document Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-filename">Filename</Label>
              <Input
                id="edit-filename"
                value={formData.filename}
                onChange={(e) => setFormData(prev => ({ ...prev, filename: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-type">Document Type</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger id="edit-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Policy">Policy</SelectItem>
                  <SelectItem value="Guide">Guide</SelectItem>
                  <SelectItem value="Reference">Reference</SelectItem>
                  <SelectItem value="FAQ">FAQ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-version">Version</Label>
              <Input
                id="edit-version"
                value={formData.version}
                onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger id="edit-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="edit-effectiveFrom">Effective From</Label>
                <Input
                  id="edit-effectiveFrom"
                  type="date"
                  value={formData.effectiveFrom}
                  onChange={(e) => setFormData(prev => ({ ...prev, effectiveFrom: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-effectiveTo">Effective To (Optional)</Label>
                <Input
                  id="edit-effectiveTo"
                  type="date"
                  value={formData.effectiveTo || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, effectiveTo: e.target.value || undefined }))}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                className="min-h-[200px]"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateDocument}>
              <Save className="mr-2 h-4 w-4" />
              Update Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the document
              "{deletingDocument?.name}" from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDocument}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Document
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Document Versions Dialog */}
      <Dialog open={isVersionDialogOpen} onOpenChange={setIsVersionDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <History className="mr-2 h-5 w-5" />
              Document Versions: {selectedDocumentForVersions}
            </DialogTitle>
            <DialogDescription>
              View all versions of this document and their effective periods
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50">
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Version</th>
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Effective From</th>
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Effective To</th>
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {documentVersions.map((version) => (
                      <tr key={version.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">
                          <div className="flex items-center">
                            <GitBranch className="mr-2 h-4 w-4 text-gray-400" />
                            <span className="font-medium">v{version.version}</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          {new Date(version.effectiveFrom).toLocaleDateString()}
                        </td>
                        <td className="p-4 align-middle">
                          {version.effectiveTo ? new Date(version.effectiveTo).toLocaleDateString() : 'Current'}
                        </td>
                        <td className="p-4 align-middle">
                          <Badge
                            className={
                              version.status === "Active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                            }
                          >
                            {version.status}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleViewDocument(version)}
                            >
                              <Eye className="mr-1 h-3 w-3" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditDocument(version)}
                            >
                              <Edit className="mr-1 h-3 w-3" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDownloadDocument(version)}
                            >
                              <Download className="mr-1 h-3 w-3" />
                              Download
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVersionDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 