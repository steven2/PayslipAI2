import { useState } from "react"
import { Search, MoreHorizontal, Trash2, Edit, Eye, Download, Plus, Filter, UserPlus, Lock, Key } from "lucide-react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { useLanguage } from "@/contexts/language-context"

export default function AccessControl() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("users")
  const { t, direction } = useLanguage()

  // Mock user data
  const users = [
    {
      id: 1,
      name: "Admin User",
      email: "admin@example.com",
      role: "Administrator",
      status: "Active",
      lastLogin: "2023-11-15T14:32:00Z",
    },
    {
      id: 2,
      name: "HR Manager",
      email: "hr@example.com",
      role: "HR Manager",
      status: "Active",
      lastLogin: "2023-11-14T09:15:00Z",
    },
    {
      id: 3,
      name: "Payroll Specialist",
      email: "payroll@example.com",
      role: "Payroll Specialist",
      status: "Active",
      lastLogin: "2023-11-13T16:45:00Z",
    },
    {
      id: 4,
      name: "Content Manager",
      email: "content@example.com",
      role: "Content Manager",
      status: "Inactive",
      lastLogin: "2023-10-25T11:20:00Z",
    },
    {
      id: 5,
      name: "Viewer",
      email: "viewer@example.com",
      role: "Viewer",
      status: "Active",
      lastLogin: "2023-11-10T13:55:00Z",
    },
  ]

  // Mock role data
  const roles = [
    {
      id: 1,
      name: "Administrator",
      description: "Full access to all system features",
      userCount: 1,
      permissions: [
        "manage_users",
        "manage_roles",
        "manage_documents",
        "manage_employees",
        "manage_payroll",
        "manage_wage_types",
        "view_analytics",
      ],
    },
    {
      id: 2,
      name: "HR Manager",
      description: "Manage employee data and documents",
      userCount: 1,
      permissions: ["manage_documents", "manage_employees", "view_payroll", "view_wage_types", "view_analytics"],
    },
    {
      id: 3,
      name: "Payroll Specialist",
      description: "Manage payroll data and wage types",
      userCount: 1,
      permissions: ["view_documents", "view_employees", "manage_payroll", "manage_wage_types", "view_analytics"],
    },
    {
      id: 4,
      name: "Content Manager",
      description: "Manage documents and content",
      userCount: 1,
      permissions: ["manage_documents", "view_analytics"],
    },
    {
      id: 5,
      name: "Viewer",
      description: "View-only access to system data",
      userCount: 1,
      permissions: ["view_documents", "view_employees", "view_payroll", "view_wage_types", "view_analytics"],
    },
  ]

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="py-6" dir={direction}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{t("admin.access.title") || "Access Control"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("admin.access.description") || "Manage user access and permissions"}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
        <Tabs defaultValue="users" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">{t("admin.access.users") || "Users"}</TabsTrigger>
            <TabsTrigger value="roles">{t("admin.access.roles") || "Roles"}</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>{t("admin.access.userManagement") || "User Management"}</CardTitle>
                  <CardDescription>{t("admin.access.userManagementDescription") || "Manage system users and their access"}</CardDescription>
                </div>
                <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center">
                      <UserPlus className="mr-2 h-4 w-4" />
                      {t("admin.access.addUser") || "Add User"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                      <DialogTitle>{t("admin.access.addNewUser") || "Add New User"}</DialogTitle>
                      <DialogDescription>{t("admin.access.addUserDescription") || "Create a new user account with specific role and permissions"}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="firstName">{t("admin.access.firstName") || "First Name"}</Label>
                          <Input id="firstName" placeholder="John" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="lastName">{t("admin.access.lastName") || "Last Name"}</Label>
                          <Input id="lastName" placeholder="Doe" />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">{t("admin.access.email") || "Email"}</Label>
                        <Input id="email" type="email" placeholder="john.doe@example.com" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="role">{t("admin.access.role") || "Role"}</Label>
                        <Select>
                          <SelectTrigger id="role">
                            <SelectValue placeholder={t("admin.access.selectRole") || "Select a role"} />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.id} value={role.name.toLowerCase()}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="password">{t("admin.access.temporaryPassword") || "Temporary Password"}</Label>
                        <Input id="password" type="password" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="sendEmail" />
                        <Label htmlFor="sendEmail">{t("admin.access.sendWelcomeEmail") || "Send welcome email"}</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                        {t("admin.access.cancel") || "Cancel"}
                      </Button>
                      <Button onClick={() => setIsAddUserDialogOpen(false)}>{t("admin.access.addUser") || "Add User"}</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <Input
                      placeholder={t("admin.access.searchUsers") || "Search users..."}
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      {t("admin.access.filter") || "Filter"}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          {t("admin.access.export") || "Export"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>{t("admin.access.exportCsv") || "Export as CSV"}</DropdownMenuItem>
                        <DropdownMenuItem>{t("admin.access.exportExcel") || "Export as Excel"}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <th className={`h-12 px-4 ${direction === 'rtl' ? 'text-right' : 'text-left'} align-middle font-medium text-muted-foreground`}>{t("admin.access.name") || "Name"}</th>
                          <th className={`h-12 px-4 ${direction === 'rtl' ? 'text-right' : 'text-left'} align-middle font-medium text-muted-foreground`}>{t("admin.access.email") || "Email"}</th>
                          <th className={`h-12 px-4 ${direction === 'rtl' ? 'text-right' : 'text-left'} align-middle font-medium text-muted-foreground`}>{t("admin.access.role") || "Role"}</th>
                          <th className={`h-12 px-4 ${direction === 'rtl' ? 'text-right' : 'text-left'} align-middle font-medium text-muted-foreground hidden md:table-cell`}>
                            {t("admin.access.lastLogin") || "Last Login"}
                          </th>
                          <th className={`h-12 px-4 ${direction === 'rtl' ? 'text-right' : 'text-left'} align-middle font-medium text-muted-foreground`}>{t("admin.access.status") || "Status"}</th>
                          <th className={`h-12 px-4 ${direction === 'rtl' ? 'text-right' : 'text-left'} align-middle font-medium text-muted-foreground`}>
                            {t("admin.access.actions") || "Actions"}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {filteredUsers.map((user) => (
                          <tr
                            key={user.id}
                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                          >
                            <td className="p-4 align-middle">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center mr-3">
                                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                                    {user.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </span>
                                </div>
                                <span className="font-medium">{user.name}</span>
                              </div>
                            </td>
                            <td className="p-4 align-middle">{user.email}</td>
                            <td className="p-4 align-middle">
                              <Badge variant="outline">{user.role}</Badge>
                            </td>
                            <td className="p-4 align-middle hidden md:table-cell">
                              {new Date(user.lastLogin).toLocaleString()}
                            </td>
                            <td className="p-4 align-middle">
                              <Badge
                                className={
                                  user.status === "Active"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                                }
                              >
                                {user.status}
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
                                  <DropdownMenuLabel>{t("admin.access.actions") || "Actions"}</DropdownMenuLabel>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    {t("admin.access.editUser") || "Edit User"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Key className="mr-2 h-4 w-4" />
                                    {t("admin.access.resetPassword") || "Reset Password"}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Lock className="mr-2 h-4 w-4" />
                                    {user.status === "Active" ? t("admin.access.deactivate") || "Deactivate" : t("admin.access.activate") || "Activate"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {t("admin.access.delete") || "Delete"}
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
          </TabsContent>

          <TabsContent value="roles" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Roles & Permissions</CardTitle>
                  <CardDescription>Manage roles and their associated permissions</CardDescription>
                </div>
                <Dialog open={isAddRoleDialogOpen} onOpenChange={setIsAddRoleDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Add New Role</DialogTitle>
                      <DialogDescription>Create a new role with specific permissions.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="roleName">Role Name</Label>
                        <Input id="roleName" placeholder="e.g., Finance Manager" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="roleDescription">Description</Label>
                        <Input id="roleDescription" placeholder="Brief description of the role" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Permissions</Label>
                        <div className="border rounded-md p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Document Management</h4>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <Checkbox id="view_documents" />
                                  <Label htmlFor="view_documents">View Documents</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox id="manage_documents" />
                                  <Label htmlFor="manage_documents">Manage Documents</Label>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Employee Data</h4>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <Checkbox id="view_employees" />
                                  <Label htmlFor="view_employees">View Employees</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox id="manage_employees" />
                                  <Label htmlFor="manage_employees">Manage Employees</Label>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Payroll Data</h4>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <Checkbox id="view_payroll" />
                                  <Label htmlFor="view_payroll">View Payroll</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox id="manage_payroll" />
                                  <Label htmlFor="manage_payroll">Manage Payroll</Label>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Wage Types</h4>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <Checkbox id="view_wage_types" />
                                  <Label htmlFor="view_wage_types">View Wage Types</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox id="manage_wage_types" />
                                  <Label htmlFor="manage_wage_types">Manage Wage Types</Label>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Analytics</h4>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <Checkbox id="view_analytics" />
                                  <Label htmlFor="view_analytics">View Analytics</Label>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">User Management</h4>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <Checkbox id="manage_users" />
                                  <Label htmlFor="manage_users">Manage Users</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox id="manage_roles" />
                                  <Label htmlFor="manage_roles">Manage Roles</Label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddRoleDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsAddRoleDialogOpen(false)}>Add Role</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <Input
                      placeholder="Search roles..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            Role Name
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground hidden md:table-cell">
                            Description
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Users</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground hidden lg:table-cell">
                            Permissions
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {filteredRoles.map((role) => (
                          <tr
                            key={role.id}
                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                          >
                            <td className="p-4 align-middle font-medium">{role.name}</td>
                            <td className="p-4 align-middle hidden md:table-cell">{role.description}</td>
                            <td className="p-4 align-middle">
                              <Badge>{role.userCount}</Badge>
                            </td>
                            <td className="p-4 align-middle hidden lg:table-cell">
                              <div className="flex flex-wrap gap-1">
                                {role.permissions.slice(0, 3).map((permission, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {permission.replace(/_/g, " ")}
                                  </Badge>
                                ))}
                                {role.permissions.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{role.permissions.length - 3} more
                                  </Badge>
                                )}
                              </div>
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
                                  <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Role
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600 dark:text-red-400">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
