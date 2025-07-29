import { useState } from "react"
import { Search, MoreHorizontal, Trash2, Edit, Eye, Download, Filter, UserPlus, Mail } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/contexts/language-context"

export default function EmployeeManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddEmployeeDialogOpen, setIsAddEmployeeDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const { t, direction } = useLanguage()

  // Mock employee data
  const employees = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      department: "Engineering",
      position: "Senior Developer",
      employeeId: "EMP-12345",
      status: "Active",
      joinDate: "2020-05-12",
      phone: "+1 (555) 123-4567",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      department: "Marketing",
      position: "Marketing Manager",
      employeeId: "EMP-12346",
      status: "Active",
      joinDate: "2019-08-23",
      phone: "+1 (555) 234-5678",
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      department: "Finance",
      position: "Financial Analyst",
      employeeId: "EMP-12347",
      status: "Active",
      joinDate: "2021-02-15",
      phone: "+1 (555) 345-6789",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.davis@example.com",
      department: "Human Resources",
      position: "HR Specialist",
      employeeId: "EMP-12348",
      status: "Active",
      joinDate: "2018-11-05",
      phone: "+1 (555) 456-7890",
    },
    {
      id: 5,
      name: "Michael Wilson",
      email: "michael.wilson@example.com",
      department: "Engineering",
      position: "Frontend Developer",
      employeeId: "EMP-12349",
      status: "Inactive",
      joinDate: "2019-03-20",
      phone: "+1 (555) 567-8901",
    },
  ]

  const filteredEmployees = employees.filter(
    (emp) =>
      (activeTab === "all" ||
        (activeTab === "active" && emp.status === "Active") ||
        (activeTab === "inactive" && emp.status === "Inactive")) &&
      (emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="py-6" dir={direction}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{t("admin.employees.title") || "Employee Management"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("admin.employees.description") || "Manage employee information and access"}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>{t("admin.employees.directory") || "Employee Directory"}</CardTitle>
              <CardDescription>{t("admin.employees.directoryDescription") || "View and manage employee information"}</CardDescription>
            </div>
            <Dialog open={isAddEmployeeDialogOpen} onOpenChange={setIsAddEmployeeDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center">
                  <UserPlus className="mr-2 h-4 w-4" />
                  {t("admin.employees.addEmployee") || "Add Employee"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>{t("admin.employees.addNewEmployee") || "Add New Employee"}</DialogTitle>
                  <DialogDescription>
                    {t("admin.employees.addEmployeeDescription") || "Enter employee information below"}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="firstName">{t("admin.employees.firstName") || "First Name"}</Label>
                      <Input id="firstName" placeholder={t("admin.employees.placeholders.firstName") || "John"} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="lastName">{t("admin.employees.lastName") || "Last Name"}</Label>
                      <Input id="lastName" placeholder={t("admin.employees.placeholders.lastName") || "Doe"} />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">{t("admin.employees.email") || "Email"}</Label>
                    <Input id="email" type="email" placeholder={t("admin.employees.placeholders.email") || "john.doe@example.com"} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">{t("admin.employees.phone") || "Phone"}</Label>
                    <Input id="phone" placeholder={t("admin.employees.placeholders.phone") || "+1 (555) 123-4567"} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="department">{t("admin.employees.department") || "Department"}</Label>
                      <Select>
                        <SelectTrigger id="department">
                          <SelectValue placeholder={t("admin.employees.placeholders.selectDepartment") || "Select department"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="engineering">{t("admin.employees.departments.engineering") || "Engineering"}</SelectItem>
                          <SelectItem value="marketing">{t("admin.employees.departments.marketing") || "Marketing"}</SelectItem>
                          <SelectItem value="finance">{t("admin.employees.departments.finance") || "Finance"}</SelectItem>
                          <SelectItem value="hr">{t("admin.employees.departments.hr") || "Human Resources"}</SelectItem>
                          <SelectItem value="operations">{t("admin.employees.departments.operations") || "Operations"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="position">{t("admin.employees.position") || "Position"}</Label>
                      <Input id="position" placeholder={t("admin.employees.placeholders.position") || "Job title"} />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="joinDate">{t("admin.employees.joinDate") || "Join Date"}</Label>
                    <Input id="joinDate" type="date" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddEmployeeDialogOpen(false)}>
                    {t("admin.employees.cancel") || "Cancel"}
                  </Button>
                  <Button onClick={() => setIsAddEmployeeDialogOpen(false)}>{t("admin.employees.addEmployee") || "Add Employee"}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
                <TabsList className="mb-4 md:mb-0">
                  <TabsTrigger value="all">{t("admin.employees.allEmployees") || "All Employees"}</TabsTrigger>
                  <TabsTrigger value="active">{t("admin.employees.activeEmployees") || "Active"}</TabsTrigger>
                  <TabsTrigger value="inactive">{t("admin.employees.inactiveEmployees") || "Inactive"}</TabsTrigger>
                </TabsList>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <Input
                      placeholder={t("admin.employees.searchPlaceholder") || "Search employees..."}
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      {t("admin.employees.filter") || "Filter"}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          {t("admin.employees.export") || "Export"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>{t("admin.employees.exportCsv") || "Export as CSV"}</DropdownMenuItem>
                        <DropdownMenuItem>{t("admin.employees.exportExcel") || "Export as Excel"}</DropdownMenuItem>
                        <DropdownMenuItem>{t("admin.employees.exportPdf") || "Export as PDF"}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              <TabsContent value="all" className="mt-0">
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t("admin.employees.name") || "Name"}</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground hidden md:table-cell">
                            {t("admin.employees.employeeId") || "Employee ID"}
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground hidden md:table-cell">
                            {t("admin.employees.department") || "Department"}
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground hidden md:table-cell">
                            {t("admin.employees.position") || "Position"}
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t("admin.employees.status") || "Status"}</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            {t("admin.employees.actions") || "Actions"}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {filteredEmployees.map((employee) => (
                          <tr
                            key={employee.id}
                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                          >
                            <td className="p-4 align-middle">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center mr-3">
                                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                                    {employee.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium">{employee.name}</p>
                                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                    <Mail className="h-3 w-3 mr-1" />
                                    {employee.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 align-middle hidden md:table-cell">{employee.employeeId}</td>
                            <td className="p-4 align-middle hidden md:table-cell">{employee.department}</td>
                            <td className="p-4 align-middle hidden md:table-cell">{employee.position}</td>
                            <td className="p-4 align-middle">
                              <Badge
                                className={
                                  employee.status === "Active"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                                }
                              >
                                {employee.status}
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
                                  <DropdownMenuLabel>{t("admin.employees.actions") || "Actions"}</DropdownMenuLabel>
                                  <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    {t("admin.employees.viewDetails") || "View Details"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    {t("admin.employees.edit") || "Edit"}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Mail className="mr-2 h-4 w-4" />
                                    {t("admin.employees.sendEmail") || "Send Email"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {t("admin.employees.delete") || "Delete"}
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
              </TabsContent>

              <TabsContent value="active" className="mt-0">
                {/* Same table structure as "all" tab but filtered for active employees */}
                <div className="rounded-md border">{/* Table content */}</div>
              </TabsContent>

              <TabsContent value="inactive" className="mt-0">
                {/* Same table structure as "all" tab but filtered for inactive employees */}
                <div className="rounded-md border">{/* Table content */}</div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
