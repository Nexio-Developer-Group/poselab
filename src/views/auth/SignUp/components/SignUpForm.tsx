import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import { useAuth } from '@/auth'
import { cn } from "@/lib/utils"
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'

interface SignUpFormProps extends CommonProps {
    disableSubmit?: boolean
    setMessage?: (message: string) => void
}

type SignUpFormSchema = {
    userName: string
    password: string
    email: string
    confirmPassword: string
}

const validationSchema: ZodType<SignUpFormSchema> = z
    .object({
        email: z.string({ required_error: 'Please enter your email' }),
        userName: z.string({ required_error: 'Please enter your name' }),
        password: z.string({ required_error: 'Password Required' }),
        confirmPassword: z.string({
            required_error: 'Confirm Password Required',
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Password not match',
        path: ['confirmPassword'],
    })

const SignUpForm = (props: SignUpFormProps) => {
    const { disableSubmit = false, className, setMessage } = props

    const [isSubmitting, setSubmitting] = useState<boolean>(false)

    const { signUp } = useAuth()

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<SignUpFormSchema>({
        resolver: zodResolver(validationSchema),
    })

    const onSignUp = async (values: SignUpFormSchema) => {
        const { userName, password, email } = values

        if (!disableSubmit) {
            setSubmitting(true)
            const result = await signUp({ userName, password, email })

            if (result?.status === 'failed') {
                setMessage?.(result.message)
            }

            setSubmitting(false)
        }
    }

    return (
        <div className={cn(className, "animate-in fade-in slide-in-from-bottom-4 duration-700")}>
            <Form onSubmit={handleSubmit(onSignUp)}>
                <div className="space-y-4">
                    <FormItem
                        label={<span className="text-gray-100 text-[10px] font-bold tracking-widest uppercase">Alias Name</span>}
                        invalid={Boolean(errors.userName)}
                        errorMessage={errors.userName?.message}
                    >
                        <Controller
                            name="userName"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-primary/50 text-gray-100 placeholder:text-gray-300/60 transition-all font-medium"
                                    placeholder="Steve / Alex"
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label={<span className="text-gray-100 text-[10px] font-bold tracking-widest uppercase">Digital Address</span>}
                        invalid={Boolean(errors.email)}
                        errorMessage={errors.email?.message}
                    >
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-primary/50 text-gray-100 placeholder:text-gray-300/60 transition-all font-medium"
                                    type="email"
                                    placeholder="commander@poselab.gg"
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormItem
                            label={<span className="text-gray-100 text-[10px] font-bold tracking-widest uppercase">Password</span>}
                            invalid={Boolean(errors.password)}
                            errorMessage={errors.password?.message}
                        >
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-primary/50 text-gray-100 placeholder:text-gray-300/60 transition-all font-medium"
                                        type="password"
                                        autoComplete="off"
                                        placeholder="••••••••"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label={<span className="text-gray-100 text-[10px] font-bold tracking-widest uppercase">Confirm</span>}
                            invalid={Boolean(errors.confirmPassword)}
                            errorMessage={errors.confirmPassword?.message}
                        >
                            <Controller
                                name="confirmPassword"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-primary/50 text-gray-100 placeholder:text-gray-300/60 transition-all font-medium"
                                        type="password"
                                        autoComplete="off"
                                        placeholder="••••••••"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>
                </div>
                <Button
                    variant="default"
                    type="submit"
                    className="w-full h-12 bg-primary hover:bg-primary text-black font-bold rounded-xl shadow-xl shadow-primary/10 transition-all hover:scale-[1.02] active:scale-95 duration-200 mt-8"
                >
                    {isSubmitting ? 'GENERATING IDENTITY...' : 'CREATE STUDIO ACCOUNT'}
                </Button>
            </Form>
        </div>
    )
}

export default SignUpForm
