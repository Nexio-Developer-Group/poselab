import { cloneElement, useState } from 'react'
import type { ReactNode, ReactElement } from 'react'
import type { CommonProps } from '@/@types/common'
import Logo from '@/components/template/Logo'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Menu, X } from 'lucide-react'

interface SimpleProps extends CommonProps {
    content?: ReactNode
}

const Simple = ({ children, content, ...rest }: SimpleProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const navLinks = [
        { label: 'About', path: '/about' },
        { label: 'Join us', path: '/join-us' },
        { label: 'Services', path: '/services' },
    ]

    return (
        <div className="min-h-screen flex flex-col dark:bg-gray-950">
            <header className="z-[100] sticky top-0 border-b border-gray-200 dark:border-white/10 shadow-sm backdrop-blur-md bg-white/80 dark:bg-gray-950/80">
                <div className="mx-auto px-4 sm:px-10 py-4 flex items-center justify-between">
                    <Link to="/home" className="flex items-center">
                        <Logo mode="dark" className="block" imgClass="max-h-8 sm:max-h-10" />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8 lg:gap-10">
                        {navLinks.map((link) => (
                            <Link key={link.path} to={link.path}>
                                <p className="text-gray-600 dark:text-gray-100 font-medium text-sm lg:text-base hover:text-primary dark:hover:text-white transition-colors">
                                    {link.label}
                                </p>
                            </Link>
                        ))}
                        <Link to="/sign-in">
                            <Button
                                variant="default"
                                className="bg-primary hover:bg-primary-deep text-black border-none shadow-lg shadow-primary/20"
                            >
                                SignUp / Login
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-gray-600 dark:text-gray-100"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation Drawer */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-white/10 p-6 flex flex-col gap-6 shadow-xl animate-in slide-in-from-top duration-300">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <p className="text-gray-600 dark:text-gray-100 font-bold text-lg hover:text-primary">
                                    {link.label}
                                </p>
                            </Link>
                        ))}
                        <Link to="/sign-in" onClick={() => setIsMenuOpen(false)}>
                            <Button
                                variant="default"
                                className="w-full bg-primary hover:bg-primary-deep text-black border-none shadow-lg shadow-primary/20 h-12 text-lg font-bold"
                            >
                                SignUp / Login
                            </Button>
                        </Link>
                    </div>
                )}
            </header>

            <main className="flex-grow">
                <div>
                    {content}
                    {children
                        ? cloneElement(children as ReactElement, {
                            ...rest,
                        })
                        : null}
                </div>
            </main>

            <footer className="py-8 sm:py-12 border-t border-white/5 bg-gray-950">
                <div className="mx-auto px-4 sm:px-10 flex flex-col gap-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex flex-col items-center md:items-start gap-4">
                            <Logo mode="dark" imgClass="max-h-8" />
                            <p className="text-gray-400 text-sm max-w-xs text-center md:text-left">
                                The ultimate workstation for Minecraft creators. Professional 3D rendering in your browser.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 sm:flex items-start gap-10 sm:gap-20">
                            <div className="flex flex-col gap-4">
                                <h4 className="text-white font-bold text-sm uppercase tracking-widest">Platform</h4>
                                <Link to="/home" className="text-gray-400 hover:text-primary text-sm transition-colors font-medium">Explore</Link>
                                <Link to="/pose-lab" className="text-gray-400 hover:text-primary text-sm transition-colors font-medium">Pose Lab</Link>
                            </div>
                            <div className="flex flex-col gap-4">
                                <h4 className="text-white font-bold text-sm uppercase tracking-widest">Company</h4>
                                <Link to="/about" className="text-gray-400 hover:text-primary text-sm transition-colors font-medium">About</Link>
                                <Link to="/join-us" className="text-gray-400 hover:text-primary text-sm transition-colors font-medium">Join Us</Link>
                                <Link to="/services" className="text-gray-400 hover:text-primary text-sm transition-colors font-medium">Services</Link>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                            <div className="text-gray-500 text-xs font-bold uppercase tracking-widest text-center md:text-left">
                                © {new Date().getFullYear()} Pose Lab. All rights reserved.
                            </div>
                            <div className="flex items-center gap-6">
                                <Link to="/privacy-policy" className="text-[10px] font-black text-gray-600 hover:text-white transition-colors uppercase tracking-[0.2em]">
                                    Privacy
                                </Link>
                                <Link to="/terms-of-service" className="text-[10px] font-black text-gray-600 hover:text-white transition-colors uppercase tracking-[0.2em]">
                                    Terms
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-tighter">
                            <span>Created with</span>
                            <span className="text-red-500 animate-pulse text-base">❤️</span>
                            <span>by</span>
                            <a
                                href="https://nexiotech.cloud/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-white transition-all duration-300 underline decoration-primary/30 underline-offset-4"
                            >
                                Nexio Technologies
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Simple