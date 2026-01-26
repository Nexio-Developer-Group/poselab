import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'
import openRoute from './openRoute'

export const publicRoutes: Routes = [...authRoute]
export const openRoutes: Routes = [...openRoute]

export const protectedRoutes: Routes = [
    {
        key: 'home',
        path: '/home',
        component: lazy(() => import('@/views/Home')),
        authority: [],
    },
    {
        key: 'creatorSpace',
        path: '/creator-space',
        component: lazy(() => import('@/views/users/creatorSpace')),
        authority: [],
    },
    {
        key: 'poseLab',
        path: '/pose-lab',
        component: lazy(() => import('@/views/users/poseLab')),
        authority: [],
        meta: {
            pageContainerType: 'gutterless'
        },
    },
    {
        key: 'ThreeDViewer',
        path: '/3d-viewer',
        component: lazy(() => import('@/views/users/threeDViewer')),
        authority: [],
    },
    {
        key: 'myCreations',
        path: '/my-creations',
        component: lazy(() => import('@/views/users/myCreations/index')),
        authority: [],
    },
    {
        key: 'profile',
        path: '/profile',
        component: lazy(() => import('@/views/users/account/profile')),
        authority: [],
    },
    {
        key: 'profileSettings',
        path: '/profile/settings',
        component: lazy(() => import('@/views/users/account/settings')),
        authority: [],
    },
    {
        key: 'creatorApplication',
        path: '/profile/creator-application',
        component: lazy(() => import('@/views/users/account/creatorApplication')),
        authority: [],
    },
    {
        key: 'helpDesk',
        path: '/help-desk',
        component: lazy(() => import('@/views/users/helpDesk')),
        authority: [],
    },
    {
        key: 'termsOfService',
        path: '/terms-of-service',
        component: lazy(() => import('@/views/users/termsOfService')),
        authority: [],
    },
    {
        key: 'privacyPolicy',
        path: '/privacy-policy',
        component: lazy(() => import('@/views/users/privacyPolicy')),
        authority: [],
    },
]

