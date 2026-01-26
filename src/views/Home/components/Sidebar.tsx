import { Link } from 'react-router-dom'
import {
    Box,
    TrendingUp,
    Trophy
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'

interface SidebarProps {
    challenges: any[]
}

const Sidebar = ({ challenges }: SidebarProps) => {
    return (
        <div className="hidden lg:block space-y-8 sticky top-36 h-fit">
            {/* Model Library Project Card */}
            <motion.div
                whileHover={{ y: -5 }}
                className="p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-purple-700 border border-white/10 shadow-[0_20px_50px_rgba(79,70,229,0.3)] overflow-hidden relative group"
            >
                <div className="relative z-10">
                    <Box className="w-12 h-12 text-white mb-6 group-hover:rotate-12 transition-transform duration-500" />
                    <h3 className="text-2xl font-black tracking-tighter leading-tight mb-4 text-white">
                        Master the <span className="italic text-primary-foreground">Standard</span> Rig System
                    </h3>
                    <p className="text-[11px] text-white/70 font-medium mb-8 leading-relaxed">
                        Deploy our new rigid-body physics for pixel-perfect stability in every single render.
                    </p>
                    <Button asChild className="w-full bg-white text-black font-black uppercase tracking-widest text-[10px] h-12 rounded-2xl shadow-xl hover:bg-gray-100 transition-all">
                        <Link to="/3d-viewer">Explore Now</Link>
                    </Button>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-white/10 blur-[80px] rounded-full" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-48 h-48 bg-primary/20 blur-[80px] rounded-full" />
            </motion.div>

            {/* Trending Challenges */}
            {/* <div className="p-7 rounded-[2.5rem] bg-gray-900/40 border border-white/5 backdrop-blur-xl shadow-xl">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                        <TrendingUp className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Live Challenges</h4>
                        <p className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter">Updated hourly</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {challenges.map((challenge, index) => (
                        <motion.div
                            key={challenge.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between group cursor-pointer p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-gray-700 group-hover:text-primary transition-colors">0{index + 1}</span>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-white group-hover:text-primary transition-colors">#{challenge.name}</p>
                                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">{challenge.entries} Poses</p>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-600 group-hover:bg-primary group-hover:text-black transition-all group-hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]">
                                <Trophy className="w-3.5 h-3.5" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                <Button variant="outline" className="w-full mt-8 bg-white/5 border-white/5 text-gray-400 font-black uppercase tracking-widest text-[10px] h-11 rounded-2xl hover:text-white hover:bg-white/10 transition-all">
                    View All Events
                </Button>
            </div> */}

            {/* Footer */}
            <div className="space-y-6 px-4">
                <div className="pt-4 border-t border-white/20">
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">© 2026 PoseLab Collective</p>
                    <p className="text-[8px] font-bold text-success/70 uppercase mt-1">Built with passion for the Minecraft community</p>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
