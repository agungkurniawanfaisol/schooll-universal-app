export interface Role {
  id: string
  name: string
  slug: string
  permissions: string[]
  description?: string
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  roleId: string
  role?: Role
  permissions?: string[]
  isActive: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  refreshToken: string
  user: User
}

export interface RefreshTokenResponse {
  token: string
  refreshToken: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}
