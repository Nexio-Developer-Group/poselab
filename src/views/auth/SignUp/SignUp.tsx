import Logo from '@/components/template/Logo'
import { Alert } from '@/components/ui/alert'
import SignUpForm from './components/SignUpForm'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useThemeStore } from '@/store/themeStore'
import { Link } from 'react-router-dom'

type SignUpProps = {
    disableSubmit?: boolean
    signInUrl?: string
}

export const SignUpBase = ({
    signInUrl = '/sign-in',
    disableSubmit,
}: SignUpProps) => {
    const [message, setMessage] = useTimeOutMessage()

    return (
        <div className="animate-in fade-in duration-1000">
            <div className="mb-10">
                <div className="flex items-center gap-2 text-primary mb-3 font-bold tracking-[0.3em] text-[10px] uppercase">
                    <div className="w-5 h-[2px] bg-primary rounded-full transition-all duration-500 hover:w-10" />
                    New Identity
                </div>
                <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Join the Studio</h2>
                <p className="text-gray-100 font-medium text-sm">
                    Begin your journey into high-fidelity 3D rendering.
                </p>
            </div>
            {message && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <span className="text-red-400 text-sm font-bold flex items-center gap-2 italic">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                        {message}
                    </span>
                </div>
            )}
            <SignUpForm disableSubmit={disableSubmit} setMessage={setMessage} />
            <div className="mt-12 pt-8 border-t border-white/5 text-center">
                <span className="text-gray-100 text-xs font-semibold uppercase tracking-widest">
                    Already a member?
                </span>
                <Link
                    to={signInUrl}
                    className="ml-2 text-xs font-black text-primary hover:text-white transition-all uppercase tracking-widest underline decoration-primary/20 underline-offset-4 decoration-2"
                >
                    Login
                </Link>
            </div>
        </div>
    )
}

const SignUp = () => {
    return <SignUpBase />
}

export default SignUp
