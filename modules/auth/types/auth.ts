export interface User {
  id: string
  email: string
  name?: string
  phone?: string
  question?: string
  avatar_url?: string
  files?: FileItem[]
  created_at: string
  updated_at: string
}

export interface FileItem {
  id: string
  name: string
  url: string
  size: number
  type: string
  uploaded_at: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  name: string
  phone: string
  question?: string
}

export interface ProfileUpdate {
  name?: string
  phone?: string
  question?: string
}

export interface AuthError {
  message: string
  code?: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  error?: AuthError
  token?: string
} 