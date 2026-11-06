/** Query keys shared by the API hooks and screen-level invalidations. */
export const queryKeys = {
  auth: {
    root: ['auth'] as const,
    me: ['auth', 'me'] as const,
    accounts: ['auth', 'accounts'] as const,
  },
  onboarding: {
    coachProfile: ['onboarding', 'coach', 'profile'] as const,
  },
} as const
