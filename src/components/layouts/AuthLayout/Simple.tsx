import { cloneElement } from 'react'
import type { ReactNode, ReactElement } from 'react'
import type { CommonProps } from '@/@types/common'
import heroImage from "@/assets/images/login.jpg";
import { Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import Logo from '@/components/template/Logo';

interface SimpleProps extends CommonProps {
    content?: ReactNode
}

const Simple = ({ children, content, ...rest }: SimpleProps) => {
    return (
        <div className="h-screen w-full bg-white dark:bg-gray-800">
            <div className="flex h-full w-full flex-col md:flex-row">

                <div className="absolute top-4 left-4 z-50 hidden sm:flex">
                    <Logo mode='dark' logoWidth={180} imgClass='drop-shadow-lg'></Logo>
                </div>

                <Link to="/" className="absolute top-4 right-4 z-50">
                    <span className='flex items-center gap-2 text-sm font-medium bg-black p-2 px-4 rounded-4xl text-white dark:text-white'>
                        <Home className="w-4 h-4 text-white" /> <span className='text-white'>Back to Home</span>
                    </span>
                </Link>

                {/* Left Side (Image) - hidden on mobile */}
                <div className="hidden md:block relative w-full md:w-[70%] h-full">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${heroImage})` }}
                    >
                    </div>
                </div>

                {/* Right Side (Content) - full width on mobile */}
                <div className="w-full md:w-[40%] h-full flex items-center justify-center p-4 sm:p-10">
                    <div className="w-full">
                        {content}
                        {children
                            ? cloneElement(children as ReactElement, {
                                ...rest,
                            })
                            : null}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Simple
