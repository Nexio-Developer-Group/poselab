import { Alert } from '@/components/ui/alert'
import SignInForm from './components/SignInForm'
import OauthSignIn from './components/OauthSignIn'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useThemeStore } from '@/store/themeStore'
import { Link } from 'react-router-dom'

type SignInProps = {
    signUpUrl?: string
    forgetPasswordUrl?: string
    disableSubmit?: boolean
}

export const SignInBase = ({
    signUpUrl = '/sign-up',
    forgetPasswordUrl = '/forgot-password',
    disableSubmit,
}: SignInProps) => {
    const [message, setMessage] = useTimeOutMessage()

    return (
        <div className="animate-in fade-in duration-1000">
            <div className="mb-10">
                <div className="flex items-center gap-2 text-primary mb-3 font-bold tracking-[0.3em] text-[10px] uppercase">
                    <div className="w-5 h-[2px] bg-primary rounded-full transition-all duration-500 hover:w-10" />
                    Access Terminal
                </div>
                <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Welcome Back</h2>
                <p className="text-gray-100 font-medium text-sm">
                    Enter your credentials to access the 3D Studio.
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
            <SignInForm
                disableSubmit={disableSubmit}
                setMessage={setMessage}
                passwordHint={
                    <div className="mt-3 flex justify-end">
                        <ActionLink
                            to={forgetPasswordUrl}
                            className="text-[10px] font-bold text-gray-300/60 uppercase tracking-widest hover:text-primary transition-colors"
                            themeColor={false}
                        >
                            Forgot Password
                        </ActionLink>
                    </div>
                }
            />
            <div className="mt-8">
                <div className="relative flex items-center justify-center mb-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/20" />
                    </div>
                    <span className="relative px-4 bg-gray-950 text-[10px] font-black text-gray-100 uppercase tracking-[0.4em]">
                        Rapid Access
                    </span>
                </div>
                <OauthSignIn
                    disableSubmit={disableSubmit}
                    setMessage={setMessage}
                />
            </div>
            <div className="mt-8 pt-4 border-t border-white/20 text-center">
                <span className="text-gray-100 text-xs font-semibold uppercase tracking-widest">
                    New to the studio?
                </span>
                <Link
                    to={signUpUrl}
                    className="ml-2 text-xs font-black text-primary hover:text-white transition-all uppercase tracking-widest underline decoration-primary/20 underline-offset-4 decoration-2"
                >
                    Create Account
                </Link>
            </div>
        </div>
    )
}

const SignIn = () => {
    return <SignInBase />
}

export default SignIn
