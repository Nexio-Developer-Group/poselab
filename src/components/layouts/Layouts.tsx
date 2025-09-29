import { Suspense, useMemo } from 'react'
import Loading from '@/components/shared/Loading'
import type { CommonProps } from '@/@types/common'
import { useAuth } from '@/auth'
import { useThemeStore } from '@/store/themeStore'
import PostLoginLayout from './PostLoginLayout'
import PreLoginLayout from './PreLoginLayout'
import OpenLayout from './OpenLayout';
import openRoute from '@/configs/routes.config/openRoute';
import { useLocation, matchPath } from 'react-router-dom';

const Layout = ({ children }: CommonProps) => {
    const layoutType = useThemeStore((state) => state.layout.type)

    const { authenticated } = useAuth()
    const location = useLocation();


    const isOpenRoute = useMemo(() => {
        return openRoute.some(route => matchPath(route.path, location.pathname));
    }, [location.pathname]);


    if (isOpenRoute) {
        return (
            <Suspense fallback={<Loading loading={true} />}>
                <OpenLayout>{children}</OpenLayout>
            </Suspense>
        );
    }

    return (
        <Suspense
            fallback={
                <div className="flex flex-auto flex-col h-[100vh]">
                    <Loading loading={true} />
                </div>
            }
        >
            {authenticated ? (
                <PostLoginLayout layoutType={layoutType}>
                    {children}
                </PostLoginLayout>
            ) : (
                <PreLoginLayout>{children}</PreLoginLayout>
            )}
        </Suspense>
    )
}

export default Layout
