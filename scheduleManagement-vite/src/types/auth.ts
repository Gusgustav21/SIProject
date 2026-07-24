export type UserRole = 'regular' | 'admin'

export interface AuthUser {
  _id: string
  name: string
  email: string
  role: UserRole
}
