import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const openRoute: Routes = [
    {
        key: 'home',
        path: `/`,
        component: lazy(() => import('@/views/open/home')),
        authority: [],
    },
    {
        key: 'termsAndConditions',
        path: `/terms-of-service`,
        component: lazy(() => import('@/views/open/termsAndConditions')),
        authority: [],
    },
    {
        key: 'privacyPolicy',
        path: `/privacy-policy`,
        component: lazy(() => import('@/views/open/privacyPolicy')),
        authority: [],
    }
]

export default openRoute