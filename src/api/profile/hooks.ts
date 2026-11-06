import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { profileApi, type UserProfile } from './endpoints'

import { extractErrorMessage } from '@/api/errors'
import type { PaginatedResponse } from '@/api/types'
import { useAuthStore } from '@/store'

const reportError = (error: unknown) => {
  useAuthStore.getState().setError(extractErrorMessage(error))
}

export const useProfiles = (params?: { page?: number }) =>
  useQuery<PaginatedResponse<UserProfile>>({
    queryKey: ['profiles', 'list', params],
    queryFn: () => profileApi.list(params).then((res) => res.data),
  })

export const useProfile = (id: string, enabled = true) =>
  useQuery<UserProfile>({
    queryKey: ['profiles', 'detail', id],
    queryFn: () => profileApi.retrieve(id).then((res) => res.data),
    enabled,
  })

export const useCurrentProfile = () =>
  useQuery<UserProfile>({
    queryKey: ['profiles', 'me'],
    queryFn: () => profileApi.me().then((res) => res.data),
    retry: false,
  })

export const useCreateProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) => profileApi.create(data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profiles'] }),
    onError: reportError,
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData | Partial<UserProfile> }) =>
      profileApi.update(id, data).then((res) => res.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['profiles', 'detail', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['profiles', 'me'] })
    },
    onError: reportError,
  })
}

export const useDeleteProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => profileApi.delete(id).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profiles'] }),
    onError: reportError,
  })
}
