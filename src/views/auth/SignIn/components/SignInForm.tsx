import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import PasswordInput from '@/components/shared/PasswordInput'
import classNames from '@/utils/classNames'
import { cn } from "@/lib/utils"
import { useAuth } from '@/auth'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'
import type { ReactNode } from 'react'
import { PiPlaceholder } from 'react-icons/pi'
import { sendPhoneOTP, verifyPhoneOTP, getIdToken } from '@/services/FirebaseAuthService'
import { apiPhoneSignIn } from '@/services/AuthService'
import type { ConfirmationResult } from 'firebase/auth'

interface SignInFormProps extends CommonProps {
    disableSubmit?: boolean
    passwordHint?: string | ReactNode
    setMessage?: (message: string) => void
}

type SignInFormSchema = {
    email: string
    password: string
}

const validationSchema: ZodType<SignInFormSchema> = z.object({
    email: z
        .string({ required_error: 'Please enter your email' })
        .min(1, { message: 'Please enter your email' }),
    password: z
        .string({ required_error: 'Please enter your password' })
        .min(1, { message: 'Please enter your password' }),
})

const SignInForm = (props: SignInFormProps) => {
    const [isSubmitting, setSubmitting] = useState<boolean>(false)
    const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [otp, setOtp] = useState('')
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
    const [phoneError, setPhoneError] = useState('')

    const { disableSubmit = false, className, setMessage, passwordHint } = props

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<SignInFormSchema>({
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: zodResolver(validationSchema),
    })

    const { signIn, oAuthSignIn } = useAuth()

    const onSignIn = async (values: SignInFormSchema) => {
        const { email, password } = values

        if (!disableSubmit) {
            setSubmitting(true)

            const result = await signIn({ email, password })

            if (result?.status === 'failed') {
                setMessage?.('invalid credentials')
            }
        }

        setSubmitting(false)
    }

    const onSendOtp = async () => {
        if (!phoneNumber) {
            setPhoneError('Please enter a phone number')
            return
        }
        setPhoneError('')
        setSubmitting(true)
        try {
            // Append +91 if not present
            const formattedPhoneNumber = phoneNumber.startsWith('+91')
                ? phoneNumber
                : `+91${phoneNumber}`

            const result = await sendPhoneOTP(formattedPhoneNumber)
            setConfirmationResult(result)
            setMessage?.('OTP Sent!')
        } catch (error: any) {
            console.error('Error sending OTP:', error)
            setPhoneError(error.message || 'Failed to send OTP')
        } finally {
            setSubmitting(false)
        }
    }

    const onVerifyOtp = async () => {
        if (!otp || !confirmationResult) return
        setSubmitting(true)
        try {
            const userCredential = await verifyPhoneOTP(confirmationResult, otp)
            const idToken = await getIdToken(userCredential)

            // Call API with ID Token
            const response = await apiPhoneSignIn({ id_token: idToken })

            if (response) {
                const { token, user } = response
                oAuthSignIn(({ onSignIn, redirect }) => {
                    onSignIn({ accessToken: token }, user)
                    redirect()
                })
            }
        } catch (error: any) {
            console.error('Error verifying OTP:', error)
            setPhoneError(error.message || 'Failed to verify OTP')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className={cn(className, "animate-in fade-in slide-in-from-bottom-4 duration-700")}>
            {/* Custom Premium Tabs */}
            <div className="flex p-1.5 bg-white/5 border border-white/5 rounded-2xl mb-8">
                <button
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-xl rounded-r-none",
                        authMethod === 'email'
                            ? "bg-primary text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                            : "text-gray-100 hover:text-gray-100"
                    )}
                    onClick={() => setAuthMethod('email')}
                >
                    Email Access
                </button>
                <button
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-xl rounded-l-none",
                        authMethod === 'phone'
                            ? "bg-primary text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                            : "text-gray-100 hover:text-gray-100"
                    )}
                    onClick={() => setAuthMethod('phone')}
                >
                    Secure SMS
                </button>
            </div>

            <div className="space-y-6">
                {authMethod === 'email' ? (
                    <Form onSubmit={handleSubmit(onSignIn)}>
                        <FormItem
                            label={<span className="text-gray-100 text-[10px] font-bold tracking-widest uppercase">Email Address</span>}
                            invalid={Boolean(errors.email)}
                            errorMessage={errors.email?.message}
                        >
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="email"
                                        className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-primary/50 text-gray-100 placeholder:text-gray-300/60 transition-all font-medium pr-10"
                                        placeholder="commander@poselab.gg"
                                        autoComplete="off"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label={<span className="text-gray-100 text-[10px] font-bold tracking-widest uppercase">Secret Password</span>}
                            invalid={Boolean(errors.password)}
                            errorMessage={errors.password?.message}
                            className={classNames(
                                passwordHint ? 'mb-0' : '',
                            )}
                        >
                            <Controller
                                name="password"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <PasswordInput
                                        placeholder="••••••••"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        <div className="flex justify-start">
                            {passwordHint}
                        </div>
                        <Button
                            variant="default"
                            type="submit"
                            className="w-full h-12 bg-primary hover:bg-primary text-black font-bold rounded-xl shadow-xl shadow-primary/10 transition-all hover:scale-[1.02] active:scale-95 duration-200 mt-4"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'AUTHORIZING...' : 'SIGN IN TO STUDIO'}
                        </Button>
                    </Form>
                ) : (
                    <div className="space-y-6">
                        {!confirmationResult ? (
                            <div className="flex flex-col gap-6">
                                <FormItem
                                    label={<span className="text-gray-100 text-[10px] font-bold tracking-widest uppercase">Phone </span>}
                                    invalid={!!phoneError}
                                    errorMessage={phoneError}
                                >
                                    <Input
                                        placeholder="10-digit phone number"
                                        className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-primary/50 text-gray-100 placeholder:text-gray-300/60 transition-all font-medium"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                                </FormItem>
                                <div id="recaptcha-container" className="hidden"></div>
                                <Button
                                    className="w-full h-12 bg-primary hover:bg-primary text-black font-bold rounded-xl shadow-xl shadow-primary/10 transition-all hover:scale-[1.02] active:scale-95 duration-200"
                                    onClick={onSendOtp}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'TRANSMITTING OTP...' : 'SEND SECURE OTP'}
                                </Button>
                                <p className="text-[10px] text-gray-200 text-center uppercase tracking-wider font-medium leading-relaxed">
                                    A 6-digit verification code will be sent <br /> to your device via SMS.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6">
                                <FormItem label={<span className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">Verification Code</span>}>
                                    <Input
                                        className="h-14 text-center text-3xl font-black tracking-[0.5em] bg-white/5 border-white/10 rounded-xl focus:border-primary/50 text-primary placeholder:text-gray-800 transition-all"
                                        placeholder="000000"
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </FormItem>
                                <Button
                                    className="w-full h-12 bg-primary hover:bg-primary text-black font-bold rounded-xl shadow-xl shadow-primary/10 transition-all hover:scale-[1.02] active:scale-95 duration-200"
                                    onClick={onVerifyOtp}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'VERIFYING...' : 'COMPLETE AUTHORIZATION'}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full text-xs text-gray-500 hover:text-white hover:bg-white/5 h-10 rounded-xl font-bold tracking-widest uppercase"
                                    onClick={() => setConfirmationResult(null)}
                                >
                                    Change Phone
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SignInForm
