import { apiRequest } from '../lib/api'
import type { AuthUser } from '../types/auth'

export interface CreateAccountPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface LoginPayload {
  email: string
  password: string
}

export const authApi = {
  createAccount: (data: CreateAccountPayload) =>
    apiRequest<string>('/auth/create_account', { method: 'POST', body: data }),

  confirmAccount: (token: string) =>
    apiRequest<string>('/auth/confirm_account', { method: 'POST', body: { token } }),

  login: (data: LoginPayload) =>
    apiRequest<string>('/auth/login', { method: 'POST', body: data }),

  requestCode: (email: string) =>
    apiRequest<string>('/auth/request_code', { method: 'POST', body: { email } }),

  forgotPassword: (email: string) =>
    apiRequest<string>('/auth/forgot_password', { method: 'POST', body: { email } }),

  validateToken: (token: string) =>
    apiRequest<string>('/auth/validate_token', { method: 'POST', body: { token } }),

  updatePassword: (token: string, password: string, password_confirmation: string) =>
    apiRequest<string>(`/auth/update_password/${token}`, {
      method: 'POST',
      body: { password, password_confirmation },
    }),

  getUser: (token: string) =>
    apiRequest<AuthUser>('/auth/user', { method: 'GET', token }),
}
