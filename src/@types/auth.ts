export type SignInCredential = {
    email: string
    password: string
}

export type SignInResponse = {
    token: string
    user: User
}

export type ApiSignInResponse = {
    status: number
    success: boolean
    Token: string
    User: {
        uid: string
        phone: string | null
        email: string | null
        provider: string
        createdAt: {
            _seconds: number
            _nanoseconds: number
        }
    }
}

export type ApiSignUpResponse = {
    status: number
    success: boolean
    Token: string
    User: {
        uid: string
        email: string
        provider: string
        createdAt: string
    }
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    userName: string
    email: string
    password: string
}

export type OAuthResponse = SignInResponse

export type ForgotPassword = {
    email: string
}

export type ResetPassword = {
    password: string
}

export type AuthRequestStatus = 'success' | 'failed' | ''

export type AuthResult = Promise<{
    status: AuthRequestStatus
    message: string
}>

export type User = {
    userId?: string | null
    avatar?: string | null
    userName?: string | null
    email?: string | null
    authority?: string[]
}

export type Token = {
    accessToken: string
    refereshToken?: string
}

export type OauthSignInCallbackPayload = {
    onSignIn: (tokens: Token, user?: User) => void
    redirect: () => void
}
