import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/auth'
import {
    apiGoogleOauthSignIn,
    apiGithubOauthSignIn,
    apiSendPhoneOTP,
    apiVerifyPhoneOTP
} from '@/services/OAuthServices'
import type { ConfirmationResult } from 'firebase/auth'

type OauthSignInProps = {
    setMessage?: (message: string) => void
    disableSubmit?: boolean
}

const OauthSignIn = ({ setMessage, disableSubmit }: OauthSignInProps) => {
    const { oAuthSignIn } = useAuth()

    const handleGoogleSignIn = async () => {
        if (!disableSubmit) {
            oAuthSignIn(async ({ redirect, onSignIn }) => {
                try {
                    const resp = await apiGoogleOauthSignIn()
                    if (resp) {
                        const { token, user } = resp
                        onSignIn({ accessToken: token }, user)
                        redirect()
                    }
                } catch (error) {
                    setMessage?.((error as string)?.toString() || '')
                }
            })
        }
    }

    const handleGithubSignIn = async () => {
        if (!disableSubmit) {
            oAuthSignIn(async ({ redirect, onSignIn }) => {
                try {
                    const resp = await apiGithubOauthSignIn()
                    if (resp) {
                        const { token, user } = resp
                        onSignIn({ accessToken: token }, user)
                        redirect()
                    }
                } catch (error) {
                    setMessage?.((error as string)?.toString() || '')
                }
            })
        }
    }

    return (
        <div className="flex gap-4">
            <Button
                className="w-full h-12 bg-white/5 border border-white/10 text-gray-100 hover:bg-white/10 hover:border-white/20 shadow-xl transition-all duration-300 rounded-xl px-2 flex items-center justify-center gap-3 group"
                type="button"
                onClick={handleGoogleSignIn}
                disabled={disableSubmit}
            >
                <div className="bg-white p-1 rounded-full transition-transform group-hover:scale-110 duration-300">
                    <img
                        className="h-5 w-5"
                        src="/img/others/google.png"
                        alt="Google"
                    />
                </div>
                <span className="font-bold tracking-tight">Google</span>
            </Button>

            <Button
                className="w-full h-12 bg-white/5 border border-white/10 text-gray-100 hover:bg-white/10 hover:border-white/20 shadow-xl transition-all duration-300 rounded-xl px-2 flex items-center justify-center gap-3 group"
                type="button"
                onClick={handleGithubSignIn}
                disabled={disableSubmit}
            >
                <div className="bg-gray-900 p-1 rounded-full border border-white/10 transition-transform group-hover:scale-110 duration-300">
                    <img
                        className="h-5 w-5 invert"
                        src="/img/others/github.png"
                        alt="GitHub"
                    />
                </div>
                <span className="font-bold tracking-tight">GitHub</span>
            </Button>
        </div>
    )
}

export default OauthSignIn