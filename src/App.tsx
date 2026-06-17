import { BrowserRouter } from 'react-router-dom'
import Theme from '@/components/template/Theme'
import Layout from '@/components/layouts'
import { AuthProvider } from '@/auth'
import Views from '@/views'
import ErrorBoundary from '@/components/shared/ErrorBoundary'
import appConfig from './configs/app.config'
import './locales'
import 'animate.css';

if (appConfig.enableMock) {
    import('./mock')
}

function App() {
    return (
        <ErrorBoundary>
            <Theme>
                <BrowserRouter>
                    <AuthProvider>
                        <Layout>
                            <Views />
                        </Layout>
                    </AuthProvider>
                </BrowserRouter>
            </Theme>
        </ErrorBoundary>
    )
}

export default App
