import { describe, it, expect, vi } from 'vitest'
import { mapApiResponseToUser } from '@/utils/authMapper'
import type { ApiSignInResponse, ApiSignUpResponse } from '@/@types/auth'

describe('mapApiResponseToUser', () => {
  const validSignInResponse: ApiSignInResponse = {
    status: 200,
    success: true,
    Token: 'abc123token',
    User: {
      uid: 'user-uid-1',
      email: 'test@example.com',
      phone: null,
      provider: 'password',
      createdAt: { _seconds: 1700000000, _nanoseconds: 0 },
    },
  }

  const validSignUpResponse: ApiSignUpResponse = {
    status: 201,
    success: true,
    Token: 'signupToken456',
    User: {
      uid: 'user-uid-2',
      email: 'newuser@example.com',
      provider: 'password',
      createdAt: '2024-01-01T00:00:00Z',
    },
  }

  describe('with a sign-in response', () => {
    it('extracts the token from the Token field', () => {
      const result = mapApiResponseToUser(validSignInResponse)
      expect(result.token).toBe('abc123token')
    })

    it('maps uid to userId', () => {
      const result = mapApiResponseToUser(validSignInResponse)
      expect(result.user.userId).toBe('user-uid-1')
    })

    it('maps email to email and userName', () => {
      const result = mapApiResponseToUser(validSignInResponse)
      expect(result.user.email).toBe('test@example.com')
      expect(result.user.userName).toBe('test@example.com')
    })

    it('sets default authority to [USER]', () => {
      const result = mapApiResponseToUser(validSignInResponse)
      expect(result.user.authority).toEqual(['USER'])
    })

    it('sets avatar to empty string by default', () => {
      const result = mapApiResponseToUser(validSignInResponse)
      expect(result.user.avatar).toBe('')
    })
  })

  describe('with a sign-up response', () => {
    it('extracts the token from the Token field', () => {
      const result = mapApiResponseToUser(validSignUpResponse)
      expect(result.token).toBe('signupToken456')
    })

    it('maps uid to userId', () => {
      const result = mapApiResponseToUser(validSignUpResponse)
      expect(result.user.userId).toBe('user-uid-2')
    })

    it('maps email correctly', () => {
      const result = mapApiResponseToUser(validSignUpResponse)
      expect(result.user.email).toBe('newuser@example.com')
    })

    it('returns authority as [USER]', () => {
      const result = mapApiResponseToUser(validSignUpResponse)
      expect(result.user.authority).toEqual(['USER'])
    })
  })

  describe('when User object is missing', () => {
    it('returns a fallback user with empty strings', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const badResponse = { ...validSignInResponse, User: undefined as any }
      const result = mapApiResponseToUser(badResponse)
      expect(result.user.userId).toBe('')
      expect(result.user.userName).toBe('Unknown')
      expect(result.user.email).toBe('')
      expect(result.user.authority).toEqual(['USER'])
      consoleSpy.mockRestore()
    })

    it('logs an error when User object is missing', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const badResponse = { ...validSignInResponse, User: undefined as any }
      mapApiResponseToUser(badResponse)
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('API Response missing User object'),
        expect.anything(),
      )
      consoleSpy.mockRestore()
    })
  })

  describe('when email is null (phone-only user)', () => {
    it('falls back to phone if email is null', () => {
      const phoneUser: ApiSignInResponse = {
        ...validSignInResponse,
        User: {
          ...validSignInResponse.User,
          email: null,
          phone: '+1234567890',
        },
      }
      const result = mapApiResponseToUser(phoneUser)
      expect(result.user.email).toBe('')
      // userName falls back to phone when email is null
      expect(result.user.userName).toBe('+1234567890')
    })

    it('uses "User" as fallback userName when both email and phone are absent', () => {
      const noEmailNoPhone: ApiSignInResponse = {
        ...validSignInResponse,
        User: {
          ...validSignInResponse.User,
          email: null,
          phone: null,
        },
      }
      const result = mapApiResponseToUser(noEmailNoPhone)
      expect(result.user.userName).toBe('User')
    })
  })
})
