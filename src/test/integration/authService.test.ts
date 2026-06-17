import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

// Mock js-cookie (needed by cookiesStorage used in the store)
vi.mock('js-cookie', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}))

// We import AxiosBase and mock at the adapter level
import AxiosBase from '@/services/axios/AxiosBase'
import { apiSignIn, apiSignUp, apiSignOut } from '@/services/AuthService'
import endpointConfig from '@/configs/endpoint.config'
import type { ApiSignInResponse, ApiSignUpResponse } from '@/@types/auth'

const mock = new MockAdapter(AxiosBase)

beforeEach(() => {
  mock.reset()
})

afterEach(() => {
  mock.reset()
})

const mockSignInResponse: ApiSignInResponse = {
  status: 200,
  success: true,
  Token: 'test-jwt-token',
  User: {
    uid: 'firebase-uid-001',
    email: 'user@example.com',
    phone: null,
    provider: 'password',
    createdAt: { _seconds: 1700000000, _nanoseconds: 0 },
  },
}

const mockSignUpResponse: ApiSignUpResponse = {
  status: 201,
  success: true,
  Token: 'signup-jwt-token',
  User: {
    uid: 'firebase-uid-002',
    email: 'newuser@example.com',
    provider: 'password',
    createdAt: '2024-01-01T00:00:00Z',
  },
}

describe('apiSignIn', () => {
  it('calls the signIn endpoint with correct payload structure', async () => {
    mock.onPost(endpointConfig.signIn).reply(200, mockSignInResponse)

    await apiSignIn({ email: 'user@example.com', password: 'secret' })

    expect(mock.history.post).toHaveLength(1)
    const requestBody = JSON.parse(mock.history.post[0].data)
    expect(requestBody.login_type_id).toBe(4)
    expect(requestBody.payload.email).toBe('user@example.com')
    expect(requestBody.payload.password).toBe('secret')
  })

  it('returns mapped user and token on success', async () => {
    mock.onPost(endpointConfig.signIn).reply(200, mockSignInResponse)

    const result = await apiSignIn({ email: 'user@example.com', password: 'secret' })

    expect(result.token).toBe('test-jwt-token')
    expect(result.user.userId).toBe('firebase-uid-001')
    expect(result.user.email).toBe('user@example.com')
    expect(result.user.authority).toEqual(['USER'])
  })

  it('throws on 401 Unauthorized', async () => {
    mock.onPost(endpointConfig.signIn).reply(401, { message: 'Invalid credentials' })

    await expect(
      apiSignIn({ email: 'wrong@example.com', password: 'wrongpass' }),
    ).rejects.toThrow()
  })

  it('throws on 500 server error', async () => {
    mock.onPost(endpointConfig.signIn).reply(500, { message: 'Internal Server Error' })

    await expect(
      apiSignIn({ email: 'user@example.com', password: 'password' }),
    ).rejects.toThrow()
  })

  it('throws on network error', async () => {
    mock.onPost(endpointConfig.signIn).networkError()

    await expect(
      apiSignIn({ email: 'user@example.com', password: 'password' }),
    ).rejects.toThrow()
  })
})

describe('apiSignUp', () => {
  it('calls the signUp endpoint with correct payload', async () => {
    mock.onPost(endpointConfig.signUp).reply(201, mockSignUpResponse)

    await apiSignUp({ userName: 'newuser', email: 'newuser@example.com', password: 'newpass' })

    expect(mock.history.post).toHaveLength(1)
    const requestBody = JSON.parse(mock.history.post[0].data)
    expect(requestBody.username).toBe('newuser')
    expect(requestBody.email).toBe('newuser@example.com')
    expect(requestBody.password).toBe('newpass')
  })

  it('returns mapped user and token on successful sign-up', async () => {
    mock.onPost(endpointConfig.signUp).reply(201, mockSignUpResponse)

    const result = await apiSignUp({ userName: 'newuser', email: 'newuser@example.com', password: 'newpass' })

    expect(result.token).toBe('signup-jwt-token')
    expect(result.user.userId).toBe('firebase-uid-002')
    expect(result.user.email).toBe('newuser@example.com')
  })

  it('throws on 400 validation error', async () => {
    mock.onPost(endpointConfig.signUp).reply(400, { message: 'Email already in use' })

    await expect(
      apiSignUp({ userName: 'newuser', email: 'existing@example.com', password: 'pass' }),
    ).rejects.toThrow()
  })
})

describe('apiSignOut', () => {
  it('calls the signOut endpoint', async () => {
    mock.onPost(endpointConfig.signOut).reply(200, { success: true })

    await apiSignOut()

    expect(mock.history.post).toHaveLength(1)
    expect(mock.history.post[0].url).toBe(endpointConfig.signOut)
  })

  it('uses POST method for sign-out', async () => {
    mock.onPost(endpointConfig.signOut).reply(200, {})

    await apiSignOut()

    expect(mock.history.post[0].method).toBe('post')
  })

  it('throws if server returns an error on sign-out', async () => {
    mock.onPost(endpointConfig.signOut).reply(500, { message: 'Server error' })

    await expect(apiSignOut()).rejects.toThrow()
  })
})
