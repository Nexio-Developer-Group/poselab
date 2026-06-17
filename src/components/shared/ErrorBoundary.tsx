import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
    children: ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, info)

        // Report to Sentry in production (dynamic import so it's safe if Sentry isn't installed)
        if (import.meta.env.PROD) {
            import('@sentry/react')
                .then(({ captureException }) => {
                    captureException(error, { extra: { componentStack: info.componentStack } })
                })
                .catch(() => {
                    // Sentry not installed — silently ignore
                })
        }
    }

    handleReload = () => {
        window.location.reload()
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-background p-4">
                    <div className="max-w-md w-full rounded-lg border border-border bg-card text-card-foreground shadow-sm p-8 text-center">
                        <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
                        <p className="text-muted-foreground mb-6">
                            An unexpected error occurred. Our team has been notified. You can try
                            reloading the page to recover.
                        </p>
                        <button
                            onClick={this.handleReload}
                            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                        >
                            Reload page
                        </button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
