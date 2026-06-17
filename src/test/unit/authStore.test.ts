import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock js-cookie before importing store (cookiesStorage uses it)
vi.mock('js-cookie', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}))

import { useSessionUser, useToken } from '@/store/authStore'
import { TOKEN_NAME_IN_STORAGE } from '@/constants/api.constant'
import type { User } from '@/@types/auth'

// Reset zustand store state between tests
beforeEach(() => {
  useSessionUser.setState({
    session: { signedIn: false },
    user: {
      avatar: '',
      userName: '',
      email: '',
      authority: [],
    },
  })

  // Clear localStorage/sessionStorage between tests
  localStorage.clear()
  sessionStorage.clear()
})

describe('useSessionUser store — initial state', () => {
  it('starts with signedIn = false', () => {
    const { session } = useSessionUser.getState()
    expect(session.signedIn).toBe(false)
  })

  it('starts with an empty user', () => {
    const { user } = useSessionUser.getState()
    expect(user.userName).toBe('')
    expect(user.email).toBe('')
    expect(user.avatar).toBe('')
    expect(user.authority).toEqual([])
  })
})

describe('useSessionUser store — setSessionSignedIn', () => {
  it('sets signedIn to true', () => {
    useSessionUser.getState().setSessionSignedIn(true)
    expect(useSessionUser.getState().session.signedIn).toBe(true)
  })

  it('sets signedIn back to false', () => {
    useSessionUser.getState().setSessionSignedIn(true)
    useSessionUser.getState().setSessionSignedIn(false)
    expect(useSessionUser.getState().session.signedIn).toBe(false)
  })
})

describe('useSessionUser store — setUser', () => {
  it('updates the user state with new values', () => {
    const newUser: User = {
      userId: 'uid-123',
      userName: 'John',
      email: 'john@example.com',
      avatar: '/avatar.png',
      authority: ['USER'],
    }
    useSessionUser.getState().setUser(newUser)
    const { user } = useSessionUser.getState()
    expect(user.userId).toBe('uid-123')
    expect(user.userName).toBe('John')
    expect(user.email).toBe('john@example.com')
    expect(user.avatar).toBe('/avatar.png')
    expect(user.authority).toEqual(['USER'])
  })

  it('merges partial user updates without erasing other fields', () => {
    // Set a full user first
    useSessionUser.getState().setUser({
      userId: 'uid-1',
      userName: 'Alice',
      email: 'alice@example.com',
      avatar: '/alice.png',
      authority: ['ADMIN'],
    })
    // Now update only the email
    useSessionUser.getState().setUser({ email: 'newalice@example.com' })
    const { user } = useSessionUser.getState()
    expect(user.userName).toBe('Alice')
    expect(user.email).toBe('newalice@example.com')
  })
})

describe('useToken — setToken and getToken', () => {
  it('setToken stores token in localStorage', () => {
    const { setToken } = useToken()
    setToken('my-access-token')
    expect(localStorage.getItem(TOKEN_NAME_IN_STORAGE)).toBe('my-access-token')
  })

  it('setToken stores token in sessionStorage', () => {
    const { setToken } = useToken()
    setToken('session-token')
    expect(sessionStorage.getItem(TOKEN_NAME_IN_STORAGE)).toBe('session-token')
  })

  it('setToken with empty string clears localStorage', () => {
    localStorage.setItem(TOKEN_NAME_IN_STORAGE, 'old-token')
    const { setToken } = useToken()
    setToken('')
    expect(localStorage.getItem(TOKEN_NAME_IN_STORAGE)).toBeNull()
  })

  it('setToken with empty string clears sessionStorage', () => {
    sessionStorage.setItem(TOKEN_NAME_IN_STORAGE, 'old-token')
    const { setToken } = useToken()
    setToken('')
    expect(sessionStorage.getItem(TOKEN_NAME_IN_STORAGE)).toBeNull()
  })

  it('token is readable from localStorage after setToken', () => {
    localStorage.setItem(TOKEN_NAME_IN_STORAGE, 'readable-token')
    const { token } = useToken()
    expect(token).toBe('readable-token')
  })

  it('token is null/falsy when no token is stored', () => {
    localStorage.clear()
    sessionStorage.clear()
    const { token } = useToken()
    // With js-cookie mocked to return undefined, token should be falsy
    expect(token).toBeFalsy()
  })
})

describe('sign-out flow', () => {
  it('clears user and session state on sign-out', () => {
    // Set up a signed-in user
    useSessionUser.getState().setSessionSignedIn(true)
    useSessionUser.getState().setUser({
      userId: 'uid-1',
      userName: 'Alice',
      email: 'alice@example.com',
      authority: ['USER'],
    })

    // Simulate sign-out: clear token and reset session
    const { setToken } = useToken()
    setToken('')
    useSessionUser.getState().setSessionSignedIn(false)
    useSessionUser.getState().setUser({
      userId: undefined,
      userName: '',
      email: '',
      avatar: '',
      authority: [],
    })

    const state = useSessionUser.getState()
    expect(state.session.signedIn).toBe(false)
    expect(state.user.email).toBe('')
    expect(state.user.authority).toEqual([])
    expect(localStorage.getItem(TOKEN_NAME_IN_STORAGE)).toBeNull()
  })
})
