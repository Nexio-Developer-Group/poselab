// Initialize Sentry for production error tracking
// Install @sentry/react before using: npm install @sentry/react
// Then call initSentry() in main.tsx before React renders

export function initSentry() {
  if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    import('@sentry/react').then(({ init, browserTracingIntegration }) => {
      init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        integrations: [browserTracingIntegration()],
        tracesSampleRate: 0.1,
        environment: import.meta.env.MODE,
      })
    })
  }
}
