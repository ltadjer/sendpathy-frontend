import { setActivePinia, createPinia } from 'pinia'
import { useAccountStore } from './account'
import AuthService from '@/services/auth.service'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// create one single toastMock
const toastMock = { showToast: vi.fn() }

vi.mock('@/stores/toast', () => ({
  useToastStore: () => toastMock // always return the same mock
}))

vi.mock('@/services/auth.service', () => ({
  default: {
    login: vi.fn(),
    checkAuth: vi.fn(),
    logout: vi.fn(),
    refreshToken: vi.fn(),
    requestPasswordReset: vi.fn(),
    resetPassword: vi.fn()
  }
}))

describe('useAccountStore', () => {
  beforeEach(() => {
    // clear calls before each test
    toastMock.showToast.mockClear()
    setActivePinia(createPinia())
  })

  it('initial state is correct', () => {
    const store = useAccountStore()
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
    expect(store._refreshTimeoutId).toBeNull()
  })

  it('login() sets user and schedules refresh on success', async () => {
    const fakeUser = { data: { id: 'u1', email: 'a@b' }, status: 200 }
    ;(AuthService.login as any).mockResolvedValue(fakeUser)

    const store = useAccountStore()
    // spy scheduleRefresh
    const spy = vi.spyOn(store, 'scheduleRefresh')

    await store.login({ email: 'a@b', password: 'pwd' })
    expect(store.isAuthenticated).toBe(true)
    expect(store.user).toEqual(fakeUser.data)
    expect(spy).toHaveBeenCalledWith(15 * 60 * 1000)
  })

  it('logout() clears state and cancels timer', async () => {
    const store = useAccountStore()
    store.isAuthenticated = true
    store.user = { id: 'u1' }
    // simulate a timer
    store._refreshTimeoutId = setTimeout(() => {}, 1000)
    await store.logout()
    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeNull()
    expect(store._refreshTimeoutId).toBeNull()
    expect(AuthService.logout).toHaveBeenCalled()
  })

  it('refreshToken calls AuthService.refreshToken', async () => {
    const store = useAccountStore()
    const spy = vi.spyOn(AuthService, 'refreshToken').mockResolvedValue(undefined)

    await store.refreshToken()

    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('checkAuth updates user state and schedules refresh', async () => {
    const fakeUser = { data: { id: 'u1', email: 'a@b' }, status: 200 }
    vi.spyOn(AuthService, 'checkAuth').mockResolvedValue(fakeUser)

    const store = useAccountStore()
    const scheduleSpy = vi.spyOn(store, 'scheduleRefresh')

    await store.checkAuth()

    expect(store.user).toEqual(fakeUser.data)
    expect(store.isAuthenticated).toBe(true)
    expect(scheduleSpy).toHaveBeenCalledWith(15 * 60 * 1000)
  })

  it('scheduleRefresh sets a timeout', () => {
    const store = useAccountStore()
    store.scheduleRefresh(2000)
    expect(typeof store._refreshTimeoutId === 'object' || false).toBe(true)
    clearTimeout(store._refreshTimeoutId!)
  })

  it('requestPasswordReset sends a reset email and shows a toast', async () => {
    const store = useAccountStore()
    const mockResponse = { status: 200 }
    vi.spyOn(AuthService, 'requestPasswordReset').mockResolvedValue(mockResponse)

    await store.requestPasswordReset('test@example.com')

    expect(AuthService.requestPasswordReset).toHaveBeenCalledWith('test@example.com')
    expect(toastMock.showToast).toHaveBeenCalledWith(
      'Email de réinitialisation de mot de passe envoyé. Veuillez vérifier votre email.',
      'primary'
    )
  })

  it('resetPassword resets the password and shows a toast', async () => {
    const store = useAccountStore()
    const mockResponse = { data: { status: 200 } }
    vi.spyOn(AuthService, 'resetPassword').mockResolvedValue(mockResponse)

    await store.resetPassword('reset-token', 'new-password')

    expect(AuthService.resetPassword).toHaveBeenCalledWith('reset-token', 'new-password')
    expect(toastMock.showToast).toHaveBeenCalledWith(
      'Mot de passe réinitialisé avec succès.',
      'primary'
    )
  })
})
