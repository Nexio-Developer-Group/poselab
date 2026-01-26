import { motion } from 'framer-motion'
import { Plus, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

interface HeaderProps {
    count: number
}

const Header = ({ count }: HeaderProps) => {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.3em] mb-2"
                >
                    <Zap className="w-3 h-3 fill-primary" />
                    Studio Dashboard
                </motion.div>
                <h1 className="text-5xl font-black text-white tracking-tighter">
                    My <span className="text-primary italic">Creations</span>
                </h1>
                <p className="text-gray-500 mt-2 font-medium">
                    Manage and showcase your high-fidelity renders and poses.
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                        {count} items
                    </span>
                </p>
            </div>

            <Link
                to="/pose-lab"
                className="group relative flex items-center gap-2 px-8 py-4 bg-primary text-black rounded-xl font-bold uppercase tracking-widest text-xs transition-all hover:bg-white hover:text-black overflow-hidden"
            >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                Launch Pose Lab
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
        </div>
    )
}

export default Header
