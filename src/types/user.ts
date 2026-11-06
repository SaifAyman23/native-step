/**
 * The two roles the app is for. The backend owns the role once the account
 * exists, so this is what the user picks at sign up and what comes back.
 */
export type UserRole = 'client' | 'coach'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role?: UserRole
  createdAt?: string
  updatedAt?: string
}
