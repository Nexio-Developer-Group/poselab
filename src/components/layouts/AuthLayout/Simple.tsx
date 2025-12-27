import { cloneElement } from 'react'
import type { ReactNode, ReactElement } from 'react'
import type { CommonProps } from '@/@types/common'
import heroImage from "@/assets/images/login.png";
import { Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import Logo from '@/components/template/Logo';

interface SimpleProps extends CommonProps {
    content?: ReactNode
}

const Simple = ({ children, content, ...rest }: SimpleProps) => {
    return (
        <div className="h-screen w-full bg-gray-950 text-gray-100 overflow-hidden">
            <div className="flex h-full w-full flex-col md:flex-row shadow-2xl">


                <Link to="/" className="absolute top-8 right-8 z-50 group">
                    <span className='flex items-center gap-3 text-xs font-bold bg-white/5 border border-white/10 p-3 px-6 rounded-2xl text-white hover:bg-white/10 backdrop-blur-md transition-all duration-300'>
                        <Home className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                        <span className="tracking-widest uppercase">BACK TO LOBBY</span>
                    </span>
                </Link>

                {/* Left Side (Cinematic Image Side) */}
                <div className="hidden md:block relative w-full md:w-[65%] h-full">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale-[0.2] transition-transform duration-1000 group-hover:scale-110"
                        style={{
                            backgroundImage: `url(${heroImage})`,
                            backgroundBlendMode: 'overlay',
                        }}
                    >
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-gray-950/80 z-0" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_45%,_#020202_95%)] z-10" />

                    {/* Premium Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-950/20 to-gray-950 z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent z-10" />
                    <div className="absolute bottom-16 left-16 z-20 max-w-lg">
                        <div className="flex items-center gap-2 text-primary mb-4 font-bold tracking-[0.2em] text-xs uppercase animate-fade-in">
                            <div className="w-8 h-[2px] bg-primary" />
                            Studio Grade Rendering
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tighter drop-shadow-2xl">
                            Unlock Your <br /> Creative Potential
                        </h1>
                    </div>
                </div>

                {/* Right Side (Auth Content) */}
                <div className="w-full md:w-[50%] h-full flex items-center justify-center p-6 sm:p-12 bg-gray-950 relative overflow-hidden">

                    <div className="w-full max-w-2xl  relative p-6 sm:p-12 z-10">
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
