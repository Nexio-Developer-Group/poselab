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
        meta: {
            pageContainerType: 'gutterless'
        },
    },
    
]
