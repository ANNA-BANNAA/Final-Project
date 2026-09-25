import { apiClient } from './client';

export const authApi = {
  register: (userData) => apiClient('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: (credentials) => apiClient('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  getMe: () => apiClient('/auth/me'),

  logout: () => apiClient('/auth/logout', {
    method: 'POST',
  }),

  forgotPassword: (email) => apiClient('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),

  verifyResetCode: (email, code) => apiClient('/auth/verify-reset-code', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  }),

  resetPassword: (resetToken, password) => apiClient('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ resetToken, password }),
  }),
};