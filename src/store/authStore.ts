import cookiesStorage from '@/utils/cookiesStorage'
import appConfig from '@/configs/app.config'
import { TOKEN_NAME_IN_STORAGE } from '@/constants/api.constant'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User } from '@/@types/auth'

type Session = {
    signedIn: boolean
}

type AuthState = {
    session: Session
    user: User
}

type AuthAction = {
    setSessionSignedIn: (payload: boolean) => void
    setUser: (payload: User) => void
}

const getPersistStorage = () => {
    if (appConfig.accessTokenPersistStrategy === 'localStorage') {
        return localStorage
    }

    if (appConfig.accessTokenPersistStrategy === 'sessionStorage') {
        return sessionStorage
    }

    return cookiesStorage
}

const initialState: AuthState = {
    session: {
        signedIn: false,
    },
    user: {
        avatar: '',
        userName: '',
        email: '',
        authority: [],
    },
}

export const useSessionUser = create<AuthState & AuthAction>()(
    persist(
        (set) => ({
            ...initialState,
            setSessionSignedIn: (payload) =>
                set((state) => ({
                    session: {
                        ...state.session,
                        signedIn: payload,
                    },
                })),
            setUser: (payload) =>
                set((state) => ({
                    user: {
                        ...state.user,
                        ...payload,
                    },
                })),
        }),
        { name: 'sessionUser', storage: createJSONStorage(() => localStorage) },
    ),
)

export const useToken = () => {
    const storage = getPersistStorage()

    const setToken = (token: string) => {
        if (token) {
            localStorage.setItem(TOKEN_NAME_IN_STORAGE, token)
            sessionStorage.setItem(TOKEN_NAME_IN_STORAGE, token)
            cookiesStorage.setItem(TOKEN_NAME_IN_STORAGE, token, 7)
        } else {
            localStorage.removeItem(TOKEN_NAME_IN_STORAGE)
            sessionStorage.removeItem(TOKEN_NAME_IN_STORAGE)
            cookiesStorage.removeItem(TOKEN_NAME_IN_STORAGE)
        }
    }

    return {
        setToken,
        token: storage.getItem(TOKEN_NAME_IN_STORAGE) ||
            localStorage.getItem(TOKEN_NAME_IN_STORAGE) ||
            sessionStorage.getItem(TOKEN_NAME_IN_STORAGE) ||
            (cookiesStorage.getItem(TOKEN_NAME_IN_STORAGE) as string),
    }
}
