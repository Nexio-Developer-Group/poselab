import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock js-cookie before importing cookiesStorage
vi.mock('js-cookie', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}))

import cookiesStorage from '@/utils/cookiesStorage'
import Cookies from 'js-cookie'

const mockCookies = Cookies as unknown as {
  get: ReturnType<typeof vi.fn>
  set: ReturnType<typeof vi.fn>
  remove: ReturnType<typeof vi.fn>
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('cookiesStorage.getItem', () => {
  it('returns the cookie value when it exists', () => {
    mockCookies.get.mockReturnValue('my-token')
    const result = cookiesStorage.getItem('token')
    expect(result).toBe('my-token')
    expect(mockCookies.get).toHaveBeenCalledWith('token')
  })

  it('returns null when the cookie does not exist', () => {
    mockCookies.get.mockReturnValue(undefined)
    const result = cookiesStorage.getItem('missing-key')
    expect(result).toBeNull()
  })

  it('calls Cookies.get with the correct name', () => {
    mockCookies.get.mockReturnValue('value')
    cookiesStorage.getItem('auth-session')
    expect(mockCookies.get).toHaveBeenCalledWith('auth-session')
  })
})

describe('cookiesStorage.setItem', () => {
  it('calls Cookies.set with the name and value', () => {
    cookiesStorage.setItem('token', 'abc123')
    expect(mockCookies.set).toHaveBeenCalledWith('token', 'abc123', { expires: 1, path: '/' })
  })

  it('uses the provided expires value', () => {
    cookiesStorage.setItem('token', 'xyz', 7)
    expect(mockCookies.set).toHaveBeenCalledWith('token', 'xyz', { expires: 7, path: '/' })
  })

  it('accepts a Date object as expires', () => {
    const expiryDate = new Date('2099-01-01')
    cookiesStorage.setItem('session', 'data', expiryDate)
    expect(mockCookies.set).toHaveBeenCalledWith('session', 'data', { expires: expiryDate, path: '/' })
  })

  it('defaults to expires=1 when no expiry is provided', () => {
    cookiesStorage.setItem('key', 'value')
    expect(mockCookies.set).toHaveBeenCalledWith('key', 'value', { expires: 1, path: '/' })
  })

  it('sets the path to /', () => {
    cookiesStorage.setItem('key', 'value')
    const callArgs = mockCookies.set.mock.calls[0]
    expect(callArgs[2]).toMatchObject({ path: '/' })
  })
})

describe('cookiesStorage.removeItem', () => {
  it('calls Cookies.remove with the correct name', () => {
    cookiesStorage.removeItem('token')
    expect(mockCookies.remove).toHaveBeenCalledWith('token')
  })

  it('removes the specified key', () => {
    cookiesStorage.removeItem('auth-session')
    expect(mockCookies.remove).toHaveBeenCalledWith('auth-session')
    expect(mockCookies.remove).not.toHaveBeenCalledWith('other-key')
  })
})
