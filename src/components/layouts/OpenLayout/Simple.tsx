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
        <div className="min-h-[1024px] dark:bg-gray-950">
            <header className="bg-white dark:bg-gray-950 z-50 sticky top-0 border-b border-gray-200 dark:border-white/10 shadow-xs">
                <div className="mx-auto px-10 py-4 flex items-center justify-between">
                    <Link to="/home">
                        <Logo mode="dark" className="hidden lg:block" imgClass="max-h-10" />
                    </Link>
                    <div className='flex items-center gap-10'>
                        <Link to="/about"> <p className='text-primary-text dark:text-gray-100 cusror-pointer font-normal text-base hover:text-primary dark:hover:text-white transition-colors'>About</p></Link>
                        <Link to="/join-us"> <p className='text-primary-text dark:text-gray-100 cusror-pointer font-normal text-base hover:text-primary dark:hover:text-white transition-colors'>Join us</p></Link>
                        <Link to="/services"> <p className='text-primary-text dark:text-gray-100 cusror-pointer font-normal text-base hover:text-primary dark:hover:text-white transition-colors'>Services</p></Link>
                        <div className='flex items-center gap-6'>

                            <Link to="/sign-in">
                                <Button
                                    variant="default"
                                    className="bg-primary hover:bg-primary-deep text-black border-none shadow-lg shadow-primary/20"
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
            <footer className="py-6 border-t border-white/5 bg-gray-950">
                <div className="mx-auto px-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                        <div className="text-gray-100 text-sm font-medium">
                            © {new Date().getFullYear()} Pose Lab. All rights reserved.
                        </div>
                        <div className="flex items-center gap-6">
                            <Link to="/privacy-policy" className="text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
                                Privacy Policy
                            </Link>
                            <Link to="/terms-of-service" className="text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-gray-100">
                        <span className="opacity-60 font-medium">Created with</span>
                        <span className="text-red-500 animate-pulse text-lg">❤️</span>
                        <span className="opacity-60 font-medium">by</span>
                        <a
                            href="https://nexiotech.cloud/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-white transition-all duration-300 underline decoration-primary/30 underline-offset-4 hover:decoration-white"
                        >
                            Nexio Technologies
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Simple