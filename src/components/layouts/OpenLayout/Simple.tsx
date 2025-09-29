import { cloneElement } from 'react'
import type { ReactNode, ReactElement } from 'react'
import type { CommonProps } from '@/@types/common'
import Logo from '@/components/template/Logo'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

interface SimpleProps extends CommonProps {
    content?: ReactNode
}

const Simple = ({ children, content, ...rest }: SimpleProps) => {


    return (
        <div className="min-h-[1024px]">
            <header className="bg-white z-50 sticky top-0 border-b border-gray-200 shadow-xs">
                <div className="mx-auto px-10 py-4 flex items-center justify-between">
                    <Link to="/home">
                        <Logo className="hidden lg:block" imgClass="max-h-10" />
                    </Link>
                    <div className='flex items-center gap-10'>
                        <Link to="/about"> <p className='text-primary-text cusror-pointer font-normal text-base'>About</p></Link>
                        <Link to="/join-us"> <p className='text-primary-text cusror-pointer font-normal text-base'>Join us</p></Link>
                        <Link to="/services"> <p className='text-primary-text cusror-pointer font-normal text-base'>Services</p></Link>
                        <div className='flex items-center gap-6'>

                        <Link to="/home">
                        <Button
                            variant="default"
                        >SignUp / Login</Button>
                        </Link>
                        </div>

                    </div>
                </div>
            </header>
            <main>
                <div>

                {content}
                {
                    children
                        ? cloneElement(children as ReactElement, {
                            ...rest,
                        })
                        : null
                }
                </div>

            </main>
        </div>
    )
}

export default Simple