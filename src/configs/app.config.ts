export type AppConfig = {
    appVersion?: string
    appUrl: string
    appName: string
    appDescription?: string
    apiBaseUrl: string
    apiPrefix: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
    locale: string
    accessTokenPersistStrategy: 'localStorage' | 'sessionStorage' | 'cookies'
    enableMock: boolean
}

const appConfig: AppConfig = {
    appVersion: '0.0.1',
    appUrl: import.meta.env.VITE_APP_URL || 'https://poselab.nexiotech.cloud',
    appName: 'PoseLab',
    appDescription: 'PoseLab – Minecraft Skin Posing & Render Tool',
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://poselab-backend.nexiotech.cloud',
    apiPrefix: '/api',
    authenticatedEntryPath: '/home',
    unAuthenticatedEntryPath: '/sign-in',
    locale: 'en',
    accessTokenPersistStrategy: 'cookies',
    enableMock: true,
}

export default appConfig
