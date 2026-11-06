import { axiosInstance } from '@/api/axiosInstance'
import type { PaginatedResponse } from '@/api/types'

export interface UserProfile {
  id: string
  full_name: string
  phone_number: string
  position: string
  country: string
  biography: string
  profile_image: string | null
  created_at: string
  updated_at: string
}

export const profileEndpoints = {
  list: '/accounts/profile/',
  me: '/accounts/profile/me/',
  retrieve: (id: string) => `/accounts/profile/${id}/`,
}

export const profileApi = {
  list: (params?: { page?: number }) =>
    axiosInstance.get<PaginatedResponse<UserProfile>>(profileEndpoints.list, { params }),

  me: () => axiosInstance.get<UserProfile>(profileEndpoints.me),

  retrieve: (id: string) => axiosInstance.get<UserProfile>(profileEndpoints.retrieve(id)),

  create: (data: FormData) =>
    axiosInstance.post<UserProfile>(profileEndpoints.list, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id: string, data: FormData | Partial<UserProfile>) =>
    axiosInstance.patch<UserProfile>(profileEndpoints.retrieve(id), data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  delete: (id: string) => axiosInstance.delete(profileEndpoints.retrieve(id)),
}
