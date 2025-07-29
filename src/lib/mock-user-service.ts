// Mock user service to replace Supabase functionality with local data

export interface User {
  id: string
  roleId: number | null
  email: string
  name: string | null
  role?: string
  status: 'Active' | 'Inactive'
  lastLogin: string | null
  createdAt: string
  updatedAt: string
}

export interface Role {
  id: number
  name: string
  description: string | null
  permissions: string[]
  userCount?: number
  createdAt: string
  updatedAt: string
}

export interface Permission {
  id: number
  name: string
  description: string | null
  createdAt: string
}

export class MockUserService {
  private users: User[] = []
  private roles: Role[] = []
  private permissions: Permission[] = []
  private initialized = false

  private initializeData() {
    if (this.initialized) return

    // Initialize permissions
    this.permissions = [
      { id: 1, name: 'read_users', description: 'Read user information', createdAt: new Date().toISOString() },
      { id: 2, name: 'write_users', description: 'Create and edit users', createdAt: new Date().toISOString() },
      { id: 3, name: 'delete_users', description: 'Delete users', createdAt: new Date().toISOString() },
      { id: 4, name: 'read_documents', description: 'Read documents', createdAt: new Date().toISOString() },
      { id: 5, name: 'write_documents', description: 'Create and edit documents', createdAt: new Date().toISOString() },
      { id: 6, name: 'delete_documents', description: 'Delete documents', createdAt: new Date().toISOString() },
      { id: 7, name: 'read_wage_types', description: 'Read wage type information', createdAt: new Date().toISOString() },
      { id: 8, name: 'admin_access', description: 'Full administrative access', createdAt: new Date().toISOString() },
    ]

    // Initialize roles
    this.roles = [
      {
        id: 1,
        name: 'Admin',
        description: 'Full system administrator',
        permissions: ['admin_access', 'read_users', 'write_users', 'delete_users', 'read_documents', 'write_documents', 'delete_documents', 'read_wage_types'],
        userCount: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        name: 'HR Manager',
        description: 'Human resources manager',
        permissions: ['read_users', 'write_users', 'read_documents', 'write_documents', 'read_wage_types'],
        userCount: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Employee',
        description: 'Regular employee',
        permissions: ['read_documents', 'read_wage_types'],
        userCount: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    // Initialize sample users
    this.users = [
      {
        id: '1',
        roleId: 1,
        email: 'admin@company.com',
        name: 'System Administrator',
        role: 'Admin',
        status: 'Active',
        lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        roleId: 2,
        email: 'hr.manager@company.com',
        name: 'Sarah Johnson',
        role: 'HR Manager',
        status: 'Active',
        lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        roleId: 2,
        email: 'hr.assistant@company.com',
        name: 'Mike Chen',
        role: 'HR Manager',
        status: 'Active',
        lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '4',
        roleId: 3,
        email: 'john.doe@company.com',
        name: 'John Doe',
        role: 'Employee',
        status: 'Active',
        lastLogin: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '5',
        roleId: 3,
        email: 'jane.smith@company.com',
        name: 'Jane Smith',
        role: 'Employee',
        status: 'Active',
        lastLogin: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '6',
        roleId: 3,
        email: 'bob.wilson@company.com',
        name: 'Bob Wilson',
        role: 'Employee',
        status: 'Inactive',
        lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '7',
        roleId: 3,
        email: 'alice.brown@company.com',
        name: 'Alice Brown',
        role: 'Employee',
        status: 'Active',
        lastLogin: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '8',
        roleId: 3,
        email: 'tom.davis@company.com',
        name: 'Tom Davis',
        role: 'Employee',
        status: 'Active',
        lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    this.initialized = true
  }

  // Get all users with their roles
  async getAllUsers(): Promise<User[]> {
    this.initializeData()
    return [...this.users]
  }

  // Get user by ID
  async getUserById(id: string): Promise<User | null> {
    this.initializeData()
    return this.users.find(user => user.id === id) || null
  }

  // Create a new user
  async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'role'>): Promise<User> {
    this.initializeData()
    
    const newId = (this.users.length + 1).toString()
    const role = this.roles.find(r => r.id === user.roleId)
    
    const newUser: User = {
      ...user,
      id: newId,
      role: role?.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    this.users.push(newUser)
    
    // Update role user count
    if (role) {
      role.userCount = (role.userCount || 0) + 1
    }
    
    return newUser
  }

  // Update user
  async updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'role'>>): Promise<User> {
    this.initializeData()
    
    const userIndex = this.users.findIndex(user => user.id === id)
    if (userIndex === -1) {
      throw new Error(`User with id ${id} not found`)
    }
    
    const oldRoleId = this.users[userIndex].roleId
    const newRoleId = updates.roleId !== undefined ? updates.roleId : oldRoleId
    
    // Update role information if role changed
    if (oldRoleId !== newRoleId) {
      const oldRole = this.roles.find(r => r.id === oldRoleId)
      const newRole = this.roles.find(r => r.id === newRoleId)
      
      if (oldRole && oldRole.userCount) {
        oldRole.userCount -= 1
      }
      if (newRole) {
        newRole.userCount = (newRole.userCount || 0) + 1
      }
      
      updates.role = newRole?.name
    }
    
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    return this.users[userIndex]
  }

  // Delete user
  async deleteUser(id: string): Promise<void> {
    this.initializeData()
    
    const userIndex = this.users.findIndex(user => user.id === id)
    if (userIndex === -1) {
      throw new Error(`User with id ${id} not found`)
    }
    
    const user = this.users[userIndex]
    const role = this.roles.find(r => r.id === user.roleId)
    
    // Update role user count
    if (role && role.userCount) {
      role.userCount -= 1
    }
    
    this.users.splice(userIndex, 1)
  }

  // Get all roles with permissions and user counts
  async getAllRoles(): Promise<Role[]> {
    this.initializeData()
    return [...this.roles]
  }

  // Get all permissions
  async getAllPermissions(): Promise<Permission[]> {
    this.initializeData()
    return [...this.permissions]
  }

  // Search users
  async searchUsers(query: string): Promise<User[]> {
    this.initializeData()
    const searchTerm = query.toLowerCase()
    
    return this.users.filter(user =>
      user.email.toLowerCase().includes(searchTerm) ||
      (user.name && user.name.toLowerCase().includes(searchTerm)) ||
      (user.role && user.role.toLowerCase().includes(searchTerm))
    )
  }

  // Update user's last login
  async updateLastLogin(id: string): Promise<void> {
    this.initializeData()
    
    const userIndex = this.users.findIndex(user => user.id === id)
    if (userIndex !== -1) {
      this.users[userIndex].lastLogin = new Date().toISOString()
      this.users[userIndex].updatedAt = new Date().toISOString()
    }
  }
}

// Create singleton instance
export const mockUserService = new MockUserService() 