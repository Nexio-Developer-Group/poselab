import { describe, it, expect } from 'vitest'
import appConfig from '@/configs/app.config'
import type { AppConfig } from '@/configs/app.config'

describe('appConfig', () => {
  it('has all required fields', () => {
    expect(appConfig).toHaveProperty('appUrl')
    expect(appConfig).toHaveProperty('appName')
    expect(appConfig).toHaveProperty('apiBaseUrl')
    expect(appConfig).toHaveProperty('apiPrefix')
    expect(appConfig).toHaveProperty('authenticatedEntryPath')
    expect(appConfig).toHaveProperty('unAuthenticatedEntryPath')
    expect(appConfig).toHaveProperty('locale')
    expect(appConfig).toHaveProperty('accessTokenPersistStrategy')
    expect(appConfig).toHaveProperty('enableMock')
  })

  it('has apiPrefix set to /api', () => {
    expect(appConfig.apiPrefix).toBe('/api')
  })

  it('has accessTokenPersistStrategy set to cookies', () => {
    expect(appConfig.accessTokenPersistStrategy).toBe('cookies')
  })

  it('has a non-empty appName', () => {
    expect(typeof appConfig.appName).toBe('string')
    expect(appConfig.appName.length).toBeGreaterThan(0)
  })

  it('has a valid authenticatedEntryPath starting with /', () => {
    expect(appConfig.authenticatedEntryPath).toMatch(/^\//)
  })

  it('has a valid unAuthenticatedEntryPath starting with /', () => {
    expect(appConfig.unAuthenticatedEntryPath).toMatch(/^\//)
  })

  it('has a locale string', () => {
    expect(typeof appConfig.locale).toBe('string')
    expect(appConfig.locale.length).toBeGreaterThan(0)
  })

  it('accepts valid AppConfig shape', () => {
    const validConfig: AppConfig = {
      appUrl: 'https://example.com',
      appName: 'TestApp',
      apiBaseUrl: 'https://api.example.com',
      apiPrefix: '/api/v1',
      authenticatedEntryPath: '/dashboard',
      unAuthenticatedEntryPath: '/login',
      locale: 'en',
      accessTokenPersistStrategy: 'localStorage',
      enableMock: false,
    }
    // TypeScript check — this compiles only if the shape is correct
    expect(validConfig.appName).toBe('TestApp')
    expect(validConfig.accessTokenPersistStrategy).toBe('localStorage')
  })

  it('accessTokenPersistStrategy is one of the valid union types', () => {
    const validStrategies: AppConfig['accessTokenPersistStrategy'][] = [
      'localStorage',
      'sessionStorage',
      'cookies',
    ]
    expect(validStrategies).toContain(appConfig.accessTokenPersistStrategy)
  })
})
