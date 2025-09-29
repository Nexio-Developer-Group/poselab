import { useMemo, lazy, JSX } from 'react'
import type { CommonProps } from '@/@types/common'
import type { LazyExoticComponent } from 'react'

type LayoutType = 'simple'

type Layouts = Record<
    LayoutType,
    LazyExoticComponent<<T extends CommonProps>(props: T) => JSX.Element>
>

const currentLayoutType: LayoutType = 'simple'

const layouts: Layouts = {
    simple: lazy(() => import('./Simple')),
}


const OpenLayout = ({ children }: CommonProps) => {
    const Layout = useMemo(() => {
        return layouts[currentLayoutType]
    }, [])

    return <Layout>{children}</Layout>
}

export default OpenLayout