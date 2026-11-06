import { axiosInstance } from '@/api/axiosInstance'
import type {
  AccountSummary,
  AccountsResponse,
  AddAccountLoginRequest,
  AddAccountPendingResponse,
  AddAccountRequest,
  AddAccountResendRequest,
  AddAccountVerifyRequest,
  AppleSocialLoginRequest,
  AuthResponse,
  AvatarUpload,
  FacebookSocialLoginRequest,
  GoogleSocialLoginRequest,
  LoginRequest,
  LogoutRequest,
  MeResponse,
  MessageResponse,
  PasswordChangeRequest,
  PasswordResetConfirmRequest,
  PasswordResetRequest,
  RegisterRequest,
  ResendVerificationRequest,
  VerificationPendingResponse,
  VerifyEmailRequest,
} from '@/api/contracts'

/** Every path is relative to `${EXPO_PUBLIC_API_URL}/api/v1`. */
export const authEndpoints = {
  register: '/auth/register/',
  verifyEmail: '/auth/verify-email/',
  resendVerification: '/auth/verify-email/resend/',
  login: '/auth/login/',
  socialGoogle: '/auth/social/google/',
  socialApple: '/auth/social/apple/',
  socialFacebook: '/auth/social/facebook/',
  logout: '/auth/logout/',
  me: '/auth/me/',
  accounts: '/auth/accounts/',
  addLogin: '/auth/accounts/add/login/',
  addRequest: '/auth/accounts/add/request/',
  addVerify: '/auth/accounts/add/verify/',
  addResend: '/auth/accounts/add/resend/',
  removeAccount: (accountId: string) => `/auth/accounts/${accountId}/`,
  avatar: '/auth/avatar/',
  passwordChange: '/auth/password/change/',
  passwordResetRequest: '/auth/password-reset/request/',
  passwordResetConfirm: '/auth/password-reset/confirm/',
  deleteIdentity: '/auth/account/',
} as const

const PUBLIC = { skipAuth: true, skipRefresh: true } as const

// Logout must never trigger the 401 refresh path: the access token may already
// be expired, and the refresh token is the one being blacklisted. Without this
// the interceptor fires handleSessionExpired() while useSignOut is mid-flight,
// producing a double clear + double router.replace.
const NO_REFRESH = { skipRefresh: true, skipRedirect: true } as const

export const authApi = {
  register: (data: RegisterRequest) =>
    axiosInstance
      .post<VerificationPendingResponse>(authEndpoints.register, data, PUBLIC)
      .then((response) => response.data),

  verifyEmail: (data: VerifyEmailRequest) =>
    axiosInstance
      .post<AuthResponse>(authEndpoints.verifyEmail, data, PUBLIC)
      .then((response) => response.data),

  resendVerification: (data: ResendVerificationRequest) =>
    axiosInstance
      .post<void>(authEndpoints.resendVerification, data, PUBLIC)
      .then(() => undefined),

  login: (data: LoginRequest) =>
    axiosInstance
      .post<AuthResponse>(authEndpoints.login, data, PUBLIC)
      .then((response) => response.data),

  socialGoogle: (data: GoogleSocialLoginRequest) =>
    axiosInstance
      .post<AuthResponse>(authEndpoints.socialGoogle, data, PUBLIC)
      .then((response) => response.data),

  socialApple: (data: AppleSocialLoginRequest) =>
    axiosInstance
      .post<AuthResponse>(authEndpoints.socialApple, data, PUBLIC)
      .then((response) => response.data),

  socialFacebook: (data: FacebookSocialLoginRequest) =>
    axiosInstance
      .post<AuthResponse>(authEndpoints.socialFacebook, data, PUBLIC)
      .then((response) => response.data),

  logout: (data: LogoutRequest = {}) =>
    axiosInstance.post<void>(authEndpoints.logout, data, NO_REFRESH).then(() => undefined),

  me: () => axiosInstance.get<MeResponse>(authEndpoints.me).then((response) => response.data),

  accounts: () =>
    axiosInstance.get<AccountsResponse>(authEndpoints.accounts).then((response) => response.data),

  addAccountLogin: (data: AddAccountLoginRequest) =>
    axiosInstance
      .post<AuthResponse>(authEndpoints.addLogin, data)
      .then((response) => response.data),

  requestAddAccount: (data: AddAccountRequest) =>
    axiosInstance
      .post<AddAccountPendingResponse>(authEndpoints.addRequest, data)
      .then((response) => response.data),

  verifyAddAccount: (data: AddAccountVerifyRequest) =>
    axiosInstance
      .post<AuthResponse>(authEndpoints.addVerify, data)
      .then((response) => response.data),

  resendAddAccount: (data: AddAccountResendRequest) =>
    axiosInstance
      .post<void>(authEndpoints.addResend, data)
      .then(() => undefined),

  removeAccount: (accountId: string) =>
    axiosInstance.delete<void>(authEndpoints.removeAccount(accountId)).then(() => undefined),

  uploadAvatar: (file: AvatarUpload) => {
    const form = new FormData()
    form.append('avatar', { ...file } as unknown as Blob)
    return axiosInstance
      .post<AccountSummary>(authEndpoints.avatar, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => response.data)
  },

  removeAvatar: () =>
    axiosInstance.delete<void>(authEndpoints.avatar).then(() => undefined),

  passwordChange: (data: PasswordChangeRequest) =>
    axiosInstance
      .post<MessageResponse>(authEndpoints.passwordChange, data)
      .then((response) => response.data),

  requestPasswordReset: (data: PasswordResetRequest) =>
    axiosInstance
      .post<MessageResponse>(authEndpoints.passwordResetRequest, data, PUBLIC)
      .then((response) => response.data),

  confirmPasswordReset: (data: PasswordResetConfirmRequest) =>
    axiosInstance
      .post<MessageResponse>(authEndpoints.passwordResetConfirm, data, PUBLIC)
      .then((response) => response.data),

  deleteIdentity: () =>
    axiosInstance.delete<void>(authEndpoints.deleteIdentity).then(() => undefined),
}

export type OTPurpose = 'email_verification' | 'password_reset'

export interface VerifyOTPResponse {
  onboarding_token?: string
  token?: string
  message?: string
  verified?: boolean
}

export interface SendCodeResponse {
  message: string
  code_sent?: boolean
}
